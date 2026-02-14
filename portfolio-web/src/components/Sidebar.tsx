import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard, BarChart3, ArrowLeftRight, Building2, Settings,
    TrendingUp, PanelLeftOpen, Sun, Moon
} from 'lucide-react';
import { cn } from '@/lib/utils';

const primaryLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/holdings', icon: BarChart3, label: 'Holdings' },
    { to: '/activity', icon: ArrowLeftRight, label: 'Activity' },
    { to: '/accounts', icon: Building2, label: 'Accounts' },
];

const secondaryLinks = [
    { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(true);
    const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));

    const toggleTheme = () => {
        document.documentElement.classList.toggle('dark');
        setIsDark(!isDark);
    };

    return (
        <aside
            className={cn(
                'hidden md:flex flex-col h-screen border-r border-[var(--color-border)] bg-[var(--color-card)] transition-[width] duration-300 ease-in-out overflow-hidden',
                collapsed ? 'w-[var(--spacing-sidebar-collapsed)]' : 'w-[var(--spacing-sidebar)]'
            )}
        >
            {/* Logo */}
            <div className="flex items-center justify-center py-6">
                <NavLink to="/" className="flex items-center gap-3">
                    <div
                        className="w-10 h-10 rounded-full bg-[var(--color-primary)] flex items-center justify-center shadow-md transition-transform duration-700 ease-in-out hover:[transform:rotateY(180deg)]"
                        style={{ transformStyle: 'preserve-3d' }}
                    >
                        <TrendingUp className="w-5 h-5 text-[var(--color-primary-foreground)]" />
                    </div>
                    <span
                        className={cn(
                            'text-xl font-bold text-[var(--color-foreground)] transition-opacity delay-100 duration-300',
                            collapsed ? 'sr-only opacity-0' : 'block opacity-100'
                        )}
                    >
                        Apex
                    </span>
                </NavLink>
            </div>

            {/* Primary nav */}
            <nav className="flex-1 flex flex-col p-2 space-y-1">
                {primaryLinks.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        title={link.label}
                        className={({ isActive }) =>
                            cn(
                                'flex items-center h-12 rounded-[var(--radius)] text-sm font-medium transition-all duration-200',
                                collapsed ? 'justify-center px-0' : 'justify-start px-4 gap-3',
                                isActive
                                    ? 'bg-[var(--color-secondary)] text-[var(--color-foreground)]'
                                    : 'text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)]'
                            )
                        }
                    >
                        <link.icon className="w-5 h-5 shrink-0" />
                        <span
                            className={cn(
                                'transition-opacity delay-100 duration-300',
                                collapsed ? 'sr-only opacity-0' : 'block opacity-100'
                            )}
                        >
                            {link.label}
                        </span>
                    </NavLink>
                ))}
            </nav>

            {/* Secondary nav + controls */}
            <div className="flex flex-col p-2 space-y-1">
                {secondaryLinks.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        title={link.label}
                        className={({ isActive }) =>
                            cn(
                                'flex items-center h-12 rounded-[var(--radius)] text-sm font-medium transition-all duration-200',
                                collapsed ? 'justify-center px-0' : 'justify-start px-4 gap-3',
                                isActive
                                    ? 'bg-[var(--color-secondary)] text-[var(--color-foreground)]'
                                    : 'text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)]'
                            )
                        }
                    >
                        <link.icon className="w-5 h-5 shrink-0" />
                        <span
                            className={cn(
                                'transition-opacity delay-100 duration-300',
                                collapsed ? 'sr-only opacity-0' : 'block opacity-100'
                            )}
                        >
                            {link.label}
                        </span>
                    </NavLink>
                ))}

                {/* Theme toggle */}
                <button
                    onClick={toggleTheme}
                    title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    className={cn(
                        'flex items-center h-12 rounded-[var(--radius)] text-sm font-medium text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-all duration-200',
                        collapsed ? 'justify-center px-0' : 'justify-start px-4 gap-3'
                    )}
                >
                    {isDark ? <Sun className="w-5 h-5 shrink-0" /> : <Moon className="w-5 h-5 shrink-0" />}
                    <span className={cn('transition-opacity delay-100 duration-300', collapsed ? 'sr-only opacity-0' : 'block opacity-100')}>
                        {isDark ? 'Light Mode' : 'Dark Mode'}
                    </span>
                </button>

                {/* Separator */}
                <div className="separator my-1" />

                {/* Toggle collapse */}
                <div className="flex justify-end">
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
                        className="btn-ghost h-10 w-10 rounded-[var(--radius)] flex items-center justify-center text-[var(--color-muted-foreground)] hover:bg-transparent"
                    >
                        <PanelLeftOpen
                            className={cn(
                                'w-5 h-5 transition-transform duration-500 ease-in-out',
                                !collapsed && 'rotate-180'
                            )}
                        />
                    </button>
                </div>
            </div>
        </aside>
    );
}
