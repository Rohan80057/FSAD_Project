import {
    ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip,
    CartesianGrid
} from 'recharts';
import { formatCurrency } from '@/lib/utils';

interface ChartPoint {
    date: string;
    value: number;
}

interface PortfolioChartProps {
    data: ChartPoint[];
}

function CustomTooltip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null;
    return (
        <div className="card p-3 shadow-lg">
            <p className="text-xs font-medium text-[var(--color-muted-foreground)] mb-1">
                {new Date(label).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
            <p className="text-sm font-bold text-[var(--color-foreground)]">
                {formatCurrency(payload[0].value)}
            </p>
        </div>
    );
}

export default function PortfolioChart({ data }: PortfolioChartProps) {
    if (!data.length) {
        return (
            <div className="flex items-center justify-center h-[280px]">
                <div className="text-center">
                    <p className="text-sm text-[var(--color-muted-foreground)]">No chart data yet.</p>
                    <p className="text-xs text-[var(--color-muted-foreground)] mt-1">
                        Make a trade to see your portfolio history.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--color-success)" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="var(--color-success)" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="var(--color-border)"
                        strokeOpacity={0.5}
                        vertical={false}
                    />
                    <XAxis
                        dataKey="date"
                        tickFormatter={(d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        tick={{ fill: 'var(--color-muted-foreground)', fontSize: 11 }}
                        axisLine={{ stroke: 'var(--color-border)' }}
                        tickLine={false}
                    />
                    <YAxis
                        tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                        tick={{ fill: 'var(--color-muted-foreground)', fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                        width={55}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke="var(--color-success)"
                        strokeWidth={2}
                        fill="url(#portfolioGradient)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
