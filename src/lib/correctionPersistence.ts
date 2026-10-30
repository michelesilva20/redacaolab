import type { Comment, Competency, Correction, Highlight } from '../types';

export const COMPETENCY_IDS = ['C1', 'C2', 'C3', 'C4', 'C5'] as const;
export const COMPETENCY_MAX_SCORE = 200;

export const ENEM_COMPETENCY_META: Record<(typeof COMPETENCY_IDS)[number], { name: string; maxScore: number }> = {
  C1: { name: 'Domínio da norma culta', maxScore: COMPETENCY_MAX_SCORE },
  C2: { name: 'Compreensão do tema', maxScore: COMPETENCY_MAX_SCORE },
  C3: { name: 'Argumentação', maxScore: COMPETENCY_MAX_SCORE },
  C4: { name: 'Coesão textual', maxScore: COMPETENCY_MAX_SCORE },
  C5: { name: 'Proposta de intervenção', maxScore: COMPETENCY_MAX_SCORE },
};

const COMMENT_CATEGORIES = ['gramatica', 'coesao', 'repertorio', 'intervencao', 'geral'] as const;
const HIGHLIGHT_CATEGORIES = ['gramatica', 'coesao', 'repertorio', 'intervencao'] as const;
const CORRECTION_STATUSES = ['rascunho', 'finalizada'] as const;

function isIsoDate(value: unknown): value is string {
  return typeof value === 'string' && !Number.isNaN(Date.parse(value));
}

export function isValidCompetencyScore(score: unknown): score is number {
  return typeof score === 'number' && Number.isInteger(score) && score >= 0 && score <= COMPETENCY_MAX_SCORE;
}

export function computeCorrectionTotal(competencies: Pick<Competency, 'score'>[]): number {
  return competencies.reduce((sum, item) => sum + item.score, 0);
}

function normalizeCompetency(value: unknown): Competency | null {
  if (!value || typeof value !== 'object') return null;
  const record = value as Record<string, unknown>;
  if (!(COMPETENCY_IDS as readonly string[]).includes(record.id as string)) return null;
  const id = record.id as Competency['id'];
  if (!isValidCompetencyScore(record.score)) return null;
  if (record.feedback !== undefined && typeof record.feedback !== 'string') return null;
  if (record.maxScore !== undefined && record.maxScore !== COMPETENCY_MAX_SCORE) return null;
  if (record.name !== undefined && typeof record.name !== 'string') return null;

  return {
    id,
    name: typeof record.name === 'string' && record.name.trim() ? record.name : ENEM_COMPETENCY_META[id].name,
    score: record.score,
    maxScore: COMPETENCY_MAX_SCORE,
    feedback: typeof record.feedback === 'string' ? record.feedback : '',
  };
}

function normalizeCompetencies(value: unknown): Competency[] | null {
  if (!Array.isArray(value) || value.length !== COMPETENCY_IDS.length) return null;
  const items = value.map(normalizeCompetency);
  if (items.some((item) => item == null)) return null;
  const competencies = items as Competency[];
  const ids = competencies.map((item) => item.id);
  if (new Set(ids).size !== COMPETENCY_IDS.length) return null;
  if (!COMPETENCY_IDS.every((id) => ids.includes(id))) return null;
  return COMPETENCY_IDS.map((id) => competencies.find((item) => item.id === id)!);
}

function normalizeStringArray(value: unknown): string[] | null {
  if (value === undefined) return [];
  if (!Array.isArray(value)) return null;
  if (!value.every((item) => typeof item === 'string')) return null;
  return value;
}

function normalizeComments(value: unknown): Comment[] | null {
  if (value === undefined) return [];
  if (!Array.isArray(value)) return null;
  const comments: Comment[] = [];
  for (const item of value) {
    if (!item || typeof item !== 'object') return null;
    const record = item as Record<string, unknown>;
    if (typeof record.id !== 'string' || !record.id.trim()) return null;
    if (typeof record.text !== 'string') return null;
    if (!(COMMENT_CATEGORIES as readonly string[]).includes(record.category as string)) return null;
    if (record.createdAt !== undefined && !isIsoDate(record.createdAt)) return null;
    if (record.startIndex !== undefined && typeof record.startIndex !== 'number') return null;
    if (record.endIndex !== undefined && typeof record.endIndex !== 'number') return null;
    comments.push({
      id: record.id,
      text: record.text,
      category: record.category as Comment['category'],
      createdAt: isIsoDate(record.createdAt) ? record.createdAt : new Date(0).toISOString(),
      startIndex: typeof record.startIndex === 'number' ? record.startIndex : undefined,
      endIndex: typeof record.endIndex === 'number' ? record.endIndex : undefined,
    });
  }
  return comments;
}

function normalizeHighlights(value: unknown): Highlight[] | null {
  if (value === undefined) return [];
  if (!Array.isArray(value)) return null;
  const highlights: Highlight[] = [];
  for (const item of value) {
    if (!item || typeof item !== 'object') return null;
    const record = item as Record<string, unknown>;
    if (typeof record.id !== 'string' || !record.id.trim()) return null;
    if (typeof record.startIndex !== 'number' || typeof record.endIndex !== 'number') return null;
    if (!(HIGHLIGHT_CATEGORIES as readonly string[]).includes(record.category as string)) return null;
    if (record.commentId !== undefined && typeof record.commentId !== 'string') return null;
    highlights.push({
      id: record.id,
      startIndex: record.startIndex,
      endIndex: record.endIndex,
      category: record.category as Highlight['category'],
      commentId: typeof record.commentId === 'string' ? record.commentId : undefined,
    });
  }
  return highlights;
}

export function normalizeCorrection(value: unknown): Correction | undefined {
  if (!value || typeof value !== 'object') return undefined;
  const record = value as Record<string, unknown>;

  if (typeof record.id !== 'string' || !record.id.trim()) return undefined;
  if (typeof record.essayId !== 'string' || !record.essayId.trim()) return undefined;
  if (typeof record.professorId !== 'string' || !record.professorId.trim()) return undefined;
  if (!(CORRECTION_STATUSES as readonly string[]).includes(record.status as string)) return undefined;
  if (!isIsoDate(record.createdAt)) return undefined;
  if (record.finishedAt !== undefined && !isIsoDate(record.finishedAt)) return undefined;
  if (record.generalFeedback !== undefined && typeof record.generalFeedback !== 'string') return undefined;

  const competencies = normalizeCompetencies(record.competencies);
  const strengths = normalizeStringArray(record.strengths);
  const improvements = normalizeStringArray(record.improvements);
  const comments = normalizeComments(record.comments);
  const highlights = normalizeHighlights(record.highlights);
  if (!competencies || !strengths || !improvements || !comments || !highlights) {
    return undefined;
  }

  const totalScore = computeCorrectionTotal(competencies);
  if (record.totalScore !== undefined && (typeof record.totalScore !== 'number' || !Number.isFinite(record.totalScore))) {
    return undefined;
  }

  return {
    id: record.id,
    essayId: record.essayId,
    professorId: record.professorId,
    competencies,
    totalScore,
    generalFeedback: typeof record.generalFeedback === 'string' ? record.generalFeedback : '',
    strengths,
    improvements,
    comments,
    highlights,
    status: record.status as Correction['status'],
    createdAt: record.createdAt,
    finishedAt: record.status === 'finalizada' ? (record.finishedAt as string | undefined) : undefined,
  };
}

export function isFinalizedCorrection(correction: { status?: string } | null | undefined): boolean {
  return correction?.status === 'finalizada';
}
