const jwt = require('jsonwebtoken');
const { logger } = require('./logger');

/**
 * JWT Parser Middleware
 * Extracts JWT token from Authorization header and validates it
 * Updated to work with the integrated auth service
 */
const jwtParser = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      // No token provided, continue without authentication
      req.token = null;
      req.user = null;
      return next();
    }

    // Check if it's a Bearer token
    if (!authHeader.startsWith('Bearer ')) {
      logger.warn('Invalid authorization header format');
      req.token = null;
      req.user = null;
      return next();
    }

    // Extract token
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    if (!token) {
      logger.warn('No token provided in Bearer format');
      req.token = null;
      req.user = null;
      return next();
    }

    // Verify token using the same secret as auth service
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add token and user info to request
    // Updated to match the auth service token structure
    req.token = token;
    req.user = {
      id: decoded.id || decoded.userId || decoded.sub,
      email: decoded.email,
      phoneNumber: decoded.phoneNumber,
      firebaseUid: decoded.firebaseUid,
      planType: decoded.planType,
      availableTokens: decoded.availableTokens,
      totalTokensConsumed: decoded.totalTokensConsumed,
      role: decoded.role || 'user',
      plan: decoded.plan || decoded.planType,
      tokens: decoded.availableTokens
    };

    logger.debug(`JWT token validated for user: ${req.user.id}`);
    next();

  } catch (error) {
    logger.warn('JWT token validation failed:', error.message);
    
    // Token is invalid, but don't block the request
    // Let individual resolvers handle authentication requirements
    req.token = null;
    req.user = null;
    next();
  }
};

module.exports = { jwtParser }; 