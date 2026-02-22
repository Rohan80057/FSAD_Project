import { createBrowserRouter } from 'react-router';
import { Root } from './Root';
import { Home } from './pages/Home';
import { Portfolio } from './pages/Portfolio';
import { Markets } from './pages/Markets';
import { About } from './pages/About';
import { Goals } from './pages/Goals';
import { Transactions } from './pages/Transactions';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Profile } from './pages/Profile';
import { NotFound } from './pages/NotFound';
import { ProtectedRoute } from './components/ProtectedRoute';
import { DashboardLayout } from './components/DashboardLayout';
import { ThemeProvider } from './components/ThemeProvider';
import { AuthProvider } from './components/AuthProvider';
import { Toaster } from './components/ui/sonner';

export const router = createBrowserRouter([
  // Public routes — use Root layout with marketing nav/footer
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: 'about', Component: About },
      { path: 'login', Component: Login },
      { path: 'signup', Component: Signup },
      { path: '*', Component: NotFound },
    ],
  },
  // Protected routes — use DashboardLayout with sidebar
  {
    element: (
      <ThemeProvider>
        <AuthProvider>
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
          <Toaster richColors position="top-right" />
        </AuthProvider>
      </ThemeProvider>
    ),
    children: [
      { path: 'portfolio', Component: Portfolio },
      { path: 'transactions', Component: Transactions },
      { path: 'goals', Component: Goals },
      { path: 'markets', Component: Markets },
      { path: 'profile', Component: Profile },
    ],
  },
]);