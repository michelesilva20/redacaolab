import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { mockEssays } from '../mocks/essays';
import { fakeApi } from '../services/fakeApi';
import { useAuthStore } from '../stores/authStore';
import { EssayDetail } from '../pages/Essays/EssayDetail';
import { SafeEssayContent } from './SafeEssayContent';

describe('SafeEssayContent', () => {
  it('renderiza formatação legítima e não monta vetores XSS', () => {
    const { container } = render(
      <SafeEssayContent
        className="prose"
        html={'<p>Olá <strong>mundo</strong></p><script>window.__xss=true</script><img src=x onerror="alert(1)">'}
      />
    );

    expect(screen.getByText('mundo')).toBeInTheDocument();
    expect(container.querySelector('strong')).not.toBeNull();
    expect(container.querySelector('script')).toBeNull();
    expect(container.querySelector('img')).toBeNull();
    expect(container.querySelector('[onerror]')).toBeNull();
  });

  it('aceita HTML vazio sem quebrar o layout', () => {
    const { container } = render(<SafeEssayContent html="" className="prose" />);
    expect(container.querySelector('.prose')).not.toBeNull();
    expect(container.querySelector('.prose')?.innerHTML).toBe('');
  });
});

describe('EssayDetail usa conteúdo sanitizado', () => {
  it('não injeta script vindo da redação no DOM', async () => {
    const poisoned = {
      ...mockEssays[0],
      id: 'essay-xss',
      type: 'texto' as const,
      content: '<p>Redação limpa</p><script>window.__essayXss=1</script><iframe src="https://evil.test"></iframe>',
    };

    useAuthStore.getState().enterDemo('aluno');
    vi.spyOn(fakeApi.essays, 'getById').mockResolvedValue(poisoned);

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/app/redacoes/essay-xss']}>
          <Routes>
            <Route path="/app/redacoes/:id" element={<EssayDetail />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(await screen.findByText('Redação limpa')).toBeInTheDocument();
    expect(document.querySelector('script')).toBeNull();
    expect(document.querySelector('iframe')).toBeNull();

    vi.restoreAllMocks();
  });
});
