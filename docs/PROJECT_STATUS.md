# RedaçãoLab — Status central do projeto

> **Fonte única da situação atual.** Ler no início de toda sessão e atualizar na mesma entrega de código. Não substituir evidência por expectativa.
>
> Distinção usada aqui: `CONFIRMADO NO CÓDIGO` · `VALIDADO EM EXECUÇÃO` · `PLANEJADO` · `HIPÓTESE` · `BLOQUEADO`

## 1. Identificação

| Campo | Estado |
|---|---|
| Produto | RedaçãoLab |
| Organização / portfólio | EmiLabs / Michele Andrade |
| Repositório | `michelesilva20/redacaolab` (GitHub) |
| Objetivo | Evoluir o protótipo frontend de redação para plataforma EdTech full stack |
| Estado de referência | **Protótipo frontend; ainda não é SaaS de produção** |
| Última revisão documental | 2026-10-21 — Fase 0 (baseline técnico local) |
| Regra permanente da IA | `AGENTS.md` |
| Documentação de produto | `docs/PROJETO.md` (mapa de telas e arquitetura do protótipo) |
| Branch desta entrega | `chore/project-foundation` (local, sem push) |
| Base | `main` em `6bfb9df` — *Merge pull request #1 from michelesilva20/docs/engineering-portfolio-2026-10* |
| Commits desta entrega | `b696691` `362677f` `2105063` `0f24488` (+ este registro de SHA) |
| Demo pública | `https://emilabs.cloud/demo/redacaolab/` — disponibilidade **não validada nesta execução** |

## 2. Escopo do produto e MVP

**Perfis:** aluno, professor e administrador.

**MVP realista (produção mínima útil):**

1. Autenticação real com sessão validada no servidor (sem RoleSwitcher como permissão).
2. Aluno cria, salva rascunho, retoma e envia redação (texto sanitizado).
3. Professor lista fila, atribui/abre, avalia com rubrica da modalidade e publica feedback.
4. Aluno vê histórico e feedback persistidos.
5. Admin gerencia usuários e temas no nível básico.
6. Persistência PostgreSQL + migrations + autorização por recurso.

**Fora do MVP inicial:** pagamentos, IA que corrige sozinha, microserviços, marketplace, app nativo, relatórios avançados, gamificação persistida como diferencial e integrações externas custosas.

**Critério de honestidade:** tela + mock não conta como concluído.

## 3. Estado verificado por componente

| Componente | Estado | Evidência |
|---|---|---|
| Frontend (páginas/UI) | **Protótipo operacional em build** | `VALIDADO EM EXECUÇÃO`: `npm install` e `npm run build` (tsc + Vite) concluíram com exit 0 em 2026-10-21 |
| Login / papéis | **Simulado** | `CONFIRMADO NO CÓDIGO`: `Login` chama `fakeApi.auth.loginAsRole`; senha/e-mail não autenticam. `RoleSwitcher` troca papel no cliente |
| Guard de rotas | **Frágil** | `CONFIRMADO NO CÓDIGO`: `ProtectedRoute` usa `!isAuthenticated && !user` — basta um dos dois existir. Sem RBAC por rota |
| Editor de redações | **Parcial** | TipTap + envio in-memory funcionam no código. Rascunho, timer e limite de 10 MB **não implementados** |
| Lista de redações | **Parcial** | Professor recebe tema via `getForCorrection`. Aluno usa `getEssaysByUser` **sem anexar tema** |
| Correção | **Parcial** | Notas C1–C5 e feedback gravam na memória. `comments` e `highlights` saem vazios |
| Dashboard | **Parcial / mock** | Parte vem da fake API; deltas (“+2 esta semana”, “↑ 40 pts”) são literais. Progresso semanal e competências são arrays fixos em `fakeApi.dashboard.getData` |
| Relatórios | **Mock estático** | Números hardcoded; filtro de período e exportar sem ação |
| Aulas | **Parcial** | Lista/filtro/detalhe renderizam. Play, PDF (`href="#"`) e `lessons.markComplete` **não são usados pela UI** |
| Turmas / usuários / ajuda / perfil / settings | **Leitura mock + ações decorativas** | Botões sem handler real: Nova turma, Convidar, Novo usuário, Editar perfil, Enviar mensagem. Settings só dispara toast |
| Backend Spring Boot | **Não iniciado** | Nenhum `backend/`, `pom.xml` ou `build.gradle` |
| Banco PostgreSQL | **Não iniciado** | Estado em arrays JS + `localStorage` (`redacaolab-auth`) |
| Upload persistente | **Não iniciado** | FileReader → Data URL no cliente |
| Autorização real | **Não iniciado** | Qualquer autenticado acessa `/app/usuarios`, `/app/correcao/:id`, etc. pela URL |
| Testes automatizados | **Ausentes** | 0 arquivos `*.test.*` / `*.spec.*`. Sem Vitest, Testing Library, Playwright, ESLint ou CI |
| CI/CD | **Ausente** | Sem `.github/workflows` |
| Build local | **Validado** | Ver seção 7 |
| Deploy | **Não validado** | Link da demo não exercitado nesta sessão |
| Dependências React | **Indiretas** | `react` e `react-dom` **não** estão em `package.json`. Instalados como peer `19.2.4` via outras libs (`VALIDADO EM EXECUÇÃO`: `npm ls`) |

