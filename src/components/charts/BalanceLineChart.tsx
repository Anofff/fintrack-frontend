import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { BalancePoint } from '@/types/api.types';
import { formatGHS } from '@/utils/currency';
import { formatShortDate } from '@/utils/date';

interface BalanceLineChartProps {
  data: BalancePoint[];
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value?: number }[];
  label?: string;
}) {
  if (!active || !payload?.length || label === undefined) return null;
  const v = payload[0]?.value;
  return (
    <div className="card p-3 text-body-sm">
      <p className="font-medium text-on-surface dark:text-dark-text">{formatShortDate(label)}</p>
      <p className="text-primary dark:text-inverse-primary">{formatGHS(v ?? 0)}</p>
    </div>
  );
}

export function BalanceLineChart({ data }: BalanceLineChartProps) {
  const deduped = Object.values(
    data.reduce<Record<string, BalancePoint>>((acc, point) => {
      acc[point.date] = point;
      return acc;
    }, {}),
  ).sort((a, b) => a.date.localeCompare(b.date));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={deduped} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#00694c" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#00694c" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={(v) => formatShortDate(v)}
          tick={{ fontSize: 11, fill: '#6d7a73' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
          tick={{ fontSize: 11, fill: '#6d7a73' }}
          axisLine={false}
          tickLine={false}
          width={40}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="balance"
          stroke="#00694c"
          strokeWidth={2}
          fill="url(#balanceGrad)"
          dot={false}
          activeDot={{ r: 4, fill: '#00694c' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
