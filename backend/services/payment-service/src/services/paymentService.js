const Razorpay = require('razorpay');
const { logger } = require('../middleware/logger');
const { Payment, Subscription } = require('../data/models/RazorpayOrder');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

/**
 * Create a Razorpay order
 */
const createRazorpayOrder = async (orderData) => {
  try {
    const options = {
      amount: Math.round(orderData.amount * 100), // Convert to paise
      currency: orderData.currency || 'INR',
      receipt: orderData.receipt,
      notes: orderData.notes || {},
      partial_payment: false
    };

    const order = await razorpay.orders.create(options);
    
    logger.info(`Razorpay order created: ${order.id}`);
    return {
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount / 100, // Convert back to rupees
        currency: order.currency,
        receipt: order.receipt,
        status: order.status,
        createdAt: new Date(order.created_at * 1000)
      }
    };
  } catch (error) {
    logger.error('Error creating Razorpay order:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Create a payment record in database
 */
const createPayment = async (paymentData) => {
  try {
    const payment = new Payment({
      userId: paymentData.userId,
      razorpayOrderId: paymentData.razorpayOrderId,
      amount: paymentData.amount,
      currency: paymentData.currency,
      tokenAmount: paymentData.tokenAmount,
      plan: paymentData.plan,
      ipAddress: paymentData.ipAddress,
      userAgent: paymentData.userAgent,
      metadata: paymentData.metadata || {}
    });

    await payment.save();
    
    logger.info(`Payment record created: ${payment._id}`);
    return {
      success: true,
      data: payment
    };
  } catch (error) {
    logger.error('Error creating payment record:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Update payment status
 */
const updatePaymentStatus = async (paymentId, status, additionalData = {}) => {
  try {
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      throw new Error('Payment not found');
    }

    payment.status = status;
    
    if (status === 'completed') {
      payment.completedAt = new Date();
      payment.razorpayPaymentId = additionalData.razorpayPaymentId;
      payment.method = additionalData.method;
    } else if (status === 'failed') {
      payment.failedAt = new Date();
      payment.failureReason = additionalData.failureReason;
      payment.errorCode = additionalData.errorCode;
    }

    await payment.save();
    
    logger.info(`Payment status updated: ${paymentId} -> ${status}`);
    return {
      success: true,
      data: payment
    };
  } catch (error) {
    logger.error('Error updating payment status:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Create a Razorpay subscription
 */
const createRazorpaySubscription = async (subscriptionData) => {
  try {
    const options = {
      plan_id: subscriptionData.planId,
      customer_notify: 1,
      total_count: 0, // 0 means unlimited
      notes: subscriptionData.notes || {}
    };

    const subscription = await razorpay.subscriptions.create(options);
    
    logger.info(`Razorpay subscription created: ${subscription.id}`);
    return {
      success: true,
      data: {
        subscriptionId: subscription.id,
        planId: subscription.plan_id,
        status: subscription.status,
        currentStart: new Date(subscription.current_start * 1000),
        currentEnd: new Date(subscription.current_end * 1000),
        quantity: subscription.quantity,
        createdAt: new Date(subscription.created_at * 1000)
      }
    };
  } catch (error) {
    logger.error('Error creating Razorpay subscription:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Create a subscription record in database
 */
const createSubscription = async (subscriptionData) => {
  try {
    const subscription = new Subscription({
      userId: subscriptionData.userId,
      razorpaySubscriptionId: subscriptionData.razorpaySubscriptionId,
      razorpayPlanId: subscriptionData.razorpayPlanId,
      plan: subscriptionData.plan,
      amount: subscriptionData.amount,
      currency: subscriptionData.currency,
      billingCycle: subscriptionData.billingCycle,
      metadata: subscriptionData.metadata || {}
    });

    await subscription.save();
    
    logger.info(`Subscription record created: ${subscription._id}`);
    return {
      success: true,
      data: subscription
    };
  } catch (error) {
    logger.error('Error creating subscription record:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Update subscription status
 */
const updateSubscriptionStatus = async (subscriptionId, status, additionalData = {}) => {
  try {
    const subscription = await Subscription.findById(subscriptionId);
    if (!subscription) {
      throw new Error('Subscription not found');
    }

    subscription.status = status;
    
    if (status === 'active') {
      subscription.activatedAt = new Date();
      subscription.currentStart = additionalData.currentStart || new Date();
      subscription.currentEnd = additionalData.currentEnd;
      subscription.nextBillingAt = additionalData.nextBillingAt;
    } else if (status === 'cancelled') {
      subscription.cancelledAt = new Date();
      subscription.cancelledBy = additionalData.cancelledBy || 'user';
      subscription.cancellationReason = additionalData.cancellationReason;
    }

    await subscription.save();
    
    logger.info(`Subscription status updated: ${subscriptionId} -> ${status}`);
    return {
      success: true,
      data: subscription
    };
  } catch (error) {
    logger.error('Error updating subscription status:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Get payment statistics
 */
const getPaymentStats = async (userId = null) => {
  try {
    const match = {};
    if (userId) match.userId = userId;
    
    const stats = await Payment.aggregate([
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
    
    return {
      success: true,
      data: stats[0] || {
        totalPayments: 0,
        successfulPayments: 0,
        failedPayments: 0,
        totalAmount: 0,
        totalTokens: 0,
        avgAmount: 0
      }
    };
  } catch (error) {
    logger.error('Error getting payment stats:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Get subscription statistics
 */
const getSubscriptionStats = async (userId = null) => {
  try {
    const match = {};
    if (userId) match.userId = userId;
    
    const stats = await Subscription.aggregate([
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
    
    return {
      success: true,
      data: stats[0] || {
        totalSubscriptions: 0,
        activeSubscriptions: 0,
        cancelledSubscriptions: 0,
        totalRevenue: 0,
        avgAmount: 0
      }
    };
  } catch (error) {
    logger.error('Error getting subscription stats:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Update user tokens (placeholder - would integrate with auth service)
 */
const updateUserTokens = async (userId, tokenAmount) => {
  try {
    // TODO: Integrate with auth service to update user tokens
    logger.info(`Updating user ${userId} tokens by ${tokenAmount}`);
    return { success: true };
  } catch (error) {
    logger.error('Error updating user tokens:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Update user plan (placeholder - would integrate with auth service)
 */
const updateUserPlan = async (userId, plan) => {
  try {
    // TODO: Integrate with auth service to update user plan
    logger.info(`Updating user ${userId} plan to ${plan}`);
    return { success: true };
  } catch (error) {
    logger.error('Error updating user plan:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  createRazorpayOrder,
  createPayment,
  updatePaymentStatus,
  createRazorpaySubscription,
  createSubscription,
  updateSubscriptionStatus,
  getPaymentStats,
  getSubscriptionStats,
  updateUserTokens,
  updateUserPlan
}; 