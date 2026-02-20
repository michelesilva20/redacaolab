import type { Essay, Correction, Competency, Comment, Highlight } from '../types';

const competencies: Competency[] = [
  { id: 'C1', name: 'Domínio da norma culta', score: 160, maxScore: 200, feedback: 'Bom domínio da língua, com poucos desvios gramaticais.' },
  { id: 'C2', name: 'Compreensão do tema', score: 180, maxScore: 200, feedback: 'Excelente compreensão e desenvolvimento do tema proposto.' },
  { id: 'C3', name: 'Argumentação', score: 140, maxScore: 200, feedback: 'Argumentação consistente, mas pode aprofundar o repertório.' },
  { id: 'C4', name: 'Coesão textual', score: 160, maxScore: 200, feedback: 'Boa articulação entre as partes do texto.' },
  { id: 'C5', name: 'Proposta de intervenção', score: 180, maxScore: 200, feedback: 'Proposta completa com todos os elementos necessários.' },
];

const comments: Comment[] = [
  { id: 'c1', text: 'Excelente introdução contextualizada!', category: 'geral', createdAt: '2024-06-20T10:00:00Z' },
  { id: 'c2', text: 'Cuidado com a concordância verbal aqui.', startIndex: 150, endIndex: 165, category: 'gramatica', createdAt: '2024-06-20T10:05:00Z' },
  { id: 'c3', text: 'Bom uso de repertório, mas poderia aprofundar.', startIndex: 300, endIndex: 400, category: 'repertorio', createdAt: '2024-06-20T10:10:00Z' },
  { id: 'c4', text: 'Conectivo inadequado. Prefira "ademais" ou "além disso".', startIndex: 500, endIndex: 515, category: 'coesao', createdAt: '2024-06-20T10:15:00Z' },
];

const highlights: Highlight[] = [
  { id: 'h1', startIndex: 150, endIndex: 165, category: 'gramatica', commentId: 'c2' },
  { id: 'h2', startIndex: 300, endIndex: 400, category: 'repertorio', commentId: 'c3' },
  { id: 'h3', startIndex: 500, endIndex: 515, category: 'coesao', commentId: 'c4' },
];

