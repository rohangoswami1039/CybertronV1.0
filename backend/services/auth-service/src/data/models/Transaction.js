const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  // User Reference
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Transaction Details
  type: {
    type: String,
    enum: [
      'token_purchase',      // User bought tokens
      'token_consumption',   // User used tokens
      'token_refund',        // Tokens refunded
      'token_bonus',         // Bonus tokens given
      'plan_upgrade',        // Plan upgrade
      'plan_downgrade',      // Plan downgrade
      'subscription_renewal', // Subscription renewal
      'referral_bonus',      // Referral bonus
      'admin_adjustment'     // Admin adjustment
    ],
    required: true
  },
  
  // Amount
  amount: {
    type: Number,
    required: true
  },
  
  // Balance after transaction
  balanceAfter: {
    type: Number,
    required: true
  },
  
  // Balance before transaction
  balanceBefore: {
    type: Number,
    required: true
  },
  
  // Description
  description: {
    type: String,
    required: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  
  // Payment Information (for purchases)
  payment: {
    provider: {
      type: String,
      enum: ['razorpay', 'stripe', 'paypal', 'manual'],
      default: null
    },
    transactionId: {
      type: String,
      default: null
    },
    amount: {
      type: Number,
      default: null
    },
    currency: {
      type: String,
      default: 'INR'
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: null
    }
  },
  
  // Plan Information (for plan changes)
  plan: {
    from: {
      type: String,
      enum: ['free', 'pro', 'enterprise'],
      default: null
    },
    to: {
      type: String,
      enum: ['free', 'pro', 'enterprise'],
      default: null
    }
  },
  
  // Metadata
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  
  // Service Reference (for consumption tracking)
  serviceId: {
    type: String,
    default: null
  },
  
  serviceType: {
    type: String,
    enum: ['chat', 'image_generation', 'audio_generation', 'document_analysis'],
    default: null
  },
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'completed'
  },
  
  // Timestamps
  processedAt: {
    type: Date,
    default: Date.now
  },
  
  // Audit fields
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  
  // IP Address for security
  ipAddress: {
    type: String,
    default: null
  },
  
  // User Agent for security
  userAgent: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Indexes
transactionSchema.index({ userId: 1, createdAt: -1 });
transactionSchema.index({ type: 1, createdAt: -1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ 'payment.transactionId': 1 });
transactionSchema.index({ 'payment.provider': 1 });
transactionSchema.index({ serviceType: 1 });
transactionSchema.index({ createdAt: -1 });

// Virtual for net amount (positive for credits, negative for debits)
transactionSchema.virtual('netAmount').get(function() {
  const creditTypes = ['token_purchase', 'token_refund', 'token_bonus', 'referral_bonus'];
  return creditTypes.includes(this.type) ? this.amount : -this.amount;
});

// Pre-save middleware
transactionSchema.pre('save', function(next) {
  // Calculate balance after if not set
  if (this.balanceBefore !== undefined && this.amount !== undefined && this.balanceAfter === undefined) {
    const creditTypes = ['token_purchase', 'token_refund', 'token_bonus', 'referral_bonus'];
    const isCredit = creditTypes.includes(this.type);
    this.balanceAfter = this.balanceBefore + (isCredit ? this.amount : -this.amount);
  }
  
  next();
});

// Instance methods
transactionSchema.methods.isCredit = function() {
  const creditTypes = ['token_purchase', 'token_refund', 'token_bonus', 'referral_bonus'];
  return creditTypes.includes(this.type);
};

transactionSchema.methods.isDebit = function() {
  const debitTypes = ['token_consumption', 'plan_upgrade', 'plan_downgrade'];
  return debitTypes.includes(this.type);
};

transactionSchema.methods.getFormattedAmount = function() {
  const sign = this.isCredit() ? '+' : '-';
  return `${sign}${this.amount} tokens`;
};

// Static methods
transactionSchema.statics.createTokenPurchase = async function(userId, amount, paymentInfo, metadata = {}) {
  const user = await mongoose.model('User').findById(userId);
  if (!user) throw new Error('User not found');
  
  return this.create({
    userId,
    type: 'token_purchase',
    amount,
    balanceBefore: user.tokens,
    description: `Purchased ${amount} tokens`,
    payment: paymentInfo,
    metadata
  });
};

transactionSchema.statics.createTokenConsumption = async function(userId, amount, serviceType, serviceId, description, metadata = {}) {
  const user = await mongoose.model('User').findById(userId);
  if (!user) throw new Error('User not found');
  
  return this.create({
    userId,
    type: 'token_consumption',
    amount,
    balanceBefore: user.tokens,
    description,
    serviceType,
    serviceId,
    metadata
  });
};

transactionSchema.statics.createPlanChange = async function(userId, fromPlan, toPlan, amount, description, metadata = {}) {
  const user = await mongoose.model('User').findById(userId);
  if (!user) throw new Error('User not found');
  
  const type = amount > 0 ? 'plan_upgrade' : 'plan_downgrade';
  
  return this.create({
    userId,
    type,
    amount: Math.abs(amount),
    balanceBefore: user.tokens,
    description,
    plan: { from: fromPlan, to: toPlan },
    metadata
  });
};

transactionSchema.statics.getUserTransactions = async function(userId, page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  
  const transactions = await this.find({ userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('userId', 'firstName lastName email');
  
  const total = await this.countDocuments({ userId });
  
  return {
    transactions,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: limit
    }
  };
};

transactionSchema.statics.getTransactionStats = async function(userId = null, startDate = null, endDate = null) {
  const match = {};
  
  if (userId) match.userId = userId;
  if (startDate || endDate) {
    match.createdAt = {};
    if (startDate) match.createdAt.$gte = new Date(startDate);
    if (endDate) match.createdAt.$lte = new Date(endDate);
  }
  
  const stats = await this.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' },
        avgAmount: { $avg: '$amount' }
      }
    }
  ]);
  
  return stats;
};

transactionSchema.statics.getUserBalanceHistory = async function(userId, days = 30) {
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  
  return this.find({
    userId,
    createdAt: { $gte: startDate }
  })
  .sort({ createdAt: 1 })
  .select('balanceAfter createdAt type amount');
};

// Query helpers
transactionSchema.query.byUser = function(userId) {
  return this.where({ userId });
};

transactionSchema.query.byType = function(type) {
  return this.where({ type });
};

transactionSchema.query.byStatus = function(status) {
  return this.where({ status });
};

transactionSchema.query.credits = function() {
  const creditTypes = ['token_purchase', 'token_refund', 'token_bonus', 'referral_bonus'];
  return this.where({ type: { $in: creditTypes } });
};

transactionSchema.query.debits = function() {
  const debitTypes = ['token_consumption', 'plan_upgrade', 'plan_downgrade'];
  return this.where({ type: { $in: debitTypes } });
};

transactionSchema.query.recent = function(days = 30) {
  const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  return this.where({ createdAt: { $gte: startDate } });
};

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction; 