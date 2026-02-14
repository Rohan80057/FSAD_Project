const API_BASE = '/api';

async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `API Error: ${response.status}`);
    }

    const text = await response.text();
    return text ? JSON.parse(text) : ({} as T);
}

// ---- Portfolio ----
export interface HoldingDTO {
    symbol: string;
    quantity: number;
    averagePrice: number;
    currentPrice: number;
    currentValue: number;
    pnl: number;
    pnlPercentage: number;
    allocationPercentage: number;
}

export interface PortfolioDTO {
    totalValue: number;
    totalInvested: number;
    totalPnL: number;
    totalPnLPercentage: number;
    dayPnL: number;
    cashBalance: number;
    realizedPnL: number;
    netWorth: number;
    topGainer: HoldingDTO | null;
    topLoser: HoldingDTO | null;
    holdings: HoldingDTO[];
}

export function fetchPortfolio(): Promise<PortfolioDTO> {
    return apiFetch<PortfolioDTO>('/portfolio');
}

// ---- Transactions ----
export interface Transaction {
    id: number;
    userId: string;
    symbol: string;
    type: 'BUY' | 'SELL' | 'DIVIDEND' | 'DEPOSIT' | 'WITHDRAWAL';
    quantity: number;
    price: number;
    timestamp: string;
    fee: number | null;
}

export function fetchTransactions(): Promise<Transaction[]> {
    return apiFetch<Transaction[]>('/transactions');
}

// ---- Trade ----
export interface TradeRequest {
    symbol: string;
    quantity: number;
    type: string;
}

export function executeTrade(request: TradeRequest): Promise<string> {
    return apiFetch<string>('/trade', {
        method: 'POST',
        body: JSON.stringify(request),
    });
}

// ---- Funds ----
export function depositFunds(amount: number): Promise<string> {
    return apiFetch<string>(`/funds/deposit?amount=${amount}`, { method: 'POST' });
}

export function withdrawFunds(amount: number): Promise<string> {
    return apiFetch<string>(`/funds/withdraw?amount=${amount}`, { method: 'POST' });
}

// ---- Market Data ----
export interface MarketQuote {
    symbol: string;
    price: number;
    found?: boolean;
    error?: string;
}

export function getMarketQuote(symbol: string): Promise<MarketQuote> {
    return apiFetch<MarketQuote>(`/market/quote/${symbol}`);
}

export function searchTicker(query: string): Promise<MarketQuote> {
    return apiFetch<MarketQuote>(`/market/search/${query}`);
}

// ---- Snapshots ----
export interface PortfolioSnapshot {
    id: number;
    userId: string;
    date: string;
    totalValue: number;
    investedAmount: number;
    cashBalance: number;
    unrealizedPnL: number;
    realizedPnL: number;
}

export function fetchSnapshots(): Promise<PortfolioSnapshot[]> {
    return apiFetch<PortfolioSnapshot[]>('/snapshots');
}

export function triggerSnapshotCapture(): Promise<string> {
    return apiFetch<string>('/snapshots/capture', { method: 'POST' });
}

// ---- Accounts ----
export interface Account {
    id: number;
    userId: string;
    name: string;
    accountType: string;
    institution: string | null;
    currency: string;
    isDefault: boolean;
}

export interface CreateAccountRequest {
    name: string;
    accountType: string;
    institution?: string;
    currency?: string;
}

export function fetchAccounts(): Promise<Account[]> {
    return apiFetch<Account[]>('/accounts');
}

export function createAccount(request: CreateAccountRequest): Promise<Account> {
    return apiFetch<Account>('/accounts', {
        method: 'POST',
        body: JSON.stringify(request),
    });
}

export function deleteAccount(id: number): Promise<string> {
    return apiFetch<string>(`/accounts/${id}`, { method: 'DELETE' });
}
