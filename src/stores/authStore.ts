import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Role, UserPreferences } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isSimulatedMode: boolean;
  simulatedRole: Role;
  
  login: (user: User) => void;
  logout: () => void;
  setSimulatedRole: (role: Role) => void;
  toggleSimulatedMode: () => void;
  updateOnboarding: (completed: boolean) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  addXp: (amount: number) => void;
  incrementStreak: () => void;
}

const defaultPreferences: UserPreferences = {
  targetExam: 'enem',
  currentLevel: 600,
  targetScore: 900,
  weeklyGoal: 3,
  preferredDays: ['segunda', 'quarta', 'sexta'],
};

const createMockUser = (role: Role): User => ({
  id: `user-${role}-1`,
  name: role === 'admin' ? 'Admin Silva' : role === 'professor' ? 'Prof. Maria Santos' : 'João Aluno',
  email: `${role}@redacaolab.com`,
  role,
  avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${role}`,
  xp: 2400,
  streak: 7,
  level: 12,
  badges: [],
  createdAt: '2024-01-15',
  onboardingCompleted: role !== 'aluno',
  preferences: defaultPreferences,
});

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isSimulatedMode: true,
      simulatedRole: 'aluno',
      
      login: (user) => set({ user, isAuthenticated: true }),
      
      logout: () => set({ user: null, isAuthenticated: false }),
      
      setSimulatedRole: (role) => {
        const currentUser = get().user;
        const newUser = currentUser 
          ? { ...currentUser, role }
          : createMockUser(role);
        set({ simulatedRole: role, user: newUser });
      },
      
      toggleSimulatedMode: () => set((state) => ({ 
        isSimulatedMode: !state.isSimulatedMode 
      })),
      
      updateOnboarding: (completed) => set((state) => ({
        user: state.user ? { ...state.user, onboardingCompleted: completed } : null
      })),
      
      updatePreferences: (preferences) => set((state) => ({
        user: state.user 
          ? { 
              ...state.user, 
              preferences: { ...state.user.preferences, ...preferences } 
            } 
          : null
      })),
      
      addXp: (amount) => set((state) => ({
        user: state.user 
          ? { 
              ...state.user, 
              xp: state.user.xp + amount,
              level: Math.floor((state.user.xp + amount) / 200) + 1
            } 
          : null
      })),
      
      incrementStreak: () => set((state) => ({
        user: state.user 
          ? { ...state.user, streak: state.user.streak + 1 } 
          : null
      })),
    }),
    {
      name: 'redacaolab-auth',
    }
  )
);
