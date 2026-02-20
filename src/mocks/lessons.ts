import type { Lesson } from '../types';

export const mockLessons: Lesson[] = [
  {
    id: 'lesson-1',
    title: 'Introdução à Redação do ENEM',
    description: 'Entenda a estrutura da prova e as 5 competências avaliadas. Aprenda como os avaliadores analisam sua redação e descubra as chaves para alcançar a nota 1000.',
    duration: 25,
    level: 'iniciante',
    category: 'enem',
    thumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=225&fit=crop',
    videoUrl: 'https://example.com/video1.mp4',
    materials: [
      { id: 'm1', name: 'Guia das Competências ENEM', type: 'pdf', url: '#' },
      { id: 'm2', name: 'Checklist do Avaliador', type: 'pdf', url: '#' },
    ],
    checklist: [
      'Entender as 5 competências',
      'Conhecer a estrutura dissertativo-argumentativa',
      'Identificar os critérios de avaliação',
      'Reconhecer redações nota 1000',
    ],
    completedBy: ['user-aluno-1', 'user-aluno-2'],
    xpReward: 50,
  },
  {
    id: 'lesson-2',
    title: 'Competência 1: Domínio da Norma Culta',
    description: 'Aprenda a evitar os erros mais comuns de gramática, ortografia e pontuação que podem derrubar sua nota na C1.',
    duration: 35,
    level: 'iniciante',
    category: 'enem',
    thumbnail: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=225&fit=crop',
    videoUrl: 'https://example.com/video2.mp4',
    materials: [
      { id: 'm3', name: 'Lista de Erros Frequentes', type: 'pdf', url: '#' },
    ],
    checklist: [
      'Revisar concordância verbal e nominal',
      'Dominar regência verbal',
      'Evitar erros de crase',
      'Pontuar corretamente',
    ],
    completedBy: ['user-aluno-2'],
    xpReward: 60,
  },
  {
    id: 'lesson-3',
    title: 'Competência 2: Compreensão do Tema',
    description: 'Saiba como interpretar a proposta de redação corretamente e garantir que você está desenvolvendo o tema de forma adequada.',
    duration: 30,
    level: 'intermediario',
    category: 'enem',
    thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=225&fit=crop',
    videoUrl: 'https://example.com/video3.mp4',
    materials: [
      { id: 'm4', name: 'Análise de Temas Anteriores', type: 'pdf', url: '#' },
    ],
    checklist: [
      'Identificar o tema central',
      'Reconhecer os recortes temáticos',
      'Evitar tangenciamento',
      'Trabalhar todas as partes do tema',
    ],
    completedBy: [],
    xpReward: 70,
  },
  {
    id: 'lesson-4',
    title: 'Competência 3: Argumentação',
    description: 'Aprenda técnicas para construir argumentos sólidos e convincentes usando dados, exemplos e referências.',
    duration: 45,
    level: 'intermediario',
    category: 'enem',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=225&fit=crop',
    videoUrl: 'https://example.com/video4.mp4',
    materials: [
      { id: 'm5', name: 'Banco de Repertórios', type: 'pdf', url: '#' },
      { id: 'm6', name: 'Estruturas Argumentativas', type: 'doc', url: '#' },
    ],
    checklist: [
      'Construir argumentos com dados',
      'Usar repertório sociocultural',
      'Conectar argumentos ao tema',
      'Evitar senso comum',
    ],
    completedBy: [],
    xpReward: 80,
  },
  {
    id: 'lesson-5',
    title: 'Competência 4: Coesão Textual',
    description: 'Domine os conectivos e mecanismos de coesão para dar fluidez ao seu texto.',
    duration: 40,
    level: 'intermediario',
    category: 'enem',
    thumbnail: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=400&h=225&fit=crop',
    videoUrl: 'https://example.com/video5.mp4',
    materials: [
      { id: 'm7', name: 'Lista de Conectivos', type: 'pdf', url: '#' },
    ],
    checklist: [
      'Usar conectivos adequadamente',
      'Criar coesão entre parágrafos',
      'Utilizar referenciação',
      'Evitar repetições',
    ],
    completedBy: [],
    xpReward: 75,
  },
  {
    id: 'lesson-6',
    title: 'Competência 5: Proposta de Intervenção',
    description: 'Aprenda a elaborar propostas de intervenção completas, respeitando os direitos humanos e apresentando soluções viáveis.',
    duration: 50,
    level: 'avancado',
    category: 'enem',
    thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=225&fit=crop',
    videoUrl: 'https://example.com/video6.mp4',
    materials: [
      { id: 'm8', name: 'Modelo de Proposta Completa', type: 'pdf', url: '#' },
      { id: 'm9', name: 'Exemplos de C5 Nota Máxima', type: 'pdf', url: '#' },
    ],
    checklist: [
      'Incluir agente, ação e modo',
      'Detalhar a proposta',
      'Respeitar direitos humanos',
      'Conectar com a argumentação',
    ],
    completedBy: [],
    xpReward: 90,
  },
  {
    id: 'lesson-7',
    title: 'Redação UNESP: Características e Diferenças',
    description: 'Conheça as especificidades da redação UNESP e como se preparar para ela.',
    duration: 35,
    level: 'intermediario',
    category: 'unesp',
    thumbnail: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=225&fit=crop',
    videoUrl: 'https://example.com/video7.mp4',
    materials: [
      { id: 'm10', name: 'Manual UNESP', type: 'pdf', url: '#' },
    ],
    checklist: [
      'Entender critérios UNESP',
      'Analisar coletâneas',
      'Desenvolver gêneros textuais',
      'Praticar síntese de textos',
    ],
    completedBy: [],
    xpReward: 70,
  },
  {
    id: 'lesson-8',
    title: 'Redação para Concursos Públicos',
    description: 'Aprenda as particularidades das redações em concursos e como adaptar sua escrita.',
    duration: 40,
    level: 'avancado',
    category: 'concursos',
    thumbnail: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=225&fit=crop',
    videoUrl: 'https://example.com/video8.mp4',
    materials: [
      { id: 'm11', name: 'Guia de Redação para Concursos', type: 'pdf', url: '#' },
    ],
    checklist: [
      'Conhecer bancas principais',
      'Adaptar linguagem formal',
      'Respeitar limites de linhas',
      'Treinar dissertações técnicas',
    ],
    completedBy: [],
    xpReward: 85,
  },
];

export const getLessonById = (id: string): Lesson | undefined => {
  return mockLessons.find((l) => l.id === id);
};

export const getLessonsByCategory = (category: string): Lesson[] => {
  if (category === 'all') return mockLessons;
  return mockLessons.filter((l) => l.category === category);
};
