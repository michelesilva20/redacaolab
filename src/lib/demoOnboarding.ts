import type { User } from '../types';

export const ONBOARDING_STORE_KEY = 'redacaolab-onboarding-v1';
export const ONBOARDING_STORE_VERSION = 1;

type OnboardingStorePayload = {
  version: number;
  completedUserIds: string[];
};

function emptyPayload(): OnboardingStorePayload {
  return { version: ONBOARDING_STORE_VERSION, completedUserIds: [] };
}

function readStore(): OnboardingStorePayload {
  const raw = localStorage.getItem(ONBOARDING_STORE_KEY);
  if (!raw) return emptyPayload();

  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object') return emptyPayload();
    const record = parsed as Record<string, unknown>;
    const ids = Array.isArray(record.completedUserIds)
      ? record.completedUserIds.filter((id): id is string => typeof id === 'string' && id.trim().length > 0)
      : [];
    return { version: ONBOARDING_STORE_VERSION, completedUserIds: [...new Set(ids)] };
  } catch {
    return emptyPayload();
  }
}

function writeStore(payload: OnboardingStorePayload): void {
  localStorage.setItem(ONBOARDING_STORE_KEY, JSON.stringify(payload));
}

export function hasCompletedDemoOnboarding(userId: string | null | undefined): boolean {
  if (!userId) return false;
  return readStore().completedUserIds.includes(userId);
}

export function markDemoOnboardingComplete(userId: string): void {
  if (!userId.trim()) return;
  const store = readStore();
  if (store.completedUserIds.includes(userId)) return;
  writeStore({
    version: ONBOARDING_STORE_VERSION,
    completedUserIds: [...store.completedUserIds, userId],
  });
}

export function applyDemoOnboardingFlag(user: User): User {
  if (user.role !== 'aluno') {
    return user;
  }
  if (!hasCompletedDemoOnboarding(user.id)) {
    return user;
  }
  if (user.onboardingCompleted) {
    return user;
  }
  return { ...user, onboardingCompleted: true };
}

export function resetDemoOnboardingForTests(): void {
  localStorage.removeItem(ONBOARDING_STORE_KEY);
}
