import type { Competency, Correction, Essay } from '../types';
import { mockEssays } from '../mocks/essays';
import { getThemeById } from '../mocks/themes';
import { mockUsers } from '../mocks/users';
import {
  COMPETENCY_IDS,
  computeCorrectionTotal,
  isFinalizedCorrection,
  isValidCompetencyScore,
  normalizeCorrection,
} from './correctionPersistence';
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
import type { EssayTimerSnapshot } from './essayTimer';

const MIN_SUBMIT_WORDS = 100;

export type EssayWriteInput = {
  actorId: string;
  id?: string;
  themeId: string;
  category: Essay['category'];
  content?: string;
  notes?: string;
  wordCount?: number;
  timer?: EssayTimerSnapshot;
};

export type CorrectionWriteInput = {
  actorId: string;
  essayId: string;
  competencies: Competency[];
  generalFeedback?: string;
  strengths?: string[];
  improvements?: string[];
  comments?: Correction['comments'];
  highlights?: Correction['highlights'];
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
      timerElapsedMs: record.timerElapsedMs,
      timerRunning: record.timerRunning,
      timerStartedAt: record.timerStartedAt,
      correction: record.correction,
    })
  );
}

function timerFields(timer?: EssayTimerSnapshot, fallback?: Essay): Pick<
  PersistedEssayRecord,
  'timerElapsedMs' | 'timerRunning' | 'timerStartedAt'
> {
  if (timer) {
    return {
      timerElapsedMs: timer.elapsedMs,
      timerRunning: timer.running,
      timerStartedAt: timer.startedAt ?? undefined,
    };
  }
  return {
    timerElapsedMs: fallback?.timerElapsedMs,
    timerRunning: fallback?.timerRunning,
    timerStartedAt: fallback?.timerStartedAt,
  };
}

function correctionField(correction?: Correction): Pick<PersistedEssayRecord, 'correction'> {
  const normalized = correction ? normalizeCorrection(correction) : undefined;
  return normalized ? { correction: normalized } : {};
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
      ...timerFields(input.timer, current),
      ...correctionField(current.correction),
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
    ...timerFields(input.timer),
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
      ...timerFields(input.timer, current),
      ...correctionField(current.correction),
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
    ...timerFields(input.timer),
  });
}

