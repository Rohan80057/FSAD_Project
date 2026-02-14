import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/lib/utils';

interface DataPoint {
    date: string;
    value: number;
}

interface PortfolioChartProps {
    data: DataPoint[];
}

export default function PortfolioChart({ data }: PortfolioChartProps) {
    if (!data || data.length === 0) {
        return (
            <div className="glass rounded-xl p-6 animate-fadeIn">
                <h3 className="text-lg font-semibold mb-4">Portfolio Value</h3>
                <div className="h-64 flex items-center justify-center text-[var(--color-muted-foreground)]">
                    <div className="text-center">
                        <p className="text-sm">No historical data yet</p>
                        <p className="text-xs mt-1">Snapshots are captured daily at midnight</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="glass rounded-xl p-6 animate-fadeIn">
            <h3 className="text-lg font-semibold mb-4">Portfolio Value</h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                        <defs>
                            <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                        <XAxis
                            dataKey="date"
                            tick={{ fill: '#a1a1aa', fontSize: 12 }}
                            tickLine={false}
                            axisLine={{ stroke: '#27272a' }}
                        />
                        <YAxis
                            tick={{ fill: '#a1a1aa', fontSize: 12 }}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                        />
                        <Tooltip
                            contentStyle={{
                                background: '#18181b',
                                border: '1px solid #27272a',
                                borderRadius: '8px',
                                color: '#fafafa',
                                fontSize: '13px',
                            }}
                            formatter={(value: number) => [formatCurrency(value), 'Value']}
                            labelStyle={{ color: '#a1a1aa' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#6366f1"
                            strokeWidth={2}
                            fill="url(#portfolioGradient)"
                            dot={false}
                            activeDot={{ r: 5, fill: '#6366f1', stroke: '#fafafa', strokeWidth: 2 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
