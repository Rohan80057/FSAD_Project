import { useQuery } from '@tanstack/react-query';
import { fetchTransactions } from '@/lib/api';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight, Gift, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';
import { cn } from '@/lib/utils';

const typeConfig: Record<string, { icon: typeof ArrowUpRight; color: string; bg: string; label: string }> = {
    BUY: { icon: ArrowUpRight, color: 'text-[var(--color-success)]', bg: 'bg-[var(--color-success)]/15', label: 'Buy' },
    SELL: { icon: ArrowDownRight, color: 'text-[var(--color-danger)]', bg: 'bg-[var(--color-danger)]/15', label: 'Sell' },
    DIVIDEND: { icon: Gift, color: 'text-[var(--color-accent)]', bg: 'bg-[var(--color-accent)]/15', label: 'Dividend' },
    DEPOSIT: { icon: ArrowDownToLine, color: 'text-[var(--color-success)]', bg: 'bg-[var(--color-success)]/15', label: 'Deposit' },
    WITHDRAWAL: { icon: ArrowUpFromLine, color: 'text-[var(--color-warning)]', bg: 'bg-[var(--color-warning)]/15', label: 'Withdrawal' },
};

export default function Activity() {
    const { data: transactions, isLoading } = useQuery({
        queryKey: ['transactions'],
        queryFn: fetchTransactions,
    });

    if (isLoading) {
        return (
            <div className="space-y-3">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="glass rounded-xl p-5 h-16 animate-pulse" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Activity</h1>
                <p className="text-sm text-[var(--color-muted-foreground)] mt-1">
                    {transactions?.length || 0} transaction{(transactions?.length || 0) !== 1 ? 's' : ''}
                </p>
            </div>

            {!transactions || transactions.length === 0 ? (
                <div className="glass rounded-xl p-12 text-center animate-fadeIn">
                    <p className="text-[var(--color-muted-foreground)]">No transactions yet. Make your first trade!</p>
                </div>
            ) : (
                <div className="space-y-2">
                    {transactions.map((t, i) => {
                        const config = typeConfig[t.type] || typeConfig.BUY;
                        const Icon = config.icon;
                        return (
                            <div
                                key={t.id}
                                className="glass rounded-xl p-4 flex items-center justify-between hover:border-[var(--color-accent)]/20 transition-all animate-slideIn"
                                style={{ animationDelay: `${i * 30}ms` }}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', config.bg)}>
                                        <Icon className={cn('w-5 h-5', config.color)} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold">{t.symbol}</span>
                                            <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', config.bg, config.color)}>
                                                {config.label}
                                            </span>
                                        </div>
                                        <p className="text-xs text-[var(--color-muted-foreground)] mt-0.5">{formatDateTime(t.timestamp)}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold">{formatCurrency(t.price * t.quantity)}</p>
                                    <p className="text-xs text-[var(--color-muted-foreground)]">
                                        {t.quantity} × {formatCurrency(t.price)}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
