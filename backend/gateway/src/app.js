const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { logger } = require('./middleware/logger');
const { jwtParser } = require('./middleware/jwtParser');
const { firebaseAuth } = require('./middleware/firebaseAuth');
const proxyRoutes = require('./routes/proxy');
const healthRoutes = require('./routes/health');
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

// Logging middleware
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// Proxy routes BEFORE body parser
app.use('/auth', proxyRoutes.authProxy);
app.use('/chat', proxyRoutes.chatProxy);
app.use('/payment', proxyRoutes.paymentProxy);

// Body parsing middleware for non-proxied routes
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'gateway',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.use('/health', healthRoutes);

// Apollo Server setup (schema, resolvers, etc.)
// We'll set up the ApolloServer instance here, but start it in index.js
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (error) => {
    logger.error('GraphQL Error:', error);
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

module.exports = { app, apolloServer, jwtParser, firebaseAuth, expressMiddleware }; 