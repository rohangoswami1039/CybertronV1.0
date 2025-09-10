const crypto = require('crypto');
const { logger } = require('./logger');

/**
 * Verify Razorpay webhook signature
 */
const webhookVerifier = (req, res, next) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    
    if (!signature) {
      logger.warn('Webhook signature missing');
      return res.status(400).json({ error: 'Webhook signature missing' });
    }
    
    if (!webhookSecret) {
      logger.error('RAZORPAY_WEBHOOK_SECRET not configured');
      return res.status(500).json({ error: 'Webhook secret not configured' });
    }
    
    // Create expected signature
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(JSON.stringify(req.body))
      .digest('hex');
    
    // Compare signatures
    if (signature !== expectedSignature) {
      logger.warn('Invalid webhook signature', {
        received: signature,
        expected: expectedSignature
      });
      return res.status(400).json({ error: 'Invalid webhook signature' });
    }
    
    logger.info('Webhook signature verified successfully');
    next();
  } catch (error) {
    logger.error('Webhook verification error:', error);
    return res.status(500).json({ error: 'Webhook verification failed' });
  }
};

/**
 * Verify payment signature for payment verification
 */
const verifyPaymentSignature = (orderId, paymentId, signature) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    
    if (!webhookSecret) {
      throw new Error('RAZORPAY_WEBHOOK_SECRET not configured');
    }
    
    // Create expected signature
    const text = `${orderId}|${paymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(text)
      .digest('hex');
    
    // Compare signatures
    if (signature !== expectedSignature) {
      logger.warn('Invalid payment signature', {
        received: signature,
        expected: expectedSignature,
        orderId,
        paymentId
      });
      return false;
    }
    
    logger.info('Payment signature verified successfully');
    return true;
  } catch (error) {
    logger.error('Payment signature verification error:', error);
    return false;
  }
};

/**
 * Verify subscription signature
 */
const verifySubscriptionSignature = (subscriptionId, paymentId, signature) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    
    if (!webhookSecret) {
      throw new Error('RAZORPAY_WEBHOOK_SECRET not configured');
    }
    
    // Create expected signature
    const text = `${subscriptionId}|${paymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(text)
      .digest('hex');
    
    // Compare signatures
    if (signature !== expectedSignature) {
      logger.warn('Invalid subscription signature', {
        received: signature,
        expected: expectedSignature,
        subscriptionId,
        paymentId
      });
      return false;
    }
    
    logger.info('Subscription signature verified successfully');
    return true;
  } catch (error) {
    logger.error('Subscription signature verification error:', error);
    return false;
  }
};

module.exports = {
  webhookVerifier,
  verifyPaymentSignature,
  verifySubscriptionSignature
}; 