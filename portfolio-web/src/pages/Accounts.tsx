import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchAccounts, createAccount, deleteAccount } from '@/lib/api';
import { Plus, Trash2, Building2, Loader2 } from 'lucide-react';

const ACCOUNT_TYPES = ['BROKERAGE', 'BANK', 'CRYPTO', 'RETIREMENT'];
const TYPE_COLORS: Record<string, string> = {
    BROKERAGE: 'from-indigo-500 to-purple-600',
    BANK: 'from-emerald-500 to-teal-600',
    CRYPTO: 'from-orange-500 to-amber-600',
    RETIREMENT: 'from-pink-500 to-rose-600',
};

export default function Accounts() {
    const queryClient = useQueryClient();
    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState('');
    const [accountType, setAccountType] = useState('BROKERAGE');
    const [institution, setInstitution] = useState('');
    const [loading, setLoading] = useState(false);

    const { data: accounts, isLoading } = useQuery({
        queryKey: ['accounts'],
        queryFn: fetchAccounts,
    });

    const handleCreate = async () => {
        if (!name.trim()) return;
        setLoading(true);
        try {
            await createAccount({
                name: name.trim(),
                accountType,
                institution: institution.trim() || undefined,
            });
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
            setName('');
            setInstitution('');
            setShowForm(false);
        } catch {
            /* ignore */
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this account?')) return;
        await deleteAccount(id);
        queryClient.invalidateQueries({ queryKey: ['accounts'] });
    };

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="glass rounded-xl p-6 h-36 animate-pulse" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Accounts</h1>
                    <p className="text-sm text-[var(--color-muted-foreground)] mt-1">
                        Manage your brokerage and bank accounts
                    </p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-[var(--color-accent)] text-white hover:brightness-110 transition-all"
                >
                    <Plus className="w-4 h-4" />
                    Add Account
                </button>
            </div>

            {/* Create Form */}
            {showForm && (
                <div className="glass rounded-xl p-6 animate-fadeIn">
                    <h3 className="text-lg font-semibold mb-4">New Account</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="text-sm text-[var(--color-muted-foreground)] mb-1.5 block">Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Zerodha"
                                className="w-full bg-[var(--color-muted)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--color-accent)] transition-colors"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-[var(--color-muted-foreground)] mb-1.5 block">Type</label>
                            <select
                                value={accountType}
                                onChange={(e) => setAccountType(e.target.value)}
                                className="w-full bg-[var(--color-muted)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--color-accent)] transition-colors"
                            >
                                {ACCOUNT_TYPES.map((t) => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-sm text-[var(--color-muted-foreground)] mb-1.5 block">Institution</label>
                            <input
                                type="text"
                                value={institution}
                                onChange={(e) => setInstitution(e.target.value)}
                                placeholder="Optional"
                                className="w-full bg-[var(--color-muted)] border border-[var(--color-border)] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--color-accent)] transition-colors"
                            />
                        </div>
                    </div>
                    <button
                        onClick={handleCreate}
                        disabled={loading}
                        className="mt-4 flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-xl bg-[var(--color-success)] text-white hover:brightness-110 transition-all disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                        Create Account
                    </button>
                </div>
            )}

            {/* Accounts Grid */}
            {accounts && accounts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {accounts.map((acc, i) => (
                        <div
                            key={acc.id}
                            className="glass rounded-xl p-6 hover:border-[var(--color-accent)]/30 transition-all animate-slideIn"
                            style={{ animationDelay: `${i * 50}ms` }}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${TYPE_COLORS[acc.accountType] || TYPE_COLORS.BROKERAGE} flex items-center justify-center`}>
                                        <Building2 className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">{acc.name}</h3>
                                        <p className="text-xs text-[var(--color-muted-foreground)]">
                                            {acc.accountType} {acc.institution ? `· ${acc.institution}` : ''}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDelete(acc.id)}
                                    className="p-1.5 rounded-lg text-[var(--color-muted-foreground)] hover:text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="mt-4 flex items-center gap-2">
                                <span className="text-xs px-2 py-0.5 rounded-full border border-[var(--color-border)] text-[var(--color-muted-foreground)]">
                                    {acc.currency}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="glass rounded-xl p-12 text-center animate-fadeIn">
                    <Building2 className="w-12 h-12 mx-auto text-[var(--color-muted-foreground)] mb-4" />
                    <p className="text-[var(--color-muted-foreground)]">No accounts yet. Create your first account!</p>
                </div>
            )}
        </div>
    );
}
