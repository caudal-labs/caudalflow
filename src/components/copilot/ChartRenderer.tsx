import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line,
  ResponsiveContainer,
} from 'recharts';

const COLORS = [
  '#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6',
  '#ec4899', '#14b8a6', '#f97316', '#06b6d4', '#84cc16',
];

interface ChartDataItem {
  name: string;
  value: number;
}

interface ChartRendererProps {
  args: {
    chartType?: 'pie' | 'bar' | 'line';
    title?: string;
    data?: ChartDataItem[];
  };
}

export function ChartRenderer({ args }: ChartRendererProps) {
  const { chartType = 'pie', title, data = [] } = args;

  if (data.length === 0) {
    return (
      <div className="my-2 rounded-lg border border-neutral-700 bg-neutral-900 p-3 text-xs text-neutral-400">
        No chart data provided.
      </div>
    );
  }

  return (
    <div className="my-2 rounded-lg border border-neutral-700 bg-neutral-900 p-3 text-neutral-100 shadow-lg">
      {title && (
        <div className="mb-3 text-sm font-semibold text-neutral-100">{title}</div>
      )}
      <ResponsiveContainer width="100%" height={240}>
        {chartType === 'pie' ? (
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
              labelLine={false}
              fontSize={11}
            >
              {data.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: '#1e1e1e', border: '1px solid #444', borderRadius: 6, fontSize: 12 }}
              itemStyle={{ color: '#e5e5e5' }}
            />
            <Legend wrapperStyle={{ fontSize: 11 }} />
          </PieChart>
        ) : chartType === 'bar' ? (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="name" tick={{ fill: '#aaa', fontSize: 11 }} />
            <YAxis tick={{ fill: '#aaa', fontSize: 11 }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e1e1e', border: '1px solid #444', borderRadius: 6, fontSize: 12 }}
              itemStyle={{ color: '#e5e5e5' }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {data.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        ) : (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="name" tick={{ fill: '#aaa', fontSize: 11 }} />
            <YAxis tick={{ fill: '#aaa', fontSize: 11 }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1e1e1e', border: '1px solid #444', borderRadius: 6, fontSize: 12 }}
              itemStyle={{ color: '#e5e5e5' }}
            />
            <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1' }} />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
