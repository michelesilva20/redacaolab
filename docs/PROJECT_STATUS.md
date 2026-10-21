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
| Última revisão documental | 2026-10-21 — Fase 1.4 (autorização de rotas por papel na demo) |
| Regra permanente da IA | `AGENTS.md` |
| Documentação de produto | `docs/PROJETO.md` |
| Branch desta entrega | `fix/role-based-route-authorization` (local, sem push) |
| Base | `chore/audit-production-advisories` em `2b9c4be` |
| Demo pública | `https://emilabs.cloud/demo/redacaolab/` — **não validada** nesta execução |

## 2. Escopo do produto e MVP

**Perfis:** aluno, professor e administrador.

**MVP realista:** autenticação real no servidor → aluno rascunha/envia → professor corrige com rubrica da banca → aluno vê feedback persistido → admin básico.

**Fase 1.4 (esta entrega):** RBAC de **navegação** na demonstração frontend. Não constitui autorização segura de produção. O Spring Boot deverá validar identidade, papel, propriedade do recurso e escopo institucional em **cada** operação.

## 3. Estado verificado por componente

| Componente | Estado | Evidência |
|---|---|---|
| Frontend (páginas/UI) | **Protótipo operacional em build** | `VALIDADO EM EXECUÇÃO`: `npm run build` exit 0 em 2026-10-21 (Fase 1.4) |
| Login / papéis / guard | **Demonstração explícita** | Fase 1.1 preservada |
| Autorização de rotas (demo) | **UX no cliente** | Matriz em `src/lib/permissions.ts`; `RoleRoute` + 403 |
| HTML de redação | **Sanitizado no cliente** | Fase 1.2 intacta |
| Editor TipTap | **Parcial** | TipTap 3.32 / `prosemirror-view@1.42.6` |
| Backend / banco / upload | **Não iniciado** | — |
| Autorização real no servidor | **Não iniciado** | — |
| Testes automatizados | **Parciais** | Vitest; **66 testes / 12 arquivos** |
| Dependências | **Estáveis** | RR 7.18.4; TipTap 3.32.0 |
| Audit de produção | **0 vulnerabilidades** | `npm audit --omit=dev` em 2026-10-21 |

## 4. Fase 1.4 — autorização de rotas por papel

### 4.1 Estado anterior

Após a Fase 1.3: 34 testes, build verde, audit de produção limpo. `ProtectedRoute` só exigia sessão demo. A Sidebar já filtrava itens por papel, mas as URLs (`/app/usuarios`, `/app/correcao/:id`, `/app/feedback/:id`, etc.) abriam para qualquer perfil autenticado. CTAs de “nova redação” apareciam para professor/admin. Feedback de outro aluno era acessível pelo ID.

### 4.2 Matriz final

Ajustes em relação à proposta inicial, após ler os fluxos:

| Recurso | Aluno | Professor | Admin | Justificativa |
|---|---|---|---|---|
| Dashboard | Sim | Sim | Sim | Proposta |
| Aulas / detalhe | Sim | Sim | Sim | Proposta |
| Temas / detalhe | Sim | Sim | Sim | Proposta |
| Lista de redações | Sim | Sim | Sim | Proposta |
| Nova redação | Sim | Não | Não | Proposta |
| Detalhe da redação | Sim (própria) | Não | Não | Não estava na tabela; é a vista do autor |
| Correção | Não | Sim (enviada / em_correção) | Não | Proposta + regra de status da fila |
| Feedback pessoal | Sim (próprio) | Não | Não | Proposta + propriedade do recurso |
| Turmas | Não | Sim | Sim | Proposta |
| Usuários | Não | Não | Sim | Proposta |
| Relatórios | Não | Sim | Sim | Proposta |
| Configurações | Não | Não | Sim | Proposta |
| Ajuda | Sim | Sim | Sim | Proposta |
| Perfil | Sim | Sim | Sim | Fora da tabela; já existia no menu da Topbar |

Fonte única: `PERMISSIONS` + `NAV_ITEMS` em `src/lib/permissions.ts`. Sidebar, `RoleRoute` e CTAs (`IfCan`) leem essa matriz. Não há segunda lista de papéis no menu.

### 4.3 Comportamentos

