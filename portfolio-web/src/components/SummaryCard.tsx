import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface SummaryCardProps {
    label: string;
    value: string;
    change?: string;
    changeValue?: number;
    icon?: ReactNode;
}

export default function SummaryCard({ label, value, change, changeValue, icon }: SummaryCardProps) {
    const isPositive = (changeValue ?? 0) >= 0;

    return (
        <div className="card p-4 transition-shadow duration-150">
            <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1">
                    <p className="text-xs font-medium text-[var(--color-muted-foreground)]">{label}</p>
                    <p className="text-xl font-bold tracking-tight text-[var(--color-foreground)]">{value}</p>
                    {change && (
                        <span
                            className={cn(
                                'badge text-xs mt-1',
                                isPositive ? 'badge-success' : 'badge-destructive'
                            )}
                        >
                            {isPositive ? '↑' : '↓'} {change}
                        </span>
                    )}
                </div>
                {icon && (
                    <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[var(--color-muted)]">
                        <span className="text-[var(--color-muted-foreground)]">{icon}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
