# RedaçãoLab — como o projeto funciona

Documento de produto e arquitetura do **RedaçãoLab**, um protótipo frontend de plataforma educacional para treino de redação (ENEM, UNESP e concursos).

**Status:** protótipo frontend completo, sem backend real.  
**Demo:** [emilabs.cloud/demo/redacaolab](https://emilabs.cloud/demo/redacaolab/)

---

## 1. O que é

O RedaçãoLab simula um SaaS de EdTech em que o aluno pratica redação, o professor corrige por competências e o administrador gerencia a plataforma.

A jornada principal é:

1. o aluno escolhe um tema
2. escreve no editor ou envia foto da redação manuscrita
3. o professor avalia as 5 competências do ENEM (C1 a C5)
4. o aluno vê nota, gráfico radar, pontos fortes e melhorias
5. a plataforma recompensa prática com XP, streak, badges e missões

Tudo isso roda no navegador. Login, dados, correções e gamificação são simulados com mocks e uma fake API.

---

## 2. O que é (e o que não é)

| É | Não é |
|---|---|
| Protótipo de produto e UX | Aplicação em produção |
| Frontend React com fluxos reais de tela | Backend, banco ou autenticação de verdade |
| Troca de perfil (aluno / professor / admin) para demo | Controle de acesso no servidor |
| Correção por competências na interface | Correção automática por IA |
| Fake API com delay e TanStack Query | Persistência entre recarregamentos além do localStorage de auth |

O manifesto de dependências também tem um ponto a validar: `react` e `react-dom` não estão declarados como dependências diretas no `package.json`, embora a aplicação os use.

---

## 3. Stack

| Tecnologia | Papel no projeto |
|---|---|
| React 18 | Interface e páginas |
| TypeScript | Tipos de domínio (`User`, `Essay`, `Correction`, etc.) |
| Vite | Dev server (porta 3000) e build |
| Tailwind CSS 4 | Design system via tokens em `src/index.css` |
| React Router 7 | Rotas públicas e área autenticada |
| Zustand | Auth persistida e estado de UI |
| TanStack Query | Fetch da fake API, cache e mutations |
| React Hook Form + Zod | Formulário de login |
| TipTap | Editor rico da redação |
| Recharts | Radar de competências, linhas e barras |
| Framer Motion | Animações de landing, sidebar e cards |
| Lucide React | Ícones |

---

## 4. Como a aplicação está organizada

```
src/
├── App.tsx                 Rotas e proteção de acesso
├── main.tsx                Bootstrap React
├── index.css               Tokens de cor, tipografia e utilitários
├── types/index.ts          Modelo de dados do produto
├── lib/utils.ts            Helpers (datas, status, categorias, cn)
├── stores/
│   ├── authStore.ts        Usuário logado, papel simulado, XP
│   └── uiStore.ts          Sidebar, toasts, onboarding, confetti
├── services/fakeApi.ts     Camada de dados (mocks + delay)
├── mocks/                  Usuários, aulas, temas, redações, turmas, XP
├── components/
│   ├── layout/             Sidebar, Topbar, AppLayout
│   ├── ui/                 Design system (Button, Card, Modal...)
│   ├── gamification/       XP, streak, badges, missões
│   ├── onboarding/         Modal de primeiro acesso do aluno
│   └── RoleSwitcher.tsx    Troca de papel no modo demo
└── pages/
    ├── Landing/            Site público
    ├── Login/
    ├── Dashboard/
    ├── Lessons/            Lista + detalhe da aula
    ├── Themes/             Lista + detalhe do tema
    ├── Essays/             Lista, nova redação, detalhe
    ├── Correction/         Correção do professor
    ├── Feedback/           Feedback do aluno
    ├── Classes/            Turmas (professor/admin)
    ├── Users/              Usuários (admin)
    ├── Reports/            Relatórios
    ├── Profile/
    ├── Settings/           Configurações da plataforma (admin)
    └── Help/
```

A leitura do código segue um fluxo simples: **página → fake API → mock → store → UI**.

---

## 5. Arquitetura em camadas

```
Landing / Login / App autenticado
        │
        ▼
   Páginas (src/pages)
        │
        ├── Zustand (auth + UI)
        └── TanStack Query
                 │
                 ▼
           fakeApi (delay 300–800 ms)
                 │
                 ▼
           mocks em memória
```

Não existe servidor. A `fakeApi` imita uma API REST: recebe parâmetros, espera alguns milissegundos e devolve objetos tipados. O TanStack Query trata isso como se fosse um backend (loading, cache, mutations).

O estado que precisa sobreviver ao F5 fica no `authStore` (Zustand + `persist` no `localStorage`, chave `redacaolab-auth`). O restante — redações novas, turmas criadas, aulas concluídas — vive só na memória da sessão.

---

## 6. Papéis e o que cada um vê

Há três papéis (`Role`): `aluno`, `professor` e `admin`.

A navegação da sidebar é filtrada pelo papel atual:

| Menu | Aluno | Professor | Admin |
|---|---|---|---|
| Dashboard | sim | sim | sim |
| Aulas | sim | sim | sim |
| Temas | sim | sim | sim |
| Redações | sim | sim (fila de correção) | sim |
| Turmas | não | sim | sim |
| Usuários | não | não | sim |
| Relatórios | não | sim | sim |
| Configurações | não | não | sim |
| Ajuda | sim | sim | sim |

Isso é filtro de interface, não segurança. Qualquer pessoa pode abrir `/app/usuarios` digitando a URL.

### Como entrar em cada papel

Na tela de login, o seletor **Entrar como (modo demo)** escolhe o papel. O formulário valida e-mail e senha com Zod, mas o login real chama `fakeApi.auth.loginAsRole(role)` e ignora as credenciais.

Dentro do app, o **RoleSwitcher** no topo troca o papel sem novo login. O modo simulado vem ligado por padrão (`isSimulatedMode: true`).

Usuários mock:

| Papel | Nome | E-mail |
|---|---|---|
| Admin | Admin Silva | admin@redacaolab.com |
| Professor | Prof. Maria Santos | maria@redacaolab.com |
| Professor | Prof. Carlos Lima | carlos@redacaolab.com |
| Aluno | João Pedro | joao@email.com |
| Aluno | Ana Clara | ana@email.com |
| Aluno | Lucas Mendes | lucas@email.com |

O aluno João Pedro inicia com `onboardingCompleted: false`, então o modal de onboarding aparece no primeiro acesso.

---

## 7. Rotas

### Públicas

| Rota | Tela |
|---|---|
| `/` | Landing page |
| `/login` | Login / demo |

### Autenticadas (`/app`, protegidas por `ProtectedRoute`)

| Rota | Tela |
|---|---|
| `/app` | Dashboard |
| `/app/aulas` | Catálogo de aulas |
| `/app/aulas/:id` | Detalhe da aula |
| `/app/temas` | Catálogo de temas |
| `/app/temas/:id` | Detalhe do tema |
| `/app/redacoes` | Lista de redações (ou fila do professor) |
| `/app/redacoes/nova` | Editor / upload de foto |
| `/app/redacoes/:id` | Detalhe da redação |
| `/app/correcao/:id` | Correção (professor) |
| `/app/feedback/:id` | Feedback (aluno) |
| `/app/turmas` | Turmas |
| `/app/usuarios` | Usuários |
| `/app/relatorios` | Relatórios |
| `/app/perfil` | Perfil |
| `/app/configuracoes` | Configurações |
| `/app/ajuda` | Ajuda e FAQ |

Se não houver usuário autenticado, `ProtectedRoute` redireciona para `/login`.

---

## 8. Área pública (landing)

A landing é uma página de conversão, montada por seções:

1. **Header** — logo, âncoras e CTA para login
2. **Hero** — proposta de valor (jornada até a nota 1000)
3. **TrustLogos** — logos de confiança
4. **Features** — recursos do produto
5. **HowItWorks** — tema → escrita → correção
6. **Pricing** — planos Starter (R$ 29), Pro (R$ 59) e Premium (R$ 99)
7. **CTA** — chamada final
8. **FAQ**
9. **Footer**

Os planos e o checkout são só apresentação. Não há pagamento.

---

## 9. Fluxos do produto

### 9.1 Onboarding do aluno

Quando o usuário é aluno e ainda não completou o onboarding, o `AppLayout` abre o `OnboardingModal`. São 3 passos:

1. objetivo: ENEM, UNESP ou concursos
2. nível atual (400 / 600 / 800) e nota-alvo
3. dias da semana em que pretende praticar

Ao concluir, as preferências vão para o `authStore`, o onboarding é marcado como feito e um confetti aparece.

### 9.2 Jornada do aluno

```
Login como aluno
    → Onboarding (se for o primeiro acesso)
    → Dashboard (progresso, missão, tema em destaque, aula recomendada)
    → Temas (filtro por banca e dificuldade)
    → Nova redação (TipTap ou foto, mínimo 100 palavras)
    → Lista de redações (rascunho / enviada / em correção / corrigida)
    → Feedback (nota, radar C1–C5, comentários)
    → Aulas, perfil, gamificação
```

A lista de redações do aluno vem de `fakeApi.essays.getByUser(userId)`. Se a redação já estiver `corrigida`, o clique abre `/app/feedback/:id`. Caso contrário, abre o detalhe.

### 9.3 Jornada do professor

```
Login como professor
    → Dashboard
    → Redações (fila: enviada / em correção)
    → Correção em duas colunas
         • texto ou imagem à esquerda
         • notas C1–C5, feedback, pontos fortes e melhorias à direita
    → Salvar rascunho ou finalizar
    → Turmas e relatórios
```

A fila usa `fakeApi.essays.getForCorrection()`. Finalizar a correção muda o status da redação para `corrigida` e grava a correção no objeto em memória.

### 9.4 Jornada do admin

```
Login como admin
    → Dashboard
    → Usuários (busca e filtro por papel)
    → Turmas (todas)
    → Relatórios (gráficos estáticos de média, volume e competências)
    → Configurações (nome da plataforma, prazo de correção, critérios C1–C5, notificações)
```

Salvar configurações só dispara um toast. Não há persistência de verdade.

---

## 10. Mapa das telas autenticadas

### Dashboard

Monta um painel com `fakeApi.dashboard.getData(role, userId)`:

- cards de redações enviadas, média, XP da semana e streak
- gráfico de progresso semanal
- radar das 5 competências
- missão do dia, badge recente, aula recomendada e tema em destaque
- CTA para escrever nova redação

### Aulas

Catálogo com busca, filtro de banca (ENEM / UNESP / concursos) e nível (iniciante / intermediário / avançado). Cada aula tem duração, thumbnail, materiais, checklist e recompensa de XP. Concluir chama `fakeApi.lessons.markComplete`.

### Temas

Catálogo com busca, banca e dificuldade. Cada tema traz eixo temático, repertório sugerido, checklist e exemplos. Dá para partir do detalhe direto para uma nova redação (`location.state.themeId`).

### Redações

- aluno: “Minhas Redações” + botão Nova redação
- professor: “Redações para corrigir”

Status possíveis: `rascunho`, `enviada`, `em_correcao`, `corrigida`.

### Nova redação

Editor TipTap (StarterKit + placeholder + contagem de caracteres, limite 3000) ou upload/drag-and-drop de foto. Campos:

- tema
- banca
- anotações
- timer opcional

Envio exige tema + (pelo menos 100 palavras **ou** imagem). Sucesso dispara confetti e toast.

### Correção

Layout em duas colunas. O professor atribui 0–200 em cada competência:

| Código | Competência | Máximo |
|---|---|---|
| C1 | Domínio da norma culta | 200 |
| C2 | Compreensão do tema | 200 |
| C3 | Argumentação | 200 |
| C4 | Coesão textual | 200 |
| C5 | Proposta de intervenção | 200 |

A nota total é a soma (máximo 1000). Também há feedback geral, pontos fortes e melhorias. Comentários e highlights existem no modelo de dados e nos mocks, mas a tela de correção ainda envia arrays vazios nesses campos.

### Feedback

Tela do aluno após a correção:

- nota total com faixa (Excelente / Muito bom / Bom / Pode melhorar)
- radar e barras por competência
- comentários, destaques, pontos fortes e melhorias
- incentivo a refazer com base no feedback

### Turmas, usuários, relatórios, perfil, configurações e ajuda

Telas de gestão e suporte. Relatórios usam dados estáticos (não vêm da fake API). Perfil mostra XP, streak, badges e radar. Ajuda tem FAQ do produto e formulário de contato visual.

---

## 11. Modelo de dados

Os tipos em `src/types/index.ts` são o contrato do produto.

**User** — id, nome, e-mail, papel, avatar, XP, streak, nível, badges, preferências (exame-alvo, nota atual, meta, dias da semana) e flag de onboarding.

**Lesson** — título, duração, nível, banca, vídeo, materiais, checklist, quem já concluiu e XP.

**Theme** — título, eixo, dificuldade, repertório, checklist, exemplos e destaque.

**Essay** — aluno, tema, tipo (`texto` ou `imagem`), conteúdo ou URL da imagem, banca, status, contagem de palavras e correção opcional.

**Correction** — professor, competências, nota total, feedback geral, pontos fortes, melhorias, comentários, highlights e status (`rascunho` ou `finalizada`).

**Class** — nome, professor e lista de alunos.

**Gamification** — XP, nível, streak, meta semanal, badges, missões (diária/semanal) e conquistas.

**Notification** — título, mensagem, tipo e link.

---

## 12. Fake API

`src/services/fakeApi.ts` expõe os módulos:

| Módulo | Operações |
|---|---|
| `auth` | `login`, `loginAsRole` |
| `users` | listar, buscar, alunos, professores |
| `lessons` | listar, detalhe, marcar como concluída |
| `themes` | listar, detalhe, tema em destaque |
| `essays` | listar, por usuário, fila de correção, criar, rascunho |
| `corrections` | buscar por redação, enviar/salvar |
| `classes` | listar, por professor/aluno, criar |
| `notifications` | listar, marcar como lida |
| `dashboard` | painel agregado + dados de gamificação |

Cada chamada espera `300 + random(500)` ms para parecer uma rede real.

Dados-fonte:

- `mocks/users.ts`
- `mocks/lessons.ts`
- `mocks/themes.ts`
- `mocks/essays.ts` (já inclui uma redação corrigida com nota 820)
- `mocks/gamification.ts`
- `mocks/classes.ts` (turmas + notificações)

---

## 13. Estado global

### Auth (`authStore`)

Persistido no `localStorage`.

- `user`, `isAuthenticated`
- `isSimulatedMode`, `simulatedRole`
- `login` / `logout`
- `setSimulatedRole` — troca o papel e reaproveita o usuário
- `updateOnboarding`, `updatePreferences`
- `addXp` — incrementa XP e recalcula nível (`floor(xp / 200) + 1`)
- `incrementStreak`

### UI (`uiStore`)

Não persistido.

- sidebar aberta/fechada (drawer no mobile, fixa no desktop ≥ 1024px)
- onboarding e confetti
- fila de toasts (somem em 5s por padrão)

---

## 14. Layout autenticado

`AppLayout` monta:

- **Sidebar** (280px) — logo, menu por papel, card do usuário
- **Topbar** — busca, XP, streak, RoleSwitcher, notificações, menu (perfil / configurações / sair)
- **Outlet** — página atual
- **ToastContainer**
- **OnboardingModal** (só aluno sem onboarding)

No mobile a sidebar é um drawer com overlay. No desktop ela permanece visível.

---

## 15. Gamificação

A regra de nível é linear: **200 XP por nível**.

O aluno João começa com 2400 XP, nível 12 e streak de 7 dias.

Badges cobrem quatro categorias: `essays`, `streak`, `competency` e `special` (primeira redação, 7/30 dias, C1–C5 perfeita, nota 1000, etc.).

Missões de exemplo:

- diárias: assistir aula (+30), enviar redação (+50), revisar correção (+20)
- semanais: 3 redações (+100), explorar 5 temas (+40)

Os chips de XP e streak ficam na topbar. Cards de missão e badge aparecem no dashboard e no perfil.

---

## 16. Design system

Tokens em `src/index.css` (Tailwind 4 `@theme`):

- **primary** — roxo (marca)
- **secondary** — ciano
- **accent** — rosa
- **highlight** — âmbar (XP)
- **success / danger / neutral**

Tipografia: **Plus Jakarta Sans** (títulos) e **Inter** (texto).

Componentes em `src/components/ui`:

Button, Input, Textarea, Select, Card, Badge, Modal, Tabs, Toast, Skeleton, ProgressBar, CircularProgress, EmptyState.

Utilitário `cn()` em `src/lib/utils.ts` (clsx + tailwind-merge) padroniza classes. Há também helpers de data (`pt-BR`), categoria, nível e status da redação.

---

## 17. Como rodar

```bash
npm install
npm run dev      # Vite em http://localhost:3000
npm run build    # tsc + vite build
npm run preview  # preview do build
```

Na tela de login:

1. escolha **Aluno**, **Professor** ou **Admin**
2. clique em **Entrar na demonstração** (ou preencha o formulário — o papel selecionado é o que vale)
3. use o seletor de papel no topo para trocar de perfil sem sair

---

## 18. Limites do protótipo (importante para evolução)

1. Sem backend, banco, autenticação real ou autorização de rota no servidor.
2. Dados novos (redação, correção, turma) somem ao recarregar a página.
3. Só o auth persistido sobrevive ao F5.
4. Login não valida senha de verdade.
5. Menu esconde telas por papel; a URL continua acessível.
6. Planos, pagamento e prazos de correção (72h / 24h) são copy de produto.
7. Relatórios usam números estáticos.
8. Comentários e highlights no texto existem no tipo e nos mocks, mas a tela de correção ainda não os grava.
9. Vídeos de aula e PDFs são placeholders.
10. `react` / `react-dom` precisam ser confirmados como dependências diretas.

---

## 19. Por onde começar a ler o código

1. `src/types/index.ts` — o vocabulário do produto
2. `src/App.tsx` — o mapa de telas
3. `src/services/fakeApi.ts` — o que cada tela “busca”
4. `src/stores/authStore.ts` — quem está logado e qual papel está ativo
5. `src/components/layout/Sidebar.tsx` — o que cada papel enxerga
6. `src/pages/Essays/NewEssay.tsx` → `Correction` → `Feedback` — o fluxo central

Com esses seis arquivos dá para entender o projeto inteiro e encaixar um backend depois, trocando a `fakeApi` por chamadas reais sem redesenhar as telas.
