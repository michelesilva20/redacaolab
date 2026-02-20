import type { GamificationData, Badge, Mission, Achievement } from '../types';

export const allBadges: Badge[] = [
  { id: 'badge-1', name: 'Primeira Redação', description: 'Enviou sua primeira redação', icon: '📝', category: 'essays' },
  { id: 'badge-2', name: 'Streak de 7 dias', description: '7 dias seguidos de prática', icon: '🔥', category: 'streak' },
  { id: 'badge-3', name: 'Streak de 30 dias', description: '30 dias seguidos de prática', icon: '⚡', category: 'streak' },
  { id: 'badge-4', name: '10 Redações', description: 'Enviou 10 redações', icon: '🎯', category: 'essays' },
  { id: 'badge-5', name: '50 Redações', description: 'Enviou 50 redações', icon: '🏆', category: 'essays' },
  { id: 'badge-6', name: 'C1 Perfeita', description: 'Nota máxima na competência 1', icon: '✨', category: 'competency' },
  { id: 'badge-7', name: 'C2 Perfeita', description: 'Nota máxima na competência 2', icon: '💡', category: 'competency' },
  { id: 'badge-8', name: 'C3 Perfeita', description: 'Nota máxima na competência 3', icon: '🧠', category: 'competency' },
  { id: 'badge-9', name: 'C4 Perfeita', description: 'Nota máxima na competência 4', icon: '🔗', category: 'competency' },
  { id: 'badge-10', name: 'C5 Perfeita', description: 'Nota máxima na competência 5', icon: '⭐', category: 'competency' },
  { id: 'badge-11', name: 'Nota 1000', description: 'Alcançou a nota máxima', icon: '👑', category: 'special' },
  { id: 'badge-12', name: 'Maratonista', description: '3 redações em uma semana', icon: '🏃', category: 'essays' },
  { id: 'badge-13', name: 'Estudante Dedicado', description: 'Completou todas as aulas', icon: '📚', category: 'special' },
  { id: 'badge-14', name: 'Early Bird', description: 'Membro desde o início', icon: '🌅', category: 'special' },
];

export const mockMissions: Mission[] = [
  {
    id: 'mission-1',
    title: 'Assistir uma aula',
    description: 'Complete qualquer aula da plataforma',
    xpReward: 30,
    progress: 0,
    target: 1,
    completed: false,
    type: 'daily',
  },
  {
    id: 'mission-2',
    title: 'Escrever uma redação',
    description: 'Envie uma redação para correção',
    xpReward: 50,
    progress: 0,
    target: 1,
    completed: false,
    type: 'daily',
  },
  {
    id: 'mission-3',
    title: 'Revisar correção',
    description: 'Veja o feedback da sua última redação',
    xpReward: 20,
    progress: 1,
    target: 1,
    completed: true,
    type: 'daily',
  },
  {
    id: 'mission-4',
    title: 'Meta semanal',
    description: 'Envie 3 redações esta semana',
    xpReward: 100,
    progress: 2,
    target: 3,
    completed: false,
    type: 'weekly',
  },
  {
    id: 'mission-5',
    title: 'Explorador de temas',
    description: 'Explore 5 temas diferentes',
    xpReward: 40,
    progress: 3,
    target: 5,
    completed: false,
    type: 'weekly',
  },
];

export const mockAchievements: Achievement[] = [
  {
    id: 'ach-1',
    title: 'Primeira Redação!',
    description: 'Você enviou sua primeira redação. Continue assim!',
    unlockedAt: '2024-06-01T10:00:00Z',
    xpEarned: 50,
  },
  {
    id: 'ach-2',
    title: 'Streak de 7 dias!',
    description: 'Você está praticando há 7 dias seguidos. Incrível!',
    unlockedAt: '2024-06-15T09:00:00Z',
    xpEarned: 100,
  },
];

export const getGamificationData = (): GamificationData => ({
  xp: 2400,
  level: 12,
  streak: 7,
  weeklyXp: 320,
  weeklyGoal: 500,
  badges: [allBadges[0], allBadges[1]],
  missions: mockMissions,
  recentAchievements: mockAchievements,
});

export const getXpForLevel = (level: number): number => {
  return level * 200;
};

export const getLevelFromXp = (xp: number): number => {
  return Math.floor(xp / 200) + 1;
};

export const getXpProgress = (xp: number): { current: number; needed: number; percentage: number } => {
  const level = getLevelFromXp(xp);
  const currentLevelXp = (level - 1) * 200;
  const nextLevelXp = level * 200;
  const current = xp - currentLevelXp;
  const needed = nextLevelXp - currentLevelXp;
  return {
    current,
    needed,
    percentage: (current / needed) * 100,
  };
};
