# RedaçãoLab 📝

> **"Treine, escreva e evolua com correções que realmente ajudam."**

Plataforma premium de treinamento de redação para **ENEM, UNESP e Concursos Públicos**. Protótipo frontend completo com UX/UI moderna, colorida e animada.

![RedaçãoLab](https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=400&fit=crop)

## 🚀 Como Rodar

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build
```

O projeto rodará em `http://localhost:3000`

## 📁 Estrutura de Pastas

```
src/
├── components/
│   ├── ui/               # Design System (Button, Card, Input, etc.)
│   ├── layout/           # Sidebar, Topbar, AppLayout
│   ├── gamification/     # XPChip, BadgeCard, MissionCard
│   └── onboarding/       # OnboardingModal
├── pages/
│   ├── Landing/          # Landing page pública
│   ├── Login/            # Tela de login
│   ├── Dashboard/        # Dashboard principal
│   ├── Lessons/          # Aulas em vídeo
│   ├── Themes/           # Temas de redação
│   ├── Essays/           # Redações do aluno
│   ├── Correction/       # Correção (professor)
│   ├── Feedback/         # Feedback da correção (aluno)
│   ├── Classes/          # Gestão de turmas
│   ├── Users/            # Gestão de usuários (admin)
│   ├── Reports/          # Relatórios
│   ├── Profile/          # Perfil do usuário
│   ├── Settings/         # Configurações (admin)
│   └── Help/             # Central de ajuda
├── stores/               # Zustand stores
├── services/             # fakeApi
├── mocks/                # Dados mock
├── types/                # TypeScript types
└── lib/                  # Utilitários
```

## 🗺️ Mapa de Rotas

### Rotas Públicas
| Rota | Descrição |
|------|-----------|
| `/` | Landing Page |
| `/login` | Tela de Login |

### Rotas Privadas (requer autenticação)
| Rota | Descrição | Roles |
|------|-----------|-------|
| `/app` | Dashboard | Todos |
| `/app/aulas` | Lista de aulas | Todos |
| `/app/aulas/:id` | Detalhes da aula | Todos |
| `/app/temas` | Catálogo de temas | Todos |
| `/app/temas/:id` | Detalhes do tema | Todos |
| `/app/redacoes` | Lista de redações | Todos |
| `/app/redacoes/nova` | Nova redação | Aluno |
| `/app/redacoes/:id` | Detalhes da redação | Todos |
| `/app/correcao/:id` | Correção de redação | Professor |
| `/app/feedback/:id` | Ver correção | Aluno |
| `/app/turmas` | Gestão de turmas | Admin, Professor |
| `/app/usuarios` | Gestão de usuários | Admin |
| `/app/relatorios` | Relatórios | Admin, Professor |
| `/app/perfil` | Perfil do usuário | Todos |
| `/app/configuracoes` | Configurações | Admin |
| `/app/ajuda` | Central de ajuda | Todos |

## 👥 Roles e Permissões

### Admin
- Acesso total a todas as funcionalidades
- Gestão de usuários e turmas
- Configurações da plataforma
- Relatórios completos

### Professor
- Correção de redações
- Gestão das próprias turmas
- Relatórios das turmas
- Criação de conteúdo

### Aluno
- Escrita e envio de redações
- Visualização de correções
- Acesso a aulas e temas
- Gamificação (XP, badges, streak)

## 🎮 Modo Simulado

O **Role Switcher** no topo da aplicação permite alternar rapidamente entre os três perfis:

1. Clique no badge colorido ao lado das notificações
2. Selecione: Admin / Professor / Aluno
3. A interface se adapta automaticamente

### Na tela de Login
- Selecione o role desejado antes de fazer login
- Clique em "Entrar na demonstração" para login direto

## 🎓 Onboarding (Aluno)

Fluxo de 3 passos no primeiro acesso:
1. **Objetivo**: ENEM / UNESP / Concursos
2. **Nível atual**: Iniciante / Intermediário / Avançado + Meta de nota
3. **Rotina**: Dias da semana preferidos

As preferências são salvas e personalizam o dashboard.

## 🏆 Gamificação

### Sistema de XP
- Assistir aula: +30 XP
- Enviar redação: +50 XP
- Revisar correção: +20 XP

### Streak
- Contador de dias consecutivos de prática
- Badges especiais para streaks de 7, 30 dias

### Badges
- Categorias: Streak, Redações, Competências, Especiais
- 14 badges disponíveis para desbloquear

### Missões
- Missões diárias e semanais
- Recompensas em XP ao completar

## 🎨 Design System

### Paleta de Cores
```css
--color-primary: #6d28d9 (roxo forte)
--color-primary-2: #7c3aed (roxo)
--color-secondary: #22d3ee (ciano)
--color-accent: #fb7185 (rosa)
--color-highlight: #f59e0b (amarelo)
--color-success: #22c55e
--color-danger: #ef4444
```

### Tipografia
- **Headings**: Plus Jakarta Sans
- **Body**: Inter

### Componentes UI
- Button (primary, secondary, ghost, danger, gradient, outline)
- Input, Textarea, Select
- Card (default, glass, gradient, bordered)
- Badge, Chip
- Modal, ConfirmModal
- Tabs
- Toast/Notifier
- Skeleton
- ProgressBar, CircularProgress
- EmptyState

## 🛠️ Stack Técnica

| Tecnologia | Uso |
|------------|-----|
| React 18 | UI Framework |
| TypeScript | Tipagem |
| Vite | Build tool |
| TailwindCSS | Estilização |
| React Router | Rotas |
| Zustand | Estado global |
| TanStack Query | Data fetching |
| React Hook Form | Formulários |
| Zod | Validação |
| Framer Motion | Animações |
| Recharts | Gráficos |
| TipTap | Editor de texto |
| Lucide React | Ícones |

## 📝 Funcionalidades Principais

### Landing Page
- Hero com gradiente roxo e mock do dashboard
- Seções: Recursos, Como Funciona, Planos, CTA, FAQ
- Design inspirado em EdTechs premium

### Editor de Redação
- Editor TipTap com contagem de palavras
- Timer opcional
- Upload de foto (drag & drop)
- Seleção de tema e modalidade
- Autosave (mock)

### Correção (Professor)
- Layout 2 colunas (redação + rubrica)
- Notas por competência (0-200)
- Comentários e highlights
- Pontos fortes e de melhoria

### Feedback (Aluno)
- Nota total destacada
- Gráfico radar de competências
- Feedback detalhado por competência
- Opção de refazer com base no feedback

## 📊 Dados Mock

Todos os dados são simulados via `fakeApi`:
- Delay aleatório (300-800ms) para simular latência
- Persist no localStorage via Zustand
- Dados ricos para todas as entidades

---

Desenvolvido com 💜 para o RedaçãoLab
