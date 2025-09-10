const mongoose = require('mongoose');
const { baseContentSchema } = require('./baseContentModel');

/**
 * Conversation Schema - For chat conversations with AI
 */
const conversationSchema = new mongoose.Schema({
  ...baseContentSchema,
  messages: [{
    role: {
      type: String,
      enum: ['user', 'assistant', 'system'],
      required: true
    },
    content: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  lastMessageAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Create indexes for faster queries
conversationSchema.index({ userId: 1, createdAt: -1 });
conversationSchema.index({ userId: 1, isActive: 1, lastMessageAt: -1 });
conversationSchema.index({ userId: 1, isArchived: 1, createdAt: -1 });

// Create and export the model
const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = { Conversation }; 