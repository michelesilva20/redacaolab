import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { cn } from '../../lib/utils';

interface XPChipProps {
  amount: number;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
}

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-2 text-base',
};

const iconSizes = {
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
};

export function XPChip({ amount, size = 'md', animated = false, className }: XPChipProps) {
  const Wrapper = animated ? motion.div : 'div';
  const animationProps = animated
    ? {
        initial: { scale: 0.5, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        transition: { type: 'spring' as const, duration: 0.5 },
      }
    : {};

  return (
    <Wrapper
      {...animationProps}
      className={cn(
        'inline-flex items-center gap-1 bg-highlight-100 text-highlight-700 rounded-full font-medium',
        sizes[size],
        className
      )}
    >
      <Zap className={cn('text-highlight-500', iconSizes[size])} />
      <span>+{amount} XP</span>
    </Wrapper>
  );
}
