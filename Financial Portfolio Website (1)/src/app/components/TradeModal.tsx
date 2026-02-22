import { useState, useEffect } from 'react';
import { X, Search, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import { apiFetch } from '../../utils/api';
import { toast } from 'sonner';

interface TradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    mode: 'BUY' | 'SELL';
    prefillSymbol?: string;
    prefillQuantity?: number;
    cashBalance?: number;
}

export function TradeModal({ isOpen, onClose, onSuccess, mode, prefillSymbol, prefillQuantity, cashBalance = 0 }: TradeModalProps) {
    const [symbol, setSymbol] = useState(prefillSymbol || '');
    const [quantity, setQuantity] = useState(prefillQuantity?.toString() || '');
    const [price, setPrice] = useState<number | null>(null);
    const [isLookingUp, setIsLookingUp] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [lookupError, setLookupError] = useState('');

    useEffect(() => {
        if (prefillSymbol) {
            setSymbol(prefillSymbol);
            lookupPrice(prefillSymbol);
        }
        if (prefillQuantity) {
            setQuantity(prefillQuantity.toString());
        }
    }, [prefillSymbol, prefillQuantity]);

    useEffect(() => {
        if (!isOpen) {
            if (!prefillSymbol) setSymbol('');
            if (!prefillQuantity) setQuantity('');
            setPrice(null);
            setLookupError('');
        }
    }, [isOpen]);

    const lookupPrice = async (ticker: string) => {
        if (!ticker.trim()) return;
        setIsLookingUp(true);
        setLookupError('');
        try {
            const data = await apiFetch(`/market/quote/${ticker.toUpperCase()}`);
            if (data?.price) {
                setPrice(Number(data.price));
            } else {
                setLookupError('Ticker not found');
                setPrice(null);
            }
        } catch {
            setLookupError('Failed to fetch price');
            setPrice(null);
        } finally {
            setIsLookingUp(false);
        }
    };

    const totalCost = price && quantity ? price * parseInt(quantity) : 0;
    const canAfford = mode === 'BUY' ? totalCost <= cashBalance : true;

    const handleSubmit = async () => {
        if (!symbol.trim() || !quantity || parseInt(quantity) <= 0 || !price) return;
        setIsSubmitting(true);
        try {
            const endpoint = mode === 'BUY' ? '/trade/buy' : '/trade/sell';
            const url = `${endpoint}?symbol=${symbol.toUpperCase()}&quantity=${parseInt(quantity)}`;
            await apiFetch(url, { method: 'POST' });
            toast.success(`${mode === 'BUY' ? 'Bought' : 'Sold'} ${quantity} shares of ${symbol.toUpperCase()}`);
            onSuccess();
            onClose();
        } catch (err: any) {
            toast.error(err.message || `Failed to ${mode.toLowerCase()}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    const isBuy = mode === 'BUY';

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-background border border-border w-full max-w-md mx-4 shadow-2xl">
                {/* Header */}
                <div className={`flex items-center justify-between p-6 border-b border-border ${isBuy ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                    <h2 className="text-xl tracking-tight font-medium">
                        {isBuy ? '📈 Buy Stock' : '📉 Sell Stock'}
                    </h2>
                    <button onClick={onClose} className="p-1 hover:bg-muted transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Symbol Input */}
                    <div className="space-y-2">
                        <label className="text-sm text-muted-foreground tracking-wide">STOCK SYMBOL</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={symbol}
                                onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                                placeholder="e.g. AAPL, MSFT, GOOGL"
                                className="flex-1 px-4 py-3 border border-border bg-background focus:outline-none focus:ring-1 focus:ring-foreground text-lg tracking-wide"
                                disabled={!!prefillSymbol}
                            />
                            <button
                                onClick={() => lookupPrice(symbol)}
                                disabled={isLookingUp || !symbol.trim()}
                                className="px-4 py-3 border border-border hover:bg-muted transition-colors disabled:opacity-50"
                            >
                                {isLookingUp ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
                            </button>
                        </div>
                        {lookupError && <p className="text-sm text-destructive">{lookupError}</p>}
                    </div>

                    {/* Live Price */}
                    {price !== null && (
                        <div className="border border-border p-4 bg-muted/30">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">{symbol.toUpperCase()} Current Price</span>
                                <span className="text-2xl tracking-tight font-medium">${price.toFixed(2)}</span>
                            </div>
                        </div>
                    )}

                    {/* Quantity */}
                    <div className="space-y-2">
                        <label className="text-sm text-muted-foreground tracking-wide">QUANTITY</label>
                        <input
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            placeholder="Number of shares"
                            className="w-full px-4 py-3 border border-border bg-background focus:outline-none focus:ring-1 focus:ring-foreground text-lg"
                        />
                    </div>

                    {/* Cost Summary */}
                    {price && quantity && parseInt(quantity) > 0 && (
                        <div className="border border-border divide-y divide-border">
                            <div className="flex items-center justify-between p-4">
                                <span className="text-sm text-muted-foreground">Total {isBuy ? 'Cost' : 'Proceeds'}</span>
                                <span className={`text-xl font-medium ${isBuy ? 'text-destructive' : 'text-success'}`}>
                                    ${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                            </div>
                            {isBuy && (
                                <div className="flex items-center justify-between p-4">
                                    <span className="text-sm text-muted-foreground">Available Cash</span>
                                    <span className={`text-sm font-medium ${canAfford ? 'text-success' : 'text-destructive'}`}>
                                        ${cashBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        {!canAfford && ' (Insufficient)'}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !price || !quantity || parseInt(quantity) <= 0 || (isBuy && !canAfford)}
                        className={`w-full py-4 text-lg font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${isBuy
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
                            `${mode} ${quantity || '0'} ${symbol || 'shares'}`
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
