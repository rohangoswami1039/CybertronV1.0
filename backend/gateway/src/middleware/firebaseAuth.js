const { logger } = require('./logger');

/**
 * Firebase Authentication Middleware
 * Validates Firebase ID tokens if provided
 * Updated to work with the integrated auth service
 */
const firebaseAuth = async (req, res, next) => {
  try {
    // Skip if no Firebase token provided
    const firebaseToken = req.headers['x-firebase-token'] || 
                         (req.headers.authorization && req.headers.authorization.startsWith('Firebase ') ? 
                          req.headers.authorization.substring(9) : null);
    
    if (!firebaseToken) {
      return next();
    }

    // If Firebase token is provided, we need to exchange it for a JWT
    // This should be done by calling the auth service
    try {
      const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:8001';
      const response = await fetch(`${authServiceUrl}/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Firebase ${firebaseToken}`
        },
        body: JSON.stringify({
          query: `
            mutation ExchangeFirebaseToken($token: String!) {
              exchangeFirebaseToken(token: $token) {
                user {
                  id
                  email
                  phoneNumber
                  displayName
                  planType
                  availableTokens
                  totalTokensConsumed
                }
                token
                requiresOTP
              }
            }
          `,
          variables: { token: firebaseToken }
        })
      });

      if (response.ok) {
        const result = await response.json();
        
        if (result.data && result.data.exchangeFirebaseToken) {
          const authData = result.data.exchangeFirebaseToken;
          
          // Set the user and token from the auth service response
          req.user = {
            id: authData.user.id,
            email: authData.user.email,
            phoneNumber: authData.user.phoneNumber,
            displayName: authData.user.displayName,
            planType: authData.user.planType,
            availableTokens: authData.user.availableTokens,
            totalTokensConsumed: authData.user.totalTokensConsumed,
            firebaseUid: authData.user.firebaseUid,
            role: 'user',
            plan: authData.user.planType,
            tokens: authData.user.availableTokens
          };
          
          req.token = authData.token;
          req.firebaseAuthenticated = true;
          
          logger.debug(`Firebase token exchanged for user: ${req.user.id}`);
        }
      }
    } catch (firebaseError) {
      logger.warn('Firebase token exchange failed:', firebaseError.message);
      // Don't block the request, just log the error
    }

    next();

  } catch (error) {
    logger.warn('Firebase authentication failed:', error.message);
    
    // Don't block the request, just log the error
    next();
  }
};

module.exports = { firebaseAuth }; 