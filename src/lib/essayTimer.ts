export type EssayTimerSnapshot = {
  elapsedMs: number;
  running: boolean;
  startedAt: string | null;
};

export function createIdleTimerSnapshot(): EssayTimerSnapshot {
  return { elapsedMs: 0, running: false, startedAt: null };
}

export function reconstructElapsedMs(snapshot: EssayTimerSnapshot, nowMs = Date.now()): number {
  const base = Number.isFinite(snapshot.elapsedMs) ? Math.max(0, Math.floor(snapshot.elapsedMs)) : 0;
  if (!snapshot.running || !snapshot.startedAt) {
    return base;
  }

  const startedAt = Date.parse(snapshot.startedAt);
  if (Number.isNaN(startedAt) || nowMs <= startedAt) {
    return base;
  }

  return base + (nowMs - startedAt);
}

export function normalizeTimerSnapshot(value: unknown): EssayTimerSnapshot | undefined {
  if (!value || typeof value !== 'object') return undefined;

  const record = value as Record<string, unknown>;
  const elapsed = record.timerElapsedMs ?? record.elapsedMs;
  if (elapsed !== undefined && (typeof elapsed !== 'number' || !Number.isFinite(elapsed) || elapsed < 0)) {
    return undefined;
  }

  const running = record.timerRunning ?? record.running;
  if (running !== undefined && typeof running !== 'boolean') {
    return undefined;
  }

  const startedAt = record.timerStartedAt ?? record.startedAt;
  if (startedAt != null && (typeof startedAt !== 'string' || Number.isNaN(Date.parse(startedAt)))) {
    return undefined;
  }

  if (elapsed === undefined && running === undefined && startedAt === undefined) {
    return undefined;
  }

  return {
    elapsedMs: typeof elapsed === 'number' ? Math.floor(elapsed) : 0,
    running: running === true,
    startedAt: typeof startedAt === 'string' ? startedAt : null,
  };
}

export function formatEssayTimer(elapsedMs: number): string {
  const totalSeconds = Math.max(0, Math.floor(elapsedMs / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const mm = minutes.toString().padStart(2, '0');
  const ss = seconds.toString().padStart(2, '0');
  if (hours > 0) {
    return `${hours}:${mm}:${ss}`;
  }
  return `${mm}:${ss}`;
}

export function snapshotFromEssay(essay: {
  timerElapsedMs?: number;
  timerRunning?: boolean;
  timerStartedAt?: string;
}): EssayTimerSnapshot {
  return (
    normalizeTimerSnapshot({
      timerElapsedMs: essay.timerElapsedMs,
      timerRunning: essay.timerRunning,
      timerStartedAt: essay.timerStartedAt,
    }) ?? createIdleTimerSnapshot()
  );
}
