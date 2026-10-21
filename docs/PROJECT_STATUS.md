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
| Última revisão documental | 2026-10-21 — Fase 1.5 (rascunho e retomada de redação) |
| Regra permanente da IA | `AGENTS.md` |
| Documentação de produto | `docs/PROJETO.md` |
| Branch desta entrega | `feat/essay-draft-and-resume` (local, sem push) |
| Base | `fix/role-based-route-authorization` em `bd7d5ae` |
| Demo pública | `https://emilabs.cloud/demo/redacaolab/` — **não validada** nesta execução |

## 2. Escopo do produto e MVP

**Perfis:** aluno, professor e administrador.

**MVP realista:** autenticação real no servidor → aluno rascunha/envia → professor corrige com rubrica da banca → aluno vê feedback persistido → admin básico.

**Fase 1.5 (esta entrega):** ciclo demonstrativo de rascunho textual persistido no navegador (criar → salvar → recarregar → retomar → enviar). Não é armazenamento de produção nem autorização segura. O Spring Boot deverá persistir e validar cada operação.

## 3. Estado verificado por componente

| Componente | Estado | Evidência |
|---|---|---|
| Frontend (páginas/UI) | **Protótipo operacional em build** | `VALIDADO EM EXECUÇÃO`: `npm run build` exit 0 em 2026-10-21 (Fase 1.5) |
| Login / papéis / guard | **Demonstração explícita** | Fase 1.1 preservada |
| Autorização de rotas (demo) | **UX no cliente** | Matriz + `essayEdit`; `RoleRoute` + 403 |
| Rascunho textual | **Persistência local demonstrativa** | `localStorage` `redacaolab-essays-v1`; overlay sobre mocks |
| HTML de redação | **Sanitizado no cliente** | Fase 1.2 + sanitização também no save |
| Editor TipTap | **Parcial** | TipTap 3.32; salvamento explícito, sem autosave |
| Backend / banco / upload | **Não iniciado** | Foto de redação continua só na sessão |
| Autorização real no servidor | **Não iniciado** | Persistência no navegador não autoriza |
| Testes automatizados | **Parciais** | Vitest; **94 testes / 17 arquivos** |
| Dependências | **Estáveis** | RR 7.18.4; TipTap 3.32.0 |
| Audit de produção | **0 vulnerabilidades** | `npm audit --omit=dev` em 2026-10-21 |

## 4. Fase 1.5 — rascunho e retomada

### 4.1 Estado anterior

Após a Fase 1.4: 66 testes, build verde, audit de produção limpo. `Salvar rascunho` não tinha `onClick`. `fakeApi.essays.create` só empilhava em `mockEssays` (perdido no F5). Não havia rota `/app/redacoes/:id/editar`. `Continuar editando` era um botão morto. A lista não anexava `theme` em `getByUser`.

### 4.2 Estratégia de persistência

**Escolhida: `localStorage` encapsulado**, não IndexedDB.

Justificativa: redações digitadas (HTML sanitizado + metadados) cabem na cota típica; a API síncrona simplifica o overlay com mocks; a camada (`essayPersistence` + `essayRepository`) pode ser trocada pela API Spring Boot sem mudar as telas.

Chave: `redacaolab-essays-v1`. Quarentena: `redacaolab-essays-v1-quarantine`.

Payload:

```json
{ "version": 1, "essays": [/* registros textuais */] }
```

Campos persistidos: `id`, `userId`, `themeId`, `type: "texto"`, `content`, `category`, `status`, `notes`, `wordCount`, `createdAt`, `updatedAt`, `submittedAt`.

Não persistidos: `File`, `imageUrl`/base64, objeto `theme`, correção do professor.

Merge: mocks imutáveis + overlay local (ID local vence) + imagens só de sessão. Sem duplicar ID.

Validação: JSON ilegível ou item incompatível vai para quarentena; registros válidos permanecem. Falha de `setItem` lança `EssayStorageError` — a UI não mostra sucesso.

**Isto não é armazenamento de produção.** Qualquer perfil demo no mesmo navegador pode ler o `localStorage`.

### 4.3 Rotas e fluxos

| Rota | Permissão | Comportamento |
|---|---|---|
| `/app/redacoes/nova` | `essayCreate` (aluno) | Nova redação textual ou foto |
| `/app/redacoes/:id/editar` | `essayEdit` (aluno) | Retoma só rascunho textual do dono |
| `/app/redacoes/:id` | `essayDetail` (aluno) | Leitura; `Continuar editando` se `canEditDraft` |

Fluxo: criar → escrever → **Salvar rascunho** (explícito) → URL vira `/editar/:id` → F5 / fechar navegador → lista → retomar → salvar de novo (mesmo ID) → **Enviar para correção** (status `enviada`, mesmo ID, lista e fila do professor). Envio direto sem rascunho prévio continua válido.

