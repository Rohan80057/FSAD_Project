import { Info, Code2, ExternalLink } from 'lucide-react';

const techStack = [
    { name: 'React 18', description: 'UI Framework' },
    { name: 'TypeScript', description: 'Type Safety' },
    { name: 'Vite', description: 'Build Tool' },
    { name: 'Tailwind CSS v4', description: 'Styling' },
    { name: 'Recharts', description: 'Charts' },
    { name: 'React Query', description: 'Data Fetching' },
    { name: 'Spring Boot', description: 'Backend' },
    { name: 'PostgreSQL', description: 'Database' },
];

export default function Settings() {
    return (
        <div className="p-8 lg:p-10 space-y-8 max-w-3xl">
            <h1 className="text-xl font-bold tracking-tight">Settings</h1>

            {/* App Info */}
            <div className="card p-6">
                <div className="flex items-center gap-4 mb-5">
                    <div className="w-11 h-11 rounded-xl bg-[var(--color-muted)] flex items-center justify-center">
                        <Info className="w-5 h-5 text-[var(--color-muted-foreground)]" />
                    </div>
                    <div>
                        <h3 className="text-base font-semibold">Apex Portfolio</h3>
                        <p className="text-sm text-[var(--color-muted-foreground)]">v1.0.0 · FSAD Project</p>
                    </div>
                </div>
                <div className="separator mb-5" />
                <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-[var(--color-muted-foreground)]">Project</span>
                        <span className="font-medium">Full Stack Application Development</span>
                    </div>
                    <div className="separator" />
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-[var(--color-muted-foreground)]">Architecture</span>
                        <span className="font-medium">Spring Boot + React</span>
                    </div>
                    <div className="separator" />
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-[var(--color-muted-foreground)]">Database</span>
                        <span className="font-medium">PostgreSQL (Supabase)</span>
                    </div>
                    <div className="separator" />
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-[var(--color-muted-foreground)]">Market Data</span>
                        <span className="font-medium">Yahoo Finance API</span>
                    </div>
                </div>
            </div>

            {/* Tech Stack */}
            <div className="card p-6">
                <div className="flex items-center gap-4 mb-5">
                    <div className="w-11 h-11 rounded-xl bg-[var(--color-muted)] flex items-center justify-center">
                        <Code2 className="w-5 h-5 text-[var(--color-muted-foreground)]" />
                    </div>
                    <h3 className="text-base font-semibold">Tech Stack</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {techStack.map((tech) => (
                        <div key={tech.name} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-muted)] p-4">
                            <p className="text-sm font-semibold">{tech.name}</p>
                            <p className="text-xs text-[var(--color-muted-foreground)] mt-0.5">{tech.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Credits */}
            <div className="card p-6">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-11 h-11 rounded-xl bg-[var(--color-muted)] flex items-center justify-center">
                        <ExternalLink className="w-5 h-5 text-[var(--color-muted-foreground)]" />
                    </div>
                    <h3 className="text-base font-semibold">Credits</h3>
                </div>
                <p className="text-sm text-[var(--color-muted-foreground)] leading-relaxed">
                    UI design inspired by{' '}
                    <a
                        href="https://wealthfolio.app"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--color-accent)] hover:underline underline-offset-4 font-medium"
                    >
                        Wealthfolio
                    </a>
                    {' '}— an open-source desktop portfolio tracker.
                </p>
            </div>
        </div>
    );
}
