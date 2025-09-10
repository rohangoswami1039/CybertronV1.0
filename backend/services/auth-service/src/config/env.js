const { logger } = require('../middleware/logger');

/**
 * Validate required environment variables
 */
const validateEnv = () => {
  const required = [
    'NODE_ENV',
    'PORT',
    'MONGODB_URI',
    'JWT_SECRET',
    'JWT_REFRESH_SECRET',
    'SMTP_HOST',
    'SMTP_PORT',
    'SMTP_USER',
    'SMTP_PASS',
    'SMTP_FROM',
    'FRONTEND_URL'
  ];

  const missing = [];

  required.forEach(key => {
    if (!process.env[key]) {
      missing.push(key);
    }
  });

  if (missing.length > 0) {
    logger.error('Missing required environment variables:', missing);
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  logger.info('✅ Environment variables validated');
};

/**
 * Get environment configuration
 */
const getConfig = () => {
  return {
    // Server
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: parseInt(process.env.PORT) || 8001,
    
    // Database
    MONGODB_URI: process.env.MONGODB_URI,
    
    // JWT
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
    JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    
    // Email
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: parseInt(process.env.SMTP_PORT) || 587,
    SMTP_SECURE: process.env.SMTP_SECURE === 'true',
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
    SMTP_FROM: process.env.SMTP_FROM,
    
    // Frontend
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
    
    // CORS
    CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
    
    // Rate Limiting
    RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    
    // Security
    BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS) || 12,
    
    // OTP
    OTP_EXPIRES_IN: parseInt(process.env.OTP_EXPIRES_IN) || 10 * 60 * 1000, // 10 minutes
    
    // Email Verification
    EMAIL_VERIFICATION_EXPIRES_IN: parseInt(process.env.EMAIL_VERIFICATION_EXPIRES_IN) || 24 * 60 * 60 * 1000, // 24 hours
    
    // Password Reset
    PASSWORD_RESET_EXPIRES_IN: parseInt(process.env.PASSWORD_RESET_EXPIRES_IN) || 10 * 60 * 1000, // 10 minutes
    
    // Logging
    LOG_LEVEL: process.env.LOG_LEVEL || 'info'
  };
};

/**
 * Initialize environment configuration
 */
const initConfig = () => {
  try {
    validateEnv();
    const config = getConfig();
    
    logger.info('Environment configuration loaded:', {
      NODE_ENV: config.NODE_ENV,
      PORT: config.PORT,
      MONGODB_URI: config.MONGODB_URI ? '***configured***' : 'missing',
      SMTP_HOST: config.SMTP_HOST,
      FRONTEND_URL: config.FRONTEND_URL
    });
    
    return config;
  } catch (error) {
    logger.error('Failed to initialize environment configuration:', error);
    throw error;
  }
};

module.exports = {
  validateEnv,
  getConfig,
  initConfig
}; 