`actorId` vem da sessão, não de um `userId` solto no formulário. A camada de dados recusa: outro aluno, professor/admin na rota, status ≠ `rascunho`, overwrite de enviada como rascunho, ID inexistente.

Invalidação TanStack (prefixos): `['essays']`, `['essay', id]`, `['dashboard']`. Sem refetch global.

### 4.4 Arquivos principais

Novos: `src/lib/essayErrors.ts`, `src/lib/essayPersistence.ts`, `src/lib/essayRepository.ts`, `src/lib/essayQueryInvalidation.ts`, testes correspondentes, `NewEssay.draft.test.tsx`, `Essays.list.test.tsx`.

Alterados: `types`, `fakeApi`, `permissions`, `App.tsx`, `NewEssay`, `EssayDetail`, `Essays`, `setup.ts`, `RoleRoute.test.tsx`, `docs/PROJECT_STATUS.md`, `docs/PROJETO.md`.

### 4.5 Testes e build

| Verificação | Resultado |
|---|---|
| `npm test` | **94 passed / 17 files** (`VALIDADO EM EXECUÇÃO`) |
| `npm run build` | **Passou** — `index-D8UaFF5W.js` 1470.13 kB (gzip 445.99 kB) |
| `npm audit --omit=dev` | **0 vulnerabilidades** |

Os 66 testes da Fase 1.4 permaneceram verdes.

### 4.6 Validação no navegador

Servidor desta entrega: `http://localhost:3002/` (3000 e 3001 já ocupados). Dados de teste controlados; o `localStorage` pré-existente **não foi apagado**.

Marcador: `Fase15PersistenciaRascunhoLab`. ID estável observado: `essay-90acccf5-c8b8-4222-80e7-08654e068585`.

| Passo | Resultado |
|---|---|
| Aluno cria redação (tema-2, UNESP, texto + obs) | Formulário funcional; “Alterações não salvas” |
| Salvar rascunho | Toast “Rascunho salvo”; URL `/editar/:id` |
| Recarregar a URL de edição | Conteúdo, tema, UNESP e observações recuperados |
| Lista | Um card, tema correto, status Rascunho, link `/editar` |
| Salvar de novo | Mesmo ID; sem duplicata |
| Enviar para correção | Mesmo ID; status `enviada`; lista aponta para detalhe |
| Recarregar lista | Continua `enviada`, um registro |
| Abrir `/editar` após envio | 403 “Esta redação não pode ser editada” |
| Professor → fila | Card na correção com o mesmo ID |
| Voltar ao aluno | Vê só as próprias (sem `essay-3`); envio persistido |

`localStorage` após o ciclo: `version: 1`, 1 registro local, `userId: user-aluno-1`, `status: enviada`, `wordCount: 110`, sem `imageUrl`.

### 4.7 Limitações desta fase

- Persistência no navegador ≠ autorização. RoleSwitcher / DevTools podem alterar identidade e ler o store.
- Correções do professor **não** são persistidas; após F5, envio do aluno permanece `enviada`, mas nota/feedback novos somem.
- Upload de foto continua só na memória da sessão (não gravamos base64).
- Sem autosave — o texto não salvo some no F5 (há aviso e `beforeunload`).
- Overlay residual do onboarding (`fixed inset-0`) continua; `enterDemo('aluno')` zera o onboarding.
- Admin na lista de redações continua vazio.

## 5. Roadmap de entregas

| Fase | Estado | Objetivo / aceite |
|---|---|---|
| F0 — Governança e baseline | **Concluído** | `chore/project-foundation` |
| F1.1 — Auth guard e papéis demo | **Concluído** | `fix/auth-guard-and-demo-roles` |
| F1.2 — Sanitização HTML / XSS | **Concluído** | HTML de redação sanitizado |
| F1.3 — Audit de dependências de produção | **Concluído** | TipTap 3.32 + RR 7.18.4; audit prod = 0 |
| F1.4 — Autorização de rotas por papel | **Concluído** | Matriz única; 403; Sidebar alinhada; 66 testes |
| F1.5 — Rascunho e retomada | **Concluído** | Persistência local textual; mesmo ID no envio; 94 testes |
| F1 — Frontend confiável (restante) | **Em andamento** | timer/upload; botões sem mentir |
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
| P1 | Rascunho e retomada | **Concluído** | Fase 1.5 |
| P1 | Lista de redações com tema | **Concluído** | `theme` anexado no merge |
| P1 | Timer e upload validados | Pendente | Cronômetro e validação de arquivo |
| P1 | Persistência da correção do professor | Pendente | Hoje só sessão; envio do aluno já sobrevive ao F5 |
| P1 | Admin na lista de redações | Pendente | Hoje `getByUser(adminId)` tende a vazio |
| P1 | Correção rica e rubricas por modalidade | Pendente | Comentários/destaques |
| P1 | Backend Java / persistência | Pendente | API real + RBAC no servidor |
| P2 | Overlay residual do onboarding | Pendente | `fixed inset-0` às vezes permanece; `enterDemo` reinicia onboarding |
| P2 | Audit de *devDependencies* | Pendente | Vite/PostCSS/Rollup |
| P2 | CI / relatórios reais / IA | Pendente | Fora do frontend confiável imediato |

