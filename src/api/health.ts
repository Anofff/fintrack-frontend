import { api } from './axios';
import { logger } from '@/utils/logger';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface HealthStatus {
  connected: boolean;
  baseUrl: string;
  endpoint: string | null;
  statusCode: number | null;
  responseTime: number;
  timestamp: string;
  error?: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Ordered list of endpoints to probe. First successful response wins. */
const HEALTH_ENDPOINTS = ['/health', '/docs', '/'] as const;

const HEALTH_TIMEOUT_MS = 5_000;
const STARTUP_DELAY_MS = 800;

// ---------------------------------------------------------------------------
// Core check
// ---------------------------------------------------------------------------

/**
 * Probe the FastAPI backend for liveness.
 *
 * Tries each endpoint in {@link HEALTH_ENDPOINTS} in order and returns as
 * soon as one responds successfully. If every endpoint fails, returns a
 * `connected: false` status with the last error message.
 */
export const checkBackendConnection = async (): Promise<HealthStatus> => {
  const startTime = performance.now();
  const timestamp = new Date().toISOString();
  const baseUrl = api.defaults.baseURL ?? '';

  let lastError: string | undefined;
  let lastStatusCode: number | null = null;

  for (const endpoint of HEALTH_ENDPOINTS) {
    try {
      const response = await api.get(endpoint, { timeout: HEALTH_TIMEOUT_MS });
      const responseTime = elapsed(startTime);

      const status: HealthStatus = {
        connected: true,
        baseUrl,
        endpoint,
        statusCode: response.status,
        responseTime,
        timestamp,
      };

      logger.info('Backend connection successful', {
        endpoint,
        statusCode: response.status,
        responseTime: fmt(responseTime),
        baseUrl,
      });

      return status;
    } catch (err: unknown) {
      lastError = extractMessage(err);
      lastStatusCode = extractStatusCode(err);

      logger.warn('Health endpoint unreachable', {
        endpoint,
        statusCode: lastStatusCode,
        error: lastError,
      });
      // Fall through to the next endpoint.
    }
  }

  // All endpoints failed.
  const responseTime = elapsed(startTime);

  const status: HealthStatus = {
    connected: false,
    baseUrl,
    endpoint: null,
    statusCode: lastStatusCode,
    responseTime,
    timestamp,
    error: lastError ?? 'Unknown error',
  };

  logger.error('Backend connection failed', {
    error: lastError,
    statusCode: lastStatusCode,
    baseUrl,
    responseTime: fmt(responseTime),
  });

  return status;
};

// ---------------------------------------------------------------------------
// Startup helper
// ---------------------------------------------------------------------------

/**
 * Fire-and-forget health check intended to run once when the app mounts.
 * Swallows all errors so it never blocks or breaks startup.
 */
export const initializeBackendCheck = (): void => {
  setTimeout(async () => {
    try {
      const status = await checkBackendConnection();
      console.table(status);

      if (!status.connected) {
        console.warn('⚠️ Backend unreachable — some features may not work.', {
          error: status.error,
          baseUrl: status.baseUrl,
        });
      }
    } catch (err) {
      console.error('Health check threw unexpectedly:', err);
    }
  }, STARTUP_DELAY_MS);
};

// ---------------------------------------------------------------------------
// Private helpers
// ---------------------------------------------------------------------------

function elapsed(startTime: number): number {
  return Math.round(performance.now() - startTime);
}

function fmt(ms: number): string {
  return `${ms}ms`;
}

/** Minimal shape of an Axios error — only the fields we actually read. */
interface AxiosLikeError {
  message?: string;
  response?: {
    status?: number;
    data?: {
      detail?: string;
    };
  };
}

function isAxiosLikeError(err: unknown): err is AxiosLikeError {
  return typeof err === 'object' && err !== null;
}

function extractMessage(err: unknown): string {
  if (isAxiosLikeError(err)) {
    return (
      err.response?.data?.detail ??
      err.message ??
      String(err)
    );
  }
  return String(err);
}

function extractStatusCode(err: unknown): number | null {
  if (isAxiosLikeError(err)) {
    const code = err.response?.status;
    return typeof code === 'number' ? code : null;
  }
  return null;
}