import { Link, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLogin } from '@/hooks/useAuth';
import { AuthLoader } from '@/components/auth/AuthLoader';
import { NavigateToAppHome } from '@/components/auth/NavigateToAppHome';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof schema>;

export function LoginPage() {
  const status = useAuthStore((s) => s.status);
  const [searchParams] = useSearchParams();
  const { mutate: login, isPending, error } = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(schema) });

  if (status === 'loading') {
    return <AuthLoader />;
  }

  if (status === 'authenticated') {
    return <NavigateToAppHome nextParam={searchParams.get('next')} />;
  }

  return (
    <div className="min-h-screen bg-background dark:bg-dark-bg flex flex-col justify-center px-gutter py-xl">
      <div className="w-full max-w-md mx-auto">
        <Link to="/" className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-10 h-10 rounded-md bg-primary flex items-center justify-center">
            <span className="text-white font-bold">₵</span>
          </div>
          <span className="text-h2 font-semibold text-on-surface dark:text-dark-text">FinTrack₵</span>
        </Link>

        <div className="card p-6 md:p-8">
          <h1 className="text-h3 font-semibold text-on-surface dark:text-dark-text mb-1">Sign in</h1>
          <p className="text-body-sm text-outline dark:text-dark-muted mb-6">Use your FinTrack account</p>

          {error && (
            <p className="text-body-sm text-error mb-4" role="alert">
              Unable to sign in. Check your email and password.
            </p>
          )}

          <form
            className="space-y-4"
            onSubmit={handleSubmit((data) => login(data))}
            noValidate
          >
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
                autoComplete="current-password"
                className="w-full px-3 py-2.5 rounded-lg border border-outline-variant dark:border-[rgba(255,255,255,0.15)]
                           bg-transparent text-body-reg text-on-surface dark:text-dark-text
                           focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-label text-error mt-1">{errors.password.message}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={isPending}
              className="w-full py-2.5 rounded-lg bg-primary text-white text-body-mid font-medium
                         hover:bg-primary-container transition-colors disabled:opacity-60"
            >
              {isPending ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="text-body-sm text-outline dark:text-dark-muted mt-6 text-center">
            No account?{' '}
            <Link to="/register" className="text-primary dark:text-inverse-primary font-medium">
              Create one
            </Link>
          </p>
        </div>

        <p className="text-body-sm text-outline dark:text-dark-muted mt-6 text-center">
          <Link to="/" className="hover:text-primary transition-colors">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
