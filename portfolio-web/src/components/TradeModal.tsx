import { useState } from 'react';
import { X, Search, ArrowUpRight, ArrowDownRight, Loader2 } from 'lucide-react';
import { executeTrade, getMarketQuote } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

interface TradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function TradeModal({ isOpen, onClose, onSuccess }: TradeModalProps) {
    const [symbol, setSymbol] = useState('');
    const [quantity, setQuantity] = useState('');
    const [quote, setQuote] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [quoteLoading, setQuoteLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleGetQuote = async () => {
        if (!symbol.trim()) return;
        setQuoteLoading(true);
        setError('');
        try {
            const data = await getMarketQuote(symbol.trim().toUpperCase());
            setQuote(data.price);
        } catch (err: any) {
            setError(err.message || 'Failed to get quote');
            setQuote(null);
        } finally {
            setQuoteLoading(false);
        }
    };

    const handleTrade = async (type: 'BUY' | 'SELL') => {
        if (!symbol.trim() || !quantity || parseInt(quantity) < 1) {
            setError('Enter a valid symbol and quantity');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await executeTrade({
                symbol: symbol.trim().toUpperCase(),
                quantity: parseInt(quantity),
                type,
            });
            onSuccess();
            onClose();
            setSymbol('');
            setQuantity('');
            setQuote(null);
        } catch (err: any) {
            setError(err.message || 'Trade failed');
        } finally {
            setLoading(false);
        }
    };

    const estimatedValue = quote && quantity ? quote * parseInt(quantity) : null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative glass rounded-2xl p-6 w-full max-w-md animate-fadeIn">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">Execute Trade</h2>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[var(--color-muted)] transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Symbol Input */}
                <div className="mb-4">
                    <label className="text-sm text-[var(--color-muted-foreground)] mb-1.5 block">Symbol</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={symbol}
                            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                            placeholder="e.g. RELIANCE.NS"
                            className="flex-1 bg-[var(--color-muted)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--color-accent)] transition-colors"
                        />
                        <button
                            onClick={handleGetQuote}
                            disabled={quoteLoading}
                            className="px-4 py-2.5 bg-[var(--color-muted)] border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-border)] transition-colors text-sm"
                        >
                            {quoteLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                        </button>
                    </div>
                    {quote != null && (
                        <p className="text-sm text-[var(--color-accent)] mt-2 font-medium">
                            Current Price: {formatCurrency(quote)}
                        </p>
                    )}
                </div>

                {/* Quantity Input */}
                <div className="mb-4">
                    <label className="text-sm text-[var(--color-muted-foreground)] mb-1.5 block">Quantity</label>
                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        placeholder="Number of shares"
                        min="1"
                        className="w-full bg-[var(--color-muted)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--color-accent)] transition-colors"
                    />
                </div>

                {/* Estimated Value */}
                {estimatedValue != null && (
                    <div className="mb-6 p-3 rounded-lg bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20">
                        <p className="text-sm text-[var(--color-muted-foreground)]">Estimated Value</p>
                        <p className="text-lg font-bold text-[var(--color-accent)]">{formatCurrency(estimatedValue)}</p>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="mb-4 p-3 rounded-lg bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/20">
                        <p className="text-sm text-[var(--color-danger)]">{error}</p>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                    <button
                        onClick={() => handleTrade('BUY')}
                        disabled={loading}
                        className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[var(--color-success)] text-white font-semibold text-sm hover:brightness-110 transition-all disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowUpRight className="w-4 h-4" />}
                        BUY
                    </button>
                    <button
                        onClick={() => handleTrade('SELL')}
                        disabled={loading}
                        className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[var(--color-danger)] text-white font-semibold text-sm hover:brightness-110 transition-all disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowDownRight className="w-4 h-4" />}
                        SELL
                    </button>
                </div>
            </div>
        </div>
    );
}
