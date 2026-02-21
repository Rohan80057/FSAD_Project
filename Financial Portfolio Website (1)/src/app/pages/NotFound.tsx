import { Link } from 'react-router';
import { Home } from 'lucide-react';

export function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-2xl">
        <div className="text-9xl tracking-tight mb-8">404</div>
        <h1 className="text-4xl tracking-tight mb-4">Page Not Found</h1>
        <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Home size={20} className="mr-2" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