### Auditoria funcional (código atual)

| Funcionalidade | Classificação | Observação |
|---|---|---|
| Landing, header, âncoras, CTA para login | Operacional (UI) | Sem checkout |
| Login demo por papel | Simulado | Zod valida formato; credenciais ignoradas |
| Persistência de sessão no browser | Simulado | Zustand `persist` no `localStorage` (objeto User completo) |
| Menu por papel | Simulado | Filtro visual na Sidebar; rotas não isoladas |
| Onboarding do aluno | Operacional no cliente | 3 passos; persiste preferências no auth store |
| Escrever e enviar redação | Operacional na sessão | `fakeApi.essays.create`; some no F5 |
| Salvar rascunho | Incompleto | API existe; botão sem `onClick`. “Continuar editando” também sem ação |
| Timer do editor | Incompleto | `isTimerRunning` alterna; **não há** `setInterval` |
| Upload de foto | Incompleto | Aceita `image/*` sem checar 10 MB nem assinatura |
| Correção C1–C5 + publicar | Operacional na sessão | Sem invalidação de cache após mutation |
| Comentários / highlights no texto | Incompleto | Modelo e mocks existem; submit envia `[]` |
| Feedback do aluno | Operacional na sessão | HTML da redação via `dangerouslySetInnerHTML` |
| Temas → nova redação | Operacional | `location.state.themeId` |
| Aulas (catálogo) | Operacional (leitura) | Play e materiais são placeholder |
| Gamificação | Simulada | XP/streak na topbar vêm do user persistido; missões/badges dos mocks |
| Busca da topbar | Incompleto | Estado local, não busca |
| Notificações | Simuladas | Lista mock; `markAsRead` nunca chamado |
| Relatórios / exportar | Decorativo | Dados inventados |
| Planos / pagamento | Fora de escopo | Copy da landing |
| Autosave | **Não existe** | README antigo menciona; código não implementa |

### Fragilidades confirmadas no código

1. **P0 — Guard:** `if (!isAuthenticated && !user)` em `src/App.tsx`. Estado inconsistente passa.
2. **P0 — Identidade demo:** `setSimulatedRole` troca só `role`, mantém `id`/nome/e-mail do usuário anterior (`src/stores/authStore.ts`).
3. **P0 — HTML sem sanitização:** `dangerouslySetInnerHTML` em `EssayDetail`, `Correction` e `Feedback`.
4. **P0 — Dependências:** `react`/`react-dom` não declarados; instalação frágil se peers mudarem.
5. **P0 — Auth no `localStorage`:** sessão e dados do usuário no cliente; RoleSwitcher não é autenticação.
6. **P1 — Ações decorativas** passam por funcionais (rascunho, turma, usuário, exportar, contato, editar perfil, play da aula).
7. **P1 — Cache:** nenhuma chamada a `invalidateQueries` após create/submit.
8. **P1 — Lista do aluno** não hidrata `theme`; títulos caem em “Tema não definido”.
9. **P1 — Rubrica única ENEM** aplicada também a UNESP/concursos.
10. **P2 — Resíduo Vite:** `src/counter.ts` não é usado pela aplicação.
11. **P2 — Bundle:** JS de produção ~1,47 MB (aviso do Vite).

## 4. Roadmap de entregas

