import { describe, expect, it } from 'vitest';
import { mockEssays } from '../mocks/essays';
import type { Competency } from '../types';
import { EssayDomainError, EssayStorageError } from './essayErrors';
import { ESSAY_STORE_KEY, readEssayStore } from './essayPersistence';
import {
  finalizeCorrection,
  getMergedEssayById,
  listMergedEssays,
  listMergedEssaysByUser,
  listMergedEssaysForCorrection,
  resetEssayRepositoryForTests,
  saveCorrectionDraft,
  saveTextDraft,
  submitTextEssay,
} from './essayRepository';

const aluno1 = 'user-aluno-1';
const aluno2 = 'user-aluno-2';
const professor = 'user-prof-1';
const admin = 'user-admin-1';

function words(count: number): string {
  return Array.from({ length: count }, (_, index) => `palavra${index + 1}`).join(' ');
}

function competencies(scores: [number, number, number, number, number], feedback = 'ok'): Competency[] {
  return (['C1', 'C2', 'C3', 'C4', 'C5'] as const).map((id, index) => ({
    id,
    name: id,
    score: scores[index],
    maxScore: 200,
    feedback: `${feedback} ${id}`,
  }));
}

function submitOwnedEssay() {
  return submitTextEssay({
    actorId: aluno1,
    themeId: 'theme-1',
    category: 'enem',
    content: `<p>${words(110)}</p>`,
    wordCount: 110,
    timer: { elapsedMs: 42000, running: false, startedAt: null },
  });
}

