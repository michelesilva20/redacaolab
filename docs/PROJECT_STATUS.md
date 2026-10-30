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
| Última revisão documental | 2026-10-30 — Fase 1.8 (security hotfix e integration gate) |
| Resultado da Fase 1.8 | **PASS** — com resíduos de qualidade explicitamente decididos como não bloqueadores da integração |
| Regra permanente da IA | `AGENTS.md` |
| Documentação de produto | `docs/PROJETO.md` |
| Branch desta entrega | `chore/phase1-integration-gate` (local, sem push) |
| Base | `feat/professor-correction-persist` em `7bd0ae5` |
| Demo pública | `https://emilabs.cloud/demo/redacaolab/` — **não validada** nesta execução |

## 2. Escopo do produto e MVP

**Perfis:** aluno, professor e administrador.

**MVP realista:** autenticação real no servidor → aluno rascunha/envia → professor corrige com rubrica da banca → aluno vê feedback persistido → admin básico.

**Fase 1.8 (esta entrega):** hotfix do advisory high do Zod, auditoria integrada da Fase 1, workflow mínimo de CI para PRs futuras e relatório de prontidão para um único PR de integração na `main`. Sem novos módulos de negócio.

## 3. Estado verificado por componente

| Componente | Estado | Evidência |
|---|---|---|
| Frontend (páginas/UI) | **Protótipo operacional em build** | `VALIDADO EM EXECUÇÃO`: `npm run build` exit 0 em 2026-10-30 |
| Login / papéis / guard | **Demonstração explícita** | Fases 1.1 e 1.4; smoke 1.8 (login, persistência, logout, troca) |
| Autorização de rotas (demo) | **UX no cliente** | 403 em `/app/usuarios` como aluno; RoleSwitcher redireciona para rota segura |
| Rascunho textual | **Persistência local demonstrativa** | Overlay `redacaolab-essays-v1` |
| Correção do professor | **Persistência local demonstrativa** | Mesmo overlay; rascunho e finalização |
| Cronômetro / upload / onboarding | **Preservados** | Fase 1.6 intacta; upload não reexercitado no smoke 1.8 (testes unitários permanecem) |
| Backend / banco / upload real | **Não iniciado** | Foto e correção de foto só na sessão |
| Autorização real no servidor | **Não iniciado** | Persistência no navegador não autoriza |
| Testes automatizados | **Parciais** | Vitest; **127 testes / 24 arquivos** |
| Dependências de produção | **Audit 0** | Zod 4.6.7; `npm audit --omit=dev` sem vulnerabilidades |
| CI | **Arquivo preparado, sem run remoto** | `.github/workflows/ci.yml`; nunca executado no GitHub nesta fase |

## 4. Fase 1.8 — security hotfix e integration gate

### 4.1 Correção do Zod (GHSA-mrhx-c7xc-m3w5)

| Item | Evidência |
|---|---|
| Versão anterior | `zod@^4.3.6` / lockfile 4.3.x (advisory: versões &lt; 4.6.6) |
| Versão aplicada | `zod@^4.6.7` (mínimo corrigido 4.6.6; instalada a patch mais recente compatível) |
| Lockfile | `node_modules/zod` → `4.6.7` (`https://registry.npmjs.org/zod/-/zod-4.6.7.tgz`) |
| `npm ls zod` | `zod@4.6.7` (`VALIDADO EM EXECUÇÃO`) |
| Uso na aplicação | **Nenhum import** em `src/` (`CONFIRMADO NO CÓDIGO`) |
| React Hook Form / resolvers | `@hookform/resolvers@^5.2.2` e `react-hook-form@^7.71.1` inalterados; sem mudança de código |
| Diff | 2 linhas em `package.json` + 8 linhas em `package-lock.json` |
| O que não foi feito | `npm audit fix --force`, overrides, bump massivo, testes de exaustão de memória |

### 4.2 npm audit

| Escopo | Antes (Fase 1.7) | Depois (Fase 1.8) |
|---|---|---|
| Produção (`npm audit --omit=dev`) | **1 high** — zod / GHSA-mrhx-c7xc-m3w5 | **0 vulnerabilidades** (`VALIDADO EM EXECUÇÃO`) |
| Completo (`npm audit`) | toolchain + zod | **9** somente em *devDependencies*: 2 low, 1 moderate, 6 high, 0 critical |

