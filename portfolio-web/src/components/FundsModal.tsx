import { useState } from 'react';
import { X, ArrowDownToLine, ArrowUpFromLine, Loader2 } from 'lucide-react';
import { depositFunds, withdrawFunds } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

interface FundsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    currentBalance?: number;
}

export default function FundsModal({ isOpen, onClose, onSuccess, currentBalance }: FundsModalProps) {
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleFunds = async (action: 'deposit' | 'withdraw') => {
        const val = parseFloat(amount);
        if (!val || val <= 0) {
            setError('Enter a valid amount');
            return;
        }
        setLoading(true);
        setError('');
        try {
            if (action === 'deposit') {
                await depositFunds(val);
            } else {
                await withdrawFunds(val);
            }
            onSuccess();
            onClose();
            setAmount('');
        } catch (err: any) {
            setError(err.message || `${action} failed`);
        } finally {
            setLoading(false);
        }
    };

    const quickAmounts = [1000, 5000, 10000, 50000, 100000];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative glass rounded-2xl p-6 w-full max-w-md animate-fadeIn">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">Manage Funds</h2>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[var(--color-muted)] transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {currentBalance != null && (
                    <div className="mb-5 p-4 rounded-xl bg-[var(--color-muted)]/50 border border-[var(--color-border)]">
                        <p className="text-sm text-[var(--color-muted-foreground)]">Current Balance</p>
                        <p className="text-xl font-bold">{formatCurrency(currentBalance)}</p>
                    </div>
                )}

                <div className="mb-4">
                    <label className="text-sm text-[var(--color-muted-foreground)] mb-1.5 block">Amount (₹)</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter amount"
                        min="1"
                        className="w-full bg-[var(--color-muted)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--color-accent)] transition-colors"
                    />
                </div>

                {/* Quick Amount Buttons */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {quickAmounts.map((qa) => (
                        <button
                            key={qa}
                            onClick={() => setAmount(qa.toString())}
                            className="px-3 py-1.5 text-xs rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-muted)] transition-colors text-[var(--color-muted-foreground)]"
                        >
                            ₹{qa.toLocaleString('en-IN')}
                        </button>
                    ))}
                </div>

                {error && (
                    <div className="mb-4 p-3 rounded-lg bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/20">
                        <p className="text-sm text-[var(--color-danger)]">{error}</p>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => handleFunds('deposit')}
                        disabled={loading}
                        className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[var(--color-success)] text-white font-semibold text-sm hover:brightness-110 transition-all disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowDownToLine className="w-4 h-4" />}
                        Deposit
                    </button>
                    <button
                        onClick={() => handleFunds('withdraw')}
                        disabled={loading}
                        className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[var(--color-warning)] text-white font-semibold text-sm hover:brightness-110 transition-all disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowUpFromLine className="w-4 h-4" />}
                        Withdraw
                    </button>
                </div>
            </div>
        </div>
    );
}
