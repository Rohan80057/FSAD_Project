import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { ReactNode } from 'react';

interface SummaryCardProps {
    label: string;
    value: string;
    change?: string;
    changeValue?: number;
    icon?: ReactNode;
    className?: string;
}

export default function SummaryCard({ label, value, change, changeValue, icon, className }: SummaryCardProps) {
    const isPositive = changeValue != null && changeValue > 0;
    const isNegative = changeValue != null && changeValue < 0;

    return (
        <div
            className={cn(
                'glass rounded-xl p-5 animate-fadeIn transition-all duration-300 hover:scale-[1.02] hover:border-[var(--color-accent)]/30',
                className
            )}
        >
            <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-[var(--color-muted-foreground)]">{label}</span>
                {icon && <div className="text-[var(--color-muted-foreground)]">{icon}</div>}
            </div>
            <p className="text-2xl font-bold tracking-tight">{value}</p>
            {change && (
                <div className="flex items-center gap-1 mt-2">
                    {isPositive && <TrendingUp className="w-3.5 h-3.5 text-[var(--color-success)]" />}
                    {isNegative && <TrendingDown className="w-3.5 h-3.5 text-[var(--color-danger)]" />}
                    {!isPositive && !isNegative && <Minus className="w-3.5 h-3.5 text-[var(--color-muted-foreground)]" />}
                    <span
                        className={cn(
                            'text-sm font-medium',
                            isPositive && 'text-[var(--color-success)]',
                            isNegative && 'text-[var(--color-danger)]',
                            !isPositive && !isNegative && 'text-[var(--color-muted-foreground)]'
                        )}
                    >
                        {change}
                    </span>
                </div>
            )}
        </div>
    );
}
