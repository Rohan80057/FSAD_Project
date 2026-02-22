import { Link } from 'react-router';
import { ArrowRight, TrendingUp, Shield, BarChart3, Target, Sparkles } from 'lucide-react';
import { GridPattern } from '../components/GridPattern';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { useAuth } from '../components/AuthProvider';

export function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen overflow-hidden relative">
      <GridPattern />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6 lg:px-12 min-h-screen flex items-center">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 left-10 w-64 h-64 border border-border/30"
            animate={{ x: mousePosition.x * 0.5, y: mousePosition.y * 0.5, rotate: 45 }}
            transition={{ type: 'spring', stiffness: 50 }}
          />
          <motion.div
            className="absolute bottom-20 right-20 w-96 h-96 border border-border/20"
            animate={{ x: -mousePosition.x * 0.3, y: -mousePosition.y * 0.3, rotate: -30 }}
            transition={{ type: 'spring', stiffness: 50 }}
          />
          <motion.div
            className="absolute top-1/4 right-1/3 w-96 h-96 rounded-full bg-primary/5 blur-3xl"
            animate={{ x: mousePosition.x * 0.2, y: mousePosition.y * 0.2, scale: [1, 1.1, 1] }}
            transition={{
              x: { type: 'spring', stiffness: 30 },
              y: { type: 'spring', stiffness: 30 },
              scale: { duration: 8, repeat: Infinity, ease: 'easeInOut' }
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                className="inline-flex items-center space-x-2 px-4 py-2 border border-border bg-muted/50 backdrop-blur-sm"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Sparkles size={16} className="text-primary" />
                <span className="text-sm tracking-wide">Next-Gen Portfolio Management</span>
              </motion.div>

              <div className="space-y-6">
                <motion.h1
                  className="text-6xl lg:text-7xl tracking-tight leading-[1.1]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Master Your
                  <br />
                  <span className="text-muted-foreground">Financial</span>
                  <br />
                  Journey
                </motion.h1>
                <motion.p
                  className="text-xl text-muted-foreground leading-relaxed max-w-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Track assets, analyze P&L, manage trades, and watch your portfolio grow — all with real market data powered by Yahoo Finance.
                </motion.p>
              </div>

              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {isAuthenticated ? (
                  <Link
                    to="/portfolio"
                    className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors group"
                  >
                    Go to Dashboard
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/signup"
                      className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors group"
                    >
                      Create Account
                      <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                    </Link>
                    <Link
                      to="/login"
                      className="inline-flex items-center justify-center px-8 py-4 border border-border hover:bg-muted transition-colors"
                    >
                      Sign In
                    </Link>
                  </>
                )}
                <Link
                  to="/markets"
                  className="inline-flex items-center justify-center px-8 py-4 border border-border hover:bg-muted transition-colors"
                >
                  Explore Markets
                </Link>
              </motion.div>

              {/* Stats */}
              <motion.div
                className="grid grid-cols-3 gap-6 pt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div>
                  <div className="text-3xl tracking-tight mb-1">Live</div>
                  <div className="text-sm text-muted-foreground">Market Prices</div>
                </div>
                <div>
                  <div className="text-3xl tracking-tight mb-1">Real</div>
                  <div className="text-sm text-muted-foreground">P&L Tracking</div>
                </div>
                <div>
                  <div className="text-3xl tracking-tight mb-1">Full</div>
                  <div className="text-sm text-muted-foreground">CRUD Portfolio</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right side: Feature highlights instead of image */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              {[
                { icon: BarChart3, title: 'Real-Time Portfolio', desc: 'Live prices from Yahoo Finance. See your P&L update instantly.' },
                { icon: TrendingUp, title: 'Trade Execution', desc: 'Buy and sell stocks with weighted-average cost tracking.' },
                { icon: Shield, title: 'Per-User Security', desc: 'Each user sees only their own portfolio. Supabase + JWT auth.' },
                { icon: Target, title: 'Complete P&L', desc: 'Unrealized & realized profit/loss per stock and overall.' },
              ].map((feature, i) => (
                <motion.div
                  key={feature.title}
                  className="border border-border p-6 hover:bg-muted/30 transition-colors"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                >
                  <div className="flex items-start gap-4">
                    <feature.icon size={24} className="mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg tracking-tight mb-1">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 lg:px-12 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl tracking-tight mb-6">
            Ready to manage your portfolio?
          </h2>
          <p className="text-xl mb-10 text-primary-foreground/80 max-w-2xl mx-auto">
            Create an account, deposit funds, and start trading in minutes.
          </p>
          <Link
            to={isAuthenticated ? '/portfolio' : '/signup'}
            className="inline-flex items-center justify-center px-8 py-4 bg-primary-foreground text-primary hover:bg-primary-foreground/90 transition-colors"
          >
            {isAuthenticated ? 'Go to Dashboard' : 'Get Started Free'}
          </Link>
        </div>
      </section>
    </div>
  );
}