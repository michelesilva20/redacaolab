import { describe, expect, it } from 'vitest';
import { mockEssays } from '../mocks/essays';
import { EssayDomainError, EssayStorageError } from './essayErrors';
import { ESSAY_STORE_KEY, readEssayStore } from './essayPersistence';
import {
  getMergedEssayById,
  listMergedEssays,
  listMergedEssaysByUser,
  listMergedEssaysForCorrection,
  persistEssayTimer,
  resetEssayRepositoryForTests,
  saveTextDraft,
  submitTextEssay,
} from './essayRepository';

const aluno1 = 'user-aluno-1';
const aluno2 = 'user-aluno-2';

function words(count: number): string {
  return Array.from({ length: count }, (_, index) => `palavra${index + 1}`).join(' ');
}

describe('essayRepository — rascunho e envio', () => {
  it('cria uma nova redação em rascunho vinculada ao aluno', () => {
    const draft = saveTextDraft({
      actorId: aluno1,
      themeId: 'theme-2',
      category: 'unesp',
      content: '<p>Início do texto</p>',
      notes: 'preciso revisar a introdução',
      wordCount: 3,
    });

    expect(draft.id).toMatch(/^essay-/);
    expect(draft.userId).toBe(aluno1);
    expect(draft.status).toBe('rascunho');
    expect(draft.themeId).toBe('theme-2');
    expect(draft.category).toBe('unesp');
    expect(draft.notes).toBe('preciso revisar a introdução');
    expect(draft.theme?.title).toContain('comunidades tradicionais');
    expect(draft.createdAt).toBeTruthy();
    expect(draft.updatedAt).toBeTruthy();
  });

  it('salva novamente o mesmo registro sem duplicar', () => {
    const first = saveTextDraft({
      actorId: aluno1,
      themeId: 'theme-1',
      category: 'enem',
      content: '<p>Versão um</p>',
    });
    const second = saveTextDraft({
      actorId: aluno1,
      id: first.id,
      themeId: 'theme-1',
      category: 'enem',
      content: '<p>Versão dois com mais texto</p>',
      notes: 'atualizado',
      wordCount: 6,
    });

    const mine = listMergedEssaysByUser(aluno1).filter((essay) => essay.id === first.id);
    expect(second.id).toBe(first.id);
    expect(mine).toHaveLength(1);
    expect(second.content).toContain('Versão dois');
    expect(second.notes).toBe('atualizado');
    expect(second.createdAt).toBe(first.createdAt);
    expect(second.updatedAt).not.toBe(first.updatedAt);
  });

  it('recupera o rascunho após nova inicialização da camada de dados', () => {
    const saved = saveTextDraft({
      actorId: aluno1,
      themeId: 'theme-2',
      category: 'enem',
      content: '<p>Persistido no navegador</p>',
      notes: 'retomar depois',
    });

    const persisted = localStorage.getItem(ESSAY_STORE_KEY);
    resetEssayRepositoryForTests();
    localStorage.setItem(ESSAY_STORE_KEY, persisted || '');

    const recovered = getMergedEssayById(saved.id);
    expect(recovered?.content).toContain('Persistido no navegador');
    expect(recovered?.notes).toBe('retomar depois');
    expect(recovered?.themeId).toBe('theme-2');
    expect(recovered?.category).toBe('enem');
  });

  it('retoma rascunho pelo ID e preserva tema, modalidade e observações', () => {
    const saved = saveTextDraft({
      actorId: aluno1,
      themeId: 'theme-3',
      category: 'concursos',
      content: '<p>Corpo</p>',
      notes: 'focar na proposta',
    });

    const found = getMergedEssayById(saved.id);
    expect(found?.themeId).toBe('theme-3');
    expect(found?.category).toBe('concursos');
    expect(found?.notes).toBe('focar na proposta');
    expect(found?.status).toBe('rascunho');
  });

  it('envia o rascunho mantendo o mesmo ID e impede nova edição', () => {
    const draft = saveTextDraft({
      actorId: aluno1,
      themeId: 'theme-1',
      category: 'enem',
      content: `<p>${words(110)}</p>`,
      wordCount: 110,
    });

    const submitted = submitTextEssay({
      actorId: aluno1,
      id: draft.id,
      themeId: 'theme-1',
      category: 'enem',
      content: `<p>${words(110)}</p>`,
      wordCount: 110,
    });

    expect(submitted.id).toBe(draft.id);
    expect(submitted.status).toBe('enviada');
    expect(submitted.submittedAt).toBeTruthy();
    expect(listMergedEssaysByUser(aluno1).filter((essay) => essay.id === draft.id)).toHaveLength(1);
    expect(() =>
      saveTextDraft({
        actorId: aluno1,
        id: draft.id,
        themeId: 'theme-1',
        category: 'enem',
        content: '<p>tentativa de voltar</p>',
      })
    ).toThrow(EssayDomainError);
  });

  it('envia uma nova redação diretamente sem exigir rascunho prévio', () => {
    const submitted = submitTextEssay({
      actorId: aluno1,
      themeId: 'theme-1',
      category: 'enem',
      content: `<p>${words(120)}</p>`,
      wordCount: 120,
    });

    expect(submitted.status).toBe('enviada');
    expect(getMergedEssayById(submitted.id)?.status).toBe('enviada');
    expect(listMergedEssaysForCorrection().some((essay) => essay.id === submitted.id)).toBe(true);
  });

  it('nega edição por outro aluno', () => {
    const draft = saveTextDraft({
      actorId: aluno1,
      themeId: 'theme-1',
      category: 'enem',
      content: '<p>privado</p>',
    });

    expect(() =>
      saveTextDraft({
        actorId: aluno2,
        id: draft.id,
        themeId: 'theme-1',
        category: 'enem',
        content: '<p>invasão</p>',
      })
    ).toThrowError(/outro perfil/);
    expect(listMergedEssaysByUser(aluno2).some((essay) => essay.id === draft.id)).toBe(false);
  });

  it('trata ID inexistente', () => {
    expect(getMergedEssayById('essay-nao-existe')).toBeUndefined();
    expect(() =>
      saveTextDraft({
        actorId: aluno1,
        id: 'essay-nao-existe',
        themeId: 'theme-1',
        category: 'enem',
        content: '<p>x</p>',
      })
    ).toThrowError(/não encontrada/);
  });

  it('preserva os mocks originais e não duplica na listagem', () => {
    const before = listMergedEssaysByUser(aluno1).map((essay) => essay.id);
    expect(before).toEqual(expect.arrayContaining(['essay-1', 'essay-2', 'essay-5']));

    saveTextDraft({
      actorId: aluno1,
      id: 'essay-5',
      themeId: 'theme-2',
      category: 'enem',
      content: '<p>rascunho mock atualizado</p>',
    });

    const after = listMergedEssaysByUser(aluno1);
    const ids = after.map((essay) => essay.id);
    expect(ids.filter((id) => id === 'essay-5')).toHaveLength(1);
    expect(after.find((essay) => essay.id === 'essay-1')?.status).toBe('corrigida');
    expect(mockEssays.find((essay) => essay.id === 'essay-5')?.content).toBe('');
  });

  it('sanitiza HTML persistido e não aceita imageUrl no overlay textual', () => {
    const saved = saveTextDraft({
      actorId: aluno1,
      themeId: 'theme-1',
      category: 'enem',
      content: '<p>Seguro</p><script>window.__persistXss=1</script><img src=x onerror="alert(1)">',
    });

    expect(saved.content).toContain('Seguro');
    expect(saved.content).not.toContain('script');
    expect(saved.content).not.toContain('img');
    expect(JSON.stringify(readEssayStore().essays)).not.toContain('imageUrl');
  });

  it('falha o salvamento quando o armazenamento local recusa a escrita', () => {
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key: string, value: string) {
      if (key === ESSAY_STORE_KEY) {
        throw new Error('quota');
      }
      return original.call(this, key, value);
    };

    try {
      expect(() =>
        saveTextDraft({
          actorId: aluno1,
          themeId: 'theme-1',
          category: 'enem',
          content: '<p>não deve persistir</p>',
        })
      ).toThrow(EssayStorageError);
      expect(listMergedEssays().some((essay) => essay.content?.includes('não deve persistir'))).toBe(false);
    } finally {
      Storage.prototype.setItem = original;
    }
  });

  it('exige identidade e tema; não confia em userId solto para atualizar outro aluno', () => {
    expect(() =>
      saveTextDraft({
        actorId: '',
        themeId: 'theme-1',
        category: 'enem',
        content: '<p>x</p>',
      })
    ).toThrow(EssayDomainError);

    const draft = saveTextDraft({
      actorId: aluno2,
      themeId: 'theme-3',
      category: 'enem',
      content: '<p>do aluno 2</p>',
    });

    expect(() =>
      submitTextEssay({
        actorId: aluno1,
        id: draft.id,
        themeId: 'theme-3',
        category: 'enem',
        content: `<p>${words(110)}</p>`,
        wordCount: 110,
      })
    ).toThrowError(/outro perfil/);
  });

  it('persiste o cronômetro no rascunho e mantém o tempo após o envio', () => {
    const draft = saveTextDraft({
      actorId: aluno1,
      themeId: 'theme-1',
      category: 'enem',
      content: `<p>${words(110)}</p>`,
      wordCount: 110,
      timer: { elapsedMs: 15000, running: true, startedAt: '2026-10-21T12:00:00.000Z' },
    });

    const paused = persistEssayTimer(aluno1, draft.id, {
      elapsedMs: 18000,
      running: false,
      startedAt: null,
    });
    expect(paused.timerElapsedMs).toBe(18000);
    expect(paused.timerRunning).toBe(false);

    const persisted = localStorage.getItem(ESSAY_STORE_KEY);
    resetEssayRepositoryForTests();
    localStorage.setItem(ESSAY_STORE_KEY, persisted || '');

    const recovered = getMergedEssayById(draft.id);
    expect(recovered?.timerElapsedMs).toBe(18000);
    expect(recovered?.content).toContain('palavra1');

    const submitted = submitTextEssay({
      actorId: aluno1,
      id: draft.id,
      themeId: 'theme-1',
      category: 'enem',
      content: `<p>${words(110)}</p>`,
      wordCount: 110,
      timer: { elapsedMs: 18000, running: false, startedAt: null },
    });
    expect(submitted.id).toBe(draft.id);
    expect(submitted.timerElapsedMs).toBe(18000);
    expect(JSON.stringify(readEssayStore().essays)).not.toContain('data:image');
  });
});
