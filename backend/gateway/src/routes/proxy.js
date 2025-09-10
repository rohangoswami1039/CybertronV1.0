const { createProxyMiddleware } = require('http-proxy-middleware');

const proxyOptions = {
  changeOrigin: true,
  timeout: 10000, // 10 seconds
  onError: (err, req, res) => {
    res.status(502).json({ error: 'Proxy error', details: err.message });
  }
};

const authProxy = createProxyMiddleware({
  target: process.env.AUTH_SERVICE_URL || 'http://localhost:8001',
  pathRewrite: { '^/auth': '' },
  ...proxyOptions
});

const chatProxy = createProxyMiddleware({
  target: process.env.CHAT_SERVICE_URL || 'http://localhost:8002',
  pathRewrite: { '^/chat': '' },
  ...proxyOptions
});

const paymentProxy = createProxyMiddleware({
  target: process.env.PAYMENT_SERVICE_URL || 'http://localhost:8003',
  pathRewrite: { '^/payment': '' },
  ...proxyOptions
});

module.exports = { authProxy, chatProxy, paymentProxy }; 