export const mockEssays: Essay[] = [
  {
    id: 'essay-1',
    userId: 'user-aluno-1',
    themeId: 'theme-1',
    type: 'texto',
    content: `O estigma associado às doenças mentais representa um dos maiores desafios para a saúde pública no Brasil contemporâneo. Historicamente, pessoas com transtornos mentais foram marginalizadas e excluídas da sociedade, uma realidade que, embora tenha evoluído com a Reforma Psiquiátrica, ainda persiste em diversas formas de discriminação cotidiana.

Em primeiro lugar, é fundamental compreender as raízes históricas desse preconceito. Conforme analisou Michel Foucault em "História da Loucura", a sociedade ocidental construiu uma visão patologizante e excludente da loucura, associando-a à periculosidade e à incapacidade. Essa herança cultural se manifesta hoje na resistência de muitas famílias em buscar ajuda profissional, no medo do julgamento social e na própria autoestigmatização dos pacientes.

Além disso, os impactos desse estigma são profundamente prejudiciais tanto para os indivíduos quanto para a coletividade. Dados da Organização Mundial da Saúde indicam que o Brasil é o país com maior prevalência de ansiedade no mundo, mas grande parte da população afetada não busca tratamento por vergonha ou desinformação. Esse cenário resulta em agravamento dos quadros clínicos, perda de produtividade econômica e sobrecarga do sistema de saúde.

Portanto, para combater o estigma associado às doenças mentais, é necessária uma intervenção multissetorial. O Ministério da Saúde, em parceria com o Ministério da Educação, deve implementar programas de educação emocional nas escolas, desde o ensino fundamental, utilizando materiais didáticos que normalizem a busca por ajuda psicológica. Essa iniciativa, inspirada no Janeiro Branco, deve incluir capacitação de professores e campanhas de conscientização para pais, visando desconstruir preconceitos e formar uma sociedade mais acolhedora e empática.`,
    category: 'enem',
    status: 'corrigida',
    wordCount: 285,
    createdAt: '2024-06-15T14:30:00Z',
    submittedAt: '2024-06-15T15:00:00Z',
    correction: {
      id: 'corr-1',
      essayId: 'essay-1',
      professorId: 'user-prof-1',
      competencies,
      totalScore: 820,
      generalFeedback: 'Redação bem estruturada com argumentação consistente. Destaque para a proposta de intervenção completa. Pontos de melhoria: aprofundar o repertório no desenvolvimento e revisar alguns desvios gramaticais.',
      strengths: [
        'Introdução bem contextualizada',
        'Uso adequado de repertório sociocultural',
        'Proposta de intervenção completa',
        'Boa progressão temática',
      ],
      improvements: [
        'Aprofundar argumentação no segundo parágrafo',
        'Revisar concordância verbal',
        'Diversificar conectivos',
      ],
      comments,
      highlights,
      status: 'finalizada',
      createdAt: '2024-06-18T09:00:00Z',
      finishedAt: '2024-06-20T11:00:00Z',
    },
  },
  {
    id: 'essay-2',
    userId: 'user-aluno-1',
    themeId: 'theme-4',
    type: 'texto',
    content: `A inteligência artificial emerge como uma das forças mais transformadoras do século XXI, redesenhando profundamente as relações de trabalho e os paradigmas econômicos globais. No Brasil, esse fenômeno apresenta tanto oportunidades quanto desafios que exigem uma reflexão crítica e ações estratégicas por parte do poder público e da sociedade civil.

Inicialmente, cabe destacar que a automação impulsionada pela IA já afeta diversos setores da economia brasileira. Segundo projeções do Fórum Econômico Mundial, milhões de postos de trabalho tradicionais podem ser substituídos por algoritmos e robôs nas próximas décadas. Essa transformação, que Yuval Harari denomina "classe dos inúteis" em suas obras, representa um risco social significativo, especialmente para trabalhadores menos qualificados.

Por outro lado, novas profissões e oportunidades surgem nesse contexto. A demanda por especialistas em ciência de dados, desenvolvedores de IA e profissionais de cibersegurança cresce exponencialmente. Entretanto, a desigualdade de acesso à educação tecnológica no Brasil cria um abismo entre aqueles que podem se beneficiar dessa revolução e os que ficarão à margem do mercado de trabalho.

Diante desse cenário, propõe-se que o Ministério do Trabalho, em parceria com instituições de ensino técnico como o SENAI e universidades públicas, desenvolva um programa nacional de requalificação profissional voltado para tecnologias emergentes. Esse programa deve oferecer cursos gratuitos e flexíveis, priorizando trabalhadores de setores em risco de automação, e contar com parcerias com empresas de tecnologia para garantir a empregabilidade dos formados.`,
    category: 'enem',
    status: 'enviada',
    wordCount: 260,
    createdAt: '2024-06-25T10:00:00Z',
    submittedAt: '2024-06-25T10:30:00Z',
  },
  {
    id: 'essay-3',
    userId: 'user-aluno-2',
    themeId: 'theme-3',
    type: 'texto',
    content: `A violência contra a mulher constitui uma das mais graves violações de direitos humanos na sociedade brasileira contemporânea. Apesar dos avanços legislativos, como a Lei Maria da Penha, os índices de feminicídio e agressões domésticas permanecem alarmantes, revelando a persistência de estruturas patriarcais profundamente enraizadas na cultura nacional.

Primeiramente, é essencial compreender que a violência de gênero não se limita às agressões físicas. Conforme argumentou Simone de Beauvoir, "não se nasce mulher, torna-se mulher", evidenciando como os papéis de gênero são construções sociais que frequentemente colocam as mulheres em posições de vulnerabilidade e subordinação. Essa violência simbólica se manifesta em piadas machistas, assédio moral no trabalho e na própria invisibilização das conquistas femininas.

Ademais, os dados do Fórum Brasileiro de Segurança Pública demonstram que uma mulher é vítima de feminicídio a cada sete horas no Brasil. Esse cenário é agravado pela subnotificação, pois muitas vítimas não denunciam por medo de retaliação ou descrença nas instituições. A interseccionalidade também revela que mulheres negras e de baixa renda são desproporcionalmente afetadas por essa violência estrutural.

Portanto, é imperativo que o Estado brasileiro intensifique suas políticas de enfrentamento. O Ministério da Mulher deve ampliar a rede de Casas da Mulher Brasileira em todos os estados, garantindo atendimento integral às vítimas. Paralelamente, o Ministério da Educação precisa incluir discussões sobre igualdade de gênero no currículo escolar, formando cidadãos conscientes e combatendo a cultura machista desde a infância.`,
    category: 'enem',
    status: 'em_correcao',
    wordCount: 275,
    createdAt: '2024-06-26T16:00:00Z',
    submittedAt: '2024-06-26T16:30:00Z',
  },
  {
    id: 'essay-4',
    userId: 'user-aluno-3',
    themeId: 'theme-5',
    type: 'imagem',
    imageUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=1100&fit=crop',
    category: 'enem',
    status: 'enviada',
    notes: 'Foto tirada com celular, tentei manter boa iluminação.',
    wordCount: 0,
    createdAt: '2024-06-27T09:00:00Z',
    submittedAt: '2024-06-27T09:15:00Z',
  },
  {
    id: 'essay-5',
    userId: 'user-aluno-1',
    themeId: 'theme-2',
    type: 'texto',
    content: '',
    category: 'enem',
    status: 'rascunho',
    wordCount: 0,
    createdAt: '2024-06-28T11:00:00Z',
  },
];

export const getEssayById = (id: string): Essay | undefined => {
  return mockEssays.find((e) => e.id === id);
};

export const getEssaysByUser = (userId: string): Essay[] => {
  return mockEssays.filter((e) => e.userId === userId);
};

export const getEssaysForCorrection = (): Essay[] => {
  return mockEssays.filter((e) => e.status === 'enviada' || e.status === 'em_correcao');
};

export const getCorrectedEssays = (): Essay[] => {
  return mockEssays.filter((e) => e.status === 'corrigida');
};
