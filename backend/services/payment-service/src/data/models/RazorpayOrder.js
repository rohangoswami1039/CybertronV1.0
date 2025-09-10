const mongoose = require('mongoose');

// Payment Schema
const paymentSchema = new mongoose.Schema({
  // User Reference
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Razorpay Details
  razorpayPaymentId: {
    type: String,
    unique: true,
    sparse: true
  },
  
  razorpayOrderId: {
    type: String,
    required: true
  },
  
  // Payment Details
  amount: {
    type: Number,
    required: true
  },
  
  currency: {
    type: String,
    default: 'INR'
  },
  
  // Token Purchase Details
  tokenAmount: {
    type: Number,
    required: true
  },
  
  plan: {
    type: String,
    enum: ['free', 'pro', 'enterprise'],
    required: true
  },
  
  // Payment Status
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  
  // Payment Method
  method: {
    type: String,
    default: null
  },
  
  // Timestamps
  initiatedAt: {
    type: Date,
    default: Date.now
  },
  
  completedAt: {
    type: Date,
    default: null
  },
  
  failedAt: {
    type: Date,
    default: null
  },
  
  // Error Information
  failureReason: {
    type: String,
    default: null
  },
  
  errorCode: {
    type: String,
    default: null
  },
  
  // Refund Information
  refundedAmount: {
    type: Number,
    default: 0
  },
  
  refundedAt: {
    type: Date,
    default: null
  },
  
  // Metadata
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
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

// Subscription Schema
const subscriptionSchema = new mongoose.Schema({
  // User Reference
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Razorpay Details
  razorpaySubscriptionId: {
    type: String,
    unique: true,
    sparse: true
  },
  
  razorpayPlanId: {
    type: String,
    required: true
  },
  
  // Subscription Details
  plan: {
    type: String,
    enum: ['pro', 'enterprise'],
    required: true
  },
  
  amount: {
    type: Number,
    required: true
  },
  
  currency: {
    type: String,
    default: 'INR'
  },
  
  // Billing Cycle
  billingCycle: {
    type: String,
    enum: ['monthly', 'yearly'],
    required: true
  },
  
  // Subscription Status
  status: {
    type: String,
    enum: ['created', 'active', 'cancelled', 'expired', 'paused'],
    default: 'created'
  },
  
  // Billing Information
  currentStart: {
    type: Date,
    default: null
  },
  
  currentEnd: {
    type: Date,
    default: null
  },
  
  nextBillingAt: {
    type: Date,
    default: null
  },
  
  // Timestamps
  startedAt: {
    type: Date,
    default: null
  },
  
  activatedAt: {
    type: Date,
    default: null
  },
  
  cancelledAt: {
    type: Date,
    default: null
  },
  
  expiredAt: {
    type: Date,
    default: null
  },
  
  // Cancellation Details
  cancelledBy: {
    type: String,
    enum: ['user', 'admin', 'system'],
    default: null
  },
  
  cancellationReason: {
    type: String,
    default: null
  },
  
  // Metadata
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Indexes for Payment
paymentSchema.index({ userId: 1, createdAt: -1 });
paymentSchema.index({ razorpayPaymentId: 1 });
paymentSchema.index({ razorpayOrderId: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ plan: 1 });
paymentSchema.index({ createdAt: -1 });

// Indexes for Subscription
subscriptionSchema.index({ userId: 1, createdAt: -1 });
subscriptionSchema.index({ razorpaySubscriptionId: 1 });
subscriptionSchema.index({ status: 1 });
subscriptionSchema.index({ plan: 1 });
subscriptionSchema.index({ nextBillingAt: 1 });

// Virtual for payment duration
paymentSchema.virtual('processingTime').get(function() {
  if (this.completedAt && this.initiatedAt) {
    return this.completedAt.getTime() - this.initiatedAt.getTime();
  }
  return null;
});

// Virtual for subscription duration
subscriptionSchema.virtual('duration').get(function() {
  if (this.currentStart && this.currentEnd) {
    return this.currentEnd.getTime() - this.currentStart.getTime();
  }
  return null;
});

// Instance methods for Payment
paymentSchema.methods.markAsCompleted = function(razorpayPaymentId) {
  this.status = 'completed';
  this.razorpayPaymentId = razorpayPaymentId;
  this.completedAt = new Date();
  return this.save();
};

paymentSchema.methods.markAsFailed = function(reason, code = null) {
  this.status = 'failed';
  this.failureReason = reason;
  this.errorCode = code;
  this.failedAt = new Date();
  return this.save();
};

paymentSchema.methods.refund = function(amount) {
  this.status = 'refunded';
  this.refundedAmount = amount;
  this.refundedAt = new Date();
  return this.save();
};

// Instance methods for Subscription
subscriptionSchema.methods.activate = function() {
  this.status = 'active';
  this.activatedAt = new Date();
  this.currentStart = new Date();
  
  // Set current end based on billing cycle
  const endDate = new Date();
  if (this.billingCycle === 'monthly') {
    endDate.setMonth(endDate.getMonth() + 1);
  } else {
    endDate.setFullYear(endDate.getFullYear() + 1);
  }
  this.currentEnd = endDate;
  this.nextBillingAt = endDate;
  
  return this.save();
};

subscriptionSchema.methods.cancel = function(reason = null, cancelledBy = 'user') {
  this.status = 'cancelled';
  this.cancelledAt = new Date();
  this.cancellationReason = reason;
  this.cancelledBy = cancelledBy;
  return this.save();
};

subscriptionSchema.methods.renew = function() {
  this.currentStart = this.currentEnd;
  
  // Set new end date
  const endDate = new Date(this.currentEnd);
  if (this.billingCycle === 'monthly') {
    endDate.setMonth(endDate.getMonth() + 1);
  } else {
    endDate.setFullYear(endDate.getFullYear() + 1);
  }
  this.currentEnd = endDate;
  this.nextBillingAt = endDate;
  
  return this.save();
};

// Static methods for Payment
paymentSchema.statics.findByUser = function(userId, options = {}) {
  const query = { userId };
  
  if (options.status) {
    query.status = options.status;
  }
  
  if (options.plan) {
    query.plan = options.plan;
  }
  
  return this.find(query).sort({ createdAt: -1 });
};

paymentSchema.statics.getPaymentStats = async function(userId = null) {
  const match = {};
  if (userId) match.userId = userId;
  
  const stats = await this.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        totalPayments: { $sum: 1 },
        successfulPayments: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
        failedPayments: { $sum: { $cond: [{ $eq: ['$status', 'failed'] }, 1, 0] } },
        totalAmount: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, '$amount', 0] } },
        totalTokens: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, '$tokenAmount', 0] } },
        avgAmount: { $avg: { $cond: [{ $eq: ['$status', 'completed'] }, '$amount', null] } }
      }
    }
  ]);
  
  return stats[0] || {
    totalPayments: 0,
    successfulPayments: 0,
    failedPayments: 0,
    totalAmount: 0,
    totalTokens: 0,
    avgAmount: 0
  };
};

