import { useState } from 'react';
import { depositFunds, withdrawFunds } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { X, Loader2, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';

interface FundsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    currentBalance?: number;
}

const QUICK_AMOUNTS = [1000, 5000, 10000, 25000, 50000, 100000];

export default function FundsModal({ isOpen, onClose, onSuccess, currentBalance }: FundsModalProps) {
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleAction = async (action: 'deposit' | 'withdraw') => {
        const val = Number(amount);
        if (!val || val <= 0) return;
        setLoading(true);
        setError('');
        try {
            if (action === 'deposit') {
                await depositFunds(val);
            } else {
                await withdrawFunds(val);
            }
            onSuccess();
            handleClose();
        } catch (e: any) {
            setError(e.message || 'Operation failed');
        }
        setLoading(false);
    };

    const handleClose = () => {
        setAmount('');
        setError('');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40" onClick={handleClose} />

            <div className="card relative w-full max-w-md p-6 shadow-xl animate-fadeIn">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-[var(--color-foreground)]">Manage Funds</h2>
                    <button onClick={handleClose} className="btn-ghost w-8 h-8 rounded-full flex items-center justify-center">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="space-y-5">
                    {/* Current balance */}
                    <div className="bg-[var(--color-muted)] rounded-[var(--radius)] p-4 text-center">
                        <p className="text-xs text-[var(--color-muted-foreground)] mb-1">Current Balance</p>
                        <p className="text-2xl font-bold text-[var(--color-foreground)]">{formatCurrency(currentBalance)}</p>
                    </div>

                    {/* Quick amounts */}
                    <div>
                        <label className="block text-xs font-medium text-[var(--color-muted-foreground)] mb-2">Quick Select</label>
                        <div className="grid grid-cols-3 gap-2">
                            {QUICK_AMOUNTS.map((a) => (
                                <button
                                    key={a}
                                    onClick={() => setAmount(String(a))}
                                    className={`btn-outline text-xs py-2 ${Number(amount) === a ? 'bg-[var(--color-secondary)] border-[var(--color-ring)]' : ''
                                        }`}
                                >
                                    ₹{a.toLocaleString('en-IN')}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Custom amount */}
                    <div>
                        <label className="block text-xs font-medium text-[var(--color-muted-foreground)] mb-1.5">Amount</label>
                        <input
                            className="input"
                            type="number"
                            min="1"
                            placeholder="Enter amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>

                    {/* Error */}
                    {error && (
                        <p className="text-sm text-[var(--color-destructive)] bg-[var(--color-destructive-light)] p-2 rounded-[var(--radius)]">
                            {error}
                        </p>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-1">
                        <button
                            onClick={() => handleAction('deposit')}
                            disabled={loading || !amount}
                            className="btn flex-1 bg-[var(--color-success)] text-white disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                                <>
                                    <ArrowDownCircle className="w-4 h-4" />
                                    Deposit
                                </>
                            )}
                        </button>
                        <button
                            onClick={() => handleAction('withdraw')}
                            disabled={loading || !amount}
                            className="btn flex-1 bg-[var(--color-destructive)] text-white disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                                <>
                                    <ArrowUpCircle className="w-4 h-4" />
                                    Withdraw
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
