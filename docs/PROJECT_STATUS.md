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
| Última revisão documental | 2026-10-30 — Fase 1.7 (persistência da correção do professor) |
| Regra permanente da IA | `AGENTS.md` |
| Documentação de produto | `docs/PROJETO.md` |
| Branch desta entrega | `feat/professor-correction-persist` (local, sem push) |
| Base | `feat/essay-timer-and-upload` em `b05dd7a` |
| Demo pública | `https://emilabs.cloud/demo/redacaolab/` — **não validada** nesta execução |

## 2. Escopo do produto e MVP

**Perfis:** aluno, professor e administrador.

**MVP realista:** autenticação real no servidor → aluno rascunha/envia → professor corrige com rubrica da banca → aluno vê feedback persistido → admin básico.

**Fase 1.7 (esta entrega):** persistência demonstrativa da correção do professor no overlay local de redações. Ciclo: aluno envia → professor salva rascunho → retoma → finaliza → aluno vê feedback após F5. Não é backend, atribuição automática nem upload persistente.

## 3. Estado verificado por componente

| Componente | Estado | Evidência |
|---|---|---|
| Frontend (páginas/UI) | **Protótipo operacional em build** | `VALIDADO EM EXECUÇÃO`: `npm run build` exit 0 em 2026-10-30 |
| Login / papéis / guard | **Demonstração explícita** | Fases 1.1 e 1.4 preservadas |
| Autorização de rotas (demo) | **UX no cliente** | Matriz + `RoleRoute` + 403 |
| Rascunho textual | **Persistência local demonstrativa** | Overlay `redacaolab-essays-v1` |
| Correção do professor | **Persistência local demonstrativa** | Mesmo overlay; rascunho e finalização |
| Cronômetro / upload / onboarding | **Preservados** | Fase 1.6 intacta |
| Backend / banco / upload real | **Não iniciado** | Foto e correção de foto só na sessão |
| Autorização real no servidor | **Não iniciado** | Persistência no navegador não autoriza |
| Testes automatizados | **Parciais** | Vitest; **127 testes / 24 arquivos** |
| Dependências | **Estáveis, com 1 high novo em zod** | RR 7.18.4; TipTap 3.32.0; zod ^4.3.6 |
| Audit de produção | **1 high (zod)** | `npm audit --omit=dev` em 2026-10-30 |

## 4. Fase 1.7 — persistência da correção

### 4.1 Estado anterior

Após a Fase 1.6 (`b05dd7a`): 110 testes, build verde, audit de produção 0. Redações textuais e o cronômetro sobreviviam ao F5. `fakeApi.corrections.submit` gerava um ID novo a cada save, mutava `mockEssays` e só aplicava `sessionPatches` — a correção sumia no recarregamento.

### 4.2 Estratégia de persistência

**Escolhida:** evoluir `redacaolab-essays-v1` com um campo opcional `correction` no `PersistedEssayRecord`. Uma segunda store concorrente não se justifica: a correção pertence à redação, o overlay já é a fonte de merge e a troca futura por Spring Boot continua atrás de `essayRepository`.

Compatibilidade: registros antigos sem `correction` continuam válidos. Correção inválida é omitida na leitura **sem** apagar a redação nem reescrever o store. Mocks originais não são mutados; overlay local vence no merge.

Foto (`type: imagem`): a correção permanece só na sessão. Não gravamos `imageUrl`/base64 no overlay textual.

### 4.3 Modelo e transições

Uma redação tem no máximo uma correção ativa. O ID da correção é estável (`corr-` + UUID). O conteúdo enviado pelo aluno não é reescrito na correção.

| Operação | Essay.status | Correction.status |
|---|---|---|
| Salvar rascunho | `enviada` \| `em_correcao` → `em_correcao` | `rascunho` |
| Finalizar (com ou sem rascunho prévio) | → `corrigida` | `finalizada` + `finishedAt` |

Notas: inteiros 0–200 nas cinco competências da rubrica ENEM efetivamente suportada na UI. Total = soma. Zero é valor válido. UNESP/concursos ainda usam essa escala na tela — não inventamos rubrica própria.

Comentários por trecho e highlights existem no tipo e são preservados se já houver; a tela ainda envia/restaura arrays e **não** implementa marcação interativa.

### 4.4 Regras de acesso demonstrativas

- Aluno e admin não executam `saveCorrectionDraft` / `finalizeCorrection`.
- Professor da sessão (qualquer `role === 'professor'` nos mocks) pode assumir redação `enviada` ou `em_correcao`. **Não há atribuição** no modelo atual.
- Rascunho não enviado e correção já finalizada são recusados na camada de dados.
- O aluno só vê feedback próprio com `status === 'corrigida'` e correção `finalizada`.
- Isto continua sendo demonstração. O servidor deverá validar cada operação.

