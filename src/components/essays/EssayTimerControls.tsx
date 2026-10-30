import { Clock, Pause, Play, RotateCcw } from 'lucide-react';
import { formatEssayTimer } from '../../lib/essayTimer';

type EssayTimerControlsProps = {
  elapsedMs: number;
  running: boolean;
  onStart: () => void;
  onPause: () => void;
  onResetRequest: () => void;
};

export function EssayTimerControls({
  elapsedMs,
  running,
  onStart,
  onPause,
  onResetRequest,
}: EssayTimerControlsProps) {
  return (
    <div className="flex items-center gap-2">
      <p
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm tabular-nums ${
          running ? 'bg-accent-100 text-accent-700' : 'bg-neutral-100 text-neutral-600'
        }`}
        aria-live="polite"
        aria-label={running ? `Cronômetro em andamento, ${formatEssayTimer(elapsedMs)}` : `Cronômetro pausado, ${formatEssayTimer(elapsedMs)}`}
      >
        <Clock className="w-4 h-4" aria-hidden="true" />
        <span>{formatEssayTimer(elapsedMs)}</span>
        <span className="sr-only">{running ? 'em andamento' : 'pausado'}</span>
      </p>
      <button
        type="button"
        onClick={running ? onPause : onStart}
        aria-label={running ? 'Pausar cronômetro' : elapsedMs > 0 ? 'Retomar cronômetro' : 'Iniciar cronômetro'}
        className="inline-flex items-center justify-center min-h-10 min-w-10 px-2.5 rounded-lg text-sm font-medium bg-neutral-100 text-neutral-700 hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        {running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
      </button>
      <button
        type="button"
        onClick={onResetRequest}
        disabled={elapsedMs === 0 && !running}
        aria-label="Reiniciar cronômetro"
        className="inline-flex items-center justify-center min-h-10 min-w-10 px-2.5 rounded-lg text-sm font-medium bg-neutral-100 text-neutral-700 hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <RotateCcw className="w-4 h-4" />
      </button>
    </div>
  );
}