// Static methods for Subscription
subscriptionSchema.statics.findByUser = function(userId, options = {}) {
  const query = { userId };
  
  if (options.status) {
    query.status = options.status;
  }
  
  if (options.plan) {
    query.plan = options.plan;
  }
  
  return this.find(query).sort({ createdAt: -1 });
};

subscriptionSchema.statics.getActiveSubscription = function(userId) {
  return this.findOne({
    userId,
    status: 'active'
  });
};

subscriptionSchema.statics.getSubscriptionStats = async function(userId = null) {
  const match = {};
  if (userId) match.userId = userId;
  
  const stats = await this.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        totalSubscriptions: { $sum: 1 },
        activeSubscriptions: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
        cancelledSubscriptions: { $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] } },
        totalRevenue: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, '$amount', 0] } },
        avgAmount: { $avg: '$amount' }
      }
    }
  ]);
  
  return stats[0] || {
    totalSubscriptions: 0,
    activeSubscriptions: 0,
    cancelledSubscriptions: 0,
    totalRevenue: 0,
    avgAmount: 0
  };
};

// Query helpers for Payment
paymentSchema.query.byUser = function(userId) {
  return this.where({ userId });
};

paymentSchema.query.byStatus = function(status) {
  return this.where({ status });
};

paymentSchema.query.byPlan = function(plan) {
  return this.where({ plan });
};

paymentSchema.query.recent = function(days = 30) {
  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  return this.where({ createdAt: { $gte: cutoff } });
};

// Query helpers for Subscription
subscriptionSchema.query.byUser = function(userId) {
  return this.where({ userId });
};

subscriptionSchema.query.byStatus = function(status) {
  return this.where({ status });
};

subscriptionSchema.query.byPlan = function(plan) {
  return this.where({ plan });
};

subscriptionSchema.query.active = function() {
  return this.where({ status: 'active' });
};

const Payment = mongoose.model('Payment', paymentSchema);
const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = {
  Payment,
  Subscription
}; 