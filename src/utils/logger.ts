const LOG_ENDPOINT = '/api/logs';

export interface LogEntry {
  level: 'info' | 'error' | 'warn' | 'debug';
  message: string;
  timestamp: string;
  url: string;
  userAgent?: string;
  data?: unknown;
}

const sendLogToBackend = async (entry: LogEntry) => {
  try {
    await fetch(LOG_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(entry),
    });
  } catch (err) {
    // Silently fail to avoid infinite loops
    console.error('Failed to send log to backend:', err);
  }
};

export const logger = {
  info: (message: string, data?: unknown) => {
    console.log(message, data);
    sendLogToBackend({
      level: 'info',
      message,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      data,
    });
  },

  error: (message: string, error?: unknown) => {
    console.error(message, error);
    sendLogToBackend({
      level: 'error',
      message,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      data: error instanceof Error ? error.message : String(error),
    });
  },

  warn: (message: string, data?: unknown) => {
    console.warn(message, data);
    sendLogToBackend({
      level: 'warn',
      message,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      data,
    });
  },

  debug: (message: string, data?: unknown) => {
    if (import.meta.env.DEV) {
      console.debug(message, data);
    }
  },
};

// Capture unhandled errors
window.addEventListener('error', (event) => {
  logger.error('Uncaught error', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
  });
});

// Capture unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  logger.error('Unhandled promise rejection', event.reason);
});