describe('essayRepository — persistência de correção', () => {
  it('inicia correção de uma redação enviada e recupera o rascunho após reset', () => {
    const essay = submitOwnedEssay();
    const originalContent = essay.content;

    const saved = saveCorrectionDraft({
      actorId: professor,
      essayId: essay.id,
      competencies: competencies([0, 40, 80, 120, 160]),
      generalFeedback: 'primeiro olhar',
      strengths: ['introdução', ''],
      improvements: ['conclusão'],
    });

    expect(saved.id).toBe(essay.id);
    expect(saved.status).toBe('em_correcao');
    expect(saved.content).toBe(originalContent);
    expect(saved.correction?.id).toMatch(/^corr-/);
    expect(saved.correction?.status).toBe('rascunho');
    expect(saved.correction?.professorId).toBe(professor);
    expect(saved.correction?.competencies[0].score).toBe(0);
    expect(saved.correction?.totalScore).toBe(400);
    expect(saved.timerElapsedMs).toBe(42000);

    const correctionId = saved.correction?.id;
    const persisted = localStorage.getItem(ESSAY_STORE_KEY);
    resetEssayRepositoryForTests();
    localStorage.setItem(ESSAY_STORE_KEY, persisted || '');

    const recovered = getMergedEssayById(essay.id);
    expect(recovered?.status).toBe('em_correcao');
    expect(recovered?.correction?.id).toBe(correctionId);
    expect(recovered?.correction?.generalFeedback).toBe('primeiro olhar');
    expect(recovered?.correction?.strengths).toEqual(['introdução', '']);
    expect(recovered?.correction?.improvements).toEqual(['conclusão']);
    expect(recovered?.correction?.competencies.map((item) => item.score)).toEqual([0, 40, 80, 120, 160]);
    expect(recovered?.content).toBe(originalContent);
    expect(recovered?.timerElapsedMs).toBe(42000);
  });

  it('salva novamente mantendo o ID da correção e sem duplicar a redação', () => {
    const essay = submitOwnedEssay();
    const first = saveCorrectionDraft({
      actorId: professor,
      essayId: essay.id,
      competencies: competencies([160, 160, 160, 160, 160]),
      generalFeedback: 'v1',
    });
    const second = saveCorrectionDraft({
      actorId: professor,
      essayId: essay.id,
      competencies: competencies([180, 160, 140, 160, 200], 'rev'),
      generalFeedback: 'v2',
      strengths: ['repertório'],
    });

    const mine = listMergedEssays().filter((item) => item.id === essay.id);
    expect(second.correction?.id).toBe(first.correction?.id);
    expect(mine).toHaveLength(1);
    expect(second.correction?.generalFeedback).toBe('v2');
    expect(second.correction?.createdAt).toBe(first.correction?.createdAt);
    expect(JSON.stringify(readEssayStore().essays)).not.toContain('data:image');
  });

  it('finaliza uma correção parcial e remove da fila pendente', () => {
    const essay = submitOwnedEssay();
    saveCorrectionDraft({
      actorId: professor,
      essayId: essay.id,
      competencies: competencies([160, 160, 160, 160, 160]),
    });

    const finished = finalizeCorrection({
      actorId: professor,
      essayId: essay.id,
      competencies: competencies([160, 180, 140, 160, 180]),
      generalFeedback: 'pronta',
      strengths: ['proposta'],
      improvements: ['coesão'],
    });

    expect(finished.status).toBe('corrigida');
    expect(finished.correction?.status).toBe('finalizada');
    expect(finished.correction?.totalScore).toBe(820);
    expect(finished.correction?.finishedAt).toBeTruthy();
    expect(listMergedEssaysForCorrection().some((item) => item.id === essay.id)).toBe(false);
    expect(listMergedEssaysByUser(aluno1).find((item) => item.id === essay.id)?.correction?.totalScore).toBe(820);
  });

  it('finaliza diretamente uma redação enviada sem rascunho prévio', () => {
    const essay = submitOwnedEssay();
    const finished = finalizeCorrection({
      actorId: professor,
      essayId: essay.id,
      competencies: competencies([200, 200, 200, 200, 200]),
      generalFeedback: 'nota máxima da demo',
    });

    expect(finished.status).toBe('corrigida');
    expect(finished.correction?.status).toBe('finalizada');
    expect(finished.correction?.totalScore).toBe(1000);
    expect(finished.correction?.finishedAt).toBeTruthy();
  });

  it('rejeita notas inválidas e preserva zero como valor válido', () => {
    const essay = submitOwnedEssay();

    expect(() =>
      saveCorrectionDraft({
        actorId: professor,
        essayId: essay.id,
        competencies: competencies([160, 160, 160, 160, 201]),
      })
    ).toThrow(/C5/);

    const saved = saveCorrectionDraft({
      actorId: professor,
      essayId: essay.id,
      competencies: competencies([0, 0, 0, 0, 0]),
    });
    expect(saved.correction?.totalScore).toBe(0);
    expect(saved.correction?.competencies.every((item) => item.score === 0)).toBe(true);
  });

  it('bloqueia aluno, admin, rascunho não enviado, ID inexistente e correção já finalizada', () => {
    const draft = saveTextDraft({
      actorId: aluno1,
      themeId: 'theme-2',
      category: 'enem',
      content: '<p>ainda rascunho</p>',
    });
    const essay = submitOwnedEssay();

    expect(() =>
      saveCorrectionDraft({
        actorId: aluno1,
        essayId: essay.id,
        competencies: competencies([160, 160, 160, 160, 160]),
      })
    ).toThrow(EssayDomainError);

    expect(() =>
      finalizeCorrection({
        actorId: admin,
        essayId: essay.id,
        competencies: competencies([160, 160, 160, 160, 160]),
      })
    ).toThrow(/professor/);

    expect(() =>
      saveCorrectionDraft({
        actorId: professor,
        essayId: draft.id,
        competencies: competencies([160, 160, 160, 160, 160]),
      })
    ).toThrow(/rascunho/);

    expect(() =>
      saveCorrectionDraft({
        actorId: professor,
        essayId: 'essay-nao-existe',
        competencies: competencies([160, 160, 160, 160, 160]),
      })
    ).toThrow(/não encontrada/);

    finalizeCorrection({
      actorId: professor,
      essayId: essay.id,
      competencies: competencies([160, 160, 160, 160, 160]),
    });

    expect(() =>
      saveCorrectionDraft({
        actorId: professor,
        essayId: essay.id,
        competencies: competencies([180, 180, 180, 180, 180]),
      })
    ).toThrow(/já foi finalizada/);
  });

  it('não expõe feedback finalizado de outro aluno e não trata rascunho como concluído', () => {
    const essay = submitOwnedEssay();
    saveCorrectionDraft({
      actorId: professor,
      essayId: essay.id,
      competencies: competencies([120, 120, 120, 120, 120]),
    });

    const partial = getMergedEssayById(essay.id);
    expect(partial?.status).toBe('em_correcao');
    expect(partial?.correction?.status).toBe('rascunho');
    expect(listMergedEssaysByUser(aluno2).some((item) => item.id === essay.id)).toBe(false);

    const finished = finalizeCorrection({
      actorId: professor,
      essayId: essay.id,
      competencies: competencies([120, 120, 120, 120, 120]),
      generalFeedback: 'somente do dono',
    });
    expect(finished.userId).toBe(aluno1);
    expect(listMergedEssaysByUser(aluno2).some((item) => item.id === essay.id)).toBe(false);
  });

  it('preserva mocks, rascunhos anteriores e não muta o objeto original', () => {
    const mockSnapshot = structuredClone(mockEssays.find((item) => item.id === 'essay-2'));
    const localDraft = saveTextDraft({
      actorId: aluno1,
      themeId: 'theme-2',
      category: 'unesp',
      content: '<p>rascunho da fase 1.5</p>',
    });

    saveCorrectionDraft({
      actorId: professor,
      essayId: 'essay-2',
      competencies: competencies([100, 100, 100, 100, 100]),
      generalFeedback: 'overlay no mock',
    });

    expect(mockEssays.find((item) => item.id === 'essay-2')).toEqual(mockSnapshot);
    expect(getMergedEssayById('essay-1')?.status).toBe('corrigida');
    expect(getMergedEssayById('essay-1')?.correction?.id).toBe('corr-1');
    expect(getMergedEssayById(localDraft.id)?.content).toContain('rascunho da fase 1.5');
    expect(getMergedEssayById('essay-2')?.content).toBe(mockSnapshot?.content);
    expect(getMergedEssayById('essay-2')?.status).toBe('em_correcao');
  });

  it('ignora correção local inválida sem apagar a redação', () => {
    const essay = submitOwnedEssay();
    saveCorrectionDraft({
      actorId: professor,
      essayId: essay.id,
      competencies: competencies([80, 80, 80, 80, 80]),
    });

    const raw = JSON.parse(localStorage.getItem(ESSAY_STORE_KEY) || '{}');
    raw.essays[0].correction = { id: 'quebrada' };
    localStorage.setItem(ESSAY_STORE_KEY, JSON.stringify(raw));

    const recovered = getMergedEssayById(essay.id);
    expect(recovered?.id).toBe(essay.id);
    expect(recovered?.content).toContain('palavra1');
    expect(recovered?.correction).toBeUndefined();
  });

  it('falha o salvamento da correção quando o armazenamento recusa a escrita', () => {
    const essay = submitOwnedEssay();
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key: string, value: string) {
      if (key === ESSAY_STORE_KEY) {
        throw new Error('quota');
      }
      return original.call(this, key, value);
    };

    try {
      expect(() =>
        saveCorrectionDraft({
          actorId: professor,
          essayId: essay.id,
          competencies: competencies([160, 160, 160, 160, 160]),
        })
      ).toThrow(EssayStorageError);
      expect(getMergedEssayById(essay.id)?.status).toBe('enviada');
      expect(getMergedEssayById(essay.id)?.correction).toBeUndefined();
    } finally {
      Storage.prototype.setItem = original;
    }
  });
});
