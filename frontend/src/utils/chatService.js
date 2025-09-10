import { conversationGraphqlRequest } from './apiService';

// Chat related API calls
export const chatService = {
  // Send a message in a conversation (creates conversation if conversationId is not provided)
  sendMessage: async (input) => {
    const mutation = `
      mutation SendMessage($input: SendMessageInput!) {
        sendMessage(input: $input) {
          success
          message
          data {
            conversationId
            message { id conversationId role content timestamp }
          }
          errors
        }
      }
    `;
    return conversationGraphqlRequest(mutation, { input }, true);
  },

  // Get a single conversation by ID
  getConversationById: async (id) => {
    const query = `
      query Conversation($id: ID!) {
        conversation(id: $id) {
          id
          userId
          title
          prompt
          settings
          tokensConsumed
          status
          errorMessage
          isArchived
          metadata
          isActive
          lastMessageAt
          createdAt
          updatedAt
          messages { role content timestamp }
        }
      }
    `;
    return conversationGraphqlRequest(query, { id }, true);
  },

  // Get paginated conversations for the user
  getConversations: async (options = {}) => {
    const query = `
      query Conversations($page: Int, $limit: Int) {
        conversations(page: $page, limit: $limit) {
          conversations {
            id
            userId
            title
            prompt
            status
            isArchived
            isActive
            lastMessageAt
            createdAt
            updatedAt
            tokensConsumed
          }
          pagination {
            currentPage
            totalPages
            totalItems
            itemsPerPage
            hasNextPage
            hasPrevPage
            nextPage
            prevPage
          }
        }
      }
    `;
    const variables = {
      page: options.page || 1,
      limit: options.limit || 20
    };
    return conversationGraphqlRequest(query, variables, true);
  },

  // Create a new message in a conversation
  createMessage: async (input) => {
    const mutation = `
      mutation CreateMessage($input: CreateMessageInput!) {
        createMessage(input: $input) {
          success
          message
          data {
            id
            conversationId
            userId
            content
            type
            role
            status
            aiResponse {
              model
              tokens { prompt completion total }
              cost
              processingTime
              finishReason
            }
            attachments { filename url uploadedAt }
            metadata
            parentMessageId
            threadId
            position
            readBy { userId readAt }
            reactions { userId emoji createdAt }
            editHistory { content editedAt editedBy }
            isEdited
            isDeleted
            isPinned
            sentAt
            deliveredAt
            readAt
            createdAt
            updatedAt
          }
          errors
        }
      }
    `;
    return conversationGraphqlRequest(mutation, { input }, true);
  },

  // Get messages for a conversation
  getMessages: async (conversationId, options = {}) => {
    const query = `
      query Messages($conversationId: ID!, $page: Int, $limit: Int) {
        messages(conversationId: $conversationId, page: $page, limit: $limit) {
          messages {
            id
            userId
            content
            type
            role
            status
            aiResponse { model tokens { total } }
            createdAt
            updatedAt
          }
          pagination {
            currentPage
            totalPages
            totalItems
            itemsPerPage
            hasNextPage
            hasPrevPage
            nextPage
            prevPage
          }
        }
      }
    `;
    const variables = {
      conversationId,
      page: options.page || 1,
      limit: options.limit || 50
    };
    return conversationGraphqlRequest(query, variables, true);
  },

  // Archive a conversation
  archiveConversation: async (id) => {
    const mutation = `
      mutation ArchiveConversation($id: ID!) {
        archiveConversation(id: $id) {
          success
          message
          data { id status updatedAt }
          errors
        }
      }
    `;
    return conversationGraphqlRequest(mutation, { id }, true);
  },

  // Delete a conversation
  deleteConversation: async (id) => {
    const mutation = `
      mutation DeleteConversation($id: ID!) {
        deleteConversation(id: $id) {
          success
          message
          errors
        }
      }
    `;
    return conversationGraphqlRequest(mutation, { id }, true);
  },

  // Update conversation title or other fields
  updateConversation: async (id, input) => {
    const mutation = `
      mutation UpdateConversation($id: ID!, $input: UpdateConversationInput!) {
        updateConversation(id: $id, input: $input) {
          success
          message
          data { id title updatedAt }
          errors
        }
      }
    `;
    return conversationGraphqlRequest(mutation, { id, input }, true);
  }
};

export default chatService; 