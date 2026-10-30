import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useAuthStore } from '../../stores/authStore';
import { fakeApi } from '../../services/fakeApi';
import type { Essay } from '../../types';
import { Feedback } from './index';

const essay: Essay = {
  id: 'essay-feedback-ui',
  userId: 'user-aluno-1',
  themeId: 'theme-1',
  type: 'texto',
  content: '<p>Redação corrigida persistida</p>',
  category: 'enem',
  status: 'corrigida',
  wordCount: 110,
  createdAt: '2026-10-30T10:00:00.000Z',
  submittedAt: '2026-10-30T11:00:00.000Z',
  correction: {
    id: 'corr-feedback-1',
    essayId: 'essay-feedback-ui',
    professorId: 'user-prof-1',
    competencies: (['C1', 'C2', 'C3', 'C4', 'C5'] as const).map((id) => ({
      id,
      name: id,
      score: 160,
      maxScore: 200,
      feedback: `nota ${id}`,
    })),
    totalScore: 800,
    generalFeedback: 'parecer persistido do professor',
    strengths: ['clareza'],
    improvements: ['repertório'],
    comments: [],
    highlights: [],
    status: 'finalizada',
    createdAt: '2026-10-30T12:00:00.000Z',
    finishedAt: '2026-10-30T13:00:00.000Z',
  },
};

function renderFeedback() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/app/feedback/essay-feedback-ui']}>
        <Routes>
          <Route path="/app/feedback/:id" element={<Feedback />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe('Feedback — correção persistida', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('mostra nota e parecer persistidos para o aluno dono', async () => {
    useAuthStore.getState().enterDemo('aluno');
    vi.spyOn(fakeApi.essays, 'getById').mockResolvedValue(essay);

    renderFeedback();

    expect(await screen.findByText('800')).toBeInTheDocument();
    expect(screen.getByText('parecer persistido do professor')).toBeInTheDocument();
    expect(screen.getByText('clareza')).toBeInTheDocument();
    expect(screen.getByText('repertório')).toBeInTheDocument();
  });

  it('não trata correção parcial como feedback finalizado', async () => {
    useAuthStore.getState().enterDemo('aluno');
    vi.spyOn(fakeApi.essays, 'getById').mockResolvedValue({
      ...essay,
      status: 'em_correcao',
      correction: { ...essay.correction!, status: 'rascunho', finishedAt: undefined },
    });

    renderFeedback();

    expect(await screen.findByText('A correção ainda não foi finalizada')).toBeInTheDocument();
    expect(screen.queryByText('parecer persistido do professor')).not.toBeInTheDocument();
  });

  it('bloqueia feedback de outro aluno', async () => {
    useAuthStore.getState().enterDemo('aluno');
    vi.spyOn(fakeApi.essays, 'getById').mockResolvedValue({
      ...essay,
      userId: 'user-aluno-2',
    });

    renderFeedback();

    expect(await screen.findByText('Feedback de outro aluno')).toBeInTheDocument();
  });
});
