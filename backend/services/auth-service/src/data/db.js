const mongoose = require("mongoose");
const { logger } = require("../middleware/logger");

/**
 * Connects to MongoDB using the connection string from environment variables
 */
const connectDB = async () => {
  try {
    const mongoURI =
      process.env.MONGODB_URI || "mongodb://localhost:27017/cybertron-ai";

    await mongoose.connect(mongoURI);

    logger.info("MongoDB connected successfully");

    // Handle connection events
    mongoose.connection.on("error", (err) => {
      logger.error(`MongoDB connection error: ${err}`);
    });

    mongoose.connection.on("disconnected", () => {
      logger.warn("MongoDB disconnected");
    });

    // Graceful shutdown
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      logger.info("MongoDB connection closed due to app termination");
      process.exit(0);
    });

    return mongoose.connection;
  } catch (error) {
    logger.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = { connectDB }; 