### 4.5 Cache TanStack

`invalidateEssayRelatedQueries` após salvar/finalizar: `['essays']`, `['dashboard']`, `['essay', id]`. A fila do professor usa `['essays', role, userId]`; o prefixo cobre. Sem refetch global.

### 4.6 Arquivos principais

Novos: `src/lib/correctionPersistence.ts`, `src/lib/essayRepository.correction.test.ts`, `src/pages/Correction/Correction.test.tsx`, `src/pages/Feedback/Feedback.test.tsx`.

Alterados: `essayPersistence`, `essayRepository`, `fakeApi`, `permissions` (+ teste), `Correction`, `Feedback`, `docs/PROJECT_STATUS.md`, `docs/PROJETO.md`.

### 4.7 Testes e build

| Verificação | Resultado |
|---|---|
| `npm test` | **127 passed / 24 files** (`VALIDADO EM EXECUÇÃO`) |
| `npm run build` | **Passou** — `index-Dda2Qvcz.js` 1488.39 kB (gzip 451.13 kB) |
| `npm audit --omit=dev` | **1 high** — `zod` < 4.6.6, [GHSA-mrhx-c7xc-m3w5](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5) |

Os 110 testes da Fase 1.6 permaneceram verdes. Não executamos `npm audit fix`.

Cobertura nova: iniciar/salvar/retomar correção; ID estável; sem duplicar redação; conteúdo original; finalizar parcial e direta; nota zero e inválida; `finishedAt`; fila; feedback após reset; bloqueio de outro aluno/aluno/admin/finalizada/inexistente; correção inválida isolada; falha de storage; mocks e rascunhos 1.5; timer 1.6; ausência de `data:image`; hidratação da tela; feedback parcial vs finalizado.

### 4.8 Validação no navegador

Servidor: `http://localhost:3000/`. Identidade `user-aluno-1` / `user-prof-1`. Storage pré-existente **não foi apagado**. Marcador: `Fase17PersistenciaCorrecaoLab`. ID: `essay-6472f056-5f1d-4657-b4fb-0326cd561270`. Correção: `corr-5e958ed4-5300-43ef-914b-3ebed4008eca`.

| Passo | Resultado |
|---|---|
| Aluno cria, salva e envia (tema-3, 110 palavras) | URL de edição; depois lista |
| Professor abre a fila e a correção | Formulário com o texto original |
| Notas (C1 = 0) + parecer + pontos | Persistido; `em_correcao` / `rascunho`; 1 registro |
| F5 na correção | Campos restaurados (C1 0, parecer Fase17, forças/melhorias) |
| Finalizar | `corrigida` / `finalizada`; `finishedAt` 2026-10-30T14:12:26.784Z; total 640; mesmo ID |
| Fila do professor | Sem o ID novo; mocks essay-2/3/4 permanecem |
| Reabrir correção finalizada | “Redação indisponível para correção”; sem Finalizar |
| Aluno abre feedback + F5 | 640, parecer, pontos, texto original |
| Mock essay-1 | Feedback 820 intacto |
| Store | Sem `data:image`; sem duplicata do ID |

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
| F1 — Frontend confiável (restante) | **Em andamento** | Lista do admin; rubricas por modalidade |
| F2 — Backend e persistência | **Pendente** | RBAC, upload real, HTML no servidor |
| F3 — Fluxo pedagógico completo | **Pendente** | Auth/RBAC reais |
| F4 — Qualidade e release | **Pendente** | E2E, CI, a11y |
| F5 — Diferenciais | **Pendente** | Rubricas, métricas, IA opcional |

## 6. Backlog priorizado

| Prioridade | Item | Estado | Aceite resumido |
|---|---|---|---|
| P0 / P1 anteriores | Guard, sanitização, audit, RBAC, rascunho, timer, upload, onboarding | **Concluído** | Fases 0–1.6 |
| P1 | Persistência da correção do professor | **Concluído** | Fase 1.7 |
| P1 | Admin na lista de redações | Pendente | `getByUser(adminId)` tende a vazio |
| P1 | Rubricas por modalidade | Pendente | UI ainda usa escala ENEM para UNESP/concursos |
| P1 | Backend Java / persistência | Pendente | API real + RBAC + upload |
| P2 | Overlay da sidebar no viewport estreito | Pendente | `sidebarOpen` inicia `true`; backdrop `lg:hidden` |
| P2 | Correção de foto persistida | Pendente | Hoje só sessão; sem base64 |
| P2 | Comentários/destaques interativos | Pendente | Campos existem; UI não edita trechos |
| P2 | Advisory zod GHSA-mrhx-c7xc-m3w5 | Pendente | High de *dev input*; sem `audit fix` nesta fase |
| P2 | Audit de *devDependencies* / CI / IA | Pendente | Fora do escopo imediato |

