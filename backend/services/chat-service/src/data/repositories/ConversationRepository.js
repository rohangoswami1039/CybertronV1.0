const { Conversation } = require('../models/Conversation');
const { logger } = require('../../middleware/logger');

class ConversationRepository {
  async create(conversationData) {
    return await new Conversation(conversationData).save();
  }

  async findById(conversationId) {
    return await Conversation.findById(conversationId);
  }

  async find(query, options = {}) {
    logger.debug('ConversationRepository.find called', { query, options });
    let mongooseQuery = Conversation.find(query);
    if (options.sort) mongooseQuery = mongooseQuery.sort(options.sort);
    if (options.skip) mongooseQuery = mongooseQuery.skip(options.skip);
    if (options.limit) mongooseQuery = mongooseQuery.limit(options.limit);
    return await mongooseQuery;
  }

  async countDocuments(query) {
    logger.debug('ConversationRepository.countDocuments called', { query });
    return await Conversation.countDocuments(query);
  }

  async updateById(conversationId, updateData) {
    return await Conversation.findByIdAndUpdate(conversationId, updateData, { new: true });
  }
}

module.exports = new ConversationRepository(); 