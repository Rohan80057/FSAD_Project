import { TrendingUp, TrendingDown, DollarSign, ArrowUpRight, PieChart, Wallet, Plus, ArrowDownUp, Activity } from 'lucide-react';
import { ResponsiveContainer, PieChart as RePieChart, Pie, Cell, Tooltip } from 'recharts';
import { Link } from 'react-router';
import { useEffect, useState } from 'react';
import { apiFetch } from '../../utils/api';
import { TradeModal } from '../components/TradeModal';
import { FundsModal } from '../components/FundsModal';

interface Holding {
  symbol: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  currentValue: number;
  pnl: number;
  pnlPercentage: number;
  allocationPercentage: number;
}

interface PortfolioData {
  totalValue: number;
  totalInvested: number;
  totalPnL: number;
  totalPnLPercentage: number;
  dayPnL: number;
  cashBalance: number;
  realizedPnL: number;
  netWorth: number;
  holdings: Holding[];
  topGainer?: Holding;
  topLoser?: Holding;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#6366f1', '#84cc16'];

export function Portfolio() {
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [tradeMode, setTradeMode] = useState<'BUY' | 'SELL'>('BUY');
  const [tradeSymbol, setTradeSymbol] = useState<string | undefined>();
  const [tradeQty, setTradeQty] = useState<number | undefined>();
  const [showTrade, setShowTrade] = useState(false);
  const [showFunds, setShowFunds] = useState(false);

  const loadPortfolio = async () => {
    try {
      setError(null);
      const data = await apiFetch('/portfolio');
      setPortfolio(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load portfolio');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadPortfolio(); }, []);

  const openBuy = () => { setTradeMode('BUY'); setTradeSymbol(undefined); setTradeQty(undefined); setShowTrade(true); };
  const openSell = (symbol: string, qty: number) => { setTradeMode('SELL'); setTradeSymbol(symbol); setTradeQty(qty); setShowTrade(true); };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-6 lg:px-12 flex justify-center items-center">
        <div className="space-y-3 text-center">
          <div className="w-8 h-8 border-2 border-foreground border-t-transparent rounded-full animate-spin mx-auto" />
          <div className="text-lg text-muted-foreground">Loading your portfolio...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-6 lg:px-12 flex justify-center items-center">
        <div className="text-center space-y-4">
          <div className="text-xl text-destructive">{error}</div>
          <button onClick={loadPortfolio} className="px-6 py-2 border border-border hover:bg-muted transition-colors">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const data = portfolio!;
  const netWorth = data.netWorth || (data.totalValue + data.cashBalance);
  const holdings = data.holdings || [];

  const pieData = holdings.length > 0
    ? [
      ...holdings.map((h, i) => ({ name: h.symbol, value: h.currentValue, color: COLORS[i % COLORS.length] })),
      ...(data.cashBalance > 0 ? [{ name: 'Cash', value: data.cashBalance, color: '#737373' }] : [])
    ]
    : [{ name: 'Cash', value: data.cashBalance || 1, color: '#737373' }];

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header + Actions */}
        <div className="mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl lg:text-5xl tracking-tight mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Your portfolio at a glance</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowFunds(true)}
              className="flex items-center gap-2 px-5 py-2.5 border border-border hover:bg-muted transition-colors text-sm font-medium"
            >
              <Wallet size={16} /> Manage Funds
            </button>
            <button
              onClick={openBuy}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white transition-colors text-sm font-medium"
            >
              <Plus size={16} /> Buy Stock
            </button>
          </div>
        </div>

        {/* Summary Strip */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
          {/* Net Worth */}
          <div className="border border-border p-5 space-y-2 col-span-2 md:col-span-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground tracking-widest">NET WORTH</span>
              <DollarSign size={16} className="text-muted-foreground" />
            </div>
            <div className="text-3xl tracking-tight">${netWorth.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </div>

          {/* Invested */}
          <div className="border border-border p-5 space-y-2">
            <span className="text-xs text-muted-foreground tracking-widest">INVESTED</span>
            <div className="text-2xl tracking-tight">${(data.totalInvested || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </div>

          {/* Current Value */}
          <div className="border border-border p-5 space-y-2">
            <span className="text-xs text-muted-foreground tracking-widest">CURRENT VALUE</span>
            <div className="text-2xl tracking-tight">${(data.totalValue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </div>

          {/* Total P/L */}
          <div className="border border-border p-5 space-y-2">
            <span className="text-xs text-muted-foreground tracking-widest">TOTAL P&L</span>
            <div className={`text-2xl tracking-tight ${(data.totalPnL || 0) >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {(data.totalPnL || 0) >= 0 ? '+' : ''}${(data.totalPnL || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              <span className="text-sm ml-1">({(data.totalPnLPercentage || 0) >= 0 ? '+' : ''}{(data.totalPnLPercentage || 0).toFixed(2)}%)</span>
            </div>
          </div>

          {/* Cash */}
          <div className="border border-border p-5 space-y-2">
            <span className="text-xs text-muted-foreground tracking-widest">CASH</span>
            <div className="text-2xl tracking-tight">${(data.cashBalance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </div>
        </div>

        {/* Two Column: Pie Chart + Gainer/Loser */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {/* Pie Chart */}
          <div className="lg:col-span-2 border border-border p-6">
            <h2 className="text-lg tracking-tight mb-4 flex items-center gap-2">
              <PieChart size={18} /> Allocation Breakdown
            </h2>
            {holdings.length > 0 || data.cashBalance > 0 ? (
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-full md:w-1/2">
                  <ResponsiveContainer width="100%" height={240}>
                    <RePieChart>
                      <Pie data={pieData} cx="50%" cy="50%" outerRadius={90} dataKey="value" labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                        {pieData.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(val: number) => `$${val.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} />
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-full md:w-1/2 space-y-2">
                  {pieData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }} />
                        <span>{item.name}</span>
                      </div>
                      <span className="text-muted-foreground">${item.value.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-muted-foreground">
                No assets yet. Click <strong>Buy Stock</strong> to get started.
              </div>
            )}
          </div>

          {/* Top Gainer / Loser */}
          <div className="space-y-6">
            <div className="border border-border p-6">
              <div className="text-xs text-muted-foreground tracking-widest mb-3">TOP GAINER</div>
              {data.topGainer ? (
                <div className="space-y-1">
                  <div className="text-2xl tracking-tight">{data.topGainer.symbol}</div>
                  <div className="flex items-center gap-1 text-emerald-500">
                    <TrendingUp size={16} />
                    <span className="font-medium">+{data.topGainer.pnlPercentage?.toFixed(2)}%</span>
                  </div>
                  <div className="text-sm text-muted-foreground">${data.topGainer.currentPrice?.toFixed(2)}</div>
                </div>
              ) : (
                <div className="text-muted-foreground text-sm">No holdings</div>
              )}
            </div>
            <div className="border border-border p-6">
              <div className="text-xs text-muted-foreground tracking-widest mb-3">TOP LOSER</div>
              {data.topLoser ? (
                <div className="space-y-1">
                  <div className="text-2xl tracking-tight">{data.topLoser.symbol}</div>
                  <div className="flex items-center gap-1 text-red-500">
                    <TrendingDown size={16} />
                    <span className="font-medium">{data.topLoser.pnlPercentage?.toFixed(2)}%</span>
                  </div>
                  <div className="text-sm text-muted-foreground">${data.topLoser.currentPrice?.toFixed(2)}</div>
                </div>
              ) : (
                <div className="text-muted-foreground text-sm">No holdings</div>
              )}
            </div>
            {/* Realized P/L */}
            <div className="border border-border p-6">
              <div className="text-xs text-muted-foreground tracking-widest mb-3">REALIZED P&L</div>
              <div className={`text-2xl tracking-tight ${(data.realizedPnL || 0) >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                {(data.realizedPnL || 0) >= 0 ? '+' : ''}${(data.realizedPnL || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
              <div className="text-xs text-muted-foreground mt-1">From closed positions</div>
            </div>
          </div>
        </div>

        {/* Holdings Table */}
        <div className="border border-border">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h2 className="text-lg tracking-tight flex items-center gap-2">
              <Activity size={18} /> Holdings ({holdings.length})
            </h2>
            <Link to="/transactions" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Transaction History →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left p-4 text-xs tracking-widest text-muted-foreground">SYMBOL</th>
                  <th className="text-right p-4 text-xs tracking-widest text-muted-foreground">QTY</th>
                  <th className="text-right p-4 text-xs tracking-widest text-muted-foreground">AVG PRICE</th>
                  <th className="text-right p-4 text-xs tracking-widest text-muted-foreground">CURRENT</th>
                  <th className="text-right p-4 text-xs tracking-widest text-muted-foreground">P&L</th>
                  <th className="text-right p-4 text-xs tracking-widest text-muted-foreground">VALUE</th>
                  <th className="text-right p-4 text-xs tracking-widest text-muted-foreground">ALLOC</th>
                  <th className="text-right p-4 text-xs tracking-widest text-muted-foreground">ACTION</th>
                </tr>
              </thead>
              <tbody>
                {holdings.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-muted-foreground">
                      Portfolio is empty. Deposit funds and buy your first stock!
                    </td>
                  </tr>
                ) : (
                  holdings.map((h) => {
                    const isPositive = (h.pnl || 0) >= 0;
                    return (
                      <tr key={h.symbol} className="border-b border-border hover:bg-muted/20 transition-colors">
                        <td className="p-4 font-medium tracking-tight">{h.symbol}</td>
                        <td className="p-4 text-right">{h.quantity}</td>
                        <td className="p-4 text-right text-muted-foreground">${h.averagePrice?.toFixed(2)}</td>
                        <td className="p-4 text-right">${h.currentPrice?.toFixed(2)}</td>
                        <td className="p-4 text-right">
                          <div className={`flex items-center justify-end gap-1 ${isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
                            {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                            <span>{isPositive ? '+' : ''}{h.pnlPercentage?.toFixed(2)}%</span>
                          </div>
                          <div className={`text-xs ${isPositive ? 'text-emerald-500/70' : 'text-red-500/70'}`}>
                            {isPositive ? '+' : ''}${h.pnl?.toFixed(2)}
                          </div>
                        </td>
                        <td className="p-4 text-right font-medium">${h.currentValue?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                        <td className="p-4 text-right text-muted-foreground">{h.allocationPercentage?.toFixed(1)}%</td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => openSell(h.symbol, h.quantity)}
                            className="px-3 py-1.5 text-xs border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-colors"
                          >
                            Sell
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modals */}
      <TradeModal
        isOpen={showTrade}
        onClose={() => setShowTrade(false)}
        onSuccess={loadPortfolio}
        mode={tradeMode}
        prefillSymbol={tradeSymbol}
        prefillQuantity={tradeQty}
        cashBalance={data.cashBalance || 0}
      />
      <FundsModal
        isOpen={showFunds}
        onClose={() => setShowFunds(false)}
        onSuccess={loadPortfolio}
        cashBalance={data.cashBalance || 0}
      />
    </div>
  );
}