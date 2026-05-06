import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { CategoryBreakdownItem } from '@/types/api.types';
import { formatGHS } from '@/utils/currency';

interface SpendingBarChartProps {
  data: CategoryBreakdownItem[];
}

interface TooltipPayloadEntry {
  payload?: CategoryBreakdownItem;
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
}) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;
  return (
    <div className="card p-3 text-body-sm">
      <p className="font-medium text-on-surface dark:text-dark-text">{d.name}</p>
      <p className="text-outline dark:text-dark-muted">
        {formatGHS(d.total)} · {d.percentage}%
      </p>
    </div>
  );
}

export function SpendingBarChart({ data }: SpendingBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} layout="vertical" margin={{ left: 0, right: 60, top: 0, bottom: 0 }}>
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="name"
          width={120}
          tick={{ fontSize: 12, fill: '#6d7a73' }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
        <Bar dataKey="total" radius={4} barSize={10}>
          {data.map((entry, i) => (
            <Cell key={`${entry.name}-${i}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
