const { gql } = require("apollo-server-express");

const authTypes = gql`
  # Custom scalar for JSON data
  scalar JSON

  type User {
    id: ID!
    firebaseUid: String
    email: String
    phoneNumber: String
    displayName: String
    avatar: String
    
    # Account Status
    isActive: Boolean!
    isEmailVerified: Boolean!
    isPhoneVerified: Boolean!
    
    # Plan & Subscription Information
    planType: PlanType!
    selectedPlan: String!
    planDuration: PlanDuration!
    paymentProvider: PaymentProvider!
    
    # Token Management
    availableTokens: Int!
    totalTokensConsumed: Int!
    
    # Profile & Occupation
    occupation: String
    occupationDescription: String
    accountPurposes: [String]
    accountType: AccountType
    
    # Billing Information
    billingInfo: BillingInfo
    
    # Security & Login
    lastLoginAt: String
    loginAttempts: Int
    isLocked: Boolean
    
    # Timestamps
    emailVerifiedAt: String
    phoneVerifiedAt: String
    createdAt: String!
    updatedAt: String!
    
    # Metadata
    signupSource: String
    referrer: String
  }

  type BillingInfo {
    name: String
    address: Address
    taxId: String
  }

  type Address {
    line1: String
    line2: String
    city: String
    state: String
    postalCode: String
    country: String
  }

  type AuthResponse {
    user: User
    token: String
    requiresOTP: Boolean
    isProfileComplete: Boolean
  }

  type ProfileCompletionResponse {
    user: User
    isProfileComplete: Boolean
  }

  type OTPVerificationResponse {
    success: Boolean!
    message: String
    token: String
    user: User
  }

  type TokenDeductionResponse {
    success: Boolean!
    message: String
    user: User
  }

  input InitialUserInput {
    firebaseUid: String!
    displayName: String
    email: String
    phoneNumber: String
  }

  input ProfileCompletionInput {
    firebaseUid: String!
    displayName: String!
    email: String
    phoneNumber: String
    occupation: String
    password: String
    occupationDescription: String
    accountPurposes: [String]
    accountType: AccountType
    selectedPlan: String
    planDuration: PlanDuration
  }

  input UserRegistrationInput {
    firebaseUid: String
    displayName: String!
    email: String
    phoneNumber: String
    password: String!
    occupation: String
    occupationDescription: String
    accountPurposes: [String]
    accountType: AccountType
    selectedPlan: String
    planDuration: PlanDuration
  }

  input UserLoginInput {
    email: String
    phoneNumber: String
    password: String!
  }

  input OTPVerificationInput {
    email: String
    phoneNumber: String
    otpCode: String!
  }

  input RequestPasswordResetInput {
    email: String
    phoneNumber: String
  }

  input ResetPasswordInput {
    email: String
    phoneNumber: String
    otpCode: String!
    newPassword: String!
  }

  enum AccountType {
    AGENCY
    COMPANY
    INDIVIDUAL
    OTHER
  }

  enum PlanDuration {
    MONTHLY
    YEARLY
  }

  enum PlanType {
    free
    pro
    enterprise
  }

  enum PaymentProvider {
    none
    stripe
    razorpay
  }

  enum OTPMethod {
    EMAIL
    SMS
  }

  type Query {
    me: User
  }

  type Mutation {
    register(input: UserRegistrationInput!): AuthResponse!
    createInitialUser(input: InitialUserInput!): AuthResponse!
    completeProfile(input: ProfileCompletionInput!): ProfileCompletionResponse!
    login(input: UserLoginInput!): AuthResponse!
    verifyOTP(input: OTPVerificationInput!): OTPVerificationResponse!
    resendOTP(email: String, phoneNumber: String, method: OTPMethod!): Boolean!
    logout: Boolean!
    exchangeFirebaseToken(token: String!): AuthResponse!
    requestPasswordReset(input: RequestPasswordResetInput!): Boolean!
    resetPassword(input: ResetPasswordInput!): Boolean!
    deductTokens(tokensUsed: Int!): TokenDeductionResponse!
  }
`;

module.exports = { typeDefs: authTypes }; 