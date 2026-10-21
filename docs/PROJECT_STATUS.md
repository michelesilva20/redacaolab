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
| Última revisão documental | 2026-10-21 — Fase 1.6 (timer, upload e estabilidade do onboarding) |
| Regra permanente da IA | `AGENTS.md` |
| Documentação de produto | `docs/PROJETO.md` |
| Branch desta entrega | `feat/essay-timer-and-upload` (local, sem push) |
| Base | `feat/essay-draft-and-resume` em `774deb9` |
| Demo pública | `https://emilabs.cloud/demo/redacaolab/` — **não validada** nesta execução |

## 2. Escopo do produto e MVP

**Perfis:** aluno, professor e administrador.

**MVP realista:** autenticação real no servidor → aluno rascunha/envia → professor corrige com rubrica da banca → aluno vê feedback persistido → admin básico.

**Fase 1.6 (esta entrega):** cronômetro real da redação textual, validação demonstrativa de imagem (JPEG/PNG ≤ 10 MiB) e conclusão de onboarding persistida por identidade demo. Não é backend, upload em nuvem nem armazenamento definitivo de foto.

## 3. Estado verificado por componente

| Componente | Estado | Evidência |
|---|---|---|
| Frontend (páginas/UI) | **Protótipo operacional em build** | `VALIDADO EM EXECUÇÃO`: `npm run build` exit 0 em 2026-10-21 (Fase 1.6) |
| Login / papéis / guard | **Demonstração explícita** | Fases 1.1 e 1.4 preservadas |
| Autorização de rotas (demo) | **UX no cliente** | Matriz + `RoleRoute` + 403 |
| Rascunho textual | **Persistência local demonstrativa** | Overlay `redacaolab-essays-v1` (Fase 1.5) + metadados de timer |
| Cronômetro | **Funcional no cliente** | Timestamps + tempo acumulado; intervalo só atualiza a UI |
| Upload de foto | **Validação local; sessão apenas** | MIME + assinatura; sem base64 no store de redações |
| Onboarding do aluno | **Conclusão persistida por identidade demo** | `redacaolab-onboarding-v1` |
| HTML de redação | **Sanitizado no cliente** | Fase 1.2 |
| Backend / banco / upload real | **Não iniciado** | Foto some ao recarregar |
| Autorização real no servidor | **Não iniciado** | Persistência no navegador não autoriza |
| Testes automatizados | **Parciais** | Vitest; **110 testes / 21 arquivos** |
| Dependências | **Estáveis** | RR 7.18.4; TipTap 3.32.0 |
| Audit de produção | **0 vulnerabilidades** | `npm audit --omit=dev` em 2026-10-21 |

## 4. Fase 1.6 — timer, upload e onboarding

### 4.1 Estado anterior

Após a Fase 1.5 (`774deb9`): 94 testes, build verde, audit de produção limpo. Rascunho textual persistia no overlay local. O cronômetro tinha UI, mas não era a fonte da verdade do tempo. O limite de 10 MB do upload não era validado de fato. `enterDemo('aluno')` / `setSimulatedRole('aluno')` reclonavam o mock com `onboardingCompleted: false`, reabrindo o modal e o overlay `fixed inset-0`.

### 4.2 Arquitetura do timer

**Escolhida:** snapshot `{ elapsedMs, running, startedAt }` + `reconstructElapsedMs(snapshot, now)`.

O intervalo de 250 ms só chama `setNowMs(Date.now())` enquanto `running` é verdadeiro. A verdade do tempo é `elapsedMs` acumulado mais `Date.now() - Date.parse(startedAt)` quando em execução. Há no máximo um `setInterval` por hook; o cleanup limpa o intervalo na pausa e na desmontagem. `visibilitychange` e `focus` recalculam o display sem gravar storage.

Hook: `useEssayTimer` (`start`, `pause`, `reset`, `hydrate`). UI: `EssayTimerControls` (iniciar / pausar / retomar / reiniciar com confirmação). Atingir um valor de tempo **não** bloqueia a escrita.

### 4.3 Política de persistência do tempo

Campos opcionais no registro textual: `timerElapsedMs`, `timerRunning`, `timerStartedAt`.

Gravação em checkpoints (iniciar, pausar, reiniciar, salvar rascunho, enviar) via `persistEssayTimer` ou o payload de `saveDraft`/`submit`. **Não** há escrita a cada tick. Timer inválido é descartado sem quarentenar o registro inteiro.

