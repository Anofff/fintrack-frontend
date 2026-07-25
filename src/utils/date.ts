import { format, isValid, parseISO } from 'date-fns';

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(d)) return '—';
  return format(d, 'd MMM yyyy');
}

export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(d)) return '—';
  return format(d, 'd MMM, HH:mm');
}

export function formatPeriod(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(d)) return '—';
  return format(d, 'MMMM yyyy');
}

/** MoMo statements span day-anchored ranges — show the full cycle, not just the start month. */
export function formatStatementPeriod(start: string | Date, end: string | Date): string {
  const s = typeof start === 'string' ? parseISO(start) : start;
  const e = typeof end === 'string' ? parseISO(end) : end;
  if (!isValid(s) || !isValid(e)) return '—';

  if (s.getFullYear() === e.getFullYear() && s.getMonth() === e.getMonth()) {
    return format(s, 'MMMM yyyy');
  }

  if (s.getFullYear() === e.getFullYear()) {
    return `${format(s, 'd MMM')} – ${format(e, 'd MMM yyyy')}`;
  }

  return `${format(s, 'd MMM yyyy')} – ${format(e, 'd MMM yyyy')}`;
}

export function formatShortDate(date: string | Date): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(d)) return '—';
  return format(d, 'd MMM');
}
