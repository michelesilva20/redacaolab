import type { User, Role, Lesson, Theme, Essay, Correction, DashboardData, Class, Notification, GamificationData } from '../types';
import { mockUsers, getUserByRole, getStudents, getProfessors } from '../mocks/users';
import { cloneDemoUserByRole } from '../lib/demoAuth';
import { mockLessons, getLessonById, getLessonsByCategory } from '../mocks/lessons';
import { mockThemes, getThemeById, getThemesByCategory, getFeaturedTheme } from '../mocks/themes';
import { getGamificationData, mockMissions } from '../mocks/gamification';
import { mockClasses, getClassesByProfessor, getClassesByStudent, mockNotifications } from '../mocks/classes';
import {
  applyCorrectionInSession,
  createSessionImageEssay,
  getMergedEssayById,
  listMergedCorrectedEssays,
  listMergedEssays,
  listMergedEssaysByUser,
  listMergedEssaysForCorrection,
  saveTextDraft,
  submitTextEssay,
} from '../lib/essayRepository';
import type { EssayTimerSnapshot } from '../lib/essayTimer';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const randomDelay = () => delay(300 + Math.random() * 500);

export const fakeApi = {
  auth: {
    login: async (email: string, _password: string, role?: Role): Promise<User> => {
      await randomDelay();
      if (role) {
        return cloneDemoUserByRole(role);
      }
      const user = mockUsers.find((u) => u.email === email);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }
      return structuredClone(user);
    },
    
    loginAsRole: async (role: Role): Promise<User> => {
      await randomDelay();
      return cloneDemoUserByRole(role);
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
      return listMergedEssays();
    },
    
    getById: async (id: string): Promise<Essay | undefined> => {
      await randomDelay();
      return getMergedEssayById(id);
    },
    
    getByUser: async (userId: string): Promise<Essay[]> => {
      await randomDelay();
      return listMergedEssaysByUser(userId);
    },
    
    getForCorrection: async (): Promise<Essay[]> => {
      await randomDelay();
      return listMergedEssaysForCorrection();
    },
    
    getCorrected: async (): Promise<Essay[]> => {
      await randomDelay();
      return listMergedCorrectedEssays();
    },

    saveDraft: async (data: {
      actorId: string;
      id?: string;
      themeId: string;
      category: Essay['category'];
      content?: string;
      notes?: string;
      wordCount?: number;
      timer?: EssayTimerSnapshot;
    }): Promise<Essay> => {
      await randomDelay();
      return saveTextDraft(data);
    },

    submit: async (data: {
      actorId: string;
      id?: string;
      themeId: string;
      category: Essay['category'];
      content?: string;
      notes?: string;
      wordCount?: number;
      timer?: EssayTimerSnapshot;
    }): Promise<Essay> => {
      await randomDelay();
      return submitTextEssay(data);
    },
    
    create: async (data: Partial<Essay>): Promise<Essay> => {
      await randomDelay();
      if (data.type === 'imagem') {
        return createSessionImageEssay({
          actorId: data.userId || '',
          themeId: data.themeId,
          imageUrl: data.imageUrl,
          category: data.category,
          notes: data.notes,
        });
      }

      return submitTextEssay({
        actorId: data.userId || '',
        id: data.id,
        themeId: data.themeId || '',
        category: data.category || 'enem',
        content: data.content,
        notes: data.notes,
        wordCount: data.wordCount,
      });
    },
  },
  
  corrections: {
    getByEssay: async (essayId: string): Promise<Correction | undefined> => {
      await randomDelay();
      return getMergedEssayById(essayId)?.correction;
    },
    
    submit: async (essayId: string, correction: Partial<Correction>): Promise<Correction> => {
      await randomDelay();
      if (!getMergedEssayById(essayId)) {
        throw new Error('Redação não encontrada');
      }
      
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

      applyCorrectionInSession(
        essayId,
        newCorrection,
        correction.status === 'finalizada' ? 'corrigida' : 'em_correcao'
      );
      
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
      const essays = listMergedEssaysByUser(userId);
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
