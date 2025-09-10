const mongoose = require('mongoose');

/**
 * Base Content Schema - Common fields for all content types
 */
const baseContentSchema = {
  userId: {
    type: String,
    required: true,
    index: true
  },
  title: {
    type: String,
    default: 'Untitled'
  },
  prompt: {
    type: String,
    default: ''
  },
  settings: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  tokensConsumed: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['draft', 'pending', 'completed', 'failed'],
    default: 'draft'
  },
  errorMessage: {
    type: String,
    default: null
  },
  isArchived: {
    type: Boolean,
    default: false
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
};

module.exports = { baseContentSchema }; 