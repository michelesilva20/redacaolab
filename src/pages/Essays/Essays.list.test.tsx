import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useAuthStore } from '../../stores/authStore';
import { fakeApi } from '../../services/fakeApi';
import { Essays } from './index';
import type { Essay } from '../../types';

const draft: Essay = {
  id: 'essay-list-draft',
  userId: 'user-aluno-1',
  themeId: 'theme-2',
  theme: {
    id: 'theme-2',
    title: 'Os desafios para a valorização de comunidades tradicionais no Brasil',
    description: '',
    category: 'enem',
    axis: '',
    difficulty: 'medio',
    repertoire: [],
    checklist: [],
    examples: [],
    createdAt: '2024-06-01',
    isFeatured: false,
  },
  type: 'texto',
  content: '<p>Prévia do rascunho persistido</p>',
  category: 'enem',
  status: 'rascunho',
  wordCount: 4,
  createdAt: '2026-10-21T10:00:00.000Z',
  updatedAt: '2026-10-21T12:00:00.000Z',
};

describe('lista de redações com rascunhos persistidos', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('exibe o rascunho uma vez, com tema e link para editar', async () => {
    useAuthStore.getState().enterDemo('aluno');
    vi.spyOn(fakeApi.essays, 'getByUser').mockResolvedValue([
      draft,
      {
        ...draft,
        id: 'essay-1',
        status: 'corrigida',
        theme: { ...draft.theme!, id: 'theme-1', title: 'O estigma associado às doenças mentais na sociedade brasileira' },
      },
    ]);

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <Essays />
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(
      await screen.findByText('Os desafios para a valorização de comunidades tradicionais no Brasil')
    ).toBeInTheDocument();
    expect(screen.getAllByText('Os desafios para a valorização de comunidades tradicionais no Brasil')).toHaveLength(1);
    expect(screen.getByText('Rascunho')).toBeInTheDocument();

    const editLink = screen.getByText('Os desafios para a valorização de comunidades tradicionais no Brasil').closest('a');
    expect(editLink).toHaveAttribute('href', '/app/redacoes/essay-list-draft/editar');
  });
});
