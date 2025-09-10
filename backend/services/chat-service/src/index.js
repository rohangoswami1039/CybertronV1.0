const { app, httpServer, startApolloServer, PORT } = require('./app');
const { logger } = require('./middleware/logger');

async function start() {
  try {
    await startApolloServer();
    httpServer.listen(PORT, () => {
      logger.info(`Chat service running on port ${PORT}`);
      logger.info(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
      logger.info(`Health check: http://localhost:${PORT}/health`);
      logger.info(`WebSocket endpoint: ws://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start chat service:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  httpServer.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  httpServer.close();
  process.exit(0);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

start(); 