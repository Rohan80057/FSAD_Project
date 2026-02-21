import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

interface AnimatedBackgroundProps {
  intensity?: 'low' | 'medium' | 'high';
}

export function AnimatedBackground({ intensity = 'medium' }: AnimatedBackgroundProps) {
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

  const multiplier = intensity === 'low' ? 0.3 : intensity === 'high' ? 1.2 : 1;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50">
      {/* Main geometric shapes */}
      <motion.div
        className="absolute top-20 left-10 w-64 h-64 border border-border/20"
        animate={{
          x: mousePosition.x * 0.5 * multiplier,
          y: mousePosition.y * 0.5 * multiplier,
          rotate: 45,
        }}
        transition={{ type: 'spring', stiffness: 50, damping: 20 }}
      />
      
      <motion.div
        className="absolute bottom-20 right-20 w-80 h-80 border border-border/15"
        animate={{
          x: -mousePosition.x * 0.3 * multiplier,
          y: -mousePosition.y * 0.3 * multiplier,
          rotate: -30,
        }}
        transition={{ type: 'spring', stiffness: 40, damping: 20 }}
      />

      {/* Floating gradient orbs */}
      <motion.div
        className="absolute top-1/4 right-1/3 w-96 h-96 rounded-full bg-primary/5 blur-3xl"
        animate={{
          x: mousePosition.x * 0.2 * multiplier,
          y: mousePosition.y * 0.2 * multiplier,
          scale: [1, 1.1, 1],
        }}
        transition={{ 
          x: { type: 'spring', stiffness: 30 },
          y: { type: 'spring', stiffness: 30 },
          scale: { duration: 8, repeat: Infinity, ease: 'easeInOut' }
        }}
      />
      
      <motion.div
        className="absolute bottom-1/4 left-1/3 w-80 h-80 rounded-full bg-muted/10 blur-3xl"
        animate={{
          x: -mousePosition.x * 0.3 * multiplier,
          y: -mousePosition.y * 0.3 * multiplier,
          scale: [1, 1.2, 1],
        }}
        transition={{ 
          x: { type: 'spring', stiffness: 30 },
          y: { type: 'spring', stiffness: 30 },
          scale: { duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }
        }}
      />

      {/* Small accent shapes */}
      {intensity !== 'low' && (
        <>
          <motion.div
            className="absolute top-1/3 left-1/4 w-32 h-32 border-2 border-primary/10"
            animate={{
              x: mousePosition.x * 0.4 * multiplier,
              y: -mousePosition.y * 0.4 * multiplier,
              rotate: 60,
            }}
            transition={{ type: 'spring', stiffness: 40, damping: 15 }}
          />
          
          <motion.div
            className="absolute bottom-1/3 right-1/4 w-40 h-40 bg-muted/10"
            animate={{
              x: -mousePosition.x * 0.6 * multiplier,
              y: mousePosition.y * 0.5 * multiplier,
              rotate: -45,
            }}
            transition={{ type: 'spring', stiffness: 30, damping: 12 }}
          />
        </>
      )}
    </div>
  );
}
