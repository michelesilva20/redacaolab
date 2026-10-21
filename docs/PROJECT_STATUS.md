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
| Última revisão documental | 2026-10-21 — Fase 1.3 (auditoria de dependências de produção) |
| Regra permanente da IA | `AGENTS.md` |
| Documentação de produto | `docs/PROJETO.md` |
| Branch desta entrega | `chore/audit-production-advisories` (local, sem push) |
| Base | `fix/sanitize-essay-html` em `006d484` |
| Demo pública | `https://emilabs.cloud/demo/redacaolab/` — **não validada** nesta execução |

## 2. Escopo do produto e MVP

**Perfis:** aluno, professor e administrador.

**MVP realista:** autenticação real no servidor → aluno rascunha/envia → professor corrige com rubrica da banca → aluno vê feedback persistido → admin básico.

**Fase 1.3 (esta entrega):** classificar e remediar, de forma incremental, as 6 vulnerabilidades *high* reportadas por `npm audit --omit=dev`. Não é declaração de segurança completa da plataforma.

## 3. Estado verificado por componente

| Componente | Estado | Evidência |
|---|---|---|
| Frontend (páginas/UI) | **Protótipo operacional em build** | `VALIDADO EM EXECUÇÃO`: `npm run build` exit 0 em 2026-10-21 (Fase 1.3) |
| Login / papéis / guard | **Demonstração explícita (Fase 1.1)** | Preservado; smoke com RR 7.18.4 |
| HTML de redação | **Sanitizado no cliente** | Fase 1.2 intacta (`sanitizeEssayHtml` + `SafeEssayContent`) |
| Editor TipTap | **Parcial, dependências atualizadas** | `@tiptap/*@3.32.0` → `prosemirror-view@1.42.6` |
| Lista de redações | **Parcial / seguro para XSS** | Preview em texto React |
| Backend / banco / upload | **Não iniciado** | — |
| Autorização real | **Não iniciado** | — |
| Testes automatizados | **Parciais** | Vitest; **34 testes** (7 arquivos) ainda verdes |
| Dependências React | **Declaradas** | `react` / `react-dom` `^19.2.4` |
| React Router | **Atualizado** | `react-router-dom@7.18.4` → `react-router@7.18.4` |
| DOMPurify | **Mantido** | `dompurify@^3.4.17` |
| Audit de produção | **0 vulnerabilidades** | `npm audit --omit=dev` em 2026-10-21 |

## 4. Fase 1.3 — auditoria de dependências

### 4.1 Baseline anterior (Fase 1.2)

`VALIDADO EM EXECUÇÃO` em `fix/sanitize-essay-html`:

| Métrica | Antes |
|---|---|
| `npm audit --omit=dev` | **6 high** em 5 pacotes |
| Famílias reais | 2 (TipTap/ProseMirror/markdown-it e React Router) |
| TipTap direto | `@tiptap/*@3.20.0` |
| `prosemirror-view` | `1.41.6` (via `@tiptap/pm`) |
| `markdown-it` | `14.1.1` (via `prosemirror-markdown`) |
| `linkify-it` | `5.0.0` (via `markdown-it`) |
| `react-router-dom` / `react-router` | `7.13.0` |

Seis highs no relatório **não** eram seis causas independentes: npm agrupa por pacote. Havia advisories distintos, pacotes distintos e duas metavulnerabilidades (árvore TipTap e árvore Router).

### 4.2 Advisories identificados

