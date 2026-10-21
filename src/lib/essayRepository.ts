import type { Correction, Essay } from '../types';
import { mockEssays } from '../mocks/essays';
import { getThemeById } from '../mocks/themes';
import { EssayDomainError } from './essayErrors';
import {
  countWordsFromHtml,
  readEssayStore,
  resetEssayStoreForTests,
  upsertPersistedEssay,
  writeEssayStore,
  type PersistedEssayRecord,
} from './essayPersistence';
import { sanitizeEssayHtml } from './sanitizeEssayHtml';

const MIN_SUBMIT_WORDS = 100;

export type EssayWriteInput = {
  actorId: string;
  id?: string;
  themeId: string;
  category: Essay['category'];
  content?: string;
  notes?: string;
  wordCount?: number;
};

type SessionPatch = Partial<Pick<Essay, 'status' | 'correction'>>;

let sessionImageEssays: Essay[] = [];
const sessionPatches = new Map<string, SessionPatch>();

function createEssayId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `essay-${crypto.randomUUID()}`;
  }
  return `essay-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function cloneEssay(essay: Essay): Essay {
  return structuredClone(essay);
}

function attachTheme(essay: Essay): Essay {
  return {
    ...essay,
    theme: essay.themeId ? getThemeById(essay.themeId) : essay.theme,
  };
}

function applySessionPatch(essay: Essay): Essay {
  const patch = sessionPatches.get(essay.id);
  return patch ? { ...essay, ...patch } : essay;
}

function hydratePersisted(record: PersistedEssayRecord): Essay {
  return applySessionPatch(
    attachTheme({
      id: record.id,
      userId: record.userId,
      themeId: record.themeId,
      type: 'texto',
      content: record.content,
      category: record.category,
      status: record.status,
      notes: record.notes,
      wordCount: record.wordCount,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      submittedAt: record.submittedAt,
    })
  );
}

function resolveWordCount(content: string, provided?: number): number {
  if (typeof provided === 'number' && Number.isFinite(provided) && provided >= 0) {
    return Math.floor(provided);
  }
  return countWordsFromHtml(content);
}

function requireActor(actorId: string | null | undefined): string {
  if (!actorId?.trim()) {
    throw new EssayDomainError('forbidden', 'Identidade do aluno é obrigatória para esta operação.');
  }
  return actorId;
}

function requireTheme(themeId: string | null | undefined): string {
  if (!themeId?.trim()) {
    throw new EssayDomainError('invalid', 'Selecione um tema para continuar.');
  }
  return themeId;
}

function assertCanWriteDraft(current: Essay, actorId: string): void {
  if (current.userId !== actorId) {
    throw new EssayDomainError('forbidden', 'Você não pode editar a redação de outro perfil.');
  }
  if (current.type !== 'texto') {
    throw new EssayDomainError('invalid', 'Apenas redações digitadas podem ser salvas ou enviadas por este fluxo.');
  }
  if (current.status !== 'rascunho') {
    throw new EssayDomainError(
      'not_draft',
      'Esta redação já foi enviada e não pode voltar ao estado de rascunho.'
    );
  }
}

export function listMergedEssays(): Essay[] {
  const { essays: localRecords } = readEssayStore();
  const localById = new Map(localRecords.map((record) => [record.id, record]));
  const seen = new Set<string>();
  const merged: Essay[] = [];

  for (const mock of mockEssays) {
    const overlay = localById.get(mock.id);
    merged.push(overlay ? hydratePersisted(overlay) : applySessionPatch(attachTheme(cloneEssay(mock))));
    seen.add(mock.id);
  }

  for (const session of sessionImageEssays) {
    if (seen.has(session.id) || localById.has(session.id)) continue;
    merged.push(applySessionPatch(attachTheme(cloneEssay(session))));
    seen.add(session.id);
  }

  for (const record of localRecords) {
    if (seen.has(record.id)) continue;
    merged.push(hydratePersisted(record));
    seen.add(record.id);
  }

  return merged;
}

export function getMergedEssayById(id: string): Essay | undefined {
  return listMergedEssays().find((essay) => essay.id === id);
}

export function listMergedEssaysByUser(userId: string): Essay[] {
  return listMergedEssays().filter((essay) => essay.userId === userId);
}

export function listMergedEssaysForCorrection(): Essay[] {
  return listMergedEssays().filter((essay) => essay.status === 'enviada' || essay.status === 'em_correcao');
}

export function listMergedCorrectedEssays(): Essay[] {
  return listMergedEssays().filter((essay) => essay.status === 'corrigida');
}

function persistRecord(record: PersistedEssayRecord): Essay {
  const { essays } = readEssayStore();
  writeEssayStore(upsertPersistedEssay(essays, record));
  return hydratePersisted(record);
}

export function saveTextDraft(input: EssayWriteInput): Essay {
  const actorId = requireActor(input.actorId);
  const themeId = requireTheme(input.themeId);
  const now = new Date().toISOString();
  const content = sanitizeEssayHtml(input.content ?? '');
  const wordCount = resolveWordCount(content, input.wordCount);

  if (input.id) {
    const current = getMergedEssayById(input.id);
    if (!current) {
      throw new EssayDomainError('not_found', 'Redação não encontrada.');
    }
    assertCanWriteDraft(current, actorId);

    return persistRecord({
      id: current.id,
      userId: current.userId,
      themeId,
      type: 'texto',
      content,
      category: input.category,
      status: 'rascunho',
      notes: input.notes,
      wordCount,
      createdAt: current.createdAt,
      updatedAt: now,
      submittedAt: current.submittedAt,
    });
  }

  return persistRecord({
    id: createEssayId(),
    userId: actorId,
    themeId,
    type: 'texto',
    content,
    category: input.category,
    status: 'rascunho',
    notes: input.notes,
    wordCount,
    createdAt: now,
    updatedAt: now,
  });
}

export function submitTextEssay(input: EssayWriteInput): Essay {
  const actorId = requireActor(input.actorId);
  const themeId = requireTheme(input.themeId);
  const now = new Date().toISOString();
  const content = sanitizeEssayHtml(input.content ?? '');
  const wordCount = resolveWordCount(content, input.wordCount);

  if (wordCount < MIN_SUBMIT_WORDS) {
    throw new EssayDomainError('invalid', `A redação precisa ter pelo menos ${MIN_SUBMIT_WORDS} palavras.`);
  }

  if (input.id) {
    const current = getMergedEssayById(input.id);
    if (!current) {
      throw new EssayDomainError('not_found', 'Redação não encontrada.');
    }
    assertCanWriteDraft(current, actorId);

    return persistRecord({
      id: current.id,
      userId: current.userId,
      themeId,
      type: 'texto',
      content,
      category: input.category,
      status: 'enviada',
      notes: input.notes,
      wordCount,
      createdAt: current.createdAt,
      updatedAt: now,
      submittedAt: now,
    });
  }

  return persistRecord({
    id: createEssayId(),
    userId: actorId,
    themeId,
    type: 'texto',
    content,
    category: input.category,
    status: 'enviada',
    notes: input.notes,
    wordCount,
    createdAt: now,
    updatedAt: now,
    submittedAt: now,
  });
}

export function createSessionImageEssay(data: Partial<Essay> & { actorId: string }): Essay {
  const actorId = requireActor(data.actorId);
  const themeId = requireTheme(data.themeId);
  const now = new Date().toISOString();

  const essay: Essay = {
    id: createEssayId(),
    userId: actorId,
    themeId,
    type: 'imagem',
    imageUrl: data.imageUrl,
    category: data.category || 'enem',
    status: 'enviada',
    notes: data.notes,
    wordCount: 0,
    createdAt: now,
    updatedAt: now,
    submittedAt: now,
  };

  sessionImageEssays.push(essay);
  return attachTheme(essay);
}

export function applyCorrectionInSession(
  essayId: string,
  correction: Correction,
  status: Essay['status']
): Essay {
  const current = getMergedEssayById(essayId);
  if (!current) {
    throw new EssayDomainError('not_found', 'Redação não encontrada.');
  }

  const mock = mockEssays.find((essay) => essay.id === essayId);
  const overlay = readEssayStore().essays.some((essay) => essay.id === essayId);
  if (mock && !overlay) {
    mock.correction = correction;
    mock.status = status;
  }

  sessionPatches.set(essayId, { correction, status });
  return getMergedEssayById(essayId)!;
}

export function resetEssayRepositoryForTests(): void {
  sessionImageEssays = [];
  sessionPatches.clear();
  resetEssayStoreForTests();
}
