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

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: Home },
      {
        path: 'portfolio',
        element: <ProtectedRoute><Portfolio /></ProtectedRoute>,
      },
      { path: 'markets', Component: Markets },
      {
        path: 'goals',
        element: <ProtectedRoute><Goals /></ProtectedRoute>,
      },
      {
        path: 'transactions',
        element: <ProtectedRoute><Transactions /></ProtectedRoute>,
      },
      {
        path: 'profile',
        element: <ProtectedRoute><Profile /></ProtectedRoute>,
      },
      { path: 'about', Component: About },
      { path: 'login', Component: Login },
      { path: 'signup', Component: Signup },
      { path: '*', Component: NotFound },
    ],
  },
]);