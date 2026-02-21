import { useTheme } from './ThemeProvider';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function Logo({ size = 'md', showText = true }: LogoProps) {
  const { theme } = useTheme();
  
  const sizes = {
    sm: { container: 'w-8 h-8', text: 'text-sm', logoText: 'text-lg' },
    md: { container: 'w-10 h-10', text: 'text-base', logoText: 'text-xl' },
    lg: { container: 'w-16 h-16', text: 'text-2xl', logoText: 'text-4xl' },
  };

  const currentSize = sizes[size];

  return (
    <div className="flex items-center space-x-3">
      {/* Logo Icon */}
      <div className={`${currentSize.container} bg-primary flex items-center justify-center relative overflow-hidden`}>
        {/* Triangle shape for "A" */}
        <svg viewBox="0 0 40 40" className="w-full h-full">
          <path
            d="M 20 8 L 32 32 L 8 32 Z"
            fill={theme === 'dark' ? '#0a0a0a' : '#ffffff'}
            stroke={theme === 'dark' ? '#0a0a0a' : '#ffffff'}
            strokeWidth="2"
          />
          {/* Inner detail */}
          <path
            d="M 20 15 L 26 28 L 14 28 Z"
            fill={theme === 'dark' ? '#ffffff' : '#0a0a0a'}
          />
        </svg>
      </div>
      
      {/* Logo Text */}
      {showText && (
        <span className={`${currentSize.text} tracking-tight font-semibold`}>
          Apex<span className="font-light">Folio</span>
        </span>
      )}
    </div>
  );
}
