import type { User, Role, Lesson, Theme, Essay, Correction, DashboardData, Class, Notification, GamificationData } from '../types';
import { mockUsers, getUserByRole, getStudents, getProfessors } from '../mocks/users';
import { mockLessons, getLessonById, getLessonsByCategory } from '../mocks/lessons';
import { mockThemes, getThemeById, getThemesByCategory, getFeaturedTheme } from '../mocks/themes';
import { mockEssays, getEssayById, getEssaysByUser, getEssaysForCorrection, getCorrectedEssays } from '../mocks/essays';
import { getGamificationData, mockMissions } from '../mocks/gamification';
import { mockClasses, getClassesByProfessor, getClassesByStudent, mockNotifications } from '../mocks/classes';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const randomDelay = () => delay(300 + Math.random() * 500);

export const fakeApi = {
  auth: {
    login: async (email: string, _password: string, role?: Role): Promise<User> => {
      await randomDelay();
      if (role) {
        return getUserByRole(role);
      }
      const user = mockUsers.find((u) => u.email === email);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }
      return user;
    },
    
    loginAsRole: async (role: Role): Promise<User> => {
      await randomDelay();
      return getUserByRole(role);
    },
  },
  
  users: {
    getAll: async (): Promise<User[]> => {
      await randomDelay();
      return mockUsers;
    },
    
    getById: async (id: string): Promise<User | undefined> => {
      await randomDelay();
      return mockUsers.find((u) => u.id === id);
    },
    
    getStudents: async (): Promise<User[]> => {
      await randomDelay();
      return getStudents();
    },
    
    getProfessors: async (): Promise<User[]> => {
      await randomDelay();
      return getProfessors();
    },
  },
  
  lessons: {
    getAll: async (category?: string): Promise<Lesson[]> => {
      await randomDelay();
      return category ? getLessonsByCategory(category) : mockLessons;
    },
    
    getById: async (id: string): Promise<Lesson | undefined> => {
      await randomDelay();
      return getLessonById(id);
    },
    
    markComplete: async (lessonId: string, userId: string): Promise<void> => {
      await randomDelay();
      const lesson = getLessonById(lessonId);
      if (lesson && !lesson.completedBy.includes(userId)) {
        lesson.completedBy.push(userId);
      }
    },
  },
  
  themes: {
    getAll: async (category?: string): Promise<Theme[]> => {
      await randomDelay();
      return category ? getThemesByCategory(category) : mockThemes;
    },
    
    getById: async (id: string): Promise<Theme | undefined> => {
      await randomDelay();
      return getThemeById(id);
    },
    
    getFeatured: async (): Promise<Theme> => {
      await randomDelay();
      return getFeaturedTheme();
    },
  },
  
  essays: {
    getAll: async (): Promise<Essay[]> => {
      await randomDelay();
      return mockEssays;
    },
    
    getById: async (id: string): Promise<Essay | undefined> => {
      await randomDelay();
      const essay = getEssayById(id);
      if (essay && essay.themeId) {
        essay.theme = getThemeById(essay.themeId);
      }
      return essay;
    },
    
    getByUser: async (userId: string): Promise<Essay[]> => {
      await randomDelay();
      return getEssaysByUser(userId);
    },
    
    getForCorrection: async (): Promise<Essay[]> => {
      await randomDelay();
      const essays = getEssaysForCorrection();
      return essays.map((e) => ({ ...e, theme: getThemeById(e.themeId) }));
    },
    
    getCorrected: async (): Promise<Essay[]> => {
      await randomDelay();
      return getCorrectedEssays();
    },
    
    create: async (data: Partial<Essay>): Promise<Essay> => {
      await randomDelay();
      const newEssay: Essay = {
        id: `essay-${Date.now()}`,
        userId: data.userId || 'user-aluno-1',
        themeId: data.themeId || 'theme-1',
        type: data.type || 'texto',
        content: data.content,
        imageUrl: data.imageUrl,
        category: data.category || 'enem',
        status: 'enviada',
        notes: data.notes,
        wordCount: data.content?.split(/\s+/).length || 0,
        createdAt: new Date().toISOString(),
        submittedAt: new Date().toISOString(),
      };
      mockEssays.push(newEssay);
      return newEssay;
    },
    
    saveDraft: async (data: Partial<Essay>): Promise<Essay> => {
      await randomDelay();
      const existing = data.id ? getEssayById(data.id) : null;
      if (existing) {
        Object.assign(existing, { ...data, status: 'rascunho' });
        return existing;
      }
      const newEssay: Essay = {
        id: `essay-${Date.now()}`,
        userId: data.userId || 'user-aluno-1',
        themeId: data.themeId || 'theme-1',
        type: data.type || 'texto',
        content: data.content,
        category: data.category || 'enem',
        status: 'rascunho',
        wordCount: data.content?.split(/\s+/).length || 0,
        createdAt: new Date().toISOString(),
      };
      mockEssays.push(newEssay);
      return newEssay;
    },
  },
  
  corrections: {
    getByEssay: async (essayId: string): Promise<Correction | undefined> => {
      await randomDelay();
      const essay = getEssayById(essayId);
      return essay?.correction;
    },
    
    submit: async (essayId: string, correction: Partial<Correction>): Promise<Correction> => {
      await randomDelay();
      const essay = getEssayById(essayId);
      if (!essay) throw new Error('Redação não encontrada');
      
      const newCorrection: Correction = {
        id: `corr-${Date.now()}`,
        essayId,
        professorId: correction.professorId || 'user-prof-1',
        competencies: correction.competencies || [],
        totalScore: correction.totalScore || 0,
        generalFeedback: correction.generalFeedback || '',
        strengths: correction.strengths || [],
        improvements: correction.improvements || [],
        comments: correction.comments || [],
        highlights: correction.highlights || [],
        status: correction.status || 'rascunho',
        createdAt: new Date().toISOString(),
        finishedAt: correction.status === 'finalizada' ? new Date().toISOString() : undefined,
      };
      
      essay.correction = newCorrection;
      essay.status = correction.status === 'finalizada' ? 'corrigida' : 'em_correcao';
      
      return newCorrection;
    },
  },
  
  classes: {
    getAll: async (): Promise<Class[]> => {
      await randomDelay();
      return mockClasses;
    },
    
    getByProfessor: async (professorId: string): Promise<Class[]> => {
      await randomDelay();
      return getClassesByProfessor(professorId);
    },
    
    getByStudent: async (studentId: string): Promise<Class[]> => {
      await randomDelay();
      return getClassesByStudent(studentId);
    },
    
    create: async (data: Partial<Class>): Promise<Class> => {
      await randomDelay();
      const newClass: Class = {
        id: `class-${Date.now()}`,
        name: data.name || 'Nova Turma',
        description: data.description || '',
        professorId: data.professorId || 'user-prof-1',
        studentIds: data.studentIds || [],
        createdAt: new Date().toISOString(),
      };
      mockClasses.push(newClass);
      return newClass;
    },
  },
  
  notifications: {
    getAll: async (): Promise<Notification[]> => {
      await randomDelay();
      return mockNotifications;
    },
    
    markAsRead: async (id: string): Promise<void> => {
      await randomDelay();
      const notif = mockNotifications.find((n) => n.id === id);
      if (notif) notif.read = true;
    },
  },
  
  dashboard: {
    getData: async (role: Role, userId: string): Promise<DashboardData> => {
      await randomDelay();
      const user = getUserByRole(role);
      const gamification = getGamificationData();
      const essays = getEssaysByUser(userId);
      const correctedEssays = essays.filter((e) => e.status === 'corrigida');
      
      const avgScore = correctedEssays.length > 0
        ? correctedEssays.reduce((sum, e) => sum + (e.correction?.totalScore || 0), 0) / correctedEssays.length
        : 0;
      
      return {
        user,
        stats: {
          essaysSubmitted: essays.filter((e) => e.status !== 'rascunho').length,
          essaysCorrected: correctedEssays.length,
          averageScore: Math.round(avgScore),
          weeklyXp: gamification.weeklyXp,
          streak: user.streak,
        },
        gamification,
        recentCorrections: correctedEssays.slice(0, 3).map((e) => e.correction!).filter(Boolean),
        recommendedLesson: mockLessons.find((l) => !l.completedBy.includes(userId)),
        featuredTheme: getFeaturedTheme(),
        weeklyProgress: [
          { day: 'Seg', essays: 1, score: 780 },
          { day: 'Ter', essays: 0, score: 0 },
          { day: 'Qua', essays: 1, score: 820 },
          { day: 'Qui', essays: 1, score: 750 },
          { day: 'Sex', essays: 0, score: 0 },
          { day: 'Sáb', essays: 1, score: 800 },
          { day: 'Dom', essays: 0, score: 0 },
        ],
        competencyScores: [
          { competency: 'C1', score: 160, maxScore: 200 },
          { competency: 'C2', score: 180, maxScore: 200 },
          { competency: 'C3', score: 140, maxScore: 200 },
          { competency: 'C4', score: 160, maxScore: 200 },
          { competency: 'C5', score: 180, maxScore: 200 },
        ],
      };
    },
    
    getGamification: async (): Promise<GamificationData> => {
      await randomDelay();
      return getGamificationData();
    },
  },
};

export default fakeApi;
