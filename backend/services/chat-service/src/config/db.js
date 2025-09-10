const mongoose = require('mongoose');
const { logger } = require('../middleware/logger');

/**
 * Connect to MongoDB
 */
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    const options = {
      maxPoolSize: parseInt(process.env.MONGODB_OPTIONS_MAX_POOL_SIZE) || 10,
      serverSelectionTimeoutMS: parseInt(process.env.MONGODB_OPTIONS_SERVER_SELECTION_TIMEOUT_MS) || 5000,
      socketTimeoutMS: 45000,
    };
    await mongoose.connect(mongoURI, options);
    
    logger.info('MongoDB connected successfully');

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    logger.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
};

/**
 * Disconnect from MongoDB
 */
const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    logger.info('MongoDB disconnected successfully');
  } catch (error) {
    logger.error('Error disconnecting from MongoDB:', error);
  }
};

module.exports = {
  connectDB,
  disconnectDB
}; 