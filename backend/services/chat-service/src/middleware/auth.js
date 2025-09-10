const jwt = require('jsonwebtoken');
const { logger } = require('./logger');
const tokenValidator = require('../../../../shared/utils/tokenValidator');

/**
 * Authentication middleware for GraphQL requests
 * Updated to work with the integrated auth service
 */
const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // For GraphQL, we'll allow the request to proceed but set user as null
      req.user = null;
      req.token = null;
      return next();
    }
    
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    if (!token) {
      req.user = null;
      req.token = null;
      return next();
    }
    
    try {
      // Use shared token validator
      const validationResult = await tokenValidator.validateToken(token, true);
      
      if (validationResult.valid) {
        req.user = validationResult.user;
        req.token = token;
        logger.info(`User authenticated: ${validationResult.user.id}`);
      } else {
        logger.warn(`Token validation failed: ${validationResult.error}`);
        req.user = null;
        req.token = null;
      }
      
    } catch (jwtError) {
      logger.warn(`JWT verification failed: ${jwtError.message}`);
      req.user = null;
      req.token = null;
    }
    
    next();
  } catch (error) {
    logger.error('Auth middleware error:', error);
    req.user = null;
    req.token = null;
    next();
  }
};

/**
 * Require authentication middleware
 * Use this for routes that require authentication
 */
const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: 'Authentication required',
      message: 'Please provide a valid authentication token'
    });
  }
  next();
};

/**
 * Require specific role middleware
 */
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        message: 'Please provide a valid authentication token'
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        message: 'You do not have permission to access this resource'
      });
    }
    
    next();
  };
};

/**
 * Optional authentication middleware
 * Use this for routes that work with or without authentication
 */
const optionalAuth = (req, res, next) => {
  // This middleware doesn't block requests, just sets user if available
  next();
};

module.exports = {
  authMiddleware,
  requireAuth,
  requireRole,
  optionalAuth
}; 