| Família | Pacote instalado (antes) | Advisory / intervalo | Severidade | Origem | Exploração no RedaçãoLab | Correção |
|---|---|---|---|---|---|---|
| TipTap / ProseMirror | `prosemirror-view@1.41.6` | [GHSA-c8x8-7fp4-3x9w](https://github.com/advisories/GHSA-c8x8-7fp4-3x9w) — XSS no paste de HTML; vulnerável `<1.42.3`; corrigido `1.42.3` | high | Transitiva: `@tiptap/react@3.20.0` → `@tiptap/pm` → `prosemirror-view` | **Sim, relevante.** Editor aceita colagem; sanitização da Fase 1.2 ocorre só na *exibição*. | TipTap `3.32.0` puxa `prosemirror-view@^1.42.6` |
| TipTap | `@tiptap/core@3.20.0` (≤3.30.4 no advisory) | XSS reportado no núcleo TipTap | high | Transitiva dos quatro pacotes `@tiptap/*` diretos | **Parcial.** Mesmo editor; mitigação de render existe, não fecha o advisory. | Mesmo bump alinhado `3.32.0` |
| markdown-it | `markdown-it@14.1.1` (≤14.3.2) | Advisories de markdown-it 14.x | high | Transitiva: `@tiptap/pm` → `prosemirror-markdown` → `markdown-it` | **Baixa.** App não importa `markdown-it`. Risco era cadeia de build/editor. | Removido da árvore: `@tiptap/pm@3.32.0` não depende mais de `prosemirror-markdown` |
| linkify-it | `linkify-it@5.0.0` (≤5.0.1) | Advisories de linkify-it 5.x | high | Transitiva de `markdown-it` | **Baixa.** Mesmo caminho. | Saiu junto com `markdown-it` |
| React Router | `react-router@7.13.0` (6.0.0–7.18.1) | Vários GHSA no mesmo intervalo (SSR/RSC/DoS/redirect/CSRF). Inclui [GHSA-wrjc-x8rr-h8h6](https://github.com/advisories/GHSA-wrjc-x8rr-h8h6) e [GHSA-2j2x-hqr9-3h42](https://github.com/advisories/GHSA-2j2x-hqr9-3h42) (open redirect em `Link`/`useNavigate`) | high | Direta via `react-router-dom@7.13.0` | **Mista.** App é SPA Vite (`BrowserRouter`), sem RSC/SSR/single-fetch — vários GHSA não se aplicam. Open redirect em `Link`/`navigate` é o mais próximo do código real. | `react-router-dom@7.18.4` (não v8) |
| React Router DOM | `react-router-dom@7.13.0` (7.0.0-pre–7.14.1) | Depende de `react-router` vulnerável | high | Dependência direta | Idem | Mesmo pin `7.18.4` |

Advisories do `react-router` 7.13 listados pelo npm (nem todos exploráveis nesta SPA): `GHSA-49rj-9fvp-4h2h`, `GHSA-8646-j5j9-6r62`, `GHSA-8x6r-g9mw-2r78`, `GHSA-rxv8-25v2-qmq8`, `GHSA-84g9-w2xq-vcv6`, `GHSA-wrjc-x8rr-h8h6`, `GHSA-h8fp-f39c-q6mh`, `GHSA-337j-9hxr-rhxg`, `GHSA-chx6-hx7r-mcp5`, `GHSA-2j2x-hqr9-3h42`, `GHSA-qwww-vcr4-c8h2`, `GHSA-f22v-gfqf-p8f3`.

### 4.3 Decisões de atualização

1. **Não** usar `npm audit fix`, `--force`, `--legacy-peer-deps` nem overrides.
2. Atualizar **família TipTap inteira** para `3.32.0` (menor major estável que puxa `prosemirror-view >= 1.42.3`). Sem override.
3. **Não** atualizar `markdown-it` por override: a origem (`@tiptap/pm`) deixou de puxar `prosemirror-markdown`.
4. Atualizar **React Router só no 7.x**: `7.18.4` (wanted do `npm outdated`). **Não** migrar para v8 (`8.5.0` era latest; exigiria fase própria).
5. Toolchain de *dev* (Vite, PostCSS, Rollup, etc.) **fora desta fase**.

### 4.4 Mudanças realizadas

| Commit | O que mudou |
|---|---|
| `960e2bd` | `@tiptap/react`, `starter-kit`, `extension-character-count`, `extension-placeholder` `^3.20.0` → `^3.32.0`. Lock: `prosemirror-view@1.42.6`; removidos `markdown-it`, `linkify-it`, `prosemirror-markdown`. |
| `7e6ad00` | `react-router-dom` `^7.13.0` → `^7.18.4` (pin de `react-router@7.18.4`). |
| (docs) | Este arquivo. |

Nenhuma alteração de código de aplicação. `docs/PROJETO.md` sem mudança arquitetural.

### 4.5 Comparação do audit

| Escopo | Antes (Fase 1.2) | Depois (Fase 1.3) |
|---|---|---|
| `npm audit --omit=dev` | 6 high | **0** |
| `npm audit` (inclui dev) | não era o alvo | **9** (2 low, 1 moderate, 6 high) — só toolchain |

**Não declarar segurança completa** só porque o audit de produção ficou limpo. Auth demo, ausência de backend e sanitização só no cliente permanecem.

### 4.6 Riscos remanescentes (toolchain / produto)

Vulnerabilidades **dev** ainda abertas (não entram no `--omit=dev`):

| Pacote | Severidade | Notas |
|---|---|---|
| `vite@7.3.1` | high | Path traversal / bypass do dev server; relevante só em `npm run dev` |
| `postcss@8.5.6` | high | XSS/file read em stringify/source maps — toolchain |
| `rollup@4.x` | high | Path traversal no bundler |
| `nanoid` (transitivo) | high | DoS em geradores — dev/build |
| `browserslist` | high | DoS/crash — toolchain |
| `source-map-js` | high | DoS — toolchain |
| `@babel/core` | low | Leitura de arquivo via sourceMappingURL |
| `esbuild` | low | Leitura de arquivo no dev server Windows |
| `baseline-browser-mapping` | moderate | DoS |

Ação necessária: fase futura de *dev-deps* (Vite 7 patch mais novo), sem `audit fix` em massa. Sem bloqueio do MVP.

Produto (não são npm highs, mas risco real):

1. Auth no `localStorage` / RoleSwitcher de demonstração.
2. Sem validação de HTML no servidor (não existe API).
3. Overlay residual do onboarding (`fixed inset-0 bg-black/50`) às vezes permanece após “Começar!” — pré-existente, não introduzido por estas atualizações.

## 5. Roadmap de entregas

| Fase | Estado | Objetivo / aceite |
|---|---|---|
| F0 — Governança e baseline | **Concluído** | `chore/project-foundation` |
| F1.1 — Auth guard e papéis demo | **Concluído** | `fix/auth-guard-and-demo-roles` |
| F1.2 — Sanitização HTML / XSS | **Concluído** | HTML de redação sanitizado; testes de payload; build verde |
| F1.3 — Audit de dependências de produção | **Concluído** | Baseline classificado; correções compatíveis aplicadas; 34 testes + build; audit prod = 0; residual documentado |
| F1 — Frontend confiável (restante) | **Em andamento** | rascunho/timer/upload; botões sem mentir |
| F2 — Backend e persistência | **Pendente** | Inclui validação de HTML no servidor |
| F3 — Fluxo pedagógico completo | **Pendente** | Auth/RBAC reais |
| F4 — Qualidade e release | **Pendente** | E2E, CI, a11y |
| F5 — Diferenciais | **Pendente** | Rubricas, métricas, IA opcional |

## 6. Backlog priorizado

| Prioridade | Item | Estado | Aceite resumido |
|---|---|---|---|
| P0 | Baseline, React direto, guard e papéis demo | **Concluído** | Fases 0 e 1.1 |
| P0 | HTML de redação não confiável | **Concluído** | Sanitização + testes de regressão |
| P0 | Vulnerabilidades npm de **produção** | **Concluído** | TipTap 3.32 + RR 7.18.4; audit `--omit=dev` = 0 |
| P1 | Rascunho e retomada | Pendente | Salvar, listar, reabrir + invalidar cache |
| P1 | Timer e upload validados | Pendente | Cronômetro e validação de arquivo |
| P1 | Lista de redações com tema | Pendente | Anexar `theme` em `getByUser` |
| P1 | Correção rica e rubricas por modalidade | Pendente | Comentários/destaques |
| P1 | Backend Java / persistência | Pendente | API real + validação de conteúdo |
| P2 | Audit de *devDependencies* (Vite/PostCSS/Rollup) | Pendente | Fora do escopo 1.3 |
| P2 | CI / relatórios reais / IA | Pendente | Fora do frontend confiável imediato |

## 7. Decisões arquiteturais

**Definido nesta entrega:**

- Remediar por família de origem, não por `npm audit fix`.
- Manter React Router no major 7 até haver plano de migração para v8.
- Tratar markdown-it/linkify-it pela origem TipTap, não por override.
- Audit `--omit=dev` limpo ≠ plataforma segura.

**Mantido:** sanitização no render; frontend na raiz; sem backend.

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
| `npm test` após TipTap 3.32.0 | 2026-10-21 | **34 passed / 7 files** | Vitest 5.0.5 |
| `npm run build` após TipTap | 2026-10-21 | **Passou** | `index-CugtRF2B.js` 1452.12 kB (gzip 440.80 kB) |
| `npm audit --omit=dev` após TipTap | 2026-10-21 | **2 high** | só `react-router` / `react-router-dom` |
| `npm test` após RR 7.18.4 | 2026-10-21 | **34 passed / 7 files** | sem testes novos (cobertura de guard/login já existia) |
| `npm run build` após RR | 2026-10-21 | **Passou** | `index-Dq1dmuGi.js` 1454.97 kB (gzip 441.86 kB) |
| `npm audit --omit=dev` final | 2026-10-21 | **0** | — |
| `npm ls --depth=0` final | 2026-10-21 | TipTap 3.32.0; RR 7.18.4 | exit 0 |

Não foram adicionados testes de regressão: as APIs usadas (`BrowserRouter`, `useNavigate`, `Link`, `useEditor`, `CharacterCount`) não mudaram de contrato, e os 34 testes de auth/XSS permaneceram verdes.

**Ambiente:** Windows 10, Node v24.16.0, npm 11.13.0. Dev server desta sessão em `http://localhost:3001/` (3000 já estava ocupada).

**Smoke no browser (`VALIDADO EM EXECUÇÃO` em `http://localhost:3001`):**

| Fluxo | Resultado |
|---|---|
| Login demonstrativo (aluno) | Entrou em `/app`; dashboard “Olá, João!” |
| Onboarding aluno | ENEM → Intermediário → Seg → Começar!; dashboard liberado |
| Papel professor | “Prof. Maria Santos”; nav com Turmas e Relatórios |
| Papel admin | “Admin Silva”; nav com Usuários e Configurações |
| Volta ao aluno | “João Pedro”; nav de aluno |
| Editor TipTap | `useEditor` 3.32; `characterCount` 149 palavras; `<strong>` ok |
| Colagem / insert HTML malicioso | sem `<script>`, `<iframe>`, `onerror`; `window.__xssPaste` não disparou |
| Envio de redação | toast de envio; redirect `/app/redacoes` |
| Visualização `essay-1` | texto do mock + `.prose`; sem iframe |
| Feedback do aluno | nota 820 e competências |
| Correção do professor | rubrica ENEM, sliders, “Finalizar correção” em `/app/correcao/essay-2` |
| Recarregamento | sessão demo persistiu; rota dinâmica não caiu no login |

Limitação: overlay `fixed inset-0` do onboarding interceptou alguns cliques; removido via DOM para continuar o smoke. Comportamento pré-existente.

## 9. Registro de entregas

| Data | Entrega | Branch | Commit(s) | Validação real | Riscos / pendências |
|---|---|---|---|---|---|
| 2026-10-21 | Fase 1.3 — audit de dependências de produção | `chore/audit-production-advisories` | `960e2bd` TipTap; `7e6ad00` React Router; docs | 34/34; build exit 0 (2×); audit prod 0; smoke local | Sem push; 6 highs de *dev*; auth demo; sem backend |
| 2026-10-21 | Fase 1.2 — sanitização HTML de redação | `fix/sanitize-essay-html` | `fc5776c` `ce86bfd` `4328856` `006d484` | 34/34; build; audit 6 high | base desta branch |
| 2026-10-21 | Fase 1.1 — guard e papéis demo | `fix/auth-guard-and-demo-roles` | `9f340ad` … `96eb3d5` | 22 testes + build + smoke | — |
| 2026-10-21 | Fase 0 — governança | `chore/project-foundation` | `b696691` … `074db9d` | install + build | — |

## 10. Riscos e bloqueios atuais

- **Produção:** sem backend. Sanitização no cliente e editor corrigido são necessários, não suficientes.
- **npm:** produção limpa; 6 highs no toolchain de desenvolvimento.
- **Sessão no `localStorage` e ausência de RBAC** permanecem.
- **React Router v8** não avaliado — upgrade major exigiria fase própria.
- **Bloqueios:** nenhum. Push/PR/deploy exigem autorização.

## 11. Próxima ação única e verificável

**Abrir `feat/essay-draft-and-resume` a partir de `chore/audit-production-advisories` e implementar rascunho/retomada de redação (P1), sem iniciar backend.**

Critérios de aceite:

1. Aluno salva rascunho, lista e reabre no editor.
2. Cache TanStack invalidado de forma explícita.
3. Testes de regressão dos 34 existentes + cobertura do rascunho.
4. `docs/PROJECT_STATUS.md` atualizado com evidência.

**Não fazer nessa tarefa:** backend, `npm audit fix` de *devDependencies*, redesign, push/merge, nem React Router 8.
