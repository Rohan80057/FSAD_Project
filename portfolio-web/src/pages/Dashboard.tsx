import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchPortfolio, fetchSnapshots } from '@/lib/api';
import { formatCurrency, formatPercent } from '@/lib/utils';
import PortfolioChart from '@/components/PortfolioChart';
import TradeModal from '@/components/TradeModal';
import FundsModal from '@/components/FundsModal';
import { Wallet, Plus, ChevronRight, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

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
            <div className="p-8 lg:p-10 space-y-8">
                <div className="h-9 w-48 bg-[var(--color-muted)] rounded animate-pulse" />
                <div className="h-5 w-32 bg-[var(--color-muted)] rounded animate-pulse" />
                <div className="h-[280px] bg-[var(--color-muted)] rounded-[var(--radius)] animate-pulse" />
            </div>
        );
    }

    const totalPnL = portfolio?.totalPnL || 0;
    const pnlPercent = portfolio?.totalPnLPercentage || 0;
    const isPositive = totalPnL >= 0;

    return (
        <div className="p-8 lg:p-10 space-y-8">
            {/* Header: Balance + Actions */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-[var(--color-foreground)]">
                        {formatCurrency(portfolio?.netWorth)}
                    </h1>
                    <div className="flex items-center gap-3 mt-2">
                        <span className={cn(
                            'text-sm font-medium flex items-center gap-1',
                            isPositive ? 'text-[var(--color-success)]' : 'text-[var(--color-destructive)]'
                        )}>
                            {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                            {formatCurrency(Math.abs(totalPnL))}
                        </span>
                        <span className="h-4 border-l border-[var(--color-border)]" />
                        <span className={cn(
                            'text-sm font-medium',
                            isPositive ? 'text-[var(--color-success)]' : 'text-[var(--color-destructive)]'
                        )}>
                            {formatPercent(pnlPercent)}
                        </span>
                        <span className="text-sm text-[var(--color-muted-foreground)]">All time</span>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => setFundsOpen(true)} className="btn btn-outline text-sm">
                        <Wallet className="w-4 h-4" />
                        Funds
                    </button>
                    <button onClick={() => setTradeOpen(true)} className="btn btn-primary text-sm">
                        <Plus className="w-4 h-4" />
                        Trade
                    </button>
                </div>
            </div>

            {/* Chart */}
            <div className="card p-5">
                <PortfolioChart data={chartData} />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Account Summary — 2 cols */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-base font-semibold">Account Summary</h2>

                    {/* Quick stats */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="card p-5">
                            <p className="text-xs text-[var(--color-muted-foreground)]">Cash Balance</p>
                            <p className="text-lg font-bold mt-1">{formatCurrency(portfolio?.cashBalance)}</p>
                        </div>
                        <div className="card p-5">
                            <p className="text-xs text-[var(--color-muted-foreground)]">Invested</p>
                            <p className="text-lg font-bold mt-1">{formatCurrency(portfolio?.totalInvested)}</p>
                        </div>
                        <div className="card p-5">
                            <p className="text-xs text-[var(--color-muted-foreground)]">Realized P&L</p>
                            <p className={cn('text-lg font-bold mt-1', (portfolio?.realizedPnL || 0) >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-destructive)]')}>
                                {formatCurrency(portfolio?.realizedPnL)}
                            </p>
                        </div>
                    </div>

                    {/* Top movers */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="card p-5">
                            <div className="flex items-center gap-2 mb-3">
                                <TrendingUp className="w-4 h-4 text-[var(--color-success)]" />
                                <span className="text-xs font-medium text-[var(--color-muted-foreground)]">Top Gainer</span>
                            </div>
                            {portfolio?.topGainer ? (
                                <div>
                                    <p className="text-sm font-semibold">{portfolio.topGainer.symbol}</p>
                                    <span className="badge badge-success text-xs mt-1">{formatPercent(portfolio.topGainer.pnlPercentage)}</span>
                                </div>
                            ) : (
                                <p className="text-xs text-[var(--color-muted-foreground)]">No holdings</p>
                            )}
                        </div>
                        <div className="card p-5">
                            <div className="flex items-center gap-2 mb-3">
                                <TrendingDown className="w-4 h-4 text-[var(--color-destructive)]" />
                                <span className="text-xs font-medium text-[var(--color-muted-foreground)]">Top Loser</span>
                            </div>
                            {portfolio?.topLoser ? (
                                <div>
                                    <p className="text-sm font-semibold">{portfolio.topLoser.symbol}</p>
                                    <span className="badge badge-destructive text-xs mt-1">{formatPercent(portfolio.topLoser.pnlPercentage)}</span>
                                </div>
                            ) : (
                                <p className="text-xs text-[var(--color-muted-foreground)]">No holdings</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: Holdings list — 1 col */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-base font-semibold">Holdings</h2>
                        <Link to="/holdings" className="text-xs text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] flex items-center gap-1 transition-colors">
                            View All <ChevronRight className="w-3 h-3" />
                        </Link>
                    </div>
                    <div className="card overflow-hidden">
                        {portfolio?.holdings && portfolio.holdings.length > 0 ? (
                            <div>
                                {portfolio.holdings.slice(0, 5).map((h) => (
                                    <div
                                        key={h.symbol}
                                        className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-muted)]/30 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-[var(--color-muted)] flex items-center justify-center text-xs font-bold text-[var(--color-muted-foreground)]">
                                                {h.symbol.substring(0, 2)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold">{h.symbol.split('.')[0]}</p>
                                                <p className="text-xs text-[var(--color-muted-foreground)]">{h.quantity} shares</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-semibold">{formatCurrency(h.currentValue)}</p>
                                            <span className={cn(
                                                'badge text-xs',
                                                h.pnl >= 0 ? 'badge-success' : 'badge-destructive'
                                            )}>
                                                {formatPercent(h.pnlPercentage)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="px-5 py-10 text-center">
                                <p className="text-sm text-[var(--color-muted-foreground)]">No holdings yet.</p>
                                <button onClick={() => setTradeOpen(true)} className="text-xs text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] underline-offset-4 hover:underline mt-2 inline-flex items-center gap-1">
                                    Add your first trade <ChevronRight className="w-3 h-3" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <TradeModal isOpen={tradeOpen} onClose={() => setTradeOpen(false)} onSuccess={refresh} />
            <FundsModal isOpen={fundsOpen} onClose={() => setFundsOpen(false)} onSuccess={refresh} currentBalance={portfolio?.cashBalance} />
        </div>
    );
}
