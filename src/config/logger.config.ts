// src/config/logger.config.ts
export const loggerConfig = {
  // Enable/disable based on environment
  enabled: __DEV__,

  // Custom configuration for different environments
  development: {
    enabled: true,
    logRequests: true,
    logResponses: true,
    logErrors: true,
    logTimings: true,
    logHeaders: false,
  },

  production: {
    enabled: false,
    logRequests: false,
    logResponses: false,
    logErrors: true, // Only log errors in production
    logTimings: false,
    logHeaders: false,
  },

  staging: {
    enabled: true,
    logRequests: true,
    logResponses: true,
    logErrors: true,
    logTimings: true,
    logHeaders: false,
  },
};
