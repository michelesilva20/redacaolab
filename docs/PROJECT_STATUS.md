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
| Última revisão documental | 2026-10-21 — Fase 1.1 (auth guard e papéis demo) |
| Regra permanente da IA | `AGENTS.md` |
| Documentação de produto | `docs/PROJETO.md` |
| Branch desta entrega | `fix/auth-guard-and-demo-roles` (local, sem push) |
| Base | `chore/project-foundation` em `074db9d` |
| Demo pública | `https://emilabs.cloud/demo/redacaolab/` — **não validada** nesta execução |

## 2. Escopo do produto e MVP

**Perfis:** aluno, professor e administrador.

**MVP realista (produção mínima útil):** autenticação real no servidor → aluno rascunha/envia → professor corrige com rubrica da banca → aluno vê feedback persistido → admin básico. Sem pagamentos, IA corretora ou microserviços.

**Fase 1.1 (esta entrega):** corrigir o guard de rotas, isolar identidades na troca de perfil demo e deixar explícito que o acesso é demonstração. Sem backend.

## 3. Estado verificado por componente

| Componente | Estado | Evidência |
|---|---|---|
| Frontend (páginas/UI) | **Protótipo operacional em build** | `VALIDADO EM EXECUÇÃO`: `npm run build` exit 0 em 2026-10-21 (Fase 1.1) |
| Login / papéis | **Demonstração explícita** | `CONFIRMADO NO CÓDIGO`: `enterDemo(role)` clona mock; Login sem campos de senha |
| Guard de rotas | **Corrigido no cliente** | `ProtectedRoute` exige `isAuthenticated && user`; hidratação antes de decidir |
| Troca de papéis | **Corrigida no cliente** | `setSimulatedRole` clona o mock do papel; `repairAuthState` no persist |
| Editor de redações | **Parcial** | TipTap + envio in-memory. Rascunho, timer e limite de 10 MB não implementados |
| Lista de redações | **Parcial** | Aluno ainda sem anexar tema |
| Correção | **Parcial** | Comentários/highlights vazios no submit |
| Dashboard / relatórios | **Parcial / mock** | Métricas literais e relatórios estáticos |
| Backend Spring Boot | **Não iniciado** | — |
| Banco PostgreSQL | **Não iniciado** | — |
| Upload persistente | **Não iniciado** | — |
| Autorização real (servidor) | **Não iniciado** | URL de admin/professor ainda acessível a qualquer sessão demo |
| Testes automatizados | **Parciais** | Vitest + Testing Library; 22 testes da Fase 1.1 |
| CI/CD | **Ausente** | Sem `.github/workflows` |
| Dependências React | **Declaradas** | `react` e `react-dom` `^19.2.4` no `package.json` (`VALIDADO EM EXECUÇÃO`) |

### Fase 1.1 — problemas corrigidos

| Antes | Depois |
|---|---|
| `ProtectedRoute` usava `!isAuthenticated && !user` | Só libera com sessão completa; estados mistos vão para `/login` |
| F5 podia redirecionar antes do persist hidratar | Guard espera hidratação (`useHasAuthHydrated`) |
| `setSimulatedRole` só mudava `role` no mesmo objeto | Clona o mock canônico do papel (`user-aluno-1` / `user-prof-1` / `user-admin-1`) |
| Mocks originais podiam ser mutados | `structuredClone` em login, demo e fake API |
| Sessões antigas misturadas no `localStorage` | `repairAuthState` no `merge` do persist |
| Login pedia e-mail/senha ignorados | Tela só oferece perfil fictício |

Arquivos principais: `src/lib/demoAuth.ts`, `src/stores/authStore.ts`, `src/components/ProtectedRoute.tsx`, `src/App.tsx`, `src/pages/Login/index.tsx`, `src/components/RoleSwitcher.tsx`, `src/services/fakeApi.ts`.

### Fragilidades ainda abertas

1. **P0 — HTML sem sanitização:** `dangerouslySetInnerHTML` em `EssayDetail`, `Correction` e `Feedback`.
2. **P0 — Vulnerabilidades npm:** audit de produção ainda com highs (TipTap/ProseMirror, markdown-it, react-router).
3. **P0 — Auth no `localStorage`:** sessão demo no cliente; não é autenticação real.
4. **P1 — Ações decorativas**, cache sem invalidação, lista sem tema, rubrica ENEM única.
5. **P2 —** `src/counter.ts` residual; bundle JS grande.

## 4. Roadmap de entregas

| Fase | Estado | Objetivo / aceite |
|---|---|---|
| F0 — Governança e baseline | **Concluído** | AGENTS, status, build e backlog registrados em `chore/project-foundation` |
| F1.1 — Auth guard e papéis demo | **Concluído** | Guard consistente; identidades isoladas; demo explícita; testes e build verdes |
| F1 — Frontend confiável (restante) | **Em andamento** | Sanitização HTML; rascunho/timer/upload; botões sem mentir |
| F2 — Backend e persistência | **Pendente** | Spring Boot em `backend/`, PostgreSQL, Flyway, OpenAPI |
| F3 — Fluxo pedagógico completo | **Pendente** | Auth/RBAC reais, redações e correções persistidas |
| F4 — Qualidade e release | **Pendente** | E2E, CI, a11y, observabilidade |
| F5 — Diferenciais | **Pendente** | Rubricas por banca, métricas reais, IA assistiva opcional |

