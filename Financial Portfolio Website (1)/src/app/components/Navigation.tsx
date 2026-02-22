import { Link, useLocation, useNavigate } from 'react-router';
import { Menu, X, Moon, Sun, User, LogOut, Wallet } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { useTheme } from './ThemeProvider';
import { useAuth } from './AuthProvider';
import { apiFetch } from '../../utils/api';
import { toast } from 'sonner';

export function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [cashBalance, setCashBalance] = useState<number | null>(null);

  // Fetch cash balance when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      apiFetch('/portfolio')
        .then((data) => setCashBalance(data?.cashBalance ?? 0))
        .catch(() => setCashBalance(null));
    } else {
      setCashBalance(null);
    }
  }, [isAuthenticated, location.pathname]);

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out');
    navigate('/login');
  };

  const publicLinks = [
    { path: '/', label: 'Home' },
    { path: '/markets', label: 'Markets' },
    { path: '/about', label: 'About' },
  ];

  const authLinks = [
    { path: '/portfolio', label: 'Dashboard' },
    { path: '/transactions', label: 'Transactions' },
  ];

  const navLinks = isAuthenticated
    ? [publicLinks[0], ...authLinks, publicLinks[1], publicLinks[2]]
    : publicLinks;

  const displayName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'User';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <Logo size="md" showText={true} />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative text-sm tracking-wide transition-colors hover:text-foreground ${location.pathname === link.path ? 'text-foreground' : 'text-muted-foreground'
                  }`}
              >
                {link.label}
                {location.pathname === link.path && (
                  <span className="absolute -bottom-[17px] left-0 right-0 h-[2px] bg-foreground" />
                )}
              </Link>
            ))}

            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-muted transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center space-x-3 ml-2">
                {/* Cash Badge */}
                {cashBalance !== null && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-muted/50 border border-border text-xs">
                    <Wallet size={12} />
                    <span className="font-medium">${cashBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                )}
                <Link
                  to="/profile"
                  className="flex items-center gap-1.5 p-2 hover:bg-muted transition-colors text-sm"
                >
                  <User size={16} />
                  <span className="hidden lg:inline text-muted-foreground max-w-[100px] truncate">{displayName}</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs border border-border hover:bg-muted transition-colors"
                >
                  <LogOut size={14} />
                  <span className="hidden lg:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-5 py-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile */}
          <div className="md:hidden flex items-center space-x-2">
            <button onClick={toggleTheme} className="p-2" aria-label="Toggle theme">
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2" aria-label="Toggle menu">
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="px-6 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block py-2 text-sm tracking-wide ${location.pathname === link.path ? 'text-foreground' : 'text-muted-foreground'
                  }`}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                {cashBalance !== null && (
                  <div className="py-2 text-sm text-muted-foreground">
                    Cash: <span className="text-foreground font-medium">${cashBalance.toFixed(2)}</span>
                  </div>
                )}
                <Link to="/profile" onClick={() => setIsOpen(false)} className="block py-2 text-sm text-muted-foreground">
                  Profile ({displayName})
                </Link>
                <button
                  onClick={() => { setIsOpen(false); handleSignOut(); }}
                  className="block py-2 text-sm text-red-500"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setIsOpen(false)} className="block py-2 text-sm text-muted-foreground">
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}