import { TrendingUp, TrendingDown, Activity, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { apiFetch } from '../../utils/api';

interface MarketQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
}

export function Markets() {
  const [indices, setIndices] = useState<MarketQuote[]>([]);
  const [movers, setMovers] = useState<MarketQuote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await apiFetch('/market/overview');
        setIndices(data.indices || []);
        setMovers(data.topMovers || []);
      } catch (err: any) {
        setError(err.message || 'Failed to load market data');
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-6 lg:px-12 flex justify-center items-center">
        <div className="space-y-3 text-center">
          <Loader2 size={32} className="animate-spin mx-auto text-muted-foreground" />
          <div className="text-lg text-muted-foreground">Fetching live market data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <Activity size={28} />
            <h1 className="text-4xl lg:text-5xl tracking-tight">Markets</h1>
          </div>
          <p className="text-muted-foreground">Live market data from Yahoo Finance</p>
        </div>

        {error && (
          <div className="mb-8 border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Market Indices */}
        <div className="mb-10">
          <h2 className="text-lg tracking-tight mb-4">Market Indices (ETF Trackers)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {indices.map((idx) => {
              const isUp = idx.change >= 0;
              return (
                <div key={idx.symbol} className="border border-border p-6 space-y-3 hover:bg-muted/20 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground tracking-widest">{idx.name}</span>
                    <span className="text-xs text-muted-foreground">{idx.symbol}</span>
                  </div>
                  <div className="text-3xl tracking-tight">${Number(idx.price).toFixed(2)}</div>
                  <div className={`flex items-center gap-1 text-sm ${isUp ? 'text-emerald-500' : 'text-red-500'}`}>
                    {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    <span>{isUp ? '+' : ''}{Number(idx.change).toFixed(2)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Stocks */}
        <div>
          <h2 className="text-lg tracking-tight mb-4">Top Stocks</h2>
          <div className="border border-border">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left p-4 text-xs tracking-widest text-muted-foreground">SYMBOL</th>
                  <th className="text-left p-4 text-xs tracking-widest text-muted-foreground">NAME</th>
                  <th className="text-right p-4 text-xs tracking-widest text-muted-foreground">PRICE</th>
                  <th className="text-right p-4 text-xs tracking-widest text-muted-foreground">CHANGE</th>
                </tr>
              </thead>
              <tbody>
                {movers.map((stock) => {
                  const isUp = stock.change >= 0;
                  return (
                    <tr key={stock.symbol} className="border-b border-border hover:bg-muted/20 transition-colors">
                      <td className="p-4 font-medium tracking-tight">{stock.symbol}</td>
                      <td className="p-4 text-muted-foreground">{stock.name}</td>
                      <td className="p-4 text-right font-medium">${Number(stock.price).toFixed(2)}</td>
                      <td className="p-4 text-right">
                        <span className={`inline-flex items-center gap-1 ${isUp ? 'text-emerald-500' : 'text-red-500'}`}>
                          {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                          {isUp ? '+' : ''}{Number(stock.change).toFixed(2)}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}