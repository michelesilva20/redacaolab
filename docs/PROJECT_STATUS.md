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
| Última revisão documental | 2026-10-21 — Fase 1.2 (sanitização HTML / XSS) |
| Regra permanente da IA | `AGENTS.md` |
| Documentação de produto | `docs/PROJETO.md` |
| Branch desta entrega | `fix/sanitize-essay-html` (local, sem push) |
| Base | `fix/auth-guard-and-demo-roles` em `96eb3d5` |
| Demo pública | `https://emilabs.cloud/demo/redacaolab/` — **não validada** nesta execução |

## 2. Escopo do produto e MVP

**Perfis:** aluno, professor e administrador.

**MVP realista:** autenticação real no servidor → aluno rascunha/envia → professor corrige com rubrica da banca → aluno vê feedback persistido → admin básico.

**Fase 1.2 (esta entrega):** sanitizar HTML de redação no cliente antes de interpretar no DOM. Não é solução completa de segurança da plataforma — a API Spring Boot futura também deverá validar conteúdo não confiável.

## 3. Estado verificado por componente

| Componente | Estado | Evidência |
|---|---|---|
| Frontend (páginas/UI) | **Protótipo operacional em build** | `VALIDADO EM EXECUÇÃO`: `npm run build` exit 0 em 2026-10-21 (Fase 1.2) |
| Login / papéis / guard | **Demonstração explícita (Fase 1.1)** | Preservado nesta branch |
| HTML de redação | **Sanitizado no cliente** | `sanitizeEssayHtml` + `SafeEssayContent` em EssayDetail, Correction e Feedback |
| Editor TipTap | **Parcial** | Continua gerando HTML via `getHTML()`; sanitização ocorre na leitura/renderização |
| Lista de redações | **Parcial / seguro para XSS** | Preview usa texto React (`truncate`), não `innerHTML` |
| Backend / banco / upload | **Não iniciado** | — |
| Autorização real | **Não iniciado** | — |
| Testes automatizados | **Parciais** | Vitest; 34 testes (22 da 1.1 + 12 da 1.2) |
| Dependências React | **Declaradas** | `react` / `react-dom` `^19.2.4` |
| DOMPurify | **Adicionado** | `dompurify` `^3.4.17` — sem advisory próprio no `npm audit --omit=dev` |

### Fase 1.2 — pontos vulneráveis encontrados

| Local | Antes | Depois |
|---|---|---|
| `src/pages/Essays/EssayDetail.tsx` | `dangerouslySetInnerHTML` com `essay.content` cru | `SafeEssayContent` |
| `src/pages/Correction/index.tsx` | Idem | `SafeEssayContent` |
| `src/pages/Feedback/index.tsx` | Idem | `SafeEssayContent` |
| `src/pages/Essays/index.tsx` | `truncate(content)` em `<p>` | Sem mudança — React escapa texto |
| `src/pages/Essays/NewEssay.tsx` | `editor.getHTML()` na gravação | Sem mudança de editor; sanitização na exibição |
| `src/counter.ts` | `innerHTML` residual do template Vite | Fora do app; não ligado |

### Estratégia de sanitização

- Biblioteca: **DOMPurify 3.4.17** (mantida, não regex ad hoc).
- Função única: `src/lib/sanitizeEssayHtml.ts`.
- Componente: `src/components/SafeEssayContent.tsx` — único `dangerouslySetInnerHTML` das redações, sempre com HTML já sanitizado.
- Política **restritiva** alinhada ao TipTap StarterKit, não ao default amplo do DOMPurify.
- `KEEP_CONTENT: true` para preservar o texto de tags removidas.
- Hook `afterSanitizeAttributes` remove `on*` e protocolos `javascript:` / `data:` / `vbscript:` se algum atributo URI escapar.
- Conteúdo `null`, `undefined` ou só espaço → string vazia, sem exceção.

**Permitido:** `p`, `br`, `strong`, `b`, `em`, `i`, `s`, `strike`, `code`, `pre`, `h1`–`h6`, `ul`, `ol`, `li`, `blockquote`, `hr`. Atributo `start` em listas.

**Bloqueado:** `script`, `iframe`, `svg`, `math`, `img` no HTML, `a`, `form`, `object`, `embed`, `style`, `link`, `video`, `audio`, event handlers, `href`/`src`/`style`, data attributes, SVG/MathML, HTML arbitrário.

`img` de redação fotografada continua como elemento React (`essay.imageUrl`), fora do HTML sanitizado.

Esta correção **não** elimina XSS de paste no editor (advisory `prosemirror-view`) nem as highs do react-router.

### Fragilidades ainda abertas

1. **P0 — Vulnerabilidades npm de produção:** 6 high (TipTap/core, linkify-it, markdown-it, prosemirror-view XSS no paste, react-router).
2. **P0 — Auth no `localStorage`:** sessão demo; sem autenticação real.
3. **P1 —** rascunho, timer, upload, cache, tema na lista, rubrica ENEM única, ações decorativas.
4. **P2 —** `src/counter.ts`; bundle grande.

## 4. Roadmap de entregas

