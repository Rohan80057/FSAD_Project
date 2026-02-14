import { TrendingUp, Github, Code2, Database, Shield, Zap } from 'lucide-react';

const techStack = [
    { icon: Code2, name: 'Spring Boot 3.2.3', desc: 'Java 17 Backend' },
    { icon: Database, name: 'PostgreSQL', desc: 'Supabase Cloud DB' },
    { icon: Zap, name: 'React + Vite', desc: 'TypeScript Frontend' },
    { icon: Shield, name: 'Spring Security', desc: 'JWT / OAuth2' },
];

export default function Settings() {
    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
                <p className="text-sm text-[var(--color-muted-foreground)] mt-1">Application information</p>
            </div>

            {/* App Info */}
            <div className="glass rounded-xl p-6 animate-fadeIn">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">Apex Portfolio</h2>
                        <p className="text-sm text-[var(--color-muted-foreground)]">Institutional Grade Portfolio Tracker</p>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-[var(--color-border)]/50">
                        <span className="text-sm text-[var(--color-muted-foreground)]">Version</span>
                        <span className="text-sm font-medium">1.0.0</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[var(--color-border)]/50">
                        <span className="text-sm text-[var(--color-muted-foreground)]">Project</span>
                        <span className="text-sm font-medium">FSAD Final Project</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-[var(--color-border)]/50">
                        <span className="text-sm text-[var(--color-muted-foreground)]">Market Data</span>
                        <span className="text-sm font-medium">Yahoo Finance API</span>
                    </div>
                </div>
            </div>

            {/* Tech Stack */}
            <div className="glass rounded-xl p-6 animate-fadeIn">
                <h3 className="text-lg font-semibold mb-4">Tech Stack</h3>
                <div className="grid grid-cols-2 gap-3">
                    {techStack.map((tech) => (
                        <div
                            key={tech.name}
                            className="flex items-center gap-3 p-3 rounded-lg border border-[var(--color-border)]/50 hover:border-[var(--color-accent)]/30 transition-colors"
                        >
                            <tech.icon className="w-5 h-5 text-[var(--color-accent)]" />
                            <div>
                                <p className="text-sm font-medium">{tech.name}</p>
                                <p className="text-xs text-[var(--color-muted-foreground)]">{tech.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Reference */}
            <div className="glass rounded-xl p-6 animate-fadeIn">
                <h3 className="text-lg font-semibold mb-3">Reference</h3>
                <p className="text-sm text-[var(--color-muted-foreground)]">
                    Inspired by{' '}
                    <a
                        href="https://github.com/afadil/wealthfolio"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--color-accent)] hover:underline inline-flex items-center gap-1"
                    >
                        <Github className="w-3.5 h-3.5" />
                        Wealthfolio
                    </a>
                    , re-engineered with Java Spring Boot backend.
                </p>
            </div>
        </div>
    );
}
