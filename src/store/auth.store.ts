import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '@/types/api.types';

export type AuthStatus = 'loading' | 'authenticated' | 'anonymous';

interface AuthState {
  accessToken: string | null;
  user: User | null;
  /** Starts as `loading` until AuthBootstrap finishes. */
  status: AuthStatus;
  setAccessToken: (token: string) => void;
  setUser: (user: User) => void;
  setAnonymous: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      status: 'loading',

      setAccessToken: (token) => set({ accessToken: token, status: 'authenticated' }),

      setUser: (user) => set({ user }),

      setAnonymous: () => set({ accessToken: null, user: null, status: 'anonymous' }),

      logout: () => {
        set({ accessToken: null, user: null, status: 'anonymous' });
      },
    }),
    {
      name: 'fintrack-auth',
      storage: createJSONStorage(() => sessionStorage),
      // Never persist accessToken — restore via httpOnly refresh cookie on boot.
      partialize: (state) => ({ user: state.user }),
    },
  ),
);