Ao reabrir um rascunho salvo: o tempo base volta; se `running` e `startedAt` existirem, a duração é reconstruída a partir dos timestamps (útil após F5 com o cronômetro ligado). Não se cria um segundo acumulador. O envio **pausa** o timer e **mantém** os metadados. Redação nova ainda não salva perde o tempo no recarregamento — alinhado à política de salvamento explícito, sem autosave de conteúdo.

### 4.4 Validação de arquivo (upload demonstrativo)

Rotina central: `validateEssayImage` em `src/lib/imageUpload.ts`. Vale para input e drag-and-drop.

| Regra | Comportamento |
|---|---|
| Tipos | JPEG (`image/jpeg` / `image/jpg`) e PNG (`image/png`) |
| Tamanho | Máximo **10 MiB** (`10 * 1024 * 1024`); exatamente 10 MiB é aceito se válido |
| Vazio | Rejeitado |
| Assinatura | JPEG `FF D8 FF`; PNG `89 50 4E 47 0D 0A 1A 0A` |
| Negados | GIF, PDF, SVG/XML, MIME incompatível com a assinatura, header ilegível |
| Preview | `URL.createObjectURL`; revogado ao remover, substituir ou desmontar (exceto se a foto foi “enviada” nesta sessão) |
| Envio | Bloqueado enquanto a validação está pendente ou há erro |

**Política temporária:** sem servidor de arquivos, sem nuvem, sem base64 no `localStorage` de redações. A foto fica só na sessão. A UI deixa isso explícito. Quando houver backend, este fluxo será substituído por upload real.

### 4.5 Causa-raiz e correção do onboarding

**Causa-raiz (`CONFIRMADO NO CÓDIGO`):** `cloneDemoUserByRole('aluno')` fazia `structuredClone` do mock (`onboardingCompleted: false`). `enterDemo` e `setSimulatedRole` sempre substituíam o usuário da sessão por esse clone. O `AppLayout` voltava a montar `OnboardingModal` (`fixed inset-0 z-50`), interceptando cliques. A conclusão existia só no `authStore` e era apagada ao reclonar.

**Correção:** store versionado `redacaolab-onboarding-v1` (`{ version: 1, completedUserIds }`). `markDemoOnboardingComplete` no `updateOnboarding(true)`. `applyDemoOnboardingFlag` reaplica a flag no clone sem mutar o mock. F5, RoleSwitcher e novo `enterDemo('aluno')` mantêm a conclusão de `user-aluno-1`. O overlay do modal some com o desmonte (`AnimatePresence`); `role="dialog"` / `aria-modal` / `data-testid="onboarding-overlay"`.

**Não é o overlay da sidebar.** Em viewport estreita, `uiStore.sidebarOpen` começa `true` e o backdrop `fixed inset-0 bg-black/50 z-40 lg:hidden` ainda intercepta cliques até o usuário fechar o menu. Isso é anterior a esta fase e permanece documentado.

### 4.6 Arquivos principais

Novos: `src/lib/essayTimer.ts`, `src/hooks/useEssayTimer.ts`, `src/components/essays/EssayTimerControls.tsx`, `src/lib/imageUpload.ts`, `src/lib/demoOnboarding.ts` e testes correspondentes (`useEssayTimer.test.ts`, `imageUpload.test.ts`, `demoOnboarding.test.tsx`, `NewEssay.upload.test.tsx`).

Alterados: `types`, `essayPersistence`, `essayRepository` (+ testes), `fakeApi`, `NewEssay`, `demoAuth`, `authStore`, `OnboardingModal`, `setup.ts`, `docs/PROJECT_STATUS.md`, `docs/PROJETO.md`.

### 4.7 Testes e build

| Verificação | Resultado |
|---|---|
| `npm test` | **110 passed / 21 files** (`VALIDADO EM EXECUÇÃO`) |
| `npm run build` | **Passou** — `index-z4TjfmOk.js` 1481.46 kB (gzip 449.31 kB) |
| `npm audit --omit=dev` | **0 vulnerabilidades** |

Os 94 testes da Fase 1.5 permaneceram verdes.

Cobertura nova: iniciar/pausar/retomar/reiniciar; fake timers; um intervalo; cleanup; hidratação e F5 com timer em execução; persistência no rascunho e após envio; JPEG/PNG; 10 MiB; acima do limite; vazio; MIME/assinatura inválidos; input e drop; remover/substituir; bloqueio de envio; falha de leitura; ausência de `data:image` no store; primeiro acesso; conclusão; F5; troca de papel; overlay removido; regressão do login demo.

