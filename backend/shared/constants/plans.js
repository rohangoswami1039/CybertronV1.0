/**
 * Plan Configuration Constants
 * Defines token limits and pricing for different subscription plans
 */

const PLANS = {
  FREE: {
    id: 'free',
    name: 'Free',
    description: 'Basic plan with limited tokens',
    tokens: 100,
    price: 0,
    currency: 'INR',
    features: [
      '100 AI tokens per month',
      'Basic chat support',
      'Standard response time'
    ],
    limitations: [
      'No priority support',
      'Limited file uploads',
      'No advanced features'
    ]
  },
  
  PRO: {
    id: 'pro',
    name: 'Pro',
    description: 'Professional plan for power users',
    tokens: 1000,
    price: 999,
    currency: 'INR',
    features: [
      '1000 AI tokens per month',
      'Priority chat support',
      'Faster response time',
      'Advanced AI models',
      'File upload support',
      'Conversation history'
    ],
    limitations: [
      'No team collaboration',
      'Limited API access'
    ]
  },
  
  ENTERPRISE: {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Enterprise plan for teams and businesses',
    tokens: 10000,
    price: 4999,
    currency: 'INR',
    features: [
      '10000 AI tokens per month',
      '24/7 priority support',
      'Fastest response time',
      'All AI models available',
      'Unlimited file uploads',
      'Full conversation history',
      'Team collaboration',
      'API access',
      'Custom integrations',
      'Dedicated account manager'
    ],
    limitations: [
      'No limitations'
    ]
  }
};

/**
 * Token costs for different operations
 */
const TOKEN_COSTS = {
  TEXT_MESSAGE: 10,
  IMAGE_GENERATION: 50,
  AUDIO_GENERATION: 30,
  DOCUMENT_ANALYSIS: 25,
  CODE_GENERATION: 20,
  TRANSLATION: 5,
  SUMMARIZATION: 15
};

/**
 * Plan upgrade/downgrade rules
 */
const PLAN_RULES = {
  UPGRADE: {
    immediate: true,
    proration: true,
    tokenBonus: 0.1 // 10% bonus tokens on upgrade
  },
  DOWNGRADE: {
    immediate: false,
    effectiveNextBilling: true,
    tokenCarryover: true
  }
};

/**
 * Billing cycles
 */
const BILLING_CYCLES = {
  MONTHLY: {
    id: 'monthly',
    name: 'Monthly',
    days: 30,
    discount: 0
  },
  YEARLY: {
    id: 'yearly',
    name: 'Yearly',
    days: 365,
    discount: 0.2 // 20% discount for yearly billing
  }
};

/**
 * Get plan by ID
 * @param {string} planId - The plan ID
 * @returns {Object|null} - Plan object or null if not found
 */
const getPlanById = (planId) => {
  return PLANS[planId.toUpperCase()] || null;
};

/**
 * Get all plans
 * @returns {Object} - All plans
 */
const getAllPlans = () => {
  return PLANS;
};

/**
 * Calculate token cost for operation
 * @param {string} operation - The operation type
 * @param {number} quantity - Quantity of operations
 * @returns {number} - Total token cost
 */
const calculateTokenCost = (operation, quantity = 1) => {
  const baseCost = TOKEN_COSTS[operation.toUpperCase()] || 0;
  return baseCost * quantity;
};

/**
 * Get token cost for operation
 * @param {string} operation - The operation type
 * @returns {number} - Token cost for single operation
 */
const getTokenCost = (operation) => {
  return TOKEN_COSTS[operation.toUpperCase()] || 0;
};

/**
 * Check if user has enough tokens
 * @param {number} userTokens - User's current token balance
 * @param {string} operation - The operation type
 * @param {number} quantity - Quantity of operations
 * @returns {boolean} - True if user has enough tokens
 */
const hasEnoughTokens = (userTokens, operation, quantity = 1) => {
  const requiredTokens = calculateTokenCost(operation, quantity);
  return userTokens >= requiredTokens;
};

/**
 * Calculate discounted price
 * @param {number} basePrice - Base price
 * @param {string} billingCycle - Billing cycle
 * @returns {number} - Discounted price
 */
const calculateDiscountedPrice = (basePrice, billingCycle) => {
  const cycle = BILLING_CYCLES[billingCycle.toUpperCase()];
  if (!cycle) return basePrice;
  
  return basePrice * (1 - cycle.discount);
};

module.exports = {
  PLANS,
  TOKEN_COSTS,
  PLAN_RULES,
  BILLING_CYCLES,
  getPlanById,
  getAllPlans,
  calculateTokenCost,
  getTokenCost,
  hasEnoughTokens,
  calculateDiscountedPrice
}; 