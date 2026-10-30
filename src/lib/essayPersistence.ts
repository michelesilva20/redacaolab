import type { Correction, Essay } from '../types';
import { normalizeCorrection } from './correctionPersistence';
import { EssayStorageError } from './essayErrors';
import { normalizeTimerSnapshot } from './essayTimer';

export const ESSAY_STORE_KEY = 'redacaolab-essays-v1';
export const ESSAY_QUARANTINE_KEY = 'redacaolab-essays-v1-quarantine';
export const ESSAY_STORE_VERSION = 1;
const QUARANTINE_LIMIT = 20;

const CATEGORIES = ['enem', 'unesp', 'concursos'] as const;
const STATUSES = ['rascunho', 'enviada', 'em_correcao', 'corrigida'] as const;

export type PersistedEssayRecord = {
  id: string;
  userId: string;
  themeId: string;
  type: 'texto';
  content: string;
  category: Essay['category'];
  status: Essay['status'];
  notes?: string;
  wordCount: number;
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
  timerElapsedMs?: number;
  timerRunning?: boolean;
  timerStartedAt?: string;
  correction?: Correction;
};

export type EssayStorePayload = {
  version: number;
  essays: unknown[];
};

export type QuarantineEntry = {
  at: string;
  reason: string;
  payload: unknown;
};

export type EssayStoreReadResult = {
  essays: PersistedEssayRecord[];
  warnings: string[];
};

function isIsoDate(value: unknown): value is string {
  return typeof value === 'string' && !Number.isNaN(Date.parse(value));
}

