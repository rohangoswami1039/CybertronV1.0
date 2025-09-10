const { logger } = require('../middleware/logger');

function getUserId(user) {
  if (!user) throw new Error('User not provided');
  if (user.uid) return user.uid;
  if (user.id) return user.id;
  return 'test_user_123';
}

async function checkTokenAvailability(user, requiredTokens) {
  logger.info(`Token check: ${requiredTokens} tokens requested for user ${getUserId(user)}`);
  return {
    id: getUserId(user),
    availableTokens: 1000,
    totalTokensConsumed: 0
  };
}

async function updateTokenBalance(user, tokensConsumed) {
  logger.info(`Token consumption: ${tokensConsumed} tokens consumed by user ${getUserId(user)}`);
  return {
    id: getUserId(user),
    availableTokens: 1000 - tokensConsumed,
    totalTokensConsumed: tokensConsumed
  };
}

module.exports = {
  getUserId,
  checkTokenAvailability,
  updateTokenBalance
}; 