- Sem sessão demo → `/login` (`ProtectedRoute`).
- Autenticado sem papel → 403 (`ForbiddenPage`), URL permanece, sem loop.
- F5 em rota restrita → continua 403 (aluno em `/app/usuarios`).
- Troca de perfil em rota agora proibida → `replace` para `/app`.
- Aluno em `/app/feedback/essay-3` (outro autor) → 403 de recurso.
- Professor em rascunho/já corrigida → 403 de negócio da demo.
- CTAs de escrever redação só para aluno.
- Configurações no menu do usuário só para admin.

### 4.4 Arquivos principais

Novos: `src/lib/permissions.ts`, `src/components/RoleRoute.tsx`, `src/components/ForbiddenPage.tsx`, `src/components/IfCan.tsx`, `src/hooks/useSafeRoleNavigation.ts`, testes correspondentes.

Alterados: `App.tsx`, `AppLayout`, `Sidebar`, `Topbar`, Dashboard, Temas, ThemeDetail, LessonDetail, Essays, EssayDetail, Feedback, Correction, `SafeEssayContent.test.tsx` (sessão aluno para o teste de XSS), `docs/PROJECT_STATUS.md`, `docs/PROJETO.md`.

### 4.5 Limitações (o que o backend precisa fazer)

- Qualquer papel pode ser escolhido no cliente (`RoleSwitcher` / `localStorage`).
- A fake API ainda devolve qualquer redação por ID; a UI é que recusa.
- Isolamento institucional, atribuição de correção e auditoria não existem.
- Overlay residual do onboarding (`fixed inset-0`) continua fora desta fase.

## 5. Roadmap de entregas

| Fase | Estado | Objetivo / aceite |
|---|---|---|
| F0 — Governança e baseline | **Concluído** | `chore/project-foundation` |
| F1.1 — Auth guard e papéis demo | **Concluído** | `fix/auth-guard-and-demo-roles` |
| F1.2 — Sanitização HTML / XSS | **Concluído** | HTML de redação sanitizado |
| F1.3 — Audit de dependências de produção | **Concluído** | TipTap 3.32 + RR 7.18.4; audit prod = 0 |
| F1.4 — Autorização de rotas por papel | **Concluído** | Matriz única; 403; Sidebar alinhada; 66 testes |
| F1 — Frontend confiável (restante) | **Em andamento** | rascunho/timer/upload; botões sem mentir |
| F2 — Backend e persistência | **Pendente** | Inclui RBAC e validação de HTML no servidor |
| F3 — Fluxo pedagógico completo | **Pendente** | Auth/RBAC reais |
| F4 — Qualidade e release | **Pendente** | E2E, CI, a11y |
| F5 — Diferenciais | **Pendente** | Rubricas, métricas, IA opcional |

## 6. Backlog priorizado

| Prioridade | Item | Estado | Aceite resumido |
|---|---|---|---|
| P0 | Baseline, guard, papéis demo | **Concluído** | Fases 0 e 1.1 |
| P0 | HTML de redação não confiável | **Concluído** | Sanitização + testes |
| P0 | Vulnerabilidades npm de produção | **Concluído** | Fase 1.3 |
| P0 | Rotas vs papéis na demo | **Concluído** | Fase 1.4 |
| P1 | Rascunho e retomada | Pendente | Salvar, listar, reabrir + invalidar cache |
| P1 | Timer e upload validados | Pendente | Cronômetro e validação de arquivo |
| P1 | Lista de redações com tema | Pendente | Anexar `theme` em `getByUser` |
| P1 | Admin na lista de redações | Pendente | Hoje `getByUser(adminId)` tende a vazio |
| P1 | Correção rica e rubricas por modalidade | Pendente | Comentários/destaques |
| P1 | Backend Java / persistência | Pendente | API real + RBAC no servidor |
| P2 | Overlay residual do onboarding | Pendente | `fixed inset-0` às vezes permanece |
| P2 | Audit de *devDependencies* | Pendente | Vite/PostCSS/Rollup |
| P2 | CI / relatórios reais / IA | Pendente | Fora do frontend confiável imediato |

## 7. Decisões arquiteturais

**Definido nesta entrega:**

