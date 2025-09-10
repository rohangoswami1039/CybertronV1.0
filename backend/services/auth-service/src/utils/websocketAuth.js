const jwt = require('jsonwebtoken');
const { logger } = require('../middleware/logger');
const authService = require('../services/authService');

/**
 * WebSocket Authentication Middleware
 * Validates JWT tokens for WebSocket connections
 */
const authenticateWebSocket = async (socket, next) => {
  try {
    // Get token from handshake
    const token = socket.handshake.auth.token || 
                  socket.handshake.headers.authorization?.replace('Bearer ', '') ||
                  socket.handshake.query.token;
    
    if (!token) {
      return next(new Error('Authentication token required'));
    }
    
    // Verify token using auth service
    const decoded = authService.verifyToken(token);
    
    // Set user information on socket
    socket.userId = decoded.id;
    socket.userEmail = decoded.email;
    socket.userPhoneNumber = decoded.phoneNumber;
    socket.userFirebaseUid = decoded.firebaseUid;
    socket.userPlanType = decoded.planType;
    socket.userAvailableTokens = decoded.availableTokens;
    socket.userTotalTokensConsumed = decoded.totalTokensConsumed;
    socket.userRole = 'user';
    
    logger.info(`WebSocket authenticated: ${decoded.id}`);
    next();
  } catch (error) {
    logger.error('WebSocket authentication failed:', error);
    next(new Error('Invalid authentication token'));
  }
};

/**
 * Validate token for external services
 * This can be used by other services to validate tokens
 */
const validateToken = (token) => {
  try {
    return authService.verifyToken(token);
  } catch (error) {
    throw new Error('Invalid token');
  }
};

/**
 * Get user info from token
 */
const getUserFromToken = (token) => {
  try {
    const decoded = authService.verifyToken(token);
    return {
      id: decoded.id,
      email: decoded.email,
      phoneNumber: decoded.phoneNumber,
      firebaseUid: decoded.firebaseUid,
      planType: decoded.planType,
      availableTokens: decoded.availableTokens,
      totalTokensConsumed: decoded.totalTokensConsumed,
      role: 'user'
    };
  } catch (error) {
    throw new Error('Invalid token');
  }
};

/**
 * Check if user has sufficient tokens
 */
const checkTokenBalance = (userId, requiredTokens = 1) => {
  // This would typically check against the database
  // For now, we'll return true - implement actual check as needed
  return true;
};

/**
 * Deduct tokens from user balance
 */
const deductTokens = async (userId, tokensUsed) => {
  // This would typically update the database
  // For now, we'll just log - implement actual deduction as needed
  logger.info(`Deducting ${tokensUsed} tokens from user ${userId}`);
  return true;
};

module.exports = {
  authenticateWebSocket,
  validateToken,
  getUserFromToken,
  checkTokenBalance,
  deductTokens
}; 