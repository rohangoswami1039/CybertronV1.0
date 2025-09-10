const { gql } = require('apollo-server-express'); // or your GraphQL library

const typeDefs = gql`
# GraphQL Schema for Auth Service
# This service handles user authentication, registration, and token management

scalar DateTime
scalar JSON

# User Types
type User {
  id: ID!
  email: String!
  firstName: String!
  lastName: String!
  fullName: String!
  phone: String
  avatar: String
  isActive: Boolean!
  isEmailVerified: Boolean!
  isPhoneVerified: Boolean!
  plan: PlanType!
  tokens: Int!
  preferences: UserPreferences!
  billingInfo: BillingInfo
  lastLogin: DateTime
  signupSource: SignupSource!
  referrer: String
  createdAt: DateTime!
  updatedAt: DateTime!
}

type UserPreferences {
  language: String!
  timezone: String!
  notifications: NotificationPreferences!
  theme: ThemeType!
}

type NotificationPreferences {
  email: Boolean!
  sms: Boolean!
  push: Boolean!
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

enum PlanType {
  FREE
  PRO
  ENTERPRISE
}

enum ThemeType {
  LIGHT
  DARK
  AUTO
}

enum SignupSource {
  EMAIL
  GOOGLE
  FACEBOOK
  APPLE
  FIREBASE
}

# Authentication Types
type AuthResponse {
  user: User!
  token: String!
  refreshToken: String!
  expiresIn: Int!
}

type LoginResponse {
  success: Boolean!
  message: String!
  data: AuthResponse
  errors: [String!]
}

type RegisterResponse {
  success: Boolean!
  message: String!
  data: User
  errors: [String!]
}

type VerifyEmailResponse {
  success: Boolean!
  message: String!
  errors: [String!]
}

type ForgotPasswordResponse {
  success: Boolean!
  message: String!
  errors: [String!]
}

type ResetPasswordResponse {
  success: Boolean!
  message: String!
  errors: [String!]
}

# OTP Types
type OTPResponse {
  success: Boolean!
  message: String!
  expiresIn: Int!
  errors: [String!]
}

type VerifyOTPResponse {
  success: Boolean!
  message: String!
  data: User
  errors: [String!]
}

# Token Management Types
type TokenResponse {
  success: Boolean!
  message: String!
  currentBalance: Int!
  previousBalance: Int!
  change: Int!
  errors: [String!]
}

type TokenTransaction {
  id: ID!
  userId: ID!
  type: TransactionType!
  amount: Int!
  balanceBefore: Int!
  balanceAfter: Int!
  description: String!
  payment: PaymentInfo
  plan: PlanChangeInfo
  metadata: JSON
  serviceId: String
  serviceType: ServiceType
  status: TransactionStatus!
  processedAt: DateTime!
  createdAt: DateTime!
}

type PaymentInfo {
  provider: PaymentProvider
  transactionId: String
  amount: Float
  currency: String
  status: PaymentStatus
}

type PlanChangeInfo {
  from: PlanType
  to: PlanType
}

enum TransactionType {
  TOKEN_PURCHASE
  TOKEN_CONSUMPTION
  TOKEN_REFUND
  TOKEN_BONUS
  PLAN_UPGRADE
  PLAN_DOWNGRADE
  SUBSCRIPTION_RENEWAL
  REFERRAL_BONUS
  ADMIN_ADJUSTMENT
}

enum PaymentProvider {
  RAZORPAY
  STRIPE
  PAYPAL
  MANUAL
}

enum PaymentStatus {
  PENDING
  COMPLETED
  FAILED
  REFUNDED
}

enum TransactionStatus {
  PENDING
  COMPLETED
  FAILED
  CANCELLED
}

enum ServiceType {
  CHAT
  IMAGE_GENERATION
  AUDIO_GENERATION
  DOCUMENT_ANALYSIS
}

# Pagination Types
type PaginationInfo {
  currentPage: Int!
  totalPages: Int!
  totalItems: Int!
  itemsPerPage: Int!
  hasNextPage: Boolean!
  hasPrevPage: Boolean!
  nextPage: Int
  prevPage: Int
}

type UserList {
  users: [User!]!
  pagination: PaginationInfo!
}

type TransactionList {
  transactions: [TokenTransaction!]!
  pagination: PaginationInfo!
}

# User Statistics Types
type UserStats {
  totalTransactions: Int!
  totalTokensEarned: Int!
  totalTokensSpent: Int!
  currentBalance: Int!
}

# Input Types
input RegisterInput {
  email: String!
  password: String!
  firstName: String!
  lastName: String!
  phone: String
  signupSource: SignupSource = EMAIL
  referrer: String
  language: String = "en"
  timezone: String = "UTC"
  theme: ThemeType = LIGHT
}

input LoginInput {
  email: String!
  password: String!
}

input VerifyEmailInput {
  userId: ID!
  token: String!
}

input ForgotPasswordInput {
  email: String!
}

input ResetPasswordInput {
  userId: ID!
  token: String!
  newPassword: String!
}

input SendOTPInput {
  email: String!
  type: String = "VERIFICATION"
}

input VerifyOTPInput {
  email: String!
  otp: String!
  type: String = "VERIFICATION"
}

input UpdateProfileInput {
  firstName: String
  lastName: String
  phone: String
  avatar: String
  preferences: UserPreferencesInput
  billingInfo: BillingInfoInput
}

input UserPreferencesInput {
  language: String
  timezone: String
  notifications: NotificationPreferencesInput
  theme: ThemeType
}

input NotificationPreferencesInput {
  email: Boolean
  sms: Boolean
  push: Boolean
}

input BillingInfoInput {
  name: String
  address: AddressInput
  taxId: String
}

input AddressInput {
  line1: String
  line2: String
  city: String
  state: String
  postalCode: String
  country: String
}

input ChangePasswordInput {
  currentPassword: String!
  newPassword: String!
}

input UpdateTokensInput {
  type: TransactionType!
  amount: Int!
  description: String!
  payment: PaymentInfoInput
  plan: PlanChangeInfoInput
  metadata: JSON
  serviceId: String
  serviceType: ServiceType
}

input PaymentInfoInput {
  provider: PaymentProvider
  transactionId: String
  amount: Float
  currency: String
  status: PaymentStatus
}

input PlanChangeInfoInput {
  from: PlanType
  to: PlanType
}

input DeleteAccountInput {
  password: String!
  reason: String
}

# Queries
type Query {
  # User queries
  user(id: ID!): User
  users(
    page: Int = 1
    limit: Int = 20
    role: String
    isActive: Boolean
  ): UserList!
  
  # Current user
  me: User
  
  # Token transactions
  tokenTransactions(
    userId: ID
    page: Int = 1
    limit: Int = 20
    type: TransactionType
  ): TransactionList!
  
  # User statistics
  userStats(userId: ID): UserStats!
}

# Mutations
type Mutation {
  # Authentication mutations
  register(input: RegisterInput!): RegisterResponse!
  login(input: LoginInput!): LoginResponse!
  verifyEmail(input: VerifyEmailInput!): VerifyEmailResponse!
  forgotPassword(input: ForgotPasswordInput!): ForgotPasswordResponse!
  resetPassword(input: ResetPasswordInput!): ResetPasswordResponse!
  
  # OTP mutations
  sendOTP(input: SendOTPInput!): OTPResponse!
  verifyOTP(input: VerifyOTPInput!): VerifyOTPResponse!
  
  # Profile mutations
  updateProfile(input: UpdateProfileInput!): UpdateProfileResponse!
  changePassword(input: ChangePasswordInput!): ChangePasswordResponse!
  
  # Token mutations
  updateTokens(input: UpdateTokensInput!): TokenResponse!
  
  # Token refresh
  refreshToken(refreshToken: String!): RefreshTokenResponse!
  
  # Account management
  logout: LogoutResponse!
  deleteAccount(input: DeleteAccountInput!): DeleteAccountResponse!
}

# Response Types
type UpdateProfileResponse {
  success: Boolean!
  message: String!
  data: User
  errors: [String!]
}

type ChangePasswordResponse {
  success: Boolean!
  message: String!
  errors: [String!]
}

type RefreshTokenResponse {
  success: Boolean!
  message: String!
  data: AuthResponse
  errors: [String!]
}

type LogoutResponse {
  success: Boolean!
  message: String!
  errors: [String!]
}

type DeleteAccountResponse {
  success: Boolean!
  message: String!
  errors: [String!]
} 
`;

module.exports = { typeDefs };