## 5. Backlog priorizado

| Prioridade | Item | Estado | Aceite resumido |
|---|---|---|---|
| P0 | Baseline Git, build e dependências React | **Concluído** | Install/build ok; `react`/`react-dom` diretos |
| P0 | Proteger rotas e separar demo de permissão (cliente) | **Concluído** | Guard + RoleSwitcher/Login explícitos; RBAC de servidor continua pendente |
| P0 | Isolamento de usuários demo | **Concluído** | Clone por papel; persist repara estado antigo |
| P0 | HTML de redação não confiável | Pendente | Sanitização + testes de regressão |
| P0 | Vulnerabilidades npm de produção | Pendente | Avaliar `npm audit fix` em branch própria |
| P1 | Rascunho e retomada | Pendente | Salvar, listar, reabrir + invalidar cache |
| P1 | Timer e upload validados | Pendente | Cronômetro e validação de arquivo |
| P1 | Lista de redações com tema | Pendente | Anexar `theme` em `getByUser` |
| P1 | Correção rica e rubricas por modalidade | Pendente | Comentários/destaques; não impor ENEM a UNESP |
| P1 | Backend Java / persistência | Pendente | API real do MVP |
| P2 | Testes + CI além do núcleo de auth | Pendente | Ampliar cobertura; pipeline que falha de verdade |
| P2 | Relatórios reais / IA | Pendente | Fora do frontend confiável |

## 6. Decisões arquiteturais

**Definido nesta entrega:**

- Sessão demo válida = `isAuthenticated === true` e `user` com `id`.
- Troca de perfil sempre clona o mock canônico; nunca muta `mockUsers`.
- Persist usa `merge` + `repairAuthState` para estados antigos.
- Login deixou de fingir credenciais. `enterDemo` é a entrada oficial da demonstração.
- Testes do núcleo de auth com Vitest + Testing Library + jsdom.
- `react`/`react-dom` passam a dependências diretas (necessário para a app e para os testes).

**Mantido:** frontend na raiz; backend futuro em `backend/`; RoleSwitcher exclusivo de demo; sem RBAC de servidor ainda.

## 7. Testes, comandos e ambientes

```bash
npm install
npm run dev
npm run build
npm run preview
npm test
```

| Verificação | Última execução | Resultado | Evidência |
|---|---|---|---|
| `npm test` | 2026-10-21 | **22 passed / 5 files** | Vitest 5.0.5, ~6,56s |
| `npm run build` | 2026-10-21 | **Passou** (exit 0) | tsc ok; Vite 7.3.1; `index-CvxEKIAL.js` 1384.98 kB (gzip 416.82 kB) |
| `npm install` (tooling 1.1) | 2026-10-21 | **Passou** | vitest, jsdom, Testing Library; react/react-dom diretos |
| Testes backend | — | Não iniciado | — |
| E2E / demo pública | — | Não exercitados | — |
| `npm audit fix` | — | Não executado | fora de escopo |

**Ambiente:** Windows 10, Node v24.16.0, npm 11.13.0.

Não houve smoke manual no browser nesta sessão. A persistência após F5 foi coberta por teste de `rehydrate` + `repairAuthState`, não por navegação real.

## 8. Registro de entregas

| Data | Entrega | Branch | Commit(s) | Validação real | Riscos / pendências |
|---|---|---|---|---|---|
| 2026-10-21 | Fase 1.1 — guard, identidades demo e testes | `fix/auth-guard-and-demo-roles` | `9f340ad` tooling; `67f29ce` guard/identidades; `0e77916` copy demo; `f42bce0` testes | `npm test` 22/22; `npm run build` exit 0 | Sem push; HTML ainda sem sanitizar; sem RBAC servidor |
| 2026-10-21 | Fase 0 — governança e baseline | `chore/project-foundation` | `b696691` `362677f` `2105063` `0f24488` `074db9d` | install + build | base desta branch |

## 9. Riscos e bloqueios atuais

- **Produção:** continua sem backend. Não usar dados reais de alunos.
- **XSS:** HTML de redação e advisory de `prosemirror-view` seguem abertos.
- **Sessão no `localStorage`:** aceitável só na demo; inadequado para produção.
- **RBAC:** menu esconde rotas; URL ainda não é barreira.
- **Bloqueios:** nenhum. Push/PR/deploy exigem autorização.

## 10. Próxima ação única e verificável

**Abrir `fix/sanitize-essay-html` a partir desta branch (ou de `main` após o merge) e sanitizar o HTML das redações antes de `dangerouslySetInnerHTML`.**

Critérios de aceite:

1. `EssayDetail`, `Correction` e `Feedback` não renderizam HTML cru.
2. Há testes de regressão contra markup inseguro.
3. A solução é documentada em `docs/PROJECT_STATUS.md`.
4. `npm test` e `npm run build` passam.

**Não fazer nessa tarefa:** backend, `npm audit fix` em massa, rascunho/timer, nem redesign.