export function persistEssayTimer(actorId: string, essayId: string, timer: EssayTimerSnapshot): Essay {
  const actor = requireActor(actorId);
  const current = getMergedEssayById(essayId);
  if (!current) {
    throw new EssayDomainError('not_found', 'Redação não encontrada.');
  }
  if (current.userId !== actor) {
    throw new EssayDomainError('forbidden', 'Você não pode atualizar o cronômetro de outro perfil.');
  }
  if (current.type !== 'texto') {
    throw new EssayDomainError('invalid', 'O cronômetro só se aplica a redações digitadas.');
  }

  return persistRecord({
    id: current.id,
    userId: current.userId,
    themeId: current.themeId,
    type: 'texto',
    content: current.content ?? '',
    category: current.category,
    status: current.status,
    notes: current.notes,
    wordCount: current.wordCount,
    createdAt: current.createdAt,
    updatedAt: current.updatedAt ?? current.createdAt,
    submittedAt: current.submittedAt,
    ...timerFields(timer),
    ...correctionField(current.correction),
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

function createCorrectionId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `corr-${crypto.randomUUID()}`;
  }
  return `corr-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function requireProfessor(actorId: string | null | undefined): string {
  if (!actorId?.trim()) {
    throw new EssayDomainError('forbidden', 'Identidade do professor é obrigatória para esta operação.');
  }
  const actor = mockUsers.find((user) => user.id === actorId);
  if (!actor || actor.role !== 'professor') {
    throw new EssayDomainError('forbidden', 'Somente um professor demonstrativo pode corrigir redações.');
  }
  return actorId;
}

function assertCanCorrectEssay(current: Essay): void {
  if (current.status === 'rascunho') {
    throw new EssayDomainError('invalid', 'Não é possível corrigir um rascunho que ainda não foi enviado.');
  }
  if (current.status === 'corrigida' || isFinalizedCorrection(current.correction)) {
    throw new EssayDomainError('invalid', 'Esta correção já foi finalizada e não pode ser alterada.');
  }
  if (current.status !== 'enviada' && current.status !== 'em_correcao') {
    throw new EssayDomainError('invalid', 'Esta redação não está disponível para correção.');
  }
}

function buildCompetencies(input: CorrectionWriteInput): Competency[] {
  if (!Array.isArray(input.competencies) || input.competencies.length !== COMPETENCY_IDS.length) {
    throw new EssayDomainError('invalid', 'A correção precisa das cinco competências da rubrica suportada.');
  }

  const byId = new Map(input.competencies.map((item) => [item.id, item]));
  return COMPETENCY_IDS.map((id) => {
    const current = byId.get(id);
    if (!current || !isValidCompetencyScore(current.score)) {
      throw new EssayDomainError('invalid', `A nota de ${id} deve ser um inteiro entre 0 e 200.`);
    }
    return {
      id,
      name: current.name?.trim() || id,
      score: current.score,
      maxScore: 200,
      feedback: typeof current.feedback === 'string' ? current.feedback : '',
    };
  });
}

function buildCorrection(
  current: Essay,
  input: CorrectionWriteInput,
  status: Correction['status']
): Correction {
  const now = new Date().toISOString();
  const competencies = buildCompetencies(input);
  const existing = current.correction;
  const createdAt = existing?.createdAt || now;

  const draft: Correction = {
    id: existing?.id || createCorrectionId(),
    essayId: current.id,
    professorId: existing?.professorId || input.actorId,
    competencies,
    totalScore: computeCorrectionTotal(competencies),
    generalFeedback: input.generalFeedback ?? existing?.generalFeedback ?? '',
    strengths: input.strengths ?? existing?.strengths ?? [],
    improvements: input.improvements ?? existing?.improvements ?? [],
    comments: input.comments ?? existing?.comments ?? [],
    highlights: input.highlights ?? existing?.highlights ?? [],
    status,
    createdAt,
    finishedAt: status === 'finalizada' ? now : undefined,
  };

  const normalized = normalizeCorrection(draft);
  if (!normalized) {
    throw new EssayDomainError('invalid', 'Os dados da correção são incompatíveis com o modelo persistido.');
  }
  return normalized;
}

function persistTextualCorrection(current: Essay, correction: Correction, status: Essay['status']): Essay {
  return persistRecord({
    id: current.id,
    userId: current.userId,
    themeId: current.themeId,
    type: 'texto',
    content: current.content ?? '',
    category: current.category,
    status,
    notes: current.notes,
    wordCount: current.wordCount,
    createdAt: current.createdAt,
    updatedAt: new Date().toISOString(),
    submittedAt: current.submittedAt,
    ...timerFields(undefined, current),
    correction,
  });
}

function persistImageCorrectionInSession(essayId: string, correction: Correction, status: Essay['status']): Essay {
  sessionPatches.set(essayId, { correction, status });
  return getMergedEssayById(essayId)!;
}

function persistCorrection(input: CorrectionWriteInput, mode: Correction['status']): Essay {
  const actorId = requireProfessor(input.actorId);
  const current = getMergedEssayById(input.essayId);
  if (!current) {
    throw new EssayDomainError('not_found', 'Redação não encontrada.');
  }

  assertCanCorrectEssay(current);
  const correction = buildCorrection(current, { ...input, actorId }, mode);
  const nextStatus: Essay['status'] = mode === 'finalizada' ? 'corrigida' : 'em_correcao';

  if (current.type === 'imagem') {
    return persistImageCorrectionInSession(current.id, correction, nextStatus);
  }

  return persistTextualCorrection(current, correction, nextStatus);
}

export function saveCorrectionDraft(input: CorrectionWriteInput): Essay {
  return persistCorrection(input, 'rascunho');
}

export function finalizeCorrection(input: CorrectionWriteInput): Essay {
  return persistCorrection(input, 'finalizada');
}

export function resetEssayRepositoryForTests(): void {
  sessionImageEssays = [];
  sessionPatches.clear();
  resetEssayStoreForTests();
}