Vulnerabilidades de desenvolvimento restantes (não corrigidas nesta fase; sem `audit fix`):

| Pacote | Severidade | Papel |
|---|---|---|
| `@babel/core` | low | toolchain de testes/build |
| `esbuild` | low | Vite |
| `baseline-browser-mapping` | moderate | browserslist |
| `browserslist` | high | toolchain |
| `nanoid` | high | toolchain |
| `postcss` | high | CSS |
| `rollup` | high | Vite |
| `source-map-js` | high | toolchain |
| `vite` | high | bundler de desenvolvimento |

### 4.3 Testes e build

| Verificação | Resultado |
|---|---|
| `npm ci` | **Passou** após encerrar Vite que bloqueava `lightningcss-win32-x64-msvc.node` (272 pacotes) |
| `npm test` | **127 passed / 24 files** — mesma contagem da Fase 1.7; nenhum teste anterior foi alterado |
| `npm run build` | **Passou** — `index-BX5hjMn2.js` 1488.39 kB (gzip 451.13 kB) |
| `git diff --check` | limpo |
| Novos testes | nenhum — sem lacuna de regressão que exigisse cobertura extra nesta fase |

### 4.4 Pipeline de CI

Arquivo: `.github/workflows/ci.yml`.

- Dispara em `pull_request`
- Permissão `contents: read`
- Um job `verify` em `ubuntu-latest`, Node **22** LTS, `npm ci` → `npm test` → `npm run build` → `npm audit --omit=dev`
- Sem credenciais, deploy ou serviços pagos
- YAML revisado localmente pela estrutura; **não há run remoto** — o workflow só executará quando o repositório for enviado ao GitHub. **Não declarar CI verde.**

### 4.5 Smoke test integrado (navegador)

Servidor: `http://localhost:3000/`. Storage pré-existente **não foi apagado**. Marcador: `Fase18IntegrationGateLab`.

| Artefato | ID |
|---|---|
| Redação 1.8 | `essay-5b48c1aa-329c-4654-a923-63f7210d77a2` |
| Correção 1.8 | `corr-5f00b473-3ae9-4ece-b50e-26b16e048f83` |
| Redação 1.7 preservada | `essay-6472f056-5f1d-4657-b4fb-0326cd561270` / `corr-5e958ed4-5300-43ef-914b-3ebed4008eca` |

| Passo | Resultado |
|---|---|
| Aluno cria, salva rascunho, F5, retoma e envia | ID original mantido |
| Professor abre fila, salva correção parcial, F5 | Mesmo `corrId`; C1=0; parecer “Parecer parcial Fase18.” |
| Finalizar | `corrigida` / `finalizada`; `finishedAt` 2026-10-30T14:27:37.793Z; total 640; mesmo ID |
| Fila do professor | Sem o ID 1.8; mocks essay-2/3/4 permanecem |
| Aluno abre feedback + F5 | 640, parecer Fase18, pontos, texto original |
| Feedback de outro aluno (`essay-3`) | “Feedback de outro aluno” |
| Edição após envio | 403 “Esta redação não pode ser editada”; sem editor |
| Admin em `/app/redacoes` | Lista vazia (“Nenhuma redação ainda”) — conhecido |
| Troca aluno ↔ professor ↔ admin | Sessão e menu atualizados |
| `/app/usuarios` como aluno | 403 “Acesso não permitido” |
| Troca de perfil em rota restrita | Redireciona para `/app` (navegação segura) |
| Logout → `/login` → entrar de novo → F5 | Sessão demo persistida (`isAuthenticated` false após Sair; aluno após reentrar) |
| Overlay `redacaolab-essays-v1` | `version: 1`; 2 registros; sem duplicata; sem `data:image` |

Upload JPEG/PNG, limite 10 MiB e revogação de object URL **não foram reexercitados no smoke 1.8**. Permanecem cobertos pelos testes da Fase 1.6 e pela ausência de base64 no overlay.

### 4.6 Integridade da persistência (`CONFIRMADO NO CÓDIGO` + smoke)

