import type { Class, Notification } from '../types';

export const mockClasses: Class[] = [
  {
    id: 'class-1',
    name: 'Turma ENEM 2024 - Manhã',
    description: 'Turma intensiva para o ENEM 2024, aulas pela manhã.',
    professorId: 'user-prof-1',
    studentIds: ['user-aluno-1', 'user-aluno-2'],
    createdAt: '2024-03-01',
  },
  {
    id: 'class-2',
    name: 'Turma ENEM 2024 - Tarde',
    description: 'Turma intensiva para o ENEM 2024, aulas à tarde.',
    professorId: 'user-prof-1',
    studentIds: ['user-aluno-3'],
    createdAt: '2024-03-01',
  },
  {
    id: 'class-3',
    name: 'Concursos - Técnico Bancário',
    description: 'Preparação para concursos bancários.',
    professorId: 'user-prof-2',
    studentIds: ['user-aluno-3'],
    createdAt: '2024-04-15',
  },
  {
    id: 'class-4',
    name: 'UNESP 2024',
    description: 'Preparação específica para o vestibular UNESP.',
    professorId: 'user-prof-2',
    studentIds: ['user-aluno-2'],
    createdAt: '2024-05-01',
  },
];

export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    title: 'Correção disponível!',
    message: 'Sua redação sobre "Estigma e doenças mentais" foi corrigida.',
    type: 'correction',
    read: false,
    createdAt: '2024-06-20T11:00:00Z',
    link: '/app/feedback/essay-1',
  },
  {
    id: 'notif-2',
    title: 'Novo tema disponível',
    message: 'Confira o tema da semana: "Impactos da IA no trabalho"',
    type: 'info',
    read: false,
    createdAt: '2024-06-25T08:00:00Z',
    link: '/app/temas/theme-4',
  },
  {
    id: 'notif-3',
    title: 'Meta alcançada! 🎉',
    message: 'Você completou o streak de 7 dias! Continue assim!',
    type: 'success',
    read: true,
    createdAt: '2024-06-15T09:00:00Z',
  },
  {
    id: 'notif-4',
    title: 'Nova aula disponível',
    message: 'Assista: "Competência 5: Proposta de Intervenção"',
    type: 'info',
    read: true,
    createdAt: '2024-06-10T14:00:00Z',
    link: '/app/aulas/lesson-6',
  },
];

export const getClassById = (id: string): Class | undefined => {
  return mockClasses.find((c) => c.id === id);
};

export const getClassesByProfessor = (professorId: string): Class[] => {
  return mockClasses.filter((c) => c.professorId === professorId);
};

export const getClassesByStudent = (studentId: string): Class[] => {
  return mockClasses.filter((c) => c.studentIds.includes(studentId));
};

export const getUnreadNotifications = (): Notification[] => {
  return mockNotifications.filter((n) => !n.read);
};
