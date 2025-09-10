const { gql } = require('apollo-server-express');

const typeDefs = gql`
# GraphQL Schema for Payment Service
# This service handles payments, subscriptions, and billing

scalar DateTime
scalar JSON

# Payment Types
type Payment {
  id: ID!
  userId: ID!
  razorpayPaymentId: String
  razorpayOrderId: String!
  amount: Float!
  currency: String!
  tokenAmount: Int!
  plan: PaymentPlan!
  status: PaymentStatus!
  method: String
  initiatedAt: DateTime!
  completedAt: DateTime
  failedAt: DateTime
  failureReason: String
  errorCode: String
  refundedAmount: Float!
  refundedAt: DateTime
  metadata: JSON
  ipAddress: String
  userAgent: String
  createdAt: DateTime!
  updatedAt: DateTime!
}

# Subscription Types
type Subscription {
  id: ID!
  userId: ID!
  razorpaySubscriptionId: String
  razorpayPlanId: String!
  plan: SubscriptionPlan!
  amount: Float!
  currency: String!
  billingCycle: BillingCycle!
  status: SubscriptionStatus!
  currentStart: DateTime
  currentEnd: DateTime
  nextBillingAt: DateTime
  startedAt: DateTime
  activatedAt: DateTime
  cancelledAt: DateTime
  expiredAt: DateTime
  cancelledBy: CancellationSource
  cancellationReason: String
  metadata: JSON
  createdAt: DateTime!
  updatedAt: DateTime!
}

# Plan Types
type Plan {
  id: ID!
  name: String!
  description: String!
  price: Float!
  currency: String!
  billingCycle: BillingCycle!
  features: [String!]!
  tokenLimit: Int!
  apiCalls: Int!
  isActive: Boolean!
  createdAt: DateTime!
  updatedAt: DateTime!
}

type TokenPackage {
  id: ID!
  name: String!
  description: String!
  tokenAmount: Int!
  price: Float!
  currency: String!
  isActive: Boolean!
  createdAt: DateTime!
  updatedAt: DateTime!
}

# Enums
enum PaymentPlan {
  FREE
  PRO
  ENTERPRISE
}

enum PaymentStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
  REFUNDED
}

enum SubscriptionPlan {
  PRO
  ENTERPRISE
}

enum SubscriptionStatus {
  CREATED
  ACTIVE
  CANCELLED
  EXPIRED
  PAUSED
}

enum BillingCycle {
  MONTHLY
  YEARLY
}

enum CancellationSource {
  USER
  ADMIN
  SYSTEM
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

type PaymentList {
  payments: [Payment!]!
  pagination: PaginationInfo!
}

type SubscriptionList {
  subscriptions: [Subscription!]!
  pagination: PaginationInfo!
}

type PlanList {
  plans: [Plan!]!
  pagination: PaginationInfo!
}

type TokenPackageList {
  packages: [TokenPackage!]!
  pagination: PaginationInfo!
}

# Razorpay Integration Types
type RazorpayOrderResponse {
  success: Boolean!
  message: String!
  data: RazorpayOrderData
  errors: [String!]
}

type RazorpayOrderData {
  orderId: String!
  amount: Float!
  currency: String!
  receipt: String!
  status: String!
  createdAt: DateTime!
}

type RazorpayPaymentResponse {
  success: Boolean!
  message: String!
  data: RazorpayPaymentData
  errors: [String!]
}

type RazorpayPaymentData {
  paymentId: String!
  orderId: String!
  amount: Float!
  currency: String!
  status: String!
  method: String!
  description: String!
  email: String!
  contact: String!
  name: String!
  createdAt: DateTime!
}

type RazorpaySubscriptionResponse {
  success: Boolean!
  message: String!
  data: RazorpaySubscriptionData
  errors: [String!]
}

type RazorpaySubscriptionData {
  subscriptionId: String!
  planId: String!
  status: String!
  currentStart: DateTime!
  currentEnd: DateTime!
  quantity: Int!
  createdAt: DateTime!
}

# Statistics Types
type PaymentStatsResponse {
  success: Boolean!
  message: String!
  data: PaymentStatsData
  errors: [String!]
}

type PaymentStatsData {
  totalPayments: Int!
  successfulPayments: Int!
  failedPayments: Int!
  totalAmount: Float!
  totalTokens: Int!
  avgAmount: Float!
}

type SubscriptionStatsResponse {
  success: Boolean!
  message: String!
  data: SubscriptionStatsData
  errors: [String!]
}

type SubscriptionStatsData {
  totalSubscriptions: Int!
  activeSubscriptions: Int!
  cancelledSubscriptions: Int!
  totalRevenue: Float!
  avgAmount: Float!
}

# Input Types
input CreatePaymentOrderInput {
  amount: Float!
  currency: String = "INR"
  tokenAmount: Int!
  plan: PaymentPlan!
  receipt: String!
  notes: String
  metadata: JSON
}

input CreateSubscriptionInput {
  planId: String!
  plan: SubscriptionPlan!
  billingCycle: BillingCycle!
  quantity: Int = 1
  notes: String
  metadata: JSON
}

input UpdatePaymentInput {
  status: PaymentStatus
  method: String
  failureReason: String
  errorCode: String
  metadata: JSON
}

input UpdateSubscriptionInput {
  status: SubscriptionStatus
  cancellationReason: String
  metadata: JSON
}

input RefundPaymentInput {
  paymentId: ID!
  amount: Float!
  reason: String!
  notes: String
}

input CancelSubscriptionInput {
  subscriptionId: ID!
  reason: String
  cancelledBy: CancellationSource = USER
}

input SearchPaymentsInput {
  userId: ID
  status: PaymentStatus
  plan: PaymentPlan
  startDate: DateTime
  endDate: DateTime
  page: Int = 1
  limit: Int = 20
}

input SearchSubscriptionsInput {
  userId: ID
  status: SubscriptionStatus
  plan: SubscriptionPlan
  billingCycle: BillingCycle
  page: Int = 1
  limit: Int = 20
}

# Queries
type Query {
  # Payment queries
  payment(id: ID!): Payment
  payments(
    userId: ID
    status: PaymentStatus
    plan: PaymentPlan
    page: Int = 1
    limit: Int = 20
  ): PaymentList!
  
  # Subscription queries
  subscription(id: ID!): Subscription
  subscriptions(
    userId: ID
    status: SubscriptionStatus
    plan: SubscriptionPlan
    page: Int = 1
    limit: Int = 20
  ): SubscriptionList!
  
  # Plan queries
  plan(id: ID!): Plan
  plans(
    billingCycle: BillingCycle
    isActive: Boolean = true
    page: Int = 1
    limit: Int = 20
  ): PlanList!
  
  # Token package queries
  tokenPackage(id: ID!): TokenPackage
  tokenPackages(
    isActive: Boolean = true
    page: Int = 1
    limit: Int = 20
  ): TokenPackageList!
  
  # User-specific queries
  userActiveSubscription(userId: ID!): Subscription
  userPaymentHistory(userId: ID!): PaymentList!
  userSubscriptionHistory(userId: ID!): SubscriptionList!
  
  # Search queries
  searchPayments(input: SearchPaymentsInput!): PaymentList!
  searchSubscriptions(input: SearchSubscriptionsInput!): SubscriptionList!
  
  # Statistics queries
  paymentStats(userId: ID): PaymentStatsResponse!
  subscriptionStats(userId: ID): SubscriptionStatsResponse!
}

# Mutations
type Mutation {
  # Payment mutations
  createPaymentOrder(input: CreatePaymentOrderInput!): CreatePaymentOrderResponse!
  updatePayment(id: ID!, input: UpdatePaymentInput!): UpdatePaymentResponse!
  refundPayment(input: RefundPaymentInput!): RefundPaymentResponse!
  
  # Subscription mutations
  createSubscription(input: CreateSubscriptionInput!): CreateSubscriptionResponse!
  updateSubscription(id: ID!, input: UpdateSubscriptionInput!): UpdateSubscriptionResponse!
  cancelSubscription(input: CancelSubscriptionInput!): CancelSubscriptionResponse!
  reactivateSubscription(id: ID!): ReactivateSubscriptionResponse!
  
  # Razorpay integration
  createRazorpayOrder(input: CreatePaymentOrderInput!): RazorpayOrderResponse!
  createRazorpayPayment(orderId: String!, paymentData: JSON!): RazorpayPaymentResponse!
  createRazorpaySubscription(input: CreateSubscriptionInput!): RazorpaySubscriptionResponse!
  verifyPaymentSignature(paymentId: String!, signature: String!): VerifySignatureResponse!
  
  # Plan management
  createPlan(input: CreatePlanInput!): CreatePlanResponse!
  updatePlan(id: ID!, input: UpdatePlanInput!): UpdatePlanResponse!
  deactivatePlan(id: ID!): DeactivatePlanResponse!
  
  # Token package management
  createTokenPackage(input: CreateTokenPackageInput!): CreateTokenPackageResponse!
  updateTokenPackage(id: ID!, input: UpdateTokenPackageInput!): UpdateTokenPackageResponse!
  deactivateTokenPackage(id: ID!): DeactivateTokenPackageResponse!
}

# Response Types
type CreatePaymentOrderResponse {
  success: Boolean!
  message: String!
  data: Payment
  errors: [String!]
}

type UpdatePaymentResponse {
  success: Boolean!
  message: String!
  data: Payment
  errors: [String!]
}

type RefundPaymentResponse {
  success: Boolean!
  message: String!
  data: Payment
  errors: [String!]
}

type CreateSubscriptionResponse {
  success: Boolean!
  message: String!
  data: Subscription
  errors: [String!]
}

type UpdateSubscriptionResponse {
  success: Boolean!
  message: String!
  data: Subscription
  errors: [String!]
}

type CancelSubscriptionResponse {
  success: Boolean!
  message: String!
  data: Subscription
  errors: [String!]
}

type ReactivateSubscriptionResponse {
  success: Boolean!
  message: String!
  data: Subscription
  errors: [String!]
}

type CreatePlanResponse {
  success: Boolean!
  message: String!
  data: Plan
  errors: [String!]
}

type UpdatePlanResponse {
  success: Boolean!
  message: String!
  data: Plan
  errors: [String!]
}

type DeactivatePlanResponse {
  success: Boolean!
  message: String!
  errors: [String!]
}

type CreateTokenPackageResponse {
  success: Boolean!
  message: String!
  data: TokenPackage
  errors: [String!]
}

type UpdateTokenPackageResponse {
  success: Boolean!
  message: String!
  data: TokenPackage
  errors: [String!]
}

type DeactivateTokenPackageResponse {
  success: Boolean!
  message: String!
  errors: [String!]
}

type VerifySignatureResponse {
  success: Boolean!
  message: String!
  data: Boolean
  errors: [String!]
}

# Input Types for Plans and Packages
input CreatePlanInput {
  name: String!
  description: String!
  price: Float!
  currency: String = "INR"
  billingCycle: BillingCycle!
  features: [String!]!
  tokenLimit: Int!
  apiCalls: Int!
}

input UpdatePlanInput {
  name: String
  description: String
  price: Float
  currency: String
  billingCycle: BillingCycle
  features: [String!]
  tokenLimit: Int
  apiCalls: Int
  isActive: Boolean
}

input CreateTokenPackageInput {
  name: String!
  description: String!
  tokenAmount: Int!
  price: Float!
  currency: String = "INR"
}

input UpdateTokenPackageInput {
  name: String
  description: String
  tokenAmount: Int
  price: Float
  currency: String
  isActive: Boolean
}
`;

module.exports = { typeDefs }; 