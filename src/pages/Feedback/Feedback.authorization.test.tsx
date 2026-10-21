import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { mockEssays } from '../../mocks/essays';
import { useAuthStore } from '../../stores/authStore';
import { Feedback } from './index';

function renderFeedback(essayId: string) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[`/app/feedback/${essayId}`]}>
        <Routes>
          <Route path="/app/feedback/:id" element={<Feedback />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe('Feedback por recurso', () => {
  it('mostra o feedback da própria redação', async () => {
    useAuthStore.getState().enterDemo('aluno');
    expect(mockEssays[0].userId).toBe('user-aluno-1');
    renderFeedback('essay-1');
    expect(await screen.findByRole('heading', { name: 'Nota por competência' })).toBeInTheDocument();
    expect(screen.queryByText('Feedback de outro aluno')).not.toBeInTheDocument();
  });

  it('bloqueia feedback de outro aluno pelo ID da URL', async () => {
    useAuthStore.getState().enterDemo('aluno');
    const foreign = mockEssays.find((essay) => essay.userId === 'user-aluno-2');
    expect(foreign).toBeDefined();
    renderFeedback(foreign!.id);
    expect(await screen.findByText('Feedback de outro aluno')).toBeInTheDocument();
  });
});
