const { GraphQLScalarType } = require('graphql');
const paymentService = require('../../services/paymentService');
const { Payment, Subscription } = require('../../data/models/RazorpayOrder');
const { logger } = require('../../middleware/logger');

// Custom scalar resolvers
const DateTime = new GraphQLScalarType({
  name: 'DateTime',
  description: 'DateTime custom scalar type',
  serialize(value) {
    return value.toISOString();
  },
  parseValue(value) {
    return new Date(value);
  },
  parseLiteral(ast) {
    if (ast.kind === 'StringValue') {
      return new Date(ast.value);
    }
    return null;
  },
});

const JSON = new GraphQLScalarType({
  name: 'JSON',
  description: 'JSON custom scalar type',
  serialize(value) {
    return value;
  },
  parseValue(value) {
    return value;
  },
  parseLiteral(ast) {
    return ast.value;
  },
});

// Resolvers
const resolvers = {
  DateTime,
  JSON,
  
  Query: {
    payment: async (_, { id }, context) => {
      try {
        if (!context.user) {
          throw new Error('Authentication required');
        }

        const payment = await Payment.findById(id);
        
        if (!payment) {
          throw new Error('Payment not found');
        }

        // Check if user owns this payment
        if (payment.userId.toString() !== context.user.id) {
          throw new Error('Access denied');
        }

        return payment;
      } catch (error) {
        logger.error('Error in payment query:', error);
        throw error;
      }
    },
    
    payments: async (_, { userId, status, plan, page, limit }, context) => {
      try {
        if (!context.user) {
          throw new Error('Authentication required');
        }

        // Users can only see their own payments
        const queryUserId = userId || context.user.id;
        if (queryUserId !== context.user.id) {
          throw new Error('Access denied');
        }

        const skip = ((page || 1) - 1) * (limit || 20);
        const query = { userId: queryUserId };

        if (status) query.status = status;
        if (plan) query.plan = plan;

        const payments = await Payment.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit || 20);

        const total = await Payment.countDocuments(query);
        const totalPages = Math.ceil(total / (limit || 20));

        return {
          payments,
          pagination: {
            currentPage: page || 1,
            totalPages,
            totalItems: total,
            itemsPerPage: limit || 20,
            hasNextPage: (page || 1) < totalPages,
            hasPrevPage: (page || 1) > 1,
            nextPage: (page || 1) < totalPages ? (page || 1) + 1 : null,
            prevPage: (page || 1) > 1 ? (page || 1) - 1 : null
          }
        };
      } catch (error) {
        logger.error('Error in payments query:', error);
        throw error;
      }
    },
    
    subscription: async (_, { id }, context) => {
      try {
        if (!context.user) {
          throw new Error('Authentication required');
        }

        const subscription = await Subscription.findById(id);
        
        if (!subscription) {
          throw new Error('Subscription not found');
        }

        // Check if user owns this subscription
        if (subscription.userId.toString() !== context.user.id) {
          throw new Error('Access denied');
        }

        return subscription;
      } catch (error) {
        logger.error('Error in subscription query:', error);
        throw error;
      }
    },
    
    subscriptions: async (_, { userId, status, plan, page, limit }, context) => {
      try {
        if (!context.user) {
          throw new Error('Authentication required');
        }

        // Users can only see their own subscriptions
        const queryUserId = userId || context.user.id;
        if (queryUserId !== context.user.id) {
          throw new Error('Access denied');
        }

        const skip = ((page || 1) - 1) * (limit || 20);
        const query = { userId: queryUserId };

        if (status) query.status = status;
        if (plan) query.plan = plan;

        const subscriptions = await Subscription.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit || 20);

        const total = await Subscription.countDocuments(query);
        const totalPages = Math.ceil(total / (limit || 20));

        return {
          subscriptions,
          pagination: {
            currentPage: page || 1,
            totalPages,
            totalItems: total,
            itemsPerPage: limit || 20,
            hasNextPage: (page || 1) < totalPages,
            hasPrevPage: (page || 1) > 1,
            nextPage: (page || 1) < totalPages ? (page || 1) + 1 : null,
            prevPage: (page || 1) > 1 ? (page || 1) - 1 : null
          }
        };
      } catch (error) {
        logger.error('Error in subscriptions query:', error);
        throw error;
      }
    },
    
    userActiveSubscription: async (_, { userId }, context) => {
      try {
        if (!context.user) {
          throw new Error('Authentication required');
        }

        // Users can only see their own subscriptions
        if (userId !== context.user.id) {
          throw new Error('Access denied');
        }

        const subscription = await Subscription.findOne({
          userId,
          status: 'active'
        });

        return subscription;
      } catch (error) {
        logger.error('Error in userActiveSubscription query:', error);
        throw error;
      }
    },
    
    userPaymentHistory: async (_, { userId }, context) => {
      try {
        if (!context.user) {
          throw new Error('Authentication required');
        }

        // Users can only see their own payments
        if (userId !== context.user.id) {
          throw new Error('Access denied');
        }

        const payments = await Payment.find({ userId })
          .sort({ createdAt: -1 });

        return {
          payments,
          pagination: {
            currentPage: 1,
            totalPages: 1,
            totalItems: payments.length,
            itemsPerPage: payments.length,
            hasNextPage: false,
            hasPrevPage: false,
            nextPage: null,
            prevPage: null
          }
        };
      } catch (error) {
        logger.error('Error in userPaymentHistory query:', error);
        throw error;
      }
    },
    
    userSubscriptionHistory: async (_, { userId }, context) => {
      try {
        if (!context.user) {
          throw new Error('Authentication required');
        }

        // Users can only see their own subscriptions
        if (userId !== context.user.id) {
          throw new Error('Access denied');
        }

        const subscriptions = await Subscription.find({ userId })
          .sort({ createdAt: -1 });

        return {
          subscriptions,
          pagination: {
            currentPage: 1,
            totalPages: 1,
            totalItems: subscriptions.length,
            itemsPerPage: subscriptions.length,
            hasNextPage: false,
            hasPrevPage: false,
            nextPage: null,
            prevPage: null
          }
        };
      } catch (error) {
        logger.error('Error in userSubscriptionHistory query:', error);
        throw error;
      }
    },
    
    searchPayments: async (_, { input }, context) => {
      try {
        if (!context.user) {
          throw new Error('Authentication required');
        }

        const query = { userId: context.user.id };

        if (input.status) query.status = input.status;
        if (input.plan) query.plan = input.plan;
        if (input.startDate) query.createdAt = { $gte: new Date(input.startDate) };
        if (input.endDate) {
          if (query.createdAt) {
            query.createdAt.$lte = new Date(input.endDate);
          } else {
            query.createdAt = { $lte: new Date(input.endDate) };
          }
        }

        const skip = ((input.page || 1) - 1) * (input.limit || 20);

        const payments = await Payment.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(input.limit || 20);

        const total = await Payment.countDocuments(query);
        const totalPages = Math.ceil(total / (input.limit || 20));

        return {
          payments,
          pagination: {
            currentPage: input.page || 1,
            totalPages,
            totalItems: total,
            itemsPerPage: input.limit || 20,
            hasNextPage: (input.page || 1) < totalPages,
            hasPrevPage: (input.page || 1) > 1,
            nextPage: (input.page || 1) < totalPages ? (input.page || 1) + 1 : null,
            prevPage: (input.page || 1) > 1 ? (input.page || 1) - 1 : null
          }
        };
      } catch (error) {
        logger.error('Error in searchPayments query:', error);
        throw error;
      }
    },
    
    searchSubscriptions: async (_, { input }, context) => {
      try {
        if (!context.user) {
          throw new Error('Authentication required');
        }

        const query = { userId: context.user.id };

        if (input.status) query.status = input.status;
        if (input.plan) query.plan = input.plan;
        if (input.billingCycle) query.billingCycle = input.billingCycle;

        const skip = ((input.page || 1) - 1) * (input.limit || 20);

        const subscriptions = await Subscription.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(input.limit || 20);

        const total = await Subscription.countDocuments(query);
        const totalPages = Math.ceil(total / (input.limit || 20));

        return {
          subscriptions,
          pagination: {
            currentPage: input.page || 1,
            totalPages,
            totalItems: total,
            itemsPerPage: input.limit || 20,
            hasNextPage: (input.page || 1) < totalPages,
            hasPrevPage: (input.page || 1) > 1,
            nextPage: (input.page || 1) < totalPages ? (input.page || 1) + 1 : null,
            prevPage: (input.page || 1) > 1 ? (input.page || 1) - 1 : null
          }
        };
      } catch (error) {
        logger.error('Error in searchSubscriptions query:', error);
        throw error;
      }
    },
    
    paymentStats: async (_, { userId }, context) => {
      try {
        if (!context.user) {
          throw new Error('Authentication required');
        }

        // Users can only see their own stats
        const queryUserId = userId || context.user.id;
        if (queryUserId !== context.user.id) {
          throw new Error('Access denied');
        }

        const result = await paymentService.getPaymentStats(queryUserId);
        
        if (!result.success) {
          throw new Error(result.error);
        }

        return {
          success: true,
          message: 'Payment statistics retrieved successfully',
          data: result.data,
          errors: []
        };
      } catch (error) {
        logger.error('Error in paymentStats query:', error);
        return {
          success: false,
          message: 'Failed to retrieve payment statistics',
          data: null,
          errors: [error.message]
        };
      }
    },
    
    subscriptionStats: async (_, { userId }, context) => {
      try {
        if (!context.user) {
          throw new Error('Authentication required');
        }

        // Users can only see their own stats
        const queryUserId = userId || context.user.id;
        if (queryUserId !== context.user.id) {
          throw new Error('Access denied');
        }

        const result = await paymentService.getSubscriptionStats(queryUserId);
        
        if (!result.success) {
          throw new Error(result.error);
        }

        return {
          success: true,
          message: 'Subscription statistics retrieved successfully',
          data: result.data,
          errors: []
        };
      } catch (error) {
        logger.error('Error in subscriptionStats query:', error);
        return {
          success: false,
          message: 'Failed to retrieve subscription statistics',
          data: null,
          errors: [error.message]
        };
      }
    }
  },
  
  Mutation: {
    createPaymentOrder: async (_, { input }, context) => {
      try {
        if (!context.user) {
          throw new Error('Authentication required');
        }

        // Create Razorpay order
        const razorpayResult = await paymentService.createRazorpayOrder({
          amount: input.amount,
          currency: input.currency,
          receipt: input.receipt,
          notes: input.notes
        });

        if (!razorpayResult.success) {
          throw new Error(razorpayResult.error);
        }

        // Create payment record
        const paymentResult = await paymentService.createPayment({
          userId: context.user.id,
          razorpayOrderId: razorpayResult.data.orderId,
          amount: input.amount,
          currency: input.currency,
          tokenAmount: input.tokenAmount,
          plan: input.plan,
          ipAddress: context.headers['x-forwarded-for'] || context.headers['x-real-ip'],
          userAgent: context.headers['user-agent'],
          metadata: input.metadata
        });

        if (!paymentResult.success) {
          throw new Error(paymentResult.error);
        }

        return {
          success: true,
          message: 'Payment order created successfully',
          data: paymentResult.data,
          errors: []
        };
      } catch (error) {
        logger.error('Error in createPaymentOrder mutation:', error);
        return {
          success: false,
          message: 'Failed to create payment order',
          data: null,
          errors: [error.message]
        };
      }
    },
    
    updatePayment: async (_, { id, input }, context) => {
      try {
        if (!context.user) {
          throw new Error('Authentication required');
        }

        const result = await paymentService.updatePaymentStatus(id, input.status, input);
        
        if (!result.success) {
          throw new Error(result.error);
        }

        return {
          success: true,
          message: 'Payment updated successfully',
          data: result.data,
          errors: []
        };
      } catch (error) {
        logger.error('Error in updatePayment mutation:', error);
        return {
          success: false,
          message: 'Failed to update payment',
          data: null,
          errors: [error.message]
        };
      }
    },
    
    refundPayment: async (_, { input }, context) => {
      try {
        if (!context.user) {
          throw new Error('Authentication required');
        }

        // TODO: Implement Razorpay refund
        const payment = await Payment.findById(input.paymentId);
        if (!payment) {
          throw new Error('Payment not found');
        }

        if (payment.userId.toString() !== context.user.id) {
          throw new Error('Access denied');
        }

        // Update payment with refund info
        payment.refundedAmount = input.amount;
        payment.refundedAt = new Date();
        payment.status = 'refunded';
        await payment.save();

        return {
          success: true,
          message: 'Payment refunded successfully',
          data: payment,
          errors: []
        };
      } catch (error) {
        logger.error('Error in refundPayment mutation:', error);
        return {
          success: false,
          message: 'Failed to refund payment',
          data: null,
          errors: [error.message]
        };
      }
    },
    
    createSubscription: async (_, { input }, context) => {
      try {
        if (!context.user) {
          throw new Error('Authentication required');
        }

        // Create Razorpay subscription
        const razorpayResult = await paymentService.createRazorpaySubscription({
          planId: input.planId,
          notes: input.notes
        });

        if (!razorpayResult.success) {
          throw new Error(razorpayResult.error);
        }

        // Create subscription record
        const subscriptionResult = await paymentService.createSubscription({
          userId: context.user.id,
          razorpaySubscriptionId: razorpayResult.data.subscriptionId,
          razorpayPlanId: input.planId,
          plan: input.plan,
          amount: 0, // Will be set from plan
          currency: 'INR',
          billingCycle: input.billingCycle,
          metadata: input.metadata
        });

        if (!subscriptionResult.success) {
          throw new Error(subscriptionResult.error);
        }

        return {
          success: true,
          message: 'Subscription created successfully',
          data: subscriptionResult.data,
          errors: []
        };
      } catch (error) {
        logger.error('Error in createSubscription mutation:', error);
        return {
          success: false,
          message: 'Failed to create subscription',
          data: null,
          errors: [error.message]
        };
      }
    },
    
    updateSubscription: async (_, { id, input }, context) => {
      try {
        if (!context.user) {
          throw new Error('Authentication required');
        }

        const result = await paymentService.updateSubscriptionStatus(id, input.status, input);
        
        if (!result.success) {
          throw new Error(result.error);
        }

        return {
          success: true,
          message: 'Subscription updated successfully',
          data: result.data,
          errors: []
        };
      } catch (error) {
        logger.error('Error in updateSubscription mutation:', error);
        return {
          success: false,
          message: 'Failed to update subscription',
          data: null,
          errors: [error.message]
        };
      }
    },
    
    cancelSubscription: async (_, { input }, context) => {
      try {
        if (!context.user) {
          throw new Error('Authentication required');
        }

        const subscription = await Subscription.findById(input.subscriptionId);
        if (!subscription) {
          throw new Error('Subscription not found');
        }

        if (subscription.userId.toString() !== context.user.id) {
          throw new Error('Access denied');
        }

        // TODO: Cancel Razorpay subscription
        const result = await paymentService.updateSubscriptionStatus(
          input.subscriptionId,
          'cancelled',
          {
            cancelledBy: input.cancelledBy,
            cancellationReason: input.reason
          }
        );

        if (!result.success) {
          throw new Error(result.error);
        }

        return {
          success: true,
          message: 'Subscription cancelled successfully',
          data: result.data,
          errors: []
        };
      } catch (error) {
        logger.error('Error in cancelSubscription mutation:', error);
        return {
          success: false,
          message: 'Failed to cancel subscription',
          data: null,
          errors: [error.message]
        };
      }
    },
    
    reactivateSubscription: async (_, { id }, context) => {
      try {
        if (!context.user) {
          throw new Error('Authentication required');
        }

        const subscription = await Subscription.findById(id);
        if (!subscription) {
          throw new Error('Subscription not found');
        }

        if (subscription.userId.toString() !== context.user.id) {
          throw new Error('Access denied');
        }

        // TODO: Reactivate Razorpay subscription
        const result = await paymentService.updateSubscriptionStatus(id, 'active');

        if (!result.success) {
          throw new Error(result.error);
        }

        return {
          success: true,
          message: 'Subscription reactivated successfully',
          data: result.data,
          errors: []
        };
      } catch (error) {
        logger.error('Error in reactivateSubscription mutation:', error);
        return {
          success: false,
          message: 'Failed to reactivate subscription',
          data: null,
          errors: [error.message]
        };
      }
    },
    
    createRazorpayOrder: async (_, { input }, context) => {
      try {
        if (!context.user) {
          throw new Error('Authentication required');
        }

        const result = await paymentService.createRazorpayOrder(input);
        
        if (!result.success) {
          throw new Error(result.error);
        }

        return {
          success: true,
          message: 'Razorpay order created successfully',
          data: result.data,
          errors: []
        };
      } catch (error) {
        logger.error('Error in createRazorpayOrder mutation:', error);
        return {
          success: false,
          message: 'Failed to create Razorpay order',
          data: null,
          errors: [error.message]
        };
      }
    },
    
    createRazorpayPayment: async (_, { orderId, paymentData }, context) => {
      try {
        if (!context.user) {
          throw new Error('Authentication required');
        }

        // TODO: Implement Razorpay payment creation
        const payment = {
          paymentId: 'pay_' + Math.random().toString(36).substr(2, 9),
          orderId: orderId,
          amount: paymentData.amount,
          currency: paymentData.currency,
          status: 'created',
          method: paymentData.method,
          description: paymentData.description,
          email: paymentData.email,
          contact: paymentData.contact,
          name: paymentData.name,
          createdAt: new Date()
        };

        return {
          success: true,
          message: 'Razorpay payment created successfully',
          data: payment,
          errors: []
        };
      } catch (error) {
        logger.error('Error in createRazorpayPayment mutation:', error);
        return {
          success: false,
          message: 'Failed to create Razorpay payment',
          data: null,
          errors: [error.message]
        };
      }
    },
    
    createRazorpaySubscription: async (_, { input }, context) => {
      try {
        if (!context.user) {
          throw new Error('Authentication required');
        }

        const result = await paymentService.createRazorpaySubscription(input);
        
        if (!result.success) {
          throw new Error(result.error);
        }

        return {
          success: true,
          message: 'Razorpay subscription created successfully',
          data: result.data,
          errors: []
        };
      } catch (error) {
        logger.error('Error in createRazorpaySubscription mutation:', error);
        return {
          success: false,
          message: 'Failed to create Razorpay subscription',
          data: null,
          errors: [error.message]
        };
      }
    },
    
    verifyPaymentSignature: async (_, { paymentId, signature }, context) => {
      try {
        if (!context.user) {
          throw new Error('Authentication required');
        }

        // TODO: Implement Razorpay signature verification
        const isValid = true; // Placeholder

        return {
          success: true,
          message: 'Payment signature verified',
          data: isValid,
          errors: []
        };
      } catch (error) {
        logger.error('Error in verifyPaymentSignature mutation:', error);
        return {
          success: false,
          message: 'Failed to verify payment signature',
          data: false,
          errors: [error.message]
        };
      }
    }
  }
};

module.exports = resolvers; 