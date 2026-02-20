export type Role = 'admin' | 'professor' | 'aluno';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  xp: number;
  streak: number;
  level: number;
  badges: Badge[];
  createdAt: string;
  onboardingCompleted: boolean;
  preferences: UserPreferences;
}

export interface UserPreferences {
  targetExam: 'enem' | 'unesp' | 'concursos';
  currentLevel: number;
  targetScore: number;
  weeklyGoal: number;
  preferredDays: string[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  category: 'streak' | 'essays' | 'competency' | 'special';
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: number;
  level: 'iniciante' | 'intermediario' | 'avancado';
  category: 'enem' | 'unesp' | 'concursos';
  thumbnail: string;
  videoUrl: string;
  materials: Material[];
  checklist: string[];
  completedBy: string[];
  xpReward: number;
}

export interface Material {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'video';
  url: string;
}

export interface Theme {
  id: string;
  title: string;
  description: string;
  category: 'enem' | 'unesp' | 'concursos';
  axis: string;
  difficulty: 'facil' | 'medio' | 'dificil';
  repertoire: string[];
  checklist: string[];
  examples: string[];
  createdAt: string;
  isFeatured: boolean;
}

export interface Essay {
  id: string;
  userId: string;
  themeId: string;
  theme?: Theme;
  type: 'texto' | 'imagem';
  content?: string;
  imageUrl?: string;
  category: 'enem' | 'unesp' | 'concursos';
  status: 'rascunho' | 'enviada' | 'em_correcao' | 'corrigida';
  notes?: string;
  wordCount: number;
  createdAt: string;
  submittedAt?: string;
  correction?: Correction;
}

export interface Correction {
  id: string;
  essayId: string;
  professorId: string;
  competencies: Competency[];
  totalScore: number;
  generalFeedback: string;
  strengths: string[];
  improvements: string[];
  comments: Comment[];
  highlights: Highlight[];
  status: 'rascunho' | 'finalizada';
  createdAt: string;
  finishedAt?: string;
}

export interface Competency {
  id: 'C1' | 'C2' | 'C3' | 'C4' | 'C5';
  name: string;
  score: number;
  maxScore: number;
  feedback: string;
}

export interface Comment {
  id: string;
  text: string;
  startIndex?: number;
  endIndex?: number;
  category: 'gramatica' | 'coesao' | 'repertorio' | 'intervencao' | 'geral';
  createdAt: string;
}

export interface Highlight {
  id: string;
  startIndex: number;
  endIndex: number;
  category: 'gramatica' | 'coesao' | 'repertorio' | 'intervencao';
  commentId?: string;
}

export interface Class {
  id: string;
  name: string;
  description: string;
  professorId: string;
  studentIds: string[];
  createdAt: string;
}

export interface GamificationData {
  xp: number;
  level: number;
  streak: number;
  weeklyXp: number;
  weeklyGoal: number;
  badges: Badge[];
  missions: Mission[];
  recentAchievements: Achievement[];
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  progress: number;
  target: number;
  completed: boolean;
  type: 'daily' | 'weekly';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlockedAt: string;
  xpEarned: number;
}

export interface DashboardData {
  user: User;
  stats: DashboardStats;
  gamification: GamificationData;
  recentCorrections: Correction[];
  recommendedLesson?: Lesson;
  featuredTheme?: Theme;
  weeklyProgress: WeeklyProgress[];
  competencyScores: CompetencyScore[];
}

export interface DashboardStats {
  essaysSubmitted: number;
  essaysCorrected: number;
  averageScore: number;
  weeklyXp: number;
  streak: number;
}

export interface WeeklyProgress {
  day: string;
  essays: number;
  score: number;
}

export interface CompetencyScore {
  competency: string;
  score: number;
  maxScore: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'correction';
  read: boolean;
  createdAt: string;
  link?: string;
}
