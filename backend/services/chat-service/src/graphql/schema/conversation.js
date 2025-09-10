const { gql } = require('apollo-server-express');

const typeDefs = gql`
scalar DateTime
scalar JSON

type Conversation {
  id: ID!
  userId: ID!
  title: String!
  prompt: String
  settings: JSON
  tokensConsumed: Int!
  status: String!
  errorMessage: String
  isArchived: Boolean!
  metadata: JSON
  isActive: Boolean!
  lastMessageAt: DateTime!
  createdAt: DateTime!
  updatedAt: DateTime!
  messages: [Message!]!
}

type Message {
  id: ID
  conversationId: ID
  role: String!
  content: String!
  timestamp: DateTime!
}

type ConversationList {
  conversations: [Conversation!]!
  pagination: PaginationInfo!
}

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

type Query {
  conversation(id: ID!): Conversation
  conversations(page: Int = 1, limit: Int = 20): ConversationList!
}

input SendMessageInput {
  conversationId: ID
  message: String!
  title: String
  prompt: String
  settings: JSON
}

type SendMessageResponse {
  success: Boolean!
  message: String!
  data: SentMessageData
  errors: [String!]
}

type SentMessageData {
  conversationId: ID!
  message: Message!
}

input UpdateConversationInput {
  title: String
  prompt: String
  settings: JSON
  status: String
  isArchived: Boolean
  metadata: JSON
}

type UpdateConversationResponse {
  success: Boolean!
  message: String!
  data: Conversation
  errors: [String!]
}

type DeleteConversationResponse {
  success: Boolean!
  message: String!
  errors: [String!]
}

type ArchiveConversationResponse {
  success: Boolean!
  message: String!
  data: Conversation
  errors: [String!]
}

type Mutation {
  sendMessage(input: SendMessageInput!): SendMessageResponse!
  updateConversation(id: ID!, input: UpdateConversationInput!): UpdateConversationResponse!
  deleteConversation(id: ID!): DeleteConversationResponse!
  archiveConversation(id: ID!): ArchiveConversationResponse!
}

# Add more types as needed for your features
`;

module.exports = { typeDefs }; 