const { GoogleGenerativeAI } = require('@google/generative-ai');
const { logger } = require('../middleware/logger');
const config = require('../config/env');

// Initialize Gemini
const apiKey = config.GOOGLE_AI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

/**
 * Generate AI completion using Google Gemini
 */
const generateAICompletion = async (options) => {
  try {
    const startTime = Date.now();
    const { messages, settings = {} } = options;
    const { temperature = 0.7, maxTokens = 1000 } = settings;

    // Format the conversation history for Gemini
    const formattedHistory = messages.map(msg => {
      if ((msg.role || '').toLowerCase() === 'user') return `User: ${msg.content}`;
      if ((msg.role || '').toLowerCase() === 'assistant') return `Assistant: ${msg.content}`;
      if ((msg.role || '').toLowerCase() === 'system') return `System: ${msg.content}`;
      return msg.content;
    }).join('\n');

    const chat = model.startChat({
      generationConfig: {
        temperature,
        maxOutputTokens: maxTokens,
      },
    });

    logger.info(`Sending full conversation to Gemini: ${formattedHistory.substring(0, 200)}...`);
    const response = await chat.sendMessage(formattedHistory);
    const result = await response.response;
    const text = result.text();
    const estimatedTokens = Math.ceil(text.length / 4);
    const endTime = Date.now();
    const processingTime = endTime - startTime;
    logger.info(`Gemini response generated: ${estimatedTokens} tokens, ${processingTime}ms`);
    return {
      success: true,
      data: {
        content: text,
        model: 'gemini-1.5-flash',
        tokens: {
          prompt: estimatedTokens,
          completion: 0,
          total: estimatedTokens
        },
        cost: 0, // Add pricing logic if needed
        processingTime,
        finishReason: 'stop'
      }
    };
  } catch (error) {
    logger.error(`Gemini AI error: ${JSON.stringify(error)}`);
    // Fallback response for rate limit or network issues
    if (error.message.includes('429') || error.message.includes('quota')) {
      return {
        success: true,
        data: {
          content: "I'm currently experiencing high demand and have reached my usage limits. Please try again in a few minutes.",
          model: 'gemini-1.5-flash',
          tokens: { prompt: 25, completion: 0, total: 25 },
          cost: 0,
          processingTime: 0,
          finishReason: 'fallback'
        }
      };
    }
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Calculate cost based on model and tokens
 */
const calculateCost = (model, totalTokens) => {
  const costs = {
    'gpt-4': {
      input: 0.03 / 1000,   // $0.03 per 1K input tokens
      output: 0.06 / 1000   // $0.06 per 1K output tokens
    },
    'gpt-4-turbo': {
      input: 0.01 / 1000,   // $0.01 per 1K input tokens
      output: 0.03 / 1000   // $0.03 per 1K output tokens
    },
    'gpt-3.5-turbo': {
      input: 0.0015 / 1000, // $0.0015 per 1K input tokens
      output: 0.002 / 1000  // $0.002 per 1K output tokens
    }
  };

  const modelCosts = costs[model] || costs['gpt-4'];
  
  // For simplicity, we'll assume 70% input, 30% output tokens
  const inputTokens = Math.round(totalTokens * 0.7);
  const outputTokens = totalTokens - inputTokens;
  
  const inputCost = inputTokens * modelCosts.input;
  const outputCost = outputTokens * modelCosts.output;
  
  return inputCost + outputCost;
};

/**
 * Validate AI settings
 */
const validateAISettings = (settings) => {
  const errors = [];

  if (settings.temperature !== undefined && (settings.temperature < 0 || settings.temperature > 2)) {
    errors.push('Temperature must be between 0 and 2');
  }

  if (settings.maxTokens !== undefined && (settings.maxTokens < 1 || settings.maxTokens > 8000)) {
    errors.push('Max tokens must be between 1 and 8000');
  }

  if (settings.topP !== undefined && (settings.topP < 0 || settings.topP > 1)) {
    errors.push('Top P must be between 0 and 1');
  }

  if (settings.frequencyPenalty !== undefined && (settings.frequencyPenalty < -2 || settings.frequencyPenalty > 2)) {
    errors.push('Frequency penalty must be between -2 and 2');
  }

  if (settings.presencePenalty !== undefined && (settings.presencePenalty < -2 || settings.presencePenalty > 2)) {
    errors.push('Presence penalty must be between -2 and 2');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Get available AI models
 */
const getAvailableModels = () => {
  return [
    {
      id: 'gpt-4',
      name: 'GPT-4',
      description: 'Most capable model for complex tasks',
      maxTokens: 8000,
      costPer1KInput: 0.03,
      costPer1KOutput: 0.06
    },
    {
      id: 'gpt-4-turbo',
      name: 'GPT-4 Turbo',
      description: 'Faster and more cost-effective than GPT-4',
      maxTokens: 128000,
      costPer1KInput: 0.01,
      costPer1KOutput: 0.03
    },
    {
      id: 'gpt-3.5-turbo',
      name: 'GPT-3.5 Turbo',
      description: 'Fast and efficient for most tasks',
      maxTokens: 16000,
      costPer1KInput: 0.0015,
      costPer1KOutput: 0.002
    }
  ];
};

/**
 * Test AI connection
 */
const testAIConnection = async () => {
  try {
    const response = await model.generateText('Hello');

    return {
      success: true,
      message: 'AI connection successful'
    };
  } catch (error) {
    logger.error('AI connection test failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = {
  generateAICompletion,
  validateAISettings,
  getAvailableModels,
  testAIConnection
}; 