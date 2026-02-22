import { useState } from 'react';
import { X, ArrowDownToLine, ArrowUpFromLine, Loader2, Wallet } from 'lucide-react';
import { apiFetch } from '../../utils/api';
import { toast } from 'sonner';

interface FundsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    cashBalance: number;
}

export function FundsModal({ isOpen, onClose, onSuccess, cashBalance }: FundsModalProps) {
    const [mode, setMode] = useState<'DEPOSIT' | 'WITHDRAW'>('DEPOSIT');
    const [amount, setAmount] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const parsedAmount = parseFloat(amount) || 0;
    const canWithdraw = mode === 'WITHDRAW' ? parsedAmount <= cashBalance : true;

    const handleSubmit = async () => {
        if (parsedAmount <= 0) return;
        setIsSubmitting(true);
        try {
            const endpoint = mode === 'DEPOSIT' ? '/funds/deposit' : '/funds/withdraw';
            await apiFetch(`${endpoint}?amount=${parsedAmount}`, { method: 'POST' });
            toast.success(`${mode === 'DEPOSIT' ? 'Deposited' : 'Withdrawn'} $${parsedAmount.toLocaleString()}`);
            setAmount('');
            onSuccess();
            onClose();
        } catch (err: any) {
            toast.error(err.message || `Failed to ${mode.toLowerCase()}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    const presets = [1000, 5000, 10000, 25000];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-background border border-border w-full max-w-md mx-4 shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <div className="flex items-center gap-2">
                        <Wallet size={20} />
                        <h2 className="text-xl tracking-tight font-medium">Manage Funds</h2>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-muted transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Current Balance */}
                    <div className="border border-border p-4 bg-muted/30 text-center">
                        <div className="text-sm text-muted-foreground mb-1">Current Cash Balance</div>
                        <div className="text-3xl tracking-tight font-medium">
                            ${cashBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </div>
                    </div>

                    {/* Mode Toggle */}
                    <div className="flex border border-border">
                        <button
                            onClick={() => setMode('DEPOSIT')}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${mode === 'DEPOSIT' ? 'bg-emerald-600 text-white' : 'hover:bg-muted'
                                }`}
                        >
                            <ArrowDownToLine size={16} />
                            Deposit
                        </button>
                        <button
                            onClick={() => setMode('WITHDRAW')}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${mode === 'WITHDRAW' ? 'bg-red-600 text-white' : 'hover:bg-muted'
                                }`}
                        >
                            <ArrowUpFromLine size={16} />
                            Withdraw
                        </button>
                    </div>

                    {/* Amount Input */}
                    <div className="space-y-2">
                        <label className="text-sm text-muted-foreground tracking-wide">AMOUNT ($)</label>
                        <input
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            className="w-full px-4 py-3 border border-border bg-background focus:outline-none focus:ring-1 focus:ring-foreground text-2xl text-center"
                        />
                    </div>

                    {/* Quick Presets */}
                    <div className="grid grid-cols-4 gap-2">
                        {presets.map((preset) => (
                            <button
                                key={preset}
                                onClick={() => setAmount(preset.toString())}
                                className="py-2 text-sm border border-border hover:bg-muted transition-colors"
                            >
                                ${preset >= 1000 ? `${preset / 1000}K` : preset}
                            </button>
                        ))}
                    </div>

                    {/* Validation */}
                    {mode === 'WITHDRAW' && !canWithdraw && parsedAmount > 0 && (
                        <p className="text-sm text-destructive text-center">
                            Insufficient balance. Max: ${cashBalance.toFixed(2)}
                        </p>
                    )}

                    {/* Submit */}
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || parsedAmount <= 0 || (mode === 'WITHDRAW' && !canWithdraw)}
                        className={`w-full py-4 text-lg font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${mode === 'DEPOSIT'
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                : 'bg-red-600 hover:bg-red-700 text-white'
                            }`}
                    >
                        {isSubmitting ? (
                            <span className="flex items-center justify-center gap-2">
                                <Loader2 size={18} className="animate-spin" />
                                Processing...
                            </span>
                        ) : (
                            `${mode === 'DEPOSIT' ? 'Deposit' : 'Withdraw'} $${parsedAmount > 0 ? parsedAmount.toLocaleString() : '0'}`
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
