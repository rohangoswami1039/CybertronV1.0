const { logger } = require('../middleware/logger');

async function checkServiceHealth(serviceUrl) {
  try {
    const response = await fetch(`${serviceUrl}/health`, {
      method: 'GET',
      timeout: 5000
    });
    if (response.ok) {
      return true;
    }
    return false;
  } catch (error) {
    logger.error(`Health check failed for ${serviceUrl}:`, error);
    return false;
  }
}

const resolvers = {
  Query: {
    gateway: () => 'Cybertron AI Gateway is running',
    serviceStatus: async () => {
      try {
        const serviceStatus = await Promise.allSettled([
          checkServiceHealth(process.env.AUTH_SERVICE_URL || 'http://localhost:8001'),
          checkServiceHealth(process.env.CHAT_SERVICE_URL || 'http://localhost:8002'),
          checkServiceHealth(process.env.PAYMENT_SERVICE_URL || 'http://localhost:8003')
        ]);
        return {
          gateway: 'healthy',
          services: {
            auth: serviceStatus[0].status === 'fulfilled' ? 'healthy' : 'unhealthy',
            chat: serviceStatus[1].status === 'fulfilled' ? 'healthy' : 'unhealthy',
            payment: serviceStatus[2].status === 'fulfilled' ? 'healthy' : 'unhealthy'
          },
          timestamp: new Date().toISOString()
        };
      } catch (error) {
        logger.error('Error checking service status:', error);
        return {
          gateway: 'healthy',
          services: {
            auth: 'unknown',
            chat: 'unknown',
            payment: 'unknown'
          },
          timestamp: new Date().toISOString()
        };
      }
    }
  }
};

module.exports = resolvers; 