- Mocks originais não são mutados; overlay local vence no merge.
- IDs estáveis; um registro por redação; correção aninhada.
- Correção inválida é omitida na leitura sem apagar a redação.
- Falha de storage não é reportada como sucesso (`EssayStorageError`).
- Sanitização HTML permanece na renderização.
- Versão do store: `ESSAY_STORE_VERSION = 1`. Leituras de versão diferente emitem warning e preservam registros válidos. A substituição futura por Spring Boot deve ocorrer atrás de `essayRepository` / contrato de API, sem os consumidores lerem `localStorage`.

### 4.7 Problemas de frontend/UX classificados

| Problema | Severidade | Impacto | Prioridade | Decisão 1.8 |
|---|---|---|---|---|
| Overlay da sidebar abre por padrão em viewport `< lg` | Média | Bloqueia o conteúdo até o primeiro clique no backdrop | **P2 — impedimento de qualidade**, não bloqueador funcional da integração desktop | Correção isolada futura: `feat/mobile-sidebar-default` |
| Admin vê lista de redações vazia | Média | UX enganosa (“Comece escrevendo…”) | P1 | Fora do escopo 1.8 |
| Rubrica ENEM em UNESP/concursos | Média | Escala pedagógica incorreta | P1 | Sem inventar rubrica |
| Comentários/highlights não interativos | Baixa | Campos existem; UI não edita trechos | P2 | Sem redesign |
| Ações decorativas (convidar, planos, etc.) | Baixa | CTA sem persistência real | P2 | Já marcadas como demo onde aplicável |
| Bundle JS ~1,49 MB (gzip 451 kB) | Baixa | Peso de primeira carga | P2 | Sem refactor de bundle nesta fase |

**Reprodução do overlay mobile (`VALIDADO EM EXECUÇÃO`, viewport 390×844):**

1. `sidebarOpen` inicia `true` em `uiStore`.
2. Backdrop `fixed inset-0 bg-black/50 z-40 lg:hidden` cobre 390×844.
3. `elementFromPoint(350, 200)` atinge o overlay; o heading fica sob o drawer (280px).
4. Clique no overlay fecha o drawer e libera o conteúdo.
5. Proposta isolada: iniciar fechada abaixo de 1024px (ou `matchMedia('(min-width: 1024px)')`) e não reabrir ao encolher a janela.

**Decisão explícita:** este impedimento **não bloqueia** o PR de integração da Fase 1. O fluxo crítico aluno→professor→aluno funciona em desktop. A correção deve ser uma entrega isolada, sem redesign.

### 4.8 Histórico Git e ancestralidade

Histórico **linear** desde `main` / `origin/main` `6bfb9df`. `merge-base(main, HEAD) = 6bfb9df`. Nenhuma alteração acidental na `main`. Commits em Conventional Commits. Sem rebase, squash ou rewrite nesta fase. Sem `.env` versionado.

| Fase | Branch | Tip |
|---|---|---|
| main (local = origin) | `main` | `6bfb9df` |
| F0 | `chore/project-foundation` | `074db9d` |
| 1.1 | `fix/auth-guard-and-demo-roles` | `96eb3d5` |
| 1.2 | `fix/sanitize-essay-html` | `006d484` |
| 1.3 | `chore/audit-production-advisories` | `2b9c4be` |
| 1.4 | `fix/role-based-route-authorization` | `bd7d5ae` |
| 1.5 | `feat/essay-draft-and-resume` | `774deb9` |
| 1.6 | `feat/essay-timer-and-upload` | `b05dd7a` |
| 1.7 | `feat/professor-correction-persist` | `7bd0ae5` |
| 1.8 | `chore/phase1-integration-gate` | `e95d49f` (Zod) · `527e27e` (CI) · tip de documentação desta entrega |

`main...HEAD` (antes dos commits 1.8): 70 arquivos, +7586 / −983. Branches intermediárias são ancestrais da tip atual — **não** mesclar cada uma isoladamente na `main`.

### 4.9 Recomendação de PR (não criado)

**Um único Pull Request** de `chore/phase1-integration-gate` → `main`.

