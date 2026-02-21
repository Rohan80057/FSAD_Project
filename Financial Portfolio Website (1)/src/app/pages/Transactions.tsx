import { ArrowDownLeft, ArrowUpRight, DollarSign, Filter, Search, Calendar, Info } from 'lucide-react';
import { useEffect, useState } from 'react';
import { apiFetch } from '../../utils/api';

interface Transaction {
  id: number;
  userId: string;
  type: string; // 'BUY', 'SELL', 'DEPOSIT', 'WITHDRAWAL', 'DIVIDEND', 'FEE'
  symbol: string;
  shares: number;
  price: number;
  total: number;
  timestamp: string;
}

// Map the backend Transaction.type to our UI type
const mapBackendTypeToUI = (type: string) => {
  switch (type?.toUpperCase()) {
    case 'BUY': return 'buy';
    case 'SELL': return 'sell';
    case 'DIVIDEND': return 'dividend';
    case 'FEE': return 'fee';
    case 'DEPOSIT': return 'buy'; // Treat generic inflows
    case 'WITHDRAWAL': return 'sell'; // Treat generic outflows
    default: return type?.toLowerCase() || 'unknown';
  }
};


export function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function loadTransactions() {
      try {
        const data = await apiFetch('/transactions');
        setTransactions(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load transactions');
      } finally {
        setIsLoading(false);
      }
    }
    loadTransactions();
  }, []);

  const filteredTransactions = transactions.filter((tx) => {
    const uiType = mapBackendTypeToUI(tx.type);
    const matchesType = filterType === 'all' || uiType === filterType;
    const matchesSearch =
      searchTerm === '' ||
      (tx.symbol || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'buy':
        return <ArrowDownLeft size={20} className="text-destructive" />;
      case 'sell':
        return <ArrowUpRight size={20} className="text-success" />;
      case 'dividend':
      case 'interest':
        return <DollarSign size={20} className="text-success" />;
      case 'fee':
        return <DollarSign size={20} className="text-destructive" />;
      default:
        return <DollarSign size={20} />;
    }
  };

  const getTypeLabel = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const totalInflows = filteredTransactions
    .filter((tx) => ['SELL', 'DEPOSIT', 'DIVIDEND', 'INTEREST'].includes(tx.type?.toUpperCase()))
    .reduce((sum, tx) => sum + (tx.total || 0), 0);

  const totalOutflows = filteredTransactions
    .filter((tx) => ['BUY', 'WITHDRAWAL', 'FEE'].includes(tx.type?.toUpperCase()))
    .reduce((sum, tx) => sum + (tx.total || 0), 0);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-6 lg:px-12 flex justify-center items-center">
        <div className="text-2xl text-muted-foreground animate-pulse">Loading transactions...</div>
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

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-6xl tracking-tight mb-4">Transactions</h1>
          <p className="text-xl text-muted-foreground">Complete transaction history and SIP management</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="border border-border p-8 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground tracking-wide">TOTAL INFLOWS</span>
              <ArrowUpRight size={20} className="text-success" />
            </div>
            <div className="text-4xl tracking-tight text-success">${totalInflows.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Sales & income</div>
          </div>

          <div className="border border-border p-8 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground tracking-wide">TOTAL OUTFLOWS</span>
              <ArrowDownLeft size={20} className="text-destructive" />
            </div>
            <div className="text-4xl tracking-tight text-destructive">${totalOutflows.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Purchases & fees</div>
          </div>

          <div className="border border-border p-8 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground tracking-wide">NET FLOW</span>
              <DollarSign size={20} className="text-muted-foreground" />
            </div>
            <div className={`text-4xl tracking-tight ${totalInflows - totalOutflows >= 0 ? 'text-success' : 'text-destructive'}`}>
              ${Math.abs(totalInflows - totalOutflows).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">This period</div>
          </div>
        </div>

        {/* SIP Management - Coming Soon */}
        <div className="border border-border mb-16">
          <div className="p-8 border-b border-border">
            <h2 className="text-2xl tracking-tight mb-2">SIP Management</h2>
            <p className="text-sm text-muted-foreground">Systematic Investment Plans - Auto investments</p>
          </div>
          <div className="p-8 flex items-center justify-center">
            <div className="text-center py-8">
              <Info size={32} className="mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg text-muted-foreground">SIP Management — Coming Soon</p>
              <p className="text-sm text-muted-foreground mt-2">Automate your recurring investments with systematic investment plans.</p>
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-border bg-background focus:outline-none focus:ring-1 focus:ring-foreground"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-muted-foreground" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-3 border border-border bg-background focus:outline-none focus:ring-1 focus:ring-foreground"
            >
              <option value="all">All Types</option>
              <option value="buy">Buy</option>
              <option value="sell">Sell</option>
              <option value="dividend">Dividend</option>
              <option value="interest">Interest</option>
              <option value="fee">Fee</option>
            </select>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="border border-border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left p-6 text-sm tracking-wide text-muted-foreground">DATE & TIME</th>
                  <th className="text-left p-6 text-sm tracking-wide text-muted-foreground">TYPE</th>
                  <th className="text-left p-6 text-sm tracking-wide text-muted-foreground">ASSET</th>
                  <th className="text-right p-6 text-sm tracking-wide text-muted-foreground">SHARES</th>
                  <th className="text-right p-6 text-sm tracking-wide text-muted-foreground">PRICE</th>
                  <th className="text-right p-6 text-sm tracking-wide text-muted-foreground">FEES</th>
                  <th className="text-right p-6 text-sm tracking-wide text-muted-foreground">TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-muted-foreground">No transactions found.</td>
                  </tr>
                )}
                {filteredTransactions.map((tx) => {
                  const txDate = new Date(tx.timestamp);
                  const uiType = mapBackendTypeToUI(tx.type);
                  return (
                    <tr key={tx.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                      <td className="p-6">
                        <div className="text-sm">
                          <div className="font-medium">{txDate.toLocaleDateString()}</div>
                          <div className="text-muted-foreground">
                            {txDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(uiType)}
                          <span className="text-sm">{getTypeLabel(uiType)}</span>
                        </div>
                      </td>
                      <td className="p-6">
                        <div>
                          <div className="font-medium">{tx.symbol || '-'}</div>
                        </div>
                      </td>
                      <td className="p-6 text-right">{tx.shares > 0 ? tx.shares : '-'}</td>
                      <td className="p-6 text-right text-muted-foreground">
                        {tx.price > 0 ? `$${tx.price.toFixed(2)}` : '-'}
                      </td>
                      <td className="p-6 text-right text-muted-foreground">
                        -
                      </td>
                      <td className="p-6 text-right">
                        <span className={`font-medium ${['sell', 'dividend', 'interest', 'deposit'].includes(uiType) ? 'text-success' :
                          ['buy', 'fee', 'withdrawal'].includes(uiType) ? 'text-destructive' : ''
                          }`}>
                          {['sell', 'dividend', 'interest', 'deposit'].includes(uiType) ? '+' : '-'}
                          ${(tx.total || 0).toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
