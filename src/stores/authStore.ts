import { useEffect, useState } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  AUTH_STORAGE_KEY,
  cloneDemoUserByRole,
  isValidRole,
  repairAuthState,
  type PersistableAuth,
} from '../lib/demoAuth';
import { markDemoOnboardingComplete } from '../lib/demoOnboarding';
import type { User, Role, UserPreferences } from '../types';

interface AuthState extends PersistableAuth {
  login: (user: User) => void;
  enterDemo: (role: Role) => void;
  logout: () => void;
  setSimulatedRole: (role: Role) => void;
  toggleSimulatedMode: () => void;
  updateOnboarding: (completed: boolean) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  addXp: (amount: number) => void;
  incrementStreak: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isSimulatedMode: true,
      simulatedRole: 'aluno',

      login: (user) => {
        const cloned = structuredClone(user);
        const role = isValidRole(cloned.role) ? cloned.role : 'aluno';
        set({
          user: { ...cloned, role },
          isAuthenticated: true,
          simulatedRole: role,
        });
      },

      enterDemo: (role) => {
        set({
          user: cloneDemoUserByRole(role),
          isAuthenticated: true,
          simulatedRole: role,
          isSimulatedMode: true,
        });
      },

      logout: () => set({ user: null, isAuthenticated: false }),

      setSimulatedRole: (role) => {
        if (!get().isAuthenticated) {
          set({ simulatedRole: role, user: null });
          return;
        }

        set({
          simulatedRole: role,
          user: cloneDemoUserByRole(role),
        });
      },

      toggleSimulatedMode: () =>
        set((state) => ({
          isSimulatedMode: !state.isSimulatedMode,
        })),

      updateOnboarding: (completed) =>
        set((state) => {
          if (completed && state.user?.id) {
            markDemoOnboardingComplete(state.user.id);
          }
          return {
            user: state.user ? { ...state.user, onboardingCompleted: completed } : null,
          };
        }),

      updatePreferences: (preferences) =>
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                preferences: { ...state.user.preferences, ...preferences },
              }
            : null,
        })),

      addXp: (amount) =>
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                xp: state.user.xp + amount,
                level: Math.floor((state.user.xp + amount) / 200) + 1,
              }
            : null,
        })),

      incrementStreak: () =>
        set((state) => ({
          user: state.user ? { ...state.user, streak: state.user.streak + 1 } : null,
        })),
    }),
    {
      name: AUTH_STORAGE_KEY,
      merge: (persistedState, currentState) => {
        const persisted = (persistedState ?? {}) as Partial<PersistableAuth>;
        const repaired = repairAuthState({
          user: persisted.user ?? currentState.user,
          isAuthenticated: persisted.isAuthenticated ?? currentState.isAuthenticated,
          isSimulatedMode: persisted.isSimulatedMode ?? currentState.isSimulatedMode,
          simulatedRole: persisted.simulatedRole ?? currentState.simulatedRole,
        });

        return {
          ...currentState,
          ...repaired,
        };
      },
    }
  )
);

export function useHasAuthHydrated() {
  const [hydrated, setHydrated] = useState(() => useAuthStore.persist.hasHydrated());

  useEffect(() => {
    const unsubscribe = useAuthStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });
    setHydrated(useAuthStore.persist.hasHydrated());
    return unsubscribe;
  }, []);

  return hydrated;
}

export function resetAuthStoreForTests() {
  useAuthStore.setState({
    user: null,
    isAuthenticated: false,
    isSimulatedMode: true,
    simulatedRole: 'aluno',
  });
}
