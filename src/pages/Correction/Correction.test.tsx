import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useAuthStore } from '../../stores/authStore';
import { useUIStore } from '../../stores/uiStore';
import { fakeApi } from '../../services/fakeApi';
import type { Correction as CorrectionModel, Essay } from '../../types';
import { Correction } from './index';

const competencies = (
  scores: [number, number, number, number, number]
): CorrectionModel['competencies'] =>
  (['C1', 'C2', 'C3', 'C4', 'C5'] as const).map((id, index) => ({
    id,
    name: id,
    score: scores[index],
    maxScore: 200,
    feedback: `salvo ${id}`,
  }));

const essay: Essay = {
  id: 'essay-corr-ui',
  userId: 'user-aluno-1',
  themeId: 'theme-1',
  type: 'texto',
  content: '<p>Texto enviado para correção</p>',
  category: 'enem',
  status: 'em_correcao',
  wordCount: 110,
  createdAt: '2026-10-30T10:00:00.000Z',
  submittedAt: '2026-10-30T11:00:00.000Z',
  correction: {
    id: 'corr-ui-1',
    essayId: 'essay-corr-ui',
    professorId: 'user-prof-1',
    competencies: competencies([0, 40, 80, 120, 200]),
    totalScore: 440,
    generalFeedback: 'retomar este parecer',
    strengths: ['tese clara'],
    improvements: ['repertório'],
    comments: [],
    highlights: [],
    status: 'rascunho',
    createdAt: '2026-10-30T12:00:00.000Z',
  },
};

function renderCorrection(path = '/app/correcao/essay-corr-ui') {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/app/correcao/:id" element={<Correction />} />
          <Route path="/app/redacoes" element={<p>Fila do professor</p>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe('Correction — persistência e retomada', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('recupera notas, feedback e listas salvas', async () => {
    useAuthStore.getState().enterDemo('professor');
    vi.spyOn(fakeApi.essays, 'getById').mockResolvedValue(essay);

    renderCorrection();

    expect(await screen.findByDisplayValue('retomar este parecer')).toBeInTheDocument();
    expect(screen.getByDisplayValue('tese clara')).toBeInTheDocument();
    expect(screen.getByDisplayValue('repertório')).toBeInTheDocument();
    expect(screen.getByDisplayValue('salvo C1')).toBeInTheDocument();
    expect(screen.getAllByDisplayValue('0').length).toBeGreaterThan(0);
    expect(screen.getByText('440')).toBeInTheDocument();
  });

  it('bloqueia edição quando a correção já foi finalizada', async () => {
    useAuthStore.getState().enterDemo('professor');
    vi.spyOn(fakeApi.essays, 'getById').mockResolvedValue({
      ...essay,
      status: 'corrigida',
      correction: { ...essay.correction!, status: 'finalizada', finishedAt: '2026-10-30T13:00:00.000Z' },
    });

    renderCorrection();

    expect(await screen.findByText('Redação indisponível para correção')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Finalizar correção' })).not.toBeInTheDocument();
  });

  it('trata redação inexistente', async () => {
    useAuthStore.getState().enterDemo('professor');
    vi.spyOn(fakeApi.essays, 'getById').mockResolvedValue(undefined);

    renderCorrection('/app/correcao/inexistente');

    expect(await screen.findByText('Redação não encontrada')).toBeInTheDocument();
  });

  it('não anuncia sucesso quando a persistência falha', async () => {
    useAuthStore.getState().enterDemo('professor');
    vi.spyOn(fakeApi.essays, 'getById').mockResolvedValue({
      ...essay,
      status: 'enviada',
      correction: undefined,
    });
    vi.spyOn(fakeApi.corrections, 'submit').mockRejectedValue(new Error('quota'));

    renderCorrection();
    await screen.findByRole('button', { name: 'Salvar rascunho' });
    await userEvent.click(screen.getByRole('button', { name: 'Salvar rascunho' }));

    await vi.waitFor(() => {
      const titles = useUIStore.getState().toasts.map((toast) => toast.title);
      expect(titles).toContain('Não foi possível salvar a correção');
      expect(titles).not.toContain('Rascunho salvo');
    });
  });
});