- Preserva todos os Conventional Commits F0–F1.8.
- Evita duplicar commits das branches intermediárias.
- Estratégia mais segura: *merge commit* (não squash, não rebase interativo).
- Não executar push, merge ou deploy sem autorização posterior.

Bloqueadores da integração: **nenhum funcional sem decisão**. Resíduos: overlay mobile (P2, decisão acima), lista do admin (P1, backlog), rubricas por banca (P1), CI ainda sem run remoto.

## 5. Roadmap de entregas

| Fase | Estado | Objetivo / aceite |
|---|---|---|
| F0 — Governança e baseline | **Concluído** | `chore/project-foundation` |
| F1.1 — Auth guard e papéis demo | **Concluído** | `fix/auth-guard-and-demo-roles` |
| F1.2 — Sanitização HTML / XSS | **Concluído** | HTML de redação sanitizado |
| F1.3 — Audit de dependências de produção | **Concluído** | TipTap 3.32 + RR 7.18.4 |
| F1.4 — Autorização de rotas por papel | **Concluído** | Matriz única; 403 |
| F1.5 — Rascunho e retomada | **Concluído** | Persistência local textual |
| F1.6 — Timer, upload e onboarding | **Concluído** | Cronômetro real; validação 10 MiB |
| F1.7 — Persistência da correção | **Concluído** | Rascunho e finalização sobrevivem ao F5; 127 testes |
| F1.8 — Security hotfix e integration gate | **Concluído (PASS)** | Zod 4.6.7; audit prod 0; CI preparado; prontidão de PR |
| F1 — Frontend confiável (restante) | **Em andamento** | Lista do admin; rubricas por modalidade; overlay mobile |
| F2 — Backend e persistência | **Pendente** | RBAC, upload real, HTML no servidor |
| F3 — Fluxo pedagógico completo | **Pendente** | Auth/RBAC reais |
| F4 — Qualidade e release | **Pendente** | E2E; run remoto do CI; a11y |
| F5 — Diferenciais | **Pendente** | Rubricas, métricas, IA opcional |

## 6. Backlog priorizado

| Prioridade | Item | Estado | Aceite resumido |
|---|---|---|---|
| P0 / P1 anteriores | Guard, sanitização, audit, RBAC, rascunho, timer, upload, onboarding, correção | **Concluído** | Fases 0–1.7 |
| P1 | Advisory zod GHSA-mrhx-c7xc-m3w5 | **Concluído** | Zod 4.6.7; audit prod 0 |
| P1 | Admin na lista de redações | Pendente | `getByUser(adminId)` tende a vazio |
| P1 | Rubricas por modalidade | Pendente | UI ainda usa escala ENEM para UNESP/concursos |
| P1 | Backend Java / persistência | Pendente | API real + RBAC + upload |
| P2 | Overlay da sidebar no viewport estreito | Pendente (impedimento de qualidade) | Iniciar fechada abaixo de `lg` |
| P2 | Correção de foto persistida | Pendente | Hoje só sessão; sem base64 |
| P2 | Comentários/destaques interativos | Pendente | Campos existem; UI não edita trechos |
| P2 | Audit de *devDependencies* / bundle | Pendente | 9 advisories de toolchain; JS ~1,49 MB |

## 7. Decisões arquiteturais

**Definido nesta entrega:**

- Atualizar Zod pela menor versão corrigida compatível (4.6.7), sem `audit fix --force`.
- CI mínimo em um job, só em Pull Requests, sem deploy.
- Overlay mobile **não** é bloqueador da integração da Fase 1; correção isolada depois.
- Um único PR da tip 1.8 para `main`, merge commit, sem squash das fases anteriores.

**Mantido:** overlay textual da Fase 1.5; correção aninhada da 1.7; RoleSwitcher; matriz única; frontend na raiz; sem backend.

## 8. Testes, comandos e ambientes

```bash
npm ci
npm run dev
npm run build
npm run preview
npm test
npm audit --omit=dev
npm audit
```

