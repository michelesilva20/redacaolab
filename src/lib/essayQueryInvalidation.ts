import type { QueryClient } from '@tanstack/react-query';

export function invalidateEssayRelatedQueries(queryClient: QueryClient, essayId?: string): void {
  void queryClient.invalidateQueries({ queryKey: ['essays'] });
  void queryClient.invalidateQueries({ queryKey: ['dashboard'] });
  if (essayId) {
    void queryClient.invalidateQueries({ queryKey: ['essay', essayId] });
  }
}
