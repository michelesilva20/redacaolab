import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import { cn } from '../../lib/utils';

interface StreakBadgeProps {
  days: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const sizes = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-12 h-12 text-sm',
  lg: 'w-16 h-16 text-base',
};

const iconSizes = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

export function StreakBadge({ days, size = 'md', showLabel = true, className }: StreakBadgeProps) {
  const isActive = days > 0;

  return (
    <div className={cn('flex flex-col items-center gap-1', className)}>
      <motion.div
        whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
        className={cn(
          'relative rounded-full flex items-center justify-center',
          isActive
            ? 'bg-gradient-to-br from-accent-400 to-accent-600'
            : 'bg-neutral-200',
          sizes[size]
        )}
      >
        <Flame
          className={cn(
            iconSizes[size],
            isActive ? 'text-white' : 'text-neutral-400'
          )}
        />
        {isActive && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-white rounded-full px-1.5 py-0.5 text-xs font-bold text-accent-600 shadow-md"
          >
            {days}
          </motion.div>
        )}
      </motion.div>
      {showLabel && (
        <span className={cn('font-medium', isActive ? 'text-accent-600' : 'text-neutral-400')}>
          {days > 0 ? `${days} dias` : 'Comece!'}
        </span>
      )}
    </div>
  );
}