## 7. Decisões arquiteturais

**Definido nesta entrega:**

- Overlay `localStorage` versionado sobre mocks, encapsulado em `essayRepository`. IndexedDB não se justifica neste volume textual.
- `actorId` da sessão; propriedade e status validados na camada de dados, além da matriz `canEditDraft`.
- Salvamento explícito; sem anunciar autosave.
- Envio atualiza o mesmo ID (`rascunho` → `enviada`) e também persiste envios diretos textuais.
- Invalidação pontual das queries `essays` / `essay` / `dashboard`.

**Mantido:** sanitização no render; frontend na raiz; sem backend; RoleSwitcher é demonstração; matriz única de permissões.

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
| `npm test` | 2026-10-21 | **94 passed / 17 files** | 66 de regressão + cobertura de rascunho |
| `npm run build` | 2026-10-21 | **Passou** | `index-D8UaFF5W.js` 1470.13 kB (gzip 445.99 kB) |
| `npm audit --omit=dev` | 2026-10-21 | **0** | sem mudança de dependências |

Cobertura nova: persistência/quarentena, save sem duplicar, retomada após reset, envio com mesmo ID, recusa de outro usuário/status, ID inexistente, falha de storage, sanitização no save, invalidação de queries, rota `essayEdit`, UI de retomada e lista.

**Ambiente:** Windows 10, Node v24.16.0, npm 11.13.0. Dev desta entrega em `http://localhost:3002/`.

## 9. Registro de entregas

| Data | Entrega | Branch | Commit(s) | Validação real | Riscos / pendências |
|---|---|---|---|---|---|
| 2026-10-21 | Fase 1.5 — rascunho e retomada | `feat/essay-draft-and-resume` | ver git log desta branch | 94/94; build exit 0; audit 0; smoke persistência + sem duplicata | Sem push; store local ≠ produção |
| 2026-10-21 | Fase 1.4 — RBAC de rotas na demo | `fix/role-based-route-authorization` | `bd7d5ae` e anteriores | 66/66; build; audit 0 | Autorização só no cliente |
| 2026-10-21 | Fase 1.3 — audit de produção | `chore/audit-production-advisories` | `960e2bd` `7e6ad00` `2b9c4be` | 34/34; build; audit 0 | base desta linha |
| 2026-10-21 | Fase 1.2 — sanitização HTML | `fix/sanitize-essay-html` | `fc5776c` … `006d484` | 34/34 | — |
| 2026-10-21 | Fase 1.1 — guard e papéis demo | `fix/auth-guard-and-demo-roles` | `9f340ad` … `96eb3d5` | 22 testes | — |
| 2026-10-21 | Fase 0 — governança | `chore/project-foundation` | `b696691` … `074db9d` | install + build | — |

## 10. Riscos e bloqueios atuais

- **Produção:** sem backend. `localStorage` e RBAC no cliente são necessários para a demo, insuficientes para SaaS e inadequados a dados reais de estudantes.
- **Sessão no `localStorage`** e RoleSwitcher permanecem.
- **Correção do professor** ainda some no F5.
- **npm *dev*:** 6 highs de toolchain (Fase 1.3).
- **Bloqueios:** nenhum. Push/PR/deploy exigem autorização.

## 11. Próxima ação única e verificável

**Abrir `feat/essay-timer-and-upload` a partir de `feat/essay-draft-and-resume` e validar o cronômetro da redação + o upload de imagem (tamanho/MIME), sem persistir base64 nem iniciar backend.**

Critérios de aceite:

1. Timer inicia/pausa/exibe tempo real; não mente se ainda for demonstração incompleta.
2. Upload rejeita arquivo inválido com feedback; imagem continua fora do store textual.
3. Os 94 testes atuais continuam verdes + cobertura do timer/upload.
4. `docs/PROJECT_STATUS.md` atualizado com evidência.

**Não fazer nessa tarefa:** backend, JWT, autosave, correção por IA, redesign, push/merge, nem `npm audit fix` de *devDependencies*.
