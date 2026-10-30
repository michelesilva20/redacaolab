import { describe, expect, it, vi } from 'vitest';
import { EssayStorageError } from './essayErrors';
import {
  ESSAY_QUARANTINE_KEY,
  ESSAY_STORE_KEY,
  countWordsFromHtml,
  isPersistedEssayRecord,
  quarantinePayload,
  readEssayStore,
  readQuarantine,
  writeEssayStore,
} from './essayPersistence';

const validRecord = {
  id: 'essay-local-1',
  userId: 'user-aluno-1',
  themeId: 'theme-2',
  type: 'texto' as const,
  content: '<p>Texto salvo</p>',
  category: 'enem' as const,
  status: 'rascunho' as const,
  notes: 'observação',
  wordCount: 2,
  createdAt: '2026-10-21T12:00:00.000Z',
  updatedAt: '2026-10-21T12:05:00.000Z',
};

describe('essayPersistence', () => {
  it('conta palavras pelo texto visível, não pelas tags HTML', () => {
    expect(countWordsFromHtml('<p>uma duas três</p>')).toBe(3);
    expect(countWordsFromHtml('')).toBe(0);
    expect(countWordsFromHtml('<p></p>')).toBe(0);
  });

  it('rejeita registros sem formato compatível', () => {
    expect(isPersistedEssayRecord({ ...validRecord, type: 'imagem' })).toBe(false);
    expect(isPersistedEssayRecord({ ...validRecord, status: 'pending' })).toBe(false);
    expect(isPersistedEssayRecord({ ...validRecord, wordCount: -1 })).toBe(false);
    expect(isPersistedEssayRecord({ ...validRecord, id: '' })).toBe(false);
  });

  it('isola JSON inválido sem descartar o payload original da quarentena', () => {
    localStorage.setItem(ESSAY_STORE_KEY, '{nao-json');

    const result = readEssayStore();

    expect(result.essays).toEqual([]);
    expect(result.warnings.length).toBeGreaterThan(0);
    expect(readQuarantine()[0]?.reason).toBe('json_parse');
    expect(readQuarantine()[0]?.payload).toBe('{nao-json');
  });

  it('preserva registros válidos e isola apenas os incompatíveis', () => {
    localStorage.setItem(
      ESSAY_STORE_KEY,
      JSON.stringify({
        version: 1,
        essays: [validRecord, { id: 'quebrado', type: 'imagem', imageUrl: 'data:image/png;base64,aaa' }],
      })
    );

    const result = readEssayStore();

    expect(result.essays).toHaveLength(1);
    expect(result.essays[0]?.id).toBe('essay-local-1');
    expect(readQuarantine()[0]?.payload).toEqual([
      { id: 'quebrado', type: 'imagem', imageUrl: 'data:image/png;base64,aaa' },
    ]);
  });

  it('nunca grava imageUrl ou File no armazenamento textual', () => {
    writeEssayStore([validRecord]);
    const stored = JSON.parse(localStorage.getItem(ESSAY_STORE_KEY) || '{}');
    expect(JSON.stringify(stored)).not.toContain('imageUrl');
    expect(JSON.stringify(stored)).not.toContain('data:image');
  });

  it('propaga falha de armazenamento sem fingir sucesso', () => {
    const original = Storage.prototype.setItem;
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(function (
      this: Storage,
      key: string,
      value: string
    ) {
      if (key === ESSAY_STORE_KEY) {
        throw new Error('quota');
      }
      return original.call(this, key, value);
    });

    expect(() => writeEssayStore([validRecord])).toThrow(EssayStorageError);
  });

  it('consegue registrar quarentena quando o armazenamento principal falha', () => {
    expect(quarantinePayload('manual', { foo: 1 })).toBe(true);
    expect(localStorage.getItem(ESSAY_QUARANTINE_KEY)).toContain('manual');
  });
});
