const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config({ path: '../../.envs/payment.env' });

const { connectDB } = require('./config/db');
const { logger } = require('./middleware/logger');
const { authMiddleware } = require('./middleware/auth');
const { webhookVerifier } = require('./middleware/webhookVerifier');
const { typeDefs } = require('./graphql/schema/payment.js');
const { resolvers } = require('./graphql/resolvers');

const app = express();
const PORT = process.env.PORT || 8003;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Logging middleware
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'payment-service',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Webhook endpoint for Razorpay
app.post('/webhook', webhookVerifier, async (req, res) => {
  try {
    const { event, payload } = req.body;
    
    logger.info(`Webhook received: ${event}`, { event, payload });
    
    // Handle different webhook events
    switch (event) {
      case 'payment.captured':
        await handlePaymentCaptured(payload);
        break;
      case 'payment.failed':
        await handlePaymentFailed(payload);
        break;
      case 'subscription.activated':
        await handleSubscriptionActivated(payload);
        break;
      case 'subscription.cancelled':
        await handleSubscriptionCancelled(payload);
        break;
      default:
        logger.warn(`Unhandled webhook event: ${event}`);
    }
    
    res.status(200).json({ success: true });
  } catch (error) {
    logger.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (error) => {
    logger.error('GraphQL Error:', error);
    
    // Don't expose internal errors to clients
    if (error.extensions?.code === 'INTERNAL_SERVER_ERROR') {
      return {
        message: 'Internal server error',
        code: 'INTERNAL_SERVER_ERROR'
      };
    }
    
    return error;
  },
  plugins: [
    {
      requestDidStart: async (requestContext) => {
        const startTime = Date.now();
        
        return {
          willSendResponse: async (requestContext) => {
            const endTime = Date.now();
            const duration = endTime - startTime;
            
            logger.info(`GraphQL ${requestContext.operationName || 'anonymous'} completed in ${duration}ms`);
          }
        };
      }
    }
  ]
});

// Start server
async function startServer() {
  try {
    // Connect to database
    await connectDB();
    logger.info('✅ Connected to MongoDB');

    // Start Apollo Server
    await server.start();
    
    // Apply middleware
    app.use('/graphql', 
      authMiddleware,
      expressMiddleware(server, {
        context: async ({ req }) => {
          return {
            user: req.user,
            token: req.token,
            headers: req.headers
          };
        }
      })
    );

    // Start Express server
    app.listen(PORT, () => {
      logger.info(`🚀 Payment service running on port ${PORT}`);
      logger.info(`📊 GraphQL endpoint: http://localhost:${PORT}/graphql`);
      logger.info(`🏥 Health check: http://localhost:${PORT}/health`);
      logger.info(`🔗 Webhook endpoint: http://localhost:${PORT}/webhook`);
    });

  } catch (error) {
    logger.error('Failed to start payment service:', error);
    process.exit(1);
  }
}

// Webhook handlers
async function handlePaymentCaptured(payload) {
  try {
    const { Payment } = require('../data/models/RazorpayOrder');
    const { updateUserTokens } = require('../services/paymentService');
    
    const payment = await Payment.findOne({ razorpayPaymentId: payload.payment.entity.id });
    if (payment) {
      payment.status = 'completed';
      payment.completedAt = new Date();
      await payment.save();
      
      // Update user tokens
      await updateUserTokens(payment.userId, payment.tokenAmount);
      
      logger.info(`Payment captured: ${payload.payment.entity.id}`);
    }
  } catch (error) {
    logger.error('Error handling payment captured:', error);
  }
}

async function handlePaymentFailed(payload) {
  try {
    const { Payment } = require('../data/models/RazorpayOrder');
    
    const payment = await Payment.findOne({ razorpayPaymentId: payload.payment.entity.id });
    if (payment) {
      payment.status = 'failed';
      payment.failedAt = new Date();
      payment.failureReason = payload.payment.entity.error_description;
      await payment.save();
      
      logger.info(`Payment failed: ${payload.payment.entity.id}`);
    }
  } catch (error) {
    logger.error('Error handling payment failed:', error);
  }
}

async function handleSubscriptionActivated(payload) {
  try {
    const { Subscription } = require('../data/models/RazorpayOrder');
    const { updateUserPlan } = require('../services/paymentService');
    
    const subscription = await Subscription.findOne({ razorpaySubscriptionId: payload.subscription.entity.id });
    if (subscription) {
      subscription.status = 'active';
      subscription.activatedAt = new Date();
      await subscription.save();
      
      // Update user plan
      await updateUserPlan(subscription.userId, subscription.plan);
      
      logger.info(`Subscription activated: ${payload.subscription.entity.id}`);
    }
  } catch (error) {
    logger.error('Error handling subscription activated:', error);
  }
}

async function handleSubscriptionCancelled(payload) {
  try {
    const { Subscription } = require('../data/models/RazorpayOrder');
    
    const subscription = await Subscription.findOne({ razorpaySubscriptionId: payload.subscription.entity.id });
    if (subscription) {
      subscription.status = 'cancelled';
      subscription.cancelledAt = new Date();
      await subscription.save();
      
      logger.info(`Subscription cancelled: ${payload.subscription.entity.id}`);
    }
  } catch (error) {
    logger.error('Error handling subscription cancelled:', error);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  await server.stop();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  await server.stop();
  process.exit(0);
});

// Error handling
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the server
startServer(); 