| Fase | Estado | Objetivo / aceite |
|---|---|---|
| F0 — Governança e baseline | **Concluído** | `chore/project-foundation` |
| F1.1 — Auth guard e papéis demo | **Concluído** | `fix/auth-guard-and-demo-roles` |
| F1.2 — Sanitização HTML / XSS | **Concluído** | HTML de redação sanitizado; testes de payload; build verde |
| F1 — Frontend confiável (restante) | **Em andamento** | rascunho/timer/upload; botões sem mentir |
| F2 — Backend e persistência | **Pendente** | Inclui validação de HTML no servidor |
| F3 — Fluxo pedagógico completo | **Pendente** | Auth/RBAC reais |
| F4 — Qualidade e release | **Pendente** | E2E, CI, a11y |
| F5 — Diferenciais | **Pendente** | Rubricas, métricas, IA opcional |

## 5. Backlog priorizado

| Prioridade | Item | Estado | Aceite resumido |
|---|---|---|---|
| P0 | Baseline, React direto, guard e papéis demo | **Concluído** | Fases 0 e 1.1 |
| P0 | HTML de redação não confiável | **Concluído** | Sanitização + testes de regressão |
| P0 | Vulnerabilidades npm de produção | Pendente | Avaliar `npm audit fix` em branch própria, sem aplicar às cegas |
| P1 | Rascunho e retomada | Pendente | Salvar, listar, reabrir + invalidar cache |
| P1 | Timer e upload validados | Pendente | Cronômetro e validação de arquivo |
| P1 | Lista de redações com tema | Pendente | Anexar `theme` em `getByUser` |
| P1 | Correção rica e rubricas por modalidade | Pendente | Comentários/destaques |
| P1 | Backend Java / persistência | Pendente | API real + validação de conteúdo |
| P2 | CI / relatórios reais / IA | Pendente | Fora do frontend confiável imediato |

## 6. Decisões arquiteturais

**Definido nesta entrega:**

- Sanitizar no **render** via função central; não reescrever o TipTap.
- Allowlist explícita do que o StarterKit precisa; deny de SVG, MathML, iframe, âncoras e imagens no HTML.
- Um componente compartilhado evita três `innerHTML` crus.
- Frontend ≠ segurança de plataforma: backend deverá sanitizar/validar de novo.

**Mantido:** Fase 1.1; frontend na raiz; sem `npm audit fix` em massa.

## 7. Testes, comandos e ambientes

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
| `npm test` | 2026-10-21 | **34 passed / 7 files** | Vitest 5.0.5; 22 regressão 1.1 + 12 novos |
| `npm run build` | 2026-10-21 | **Passou** (exit 0) | tsc ok; `index-Bm2k3dIc.js` 1417.58 kB (gzip 429.90 kB) |
| `npm install` (dompurify) | 2026-10-21 | **Passou** | `dompurify@^3.4.17` |
| `npm audit --omit=dev` | 2026-10-21 | **6 high** | Mesmas libs de antes; DOMPurify **não** entrou no relatório |
| `npm audit fix` | — | Não executado | fora de escopo |

Testes novos cobrem: HTML legítimo (p/strong/em/listas), `script`, `onerror`/`onclick`, `javascript:`, SVG, iframe, HTML malformado, vazio, mocks e DOM do `EssayDetail` com payload envenenado.

**Ambiente:** Windows 10, Node v24.16.0, npm 11.13.0.

**Smoke no browser (`VALIDADO EM EXECUÇÃO`):** `/app/feedback/essay-1` após login de aluno mostrou o texto mock (“O estigma associado…”, “Michel Foucault”) dentro de `.prose`, sem iframe injetado. O onboarding do aluno ficou sobreposto e não impediu a renderização do conteúdo.

## 8. Registro de entregas

| Data | Entrega | Branch | Commit(s) | Validação real | Riscos / pendências |
|---|---|---|---|---|---|
| 2026-10-21 | Fase 1.2 — sanitização HTML de redação | `fix/sanitize-essay-html` | `fc5776c` deps; `ce86bfd` sanitização; `4328856` testes | `npm test` 34/34; `npm run build` exit 0; audit 6 high sem DOMPurify | Sem push; XSS de paste no editor e highs npm seguem |
| 2026-10-21 | Fase 1.1 — guard e papéis demo | `fix/auth-guard-and-demo-roles` | `9f340ad` `67f29ce` `0e77916` `f42bce0` `7e162d1` `96eb3d5` | 22 testes + build + smoke | base desta branch |
| 2026-10-21 | Fase 0 — governança | `chore/project-foundation` | `b696691` … `074db9d` | install + build | — |

## 9. Riscos e bloqueios atuais

- **Produção:** sem backend. Sanitização no cliente é necessária, não suficiente.
- **XSS residual:** paste no TipTap (`prosemirror-view`); conteúdo só é limpo na exibição.
- **npm high:** TipTap, markdown-it, react-router — não corrigidos nesta fase.
- **Sessão no `localStorage` e ausência de RBAC** permanecem.
- **Bloqueios:** nenhum. Push/PR/deploy exigem autorização.

## 10. Próxima ação única e verificável

**Abrir `chore/audit-production-advisories` a partir desta branch e avaliar, um advisory por vez, se cabe atualizar TipTap/ProseMirror e react-router sem `npm audit fix` em massa.**

Critérios de aceite:

1. Cada atualização em commit isolado, com motivo e risco.
2. `npm test` e `npm run build` passam após cada mudança aceita.
3. O que não puder ser atualizado fica documentado com justificativa.
4. `docs/PROJECT_STATUS.md` registra o resultado real do audit.

**Não fazer nessa tarefa:** backend, rascunho/timer, redesign, nem aplicar `npm audit fix` às cegas.
