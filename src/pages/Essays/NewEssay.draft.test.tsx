import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useAuthStore } from '../../stores/authStore';
import { fakeApi } from '../../services/fakeApi';
import { NewEssay } from './NewEssay';
import type { Essay } from '../../types';

function renderEditor(path: string) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/app/redacoes/nova" element={<NewEssay />} />
          <Route path="/app/redacoes/:id/editar" element={<NewEssay />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

const draft: Essay = {
  id: 'essay-draft-ui',
  userId: 'user-aluno-1',
  themeId: 'theme-2',
  type: 'texto',
  content: '<p>Texto retomado do rascunho</p>',
  category: 'unesp',
  status: 'rascunho',
  notes: 'continuar amanhã',
  wordCount: 5,
  createdAt: '2026-10-21T10:00:00.000Z',
  updatedAt: '2026-10-21T11:00:00.000Z',
};

describe('NewEssay — retomada de rascunho', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('trata ID inexistente', async () => {
    useAuthStore.getState().enterDemo('aluno');
    vi.spyOn(fakeApi.essays, 'getById').mockResolvedValue(undefined);

    renderEditor('/app/redacoes/inexistente/editar');

    expect(await screen.findByText('Redação não encontrada')).toBeInTheDocument();
  });

  it('impede edição após envio', async () => {
    useAuthStore.getState().enterDemo('aluno');
    vi.spyOn(fakeApi.essays, 'getById').mockResolvedValue({
      ...draft,
      status: 'enviada',
    });

    renderEditor('/app/redacoes/essay-draft-ui/editar');

    expect(await screen.findByText('Esta redação não pode ser editada')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Salvar rascunho' })).not.toBeInTheDocument();
  });

  it('nega edição por outro aluno', async () => {
    useAuthStore.getState().enterDemo('aluno');
    vi.spyOn(fakeApi.essays, 'getById').mockResolvedValue({
      ...draft,
      userId: 'user-aluno-2',
    });

    renderEditor('/app/redacoes/essay-draft-ui/editar');

    expect(await screen.findByText('Redação de outro perfil')).toBeInTheDocument();
  });

  it('preenche editor, tema, modalidade e observações do rascunho persistido', async () => {
    useAuthStore.getState().enterDemo('aluno');
    vi.spyOn(fakeApi.essays, 'getById').mockResolvedValue(draft);
    vi.spyOn(fakeApi.themes, 'getAll').mockResolvedValue([
      {
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
    ]);

    renderEditor('/app/redacoes/essay-draft-ui/editar');

    expect(await screen.findByText('Continuar redação')).toBeInTheDocument();
    expect(await screen.findByText('Texto retomado do rascunho')).toBeInTheDocument();
    expect(screen.getByDisplayValue('continuar amanhã')).toBeInTheDocument();
    expect(screen.getByDisplayValue('UNESP')).toBeInTheDocument();
    expect(
      screen.getByDisplayValue('Os desafios para a valorização de comunidades tradicionais no Brasil')
    ).toBeInTheDocument();
  });
});
