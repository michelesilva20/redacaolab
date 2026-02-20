import type { User, Role } from '../types';

export const mockUsers: User[] = [
  {
    id: 'user-admin-1',
    name: 'Admin Silva',
    email: 'admin@redacaolab.com',
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    xp: 5000,
    streak: 30,
    level: 25,
    badges: [
      { id: 'b1', name: 'Fundador', description: 'Membro desde o início', icon: '🏆', category: 'special', unlockedAt: '2024-01-01' }
    ],
    createdAt: '2024-01-01',
    onboardingCompleted: true,
    preferences: {
      targetExam: 'enem',
      currentLevel: 900,
      targetScore: 1000,
      weeklyGoal: 5,
      preferredDays: ['segunda', 'terca', 'quarta', 'quinta', 'sexta'],
    },
  },
  {
    id: 'user-prof-1',
    name: 'Prof. Maria Santos',
    email: 'maria@redacaolab.com',
    role: 'professor',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maria',
    xp: 8500,
    streak: 45,
    level: 42,
    badges: [
      { id: 'b2', name: 'Corretor Expert', description: '100 correções realizadas', icon: '✏️', category: 'essays', unlockedAt: '2024-03-15' }
    ],
    createdAt: '2024-01-10',
    onboardingCompleted: true,
    preferences: {
      targetExam: 'enem',
      currentLevel: 950,
      targetScore: 1000,
      weeklyGoal: 10,
      preferredDays: ['segunda', 'terca', 'quarta', 'quinta', 'sexta'],
    },
  },
  {
    id: 'user-prof-2',
    name: 'Prof. Carlos Lima',
    email: 'carlos@redacaolab.com',
    role: 'professor',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carlos',
    xp: 6200,
    streak: 28,
    level: 31,
    badges: [],
    createdAt: '2024-02-01',
    onboardingCompleted: true,
    preferences: {
      targetExam: 'concursos',
      currentLevel: 900,
      targetScore: 1000,
      weeklyGoal: 8,
      preferredDays: ['segunda', 'quarta', 'sexta'],
    },
  },
  {
    id: 'user-aluno-1',
    name: 'João Pedro',
    email: 'joao@email.com',
    role: 'aluno',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=joao',
    xp: 2400,
    streak: 7,
    level: 12,
    badges: [
      { id: 'b3', name: 'Primeira Redação', description: 'Enviou sua primeira redação', icon: '📝', category: 'essays', unlockedAt: '2024-06-01' },
      { id: 'b4', name: 'Streak de 7 dias', description: '7 dias seguidos de prática', icon: '🔥', category: 'streak', unlockedAt: '2024-06-15' },
    ],
    createdAt: '2024-05-20',
    onboardingCompleted: false,
    preferences: {
      targetExam: 'enem',
      currentLevel: 700,
      targetScore: 900,
      weeklyGoal: 3,
      preferredDays: ['segunda', 'quarta', 'sexta'],
    },
  },
  {
    id: 'user-aluno-2',
    name: 'Ana Clara',
    email: 'ana@email.com',
    role: 'aluno',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ana',
    xp: 4100,
    streak: 14,
    level: 20,
    badges: [
      { id: 'b5', name: 'C5 Perfeita', description: 'Nota máxima na competência 5', icon: '⭐', category: 'competency', unlockedAt: '2024-07-01' },
    ],
    createdAt: '2024-04-10',
    onboardingCompleted: true,
    preferences: {
      targetExam: 'unesp',
      currentLevel: 750,
      targetScore: 950,
      weeklyGoal: 4,
      preferredDays: ['terca', 'quinta', 'sabado'],
    },
  },
  {
    id: 'user-aluno-3',
    name: 'Lucas Mendes',
    email: 'lucas@email.com',
    role: 'aluno',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lucas',
    xp: 1800,
    streak: 3,
    level: 9,
    badges: [],
    createdAt: '2024-06-15',
    onboardingCompleted: true,
    preferences: {
      targetExam: 'concursos',
      currentLevel: 650,
      targetScore: 850,
      weeklyGoal: 2,
      preferredDays: ['segunda', 'sexta'],
    },
  },
];

export const getUserByRole = (role: Role): User => {
  return mockUsers.find((u) => u.role === role) || mockUsers[3];
};

export const getStudents = (): User[] => {
  return mockUsers.filter((u) => u.role === 'aluno');
};

export const getProfessors = (): User[] => {
  return mockUsers.filter((u) => u.role === 'professor');
};
