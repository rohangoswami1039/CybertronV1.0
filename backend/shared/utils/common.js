/**
 * Common utility functions shared across all microservices
 */

const crypto = require('crypto');
const jwt = require('jsonwebtoken');

/**
 * Generate a random string of specified length
 * @param {number} length - Length of the string
 * @returns {string} - Random string
 */
const generateRandomString = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

/**
 * Hash a string using SHA-256
 * @param {string} data - Data to hash
 * @returns {string} - Hashed string
 */
const hashString = (data) => {
  return crypto.createHash('sha256').update(data).digest('hex');
};

/**
 * Generate a secure token
 * @param {number} length - Length of the token
 * @returns {string} - Secure token
 */
const generateSecureToken = (length = 64) => {
  return crypto.randomBytes(length).toString('base64url');
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid email
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number format (basic validation)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid phone number
 */
const isValidPhone = (phone) => {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

/**
 * Sanitize string input
 * @param {string} input - Input to sanitize
 * @returns {string} - Sanitized string
 */
const sanitizeString = (input) => {
  if (typeof input !== 'string') return '';
  return input.trim().replace(/[<>]/g, '');
};

/**
 * Format date to ISO string
 * @param {Date} date - Date to format
 * @returns {string} - Formatted date string
 */
const formatDate = (date) => {
  if (!date) return null;
  return new Date(date).toISOString();
};

/**
 * Get current timestamp
 * @returns {number} - Current timestamp
 */
const getCurrentTimestamp = () => {
  return Math.floor(Date.now() / 1000);
};

/**
 * Calculate time difference in seconds
 * @param {Date|number} startTime - Start time
 * @param {Date|number} endTime - End time
 * @returns {number} - Time difference in seconds
 */
const getTimeDifference = (startTime, endTime = Date.now()) => {
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  return Math.floor((end - start) / 1000);
};

/**
 * Check if token is expired
 * @param {string} token - JWT token
 * @param {string} secret - JWT secret
 * @returns {boolean} - True if token is expired
 */
const isTokenExpired = (token, secret) => {
  try {
    const decoded = jwt.verify(token, secret);
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
};

/**
 * Extract user ID from JWT token
 * @param {string} token - JWT token
 * @param {string} secret - JWT secret
 * @returns {string|null} - User ID or null
 */
const extractUserIdFromToken = (token, secret) => {
  try {
    const decoded = jwt.verify(token, secret);
    return decoded.userId || decoded.sub || null;
  } catch (error) {
    return null;
  }
};

/**
 * Create success response object
 * @param {any} data - Response data
 * @param {string} message - Success message
 * @returns {Object} - Success response object
 */
const createSuccessResponse = (data = null, message = 'Success') => {
  return {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  };
};

/**
 * Create error response object
 * @param {string} message - Error message
 * @param {string} code - Error code
 * @param {any} details - Error details
 * @returns {Object} - Error response object
 */
const createErrorResponse = (message = 'Error occurred', code = 'ERROR', details = null) => {
  return {
    success: false,
    message,
    code,
    details,
    timestamp: new Date().toISOString()
  };
};

/**
 * Validate required fields in object
 * @param {Object} obj - Object to validate
 * @param {Array} requiredFields - Array of required field names
 * @returns {Object} - Validation result
 */
const validateRequiredFields = (obj, requiredFields) => {
  const missingFields = [];
  
  for (const field of requiredFields) {
    if (!obj[field] || (typeof obj[field] === 'string' && obj[field].trim() === '')) {
      missingFields.push(field);
    }
  }
  
  return {
    isValid: missingFields.length === 0,
    missingFields
  };
};

/**
 * Deep clone an object
 * @param {any} obj - Object to clone
 * @returns {any} - Cloned object
 */
const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (typeof obj === 'object') {
    const clonedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
  return obj;
};

/**
 * Retry function with exponential backoff
 * @param {Function} fn - Function to retry
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} baseDelay - Base delay in milliseconds
 * @returns {Promise} - Promise that resolves with function result
 */
const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 1000) => {
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxRetries) {
        throw error;
      }
      
      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
};

/**
 * Generate pagination metadata
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @param {number} total - Total items
 * @returns {Object} - Pagination metadata
 */
const generatePaginationMeta = (page, limit, total) => {
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;
  
  return {
    currentPage: page,
    totalPages,
    totalItems: total,
    itemsPerPage: limit,
    hasNextPage,
    hasPrevPage,
    nextPage: hasNextPage ? page + 1 : null,
    prevPage: hasPrevPage ? page - 1 : null
  };
};

/**
 * Sleep for specified milliseconds
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} - Promise that resolves after sleep
 */
const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Generate a unique ID
 * @returns {string} - Unique ID
 */
const generateUniqueId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Check if value is empty (null, undefined, empty string, empty array, empty object)
 * @param {any} value - Value to check
 * @returns {boolean} - True if empty
 */
const isEmpty = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

/**
 * Capitalize first letter of string
 * @param {string} str - String to capitalize
 * @returns {string} - Capitalized string
 */
const capitalize = (str) => {
  if (!str || typeof str !== 'string') return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Convert string to title case
 * @param {string} str - String to convert
 * @returns {string} - Title case string
 */
const toTitleCase = (str) => {
  if (!str || typeof str !== 'string') return str;
  return str.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

module.exports = {
  generateRandomString,
  hashString,
  generateSecureToken,
  isValidEmail,
  isValidPhone,
  sanitizeString,
  formatDate,
  getCurrentTimestamp,
  getTimeDifference,
  isTokenExpired,
  extractUserIdFromToken,
  createSuccessResponse,
  createErrorResponse,
  validateRequiredFields,
  deepClone,
  retryWithBackoff,
  generatePaginationMeta,
  sleep,
  generateUniqueId,
  isEmpty,
  capitalize,
  toTitleCase
}; 