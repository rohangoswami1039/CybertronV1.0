require("dotenv").config({ path: '../../.envs/auth.env' });
const mongoose = require("mongoose");
const { app, setupApollo } = require("./app");
const { logger } = require("./middleware/logger");
const { connectDB } = require("./data/db");

const PORT = process.env.PORT || 8001;

// Start server function with proper error handling
async function startServer() {
  try {
    // Connect to MongoDB
    await connectDB();

    // Setup Apollo Server
    await setupApollo();

    // Start Express server
    app.listen(PORT, () => {
      logger.info(`Auth service running at http://localhost:${PORT}/graphql`);
      logger.info(`Health check available at http://localhost:${PORT}/health`);
    });
  } catch (error) {
    logger.error("Failed to start auth service:", error);
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at:", promise, "reason:", reason);
  // In production, you might want to gracefully shutdown
  process.exit(1);
});

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception:", error);
  process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", async () => {
  logger.info("SIGTERM received, shutting down gracefully");

  try {
    await mongoose.connection.close();
    logger.info("MongoDB connection closed");
    process.exit(0);
  } catch (error) {
    logger.error("Error during shutdown:", error);
    process.exit(1);
  }
});

process.on("SIGINT", async () => {
  logger.info("SIGINT received, shutting down gracefully");

  try {
    await mongoose.connection.close();
    logger.info("MongoDB connection closed");
    process.exit(0);
  } catch (error) {
    logger.error("Error during shutdown:", error);
    process.exit(1);
  }
});

// Start the server
startServer(); 