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
| Estado de referência | **Protótipo frontend integrado à `main`; ainda não é SaaS de produção** |
| Última revisão documental | 2026-10-30 — encerramento da Fase 1 e baseline da Fase 2 |
| Fase 1 | **Concluída e integrada** — [PR #2](https://github.com/michelesilva20/redacaolab/pull/2) MERGED |
| Merge commit | `3ff3bd150450d6b690b20fce836773b22e2ebcf2` |
| `origin/main` | `3ff3bd1` (pais: `6bfb9df` + `1f82c26`) |
| Branch desta entrega | `docs/phase1-closeout` (local, sem push) |
| Base | `main` integrada em `3ff3bd1` |
| Regra permanente da IA | `AGENTS.md` |
| Documentação de produto | `docs/PROJETO.md` |
| Demo pública | `https://emilabs.cloud/demo/redacaolab/` — **não validada** após o merge |
| Deploy | **Não realizado** |

## 2. Escopo do produto e MVP

**Perfis:** aluno, professor e administrador.

**MVP realista (ainda não atingido):** autenticação real no servidor → aluno rascunha/envia → professor corrige com rubrica da banca → aluno vê feedback persistido → admin básico.

**Esta entrega:** apenas documentação. Fecha a Fase 1 na `main` e registra o planejamento da Fase 2.1. Sem código, dependências, CI ou backend.

## 3. Estado verificado por componente

| Componente | Estado | Evidência |
|---|---|---|
| Frontend (páginas/UI) | **Protótipo operacional na `main`** | Build e 127 testes no CI do PR #2 (HEAD `1f82c26`) |
| Login / papéis / guard | **Demonstração explícita** | `enterDemo`, `RoleSwitcher`, `ProtectedRoute` |
| Autorização de rotas | **UX no cliente** | Matriz + `RoleRoute` + 403; sem validação no servidor |
| Rascunho textual | **Persistência local demonstrativa** | Overlay `redacaolab-essays-v1` |
| Correção do professor | **Persistência local demonstrativa** | Correção aninhada no mesmo overlay |
| Cronômetro / upload / onboarding | **Implementados no frontend demo** | Timer por timestamps; JPEG/PNG 10 MiB só na sessão |
| Backend / banco | **Inexistente** | Sem `backend/`, sem PostgreSQL, sem API real |
| Autorização real | **Não iniciada** | `localStorage` não autoriza |
| Testes automatizados | **Parciais (frontend)** | Vitest; **127 testes / 24 arquivos** |
| Dependências de produção | **Audit 0** | Zod 4.6.7; `npm audit --omit=dev` |
| CI | **Só em Pull Request** | Último run do PR #2: [41084935858](https://github.com/michelesilva20/redacaolab/actions/runs/41084935858) no SHA `1f82c26`. **Não houve workflow no merge commit.** |
| Hospedagem / release | **Sem deploy desta integração** | Demo pública anterior não revalidada |

## 4. Encerramento da Fase 1

### 4.1 O que a Fase 1 entregou (frontend real vs demonstração)

**Implementado e validado no frontend (ainda demonstrativo onde indicado):**

- Governança: `AGENTS.md`, status central, arquitetura em `docs/PROJETO.md`
- Autenticação **demonstrativa** (três perfis, persistência de sessão, logout, troca de identidade)
- Matriz de permissões, `RoleRoute`, página 403, navegação segura ao trocar perfil
- Sanitização HTML de redação (DOMPurify)
- Dependências de produção sem advisories conhecidos (TipTap 3.32, RR 7.18.4, Zod 4.6.7)
- Rascunho textual, retomada após F5, envio sem duplicar ID
- Cronômetro por timestamps persistido no rascunho
- Upload demonstrativo JPEG/PNG (validação + preview; sem persistir arquivo)
- Onboarding por identidade demo
- Correção do professor: rascunho, retomada, finalização, ID estável
- Feedback do aluno após correção `finalizada`; isolamento de outro aluno
- 127 testes Vitest e CI mínimo de PR

**Ainda demonstrativo / insuficiente para usuários reais:**

- Login e RBAC só no cliente
- Persistência em `localStorage` (qualquer perfil no mesmo navegador lê o overlay)
- Foto e correção de foto só na sessão
- Sem atribuição de professor
- Admin vê lista de redações vazia
- Rubrica ENEM aplicada a UNESP/concursos
- Gamificação, turmas, relatórios e configurações em grande parte mock/estáticos

**Não implementado:** backend, banco, autenticação real, upload persistente, OpenAPI, Spring Security, deploy.

### 4.2 Integração na main (`VALIDADO EM EXECUÇÃO`)

| Item | Evidência |
|---|---|
| PR | [#2](https://github.com/michelesilva20/redacaolab/pull/2) MERGED (2026-10-30T15:55:57Z) |
| Estratégia | Merge commit (não squash, não rebase) |
| Merge SHA | `3ff3bd150450d6b690b20fce836773b22e2ebcf2` |
| Pais | `6bfb9df` (main anterior) + `1f82c26` (tip da integração) |
| Histórico | F0–F1.10 preservados como ancestrais de `origin/main` |
| Deploy | nenhum |
| Branches da integração | `chore/phase1-integration-gate` **não** excluída |

### 4.3 Último CI do PR (não do merge)

Workflow: `.github/workflows/ci.yml` (`on: pull_request` apenas).

| SHA | Run | Resultado |
|---|---|---|
| `dec8b3f` | [41082764786](https://github.com/michelesilva20/redacaolab/actions/runs/41082764786) | success |
| `36d21b0` | [41083731732](https://github.com/michelesilva20/redacaolab/actions/runs/41083731732) | success |
| `1f82c26` (HEAD do PR) | [41084935858](https://github.com/michelesilva20/redacaolab/actions/runs/41084935858) | **success** — 127/24; build 1488.39 kB; audit prod 0 |

**Não declarar CI no merge commit `3ff3bd1`.** Não existe job de `push` na `main`.

### 4.4 Evidências das Fases 1.8–1.11 (resumo)

Mantidas as evidências detalhadas das fases anteriores neste arquivo (Zod, smoke 1.8, publicação, revisão e merge). Pontos que continuam válidos:

- Overlay `redacaolab-essays-v1` versão 1; mocks não mutados; IDs estáveis
- Smoke local aluno → professor → aluno (marcador `Fase18IntegrationGateLab`); **não** executado no CI
- Overlay mobile: `sidebarOpen` inicia `true`; backdrop cobre viewport `< lg` até o primeiro clique
- 9 advisories só em *devDependencies*

### 4.5 Fase 1.8 — security hotfix (histórico)

Zod `^4.3.6` → `^4.6.7` (GHSA-mrhx-c7xc-m3w5). Sem import em `src/`. Sem `audit fix --force`. Produção: 0; dev: 9.

### 4.6 Smoke 1.8 (navegador local)

Servidor `http://localhost:3000/`. IDs: `essay-5b48c1aa-329c-4654-a923-63f7210d77a2` / `corr-5f00b473-3ae9-4ece-b50e-26b16e048f83`. Total 640; F5 restaurou rascunho e feedback. 403 em edição após envio e em `/app/usuarios` como aluno.

### 4.7 Publicação e merge (1.9–1.11)

Push da tip, PR Draft, dois CI intermediários, commit documental `1f82c26`, Ready for review e merge commit `3ff3bd1`. Auto-merge nunca habilitado.

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
| F1.7 — Persistência da correção | **Concluído** | Rascunho e finalização sobrevivem ao F5 |
| F1.8 — Security hotfix e integration gate | **Concluído** | Zod 4.6.7; audit prod 0 |
| F1.9 — Publicação e PR Draft | **Concluído** | Branch em `origin`; PR #2 |
| F1.10 — Revisão final e sync documental | **Concluído** | `1f82c26` no PR; CI verde |
| F1.11 — Merge controlado | **Concluído** | Merge commit `3ff3bd1` |
| F1 — Frontend confiável (fundação) | **Concluído na `main`** | Protótipo integrado; resíduos P1/P2 no backlog |
| **F2.1 — Backend Architecture & Foundation** | **Pendente (próximo marco)** | Ver §5.1; **não iniciado** |
| F2 — Backend e persistência | **Pendente** | RBAC, upload real, HTML no servidor |
| F3 — Fluxo pedagógico completo | **Pendente** | Auth/RBAC reais em produção |
| F4 — Qualidade e release | **Pendente** | E2E; CI de push; a11y |
| F5 — Diferenciais | **Pendente** | Rubricas, métricas, IA opcional |

### 5.1 Fase 2.1 — planejada (não implementar agora)

**Objetivos (`PLANEJADO`):**

- Monólito modular (não microserviços)
- Java LTS compatível com Spring Boot estável
- Spring Boot, Spring Security, Bean Validation
- PostgreSQL e migrações Flyway
- Estrutura inicial em `backend/` (frontend permanece na raiz)
- Testes JUnit e de integração (Testcontainers quando viável)
- Contratos REST explícitos (OpenAPI / DTOs)
- Estratégia de autenticação e autorização **real** no servidor
- Ambiente local documentado (sem segredos no Git)
- Integração futura com o frontend existente via `essayRepository` / `fakeApi`, sem reestruturar o app para monorepo

**Recomendação de arranque:** domínio e contratos de API primeiro (`essays`, `corrections`, `auth`). Sem criar `apps/web`, sem reescrever o React e sem implementar nesta entrega documental.

## 6. Backlog priorizado

| Prioridade | Item | Estado | Aceite resumido |
|---|---|---|---|
| P0 / P1 da Fase 1 | Guard, sanitização, audit prod, RBAC demo, rascunho, timer, upload, onboarding, correção, CI, merge | **Concluído** | Integrado em `3ff3bd1` |
| P1 | Sidebar mobile com overlay inicial indevido | Pendente | Iniciar fechada abaixo de `lg` |
| P1 | Lista de redações do administrador incompleta | Pendente | Admin não cai em “Nenhuma redação ainda” enganoso |
| P1 | Rubricas específicas por banca | Pendente | Não reutilizar escala ENEM em UNESP/concursos |
| P1 | Autenticação e autorização reais | Pendente | Servidor valida cada operação |
| P1 | Persistência em banco de dados | Pendente | PostgreSQL + transições de estado |
| P2 | Comentários e highlights interativos | Pendente | UI ainda não edita trechos |
| P2 | Otimização do bundle | Pendente | JS ~1,49 MB (gzip 451 kB) |
| P2 | Melhorias no fluxo de upload | Pendente | Foto só sessão; sem persistência |
| P2 | Alertas de *devDependencies* | Pendente | 9 advisories de toolchain |
| P2 | Funcionalidades simuladas não essenciais ao MVP | Pendente | Planos, relatórios estáticos, CTAs decorativos |

Limitações demonstrativas **não** são funcionalidades concluídas.

## 7. Decisões arquiteturais

**Definido e mantido:**

- Frontend na raiz; backend futuro em `backend/` quando o contrato da primeira API estiver claro
- Overlay textual `redacaolab-essays-v1`; correção aninhada; mocks não mutados
- RoleSwitcher exclusivo de demonstração
- Matriz única de permissões no cliente
- Rubricas por modalidade exigem fonte oficial — não inventar escala
- CI só em PR, sem deploy automático
- Fase 2 começa por contratos e domínio, não por microserviços nem rewrite do frontend

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

| Verificação | Última evidência | Resultado |
|---|---|---|
| `npm test` | CI PR #2 em `1f82c26` | **127 passed / 24 files** |
| `npm run build` | mesmo run | **Passou** — `index-BX5hjMn2.js` 1488.39 kB (gzip 451.13 kB) |
| `npm audit --omit=dev` | mesmo run | **0** |
| `npm audit` (dev) | 2026-10-30 local / `npm ci` remoto | **9** (2 low / 1 moderate / 6 high) |
| CI no merge `3ff3bd1` | — | **não executado** (workflow só em `pull_request`) |

**Ambiente local conhecido:** Windows 10, Node v24.16.0, npm 11.13.0, Vite em `http://localhost:3000/`. CI: Node 22 LTS.

Não há variáveis de ambiente secretas versionadas. `.env` está no `.gitignore`.

## 9. Registro de entregas

| Data | Entrega | Branch | Commit(s) | Validação real | Riscos / pendências |
|---|---|---|---|---|---|
| 2026-10-30 | Encerramento documental da Fase 1 | `docs/phase1-closeout` | *(este commit)* | Docs alinhadas ao merge `3ff3bd1` | Sem push; backend inexistente |
| 2026-10-30 | Fase 1.11 — merge controlado | `chore/phase1-integration-gate` | merge `3ff3bd1` | PR #2 MERGED; CI em `1f82c26` | Sem deploy; docs 1.10 ainda diziam “sem merge” na tip integrada |
| 2026-10-30 | Fase 1.10 — sync docs e revisão | `chore/phase1-integration-gate` | `1f82c26` | CI 41084935858 success | — |
| 2026-10-30 | Fase 1.9 — push e PR Draft | `chore/phase1-integration-gate` | `dec8b3f` `36d21b0` | CI 41082764786 / 41083731732 | — |
| 2026-10-30 | Fase 1.8 — hotfix Zod e gate | `chore/phase1-integration-gate` | `e95d49f` `527e27e` `dec8b3f` | 127/127; audit prod 0; smoke local | Overlay mobile |
| 2026-10-30 | Fase 1.7 — correção persistida | `feat/professor-correction-persist` | `ceff47b` `ac0ad5f` `e573296` `7bd0ae5` | 127/127; smoke | Foto só sessão |
| 2026-10-21 | Fase 1.6 — timer, upload, onboarding | `feat/essay-timer-and-upload` | `b05dd7a` e anteriores | 110/110 | Sidebar overlay |
| 2026-10-21 | Fase 1.5 — rascunho | `feat/essay-draft-and-resume` | `774deb9` | 94/94 | Store local ≠ produção |
| 2026-10-21 | Fase 1.4 — RBAC de rotas | `fix/role-based-route-authorization` | `bd7d5ae` | 66/66 | Só no cliente |
| 2026-10-21 | Fase 1.3 — audit de produção | `chore/audit-production-advisories` | `2b9c4be` | 34/34 | — |
| 2026-10-21 | Fase 1.2 — sanitização HTML | `fix/sanitize-essay-html` | `006d484` | 34/34 | — |
| 2026-10-21 | Fase 1.1 — guard e papéis | `fix/auth-guard-and-demo-roles` | `96eb3d5` | 22 testes | — |
| 2026-10-21 | Fase 0 — governança | `chore/project-foundation` | `074db9d` | install + build | — |

## 10. Riscos, segurança e limites para usuários reais

- **Inadequado para dados reais de estudantes.** Sem backend, sem isolamento institucional, sem LGPD operacional. Menores de idade não devem usar este protótipo como sistema oficial.
- **Auth/RBAC no cliente:** RoleSwitcher e 403 são UX. Qualquer cliente pode ignorá-los.
- **`localStorage`:** overlay de redações e sessão demo são legíveis no mesmo navegador; não são autorização.
- **Upload:** arquivo não persistido; object URL de sessão; sem armazenamento seguro.
- **HTML:** sanitização no cliente não substitui validação no servidor.
- **Dev audit:** 9 advisories de toolchain (não produção).
- **Sidebar mobile:** overlay inicial bloqueia conteúdo abaixo de 1024px até o primeiro clique.
- **Sem atribuição** de correção; qualquer professor demo abre a mesma redação.
- **Demo pública** em emilabs.cloud **não** foi revalidada após o merge.

**Bloqueios atuais:** nenhum para documentação. Fase 2.1 não iniciada.

## 11. Próxima ação única e verificável

**Abrir `feat/backend-architecture-foundation` a partir de `main` @ `3ff3bd1` (após integrar este closeout, se publicado) e redigir o desenho da Fase 2.1: contratos de API e fronteiras do monólito em `backend/`, sem implementar código de produção.**

Critérios de aceite da Fase 2.1 (quando autorizada):

1. ADR ou documento de contratos para `auth`, `essays` e `corrections`.
2. Escolha documentada de Java LTS + Spring Boot + PostgreSQL + Flyway.
3. Frontend permanece na raiz; sem microserviços e sem mover para `apps/web`.
4. Nenhum endpoint inventado como se já existisse.

**Não fazer agora:** implementar Spring Boot, criar `backend/`, JWT, upload em nuvem, merge desta branch sem autorização, deploy, `npm audit fix` indiscriminado.
