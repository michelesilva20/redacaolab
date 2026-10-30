import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { reconstructElapsedMs } from '../lib/essayTimer';
import { useEssayTimer } from './useEssayTimer';

describe('useEssayTimer', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('inicia, pausa e retoma sem perder o tempo acumulado', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-10-21T12:00:00.000Z'));
    const { result } = renderHook(() => useEssayTimer());

    act(() => result.current.start());
    act(() => {
      vi.setSystemTime(new Date('2026-10-21T12:00:05.000Z'));
      result.current.pause();
    });
    expect(result.current.elapsedMs).toBe(5000);
    expect(result.current.running).toBe(false);

    act(() => {
      vi.setSystemTime(new Date('2026-10-21T12:01:00.000Z'));
    });
    expect(result.current.elapsedMs).toBe(5000);

    act(() => result.current.start());
    act(() => {
      vi.setSystemTime(new Date('2026-10-21T12:01:03.000Z'));
      result.current.pause();
    });
    expect(result.current.elapsedMs).toBe(8000);
  });

  it('reinicia o tempo e não cria intervalos duplicados', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-10-21T12:00:00.000Z'));
    const setIntervalSpy = vi.spyOn(window, 'setInterval');
    const { result } = renderHook(() => useEssayTimer());

    act(() => result.current.start());
    act(() => result.current.start());
    expect(setIntervalSpy.mock.calls.length).toBe(1);

    act(() => {
      vi.setSystemTime(new Date('2026-10-21T12:00:04.000Z'));
      vi.advanceTimersByTime(250);
    });
    act(() => result.current.reset());
    expect(result.current.elapsedMs).toBe(0);
    expect(result.current.running).toBe(false);
  });

  it('limpa o intervalo ao desmontar', () => {
    vi.useFakeTimers();
    const clearSpy = vi.spyOn(window, 'clearInterval');
    const { result, unmount } = renderHook(() => useEssayTimer());

    act(() => result.current.start());
    unmount();
    expect(clearSpy).toHaveBeenCalled();
  });

  it('reconstrói o tempo após recarregar durante uma contagem', () => {
    const startedAt = '2026-10-21T12:00:00.000Z';
    const now = Date.parse('2026-10-21T12:00:12.000Z');
    expect(
      reconstructElapsedMs(
        { elapsedMs: 4000, running: true, startedAt },
        now
      )
    ).toBe(16000);
  });

  it('hidrata um rascunho pausado sem duplicar o tempo', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-10-21T12:00:20.000Z'));
    const { result } = renderHook(() =>
      useEssayTimer({
        initial: { elapsedMs: 9000, running: false, startedAt: null },
      })
    );

    expect(result.current.elapsedMs).toBe(9000);
    expect(result.current.running).toBe(false);

    act(() => {
      vi.setSystemTime(new Date('2026-10-21T12:01:20.000Z'));
      vi.advanceTimersByTime(250);
    });
    expect(result.current.elapsedMs).toBe(9000);
  });
});
