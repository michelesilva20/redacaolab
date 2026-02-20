import { motion } from 'framer-motion';
import type { Badge } from '../../types';
import { cn } from '../../lib/utils';

interface BadgeCardProps {
  badge: Badge;
  unlocked?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

const sizes = {
  sm: 'w-12 h-12 text-xl',
  md: 'w-16 h-16 text-2xl',
  lg: 'w-20 h-20 text-3xl',
};

const categoryColors = {
  streak: 'from-accent-400 to-accent-600',
  essays: 'from-primary-400 to-primary-600',
  competency: 'from-secondary-400 to-secondary-600',
  special: 'from-highlight-400 to-highlight-600',
};

export function BadgeCard({ badge, unlocked = true, size = 'md', showDetails = true }: BadgeCardProps) {
  return (
    <motion.div
      whileHover={unlocked ? { scale: 1.05, y: -2 } : undefined}
      className={cn(
        'flex flex-col items-center gap-2',
        !unlocked && 'opacity-40 grayscale'
      )}
    >
      <div
        className={cn(
          'rounded-2xl flex items-center justify-center shadow-lg',
          unlocked
            ? `bg-gradient-to-br ${categoryColors[badge.category]}`
            : 'bg-neutral-300',
          sizes[size]
        )}
      >
        <span>{badge.icon}</span>
      </div>
      {showDetails && (
        <div className="text-center">
          <p className="text-sm font-medium text-neutral-800">{badge.name}</p>
          <p className="text-xs text-neutral-500">{badge.description}</p>
        </div>
      )}
    </motion.div>
  );
}