- Uma matriz tipada (`PERMISSIONS`) alimenta rotas, menu e CTAs.
- 403 na URL original para acesso direto; redirect ao dashboard só na **troca de perfil**.
- Propriedade de redação/feedback e status corrigível são regras de demo, anunciadas como tais.
- Perfil (`/app/perfil`) permitido a todos os autenticados.

**Mantido:** sanitização no render; frontend na raiz; sem backend; RoleSwitcher é demonstração.

## 8. Testes, comandos e ambientes

```bash
npm install
npm run dev
npm run build
npm run preview
npm test
npm audit --omit=dev
```

| Verificação | Última execução | Resultado | Evidência |
|---|---|---|---|
| `npm test` | 2026-10-21 | **66 passed / 12 files** | 34 de regressão + 32 novos |
| `npm run build` | 2026-10-21 | **Passou** | `index-LTlTwS6W.js` 1459.78 kB (gzip 443.12 kB) |
| `npm audit --omit=dev` | 2026-10-21 | **0** | sem mudança de dependências |

Cobertura nova: matriz e paths, Sidebar ≡ `canAccessPath`, RoleRoute (login / allow / 403 / F5), troca de perfil sem loop, feedback de outro aluno.

**Ambiente:** Windows 10, Node v24.16.0, npm 11.13.0. Dev em `http://localhost:3001/`.

**Smoke no browser (`VALIDADO EM EXECUÇÃO`):**

| Fluxo | Resultado |
|---|---|
| Login aluno | Dashboard; menu sem Turmas/Usuários/Relatórios/Config; CTA “Escrever nova redação” |
| Aluno em `/app/usuarios` | 403 “Acesso não permitido”; URL mantida |
| Aluno em `/app/feedback/essay-3` | 403 “Feedback de outro aluno” |
| Troca para professor nessa URL | `href` foi para `/app` |
| Login professor | Menu com Turmas e Relatórios, sem Usuários |
| Professor em `/app/redacoes/nova` | 403 |
| Login admin + `/app/usuarios` | Página “Usuários”; menu completo |
| Recarregar `/app/usuarios` como admin | Permanece na lista (sessão + papel) |

## 9. Registro de entregas

| Data | Entrega | Branch | Commit(s) | Validação real | Riscos / pendências |
|---|---|---|---|---|---|
| 2026-10-21 | Fase 1.4 — RBAC de rotas na demo | `fix/role-based-route-authorization` | ver git log desta branch | 66/66; build exit 0; audit 0; smoke local | Sem push; autorização só no cliente |
| 2026-10-21 | Fase 1.3 — audit de produção | `chore/audit-production-advisories` | `960e2bd` `7e6ad00` `2b9c4be` | 34/34; build; audit 0 | base desta branch |
| 2026-10-21 | Fase 1.2 — sanitização HTML | `fix/sanitize-essay-html` | `fc5776c` … `006d484` | 34/34 | — |
| 2026-10-21 | Fase 1.1 — guard e papéis demo | `fix/auth-guard-and-demo-roles` | `9f340ad` … `96eb3d5` | 22 testes | — |
| 2026-10-21 | Fase 0 — governança | `chore/project-foundation` | `b696691` … `074db9d` | install + build | — |

## 10. Riscos e bloqueios atuais

- **Produção:** sem backend. RBAC no cliente é necessário para a demo, insuficiente para SaaS.
- **Sessão no `localStorage`** e RoleSwitcher permanecem.
- **npm *dev*:** 6 highs de toolchain (Fase 1.3).
- **Bloqueios:** nenhum. Push/PR/deploy exigem autorização.

## 11. Próxima ação única e verificável

**Abrir `feat/essay-draft-and-resume` a partir de `fix/role-based-route-authorization` e implementar rascunho/retomada de redação (P1), sem iniciar backend.**

Critérios de aceite:

1. Aluno salva rascunho, lista e reabre no editor.
2. Cache TanStack invalidado de forma explícita.
3. Os 66 testes atuais continuam verdes + cobertura do rascunho.
4. `docs/PROJECT_STATUS.md` atualizado com evidência.

**Não fazer nessa tarefa:** backend, JWT, redesign, push/merge, nem `npm audit fix` de *devDependencies*.
