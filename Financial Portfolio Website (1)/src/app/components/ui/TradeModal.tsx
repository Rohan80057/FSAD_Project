import React, { useState, useEffect } from 'react';
import { X, Search, TrendingUp, TrendingDown, Clock, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { apiFetch } from '../../../utils/api';
import { toast } from 'sonner';

interface TradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    initialAction?: 'buy' | 'sell';
    initialTicker?: string;
    currentCash?: number;
}

export function TradeModal({ isOpen, onClose, onSuccess, initialAction = 'buy', initialTicker = '', currentCash = 0 }: TradeModalProps) {
    const [action, setAction] = useState<'buy' | 'sell'>(initialAction);
    const [ticker, setTicker] = useState(initialTicker);
    const [shares, setShares] = useState('');

    const [currentPrice, setCurrentPrice] = useState<number | null>(null);
    const [isFetchingPrice, setIsFetchingPrice] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [debounceTimeout, setDebounceTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setAction(initialAction);
            setTicker(initialTicker);
            setShares('');
            setCurrentPrice(null);
            if (initialTicker) {
                fetchPrice(initialTicker);
            }
        }
    }, [isOpen, initialAction, initialTicker]);

    const fetchPrice = async (symbol: string) => {
        if (!symbol) {
            setCurrentPrice(null);
            return;
        }

        setIsFetchingPrice(true);
        try {
            // Re-using the market overview endpoint for a quick quote, 
            // or assuming the backend has a way to get a single price.
            // For this demo, we'll try to fetch it securely.
            const data = await apiFetch(`/market/overview`);
            const asset = data.find((a: any) => a.symbol.toUpperCase() === symbol.toUpperCase());

            if (asset && asset.price) {
                setCurrentPrice(asset.price);
            } else {
                // If it's not a major index, we simulate a mock price fetch for a real ticker
                // since the backend might not expose a direct `/api/market/quote/{ticker}` yet 
                // without adding another controller. But wait, we can just let the backend handle the exact price
                // during the trade. For UI estimation purposes, let's just allow the trade.
                setCurrentPrice(null); // Or mock it: Math.random() * 200 + 50
                // NOTE: In a complete production app, we would call /api/market/quote?symbol=XYZ here.
            }
        } catch (err) {
            console.error("Failed to fetch price", err);
        } finally {
            setIsFetchingPrice(false);
        }
    };

    const handleTickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toUpperCase();
        setTicker(value);

        if (debounceTimeout) clearTimeout(debounceTimeout);

        const timeout = setTimeout(() => {
            fetchPrice(value);
        }, 500);
        setDebounceTimeout(timeout);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!ticker) {
            toast.error('Please enter a valid ticker symbol.');
            return;
        }
        if (!shares || isNaN(Number(shares)) || Number(shares) <= 0) {
            toast.error('Please enter a valid number of shares.');
            return;
        }

        const numShares = Number(shares);

        setIsSubmitting(true);
        try {
            const endpoint = action === 'buy' ? '/trade/buy' : '/trade/sell';
            await apiFetch(`${endpoint}?symbol=${ticker}&quantity=${numShares}`, {
                method: 'POST',
            });

            toast.success(`Successfully ${action === 'buy' ? 'bought' : 'sold'} ${numShares} shares of ${ticker}`);
            onSuccess();
            onClose();
        } catch (error: any) {
            toast.error(error.message || `Failed to ${action} ${ticker}.`);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    const estimatedTotal = (currentPrice || 0) * Number(shares || 0);

    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="bg-card border border-border w-full max-w-md animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center p-6 border-b border-border">
                    <h2 className="text-xl tracking-tight">Trade Security</h2>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    <div className="flex bg-muted/50 p-1 mb-6">
                        <button
                            type="button"
                            className={`flex-1 py-2 text-sm font-medium transition-colors flex items-center justify-center ${action === 'buy' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'
                                }`}
                            onClick={() => setAction('buy')}
                        >
                            <ArrowDownLeft size={16} className="mr-2 text-destructive" />
                            Buy
                        </button>
                        <button
                            type="button"
                            className={`flex-1 py-2 text-sm font-medium transition-colors flex items-center justify-center ${action === 'sell' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'
                                }`}
                            onClick={() => setAction('sell')}
                        >
                            <ArrowUpRight size={16} className="mr-2 text-success" />
                            Sell
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-2">Ticker Symbol</label>
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                                <input
                                    type="text"
                                    value={ticker}
                                    onChange={handleTickerChange}
                                    placeholder="e.g. AAPL, NVDA"
                                    required
                                    className="w-full pl-12 pr-4 py-3 bg-background border border-border focus:outline-none focus:ring-1 focus:ring-primary font-mono uppercase"
                                    autoFocus={!initialTicker}
                                />
                            </div>
                        </div>

                        <div className="bg-muted/30 p-4 border border-border flex justify-between items-center">
                            <div>
                                <div className="text-sm text-muted-foreground mb-1 flex items-center">
                                    <Clock size={14} className="mr-1" />
                                    Market Price
                                </div>
                                {isFetchingPrice ? (
                                    <div className="h-6 w-20 bg-muted animate-pulse rounded"></div>
                                ) : (
                                    <div className="text-xl font-mono">
                                        {currentPrice ? `$${currentPrice.toFixed(2)}` : 'Market'}
                                    </div>
                                )}
                            </div>
                            {action === 'buy' && currentCash > 0 && (
                                <div className="text-right">
                                    <div className="text-sm text-muted-foreground mb-1">Buying Power</div>
                                    <div className="font-mono">${currentCash.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-2">Shares</label>
                            <input
                                type="number"
                                value={shares}
                                onChange={(e) => setShares(e.target.value)}
                                placeholder="0"
                                step="1"
                                min="1"
                                required
                                className="w-full px-4 py-3 bg-background border border-border focus:outline-none focus:ring-1 focus:ring-primary font-mono text-lg"
                            />
                        </div>

                        {currentPrice !== null && Number(shares) > 0 && (
                            <div className="flex justify-between items-center py-2 border-t border-border">
                                <span className="text-sm text-muted-foreground">Estimated Total</span>
                                <span className="font-mono font-medium">${estimatedTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting || !ticker || !shares || Number(shares) <= 0}
                            className={`w-full py-4 text-primary-foreground font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center ${action === 'buy' ? 'bg-primary hover:bg-primary/90' : 'bg-foreground hover:bg-foreground/90'
                                }`}
                        >
                            {isSubmitting ? (
                                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                            ) : (
                                `Confirm ${action === 'buy' ? 'Buy' : 'Sell'}`
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
