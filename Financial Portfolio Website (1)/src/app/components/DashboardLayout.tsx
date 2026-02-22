import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import {
    LayoutDashboard, ArrowLeftRight, Target, User, LogOut,
    TrendingUp, Moon, Sun, Menu, X, DollarSign, ChevronRight
} from 'lucide-react';
import { useState } from 'react';
import { Logo } from './Logo';
import { useTheme } from './ThemeProvider';
import { useAuth } from './AuthProvider';
import { toast } from 'sonner';

const sidebarLinks = [
    { path: '/portfolio', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
    { path: '/goals', label: 'Goals', icon: Target },
    { path: '/markets', label: 'Markets', icon: TrendingUp },
    { path: '/profile', label: 'Profile', icon: User },
];

export function DashboardLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const { user, signOut } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const displayName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';

    const handleSignOut = async () => {
        await signOut();
        toast.success('Signed out successfully');
        navigate('/login');
    };

    return (
        <div className="min-h-screen flex bg-background">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-card border-r border-border
        transform transition-transform duration-200 ease-in-out
        lg:translate-x-0 lg:static lg:z-auto
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
                <div className="flex flex-col h-full">
                    {/* Sidebar Header */}
                    <div className="h-16 flex items-center justify-between px-6 border-b border-border">
                        <Link to="/portfolio" className="flex items-center">
                            <Logo size="sm" showText={true} />
                        </Link>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden p-1 hover:bg-muted rounded transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Nav Links */}
                    <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
                        {sidebarLinks.map((link) => {
                            const isActive = location.pathname === link.path;
                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium
                    transition-all duration-150
                    ${isActive
                                            ? 'bg-primary text-primary-foreground shadow-sm'
                                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                        }
                  `}
                                >
                                    <link.icon size={18} />
                                    <span>{link.label}</span>
                                    {isActive && <ChevronRight size={14} className="ml-auto" />}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Sidebar Footer */}
                    <div className="border-t border-border p-4 space-y-2">
                        <button
                            onClick={toggleTheme}
                            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-md text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                        >
                            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                            <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                        </button>
                        <button
                            onClick={handleSignOut}
                            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-md text-sm text-destructive hover:bg-destructive/10 transition-colors"
                        >
                            <LogOut size={18} />
                            <span>Sign Out</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen">
                {/* Top Bar */}
                <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-30">
                    <div className="flex items-center justify-between h-full px-6">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden p-2 hover:bg-muted rounded-md transition-colors"
                            >
                                <Menu size={20} />
                            </button>
                            <div>
                                <h1 className="text-lg font-semibold tracking-tight capitalize">
                                    {location.pathname.split('/')[1] || 'Dashboard'}
                                </h1>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-md">
                                <DollarSign size={14} className="text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">
                                    Welcome, <span className="text-foreground font-medium">{displayName}</span>
                                </span>
                            </div>
                            <Link
                                to="/profile"
                                className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-semibold text-sm"
                            >
                                {displayName.charAt(0).toUpperCase()}
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
