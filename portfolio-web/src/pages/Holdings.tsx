import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchPortfolio } from '@/lib/api';
import { formatCurrency, formatPercent } from '@/lib/utils';
import TradeModal from '@/components/TradeModal';
import { Plus, ArrowUpDown } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#22c55e', '#f59e0b', '#ef4444', '#ec4899'];

export default function Holdings() {
    const queryClient = useQueryClient();
    const [tradeOpen, setTradeOpen] = useState(false);
    const [sortBy, setSortBy] = useState<'value' | 'pnl' | 'symbol'>('value');

    const { data: portfolio, isLoading } = useQuery({
        queryKey: ['portfolio'],
        queryFn: fetchPortfolio,
    });

    const refresh = () => queryClient.invalidateQueries({ queryKey: ['portfolio'] });

    const holdings = [...(portfolio?.holdings || [])].sort((a, b) => {
        if (sortBy === 'value') return b.currentValue - a.currentValue;
        if (sortBy === 'pnl') return b.pnlPercentage - a.pnlPercentage;
        return a.symbol.localeCompare(b.symbol);
    });

    const pieData = holdings.map((h) => ({
        name: h.symbol,
        value: h.currentValue,
    }));

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="glass rounded-xl p-5 h-16 animate-pulse" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Holdings</h1>
                    <p className="text-sm text-[var(--color-muted-foreground)] mt-1">
                        {holdings.length} asset{holdings.length !== 1 ? 's' : ''} · {formatCurrency(portfolio?.totalValue)} total
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setSortBy(sortBy === 'value' ? 'pnl' : sortBy === 'pnl' ? 'symbol' : 'value')}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl border border-[var(--color-border)] hover:bg-[var(--color-muted)] transition-colors"
                    >
                        <ArrowUpDown className="w-4 h-4" />
                        Sort: {sortBy}
                    </button>
                    <button
                        onClick={() => setTradeOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-[var(--color-accent)] text-white hover:brightness-110 transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        Add Trade
                    </button>
                </div>
            </div>

            {/* Allocation Pie Chart */}
            {pieData.length > 0 && (
                <div className="glass rounded-xl p-6 animate-fadeIn">
                    <h3 className="text-lg font-semibold mb-4">Allocation</h3>
                    <div className="flex items-center gap-8">
                        <div className="w-48 h-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={80}
                                        paddingAngle={2}
                                        dataKey="value"
                                    >
                                        {pieData.map((_, i) => (
                                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            background: '#18181b',
                                            border: '1px solid #27272a',
                                            borderRadius: '8px',
                                            color: '#fafafa',
                                            fontSize: '13px',
                                        }}
                                        formatter={(value: number) => formatCurrency(value)}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {pieData.map((entry, i) => (
                                <div key={entry.name} className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                                    <span className="text-sm text-[var(--color-muted-foreground)]">{entry.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Holdings Table */}
            {holdings.length === 0 ? (
                <div className="glass rounded-xl p-12 text-center animate-fadeIn">
                    <p className="text-[var(--color-muted-foreground)]">No holdings yet. Start by adding a trade!</p>
                </div>
            ) : (
                <div className="glass rounded-xl overflow-hidden animate-fadeIn">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-[var(--color-border)]">
                                    <th className="text-left py-4 px-5 text-[var(--color-muted-foreground)] font-medium">Asset</th>
                                    <th className="text-right py-4 px-5 text-[var(--color-muted-foreground)] font-medium">Qty</th>
                                    <th className="text-right py-4 px-5 text-[var(--color-muted-foreground)] font-medium">Avg Price</th>
                                    <th className="text-right py-4 px-5 text-[var(--color-muted-foreground)] font-medium">Current</th>
                                    <th className="text-right py-4 px-5 text-[var(--color-muted-foreground)] font-medium">Value</th>
                                    <th className="text-right py-4 px-5 text-[var(--color-muted-foreground)] font-medium">P&L</th>
                                    <th className="text-right py-4 px-5 text-[var(--color-muted-foreground)] font-medium">Alloc %</th>
                                </tr>
                            </thead>
                            <tbody>
                                {holdings.map((h, i) => (
                                    <tr
                                        key={h.symbol}
                                        className="border-b border-[var(--color-border)]/50 hover:bg-[var(--color-muted)]/30 transition-colors animate-slideIn"
                                        style={{ animationDelay: `${i * 50}ms` }}
                                    >
                                        <td className="py-4 px-5">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                                                    style={{ background: COLORS[i % COLORS.length] }}
                                                >
                                                    {h.symbol.slice(0, 2)}
                                                </div>
                                                <span className="font-semibold">{h.symbol}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-5 text-right">{h.quantity}</td>
                                        <td className="py-4 px-5 text-right text-[var(--color-muted-foreground)]">{formatCurrency(h.averagePrice)}</td>
                                        <td className="py-4 px-5 text-right">{formatCurrency(h.currentPrice)}</td>
                                        <td className="py-4 px-5 text-right font-medium">{formatCurrency(h.currentValue)}</td>
                                        <td className={`py-4 px-5 text-right font-medium ${h.pnl >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}`}>
                                            <div className="flex flex-col items-end">
                                                <span>{formatCurrency(h.pnl)}</span>
                                                <span className="text-xs">{formatPercent(h.pnlPercentage)}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-5 text-right text-[var(--color-muted-foreground)]">
                                            <div className="flex items-center justify-end gap-2">
                                                <div className="w-16 h-1.5 bg-[var(--color-muted)] rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full"
                                                        style={{
                                                            width: `${Math.min(h.allocationPercentage || 0, 100)}%`,
                                                            background: COLORS[i % COLORS.length],
                                                        }}
                                                    />
                                                </div>
                                                <span className="text-xs">{h.allocationPercentage?.toFixed(1)}%</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <TradeModal isOpen={tradeOpen} onClose={() => setTradeOpen(false)} onSuccess={refresh} />
        </div>
    );
}
