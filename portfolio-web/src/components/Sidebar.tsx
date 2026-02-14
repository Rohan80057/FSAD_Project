import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BarChart3, ArrowLeftRight, Building2, Settings, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const links = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/holdings', icon: BarChart3, label: 'Holdings' },
    { to: '/activity', icon: ArrowLeftRight, label: 'Activity' },
    { to: '/accounts', icon: Building2, label: 'Accounts' },
    { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
    return (
        <aside className="hidden lg:flex flex-col w-64 border-r border-[var(--color-border)] bg-[var(--color-card)] h-screen">
            {/* Logo */}
            <div className="flex items-center gap-3 px-6 py-5 border-b border-[var(--color-border)]">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h1 className="text-lg font-bold tracking-tight">Apex</h1>
                    <p className="text-xs text-[var(--color-muted-foreground)]">Portfolio Tracker</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1">
                {links.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        className={({ isActive }) =>
                            cn(
                                'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                                isActive
                                    ? 'bg-[var(--color-accent)]/15 text-[var(--color-accent)] shadow-sm'
                                    : 'text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] hover:bg-[var(--color-muted)]/50'
                            )
                        }
                    >
                        <link.icon className="w-4.5 h-4.5" />
                        {link.label}
                    </NavLink>
                ))}
            </nav>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-[var(--color-border)]">
                <p className="text-xs text-[var(--color-muted-foreground)]">Apex Portfolio v1.0</p>
                <p className="text-xs text-[var(--color-muted-foreground)]">FSAD Project</p>
            </div>
        </aside>
    );
}
