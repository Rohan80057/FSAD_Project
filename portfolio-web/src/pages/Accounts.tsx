import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchAccounts, createAccount, deleteAccount } from '@/lib/api';
import { cn } from '@/lib/utils';
import { Plus, Trash2, Building2, CreditCard, Bitcoin, ChevronRight, Loader2 } from 'lucide-react';

const typeIcons: Record<string, any> = {
    BROKERAGE: Building2,
    BANK: CreditCard,
    CRYPTO: Bitcoin,
};

export default function Accounts() {
    const queryClient = useQueryClient();
    const { data: accounts, isLoading } = useQuery({
        queryKey: ['accounts'],
        queryFn: fetchAccounts,
    });

    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState('');
    const [type, setType] = useState('BROKERAGE');
    const [institution, setInstitution] = useState('');
    const [currency, setCurrency] = useState('INR');
    const [loading, setLoading] = useState(false);

    const handleCreate = async () => {
        if (!name) return;
        setLoading(true);
        try {
            await createAccount({ name, accountType: type, institution, currency });
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
            setName('');
            setInstitution('');
            setShowForm(false);
        } catch { }
        setLoading(false);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this account?')) return;
        try {
            await deleteAccount(id);
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
        } catch { }
    };

    if (isLoading) {
        return (
            <div className="p-8 lg:p-10 space-y-6">
                <div className="h-8 w-32 bg-[var(--color-muted)] rounded animate-pulse" />
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-20 bg-[var(--color-muted)] rounded-[var(--radius)] animate-pulse" />
                ))}
            </div>
        );
    }

    return (
        <div className="p-8 lg:p-10 space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold tracking-tight">Accounts</h1>
                <button onClick={() => setShowForm(!showForm)} className="btn btn-outline text-sm">
                    <Plus className="w-4 h-4" />
                    Add Account
                </button>
            </div>

            {/* Create form */}
            {showForm && (
                <div className="card p-6 animate-fadeIn">
                    <h3 className="text-sm font-semibold mb-5">New Account</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-[var(--color-muted-foreground)] mb-1.5">Name</label>
                            <input className="input" placeholder="My Portfolio" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-[var(--color-muted-foreground)] mb-1.5">Type</label>
                            <select className="input" value={type} onChange={(e) => setType(e.target.value)}>
                                <option value="BROKERAGE">Brokerage</option>
                                <option value="BANK">Bank</option>
                                <option value="CRYPTO">Crypto</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-[var(--color-muted-foreground)] mb-1.5">Institution</label>
                            <input className="input" placeholder="Zerodha, HDFC..." value={institution} onChange={(e) => setInstitution(e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-[var(--color-muted-foreground)] mb-1.5">Currency</label>
                            <select className="input" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                                <option value="INR">INR (₹)</option>
                                <option value="USD">USD ($)</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                        <button onClick={handleCreate} disabled={loading || !name} className="btn btn-primary text-sm disabled:opacity-50">
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create'}
                        </button>
                        <button onClick={() => setShowForm(false)} className="btn btn-ghost text-sm">Cancel</button>
                    </div>
                </div>
            )}

            {/* Accounts list */}
            <div className="space-y-4">
                {accounts && accounts.length > 0 ? (
                    accounts.map((acc) => {
                        const Icon = typeIcons[acc.accountType] || Building2;
                        return (
                            <div key={acc.id} className="card px-5 py-4 flex items-center justify-between transition-shadow duration-150 hover:shadow-md">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-[var(--color-muted)] flex items-center justify-center">
                                        <Icon className="w-5 h-5 text-[var(--color-muted-foreground)]" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold">{acc.name}</h3>
                                        <p className="text-xs text-[var(--color-muted-foreground)]">
                                            {acc.institution || acc.accountType} · {acc.currency}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleDelete(acc.id)}
                                        className="btn-ghost w-8 h-8 rounded-lg flex items-center justify-center text-[var(--color-muted-foreground)] hover:text-[var(--color-destructive)] transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                    <ChevronRight className="w-4 h-4 text-[var(--color-muted-foreground)]" />
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="card p-8 text-center">
                        <Building2 className="w-10 h-10 text-[var(--color-muted-foreground)] mx-auto mb-3" />
                        <p className="text-sm text-[var(--color-muted-foreground)]">No accounts found.</p>
                        <button
                            onClick={() => setShowForm(true)}
                            className="text-xs text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] underline-offset-4 hover:underline mt-2 inline-flex items-center gap-1"
                        >
                            Add your first account <ChevronRight className="w-3 h-3" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
