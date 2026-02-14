import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
    return clsx(inputs);
}

export function formatCurrency(value: number | undefined | null, currency = 'INR'): string {
    if (value == null) return '₹0.00';
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
}

export function formatPercent(value: number | undefined | null): string {
    if (value == null) return '0.00%';
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
}

export function formatNumber(value: number | undefined | null): string {
    if (value == null) return '0';
    return new Intl.NumberFormat('en-IN').format(value);
}

export function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

export function formatDateTime(dateString: string): string {
    return new Date(dateString).toLocaleString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}
