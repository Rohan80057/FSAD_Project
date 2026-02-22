import { Target } from 'lucide-react';
import { Link } from 'react-router';

export function Goals() {
  return (
    <div className="min-h-screen pt-28 pb-20 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl lg:text-5xl tracking-tight mb-2">Financial Goals</h1>
          <p className="text-muted-foreground">Plan and track your objectives</p>
        </div>

        <div className="border border-border p-12 text-center">
          <Target size={48} className="mx-auto mb-6 text-muted-foreground" />
          <h2 className="text-2xl tracking-tight mb-3">Goals — Coming Soon</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            Set short-term and long-term financial goals, track your progress, and get guidance on reaching your targets.
          </p>
          <Link
            to="/portfolio"
            className="inline-flex items-center px-6 py-3 border border-border hover:bg-muted transition-colors text-sm"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
