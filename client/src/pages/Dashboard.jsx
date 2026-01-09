import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, TrendingUp, TrendingDown, Target } from 'lucide-react';

const Card = ({ title, amount, icon, color }) => (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 transition-all hover:bg-white/10">
        <div className="flex justify-between items-start mb-4">
            <span className="text-white/60 text-sm font-medium">{title}</span>
            <div
                className="p-2 rounded-lg"
                style={{ backgroundColor: `${color}20`, color: color }}
            >
                {icon}
            </div>
        </div>
        <div className="text-3xl font-bold text-white tracking-tight">${amount.toLocaleString()}</div>
        <div className="text-white/40 text-xs mt-2">+2.5% from last month</div>
    </div>
);

const Dashboard = () => {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        fetch('http://localhost:5000/api/dashboard/stats')
            .then(res => res.json())
            .then(data => setStats(data))
            .catch(err => console.error('Failed to fetch stats:', err));
    }, []);

    // Mock data for chart - in real app, fetch this too
    const data = [
        { name: 'Jan', income: 4000, expense: 2400 },
        { name: 'Feb', income: 3000, expense: 1398 },
        { name: 'Mar', income: 2000, expense: 9800 },
        { name: 'Apr', income: 2780, expense: 3908 },
        { name: 'May', income: 1890, expense: 4800 },
        { name: 'Jun', income: 2390, expense: 3800 },
        { name: 'Jul', income: 3490, expense: 4300 },
    ];

    if (!stats) return <div className="p-8 text-white/50">Loading stats...</div>;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-white tracking-tight">Dashboard</h2>
                    <p className="text-white/50 mt-1">Welcome back to your financial command center.</p>
                </div>
                <button className="bg-white text-black px-6 py-2.5 rounded-full font-medium hover:bg-white/90 transition-colors">
                    Download Report
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card
                    title="Total Balance"
                    amount={stats.balance}
                    icon={<DollarSign size={20} />}
                    color="#ffffff"
                />
                <Card
                    title="Income"
                    amount={stats.totalIncome}
                    icon={<TrendingUp size={20} />}
                    color="#10b981"
                />
                <Card
                    title="Expenses"
                    amount={stats.totalExpenses}
                    icon={<TrendingDown size={20} />}
                    color="#ef4444"
                />
                <Card
                    title="Savings Goal"
                    amount={12000}
                    icon={<Target size={20} />}
                    color="#f59e0b"
                />
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm p-8 h-[500px]">
                <h3 className="text-xl font-bold text-white mb-6">Cash Flow Analytics</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 40 }}>
                        <defs>
                            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ffffff" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#666666" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#666666" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis
                            dataKey="name"
                            stroke="rgba(255,255,255,0.3)"
                            tick={{ fill: 'rgba(255,255,255,0.5)' }}
                            axisLine={false}
                            tickLine={false}
                            dy={10}
                        />
                        <YAxis
                            stroke="rgba(255,255,255,0.3)"
                            tick={{ fill: 'rgba(255,255,255,0.5)' }}
                            axisLine={false}
                            tickLine={false}
                            tickFormatter={(value) => `$${value}`}
                            dx={-10}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(0,0,0,0.8)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '12px',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
                            }}
                            itemStyle={{ color: '#fff' }}
                            cursor={{ stroke: 'rgba(255,255,255,0.2)', strokeWidth: 2 }}
                        />
                        <Area
                            type="monotone"
                            dataKey="income"
                            stroke="#ffffff"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorIncome)"
                        />
                        <Area
                            type="monotone"
                            dataKey="expense"
                            stroke="#666666"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorExpense)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default Dashboard;