| Fase | Estado | Objetivo / aceite |
|---|---|---|
| F0 — Governança e baseline | **Em andamento → esta entrega fecha o aceite documental e de build** | AGENTS versionado, status com evidências reais, Git em branch de preparação, backlog P0–P2, sem backend iniciado |
| F1 — Frontend confiável | **Pendente** | Guards corretos; demo explícita; rascunho/timer/upload reais; sanitização; testes críticos; botões sem mentir |
| F2 — Backend e persistência | **Pendente** | Spring Boot em `backend/`, PostgreSQL, Flyway, OpenAPI, ambiente local documentado |
| F3 — Fluxo pedagógico completo | **Pendente** | Auth/RBAC, redações, rascunhos, correções, feedback e upload reais |
| F4 — Qualidade e release | **Pendente** | E2E, CI, a11y, observabilidade, backup, hardening |
| F5 — Diferenciais | **Pendente** | Rubricas por banca, métricas reais, gamificação persistida, IA assistiva opcional |

## 5. Backlog priorizado

| Prioridade | Item | Estado | Aceite resumido |
|---|---|---|---|
| P0 | Baseline Git, build e dependências | **Parcialmente concluído** | Install/build registrados. Ainda falta declarar `react`/`react-dom` como dependências diretas |
| P0 | Proteger rotas e separar demo de permissão | Pendente | Guard exige `isAuthenticated && user`; RoleSwitcher só em modo demo identificado; plano de RBAC no servidor |
| P0 | HTML de redação não confiável | Pendente | Sanitização (ex.: DOMPurify) + testes de regressão antes de renderizar |
| P0 | Vulnerabilidades npm de produção | Pendente | 6 high em dependências de produção (TipTap/ProseMirror, markdown-it, react-router). Avaliar `npm audit fix` em branch própria, sem aplicar às cegas |
| P1 | Rascunho e retomada | Pendente | Salvar, listar, reabrir e editar com estado consistente + invalidar cache |
| P1 | Timer e upload validados | Pendente | Cronômetro incrementa; tipo/tamanho/MIME rejeitados com feedback |
| P1 | Isolamento de usuários demo | Pendente | Troca de papel carrega o usuário mock daquele papel, sem misturar `id` |
| P1 | Lista de redações com tema | Pendente | `getByUser` / `getById` anexam `theme` como a fila do professor |
| P1 | Correção rica e rubricas por modalidade | Pendente | Comentários/destaques gravados; C1–C5 não impostos a UNESP/concursos |
| P1 | Backend Java / persistência | Pendente | API real dos recursos do MVP com testes |
| P2 | Marcar aula concluída / materiais reais | Pendente | `markComplete` usado pela UI; PDFs ou estado “indisponível” explícito |
| P2 | Relatórios e exportação reais | Pendente | Métricas derivadas de dados reais |
| P2 | Testes + CI | Pendente | Vitest nas jornadas críticas; pipeline que falha de verdade |
| P2 | IA assistiva | Pendente | Só após rubrica, consentimento e revisão humana |

## 6. Decisões arquiteturais

**Definido (mantido):**

- Preservar o frontend na raiz até haver ADR + aprovação para monorepo.
- Backend futuro em `backend/` (Java LTS + Spring Boot + PostgreSQL + migrations).
- Monólito modular por domínio, não microserviços.
- Design system atual (roxo, Tailwind 4, componentes em `src/components/ui`).
- RoleSwitcher é exclusivo de demonstração — nunca será autorização real.
- Rubricas por modalidade: não reutilizar ENEM automaticamente para UNESP/concursos.

**A decidir com evidência (não nesta fase):**

- Java 21 vs 17; Maven vs Gradle; versão Spring Boot.
- Cookie httpOnly vs bearer; CSRF/CORS.
- Storage de arquivos (S3-compatível, disco local de dev).
- Modelo instituição/turma.
- Política de retenção (LGPD) e hospedagem.

ADRs futuros: `docs/adr/`. Este arquivo continua sendo o índice de estado.

## 7. Testes, comandos e ambientes

**Ambiente desta auditoria (`VALIDADO EM EXECUÇÃO`):**

| Item | Valor |
|---|---|
| SO | Windows 10 (build 26200), PowerShell |
| Node | v24.16.0 |
| npm | 11.13.0 |
| Vite (config) | porta 3000, `open: true` |
| React instalado | 19.2.4 (peer, não direto) |

