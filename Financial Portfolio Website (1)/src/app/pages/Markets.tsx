import { TrendingUp, TrendingDown, Activity, Info } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const marketIndices = [
  { name: 'S&P 500', value: '4,783.45', change: '+1.24%', isPositive: true },
  { name: 'Dow Jones', value: '37,863.80', change: '+0.87%', isPositive: true },
  { name: 'NASDAQ', value: '15,310.97', change: '-0.45%', isPositive: false },
  { name: 'Russell 2000', value: '2,027.07', change: '+2.13%', isPositive: true },
];

const topMovers = [
  { symbol: 'NVDA', name: 'NVIDIA Corp', price: 512.34, change: 8.4, volume: '124M' },
  { symbol: 'META', name: 'Meta Platforms', price: 398.67, change: 6.2, volume: '89M' },
  { symbol: 'AMD', name: 'Advanced Micro Devices', price: 178.23, change: 5.8, volume: '156M' },
  { symbol: 'TSLA', name: 'Tesla Inc', price: 178.23, change: -4.2, volume: '234M' },
  { symbol: 'AAPL', name: 'Apple Inc', price: 178.52, change: -2.1, volume: '98M' },
];

const sectors = [
  { name: 'Technology', change: 2.4 },
  { name: 'Healthcare', change: 1.8 },
  { name: 'Financials', change: 1.2 },
  { name: 'Consumer Discretionary', change: 0.9 },
  { name: 'Industrials', change: 0.6 },
  { name: 'Energy', change: -0.8 },
  { name: 'Utilities', change: -1.2 },
  { name: 'Real Estate', change: -1.8 },
];

const marketData = [
  { time: '09:30', value: 4750 },
  { time: '10:00', value: 4762 },
  { time: '10:30', value: 4755 },
  { time: '11:00', value: 4768 },
  { time: '11:30', value: 4772 },
  { time: '12:00', value: 4765 },
  { time: '12:30', value: 4770 },
  { time: '13:00', value: 4778 },
  { time: '13:30', value: 4775 },
  { time: '14:00', value: 4783 },
];

const marketNews = [
  {
    title: 'Federal Reserve Signals Steady Interest Rates',
    source: 'Financial Times',
    time: '2 hours ago',
    category: 'Economic Policy'
  },
  {
    title: 'Tech Giants Report Strong Q4 Earnings',
    source: 'Wall Street Journal',
    time: '4 hours ago',
    category: 'Earnings'
  },
  {
    title: 'Oil Prices Surge on Supply Concerns',
    source: 'Bloomberg',
    time: '6 hours ago',
    category: 'Commodities'
  },
  {
    title: 'European Markets Close Higher on Economic Data',
    source: 'Reuters',
    time: '8 hours ago',
    category: 'Global Markets'
  },
];

export function Markets() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <div className="flex items-center space-x-3 mb-4">
            <Activity size={32} />
            <h1 className="text-6xl tracking-tight">Market Overview</h1>
          </div>
          <p className="text-xl text-muted-foreground">Real-time market data and insights</p>
        </div>

        {/* Demo Data Banner */}
        <div className="mb-8 border border-border bg-muted/50 p-4 flex items-center space-x-3">
          <Info size={20} className="text-muted-foreground flex-shrink-0" />
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Demo Data</span> — Market data shown below is for demonstration purposes. Live market feed coming soon.
          </p>
        </div>

        {/* Market Indices */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {marketIndices.map((index) => (
            <div key={index.name} className="border border-border p-8 space-y-3">
              <div className="text-sm text-muted-foreground tracking-wide">{index.name}</div>
              <div className="text-3xl tracking-tight">{index.value}</div>
              <div className={`flex items-center text-sm ${index.isPositive ? 'text-foreground' : 'text-muted-foreground'}`}>
                {index.isPositive ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
                <span>{index.change}</span>
              </div>
            </div>
          ))}
        </div>

        {/* S&P 500 Chart */}
        <div className="border border-border p-8 mb-16">
          <h2 className="text-2xl tracking-tight mb-8">S&P 500 Intraday</h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={marketData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
              <XAxis dataKey="time" stroke="#737373" style={{ fontSize: '12px' }} />
              <YAxis stroke="#737373" style={{ fontSize: '12px' }} domain={['dataMin - 10', 'dataMax + 10']} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e5e5',
                  borderRadius: '0',
                }}
              />
              <Line type="monotone" dataKey="value" stroke="#0a0a0a" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Top Movers */}
          <div className="border border-border">
            <div className="p-8 border-b border-border">
              <h2 className="text-2xl tracking-tight">Top Movers</h2>
            </div>
            <div className="divide-y divide-border">
              {topMovers.map((stock) => (
                <div key={stock.symbol} className="p-6 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="tracking-tight mb-1">{stock.symbol}</div>
                      <div className="text-sm text-muted-foreground">{stock.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="tracking-tight mb-1">${stock.price.toFixed(2)}</div>
                      <div className={`text-sm flex items-center justify-end ${stock.change >= 0 ? 'text-success' : 'text-destructive'}`}>
                        {stock.change >= 0 ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />}
                        <span>{stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">Vol: {stock.volume}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Sector Performance */}
          <div className="border border-border">
            <div className="p-8 border-b border-border">
              <h2 className="text-2xl tracking-tight">Sector Performance</h2>
            </div>
            <div className="p-8 space-y-6">
              {sectors.map((sector) => (
                <div key={sector.name}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">{sector.name}</span>
                    <span className={`text-sm flex items-center ${sector.change >= 0 ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {sector.change >= 0 ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />}
                      {sector.change >= 0 ? '+' : ''}{sector.change.toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-2 bg-muted relative overflow-hidden">
                    <div
                      className={`absolute top-0 left-0 h-full ${sector.change >= 0 ? 'bg-foreground' : 'bg-muted-foreground'}`}
                      style={{ width: `${Math.abs(sector.change) * 20}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Market News */}
        <div className="border border-border">
          <div className="p-8 border-b border-border">
            <h2 className="text-2xl tracking-tight">Market News</h2>
          </div>
          <div className="divide-y divide-border">
            {marketNews.map((news, index) => (
              <div key={index} className="p-8 hover:bg-muted/30 transition-colors cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg tracking-tight pr-4">{news.title}</h3>
                  <span className="text-sm text-muted-foreground whitespace-nowrap">{news.time}</span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span>{news.source}</span>
                  <span>•</span>
                  <span className="px-3 py-1 border border-border text-xs tracking-wide">{news.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}