import { motion } from 'framer-motion';
import { Check, Zap } from 'lucide-react';
import type { Mission } from '../../types';
import { ProgressBar } from '../ui/ProgressBar';
import { cn } from '../../lib/utils';

interface MissionCardProps {
  mission: Mission;
  onComplete?: () => void;
}

export function MissionCard({ mission, onComplete }: MissionCardProps) {
  const isComplete = mission.completed || mission.progress >= mission.target;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={cn(
        'p-4 rounded-xl border transition-all',
        isComplete
          ? 'bg-success-50 border-success-200'
          : 'bg-white border-neutral-200 hover:border-primary-200'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className={cn(
              'font-medium',
              isComplete ? 'text-success-700' : 'text-neutral-800'
            )}>
              {mission.title}
            </h4>
            {mission.type === 'daily' && (
              <span className="text-xs px-2 py-0.5 bg-primary-100 text-primary-600 rounded-full">
                Diário
              </span>
            )}
          </div>
          <p className="text-sm text-neutral-500">{mission.description}</p>
        </div>
        
        <div className="flex items-center gap-1.5 px-2 py-1 bg-highlight-100 rounded-full">
          <Zap className="w-3 h-3 text-highlight-500" />
          <span className="text-xs font-medium text-highlight-700">
            +{mission.xpReward}
          </span>
        </div>
      </div>

      <div className="mt-3">
        <div className="flex items-center justify-between text-xs text-neutral-500 mb-1">
          <span>Progresso</span>
          <span>{mission.progress}/{mission.target}</span>
        </div>
        <ProgressBar
          value={mission.progress}
          max={mission.target}
          size="sm"
          variant={isComplete ? 'success' : 'primary'}
        />
      </div>

      {isComplete && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="flex items-center gap-2 mt-3 text-success-600"
        >
          <Check className="w-4 h-4" />
          <span className="text-sm font-medium">Concluída!</span>
        </motion.div>
      )}
    </motion.div>
  );
}
