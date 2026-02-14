import { useQuery } from '@tanstack/react-query';
import { fetchPortfolio } from '@/lib/api';
import { formatCurrency, formatPercent, cn } from '@/lib/utils';
import { useState, useMemo } from 'react';
import {
    ResponsiveContainer, PieChart, Pie, Cell, Tooltip
} from 'recharts';
import { ArrowUpDown } from 'lucide-react';

const CHART_COLORS = [
    'var(--color-chart-1)', 'var(--color-chart-2)', 'var(--color-chart-3)',
    'var(--color-chart-4)', 'var(--color-chart-5)', 'var(--color-chart-6)',
    'var(--color-chart-7)', 'var(--color-chart-8)',
];

type SortKey = 'symbol' | 'quantity' | 'currentValue' | 'pnl' | 'allocationPercentage';

export default function Holdings() {
    const { data: portfolio, isLoading } = useQuery({
        queryKey: ['portfolio'],
        queryFn: fetchPortfolio,
    });

    const [sortKey, setSortKey] = useState<SortKey>('currentValue');
    const [sortAsc, setSortAsc] = useState(false);

    const holdings = portfolio?.holdings || [];

    const sorted = useMemo(() => {
        return [...holdings].sort((a, b) => {
            const valA = a[sortKey] ?? 0;
            const valB = b[sortKey] ?? 0;
            if (typeof valA === 'string') return sortAsc ? valA.localeCompare(valB as string) : (valB as string).localeCompare(valA);
            return sortAsc ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
        });
    }, [holdings, sortKey, sortAsc]);

    const toggleSort = (key: SortKey) => {
        if (sortKey === key) setSortAsc(!sortAsc);
        else { setSortKey(key); setSortAsc(false); }
    };

    const pieData = holdings.map((h) => ({
        name: h.symbol.split('.')[0],
        value: h.currentValue || 0,
    }));

    if (isLoading) {
        return (
            <div className="p-8 lg:p-10 space-y-8">
                <div className="h-8 w-32 bg-[var(--color-muted)] rounded animate-pulse" />
                <div className="h-64 bg-[var(--color-muted)] rounded-[var(--radius)] animate-pulse" />
            </div>
        );
    }

    const SortHeader = ({ label, field }: { label: string; field: SortKey }) => (
        <th
            className="py-3 px-3 text-xs font-medium text-[var(--color-muted-foreground)] cursor-pointer select-none"
            onClick={() => toggleSort(field)}
        >
            <span className="flex items-center gap-1 justify-end">
                {label}
                <ArrowUpDown className={cn('w-3 h-3', sortKey === field ? 'text-[var(--color-foreground)]' : 'opacity-40')} />
            </span>
        </th>
    );

    return (
        <div className="p-8 lg:p-10 space-y-8">
            <h1 className="text-xl font-bold tracking-tight">Holdings</h1>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Table */}
                <div className="lg:col-span-3">
                    <div className="card overflow-hidden">
                        {sorted.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-[var(--color-border)]">
                                            <th className="py-3 px-3 text-left text-xs font-medium text-[var(--color-muted-foreground)] cursor-pointer select-none" onClick={() => toggleSort('symbol')}>
                                                <span className="flex items-center gap-1">Symbol <ArrowUpDown className={cn('w-3 h-3', sortKey === 'symbol' ? 'text-[var(--color-foreground)]' : 'opacity-40')} /></span>
                                            </th>
                                            <SortHeader label="Qty" field="quantity" />
                                            <SortHeader label="Value" field="currentValue" />
                                            <SortHeader label="P&L" field="pnl" />
                                            <SortHeader label="Allocation" field="allocationPercentage" />
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sorted.map((h, i) => (
                                            <tr key={h.symbol} className="border-b border-[var(--color-border)]/50 hover:bg-[var(--color-muted)]/30 transition-colors">
                                                <td className="py-3 px-3">
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                                                            style={{ background: CHART_COLORS[i % CHART_COLORS.length] }}
                                                        >
                                                            {h.symbol.substring(0, 2)}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-sm">{h.symbol.split('.')[0]}</p>
                                                            <p className="text-xs text-[var(--color-muted-foreground)]">{h.symbol}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-3 text-right font-medium">{h.quantity}</td>
                                                <td className="py-3 px-3 text-right font-medium">{formatCurrency(h.currentValue)}</td>
                                                <td className="py-3 px-3 text-right">
                                                    <div className="flex flex-col items-end gap-0.5">
                                                        <span className={cn('font-medium', h.pnl >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-destructive)]')}>
                                                            {formatCurrency(h.pnl)}
                                                        </span>
                                                        <span className={cn('badge text-xs', h.pnl >= 0 ? 'badge-success' : 'badge-destructive')}>
                                                            {formatPercent(h.pnlPercentage)}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-3 text-right">
                                                    <div className="flex flex-col items-end gap-1">
                                                        <span className="text-sm font-medium">{h.allocationPercentage?.toFixed(1)}%</span>
                                                        <div className="w-20 h-1.5 bg-[var(--color-muted)] rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full rounded-full transition-all duration-500"
                                                                style={{
                                                                    width: `${Math.min(h.allocationPercentage || 0, 100)}%`,
                                                                    background: CHART_COLORS[i % CHART_COLORS.length],
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="py-12 text-center">
                                <p className="text-sm text-[var(--color-muted-foreground)]">No holdings yet.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Pie chart */}
                <div className="lg:col-span-1">
                    <div className="card p-5">
                        <h3 className="text-sm font-semibold mb-4">Allocation</h3>
                        {pieData.length > 0 ? (
                            <>
                                <ResponsiveContainer width="100%" height={200}>
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={50}
                                            outerRadius={80}
                                            paddingAngle={2}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {pieData.map((_, i) => (
                                                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            content={({ payload }) => {
                                                if (!payload?.length) return null;
                                                const item = payload[0];
                                                return (
                                                    <div className="card p-2 shadow-lg text-xs">
                                                        <p className="font-semibold">{item.name}</p>
                                                        <p className="text-[var(--color-muted-foreground)]">{formatCurrency(item.value as number)}</p>
                                                    </div>
                                                );
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="space-y-2.5 mt-4">
                                    {pieData.map((d, i) => (
                                        <div key={d.name} className="flex items-center gap-2 text-xs">
                                            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
                                            <span className="text-[var(--color-muted-foreground)] truncate">{d.name}</span>
                                            <span className="ml-auto font-medium">{formatCurrency(d.value)}</span>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <p className="text-xs text-[var(--color-muted-foreground)] text-center py-8">No data</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
