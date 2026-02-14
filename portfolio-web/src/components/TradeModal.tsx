import { useState } from 'react';
import { searchTicker, getMarketQuote, executeTrade } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { Search, X, Loader2 } from 'lucide-react';

interface TradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function TradeModal({ isOpen, onClose, onSuccess }: TradeModalProps) {
    const [symbol, setSymbol] = useState('');
    const [quantity, setQuantity] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [quote, setQuote] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSearch = async (query: string) => {
        setSymbol(query);
        setError('');
        if (query.length < 2) { setSearchResults([]); return; }
        setSearchLoading(true);
        try {
            const result = await searchTicker(query);
            setSearchResults(result?.symbol ? [result] : []);
        } catch { setSearchResults([]); }
        setSearchLoading(false);
    };

    const selectSymbol = async (sym: string) => {
        setSymbol(sym);
        setSearchResults([]);
        setError('');
        try {
            const q = await getMarketQuote(sym);
            setQuote(q);
        } catch {
            setError('Could not fetch quote');
        }
    };

    const handleTrade = async (type: 'BUY' | 'SELL') => {
        if (!symbol || !quantity) return;
        setLoading(true);
        setError('');
        try {
            await executeTrade({ symbol, quantity: Number(quantity), type });
            onSuccess();
            handleClose();
        } catch (e: any) {
            setError(e.message || 'Trade failed');
        }
        setLoading(false);
    };

    const handleClose = () => {
        setSymbol('');
        setQuantity('');
        setQuote(null);
        setSearchResults([]);
        setError('');
        onClose();
    };

    const estimatedValue = quote?.price && quantity ? quote.price * Number(quantity) : 0;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40" onClick={handleClose} />

            {/* Modal */}
            <div className="card relative w-full max-w-md p-6 shadow-xl animate-fadeIn">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold text-[var(--color-foreground)]">Execute Trade</h2>
                    <button onClick={handleClose} className="btn-ghost w-8 h-8 rounded-full flex items-center justify-center">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Symbol search */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-[var(--color-muted-foreground)] mb-1.5">Symbol</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted-foreground)]" />
                            <input
                                className="input pl-9"
                                placeholder="Search RELIANCE.NS, TCS.NS..."
                                value={symbol}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                            {searchLoading && (
                                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted-foreground)] animate-spin" />
                            )}
                        </div>
                        {/* Search dropdown */}
                        {searchResults.length > 0 && (
                            <div className="card mt-1 max-h-40 overflow-y-auto shadow-lg">
                                {searchResults.map((r: any) => (
                                    <button
                                        key={r.symbol}
                                        onClick={() => selectSymbol(r.symbol)}
                                        className="w-full text-left px-3 py-2 text-sm hover:bg-[var(--color-muted)] transition-colors flex items-center justify-between"
                                    >
                                        <span className="font-medium">{r.symbol}</span>
                                        <span className="text-xs text-[var(--color-muted-foreground)] truncate ml-2">{r.name}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Quote display */}
                    {quote && (
                        <div className="bg-[var(--color-muted)] rounded-[var(--radius)] p-3 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold">{quote.symbol || symbol}</p>
                                <p className="text-xs text-[var(--color-muted-foreground)]">{quote.name || 'Stock'}</p>
                            </div>
                            <p className="text-lg font-bold">{formatCurrency(quote.price)}</p>
                        </div>
                    )}

                    {/* Quantity */}
                    <div>
                        <label className="block text-xs font-medium text-[var(--color-muted-foreground)] mb-1.5">Quantity</label>
                        <input
                            className="input"
                            type="number"
                            min="1"
                            placeholder="100"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                        />
                    </div>

                    {/* Estimated value */}
                    {estimatedValue > 0 && (
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-[var(--color-muted-foreground)]">Estimated Value</span>
                            <span className="font-semibold">{formatCurrency(estimatedValue)}</span>
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <p className="text-sm text-[var(--color-destructive)] bg-[var(--color-destructive-light)] p-2 rounded-[var(--radius)]">
                            {error}
                        </p>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            onClick={() => handleTrade('BUY')}
                            disabled={loading || !symbol || !quantity}
                            className="btn flex-1 bg-[var(--color-success)] text-white disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Buy'}
                        </button>
                        <button
                            onClick={() => handleTrade('SELL')}
                            disabled={loading || !symbol || !quantity}
                            className="btn flex-1 bg-[var(--color-destructive)] text-white disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sell'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
