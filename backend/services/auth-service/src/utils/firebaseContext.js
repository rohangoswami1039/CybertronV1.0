const { firebaseService } = require("./firebase");
const { logger } = require("../middleware/logger");
const authService = require("../services/authService");

/**
 * Express middleware to authenticate requests using Firebase ID tokens
 * or custom JWT tokens
 */
const authenticateUser = async (req, res, next) => {
  try {
    // Get the authorization header
    const authHeader = req.headers.authorization || "";

    // If no auth header, continue as unauthenticated
    if (!authHeader) {
      return next();
    }

    const parts = authHeader.split(" ");

    // Check if the header is properly formatted
    if (
      parts.length !== 2 ||
      (parts[0] !== "Bearer" && parts[0] !== "Firebase")
    ) {
      return next();
    }

    const token = parts[1];

    // Try to verify as Firebase token first if Firebase is initialized
    if (firebaseService.isInitialized() && parts[0] === "Firebase") {
      try {
        const decodedToken = await firebaseService.verifyIdToken(token);
        req.user = decodedToken;
        logger.debug(`Firebase authenticated user: ${decodedToken.uid}`);
        return next();
      } catch (firebaseError) {
        logger.debug(
          `Firebase token verification failed: ${firebaseError.message}`
        );
        // Continue to try as JWT token
      }
    }

    // Try to verify as custom JWT token
    try {
      const decodedToken = authService.verifyToken(token);
      req.user = {
        id: decodedToken.id,
        email: decodedToken.email,
        phoneNumber: decodedToken.phoneNumber,
      };
      logger.debug(`JWT authenticated user: ${decodedToken.id}`);
      return next();
    } catch (jwtError) {
      logger.debug(`JWT token verification failed: ${jwtError.message}`);
      // Continue as unauthenticated
      return next();
    }
  } catch (error) {
    logger.error(`Authentication error: ${error.message}`);
    return next();
  }
};

/**
 * Apollo Server context function to pass user data to resolvers
 */
const createContext = ({ req }) => {
  return {
    user: req.user || null,
  };
};

module.exports = { authenticateUser, createContext }; 