const { app, apolloServer, jwtParser, firebaseAuth, expressMiddleware } = require('./app');
const { logger } = require('./middleware/logger');

const PORT = process.env.PORT || 8000;

async function startServer() {
  try {
    await apolloServer.start();
    app.use('/graphql', jwtParser, firebaseAuth, expressMiddleware(apolloServer, {
      context: async ({ req }) => ({
        user: req.user,
        token: req.token,
        headers: req.headers
      })
    }));

    app.listen(PORT, () => {
      logger.info(`Gateway server running on port ${PORT}`);
      logger.info(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
      logger.info(`Health check: http://localhost:${PORT}/health`);
      logger.info(`Status check: http://localhost:${PORT}/status`);
      logger.info(`Auth service proxy: http://localhost:${PORT}/auth/*`);
      logger.info(`Chat service proxy: http://localhost:${PORT}/chat/*`);
      logger.info(`Payment service proxy: http://localhost:${PORT}/payment/*`);
    });
  } catch (error) {
    logger.error('Failed to start gateway server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  await apolloServer.stop();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  await apolloServer.stop();
  process.exit(0);
});

startServer(); 