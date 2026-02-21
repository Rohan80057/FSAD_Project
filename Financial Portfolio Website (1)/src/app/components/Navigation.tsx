import { Link, useLocation, useNavigate } from 'react-router';
import { Menu, X, Moon, Sun, User, LogOut } from 'lucide-react';
import { useState } from 'react';
import { Logo } from './Logo';
import { useTheme } from './ThemeProvider';
import { useAuth } from './AuthProvider';
import { toast } from 'sonner';

export function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully');
    navigate('/login');
  };

  // Public links always visible
  const publicLinks = [
    { path: '/', label: 'Home' },
    { path: '/markets', label: 'Markets' },
    { path: '/about', label: 'About' },
  ];

  // Links only visible when authenticated
  const authLinks = [
    { path: '/portfolio', label: 'Portfolio' },
    { path: '/transactions', label: 'Transactions' },
    { path: '/goals', label: 'Goals' },
  ];

  const navLinks = isAuthenticated ? [...publicLinks.slice(0, 1), ...authLinks, ...publicLinks.slice(1)] : publicLinks;

  const displayName = user?.user_metadata?.name || user?.email || 'User';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <Logo size="md" showText={true} />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative tracking-wide transition-colors hover:text-foreground ${location.pathname === link.path
                    ? 'text-foreground'
                    : 'text-muted-foreground'
                  }`}
              >
                {link.label}
                {location.pathname === link.path && (
                  <span className="absolute -bottom-[21px] left-0 right-0 h-[1px] bg-foreground" />
                )}
              </Link>
            ))}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-muted transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {/* Profile / Login / Sign Out */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 p-2 hover:bg-muted transition-colors"
                  aria-label="Profile"
                >
                  <User size={20} />
                  <span className="text-sm text-muted-foreground max-w-[120px] truncate">{displayName}</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-1 px-4 py-2 border border-border hover:bg-muted transition-colors text-sm"
                >
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-6 py-2 border border-border hover:bg-muted transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <div className="px-6 py-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block py-2 tracking-wide transition-colors ${location.pathname === link.path
                    ? 'text-foreground'
                    : 'text-muted-foreground'
                  }`}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="block py-2 tracking-wide transition-colors text-muted-foreground"
                >
                  Profile ({displayName})
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleSignOut();
                  }}
                  className="block py-2 tracking-wide transition-colors text-destructive"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block py-2 tracking-wide transition-colors text-muted-foreground"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}