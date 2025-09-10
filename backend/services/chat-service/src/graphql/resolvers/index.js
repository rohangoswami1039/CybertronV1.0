const { conversationService } = require('../../services/chatService');
const { logger } = require('../../middleware/logger');

const resolvers = {
  Query: {
    conversation: async (_, { id }, context) => {
      if (!context.user) throw new Error('Authentication required');
      return await conversationService.getById(id, context.user.id);
    },
    conversations: async (_, { page = 1, limit = 20 }, context) => {
      if (!context.user) throw new Error('Authentication required');
      const conversations = await conversationService.getUserConversations(context.user.id, { page, limit });
        return {
        conversations,
          pagination: {
          currentPage: page,
          totalPages: 1, // Implement real pagination if needed
          totalItems: conversations.length,
          itemsPerPage: limit,
            hasNextPage: false,
            hasPrevPage: false,
            nextPage: null,
            prevPage: null
          }
        };
    }
  },
  Mutation: {
    sendMessage: async (_, { input }, context) => {
      if (!context.user) throw new Error('Authentication required');
      try {
        const result = await conversationService.sendMessage(input, context.user.id, context.io, context.token);
        logger.debug(`Context Recieved: user=${JSON.stringify(context.user)}, token=${context.token}`)
        return {
          success: true,
          message: 'Message sent successfully',
          data: {
            conversationId: result.conversation._id.toString(),
            message: {
              id: result.lastMessage.id || undefined,
              conversationId: result.conversation._id.toString(),
              role: result.lastMessage.role,
              content: result.lastMessage.content,
              timestamp: result.lastMessage.timestamp
            }
          },
          errors: []
        };
      } catch (error) {
        logger.error('Error in sendMessage:', error);
        return {
          success: false,
          message: 'Failed to send message',
          data: null,
          errors: [error.message]
        };
      }
    },
    updateConversation: async (_, { id, input }, context) => {
      if (!context.user) throw new Error('Authentication required');
      try {
        const updated = await conversationService.updateTitle(id, input.title, context.user.id);
        return {
          success: true,
          message: 'Conversation updated successfully',
          data: updated,
          errors: []
        };
      } catch (error) {
        logger.error('Error in updateConversation:', error);
        return {
          success: false,
          message: 'Failed to update conversation',
          data: null,
          errors: [error.message]
        };
      }
    },
    deleteConversation: async (_, { id }, context) => {
      if (!context.user) throw new Error('Authentication required');
      try {
        await conversationService.delete(id, context.user.id);
        return {
          success: true,
          message: 'Conversation deleted successfully',
          errors: []
        };
      } catch (error) {
        logger.error('Error in deleteConversation:', error);
        return {
          success: false,
          message: 'Failed to delete conversation',
          errors: [error.message]
        };
      }
    },
    archiveConversation: async (_, { id }, context) => {
      if (!context.user) throw new Error('Authentication required');
      try {
        const archived = await conversationService.archive(id, context.user.id);
        return {
          success: true,
          message: 'Conversation archived successfully',
          data: archived,
          errors: []
        };
      } catch (error) {
        logger.error('Error in archiveConversation:', error);
        return {
          success: false,
          message: 'Failed to archive conversation',
          data: null,
          errors: [error.message]
        };
      }
    }
  }
};

module.exports = { resolvers }; 