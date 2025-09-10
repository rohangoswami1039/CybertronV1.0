let jwt;
let axios;

// Try to require dependencies, but don't fail if they're not available
try {
  jwt = require('jsonwebtoken');
} catch (error) {
  console.warn('jsonwebtoken not available in shared utils, will use auth service validation only');
}

try {
  axios = require('axios');
} catch (error) {
  console.warn('axios not available in shared utils, will use local validation only');
}

/**
 * Shared Token Validation Utility
 * Provides consistent token validation across all services
 */
class TokenValidator {
  constructor() {
    this.authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:8001';
    this.jwtSecret = process.env.JWT_SECRET || 'dev-secret';
  }

  /**
   * Validate JWT token locally
   */
  validateTokenLocally(token) {
    if (!jwt) {
      return {
        valid: false,
        error: 'JWT library not available for local validation'
      };
    }

    try {
      const decoded = jwt.verify(token, this.jwtSecret);
      return {
        valid: true,
        user: {
          id: decoded.id,
          email: decoded.email,
          phoneNumber: decoded.phoneNumber,
          firebaseUid: decoded.firebaseUid,
          planType: decoded.planType,
          availableTokens: decoded.availableTokens,
          totalTokensConsumed: decoded.totalTokensConsumed,
          role: 'user'
        }
      };
    } catch (error) {
      return {
        valid: false,
        error: error.message
      };
    }
  }

  /**
   * Validate token with auth service
   */
  async validateTokenWithAuthService(token) {
    if (!axios) {
      return {
        valid: false,
        error: 'HTTP client not available for auth service validation'
      };
    }

    try {
      const response = await axios.post(`${this.authServiceUrl}/graphql`, {
        query: `
          query {
            me {
              id
              email
              phoneNumber
              displayName
              planType
              availableTokens
              totalTokensConsumed
              isActive
            }
          }
        `,
        variables: {}
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        timeout: 5000
      });

      if (response.data && response.data.data && response.data.data.me) {
        return {
          valid: true,
          user: response.data.data.me
        };
      } else {
        return {
          valid: false,
          error: 'Invalid token or user not found'
        };
      }
    } catch (error) {
      return {
        valid: false,
        error: error.message
      };
    }
  }

  /**
   * Validate token (tries local first, then auth service)
   */
  async validateToken(token, useAuthService = false) {
    if (!token) {
      return {
        valid: false,
        error: 'No token provided'
      };
    }

    // Try local validation first
    const localResult = this.validateTokenLocally(token);
    if (localResult.valid) {
      return localResult;
    }

    // If local validation fails and auth service is requested, try auth service
    if (useAuthService) {
      return await this.validateTokenWithAuthService(token);
    }

    return localResult;
  }

  /**
   * Check if user has sufficient tokens
   */
  async checkTokenBalance(token, requiredTokens = 1) {
    if (!axios) {
      return {
        hasSufficientTokens: false,
        availableTokens: 0,
        requiredTokens: requiredTokens,
        error: 'HTTP client not available'
      };
    }

    try {
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      console.debug('[tokenValidator] checkTokenBalance - token:', token);
      console.debug('[tokenValidator] checkTokenBalance - headers:', headers);
      const response = await axios.post(`${this.authServiceUrl}/graphql`, {
        query: `
          query {
            me {
              availableTokens
              totalTokensConsumed
            }
          }
        `,
        variables: {}
      }, {
        headers,
        timeout: 5000
      });

      if (response.data && response.data.data && response.data.data.me) {
        const user = response.data.data.me;
        return {
          hasSufficientTokens: user.availableTokens >= requiredTokens,
          availableTokens: user.availableTokens,
          requiredTokens: requiredTokens
        };
      }

      return {
        hasSufficientTokens: false,
        availableTokens: 0,
        requiredTokens: requiredTokens
      };
    } catch (error) {
      return {
        hasSufficientTokens: false,
        availableTokens: 0,
        requiredTokens: requiredTokens,
        error: error.message
      };
    }
  }

  /**
   * Deduct tokens from user balance
   */
  async deductTokens(token, tokensUsed) {
    if (!axios) {
      return {
        success: false,
        message: 'HTTP client not available'
      };
    }

    try {
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      console.debug('[tokenValidator] deductTokens - token:', token);
      console.debug('[tokenValidator] deductTokens - headers:', headers);
      const response = await axios.post(`${this.authServiceUrl}/graphql`, {
        query: `
          mutation DeductTokens($tokensUsed: Int!) {
            deductTokens(tokensUsed: $tokensUsed) {
              success
              message
              user {
                availableTokens
                totalTokensConsumed
              }
            }
          }
        `,
        variables: { tokensUsed }
      }, {
        headers,
        timeout: 5000
      });

      if (response.data && response.data.data && response.data.data.deductTokens) {
        return response.data.data.deductTokens;
      }

      return {
        success: false,
        message: 'Failed to deduct tokens'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }

  /**
   * Extract user info from token without validation
   */
  extractUserInfo(token) {
    try {
      const decoded = jwt.decode(token);
      if (!decoded) {
        return null;
      }

      return {
        id: decoded.id,
        email: decoded.email,
        phoneNumber: decoded.phoneNumber,
        firebaseUid: decoded.firebaseUid,
        planType: decoded.planType,
        availableTokens: decoded.availableTokens,
        totalTokensConsumed: decoded.totalTokensConsumed
      };
    } catch (error) {
      return null;
    }
  }
}

module.exports = new TokenValidator(); 