import axios from 'axios';

/** Pull a readable message from an Axios / FastAPI-style error. */
export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.detail;

    if (typeof detail === 'string' && detail.trim()) {
      return detail;
    }

    if (Array.isArray(detail)) {
      const parts = detail
        .map((item) => {
          if (typeof item === 'string') return item;
          if (item && typeof item === 'object' && 'msg' in item) {
            return String((item as { msg: unknown }).msg);
          }
          return null;
        })
        .filter(Boolean);
      if (parts.length) return parts.join('. ');
    }

    if (error.response?.status === 413) {
      return 'That file is too large. Use a PDF under 10MB.';
    }

    if (error.response?.status === 415 || error.response?.status === 422) {
      return 'That does not look like a valid MoMo PDF statement.';
    }

    if (error.message === 'Network Error') {
      return 'Could not reach the server. Check your connection and try again.';
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}
