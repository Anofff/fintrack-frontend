import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authApi } from '@/api/auth.api';
import { statementsApi } from '@/api/statements.api';
import { useAuthStore } from '@/store/auth.store';
import { resolvePostAuthPath } from '@/utils/navigation';

export function useLogin() {
  const { setAccessToken, setUser } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: async (data) => {
      setAccessToken(data.accessToken);
      const user = await authApi.getMe();
      setUser(user);

      const statements = await statementsApi.getAll();
      queryClient.setQueryData(['statements'], statements);

      const path = resolvePostAuthPath({
        hasStatements: statements.length > 0,
        nextParam: searchParams.get('next'),
      });
      navigate(path, { replace: true });
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
      navigate('/onboarding', { replace: true });
    },
  });
}

export function useLogout() {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      logout();
      queryClient.clear();
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
