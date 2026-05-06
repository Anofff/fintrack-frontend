export function formatGHS(value: number | string | null | undefined): string {
  if (value === null || value === undefined) return 'GHS 0.00';

  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (Number.isNaN(num)) return 'GHS 0.00';

  const abs = Math.abs(num);
  const sign = num < 0 ? '-' : '';
  const formatted = abs.toLocaleString('en-GH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return `${sign}GHS ${formatted}`;
}

export function formatGHSChange(value: number): string {
  const sign = value >= 0 ? '+' : '-';
  const abs = Math.abs(value);
  const formatted = abs.toLocaleString('en-GH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${sign}GHS ${formatted}`;
}

export function formatPct(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
}
