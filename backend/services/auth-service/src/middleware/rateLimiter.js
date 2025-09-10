const rateLimit = require("express-rate-limit");
const { logger } = require("./logger");

/**
 * Rate limiter middleware for Express
 * Limits requests based on IP address
 */
const rateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60 * 1000, // default: 1 minute
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // default: 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers

  // Custom handler for when rate limit is exceeded
  handler: (req, res, next, options) => {
    const ip = req.ip || req.headers["x-forwarded-for"] || "unknown";
    logger.warn(`Rate limit exceeded for IP: ${ip}`);

    // If it's a GraphQL request, format the response as a GraphQL error
    if (req.path === "/graphql") {
      return res.status(429).json({
        errors: [
          {
            message: "Too many requests, please try again later.",
            extensions: {
              code: "RATE_LIMIT_EXCEEDED",
              http: { status: 429 },
            },
          },
        ],
      });
    }

    // For non-GraphQL requests, use standard response
    return res.status(options.statusCode).send(options.message);
  },

  // Skip rate limiting in development mode if configured
  skip: (req, res) => {
    return (
      process.env.NODE_ENV === "development" &&
      process.env.DISABLE_RATE_LIMIT === "true"
    );
  },

  // Use user ID from request context if available (after Firebase auth)
  keyGenerator: (req, res) => {
    // If user is authenticated, use their UID as the rate limit key
    // This allows for per-user rate limiting instead of per-IP
    if (req.user && req.user.uid) {
      return req.user.uid;
    }

    // Otherwise fall back to IP-based limiting
    return req.ip || req.headers["x-forwarded-for"] || "unknown";
  },
});

module.exports = { rateLimiter }; 