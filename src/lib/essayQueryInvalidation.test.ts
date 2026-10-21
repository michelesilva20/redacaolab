import { QueryClient } from '@tanstack/react-query';
import { describe, expect, it, vi } from 'vitest';
import { invalidateEssayRelatedQueries } from './essayQueryInvalidation';

describe('invalidateEssayRelatedQueries', () => {
  it('invalida lista, dashboard e detalhe sem refetch global', () => {
    const queryClient = new QueryClient();
    const spy = vi.spyOn(queryClient, 'invalidateQueries');

    invalidateEssayRelatedQueries(queryClient, 'essay-local-1');

    expect(spy).toHaveBeenCalledTimes(3);
    expect(spy).toHaveBeenCalledWith({ queryKey: ['essays'] });
    expect(spy).toHaveBeenCalledWith({ queryKey: ['dashboard'] });
    expect(spy).toHaveBeenCalledWith({ queryKey: ['essay', 'essay-local-1'] });
    expect(spy).not.toHaveBeenCalledWith({ queryKey: ['themes'] });
  });
});
