import { TrendingUp, TrendingDown, DollarSign, ArrowUpRight, PieChart, Activity } from 'lucide-react';
import { ResponsiveContainer, PieChart as RePieChart, Pie, Cell, Tooltip } from 'recharts';
import { Link } from 'react-router';
import { AnimatedBackground } from '../components/AnimatedBackground';
import { useEffect, useState } from 'react';
import { apiFetch } from '../../utils/api';

// Interface matching the Java PortfolioDTO
interface Holding {
  symbol: string;
  name: string;
  shares: number;
  avgPrice: number;
  currentPrice: number;
  allocation: number;
  type: string;
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

// Deterministic colors for pie chart
const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

export function Portfolio() {
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await apiFetch('/portfolio');
        setPortfolio(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load portfolio');
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-6 lg:px-12 flex justify-center items-center">
        <div className="text-2xl text-muted-foreground animate-pulse">Loading portfolio...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-6 lg:px-12 flex justify-center items-center">
        <div className="text-2xl text-destructive">Error: {error}</div>
      </div>
    );
  }

  // Fallback defaults if null
  const data = portfolio || {
    totalValue: 0,
    totalPnL: 0,
    totalPnLPercentage: 0,
    cashBalance: 0,
    realizedPnL: 0,
    holdings: []
  };

  // Map asset allocation from live holdings
  const assetAllocation = data.holdings.length > 0
    ? data.holdings.map((h, i) => ({ name: h.symbol, value: h.shares * h.currentPrice, percentage: h.allocation, color: CHART_COLORS[i % CHART_COLORS.length] }))
    : [{ name: 'Cash', value: data.cashBalance, percentage: 100, color: '#404040' }];

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 lg:px-12 relative">
      <AnimatedBackground intensity="low" />
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-16 flex items-center justify-between">
          <div>
            <h1 className="text-6xl tracking-tight mb-4">Portfolio Overview</h1>
            <p className="text-xl text-muted-foreground">Comprehensive asset management and analysis</p>
          </div>
          <Link
            to="/goals"
            className="px-6 py-3 border border-border hover:bg-muted transition-colors"
          >
            View Goals
          </Link>
        </div>

        {/* Portfolio Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <div className="border border-border p-8 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground tracking-wide">TOTAL VALUE</span>
              <DollarSign size={20} className="text-muted-foreground" />
            </div>
            <div className="text-4xl tracking-tight">${data.totalValue?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}</div>
            <div className={`flex items-center text-sm ${data.totalPnL >= 0 ? 'text-success' : 'text-destructive'}`}>
              {data.totalPnL >= 0 ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
              <span>{data.totalPnLPercentage >= 0 ? '+' : ''}{data.totalPnLPercentage?.toFixed(2)}% all time</span>
            </div>
          </div>

          <div className="border border-border p-8 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground tracking-wide">TOTAL GAIN</span>
              <ArrowUpRight size={20} className="text-muted-foreground" />
            </div>
            <div className={`text-4xl tracking-tight ${data.totalPnL >= 0 ? 'text-success' : 'text-destructive'}`}>
              ${data.totalPnL?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
            </div>
            <div className={`flex items-center text-sm ${data.totalPnLPercentage >= 0 ? 'text-success' : 'text-destructive'}`}>
              {data.totalPnLPercentage >= 0 ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
              <span>{data.totalPnLPercentage >= 0 ? '+' : ''}{data.totalPnLPercentage?.toFixed(2)}% all time</span>
            </div>
          </div>

          <div className="border border-border p-8 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground tracking-wide">REALIZED P&L</span>
              <TrendingUp size={20} className="text-muted-foreground" />
            </div>
            <div className={`text-4xl tracking-tight ${(data.realizedPnL ?? 0) >= 0 ? 'text-success' : 'text-destructive'}`}>
              ${(data.realizedPnL ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-sm text-muted-foreground">From closed positions</div>
          </div>

          <div className="border border-border p-8 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground tracking-wide">IDLE CASH</span>
              <Activity size={20} className="text-muted-foreground" />
            </div>
            <div className="text-4xl tracking-tight">${data.cashBalance?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}</div>
            <div className="text-sm text-muted-foreground">Available to invest</div>
          </div>
        </div>

        {/* Asset Allocation */}
        <div className="border border-border p-8 mb-16">
          <h2 className="text-2xl tracking-tight mb-8 flex items-center">
            <PieChart size={24} className="mr-2" />
            Asset Allocation
          </h2>
          {data.holdings.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={300}>
                <RePieChart>
                  <Pie
                    data={assetAllocation}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {assetAllocation.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RePieChart>
              </ResponsiveContainer>
              <div className="mt-6 space-y-3">
                {assetAllocation.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <div className="w-3 h-3 mr-2" style={{ backgroundColor: item.color }} />
                      <span>{item.name}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-muted-foreground">{item.percentage}%</span>
                      <span className="font-medium">${item.value.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg">No holdings yet</p>
              <p className="text-sm mt-2">Buy stocks via the Transactions page to see your allocation here.</p>
            </div>
          )}
        </div>

        {/* Holdings Table */}
        <div className="border border-border mb-16">
          <div className="p-8 border-b border-border flex items-center justify-between">
            <h2 className="text-2xl tracking-tight">Current Holdings</h2>
            <Link to="/transactions" className="text-sm text-muted-foreground hover:text-foreground">
              View All Transactions →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-6 text-sm tracking-wide text-muted-foreground">SYMBOL</th>
                  <th className="text-left p-6 text-sm tracking-wide text-muted-foreground">NAME</th>
                  <th className="text-right p-6 text-sm tracking-wide text-muted-foreground">SHARES</th>
                  <th className="text-right p-6 text-sm tracking-wide text-muted-foreground">AVG PRICE</th>
                  <th className="text-right p-6 text-sm tracking-wide text-muted-foreground">CURRENT</th>
                  <th className="text-right p-6 text-sm tracking-wide text-muted-foreground">GAIN/LOSS</th>
                  <th className="text-right p-6 text-sm tracking-wide text-muted-foreground">MARKET VALUE</th>
                </tr>
              </thead>
              <tbody>
                {data.holdings.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-muted-foreground">No holdings found in portfolio.</td>
                  </tr>
                )}
                {data.holdings.map((holding) => {
                  const gainLoss = holding.avgPrice > 0 ? ((holding.currentPrice - holding.avgPrice) / holding.avgPrice) * 100 : 0;
                  const isPositive = gainLoss >= 0;
                  const marketValue = holding.shares * holding.currentPrice;

                  return (
                    <tr key={holding.symbol} className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="p-6 tracking-tight font-medium">{holding.symbol}</td>
                      <td className="p-6 text-muted-foreground">{holding.name}</td>
                      <td className="p-6 text-right">{holding.shares}</td>
                      <td className="p-6 text-right text-muted-foreground">${holding.avgPrice.toFixed(2)}</td>
                      <td className="p-6 text-right font-medium">${holding.currentPrice.toFixed(2)}</td>
                      <td className="p-6 text-right">
                        <div className={`flex items-center justify-end ${isPositive ? 'text-success' : 'text-destructive'}`}>
                          {isPositive ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
                          <span>{isPositive ? '+' : ''}{gainLoss.toFixed(2)}%</span>
                        </div>
                      </td>
                      <td className="p-6 text-right font-medium">${marketValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
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