### 4.8 Validação no navegador

Servidor desta entrega: `http://localhost:3000/`. Identidade demo `user-aluno-1`. O `localStorage` pré-existente **não foi apagado**. Viewport da automação ~766×273 (sidebar mobile aberta por padrão).

**Cenário 1 — Timer**

| Passo | Resultado |
|---|---|
| Aluno cria redação (tema-1, ENEM) | Formulário funcional |
| Iniciar cronômetro e digitar | Contagem em andamento; texto no TipTap |
| Pausar / retomar | Tempo acumulado preservado |
| Salvar rascunho | Toast “Rascunho salvo neste navegador”; URL `/editar/:id` |
| Registro local | `essay-49b28c8e-859d-4b64-a811-aab1ad612404`, `timerElapsedMs: 17213`, `timerRunning: false`, sem `imageUrl` |
| Recarregar a edição | Título “Continuar redação”; texto restaurado; “Cronômetro pausado, 00:17” |
| Retomar | 00:17 → 00:18 → 00:20 em ~3,5 s; sem salto duplicado |

**Cenário 2 — Upload**

| Passo | Resultado |
|---|---|
| JPEG válido | Preview `blob:` |
| Remover | Preview some |
| PNG no lugar | Preview `blob:` |
| PDF | Alerta “Envie apenas JPEG ou PNG…”; envio desabilitado |
| JPEG 10 MiB + 1 byte | “A imagem deve ter no máximo 10 MiB.”; sem preview |
| Drag-and-drop JPEG | Preview aceito; envio habilitado com tema |
| Disclaimer | “fica só nesta sessão e some ao recarregar” |
| Store textual | Sem `data:image` |

**Cenário 3 — Onboarding**

| Passo | Resultado |
|---|---|
| Primeiro acesso do aluno | Overlay com “Qual é o seu objetivo?” |
| Concluir etapas | Store `completedUserIds: ["user-aluno-1"]`; `onboardingCompleted: true` |
| Overlay do modal | Ausente (`data-testid="onboarding-overlay"` não existe) |
| Professor → admin → aluno | Onboarding não reabre; flag permanece |
| F5 em `/app` | “Olá, João!” sem modal |
| CTA após fechar a sidebar | Navega para `/app/redacoes/nova` |

## 5. Roadmap de entregas

| Fase | Estado | Objetivo / aceite |
|---|---|---|
| F0 — Governança e baseline | **Concluído** | `chore/project-foundation` |
| F1.1 — Auth guard e papéis demo | **Concluído** | `fix/auth-guard-and-demo-roles` |
| F1.2 — Sanitização HTML / XSS | **Concluído** | HTML de redação sanitizado |
| F1.3 — Audit de dependências de produção | **Concluído** | TipTap 3.32 + RR 7.18.4; audit prod = 0 |
| F1.4 — Autorização de rotas por papel | **Concluído** | Matriz única; 403; Sidebar alinhada; 66 testes |
| F1.5 — Rascunho e retomada | **Concluído** | Persistência local textual; mesmo ID no envio; 94 testes |
| F1.6 — Timer, upload e onboarding | **Concluído** | Cronômetro real; validação 10 MiB; overlay do onboarding corrigido; 110 testes |
| F1 — Frontend confiável (restante) | **Em andamento** | Persistência da correção; lista do admin |
| F2 — Backend e persistência | **Pendente** | Inclui RBAC, upload real e validação de HTML no servidor |
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
| P1 | Timer e upload validados | **Concluído** | Fase 1.6 |
| P2 | Overlay residual do onboarding | **Concluído** | Conclusão por identidade demo; modal desmonta |
| P1 | Persistência da correção do professor | Pendente | Hoje só sessão; envio do aluno já sobrevive ao F5 |
| P1 | Admin na lista de redações | Pendente | Hoje `getByUser(adminId)` tende a vazio |
| P1 | Correção rica e rubricas por modalidade | Pendente | Comentários/destaques |
| P1 | Backend Java / persistência | Pendente | API real + RBAC no servidor + upload de objeto |
| P2 | Overlay da sidebar no viewport estreito | Pendente | `sidebarOpen` inicia `true`; backdrop `lg:hidden` intercepta até fechar |
| P2 | Audit de *devDependencies* | Pendente | Vite/PostCSS/Rollup |
| P2 | CI / relatórios reais / IA | Pendente | Fora do frontend confiável imediato |

