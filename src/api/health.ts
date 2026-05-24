import { api } from './axios';
import { logger } from '@/utils/logger';

export interface HealthStatus {
  connected: boolean;
  baseUrl: string;
  responseTime: number;
  timestamp: string;
  error?: string;
}

/**
 * Check connection to FastAPI backend
 * FastAPI typically has a /docs or /health endpoint
 */
export const checkBackendConnection = async (): Promise<HealthStatus> => {
  const startTime = performance.now();
  const timestamp = new Date().toISOString();

  try {
    // Try common FastAPI health check endpoints
    const response = await api.get('/health', {
      timeout: 5000,
    });

    const responseTime = Math.round(performance.now() - startTime);

    const status: HealthStatus = {
      connected: true,
      baseUrl: api.defaults.baseURL || '',
      responseTime,
      timestamp,
    };

    logger.info('Backend connection successful', {
      responseTime: `${responseTime}ms`,
      baseUrl: status.baseUrl,
    });

    return status;
  } catch (error) {
    const responseTime = Math.round(performance.now() - startTime);
    const errorMessage = error instanceof Error ? error.message : String(error);

    const status: HealthStatus = {
      connected: false,
      baseUrl: api.defaults.baseURL || '',
      responseTime,
      timestamp,
      error: errorMessage,
    };

    logger.error('Backend connection failed', {
      error: errorMessage,
      baseUrl: status.baseUrl,
      responseTime: `${responseTime}ms`,
    });

    return status;
  }
};

/**
 * Check backend connection on app startup
 */
export const initializeBackendCheck = async () => {
  // Small delay to let app fully mount
  setTimeout(async () => {
    const status = await checkBackendConnection();
    console.table(status);
  }, 1000);
};
