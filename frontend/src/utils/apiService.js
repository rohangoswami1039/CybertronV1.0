import axios from 'axios';

// API Gateway URL from environment variable with fallback
const API_GATEWAY_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Create axios instances for different services
const authApi = axios.create({
  baseURL: `${API_GATEWAY_URL}/auth/graphql`,
  headers: {
    'Content-Type': 'application/json',
  },
});

const conversationApi = axios.create({
  baseURL: `${API_GATEWAY_URL}/chat/graphql`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Legacy API instance for backward compatibility
const api = axios.create({
  baseURL: API_GATEWAY_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercept requests to add auth token if available
const addAuthToken = (config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

authApi.interceptors.request.use(addAuthToken);
conversationApi.interceptors.request.use(addAuthToken);
api.interceptors.request.use(addAuthToken);

// GraphQL request helper for auth service
export const authGraphqlRequest = async (query, variables = {}, requiresAuth = false) => {
  try {
    const response = await authApi.post('', {
      query,
      variables,
    });

    if (response.data.errors) {
      throw new Error(response.data.errors[0]?.message || 'GraphQL Error');
    }

    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    console.error('Auth API Request Error:', error);
    return {
      success: false,
      error: error.response?.data?.errors?.[0]?.message || error.message || 'Unknown error occurred',
    };
  }
};

// GraphQL request helper for conversation service
export const conversationGraphqlRequest = async (query, variables = {}, requiresAuth = false) => {
  try {
    const response = await conversationApi.post('', {
      query,
      variables,
    });

    if (response.data.errors) {
      throw new Error(response.data.errors[0]?.message || 'GraphQL Error');
    }

    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    console.error('Conversation API Request Error:', error);
    return {
      success: false,
      error: error.response?.data?.errors?.[0]?.message || error.message || 'Unknown error occurred',
    };
  }
};

// Legacy GraphQL request helper for backward compatibility
export const graphqlRequest = async (query, variables = {}, requiresAuth = false) => {
  console.warn('graphqlRequest is deprecated. Please use authGraphqlRequest or conversationGraphqlRequest instead.');
  return authGraphqlRequest(query, variables, requiresAuth);
};

// Auth related API calls
export const authService = {
  // Register with email/phone
  register: async (userData) => {
    const mutation = `
      mutation Register($input: UserRegistrationInput!) {
        register(input: $input) {
          user {
            firebaseUid
            email
            phoneNumber
            displayName
            planType
            availableTokens
            totalTokensConsumed
            occupation
            occupationDescription
            accountPurposes
            accountType
            selectedPlan
            planDuration
            createdAt
          }
          requiresOTP
          token
        }
      }
    `;
    return authGraphqlRequest(mutation, { input: userData });
  },

  // Exchange Firebase ID token for system token
  exchangeFirebaseToken: async (firebaseToken) => {
    const mutation = `
      mutation ExchangeFirebaseToken($token: String!) {
        exchangeFirebaseToken(token: $token) {
          token
          user {
            firebaseUid
            email
            displayName
            phoneNumber
            planType
            availableTokens
            totalTokensConsumed
          }
        }
      }
    `;
    return authGraphqlRequest(mutation, { token: firebaseToken });
  },

  // Login with email/phone and password
  login: async (credentials) => {
    const mutation = `
      mutation Login($input: UserLoginInput!) {
        login(input: $input) {
          user {
            firebaseUid
            email
            phoneNumber
            displayName
            planType
            availableTokens
            totalTokensConsumed
            lastLoginAt
          }
          requiresOTP
        }
      }
    `;
    return authGraphqlRequest(mutation, { input: credentials });
  },

  // Verify OTP
  verifyOTP: async (verificationData) => {
    const mutation = `
      mutation VerifyOTP($input: OTPVerificationInput!) {
        verifyOTP(input: $input) {
          success
          message
          token
          user {
            firebaseUid
            email
            phoneNumber
            displayName
          }
        }
      }
    `;
    return authGraphqlRequest(mutation, { input: verificationData });
  },

  // Resend OTP
  resendOTP: async (identifier, method) => {
    const mutation = `
      mutation ResendOTP($email: String, $phoneNumber: String, $method: OTPMethod!) {
        resendOTP(email: $email, phoneNumber: $phoneNumber, method: $method)
      }
    `;
    
    // Determine if identifier is email or phone
    const isEmail = /.+@.+\..+/.test(identifier);
    const variables = {
      method: isEmail ? 'EMAIL' : 'SMS',
    };
    
    if (isEmail) {
      variables.email = identifier;
    } else {
      variables.phoneNumber = identifier;
    }
    
    return authGraphqlRequest(mutation, variables);
  },

  // Logout
  logout: async () => {
    const mutation = `
      mutation Logout {
        logout
      }
    `;
    return authGraphqlRequest(mutation, {}, true);
  },

  // Get current user
  getCurrentUser: async () => {
    const query = `
      query Me {
        me {
          firebaseUid
          email
          phoneNumber
          displayName
          planType
          availableTokens
          totalTokensConsumed
          occupation
          occupationDescription
          accountPurposes
          accountType
          selectedPlan
          planDuration
          lastLoginAt
          createdAt
        }
      }
    `;
    return authGraphqlRequest(query, {}, true);
  },

  // Update profile
  updateProfile: async (displayName) => {
    const mutation = `
      mutation UpdateProfile($displayName: String) {
        updateProfile(displayName: $displayName) {
          id
          displayName
          email
          phoneNumber
          updatedAt
        }
      }
    `;
    return authGraphqlRequest(mutation, { displayName }, true);
  },

  // Create initial user (for Google sign-up)
  createInitialUser: async (userData) => {
    const mutation = `
      mutation CreateInitialUser($input: InitialUserInput!) {
        createInitialUser(input: $input) {
          user {
            email
            firebaseUid
            displayName
          }
          token
          requiresOTP
          isProfileComplete
        }
      }
    `;
    return authGraphqlRequest(mutation, { input: userData });
  },

  // Complete profile (after onboarding)
  completeProfile: async (profileData) => {
    const mutation = `
      mutation CompleteProfile($input: ProfileCompletionInput!) {
        completeProfile(input: $input) {
          user {
            email
            firebaseUid
            displayName
            occupation
            occupationDescription
            accountPurposes
            accountType
            selectedPlan
            planDuration
          }
          isProfileComplete
        }
      }
    `;
    return authGraphqlRequest(mutation, { input: profileData });
  },

  // Request password reset
  requestPasswordReset: async (email, phoneNumber) => {
    const mutation = `
      mutation RequestPasswordReset($input: RequestPasswordResetInput!) {
        requestPasswordReset(input: $input)
      }
    `;
    return authGraphqlRequest(mutation, { input: { email, phoneNumber } });
  },

  // Reset password
  resetPassword: async (email, phoneNumber, otpCode, newPassword) => {
    const mutation = `
      mutation ResetPassword($input: ResetPasswordInput!) {
        resetPassword(input: $input)
      }
    `;
    return authGraphqlRequest(mutation, { input: { email, phoneNumber, otpCode, newPassword } });
  },
};

// Export the API instances for direct use if needed
export { authApi, conversationApi, api };
export default api; 