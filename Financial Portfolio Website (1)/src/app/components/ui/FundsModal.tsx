import React, { useState } from 'react';
import { X, DollarSign, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { apiFetch } from '../../../utils/api';
import { toast } from 'sonner';

interface FundsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    currentBalance: number;
}

export function FundsModal({ isOpen, onClose, onSuccess, currentBalance }: FundsModalProps) {
    const [amount, setAmount] = useState('');
    const [action, setAction] = useState<'deposit' | 'withdraw'>('deposit');
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            toast.error('Please enter a valid positive amount.');
            return;
        }

        const numAmount = Number(amount);

        if (action === 'withdraw' && numAmount > currentBalance) {
            toast.error('Insufficient funds for this withdrawal.');
            return;
        }

        setIsLoading(true);
        try {
            const endpoint = action === 'deposit' ? '/funds/deposit' : '/funds/withdraw';
            await apiFetch(`${endpoint}?amount=${numAmount}`, {
                method: 'POST',
            });

            toast.success(`Successfully ${action === 'deposit' ? 'deposited' : 'withdrew'} $${numAmount.toLocaleString()}`);
            onSuccess();
            onClose();
            setAmount('');
        } catch (error: any) {
            toast.error(error.message || `Failed to ${action} funds.`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="bg-card border border-border w-full max-w-md animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center p-6 border-b border-border">
                    <h2 className="text-xl tracking-tight">Manage Funds</h2>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    <div className="flex bg-muted/50 p-1 mb-6">
                        <button
                            type="button"
                            className={`flex-1 py-2 text-sm font-medium transition-colors flex items-center justify-center ${action === 'deposit' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'
                                }`}
                            onClick={() => setAction('deposit')}
                        >
                            <ArrowDownLeft size={16} className="mr-2 text-success" />
                            Deposit
                        </button>
                        <button
                            type="button"
                            className={`flex-1 py-2 text-sm font-medium transition-colors flex items-center justify-center ${action === 'withdraw' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'
                                }`}
                            onClick={() => setAction('withdraw')}
                        >
                            <ArrowUpRight size={16} className="mr-2 text-destructive" />
                            Withdraw
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <div className="flex justify-between items-end mb-2">
                                <label className="text-sm font-medium text-muted-foreground">Amount</label>
                                <span className="text-xs text-muted-foreground">
                                    Available: ${currentBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                            </div>
                            <div className="relative">
                                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0.00"
                                    step="0.01"
                                    min="0"
                                    required
                                    className="w-full pl-12 pr-4 py-3 bg-background border border-border focus:outline-none focus:ring-1 focus:ring-primary font-mono text-lg"
                                    autoFocus
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || !amount || Number(amount) <= 0 || (action === 'withdraw' && Number(amount) > currentBalance)}
                            className="w-full py-4 bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                            ) : (
                                action === 'deposit' ? 'Confirm Deposit' : 'Confirm Withdrawal'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
