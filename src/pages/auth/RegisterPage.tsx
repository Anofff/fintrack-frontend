import { Link, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRegister } from '@/hooks/useAuth';

const schema = z
  .object({
    email: z.string().email('Enter a valid email'),
    fullName: z.string().optional(),
    password: z.string().min(8, 'At least 8 characters'),
    confirm: z.string().min(1, 'Confirm your password'),
  })
  .refine((data) => data.password === data.confirm, {
    message: 'Passwords do not match',
    path: ['confirm'],
  });

type RegisterForm = z.infer<typeof schema>;

export function RegisterPage() {
  const token = useAuthStore((s) => s.accessToken);
  const { mutate: registerUser, isPending, error } = useRegister();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({ resolver: zodResolver(schema) });

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-background dark:bg-dark-bg flex flex-col justify-center px-gutter py-xl">
      <div className="w-full max-w-md mx-auto">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-10 h-10 rounded-md bg-primary flex items-center justify-center">
            <span className="text-white font-bold">₵</span>
          </div>
          <span className="text-h2 font-semibold text-on-surface dark:text-dark-text">FinTrack₵</span>
        </div>

        <div className="card p-6 md:p-8">
          <h1 className="text-h3 font-semibold text-on-surface dark:text-dark-text mb-1">Create account</h1>
          <p className="text-body-sm text-outline dark:text-dark-muted mb-6">Start tracking your MoMo spending</p>

          {error && (
            <p className="text-body-sm text-error mb-4" role="alert">
              Registration failed. Try a different email.
            </p>
          )}

          <form
            className="space-y-4"
            onSubmit={handleSubmit((data) =>
              registerUser({
                email: data.email,
                password: data.password,
                fullName: data.fullName || undefined,
              }),
            )}
            noValidate
          >
            <div>
              <label htmlFor="fullName" className="text-label text-on-surface-variant dark:text-dark-muted block mb-1">
                Full name <span className="text-outline font-normal">(optional)</span>
              </label>
              <input
                id="fullName"
                type="text"
                autoComplete="name"
                className="w-full px-3 py-2.5 rounded-lg border border-outline-variant dark:border-[rgba(255,255,255,0.15)]
                           bg-transparent text-body-reg text-on-surface dark:text-dark-text
                           focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                {...register('fullName')}
              />
            </div>
            <div>
              <label htmlFor="email" className="text-label text-on-surface-variant dark:text-dark-muted block mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className="w-full px-3 py-2.5 rounded-lg border border-outline-variant dark:border-[rgba(255,255,255,0.15)]
                           bg-transparent text-body-reg text-on-surface dark:text-dark-text
                           focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-label text-error mt-1">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="password"
                className="text-label text-on-surface-variant dark:text-dark-muted block mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                className="w-full px-3 py-2.5 rounded-lg border border-outline-variant dark:border-[rgba(255,255,255,0.15)]
                           bg-transparent text-body-reg text-on-surface dark:text-dark-text
                           focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-label text-error mt-1">{errors.password.message}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="confirm"
                className="text-label text-on-surface-variant dark:text-dark-muted block mb-1"
              >
                Confirm password
              </label>
              <input
                id="confirm"
                type="password"
                autoComplete="new-password"
                className="w-full px-3 py-2.5 rounded-lg border border-outline-variant dark:border-[rgba(255,255,255,0.15)]
                           bg-transparent text-body-reg text-on-surface dark:text-dark-text
                           focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                {...register('confirm')}
              />
              {errors.confirm && (
                <p className="text-label text-error mt-1">{errors.confirm.message}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={isPending}
              className="w-full py-2.5 rounded-lg bg-primary text-white text-body-mid font-medium
                         hover:bg-primary-container transition-colors disabled:opacity-60"
            >
              {isPending ? 'Creating account…' : 'Register'}
            </button>
          </form>

          <p className="text-body-sm text-outline dark:text-dark-muted mt-6 text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-primary dark:text-inverse-primary font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
