import { ArrowDownLeft, ArrowUpRight, DollarSign, Filter, Search, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';
import { useEffect, useState } from 'react';
import { apiFetch } from '../../utils/api';

interface Transaction {
  id: number;
  userId: string;
  type: string;
  symbol: string;
  quantity: number;
  price: number;
  total: number;
  timestamp: string;
}

export function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const data = await apiFetch('/transactions');
        setTransactions(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load transactions');
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const filtered = transactions.filter((tx) => {
    const type = tx.type?.toUpperCase();
    const matchesType = filterType === 'all' || type === filterType.toUpperCase();
    const matchesSearch = !searchTerm || (tx.symbol || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const totalInflows = filtered
    .filter((tx) => ['SELL', 'DEPOSIT', 'DIVIDEND'].includes(tx.type?.toUpperCase()))
    .reduce((sum, tx) => sum + (tx.price * tx.quantity || 0), 0);

  const totalOutflows = filtered
    .filter((tx) => ['BUY', 'WITHDRAWAL', 'FEE'].includes(tx.type?.toUpperCase()))
    .reduce((sum, tx) => sum + (tx.price * tx.quantity || 0), 0);

  const getTypeStyle = (type: string) => {
    switch (type?.toUpperCase()) {
      case 'BUY': return { icon: <ArrowDownLeft size={16} />, color: 'text-red-500', bg: 'bg-red-500/10', label: 'Buy' };
      case 'SELL': return { icon: <ArrowUpRight size={16} />, color: 'text-emerald-500', bg: 'bg-emerald-500/10', label: 'Sell' };
      case 'DEPOSIT': return { icon: <ArrowDownToLine size={16} />, color: 'text-blue-500', bg: 'bg-blue-500/10', label: 'Deposit' };
      case 'WITHDRAWAL': return { icon: <ArrowUpFromLine size={16} />, color: 'text-orange-500', bg: 'bg-orange-500/10', label: 'Withdraw' };
      case 'DIVIDEND': return { icon: <DollarSign size={16} />, color: 'text-emerald-500', bg: 'bg-emerald-500/10', label: 'Dividend' };
      default: return { icon: <DollarSign size={16} />, color: 'text-muted-foreground', bg: 'bg-muted', label: type };
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-6 lg:px-12 flex justify-center items-center">
        <div className="space-y-3 text-center">
          <div className="w-8 h-8 border-2 border-foreground border-t-transparent rounded-full animate-spin mx-auto" />
          <div className="text-lg text-muted-foreground">Loading transactions...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-6 lg:px-12 flex justify-center items-center">
        <div className="text-xl text-destructive">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl lg:text-5xl tracking-tight mb-2">Transactions</h1>
          <p className="text-muted-foreground">Complete trade and activity history</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="border border-border p-6 space-y-2">
            <span className="text-xs text-muted-foreground tracking-widest">INFLOWS</span>
            <div className="text-3xl tracking-tight text-emerald-500">${totalInflows.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
            <div className="text-xs text-muted-foreground">Sales, deposits, dividends</div>
          </div>
          <div className="border border-border p-6 space-y-2">
            <span className="text-xs text-muted-foreground tracking-widest">OUTFLOWS</span>
            <div className="text-3xl tracking-tight text-red-500">${totalOutflows.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
            <div className="text-xs text-muted-foreground">Purchases, withdrawals</div>
          </div>
          <div className="border border-border p-6 space-y-2">
            <span className="text-xs text-muted-foreground tracking-widest">NET FLOW</span>
            <div className={`text-3xl tracking-tight ${totalInflows - totalOutflows >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              ${Math.abs(totalInflows - totalOutflows).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-muted-foreground">{transactions.length} total transactions</div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input
              type="text"
              placeholder="Search by symbol..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-border bg-background focus:outline-none focus:ring-1 focus:ring-foreground text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-muted-foreground" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2.5 border border-border bg-background focus:outline-none focus:ring-1 focus:ring-foreground text-sm"
            >
              <option value="all">All Types</option>
              <option value="BUY">Buy</option>
              <option value="SELL">Sell</option>
              <option value="DEPOSIT">Deposit</option>
              <option value="WITHDRAWAL">Withdrawal</option>
            </select>
          </div>
        </div>

        {/* Transaction Table */}
        <div className="border border-border">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left p-4 text-xs tracking-widest text-muted-foreground">DATE</th>
                <th className="text-left p-4 text-xs tracking-widest text-muted-foreground">TYPE</th>
                <th className="text-left p-4 text-xs tracking-widest text-muted-foreground">SYMBOL</th>
                <th className="text-right p-4 text-xs tracking-widest text-muted-foreground">QTY</th>
                <th className="text-right p-4 text-xs tracking-widest text-muted-foreground">PRICE</th>
                <th className="text-right p-4 text-xs tracking-widest text-muted-foreground">TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">No transactions found.</td>
                </tr>
              ) : (
                filtered.map((tx) => {
                  const style = getTypeStyle(tx.type);
                  const date = new Date(tx.timestamp);
                  const total = tx.price * tx.quantity;
                  const isInflow = ['SELL', 'DEPOSIT', 'DIVIDEND'].includes(tx.type?.toUpperCase());
                  return (
                    <tr key={tx.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                      <td className="p-4">
                        <div className="text-sm">{date.toLocaleDateString()}</div>
                        <div className="text-xs text-muted-foreground">{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium ${style.color} ${style.bg}`}>
                          {style.icon}
                          {style.label}
                        </span>
                      </td>
                      <td className="p-4 font-medium tracking-tight">{tx.symbol || '—'}</td>
                      <td className="p-4 text-right text-muted-foreground">{tx.quantity > 0 ? tx.quantity : '—'}</td>
                      <td className="p-4 text-right text-muted-foreground">${tx.price?.toFixed(2)}</td>
                      <td className="p-4 text-right">
                        <span className={`font-medium ${isInflow ? 'text-emerald-500' : 'text-red-500'}`}>
                          {isInflow ? '+' : '-'}${total.toFixed(2)}
                        </span>
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
  );
}
