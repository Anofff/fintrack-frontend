import { useEffect, type ReactNode } from 'react';
import { authApi } from '@/api/auth.api';
import { useAuthStore } from '@/store/auth.store';

/**
 * Restores the session on app boot via the httpOnly refresh cookie.
 * Does not persist the access token — only exchanges the cookie for a new one.
 */
export function AuthBootstrap({ children }: { children: ReactNode }) {
  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      const { accessToken, setAccessToken, setUser, setAnonymous } = useAuthStore.getState();

      if (accessToken) {
        useAuthStore.setState({ status: 'authenticated' });
        return;
      }

      try {
        const { accessToken: token } = await authApi.refresh();
        if (cancelled) return;

        setAccessToken(token);

        try {
          const user = await authApi.getMe();
          if (!cancelled) setUser(user);
        } catch {
          // Token is valid; profile can load later via useMe.
        }
      } catch {
        if (!cancelled) setAnonymous();
      }
    }

    void restoreSession();

    return () => {
      cancelled = true;
    };
  }, []);

  return children;
}
