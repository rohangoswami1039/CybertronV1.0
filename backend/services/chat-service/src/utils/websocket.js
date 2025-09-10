const { logger } = require('../middleware/logger');
const tokenValidator = require('../../../../shared/utils/tokenValidator');

/**
 * Setup WebSocket connections for real-time chat
 * Updated to work with the integrated auth service
 */
const setupWebSocket = (io) => {
  // Authentication middleware for WebSocket connections
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || 
                    socket.handshake.headers.authorization?.replace('Bearer ', '') ||
                    socket.handshake.query.token;
      
      if (!token) {
        return next(new Error('Authentication token required'));
      }
      
      // Use shared token validator
      const validationResult = await tokenValidator.validateToken(token, true);
      
      if (validationResult.valid) {
        const user = validationResult.user;
        socket.userId = user.id;
        socket.userEmail = user.email;
        socket.userPhoneNumber = user.phoneNumber;
        socket.userFirebaseUid = user.firebaseUid;
        socket.userPlanType = user.planType;
        socket.userAvailableTokens = user.availableTokens;
        socket.userTotalTokensConsumed = user.totalTokensConsumed;
        socket.userRole = user.role || 'user';
        
        logger.info(`WebSocket authenticated: ${user.id}`);
        next();
      } else {
        logger.error('WebSocket authentication failed:', validationResult.error);
        next(new Error('Invalid authentication token'));
      }
    } catch (error) {
      logger.error('WebSocket authentication failed:', error);
      next(new Error('Invalid authentication token'));
    }
  });
  
  // Handle connection
  io.on('connection', (socket) => {
    logger.info(`User connected: ${socket.userId}`);
    
    // Join user's personal room
    socket.join(`user:${socket.userId}`);
    
    // Handle joining conversation rooms
    socket.on('join-conversation', (conversationId) => {
      socket.join(`conversation:${conversationId}`);
      logger.info(`User ${socket.userId} joined conversation ${conversationId}`);
    });
    
    // Handle leaving conversation rooms
    socket.on('leave-conversation', (conversationId) => {
      socket.leave(`conversation:${conversationId}`);
      logger.info(`User ${socket.userId} left conversation ${conversationId}`);
    });
    
    // Handle typing indicators
    socket.on('typing-start', (data) => {
      const { conversationId } = data;
      socket.to(`conversation:${conversationId}`).emit('user-typing', {
        userId: socket.userId,
        conversationId,
        isTyping: true
      });
    });
    
    socket.on('typing-stop', (data) => {
      const { conversationId } = data;
      socket.to(`conversation:${conversationId}`).emit('user-typing', {
        userId: socket.userId,
        conversationId,
        isTyping: false
      });
    });
    
    // Handle message reactions
    socket.on('message-reaction', (data) => {
      const { conversationId, messageId, emoji } = data;
      socket.to(`conversation:${conversationId}`).emit('message-reaction-updated', {
        messageId,
        userId: socket.userId,
        emoji,
        conversationId
      });
    });
    
    // Handle message read receipts
    socket.on('message-read', (data) => {
      const { conversationId, messageId } = data;
      socket.to(`conversation:${conversationId}`).emit('message-read-updated', {
        messageId,
        userId: socket.userId,
        conversationId
      });
    });
    
    // Handle AI response progress
    socket.on('ai-progress', (data) => {
      const { conversationId, messageId, progress } = data;
      socket.to(`conversation:${conversationId}`).emit('ai-response-progress', {
        conversationId,
        messageId,
        progress
      });
    });
    
    // Handle token balance check
    socket.on('check-token-balance', async (data) => {
      try {
        const { requiredTokens = 1 } = data;
        const balanceCheck = await tokenValidator.checkTokenBalance(socket.userId, requiredTokens);
        
        socket.emit('token-balance-update', {
          hasSufficientTokens: balanceCheck.hasSufficientTokens,
          availableTokens: balanceCheck.availableTokens,
          requiredTokens: balanceCheck.requiredTokens
        });
      } catch (error) {
        logger.error(`Token balance check failed for user ${socket.userId}:`, error);
        socket.emit('token-balance-error', { error: 'Failed to check token balance' });
      }
    });
    
    // Handle disconnection
    socket.on('disconnect', (reason) => {
      logger.info(`User disconnected: ${socket.userId}, reason: ${reason}`);
    });
    
    // Handle errors
    socket.on('error', (error) => {
      logger.error(`WebSocket error for user ${socket.userId}:`, error);
    });
  });
  
  return io;
};

/**
 * Send message to conversation room
 */
const sendToConversation = (io, conversationId, event, data) => {
  io.to(`conversation:${conversationId}`).emit(event, data);
};

/**
 * Send message to specific user
 */
const sendToUser = (io, userId, event, data) => {
  io.to(`user:${userId}`).emit(event, data);
};

/**
 * Broadcast to all connected users
 */
const broadcastToAll = (io, event, data) => {
  io.emit(event, data);
};

/**
 * Get connected users count for a conversation
 */
const getConversationUserCount = (io, conversationId) => {
  const room = io.sockets.adapter.rooms.get(`conversation:${conversationId}`);
  return room ? room.size : 0;
};

/**
 * Get all connected users for a conversation
 */
const getConversationUsers = (io, conversationId) => {
  const room = io.sockets.adapter.rooms.get(`conversation:${conversationId}`);
  if (!room) return [];
  
  const users = [];
  room.forEach(socketId => {
    const socket = io.sockets.sockets.get(socketId);
    if (socket && socket.userId) {
      users.push({
        userId: socket.userId,
        email: socket.userEmail,
        role: socket.userRole
      });
    }
  });
  
  return users;
};

module.exports = {
  setupWebSocket,
  sendToConversation,
  sendToUser,
  broadcastToAll,
  getConversationUserCount,
  getConversationUsers
}; 