export function countWordsFromHtml(html: string | null | undefined): number {
  const text = String(html ?? '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/\s+/g, ' ')
    .trim();

  if (!text) return 0;
  return text.split(/\s+/).filter(Boolean).length;
}

export function stripHtmlPreview(html: string | null | undefined): string {
  return String(html ?? '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function isPersistedEssayRecord(value: unknown): value is PersistedEssayRecord {
  if (!value || typeof value !== 'object') return false;

  const record = value as Record<string, unknown>;
  if (typeof record.id !== 'string' || !record.id.trim()) return false;
  if (typeof record.userId !== 'string' || !record.userId.trim()) return false;
  if (typeof record.themeId !== 'string' || !record.themeId.trim()) return false;
  if (record.type !== 'texto') return false;
  if (typeof record.content !== 'string') return false;
  if (!(CATEGORIES as readonly string[]).includes(record.category as string)) return false;
  if (!(STATUSES as readonly string[]).includes(record.status as string)) return false;
  if (typeof record.wordCount !== 'number' || !Number.isFinite(record.wordCount) || record.wordCount < 0) {
    return false;
  }
  if (!isIsoDate(record.createdAt) || !isIsoDate(record.updatedAt)) return false;
  if (record.notes !== undefined && typeof record.notes !== 'string') return false;
  if (record.submittedAt !== undefined && !isIsoDate(record.submittedAt)) return false;
  return true;
}

export function toPersistedEssayRecord(value: unknown): PersistedEssayRecord | null {
  if (!isPersistedEssayRecord(value)) return null;

  const timer = normalizeTimerSnapshot(value);
  const correction = normalizeCorrection((value as { correction?: unknown }).correction);

  return {
    id: value.id,
    userId: value.userId,
    themeId: value.themeId,
    type: 'texto',
    content: value.content,
    category: value.category,
    status: value.status,
    notes: value.notes,
    wordCount: Math.floor(value.wordCount),
    createdAt: value.createdAt,
    updatedAt: value.updatedAt,
    submittedAt: value.submittedAt,
    ...(timer
      ? {
          timerElapsedMs: timer.elapsedMs,
          timerRunning: timer.running,
          timerStartedAt: timer.startedAt ?? undefined,
        }
      : {}),
    ...(correction ? { correction } : {}),
  };
}

function emptyPayload(): EssayStorePayload {
  return { version: ESSAY_STORE_VERSION, essays: [] };
}

export function readQuarantine(): QuarantineEntry[] {
  const raw = localStorage.getItem(ESSAY_QUARANTINE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as QuarantineEntry[]) : [];
  } catch {
    return [];
  }
}

function writeQuarantine(entries: QuarantineEntry[]): boolean {
  try {
    localStorage.setItem(ESSAY_QUARANTINE_KEY, JSON.stringify(entries.slice(-QUARANTINE_LIMIT)));
    return true;
  } catch {
    return false;
  }
}

export function quarantinePayload(reason: string, payload: unknown): boolean {
  const entries = readQuarantine();
  entries.push({
    at: new Date().toISOString(),
    reason,
    payload,
  });
  return writeQuarantine(entries);
}

function replaceStoreAfterQuarantine(reason: string, payload: unknown): boolean {
  if (!quarantinePayload(reason, payload)) {
    return false;
  }

  try {
    localStorage.setItem(ESSAY_STORE_KEY, JSON.stringify(emptyPayload()));
    return true;
  } catch {
    return false;
  }
}

export function readEssayStore(): EssayStoreReadResult {
  const warnings: string[] = [];
  const raw = localStorage.getItem(ESSAY_STORE_KEY);
  if (!raw) {
    return { essays: [], warnings };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    replaceStoreAfterQuarantine('json_parse', raw);
    warnings.push('O armazenamento local estava ilegível e foi isolado na quarentena.');
    return { essays: [], warnings };
  }

  if (!parsed || typeof parsed !== 'object') {
    replaceStoreAfterQuarantine('invalid_root', parsed);
    warnings.push('O formato do armazenamento local é incompatível e foi isolado.');
    return { essays: [], warnings };
  }

  const root = parsed as Record<string, unknown>;
  const essaysSource = Array.isArray(root.essays)
    ? root.essays
    : Array.isArray(parsed)
      ? (parsed as unknown[])
      : null;

  if (!essaysSource) {
    replaceStoreAfterQuarantine('missing_essays', parsed);
    warnings.push('Não havia lista de redações válida; o payload foi isolado.');
    return { essays: [], warnings };
  }

  if (root.version !== undefined && root.version !== ESSAY_STORE_VERSION) {
    warnings.push(`Versão ${String(root.version)} do armazenamento local: registros válidos foram preservados.`);
  }

  const essays: PersistedEssayRecord[] = [];
  const invalidItems: unknown[] = [];

  for (const item of essaysSource) {
    const record = toPersistedEssayRecord(item);
    if (record) {
      essays.push(record);
    } else {
      invalidItems.push(item);
    }
  }

  if (invalidItems.length > 0) {
    quarantinePayload('invalid_items', invalidItems);
    warnings.push(`${invalidItems.length} registro(s) incompatível(is) foram isolados; os válidos permanecem.`);
  }

  return { essays, warnings };
}

export function writeEssayStore(essays: PersistedEssayRecord[]): void {
  const payload: EssayStorePayload = {
    version: ESSAY_STORE_VERSION,
    essays: essays.map((essay) => toPersistedEssayRecord(essay)).filter(Boolean),
  };

  try {
    localStorage.setItem(ESSAY_STORE_KEY, JSON.stringify(payload));
  } catch {
    throw new EssayStorageError();
  }
}

export function upsertPersistedEssay(
  essays: PersistedEssayRecord[],
  next: PersistedEssayRecord
): PersistedEssayRecord[] {
  const index = essays.findIndex((essay) => essay.id === next.id);
  if (index >= 0) {
    const copy = [...essays];
    copy[index] = next;
    return copy;
  }
  return [...essays, next];
}

export function resetEssayStoreForTests(): void {
  localStorage.removeItem(ESSAY_STORE_KEY);
  localStorage.removeItem(ESSAY_QUARANTINE_KEY);
}