```bash
npm install
npm run dev
npm run build
npm run preview
```

Não há scripts `test`, `lint` ou `typecheck` separados. O `build` já executa `tsc && vite build`.

| Verificação | Última execução | Resultado | Evidência |
|---|---|---|---|
| `npm install` | 2026-10-21 | **Passou** (exit 0) | 213 pacotes; 16 vulns no audit completo (dev+prod) |
| `npm ls react react-dom` | 2026-10-21 | **Peers 19.2.4** | Nenhuma dependência direta no projeto raiz |
| `npm run build` | 2026-10-21 | **Passou** (exit 0) | tsc ok; Vite 7.3.1; `dist/assets/index-CYxwJO5Q.js` 1472.55 kB (gzip 443.72 kB); aviso de chunk > 500 kB |
| `npm audit --omit=dev` | 2026-10-21 | **6 high** | TipTap/core, linkify-it, markdown-it, prosemirror-view (XSS), react-router 7.13.0 |
| Testes frontend | — | Não existem | — |
| Testes backend | — | Não iniciado | — |
| E2E / a11y automatizado | — | Não existem | — |
| Demo pública | — | Não exercitada | — |

**Não executado de propósito:** `npm audit fix` (alteraria lockfile sem avaliação). `npm run dev` não ficou no ar para smoke manual de UI nesta sessão.

**Segredos:** nenhum `.env` no repositório. `.gitignore` passou a ignorar `.env` / `.env.*` (exceto `.env.example`).

## 8. Registro de entregas

| Data | Entrega | Branch | Commit(s) | Validação real | Riscos / pendências |
|---|---|---|---|---|---|
| 2026-10-21 | Fase 0 — governança, auditoria e baseline de build | `chore/project-foundation` | `b696691` regras; `362677f` gitignore; `2105063` mapa do produto; `0f24488` baseline | `npm install` e `npm run build` exit 0; leitura do código e do Git | Sem push; React ainda indireto; P0 de auth/HTML/audit abertos |
| 2026-10-21 | Baseline documental pré-auditoria (rascunho) | ainda não aplicado | nenhum | só leitura | substituído por esta revisão |

> Entregas mais recentes no topo. SHA reais ficam no histórico Git desta branch. Não inventar hash.

## 9. Riscos e bloqueios atuais

- **Produção:** sem backend, auth, autorização nem persistência. Não usar dados reais de alunos na demo.
- **Segurança imediata no protótipo:** XSS potencial no HTML da redação; XSS conhecido em `prosemirror-view` (audit); sessão no `localStorage`; rotas admin/professor abertas.
- **Integridade demo:** RoleSwitcher mistura identidade; ações que parecem funcionar e não fazem nada.
- **Supply chain:** React só como peer; 6 high em prod.
- **Escopo:** iniciar backend + pagamentos + IA ao mesmo tempo atrasaria o fluxo pedagógico.
- **Node 24:** ambiente local é current, não LTS. Backend Java deve fixar LTS (17 ou 21) quando for criado.
- **Bloqueios:** nenhum bloqueio de ferramenta. Push/PR/deploy exigem autorização explícita.

## 10. Próxima ação única e verificável

**Abrir `fix/auth-guard-and-demo-roles` a partir de `chore/project-foundation` (ou de `main` após o merge desta preparação) e corrigir o isolamento de autenticação/demo no frontend.**

Critérios de aceite:

1. `ProtectedRoute` só libera acesso quando `isAuthenticated && user`.
2. `setSimulatedRole` carrega o usuário mock daquele papel (id, nome, e-mail, preferências), sem reaproveitar a identidade anterior.
3. RoleSwitcher e login demo deixam explícito que são modo demonstração (copy + `isSimulatedMode`).
4. Rotas administrativas/professor não precisam de backend ainda, mas o guard deixa de aceitar estado inconsistente.
5. Teste automatizado mínimo do guard (Vitest) **ou** justificativa registrada se a ferramenta ainda não estiver instalada nesta mesma entrega.
6. `docs/PROJECT_STATUS.md` atualizado com evidências.

**Não fazer nessa próxima tarefa:** backend Spring, PostgreSQL, deploy, `npm audit fix` em massa, nem redesign.

Correção P0 imediatamente seguinte (depois do guard): declarar `react` e `react-dom` no `package.json` e sanitizar HTML das redações.
