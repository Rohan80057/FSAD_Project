import { Link } from 'react-router';
import { ArrowRight, TrendingUp, Shield, BarChart3, Globe, Sparkles, Target, Bell } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { GridPattern } from '../components/GridPattern';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { authService } from '../../utils/auth';
import { toast } from 'sonner';

export function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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
      {/* Hero Section with 3D Parallax */}
      <section className="relative pt-32 pb-24 px-6 lg:px-12 min-h-screen flex items-center">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Floating geometric shapes with 3D effect */}
          <motion.div
            className="absolute top-20 left-10 w-64 h-64 border border-border/30"
            animate={{
              x: mousePosition.x * 0.5,
              y: mousePosition.y * 0.5,
              rotate: 45,
            }}
            transition={{ type: 'spring', stiffness: 50 }}
          />
          <motion.div
            className="absolute bottom-20 right-20 w-96 h-96 border border-border/20"
            animate={{
              x: -mousePosition.x * 0.3,
              y: -mousePosition.y * 0.3,
              rotate: -30,
            }}
            transition={{ type: 'spring', stiffness: 50 }}
          />
          <motion.div
            className="absolute top-1/2 left-1/3 w-48 h-48 bg-primary/5"
            animate={{
              x: mousePosition.x * 0.7,
              y: mousePosition.y * 0.7,
              scale: 1.05,
            }}
            transition={{ type: 'spring', stiffness: 50 }}
          />

          {/* Additional floating elements for depth */}
          <motion.div
            className="absolute top-40 right-1/4 w-32 h-32 border-2 border-primary/20"
            animate={{
              x: mousePosition.x * 0.4,
              y: -mousePosition.y * 0.4,
              rotate: 60,
            }}
            transition={{ type: 'spring', stiffness: 40, damping: 15 }}
          />

          <motion.div
            className="absolute bottom-1/3 left-1/4 w-40 h-40 bg-muted/20"
            animate={{
              x: -mousePosition.x * 0.6,
              y: mousePosition.y * 0.5,
              rotate: -45,
            }}
            transition={{ type: 'spring', stiffness: 30, damping: 12 }}
          />

          {/* Subtle gradient orbs */}
          <motion.div
            className="absolute top-1/4 right-1/3 w-96 h-96 rounded-full bg-primary/5 blur-3xl"
            animate={{
              x: mousePosition.x * 0.2,
              y: mousePosition.y * 0.2,
              scale: [1, 1.1, 1],
            }}
            transition={{
              x: { type: 'spring', stiffness: 30 },
              y: { type: 'spring', stiffness: 30 },
              scale: { duration: 8, repeat: Infinity, ease: 'easeInOut' }
            }}
          />

          <motion.div
            className="absolute bottom-1/4 left-1/2 w-80 h-80 rounded-full bg-muted/10 blur-3xl"
            animate={{
              x: -mousePosition.x * 0.3,
              y: -mousePosition.y * 0.3,
              scale: [1, 1.2, 1],
            }}
            transition={{
              x: { type: 'spring', stiffness: 30 },
              y: { type: 'spring', stiffness: 30 },
              scale: { duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }
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
                  Track assets, analyze risks, measure returns, and achieve your financial goals with ApexFolio's intelligent portfolio management platform.
                </motion.p>
              </div>

              <motion.div
                className="flex flex-col sm:flex-row gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Link
                  to="/portfolio"
                  className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors group"
                >
                  Get Started
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                </Link>
                <button
                  onClick={() => {
                    authService.setDevMode(true);
                    toast.success('Development Mode Enabled');
                    window.location.href = '/portfolio';
                  }}
                  className="inline-flex items-center justify-center px-8 py-4 border border-border hover:bg-muted transition-colors"
                >
                  Skip login (Dev Mode)
                </button>
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
                  <div className="text-3xl tracking-tight mb-1">2026</div>
                  <div className="text-sm text-muted-foreground">Built</div>
                </div>
                <div>
                  <div className="text-3xl tracking-tight mb-1">Open</div>
                  <div className="text-sm text-muted-foreground">Source</div>
                </div>
                <div>
                  <div className="text-3xl tracking-tight mb-1">FSAD</div>
                  <div className="text-sm text-muted-foreground">Project</div>
                </div>
              </motion.div>
            </motion.div>

            {/* 3D Image with Parallax */}
            <motion.div
              className="relative h-[500px] lg:h-[700px]"
              style={{
                rotateY: mousePosition.x * 0.5,
                rotateX: -mousePosition.y * 0.3,
              }}
              transition={{ type: 'spring', stiffness: 100 }}
            >
              <motion.div
                className="absolute inset-0 border border-border"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1726137065566-153debe32a53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW5hbmNpYWwlMjB0ZWNobm9sb2d5JTIwaW5ub3ZhdGlvbnxlbnwxfHx8fDE3NzEwODY1NzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Financial technology"
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <motion.div
                className="absolute -bottom-8 -right-8 w-64 h-64 border border-border bg-card"
                initial={{ opacity: 0, x: 50, y: 50 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <div className="p-6 flex flex-col justify-between h-full">
                  <div>
                    <div className="text-sm text-muted-foreground mb-2">Portfolio Value</div>
                    <div className="text-3xl tracking-tight">$342,500</div>
                  </div>
                  <div className="flex items-center text-success">
                    <TrendingUp size={20} className="mr-2" />
                    <span className="text-lg">+39.8%</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Floating Feature Cards */}
      <section className="py-32 px-6 lg:px-12 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-5xl tracking-tight mb-4">Everything You Need</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools for portfolio management, risk analysis, and financial planning.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: BarChart3, title: 'Asset Allocation', desc: 'Track equity, debt, cash, and alternatives with real-time valuation.' },
              { icon: TrendingUp, title: 'Returns Analysis', desc: 'Calculate absolute, CAGR, and XIRR returns automatically.' },
              { icon: Shield, title: 'Risk Metrics', desc: 'Measure volatility, beta, and maximum drawdown for informed decisions.' },
              { icon: Target, title: 'Goal Mapping', desc: 'Set and track short and long-term financial goals with reminders.' },
              { icon: Globe, title: 'Income Tracking', desc: 'Monitor dividends, interest, coupons, and all passive income.' },
              { icon: Bell, title: 'SIP Management', desc: 'Automate systematic investment plans with smart reminders.' },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                className="border border-border p-8 space-y-4 hover:bg-muted/30 transition-colors cursor-pointer group"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              >
                <feature.icon size={40} className="text-foreground group-hover:scale-110 transition-transform" />
                <h3 className="text-2xl tracking-tight">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 lg:px-12 bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-5xl lg:text-6xl tracking-tight mb-6">
            Ready to get started?
          </h2>
          <p className="text-xl mb-12 text-primary-foreground/80 max-w-2xl mx-auto">
            Join thousands of investors who trust ApexFolio with their financial future.
          </p>
          <Link
            to="/portfolio"
            className="inline-flex items-center justify-center px-8 py-4 bg-primary-foreground text-primary hover:bg-primary-foreground/90 transition-colors"
          >
            View Your Portfolio
          </Link>
        </div>
      </section>
    </div>
  );
}