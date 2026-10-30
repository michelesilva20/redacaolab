import { useCallback, useEffect, useRef, useState } from 'react';
import {
  createIdleTimerSnapshot,
  reconstructElapsedMs,
  type EssayTimerSnapshot,
} from '../lib/essayTimer';

const TICK_MS = 250;

type UseEssayTimerOptions = {
  initial?: EssayTimerSnapshot | null;
  onCheckpoint?: (snapshot: EssayTimerSnapshot) => void;
};

export function useEssayTimer(options: UseEssayTimerOptions = {}) {
  const onCheckpointRef = useRef(options.onCheckpoint);
  onCheckpointRef.current = options.onCheckpoint;

  const [snapshot, setSnapshot] = useState<EssayTimerSnapshot>(
    () => options.initial ?? createIdleTimerSnapshot()
  );
  const [nowMs, setNowMs] = useState(() => Date.now());
  const intervalRef = useRef<number | null>(null);
  const hydratedKeyRef = useRef<string | null>(null);

  const elapsedMs = reconstructElapsedMs(snapshot, nowMs);

  const emit = useCallback((next: EssayTimerSnapshot) => {
    setSnapshot(next);
    onCheckpointRef.current?.(next);
  }, []);

  const start = useCallback(() => {
    if (snapshot.running) return;
    const startedAt = new Date().toISOString();
    emit({
      elapsedMs: reconstructElapsedMs(snapshot),
      running: true,
      startedAt,
    });
    setNowMs(Date.now());
  }, [emit, snapshot]);

  const pause = useCallback(() => {
    if (!snapshot.running) return;
    emit({
      elapsedMs: reconstructElapsedMs(snapshot),
      running: false,
      startedAt: null,
    });
  }, [emit, snapshot]);

  const reset = useCallback(() => {
    emit(createIdleTimerSnapshot());
    setNowMs(Date.now());
  }, [emit]);

  const hydrate = useCallback((next: EssayTimerSnapshot) => {
    const key = `${next.elapsedMs}:${next.running}:${next.startedAt ?? ''}`;
    if (hydratedKeyRef.current === key) return;
    hydratedKeyRef.current = key;
    setSnapshot({
      elapsedMs: Math.max(0, Math.floor(next.elapsedMs) || 0),
      running: next.running && Boolean(next.startedAt),
      startedAt: next.running ? next.startedAt : null,
    });
    setNowMs(Date.now());
  }, []);

  useEffect(() => {
    if (!snapshot.running) {
      if (intervalRef.current != null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    if (intervalRef.current != null) {
      return;
    }

    intervalRef.current = window.setInterval(() => {
      setNowMs(Date.now());
    }, TICK_MS);

    return () => {
      if (intervalRef.current != null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [snapshot.running]);

  useEffect(() => {
    const refresh = () => setNowMs(Date.now());
    document.addEventListener('visibilitychange', refresh);
    window.addEventListener('focus', refresh);
    return () => {
      document.removeEventListener('visibilitychange', refresh);
      window.removeEventListener('focus', refresh);
    };
  }, []);

  return {
    elapsedMs,
    running: snapshot.running,
    snapshot: {
      ...snapshot,
      elapsedMs,
    },
    start,
    pause,
    reset,
    hydrate,
  };
}
