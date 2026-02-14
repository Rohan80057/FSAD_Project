import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchPortfolio, fetchSnapshots } from '@/lib/api';
import { formatCurrency, formatPercent } from '@/lib/utils';
import SummaryCard from '@/components/SummaryCard';
import PortfolioChart from '@/components/PortfolioChart';
import TradeModal from '@/components/TradeModal';
import FundsModal from '@/components/FundsModal';
import { Wallet, TrendingUp, PiggyBank, BarChart3, Plus, ArrowLeftRight } from 'lucide-react';

export default function Dashboard() {
    const queryClient = useQueryClient();
    const [tradeOpen, setTradeOpen] = useState(false);
    const [fundsOpen, setFundsOpen] = useState(false);

    const { data: portfolio, isLoading } = useQuery({
        queryKey: ['portfolio'],
        queryFn: fetchPortfolio,
    });

    const { data: snapshots } = useQuery({
        queryKey: ['snapshots'],
        queryFn: fetchSnapshots,
    });

    const chartData = (snapshots || []).map((s) => ({
        date: s.date,
        value: s.totalValue,
    }));

    const refresh = () => {
        queryClient.invalidateQueries({ queryKey: ['portfolio'] });
        queryClient.invalidateQueries({ queryKey: ['snapshots'] });
        queryClient.invalidateQueries({ queryKey: ['transactions'] });
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="glass rounded-xl p-5 h-28 animate-pulse" />
                    ))}
                </div>
                <div className="glass rounded-xl p-6 h-72 animate-pulse" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-sm text-[var(--color-muted-foreground)] mt-1">Your portfolio at a glance</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setFundsOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl border border-[var(--color-border)] hover:bg-[var(--color-muted)] transition-colors"
                    >
                        <Wallet className="w-4 h-4" />
                        Funds
                    </button>
                    <button
                        onClick={() => setTradeOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-[var(--color-accent)] text-white hover:brightness-110 transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        Trade
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <SummaryCard
                    label="Net Worth"
                    value={formatCurrency(portfolio?.netWorth)}
                    icon={<TrendingUp className="w-5 h-5" />}
                />
                <SummaryCard
                    label="Cash Balance"
                    value={formatCurrency(portfolio?.cashBalance)}
                    icon={<Wallet className="w-5 h-5" />}
                />
                <SummaryCard
                    label="Invested"
                    value={formatCurrency(portfolio?.totalInvested)}
                    icon={<PiggyBank className="w-5 h-5" />}
                />
                <SummaryCard
                    label="Total P&L"
                    value={formatCurrency(portfolio?.totalPnL)}
                    change={formatPercent(portfolio?.totalPnLPercentage)}
                    changeValue={portfolio?.totalPnL}
                    icon={<BarChart3 className="w-5 h-5" />}
                />
            </div>

            {/* Portfolio Chart */}
            <PortfolioChart data={chartData} />

            {/* Top Gainer / Loser + Realized PnL */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="glass rounded-xl p-5 animate-fadeIn">
                    <p className="text-sm text-[var(--color-muted-foreground)] mb-2">Top Gainer</p>
                    {portfolio?.topGainer ? (
                        <div>
                            <p className="text-lg font-bold text-[var(--color-success)]">{portfolio.topGainer.symbol}</p>
                            <p className="text-sm text-[var(--color-success)]">{formatPercent(portfolio.topGainer.pnlPercentage)}</p>
                        </div>
                    ) : (
                        <p className="text-sm text-[var(--color-muted-foreground)]">No holdings</p>
                    )}
                </div>
                <div className="glass rounded-xl p-5 animate-fadeIn">
                    <p className="text-sm text-[var(--color-muted-foreground)] mb-2">Top Loser</p>
                    {portfolio?.topLoser ? (
                        <div>
                            <p className="text-lg font-bold text-[var(--color-danger)]">{portfolio.topLoser.symbol}</p>
                            <p className="text-sm text-[var(--color-danger)]">{formatPercent(portfolio.topLoser.pnlPercentage)}</p>
                        </div>
                    ) : (
                        <p className="text-sm text-[var(--color-muted-foreground)]">No holdings</p>
                    )}
                </div>
                <div className="glass rounded-xl p-5 animate-fadeIn">
                    <p className="text-sm text-[var(--color-muted-foreground)] mb-2">Realized P&L</p>
                    <p className={`text-lg font-bold ${(portfolio?.realizedPnL || 0) >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}`}>
                        {formatCurrency(portfolio?.realizedPnL)}
                    </p>
                </div>
            </div>

            {/* Holdings Quick View */}
            {portfolio?.holdings && portfolio.holdings.length > 0 && (
                <div className="glass rounded-xl p-6 animate-fadeIn">
                    <h3 className="text-lg font-semibold mb-4">Holdings Overview</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-[var(--color-border)]">
                                    <th className="text-left py-3 px-2 text-[var(--color-muted-foreground)] font-medium">Symbol</th>
                                    <th className="text-right py-3 px-2 text-[var(--color-muted-foreground)] font-medium">Qty</th>
                                    <th className="text-right py-3 px-2 text-[var(--color-muted-foreground)] font-medium">LTP</th>
                                    <th className="text-right py-3 px-2 text-[var(--color-muted-foreground)] font-medium">Value</th>
                                    <th className="text-right py-3 px-2 text-[var(--color-muted-foreground)] font-medium">P&L</th>
                                    <th className="text-right py-3 px-2 text-[var(--color-muted-foreground)] font-medium">Allocation</th>
                                </tr>
                            </thead>
                            <tbody>
                                {portfolio.holdings.map((h) => (
                                    <tr key={h.symbol} className="border-b border-[var(--color-border)]/50 hover:bg-[var(--color-muted)]/30 transition-colors">
                                        <td className="py-3 px-2 font-semibold">{h.symbol}</td>
                                        <td className="py-3 px-2 text-right">{h.quantity}</td>
                                        <td className="py-3 px-2 text-right">{formatCurrency(h.currentPrice)}</td>
                                        <td className="py-3 px-2 text-right">{formatCurrency(h.currentValue)}</td>
                                        <td className={`py-3 px-2 text-right font-medium ${h.pnl >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]'}`}>
                                            {formatCurrency(h.pnl)} ({formatPercent(h.pnlPercentage)})
                                        </td>
                                        <td className="py-3 px-2 text-right text-[var(--color-muted-foreground)]">
                                            {h.allocationPercentage?.toFixed(1)}%
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <TradeModal isOpen={tradeOpen} onClose={() => setTradeOpen(false)} onSuccess={refresh} />
            <FundsModal isOpen={fundsOpen} onClose={() => setFundsOpen(false)} onSuccess={refresh} currentBalance={portfolio?.cashBalance} />
        </div>
    );
}
