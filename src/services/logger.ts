// src/services/logger.ts
import { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// Logger configuration
const LOGGER_CONFIG = {
  enabled: __DEV__, // Only enable in development
  logRequests: true,
  logResponses: true,
  logErrors: true,
  logTimings: true,
  logHeaders: false, // Don't log headers by default (for security)
};

interface RequestLog {
  timestamp: string;
  method: string;
  url: string;
  headers?: Record<string, unknown>;
  data?: unknown;
}

interface ResponseLog {
  timestamp: string;
  status: number;
  statusText: string;
  data?: unknown;
  duration: number;
}

interface ErrorLog {
  timestamp: string;
  message: string;
  status?: number;
  data?: unknown;
  duration: number;
}

type LoggableRequest = InternalAxiosRequestConfig<any>;

// Store request timestamps for duration calculation
const requestTimestamps = new Map<string, number>();

/**
 * Generate a unique request ID for tracking
 */
const generateRequestId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Sanitize request data (remove sensitive info)
 */
// Fixed sanitizeData function
const sanitizeData = (data: any): any => {
  if (!data) return data;

  // Don't try to sanitize non-objects
  if (typeof data !== 'object') return data;

  const sensitiveFields = ['password', 'confirmPassword', 'token', 'authorization'];
  const sanitized = { ...data };

  sensitiveFields.forEach((field) => {
    if (sanitized[field]) {
      sanitized[field] = '***REDACTED***';
    }
  });

  return sanitized;
};

/**
 * Format and log request
 */
const logRequest = (config: LoggableRequest, requestId: string): LoggableRequest => {
  if (!LOGGER_CONFIG.enabled || !LOGGER_CONFIG.logRequests) {
    return config;
  }

  const requestLog: RequestLog = {
    timestamp: new Date().toISOString(),
    method: config.method?.toUpperCase() || 'GET',
    url: config.url || '',
    headers: LOGGER_CONFIG.logHeaders ? config.headers : undefined,
    data: sanitizeData(config.data),
  };

  requestTimestamps.set(requestId, Date.now());

  console.group(`🚀 API REQUEST [${requestId}]`);
  console.log(`📍 ${requestLog.method} ${requestLog.url}`);
  console.log('⏰ Timestamp:', requestLog.timestamp);
  if (requestLog.data) {
    console.log('📦 Payload:', requestLog.data);
  }
  console.groupEnd();

  return config;
};

/**
 * Format and log response
 */
// Simpler version without size checking
const logResponse = (response: AxiosResponse, requestId: string): AxiosResponse => {
  if (!LOGGER_CONFIG.enabled || !LOGGER_CONFIG.logResponses) {
    return response;
  }

  const startTime = requestTimestamps.get(requestId) || Date.now();
  const duration = Date.now() - startTime;

  const responseLog: ResponseLog = {
    timestamp: new Date().toISOString(),
    status: response.status,
    statusText: response.statusText,
    data: response.data,
    duration,
  };

  const statusEmoji = response.status >= 200 && response.status < 300 ? '✅' : '⚠️';

  console.group(`${statusEmoji} API RESPONSE [${requestId}]`);
  console.log(`📊 Status: ${responseLog.status} ${responseLog.statusText}`);
  console.log('⏱️ Duration:', `${responseLog.duration}ms`);
  console.log('⏰ Timestamp:', responseLog.timestamp);
  console.log('📥 Response Data:', responseLog.data);
  console.groupEnd();

  requestTimestamps.delete(requestId);

  return response;
};

/**
 * Format and log error
 */
const logError = (error: AxiosError, requestId: string): Promise<AxiosError> => {
  if (!LOGGER_CONFIG.enabled || !LOGGER_CONFIG.logErrors) {
    return Promise.reject(error);
  }

  const startTime = requestTimestamps.get(requestId) || Date.now();
  const duration = Date.now() - startTime;

  const errorLog: ErrorLog = {
    timestamp: new Date().toISOString(),
    message: error.message,
    status: error.response?.status,
    data: error.response?.data,
    duration,
  };

  console.group(`❌ API ERROR [${requestId}]`);
  console.log('📊 Status:', errorLog.status || 'Network Error');
  console.log('⏱️ Duration:', `${errorLog.duration}ms`);
  console.log('⏰ Timestamp:', errorLog.timestamp);
  console.log('💬 Message:', errorLog.message);
  if (errorLog.data) {
    console.log('📥 Error Data:', errorLog.data);
  }
  // Log stack trace only in development
  if (__DEV__ && error.stack) {
    console.log('🔍 Stack:', error.stack);
  }
  console.groupEnd();

  requestTimestamps.delete(requestId);

  return Promise.reject(error);
};

/**
 * Setup logger interceptors for axios instance
 */
export const setupApiLogger = (axiosInstance: AxiosInstance): void => {
  // Request interceptor - Add Authorization header and logging
  axiosInstance.interceptors.request.use(
    async (config: LoggableRequest) => {
      const requestId = generateRequestId();
      // Attach request ID to config for response matching
      (config as any).requestId = requestId;

      // Add Authorization header if token exists in store
      // Lazy load auth store to avoid circular dependency
      const { useAuthStore } = await import('../store/auth.store');
      const token = useAuthStore.getState().token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return logRequest(config, requestId);
    },
    (error) => {
      console.error('Request setup error:', error);
      return Promise.reject(error);
    },
  );

  // Response interceptor
  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
      const requestId = (response.config as any).requestId || 'unknown';
      return logResponse(response, requestId);
    },
    (error: AxiosError) => {
      const requestId = (error.config as any)?.requestId || 'unknown';
      return logError(error, requestId);
    },
  );
};

/**
 * Enable/disable logger
 */
export const setLoggerEnabled = (enabled: boolean): void => {
  LOGGER_CONFIG.enabled = enabled;
};

/**
 * Toggle specific log types
 */
export const configureLogger = (config: Partial<typeof LOGGER_CONFIG>): void => {
  Object.assign(LOGGER_CONFIG, config);
};

/**
 * Get current logger configuration
 */
export const getLoggerConfig = () => {
  return { ...LOGGER_CONFIG };
};

export default {
  setupApiLogger,
  setLoggerEnabled,
  configureLogger,
  getLoggerConfig,
};
