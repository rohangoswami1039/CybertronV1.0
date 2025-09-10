// Environment configuration
require('dotenv').config({ path: '../../../.envs/chat.env' });
module.exports = {
  // Service
  PORT: process.env.PORT || 8002,
  NODE_ENV: process.env.NODE_ENV || 'development',

  // Database
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/cybertron-chat',
  MONGODB_OPTIONS_MAX_POOL_SIZE: parseInt(process.env.MONGODB_OPTIONS_MAX_POOL_SIZE) || 10,
  MONGODB_OPTIONS_SERVER_SELECTION_TIMEOUT_MS: parseInt(process.env.MONGODB_OPTIONS_SERVER_SELECTION_TIMEOUT_MS) || 5000,

  // Google Gemini AI
  GOOGLE_AI_API_KEY: process.env.GOOGLE_AI_API_KEY,
  AI_MODEL: process.env.AI_MODEL || 'gemini-1.5-pro',
  AI_MAX_TOKENS: parseInt(process.env.AI_MAX_TOKENS) || 1000,
  AI_TEMPERATURE: parseFloat(process.env.AI_TEMPERATURE) || 0.7,

  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  LOG_FORMAT: process.env.LOG_FORMAT || 'combined',

  // Health Check
  HEALTH_CHECK_INTERVAL: parseInt(process.env.HEALTH_CHECK_INTERVAL) || 30000,

  // WebSocket
  WS_PORT: process.env.WS_PORT || 4004,
  WS_PATH: process.env.WS_PATH || '/ws',

  // File Upload
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE) || 10485760,
  ALLOWED_FILE_TYPES: process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/gif,audio/mpeg,audio/wav,text/plain',

  // Caching
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  CACHE_TTL: parseInt(process.env.CACHE_TTL) || 3600,

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,

  // Message/Conversation
  MAX_MESSAGE_LENGTH: parseInt(process.env.MAX_MESSAGE_LENGTH) || 4000,
  MAX_CONVERSATION_LENGTH: parseInt(process.env.MAX_CONVERSATION_LENGTH) || 100,
  MESSAGE_RETENTION_DAYS: parseInt(process.env.MESSAGE_RETENTION_DAYS) || 30
}; 