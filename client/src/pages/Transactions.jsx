import React, { useEffect, useState } from 'react';
import { Plus, Trash2, ArrowUpRight, ArrowDownLeft, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [form, setForm] = useState({ text: '', amount: '', type: 'expense', date: '' });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = () => {
        fetch('http://localhost:5000/api/transactions')
            .then(res => res.json())
            .then(data => {
                setTransactions(data);
                setIsLoading(false);
            })
            .catch(err => console.error(err));
    };

    const handleDelete = (id) => {
        fetch(`http://localhost:5000/api/transactions/${id}`, { method: 'DELETE' })
            .then(() => {
                setTransactions(transactions.filter(t => t.id !== id));
            });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('http://localhost:5000/api/transactions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...form,
                amount: Number(form.amount),
                date: new Date().toLocaleDateString() // Add current date if missing
            })
        })
            .then(res => res.json())
            .then(newTx => {
                setTransactions([...transactions, newTx]);
                setForm({ text: '', amount: '', type: 'expense', date: '' });
            });
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-end justify-between"
            >
                <div>
                    <h2 className="text-4xl font-bold text-white tracking-tighter">Transactions</h2>
                    <p className="text-white/40 mt-2 font-light tracking-wide">Manage your financial history</p>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* List Section */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-2 space-y-6"
                >
                    <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-md p-8 min-h-[500px]">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-lg font-medium text-white/80 tracking-wide uppercase">Recent Activity</h3>
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/5">
                                <Search size={16} className="text-white/40" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="bg-transparent border-none focus:outline-none text-sm text-white placeholder-white/20 w-32"
                                />
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="text-white/30 text-center py-10 animate-pulse">Loading Data...</div>
                        ) : (
                            <div className="space-y-3">
                                <AnimatePresence>
                                    {transactions.map((t, i) => (
                                        <motion.div
                                            key={t.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ delay: i * 0.05 }}
                                            className="group flex justify-between items-center p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] transition-all duration-300"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`p-3 rounded-xl ${t.type === 'income' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                                    {t.type === 'income' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-white text-base">{t.text}</div>
                                                    <div className="text-white/30 text-xs mt-0.5">{t.date || 'Today'}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                <div className={`font-semibold text-lg tracking-tight ${t.type === 'income' ? 'text-emerald-400' : 'text-white'}`}>
                                                    {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString()}
                                                </div>
                                                <button
                                                    onClick={() => handleDelete(t.id)}
                                                    className="p-2 text-white/20 hover:text-white/80 hover:bg-white/10 rounded-lg transition-all"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                                {transactions.length === 0 && (
                                    <div className="text-center py-20 text-white/20">No transactions found</div>
                                )}
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Form Section */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-md p-8 sticky top-8">
                        <h3 className="text-lg font-medium text-white/80 tracking-wide uppercase mb-6">Add Transaction</h3>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-wider text-white/40 font-medium ml-1">Description</label>
                                <input
                                    type="text"
                                    value={form.text}
                                    onChange={e => setForm({ ...form, text: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:bg-white/10 focus:border-white/20 focus:outline-none transition-all placeholder-white/20"
                                    placeholder="e.g., Salary, Groceries"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-wider text-white/40 font-medium ml-1">Amount</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">$</span>
                                    <input
                                        type="number"
                                        value={form.amount}
                                        onChange={e => setForm({ ...form, amount: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-8 pr-4 py-3 text-white focus:bg-white/10 focus:border-white/20 focus:outline-none transition-all placeholder-white/20"
                                        placeholder="0.00"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-wider text-white/40 font-medium ml-1">Type</label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setForm({ ...form, type: 'expense' })}
                                        className={`py-3 rounded-xl border text-sm font-medium transition-all duration-300 ${form.type === 'expense'
                                                ? 'bg-white text-black border-white'
                                                : 'bg-transparent text-white/40 border-white/10 hover:bg-white/5'
                                            }`}
                                    >
                                        Expense
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setForm({ ...form, type: 'income' })}
                                        className={`py-3 rounded-xl border text-sm font-medium transition-all duration-300 ${form.type === 'income'
                                                ? 'bg-white text-black border-white'
                                                : 'bg-transparent text-white/40 border-white/10 hover:bg-white/5'
                                            }`}
                                    >
                                        Income
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full mt-4 bg-white text-black font-semibold py-4 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 uppercase tracking-wide text-sm"
                            >
                                <Plus size={18} />
                                Add Record
                            </button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Transactions;
