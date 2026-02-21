import { Target, Calendar, TrendingUp, AlertCircle, Plus, Check, Info } from 'lucide-react';
import { useState } from 'react';

// ⚠️ DEMO DATA — Goals feature is for demonstration purposes only.
// In a production app, this data would come from a backend API.
const goals = [
  {
    id: 1,
    name: 'Retirement Fund',
    targetAmount: 1000000,
    currentAmount: 342500,
    deadline: '2045-12-31',
    monthlyContribution: 2500,
    status: 'on-track',
    type: 'long-term',
    reminderMonths: [1, 6, 12],
  },
  {
    id: 2,
    name: 'House Down Payment',
    targetAmount: 150000,
    currentAmount: 85000,
    deadline: '2028-06-30',
    monthlyContribution: 2000,
    status: 'on-track',
    type: 'mid-term',
    reminderMonths: [3, 6, 12],
  },
  {
    id: 3,
    name: 'Emergency Fund',
    targetAmount: 50000,
    currentAmount: 48000,
    deadline: '2026-12-31',
    monthlyContribution: 500,
    status: 'ahead',
    type: 'short-term',
    reminderMonths: [1, 3, 6],
  },
  {
    id: 4,
    name: 'Vacation Fund',
    targetAmount: 15000,
    currentAmount: 8500,
    deadline: '2026-08-31',
    monthlyContribution: 1000,
    status: 'at-risk',
    type: 'short-term',
    reminderMonths: [1, 2, 3],
  },
];

export function Goals() {
  const [showNewGoal, setShowNewGoal] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ahead':
        return 'text-success border-success';
      case 'on-track':
        return 'text-foreground border-foreground';
      case 'at-risk':
        return 'text-destructive border-destructive';
      default:
        return 'text-muted-foreground border-muted-foreground';
    }
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const calculateMonthsRemaining = (deadline: string) => {
    const now = new Date();
    const end = new Date(deadline);
    const diff = end.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24 * 30));
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16 flex items-center justify-between">
          <div>
            <h1 className="text-6xl tracking-tight mb-4">Financial Goals</h1>
            <p className="text-xl text-muted-foreground">Plan and track your short & long-term objectives</p>
          </div>
          <button
            onClick={() => setShowNewGoal(true)}
            className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Plus size={20} className="mr-2" />
            New Goal
          </button>
        </div>

        {/* Demo Data Banner */}
        <div className="mb-8 border border-border bg-muted/50 p-4 flex items-center space-x-3">
          <Info size={20} className="text-muted-foreground flex-shrink-0" />
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Demo Data</span> — The goals shown below are sample data for demonstration purposes.
          </p>
        </div>

        {/* Goals Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="border border-border p-8 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground tracking-wide">TOTAL GOALS</span>
              <Target size={20} className="text-muted-foreground" />
            </div>
            <div className="text-4xl tracking-tight">{goals.length}</div>
            <div className="text-sm text-muted-foreground">Active financial goals</div>
          </div>

          <div className="border border-border p-8 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground tracking-wide">TARGET AMOUNT</span>
              <TrendingUp size={20} className="text-muted-foreground" />
            </div>
            <div className="text-4xl tracking-tight">
              ${goals.reduce((sum, goal) => sum + goal.targetAmount, 0).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Total target across all goals</div>
          </div>

          <div className="border border-border p-8 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground tracking-wide">ACHIEVED</span>
              <Check size={20} className="text-muted-foreground" />
            </div>
            <div className="text-4xl tracking-tight">
              ${goals.reduce((sum, goal) => sum + goal.currentAmount, 0).toLocaleString()}
            </div>
            <div className="text-sm text-success">
              {(
                (goals.reduce((sum, goal) => sum + goal.currentAmount, 0) /
                  goals.reduce((sum, goal) => sum + goal.targetAmount, 0)) *
                100
              ).toFixed(1)}
              % overall progress
            </div>
          </div>
        </div>

        {/* Goals List */}
        <div className="space-y-6">
          {goals.map((goal) => {
            const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
            const monthsRemaining = calculateMonthsRemaining(goal.deadline);
            const requiredMonthly =
              (goal.targetAmount - goal.currentAmount) / Math.max(monthsRemaining, 1);

            return (
              <div key={goal.id} className="border border-border p-8 hover:bg-muted/30 transition-colors">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Goal Info */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-2xl tracking-tight mb-2">{goal.name}</h3>
                        <div className="flex items-center space-x-4">
                          <span
                            className={`text-xs px-3 py-1 border ${getStatusColor(
                              goal.status
                            )}`}
                          >
                            {goal.status.toUpperCase().replace('-', ' ')}
                          </span>
                          <span className="text-sm text-muted-foreground capitalize">
                            {goal.type} goal
                          </span>
                        </div>
                      </div>
                      <Target size={32} className="text-muted-foreground" />
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">Progress</span>
                        <span className="text-sm font-medium">{progress.toFixed(1)}%</span>
                      </div>
                      <div className="h-3 bg-muted relative overflow-hidden">
                        <div
                          className={`absolute top-0 left-0 h-full transition-all ${goal.status === 'ahead'
                            ? 'bg-success'
                            : goal.status === 'at-risk'
                              ? 'bg-destructive'
                              : 'bg-foreground'
                            }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Amounts */}
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Current Amount</div>
                        <div className="text-2xl tracking-tight">
                          ${goal.currentAmount.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Target Amount</div>
                        <div className="text-2xl tracking-tight">
                          ${goal.targetAmount.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Timeline & Contributions */}
                  <div className="space-y-6">
                    <div className="border border-border p-6 space-y-4">
                      <div className="flex items-center space-x-2">
                        <Calendar size={20} className="text-muted-foreground" />
                        <span className="text-sm tracking-wide">TIMELINE</span>
                      </div>
                      <div>
                        <div className="text-2xl tracking-tight mb-1">{monthsRemaining}</div>
                        <div className="text-sm text-muted-foreground">months remaining</div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Target: {new Date(goal.deadline).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="border border-border p-6 space-y-4">
                      <div className="text-sm tracking-wide">MONTHLY CONTRIBUTION</div>
                      <div>
                        <div className="text-2xl tracking-tight mb-1">
                          ${goal.monthlyContribution.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">Current</div>
                      </div>
                      {requiredMonthly > goal.monthlyContribution && (
                        <div className="flex items-start space-x-2 text-xs text-destructive">
                          <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                          <span>
                            Need ${Math.ceil(requiredMonthly).toLocaleString()}/month to stay on
                            track
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="border border-border p-6 space-y-2">
                      <div className="text-sm tracking-wide mb-3">REMINDERS</div>
                      <div className="flex flex-wrap gap-2">
                        {goal.reminderMonths.map((month) => (
                          <span
                            key={month}
                            className="text-xs px-2 py-1 border border-border bg-muted"
                          >
                            Every {month} {month === 1 ? 'month' : 'months'}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
