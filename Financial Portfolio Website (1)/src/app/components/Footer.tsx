import { Link } from 'react-router';
import { Github, Linkedin, Twitter } from 'lucide-react';
import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Logo size="md" showText={true} />
            <p className="text-sm text-muted-foreground leading-relaxed">
              A student-built portfolio management platform. FSAD Course Project 2026.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="mb-4 tracking-wide">Navigation</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/portfolio" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link to="/markets" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Markets
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="mb-4 tracking-wide">Features</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/goals" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Goals
                </Link>
              </li>
              <li>
                <Link to="/transactions" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Transactions
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="mb-4 tracking-wide">Connect</h4>
            <div className="flex space-x-4">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-border flex items-center justify-center hover:bg-muted transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-border flex items-center justify-center hover:bg-muted transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-border flex items-center justify-center hover:bg-muted transition-colors"
                aria-label="GitHub"
              >
                <Github size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-muted-foreground">
            © 2026 ApexFolio. Built by Rohan Das, Tarun Muddana & Kridhaay.
          </p>
          <div className="flex space-x-6">
            <span className="text-sm text-muted-foreground">
              FSAD Course Project
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}