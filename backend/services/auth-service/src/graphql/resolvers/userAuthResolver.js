const { logger } = require("../../middleware/logger");
const { AuthenticationError } = require("apollo-server-express");
const authService = require("../../services/authService");

const userResolvers = {
  Query: {
    // Get current authenticated user
    me: async (_, __, context) => {
      return await authService.getCurrentUser(context.user);
    },
  },

  Mutation: {
    // Authentication mutations
    register: async (_, { input }) => {
      return await authService.register(input);
    },

    createInitialUser: async (_, { input }) => {
      return await authService.createInitialUser(input);
    },

    completeProfile: async (_, { input }) => {
      return await authService.completeProfile(input);
    },

    login: async (_, { input }) => {
      return await authService.login(input);
    },

    verifyOTP: async (_, { input }) => {
      return await authService.verifyOTP(input);
    },

    resendOTP: async (_, { email, phoneNumber, method }) => {
      return await authService.resendOTP(email, phoneNumber, method);
    },

    logout: async () => {
      return await authService.logout();
    },

    // Firebase authentication
    exchangeFirebaseToken: async (_, { token }) => {
      return await authService.exchangeFirebaseToken(token);
    },

    requestPasswordReset: async (_, { input }) => {
      return await authService.requestPasswordReset(
        input.email,
        input.phoneNumber
      );
    },

    resetPassword: async (_, { input }) => {
      return await authService.resetPassword(
        input.email,
        input.phoneNumber,
        input.otpCode,
        input.newPassword
      );
    },

    // Token management
    deductTokens: async (_, { tokensUsed }, context) => {
      return await authService.deductTokens(context.user, tokensUsed);
    },
  },
};

module.exports = { userResolvers }; 