## 7. Decisões arquiteturais

**Definido nesta entrega:**

- Correção aninhada no overlay `redacaolab-essays-v1`, não numa store paralela.
- Escrita composta status+correção numa única operação lógica.
- Qualquer professor demo autorizado pode assumir redação elegível; sem fila de distribuição.
- Feedback do aluno exige correção `finalizada`.
- Correção de imagem permanece em sessão.

**Mantido:** overlay textual da Fase 1.5; timer 1.6; salvamento explícito; sanitização; RoleSwitcher; matriz única; frontend na raiz; sem backend.

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
| `npm test` | 2026-10-30 | **127 passed / 24 files** | 110 de regressão + correção |
| `npm run build` | 2026-10-30 | **Passou** | `index-Dda2Qvcz.js` 1488.39 kB (gzip 451.13 kB) |
| `npm audit --omit=dev` | 2026-10-30 | **1 high (zod)** | GHSA-mrhx-c7xc-m3w5; sem bump |

**Ambiente:** Windows 10, Node v24.16.0, npm 11.13.0. Dev desta entrega em `http://localhost:3000/`.

## 9. Registro de entregas

| Data | Entrega | Branch | Commit(s) | Validação real | Riscos / pendências |
|---|---|---|---|---|---|
| 2026-10-30 | Fase 1.7 — correção persistida | `feat/professor-correction-persist` | `ceff47b` `ac0ad5f` `e573296` + docs | 127/127; build exit 0; smoke A/B/C | Sem push; 1 high zod; foto só sessão |
| 2026-10-21 | Fase 1.6 — timer, upload e onboarding | `feat/essay-timer-and-upload` | `3077d1c` `5488733` `0eadbee` `5274648` `b05dd7a` | 110/110; build; audit 0 | Sidebar overlay |
| 2026-10-21 | Fase 1.5 — rascunho e retomada | `feat/essay-draft-and-resume` | `774deb9` e anteriores | 94/94 | Store local ≠ produção |
| 2026-10-21 | Fase 1.4 — RBAC de rotas | `fix/role-based-route-authorization` | `bd7d5ae` | 66/66 | Autorização só no cliente |
| 2026-10-21 | Fase 1.3 — audit de produção | `chore/audit-production-advisories` | `2b9c4be` | 34/34; audit 0 | — |
| 2026-10-21 | Fase 1.2 — sanitização HTML | `fix/sanitize-essay-html` | `006d484` | 34/34 | — |
| 2026-10-21 | Fase 1.1 — guard e papéis | `fix/auth-guard-and-demo-roles` | `96eb3d5` | 22 testes | — |
| 2026-10-21 | Fase 0 — governança | `chore/project-foundation` | `074db9d` | install + build | — |

## 10. Riscos e bloqueios atuais

- **Produção:** sem backend. `localStorage` e RBAC no cliente não autorizam dados reais de estudantes.
- **zod 4.3.x:** advisory GHSA-mrhx-c7xc-m3w5 (exaustão de memória em coleções grandes). Origem: dependência já presente; não introduzida pelo código da 1.7. Impacto na demo: baixo (não há parser Zod de payload arbitrário nesta fase). Sem `npm audit fix`.
- **Foto / correção de foto:** só sessão.
- **Sidebar mobile:** backdrop intercepta cliques em viewport `< lg`.
- **Sem atribuição** de professor; qualquer professor demo pode abrir a mesma redação.
- **Bloqueios:** nenhum. Push/PR/deploy exigem autorização.

## 11. Próxima ação única e verificável

**Abrir `feat/admin-essay-visibility` a partir de `feat/professor-correction-persist` e definir o que o admin vê na lista de redações, sem backend e sem inventar métricas.**

Critérios de aceite:

1. Admin deixa de cair numa lista vazia enganosa.
2. Ação alinhada à matriz da Fase 1.4 (sem conceder correção ao admin).
3. Os 127 testes atuais continuam verdes + cobertura da lista.
4. `docs/PROJECT_STATUS.md` atualizado com evidência.

**Não fazer nessa tarefa:** backend, JWT, upload em nuvem, correção por IA, redesign, push/merge, nem `npm audit fix` indiscriminado.
