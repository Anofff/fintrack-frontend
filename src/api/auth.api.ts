import { api } from './axios';
import type { AuthResponse, User } from '@/types/api.types';

export const authApi = {
  register: (data: { email: string; password: string; fullName?: string }) =>
    api.post<AuthResponse>('/auth/register', data).then((r) => r.data),

  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>('/auth/login', data).then((r) => r.data),

  logout: () => api.post('/auth/logout').then((r) => r.data),

  getMe: () => api.get<User>('/users/me').then((r) => r.data),

  updateMe: (data: { fullName?: string }) => api.patch<User>('/users/me', data).then((r) => r.data),
};
