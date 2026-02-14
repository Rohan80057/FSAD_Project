import { useQuery } from '@tanstack/react-query';
import { fetchTransactions } from '@/lib/api';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import {
    ArrowDownCircle, ArrowUpCircle, ShoppingCart, DollarSign,
    Banknote, ArrowLeftRight
} from 'lucide-react';

const typeConfig: Record<string, { icon: any; label: string; color: string }> = {
    BUY: { icon: ShoppingCart, label: 'Buy', color: 'text-[var(--color-success)]' },
    SELL: { icon: ArrowUpCircle, label: 'Sell', color: 'text-[var(--color-destructive)]' },
    DEPOSIT: { icon: ArrowDownCircle, label: 'Deposit', color: 'text-[var(--color-accent)]' },
    WITHDRAWAL: { icon: ArrowUpCircle, label: 'Withdrawal', color: 'text-[var(--color-warning)]' },
    DIVIDEND: { icon: DollarSign, label: 'Dividend', color: 'text-[var(--color-success)]' },
};

export default function Activity() {
    const { data: transactions, isLoading } = useQuery({
        queryKey: ['transactions'],
        queryFn: fetchTransactions,
    });

    if (isLoading) {
        return (
            <div className="p-8 lg:p-10 space-y-8">
                <div className="h-8 w-32 bg-[var(--color-muted)] rounded animate-pulse" />
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 bg-[var(--color-muted)] rounded-[var(--radius)] animate-pulse" />
                ))}
            </div>
        );
    }

    return (
        <div className="p-8 lg:p-10 space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold tracking-tight">Activity</h1>
                <span className="badge badge-muted text-xs">
                    {transactions?.length || 0} transactions
                </span>
            </div>

            <div className="card overflow-hidden">
                {transactions && transactions.length > 0 ? (
                    <div>
                        {transactions.map((tx) => {
                            const config = typeConfig[tx.type] || { icon: ArrowLeftRight, label: tx.type, color: 'text-[var(--color-muted-foreground)]' };
                            const Icon = config.icon;
                            const isBuyOrDeposit = tx.type === 'BUY' || tx.type === 'DEPOSIT' || tx.type === 'DIVIDEND';

                            return (
                                <div
                                    key={tx.id}
                                    className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]/50 last:border-0 hover:bg-[var(--color-muted)]/20 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={cn('w-9 h-9 rounded-lg bg-[var(--color-muted)] flex items-center justify-center', config.color)}>
                                            <Icon className="w-4.5 h-4.5" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-semibold">{config.label}</p>
                                                {tx.symbol && (
                                                    <span className="badge badge-muted text-xs">{tx.symbol}</span>
                                                )}
                                            </div>
                                            <p className="text-xs text-[var(--color-muted-foreground)]">
                                                {formatDate(tx.timestamp)}
                                                {tx.quantity ? ` · ${tx.quantity} shares` : ''}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={cn(
                                            'text-sm font-semibold',
                                            isBuyOrDeposit ? 'text-[var(--color-success)]' : 'text-[var(--color-destructive)]'
                                        )}>
                                            {isBuyOrDeposit ? '+' : '-'}{formatCurrency(tx.price * (tx.quantity || 1))}
                                        </p>
                                        {tx.price > 0 && tx.quantity && (
                                            <p className="text-xs text-[var(--color-muted-foreground)]">
                                                @ {formatCurrency(tx.price)}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="py-12 text-center">
                        <Banknote className="w-10 h-10 text-[var(--color-muted-foreground)] mx-auto mb-3" />
                        <p className="text-sm text-[var(--color-muted-foreground)]">No transactions yet.</p>
                        <p className="text-xs text-[var(--color-muted-foreground)] mt-1">Make a trade or deposit funds to get started.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
