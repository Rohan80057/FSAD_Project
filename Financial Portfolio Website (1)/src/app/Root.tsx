import { Outlet } from 'react-router';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { ThemeProvider } from './components/ThemeProvider';
import { AuthProvider } from './components/AuthProvider';
import { Toaster } from './components/ui/sonner';

export function Root() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="min-h-screen flex flex-col">
          <Navigation />
          <main className="flex-grow">
            <Outlet />
          </main>
          <Footer />
          <Toaster richColors position="top-right" />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}