## 7. Decisões arquiteturais

**Definido nesta entrega:**

- Timer por timestamps + `elapsedMs` acumulado; intervalo só para UI.
- Metadados de tempo no overlay textual, gravados em checkpoints (não a cada segundo).
- Validação de imagem por tamanho, MIME e magic bytes, sem persistir arquivo.
- Conclusão de onboarding em store versionado por `userId` demo, aplicada no clone da identidade.

**Mantido:** overlay `localStorage` de redações da Fase 1.5; salvamento explícito sem autosave; sanitização no render; frontend na raiz; sem backend; RoleSwitcher é demonstração; matriz única de permissões.

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
| `npm test` | 2026-10-21 | **110 passed / 21 files** | 94 de regressão + timer/upload/onboarding |
| `npm run build` | 2026-10-21 | **Passou** | `index-z4TjfmOk.js` 1481.46 kB (gzip 449.31 kB) |
| `npm audit --omit=dev` | 2026-10-21 | **0** | sem mudança de dependências |

**Ambiente:** Windows 10, Node v24.16.0, npm 11.13.0. Dev desta entrega em `http://localhost:3000/`.

## 9. Registro de entregas

| Data | Entrega | Branch | Commit(s) | Validação real | Riscos / pendências |
|---|---|---|---|---|---|
| 2026-10-21 | Fase 1.6 — timer, upload e onboarding | `feat/essay-timer-and-upload` | `3077d1c` `5488733` `0eadbee` `5274648` + docs | 110/110; build exit 0; audit 0; smoke timer/F5, upload e onboarding | Sem push; foto só na sessão; sidebar overlay no viewport estreito |
| 2026-10-21 | Fase 1.5 — rascunho e retomada | `feat/essay-draft-and-resume` | `774deb9` e anteriores | 94/94; build exit 0; audit 0; smoke persistência + sem duplicata | Sem push; store local ≠ produção |
| 2026-10-21 | Fase 1.4 — RBAC de rotas na demo | `fix/role-based-route-authorization` | `bd7d5ae` e anteriores | 66/66; build; audit 0 | Autorização só no cliente |
| 2026-10-21 | Fase 1.3 — audit de produção | `chore/audit-production-advisories` | `960e2bd` `7e6ad00` `2b9c4be` | 34/34; build; audit 0 | base desta linha |
| 2026-10-21 | Fase 1.2 — sanitização HTML | `fix/sanitize-essay-html` | `fc5776c` … `006d484` | 34/34 | — |
| 2026-10-21 | Fase 1.1 — guard e papéis demo | `fix/auth-guard-and-demo-roles` | `9f340ad` … `96eb3d5` | 22 testes | — |
| 2026-10-21 | Fase 0 — governança | `chore/project-foundation` | `b696691` … `074db9d` | install + build | — |

## 10. Riscos e bloqueios atuais

- **Produção:** sem backend. `localStorage` e RBAC no cliente são necessários para a demo, insuficientes para SaaS e inadequados a dados reais de estudantes.
- **Sessão no `localStorage`** e RoleSwitcher permanecem.
- **Foto de redação** continua só na sessão; o envio demonstrativo não é armazenamento.
- **Correção do professor** ainda some no F5.
- **Sidebar mobile:** backdrop intercepta cliques enquanto o menu inicia aberto em viewport `< lg`.
- **npm *dev*:** 6 highs de toolchain (Fase 1.3).
- **Bloqueios:** nenhum. Push/PR/deploy exigem autorização.

## 11. Próxima ação única e verificável

**Abrir `feat/professor-correction-persist` a partir de `feat/essay-timer-and-upload` e persistir a correção do professor no overlay local (ou store versionado equivalente), sem backend e sem autosave de redação.**

Critérios de aceite:

1. Finalizar uma correção sobrevive ao F5 para o mesmo envio do aluno.
2. O aluno vê nota/feedback persistidos após recarregar.
3. Os 110 testes atuais continuam verdes + cobertura da correção persistida.
4. `docs/PROJECT_STATUS.md` atualizado com evidência.

**Não fazer nessa tarefa:** backend, JWT, upload em nuvem, correção por IA, redesign, push/merge, nem `npm audit fix` de *devDependencies*.
