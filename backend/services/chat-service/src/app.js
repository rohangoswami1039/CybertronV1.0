const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config({ path: '../../.envs/chat.env' });

const { connectDB } = require('./config/db');
const { logger } = require('./middleware/logger');
const { authMiddleware } = require('./middleware/auth');
const { typeDefs } = require('./graphql/schema/conversation.js');
const { resolvers } = require('./graphql/resolvers/index.js');
const { setupWebSocket } = require('./utils/websocket');
const config = require('./config/env');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: config.CORS_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

const PORT = config.PORT || 8002;
const CORS_ORIGIN = config.CORS_ORIGIN || 'http://localhost:5173';

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW_MS,
  max: config.RATE_LIMIT_MAX_REQUESTS,
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
    service: 'chat-service',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Create Apollo Server
const server = new ApolloServer({
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

async function startApolloServer() {
  await connectDB();
  logger.info('Connected to MongoDB');
  await server.start();
  app.use('/graphql', 
    authMiddleware,
    expressMiddleware(server, {
      context: async ({ req }) => {
        return {
          user: req.user,
          token: req.token,
          headers: req.headers,
          io: io
        };
      }
    })
  );
  setupWebSocket(io);
}

module.exports = { app, httpServer, io, startApolloServer, PORT }; 