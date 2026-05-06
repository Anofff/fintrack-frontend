import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/api/auth.api';
import { useLogout, useMe } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/auth.store';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const schema = z.object({
  fullName: z.string().optional(),
});

type ProfileForm = z.infer<typeof schema>;

export function SettingsPage() {
  const { data: me, isLoading } = useMe();
  const setUser = useAuthStore((s) => s.setUser);
  const qc = useQueryClient();
  const { mutate: logout } = useLogout();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileForm>({ resolver: zodResolver(schema) });

  useEffect(() => {
    reset({ fullName: me?.fullName ?? '' });
  }, [me, reset]);

  const { mutate: saveProfile, isPending } = useMutation({
    mutationFn: authApi.updateMe,
    onSuccess: (user) => {
      setUser(user);
      qc.invalidateQueries({ queryKey: ['me'] });
    },
  });

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h2 className="text-h1 font-semibold text-on-surface dark:text-dark-text">Settings</h2>
        <p className="text-body-sm text-outline dark:text-dark-muted mt-0.5">Profile and preferences</p>
      </div>

      <div className="card p-4 space-y-4">
        <h3 className="text-h4 font-semibold text-on-surface dark:text-dark-text">Appearance</h3>
        <div className="flex items-center justify-between">
          <p className="text-body-sm text-on-surface dark:text-dark-text">Theme</p>
          <ThemeToggle />
        </div>
      </div>

      <div className="card p-4">
        <h3 className="text-h4 font-semibold text-on-surface dark:text-dark-text mb-4">Profile</h3>
        {isLoading ? (
          <p className="text-body-sm text-outline dark:text-dark-muted">Loading…</p>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit((data) => saveProfile(data))} noValidate>
            <div>
              <label htmlFor="email" className="text-label text-on-surface-variant dark:text-dark-muted block mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                disabled
                value={me?.email ?? ''}
                className="w-full px-3 py-2.5 rounded-lg border border-outline-variant opacity-70
                           bg-surface-container-low dark:bg-dark-surface-alt text-body-reg text-on-surface dark:text-dark-text"
              />
            </div>
            <div>
              <label htmlFor="fullName" className="text-label text-on-surface-variant dark:text-dark-muted block mb-1">
                Full name
              </label>
              <input
                id="fullName"
                type="text"
                className="w-full px-3 py-2.5 rounded-lg border border-outline-variant
                           dark:border-[rgba(255,255,255,0.15)] bg-transparent text-body-reg
                           text-on-surface dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-primary/20"
                {...register('fullName')}
              />
              {errors.fullName && (
                <p className="text-label text-error mt-1">{errors.fullName.message}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2.5 rounded-lg bg-primary text-white text-body-sm font-medium hover:bg-primary-container disabled:opacity-60"
            >
              {isPending ? 'Saving…' : 'Save changes'}
            </button>
          </form>
        )}
      </div>

      <div className="card p-4">
        <h3 className="text-h4 font-semibold text-on-surface dark:text-dark-text mb-2">Session</h3>
        <p className="text-body-sm text-outline dark:text-dark-muted mb-4">Sign out on this device.</p>
        <button
          type="button"
          onClick={() => logout()}
          className="px-4 py-2.5 rounded-lg border border-error text-error text-body-sm font-medium hover:bg-[rgba(186,26,26,0.06)]"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
