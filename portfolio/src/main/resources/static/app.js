// ==========================================
// CONFIGURATION
// ==========================================
const SUPABASE_URL = 'https://certvlxxcymscdcyatij.supabase.co';
// PLEASE REPLACE THIS KEY
const SUPABASE_ANON_KEY = 'PLACEHOLDER_KEY_PLEASE_REPLACE';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ==========================================
// STATE & DOM ELEMENTS
// ==========================================
let currentUser = null;
let currentToken = null;

const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const authContainer = document.getElementById('auth-container');
const appContainer = document.getElementById('app-container');
const userEmailSpan = document.getElementById('user-email');

// ==========================================
// AUTHENTICATION
// ==========================================
async function checkUser() {
    // BYPASS AUTH FOR TESTING
    currentUser = { email: 'test-user@example.com' };
    currentToken = 'mock-token'; // Backend ignores this in permitAll mode
    // showApp(); // Already visible by default
    refreshAll();
}

loginBtn.addEventListener('click', async () => {
    alert("Auth is currently disabled for testing. You are already logged in as test-user.");
});

logoutBtn.addEventListener('click', async () => {
    alert("You cannot logout in test mode.");
});

function showApp() {
    authContainer.classList.add('hidden');
    appContainer.classList.remove('hidden');
    userEmailSpan.textContent = currentUser.email;
    refreshAll();
}

function showAuth() {
    // Only show auth if we explicitly want to (e.g. logout), not on load
    authContainer.classList.remove('hidden');
    appContainer.classList.add('hidden');
}

// ==========================================
// API CALLS (BACKEND)
// ==========================================
const API_BASE = '/api';

async function authFetch(endpoint, options = {}) {
    // if (!currentToken) return; // Disabled for test mode

    const headers = {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${currentToken}`, // Not needed for permitAll
        ...options.headers
    };

    const response = await fetch(API_BASE + endpoint, { ...options, headers });

    // if (response.status === 401) { ... } // Backend won't return 401 now

    return response;
}

function refreshAll() {
    fetchPortfolio();
    fetchHistory();
}

// 1. Fetch Portfolio
async function fetchPortfolio() {
    const res = await authFetch('/portfolio');
    if (res.ok) {
        const data = await res.json();
        updateDashboard(data);
    }
}

// 2. Funds
async function manageFunds(action) {
    const amount = document.getElementById('fund-amount').value;
    if (!amount || amount <= 0) return alert("Enter valid amount");

    const res = await authFetch(`/funds/${action}?amount=${amount}`, { method: 'POST' });
    if (res.ok) {
        alert(`${action.toUpperCase()} Successful`);
        document.getElementById('fund-amount').value = '';
        fetchPortfolio();
    } else {
        alert("Transaction Failed: " + await res.text());
    }
}
document.getElementById('deposit-btn').addEventListener('click', () => manageFunds('deposit'));
document.getElementById('withdraw-btn').addEventListener('click', () => manageFunds('withdraw'));

// 3. Market Quote
document.getElementById('quote-btn').addEventListener('click', async () => {
    const symbol = document.getElementById('symbol-input').value.toUpperCase();
    if (!symbol) return;
    const res = await authFetch(`/market/quote/${symbol}`);
    if (res.ok) {
        const price = await res.json();
        document.getElementById('quote-display').textContent = `₹${price}`;
    } else {
        document.getElementById('quote-display').textContent = "Not Found";
    }
});

// 4. Trade
async function executeTrade(type) {
    const symbol = document.getElementById('symbol-input').value.toUpperCase();
    const quantity = document.getElementById('qty-input').value;
    if (!symbol || quantity < 1) return alert("Invalid inputs");

    if (confirm(`${type} ${quantity} of ${symbol}?`)) {
        const res = await authFetch('/trade', {
            method: 'POST',
            body: JSON.stringify({ symbol, quantity, type })
        });
        if (res.ok) {
            alert("Order Executed");
            fetchPortfolio();
            fetchHistory();
        } else {
            alert("Failed: " + await res.text());
        }
    }
}
document.getElementById('buy-btn').addEventListener('click', () => executeTrade('BUY'));
document.getElementById('sell-btn').addEventListener('click', () => executeTrade('SELL'));

// 5. History
async function fetchHistory() {
    const res = await authFetch('/transactions');
    if (res.ok) {
        const data = await res.json();
        const tbody = document.getElementById('history-list');
        tbody.innerHTML = '';
        data.forEach(t => {
            const row = `<tr>
                <td>${new Date(t.timestamp).toLocaleDateString()}</td>
                <td>${t.symbol}</td>
                <td class="${t.type === 'BUY' ? 'pos' : 'neg'}">${t.type}</td>
                <td>${t.quantity}</td>
                <td>${formatCurrency(t.price)}</td>
                <td>${formatCurrency(t.price * t.quantity)}</td>
            </tr>`;
            tbody.innerHTML += row;
        });
    }
}

// ==========================================
// UI UPDATES
// ==========================================
function updateDashboard(data) {
    document.getElementById('net-worth').textContent = formatCurrency(data.netWorth);
    document.getElementById('cash-balance').textContent = formatCurrency(data.cashBalance);
    document.getElementById('total-invested').textContent = formatCurrency(data.totalInvested);
    document.getElementById('total-pnl').textContent = formatCurrency(data.totalPnL);
    document.getElementById('total-pnl').className = data.totalPnL >= 0 ? 'pos' : 'neg';
    document.getElementById('pnl-percent').textContent = data.totalPnLPercentage.toFixed(2) + '%';

    const tbody = document.getElementById('holdings-list');
    tbody.innerHTML = '';
    data.holdings.forEach(h => {
        const row = `<tr>
            <td>${h.symbol}</td>
            <td>${h.quantity}</td>
            <td>${formatCurrency(h.averagePrice)}</td>
            <td>${formatCurrency(h.currentPrice)}</td>
            <td>${formatCurrency(h.currentValue)}</td>
            <td>${h.allocationPercentage.toFixed(1)}%</td>
            <td class="${h.pnl >= 0 ? 'pos' : 'neg'}">
                ${formatCurrency(h.pnl)} (${h.pnlPercentage.toFixed(2)}%)
            </td>
        </tr>`;
        tbody.innerHTML += row;
    });
}

function formatCurrency(val) {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);
}

checkUser();
