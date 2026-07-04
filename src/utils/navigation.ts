/** App routes that may appear in `?next=` after login. */
const ALLOWED_NEXT_PREFIXES = [
  '/dashboard',
  '/transactions',
  '/analytics',
  '/statements',
  '/categories',
  '/settings',
  '/onboarding',
] as const;

/**
 * Returns a safe internal path for post-login redirects.
 * Rejects open redirects (`//evil.com`, `https://…`, unknown paths).
 */
export function getSafeNextPath(next: string | null | undefined): string | null {
  if (!next) return null;

  const trimmed = next.trim();
  if (!trimmed.startsWith('/') || trimmed.startsWith('//')) return null;
  if (trimmed.includes('://')) return null;

  const pathname = trimmed.split(/[?#]/)[0] ?? '';
  const allowed = ALLOWED_NEXT_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  return allowed ? trimmed : null;
}

/**
 * Where an authenticated user should land.
 * - No statements → always onboarding (unless they somehow only need that page).
 * - Has statements → safe `next` if present, otherwise dashboard.
 */
export function resolvePostAuthPath(options: {
  hasStatements: boolean;
  nextParam?: string | null;
}): string {
  const safeNext = getSafeNextPath(options.nextParam);

  if (!options.hasStatements) {
    return '/onboarding';
  }

  if (safeNext && safeNext !== '/onboarding' && !safeNext.startsWith('/onboarding?')) {
    return safeNext;
  }

  return '/dashboard';
}