| Verificação | Última execução | Resultado | Evidência |
|---|---|---|---|
| `npm ci` | 2026-10-30 | **Passou** | 272 pacotes |
| `npm test` | 2026-10-30 | **127 passed / 24 files** | Sem alteração de testes 1.7 |
| `npm run build` | 2026-10-30 | **Passou** | `index-BX5hjMn2.js` 1488.39 kB (gzip 451.13 kB) |
| `npm audit --omit=dev` | 2026-10-30 | **0** | Após Zod 4.6.7 |
| `npm audit` | 2026-10-30 | **9** (dev) | 2 low / 1 moderate / 6 high |
| `git diff --check` | 2026-10-30 | limpo | — |
| CI remoto | — | **não executado** | Arquivo local apenas |

**Ambiente:** Windows 10, Node v24.16.0, npm 11.13.0. Dev desta entrega em `http://localhost:3000/`. CI alvo: Node 22 LTS.

## 9. Registro de entregas

| Data | Entrega | Branch | Commit(s) | Validação real | Riscos / pendências |
|---|---|---|---|---|---|
| 2026-10-30 | Fase 1.8 — hotfix Zod, CI e gate | `chore/phase1-integration-gate` | `e95d49f` `527e27e` + docs | 127/127; build exit 0; audit prod 0; smoke ciclo + identidades + overlay | Sem push; CI sem run remoto; overlay mobile P2 |
| 2026-10-30 | Fase 1.7 — correção persistida | `feat/professor-correction-persist` | `ceff47b` `ac0ad5f` `e573296` `7bd0ae5` | 127/127; build; smoke A/B/C | Sem push; foto só sessão |
| 2026-10-21 | Fase 1.6 — timer, upload e onboarding | `feat/essay-timer-and-upload` | `3077d1c` `5488733` `0eadbee` `5274648` `b05dd7a` | 110/110; build; audit 0 | Sidebar overlay |
| 2026-10-21 | Fase 1.5 — rascunho e retomada | `feat/essay-draft-and-resume` | `774deb9` e anteriores | 94/94 | Store local ≠ produção |
| 2026-10-21 | Fase 1.4 — RBAC de rotas | `fix/role-based-route-authorization` | `bd7d5ae` | 66/66 | Autorização só no cliente |
| 2026-10-21 | Fase 1.3 — audit de produção | `chore/audit-production-advisories` | `2b9c4be` | 34/34; audit 0 | — |
| 2026-10-21 | Fase 1.2 — sanitização HTML | `fix/sanitize-essay-html` | `006d484` | 34/34 | — |
| 2026-10-21 | Fase 1.1 — guard e papéis | `fix/auth-guard-and-demo-roles` | `96eb3d5` | 22 testes | — |
| 2026-10-21 | Fase 0 — governança | `chore/project-foundation` | `074db9d` | install + build | — |

## 10. Riscos e bloqueios atuais

- **Produção:** sem backend. `localStorage` e RBAC no cliente não autorizam dados reais de estudantes.
- **CI remoto:** workflow existe; nenhum run no GitHub. Não afirmar pipeline verde.
- **Dev audit:** 9 advisories de toolchain. Fora do escopo desta fase.
- **Foto / correção de foto:** só sessão.
- **Sidebar mobile:** backdrop intercepta cliques em viewport `< lg` até o primeiro dismiss. Impedimento de qualidade, não bloqueador da integração.
- **Admin:** lista de redações vazia.
- **Sem atribuição** de professor; qualquer professor demo pode abrir a mesma redação.
- **Bloqueios funcionais da integração:** nenhum. Push/PR/deploy exigem autorização.

## 11. Próxima ação única e verificável

**Após autorização explícita:** publicar `chore/phase1-integration-gate` e abrir **um** Pull Request para `main` (merge commit, sem squash das fases). Sem autorização, não fazer push.

Se a integração na `main` for adiada, a próxima entrega de produto é `feat/admin-essay-visibility` a partir desta tip, definindo o que o admin vê na lista de redações, sem backend e sem inventar métricas.

Critérios de aceite do PR (quando autorizado):

1. Histórico F0–F1.8 preservado.
2. CI remoto executa `npm ci`, testes, build e audit de produção.
3. Sem force-push, rebase interativo ou squash das fases.

**Não fazer agora:** backend, JWT, upload em nuvem, correção por IA, redesign, push/merge sem autorização, `npm audit fix` indiscriminado.
