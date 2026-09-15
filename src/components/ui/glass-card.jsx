import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';

/**
 * Modern GlassCard Container with Framer Motion hover & spring physics
 */
export function GlassCard({
  children,
  className = '',
  hoverEffect = true,
  onClick,
  ...props
}) {
  const { isDark } = useTheme();
  const Component = hoverEffect ? motion.div : 'div';
  const motionProps = hoverEffect
    ? {
        whileHover: { y: -3, transition: { duration: 0.2, ease: 'easeOut' } },
        whileTap: { scale: 0.99 }
      }
    : {};

  return (
    <Component
      className={cn(
        'glass-card relative overflow-hidden rounded-2xl p-6 backdrop-blur-xl transition-all duration-300',
        isDark
          ? 'border border-[rgba(56,149,255,0.22)] bg-[linear-gradient(145deg,rgba(14,33,58,0.85),rgba(7,19,35,0.88))] shadow-2xl text-slate-100'
          : 'border border-slate-200/90 bg-white/95 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.06)] text-slate-800 hover:border-slate-300 hover:shadow-[0_10px_25px_-3px_rgba(0,0,0,0.09)]',
        className
      )}
      onClick={onClick}
      {...motionProps}
      {...props}
    >
      {/* Light sheen overlay */}
      <div
        className={cn(
          'pointer-events-none absolute -inset-px opacity-0 hover:opacity-100 transition-opacity duration-500',
          isDark
            ? 'bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.05),transparent)]'
            : 'bg-[linear-gradient(120deg,transparent,rgba(14,165,233,0.05),transparent)]'
        )}
        aria-hidden="true"
      />
      {children}
    </Component>
  );
}
