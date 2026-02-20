import type { Theme } from '../types';

export const mockThemes: Theme[] = [
  {
    id: 'theme-1',
    title: 'O estigma associado às doenças mentais na sociedade brasileira',
    description: 'Discuta os desafios enfrentados por pessoas com transtornos mentais no Brasil e proponha formas de combater o preconceito.',
    category: 'enem',
    axis: 'Saúde e Sociedade',
    difficulty: 'medio',
    repertoire: [
      'Foucault - "História da Loucura"',
      'Reforma Psiquiátrica Brasileira (Lei 10.216/2001)',
      'Janeiro Branco - campanha de conscientização',
      'Dados da OMS sobre saúde mental',
    ],
    checklist: [
      'Definir estigma e suas consequências',
      'Apresentar dados sobre saúde mental no Brasil',
      'Discutir impactos sociais e econômicos',
      'Propor intervenção envolvendo educação e saúde',
    ],
    examples: [
      'O filme "Bicho de Sete Cabeças" retrata o estigma...',
      'Segundo a OMS, o Brasil é o país mais ansioso do mundo...',
    ],
    createdAt: '2024-06-01',
    isFeatured: true,
  },
  {
    id: 'theme-2',
    title: 'Os desafios para a valorização de comunidades tradicionais no Brasil',
    description: 'Analise os obstáculos enfrentados por comunidades quilombolas, indígenas e outras comunidades tradicionais.',
    category: 'enem',
    axis: 'Cidadania e Diversidade',
    difficulty: 'dificil',
    repertoire: [
      'Constituição Federal - Art. 215 e 216',
      'Darcy Ribeiro - "O Povo Brasileiro"',
      'Decreto 6.040/2007 (Política Nacional de Povos e Comunidades Tradicionais)',
      'Ailton Krenak - pensamento indígena contemporâneo',
    ],
    checklist: [
      'Conceituar comunidades tradicionais',
      'Apresentar desafios territoriais e culturais',
      'Discutir papel do Estado',
      'Propor políticas de valorização',
    ],
    examples: [],
    createdAt: '2024-05-15',
    isFeatured: false,
  },
  {
    id: 'theme-3',
    title: 'A persistência da violência contra a mulher na sociedade brasileira',
    description: 'Discuta as causas e consequências da violência de gênero e proponha soluções efetivas.',
    category: 'enem',
    axis: 'Cidadania e Direitos Humanos',
    difficulty: 'medio',
    repertoire: [
      'Lei Maria da Penha (Lei 11.340/2006)',
      'Simone de Beauvoir - "O Segundo Sexo"',
      'Dados do Fórum Brasileiro de Segurança Pública',
      'Feminicídio - Lei 13.104/2015',
    ],
    checklist: [
      'Contextualizar a violência de gênero',
      'Apresentar dados estatísticos',
      'Analisar causas estruturais',
      'Propor intervenção multisetorial',
    ],
    examples: [],
    createdAt: '2024-05-20',
    isFeatured: false,
  },
  {
    id: 'theme-4',
    title: 'Os impactos da inteligência artificial no mercado de trabalho',
    description: 'Analise as transformações que a IA está provocando nas relações de trabalho e proponha formas de adaptação.',
    category: 'enem',
    axis: 'Tecnologia e Trabalho',
    difficulty: 'medio',
    repertoire: [
      'Yuval Harari - "21 Lições para o Século 21"',
      'Klaus Schwab - Quarta Revolução Industrial',
      'Relatório do Fórum Econômico Mundial',
      'Conceito de "desemprego tecnológico" de Keynes',
    ],
    checklist: [
      'Definir inteligência artificial',
      'Apresentar impactos positivos e negativos',
      'Discutir desigualdade de acesso',
      'Propor requalificação profissional',
    ],
    examples: [],
    createdAt: '2024-06-10',
    isFeatured: true,
  },
  {
    id: 'theme-5',
    title: 'A importância da educação financeira desde a infância',
    description: 'Discuta a relevância de incluir educação financeira na formação de crianças e jovens.',
    category: 'enem',
    axis: 'Educação',
    difficulty: 'facil',
    repertoire: [
      'BNCC e educação financeira',
      'Pesquisa S&P Global sobre alfabetização financeira',
      'Robert Kiyosaki - conceitos de educação financeira',
      'Programa de Educação Financeira nas Escolas (ENEF)',
    ],
    checklist: [
      'Definir educação financeira',
      'Apresentar cenário brasileiro',
      'Discutir benefícios a longo prazo',
      'Propor implementação nas escolas',
    ],
    examples: [],
    createdAt: '2024-06-05',
    isFeatured: false,
  },
  {
    id: 'theme-6',
    title: 'O problema da invisibilidade da população em situação de rua',
    description: 'Analise os desafios enfrentados por pessoas em situação de rua e proponha políticas de acolhimento.',
    category: 'enem',
    axis: 'Cidadania e Sociedade',
    difficulty: 'dificil',
    repertoire: [
      'Política Nacional para População em Situação de Rua (Decreto 7.053/2009)',
      'Pesquisa do IPEA sobre população de rua',
      'Conceito de "invisibilidade social"',
      'Movimento Nacional da População de Rua',
    ],
    checklist: [
      'Contextualizar a situação de rua no Brasil',
      'Discutir causas sociais e econômicas',
      'Analisar políticas públicas existentes',
      'Propor intervenção integrada',
    ],
    examples: [],
    createdAt: '2024-05-25',
    isFeatured: false,
  },
  {
    id: 'theme-7',
    title: 'Desafios para a mobilidade urbana sustentável',
    description: 'Discuta os problemas de mobilidade nas cidades brasileiras e proponha soluções sustentáveis.',
    category: 'unesp',
    axis: 'Meio Ambiente e Urbanismo',
    difficulty: 'medio',
    repertoire: [
      'Política Nacional de Mobilidade Urbana (Lei 12.587/2012)',
      'Conceito de cidades inteligentes',
      'Jan Gehl - urbanismo humanizado',
      'Dados sobre emissões de CO2 pelo transporte',
    ],
    checklist: [
      'Apresentar panorama da mobilidade urbana',
      'Analisar impactos ambientais',
      'Discutir alternativas sustentáveis',
      'Propor integração de modais',
    ],
    examples: [],
    createdAt: '2024-06-08',
    isFeatured: false,
  },
  {
    id: 'theme-8',
    title: 'A ética no serviço público brasileiro',
    description: 'Analise a importância da conduta ética no serviço público e os mecanismos de controle.',
    category: 'concursos',
    axis: 'Administração Pública',
    difficulty: 'medio',
    repertoire: [
      'Código de Ética do Servidor Público (Decreto 1.171/1994)',
      'Lei de Improbidade Administrativa',
      'Princípios constitucionais da administração (LIMPE)',
      'Compliance no setor público',
    ],
    checklist: [
      'Definir ética no serviço público',
      'Apresentar marco legal',
      'Discutir mecanismos de controle',
      'Analisar casos práticos',
    ],
    examples: [],
    createdAt: '2024-06-12',
    isFeatured: false,
  },
];

export const getThemeById = (id: string): Theme | undefined => {
  return mockThemes.find((t) => t.id === id);
};

export const getThemesByCategory = (category: string): Theme[] => {
  if (category === 'all') return mockThemes;
  return mockThemes.filter((t) => t.category === category);
};

export const getFeaturedTheme = (): Theme => {
  return mockThemes.find((t) => t.isFeatured) || mockThemes[0];
};
