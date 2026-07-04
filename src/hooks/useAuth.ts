import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/api/auth.api';
import { useAuthStore } from '@/store/auth.store';

export function useLogin() {
  const { setAccessToken, setUser } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: async (data) => {
      setAccessToken(data.accessToken);
      const user = await authApi.getMe();
      setUser(user);
      navigate('/dashboard');
    },
  });
}

export function useRegister() {
  const { setAccessToken, setUser } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: async (data) => {
      setAccessToken(data.accessToken);
      const user = await authApi.getMe();
      setUser(user);
      navigate('/onboarding');
    },
  });
}

export function useLogout() {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      logout();
      navigate('/');
    },
  });
}

export function useMe() {
  const status = useAuthStore((s) => s.status);
  return useQuery({
    queryKey: ['me'],
    queryFn: authApi.getMe,
    enabled: status === 'authenticated',
  });
}
