import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { MonthTrend } from '@/types/api.types';
import { formatGHS } from '@/utils/currency';

interface TrendGroupedChartProps {
  trends: MonthTrend[];
}

export function TrendGroupedChart({ trends }: TrendGroupedChartProps) {
  const data = trends.map((t) => ({
    label: t.periodLabel,
    spent: t.totalSpent,
    received: t.totalReceived,
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#6d7a73' }} axisLine={false} tickLine={false} />
        <YAxis
          tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
          tick={{ fontSize: 11, fill: '#6d7a73' }}
          axisLine={false}
          tickLine={false}
          width={40}
        />
        <Tooltip
          formatter={(value) => (value != null ? formatGHS(Number(value)) : '')}
          contentStyle={{ borderRadius: 8 }}
        />
        <Legend />
        <Bar dataKey="spent" name="Spent" fill="#ba1a1a" radius={[4, 4, 0, 0]} />
        <Bar dataKey="received" name="Received" fill="#00694c" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
