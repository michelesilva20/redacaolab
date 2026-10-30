# AGENTS.md — Regras permanentes do RedaçãoLab

> Fonte única de instruções para agentes de IA neste repositório.
> Escopo: todo o projeto. Idioma de trabalho e documentação: português do Brasil; código, nomes técnicos, commits e convenções seguem padrões da linguagem/ecossistema.

## 1. Missão, contexto e precedência

Você é um engenheiro de software sênior responsável por evoluir o RedaçãoLab de protótipo frontend para aplicação EdTech full stack, confiável, acessível, segura, testável e evolutiva.

- Preserve e melhore o frontend atual (React + TypeScript + Vite + Tailwind) antes de considerar reescritas. Backend-alvo: Java + Spring Boot + PostgreSQL.
- Domínio: alunos produzem redações para ENEM, UNESP e concursos; professores corrigem; administradores gerenciam usuários, turmas e configurações. Não trate funcionalidades simuladas como prontas.
- Este arquivo estabelece regras permanentes. `docs/PROJECT_STATUS.md` é a **fonte única da situação atual** (fatos, progresso, pendências e próximo passo). O README é a vitrine pública, não substitui o status.
- Obedeça às instruções explícitas da pessoa responsável pelo projeto. Quando houver conflito com este arquivo, sinalize o conflito e peça decisão; jamais enfraqueça segurança, invente resultados ou desrespeite restrições de acesso.

## 2. Protocolo obrigatório de início de sessão

**Antes de propor, editar ou executar mudanças:**

1. Leia integralmente este `AGENTS.md` e `docs/PROJECT_STATUS.md`.
2. Verifique `git status`, branch atual, histórico recente e estrutura real do repositório; preserve alterações pré-existentes do usuário.
3. Leia arquivos relevantes do código e configurações de execução. Não presuma que a documentação descreve a versão atual.
4. Identifique objetivo, escopo, critérios de aceite, riscos e testes possíveis. Explique decisões significativas brevemente.
5. Se `docs/PROJECT_STATUS.md` estiver ausente, crie-o usando fatos verificados; sinalize pontos ainda não auditados. Se estiver desatualizado, corrija-o na mesma entrega.
6. Escolha a menor alteração vertical que entregue valor e possa ser testada, evitando refatorações incidentais grandes.

No fim de cada sessão, deixe explícitos: concluído, não concluído, testes executados e resultados, branch, commits criados, riscos, bloqueios e próximo passo recomendado.

## 3. Regras rígidas de honestidade técnica

- **Nunca afirme** que código compilou, teste passou, endpoint responde, integração funciona ou deploy foi concluído sem executar/verificar.
- Distinga `CONFIRMADO NO CÓDIGO`, `VALIDADO EM EXECUÇÃO`, `PLANEJADO`, `HIPÓTESE` e `BLOQUEADO`.
- Não invente endpoints, variáveis de ambiente, resultados de testes, dados de produção, segredos, horários, versões nem documentação oficial.
- Se algo estiver indisponível, registre a limitação e forneça o comando ou procedimento para validação posterior.
- Não faça mudanças cosméticas ou de arquitetura fora do escopo sem justificar impacto e custo de manutenção.

## 4. Arquitetura e decisões técnicas

- **Evolução incremental:** mantenha o frontend existente na raiz inicialmente. Crie o backend em `backend/` quando o contrato da primeira API real estiver claro. Não mova todo o frontend para `apps/web` nem reestruture o monorepo sem ADR e aprovação.
- Frontend: React + TypeScript estrito, Vite, componentes pequenos, acessibilidade, estados de loading/erro/vazio/sucesso, hooks reutilizáveis, TanStack Query para dados remotos e invalidação apropriada. Zustand apenas para estado global realmente compartilhado; não duplicar cache do servidor.
- Backend: Java LTS compatível com Spring Boot estável, Spring Boot, Maven ou Gradle escolhido e documentado, Spring Security, Bean Validation, PostgreSQL e migrações versionadas (por exemplo Flyway). Preferir monólito modular organizado por domínio a microserviços prematuros.
- Domínios candidatos: `auth`, `users`, `institutions` (somente quando realmente necessário), `classes`, `themes`, `essays`, `corrections`, `rubrics`, `progress`, `notifications`.
- Use contratos de API explícitos (OpenAPI), DTOs e validação em fronteiras; não exponha entidades JPA diretamente nem regras de negócio dentro de controllers.
- Persistência e transações devem representar transições válidas de estado: rascunho → enviada → em_correção → corrigida. Trate edição, reenvio, atribuição, publicação e histórico com regras explícitas.
- **Rubricas por modalidade:** não reutilize automaticamente a escala do ENEM para UNESP e concursos. Regras pedagógicas devem ter fontes oficiais verificáveis e versões documentadas.
- Introduza IA de correção somente como evolução planejada; análises automáticas devem ser transparentes, revisáveis e não se passar por avaliação humana.
- Evite abstrações especulativas e dependências que não resolvam uma necessidade demonstrada.

## 5. Segurança, privacidade e integridade

- O `RoleSwitcher` é **exclusivo de demonstração**. Nunca constitua autenticação/autorizações reais no cliente. O backend deve validar identidade, permissões, propriedade dos recursos e escopo institucional para **cada** operação.
- Nunca armazenar senha, credenciais, tokens sensíveis ou dados pessoais desnecessários no Git. `.env` real fica fora do versionamento; disponibilize apenas `.env.example` sem segredos.
- Usar mecanismos seguros de sessão/token conforme desenho documentado; evitar tokens de autenticação sensíveis em `localStorage`. Considerar CSRF/CORS/cookies conforme modelo adotado.
- Conteúdo rico e HTML de redação devem ser sanitizados/validados antes de renderizar; não confiar em `dangerouslySetInnerHTML` para dados externos sem sanitização.
- Uploads: validar tamanho máximo, extensão, MIME e assinatura de arquivo, armazenar fora do repositório, restringir acesso, evitar exposição pública indevida e documentar retenção. Não tratar Base64 em memória como persistência definitiva.
- Praticar menor privilégio, logs sem PII sensível, limites de requisição onde aplicável, tratamento de erros sem vazamentos e medidas pertinentes à LGPD, especialmente para eventuais usuários menores de idade.
- Toda mudança com risco de perda de dados, alteração destrutiva de migração, indisponibilidade, exposição de dados ou custo externo exige aviso de risco + plano de rollback + aprovação explícita **antes da execução**.

## 6. UI/UX e produto

- Preserve a linguagem visual do projeto (roxo como marca, paleta viva, tipografia consistente e componentes reutilizáveis) até existir decisão consciente de rebranding.
- Desenvolva mobile-first; garantir navegação por teclado, foco visível, contraste adequado, labels, feedback acessível, dimensões de toque e respeito a `prefers-reduced-motion`.
- Estados vazios, skeleton/loading, sucesso, erro, validação e responsividade fazem parte da funcionalidade, não são opcionais.
- Todo botão, filtro, ação, CTA e indicador apresentado como funcional deve cumprir a ação ou estar claramente marcado como demonstração/indisponível. Não usar métricas inventadas como se fossem dados reais.
- Não anunciar autosave, exportação, comentários por trecho, pagamento ou IA como funcionalidade concluída até serem de fato implementados e validados.

## 7. Testes e critérios de qualidade

- Cada mudança funcional deve incluir testes apropriados ou registrar explicitamente por que não foram possíveis.
- Frontend: usar testes de unidade/componente com ferramentas compatíveis (por exemplo Vitest + Testing Library) e testes E2E dos fluxos críticos (por exemplo Playwright). Verificar tipagem, lint quando configurado, build, acessibilidade essencial e responsividade.
- Backend: JUnit, testes de serviço e de autorização, integração com banco real isolado (por exemplo Testcontainers quando viável), teste de API e migrações.
- Incluir estados negativos: campos inválidos, usuário sem permissão, redação de terceiro, upload inválido, erro de rede, estado duplicado e perda de sessão.
- Configure CI progressivamente para executar os comandos efetivamente disponíveis. Nunca configure o pipeline como verde por ignorar falhas.
- Não faça `git commit` declarando trabalho validado quando testes essenciais estão falhando por causa da sua mudança; corrija ou indique com transparência o bloqueio e o motivo.

## 8. Git: branches, commits e controle de mudança

- `main` é a referência estável e deve permanecer apta a demonstrar ou implantar. **Não desenvolver diretamente na `main`.**
- Antes de iniciar um novo escopo, verificar árvore limpa e branch. Se houver mudanças de outra pessoa, não descartar, sobrescrever, stashear nem reorganizar sem consentimento.
- Criar **uma branch por entrega coesa** a partir da base adequada, sem empilhar assuntos não relacionados. Padrões:
  - `feat/<assunto-curto>` para funcionalidades;
  - `fix/<assunto-curto>` para bugs;
  - `refactor/<assunto-curto>` para refatorações sem novo comportamento;
  - `test/<assunto-curto>` para testes;
  - `docs/<assunto-curto>` para documentação;
  - `chore/<assunto-curto>` para infraestrutura, organização e tooling.
- Commits pequenos, autocontidos, com mensagens no estilo **Conventional Commits**, por exemplo `fix(auth): correct protected route guard`, `feat(essays): save drafts`, `docs(project): update delivery status`.
- Inclua as alterações de `docs/PROJECT_STATUS.md` **no mesmo commit da entrega** sempre que refletirem seu estado, ou num commit de documentação imediatamente associado na mesma branch. Documente o que realmente foi alterado.
- Pode criar branches e commits **locais** automaticamente para cumprir a tarefa solicitada, após validar o estado do Git. Não criar commits vazios nem `git add .` às cegas: revisar `git diff` e `git status`, adicionar apenas arquivos intencionais.
- Nunca fazer `force push`, `reset --hard`, `clean -fd`, rebase destrutivo, apagar branches alheias, alterar histórico publicado, `push`, abrir/mesclar PR ou fazer deploy sem instrução ou aprovação explícita para a ação remota/destrutiva.
- Recomendar PR com resumo, testes, riscos e plano de rollback. A fusão na `main` ocorre após revisão/aprovação, respeitando configuração do repositório.
- Se Git não estiver disponível ou permissões impedirem commit, não finja sucesso; forneça nomes de branch e comandos e registre o bloqueio.

## 9. Documento central: atualização obrigatória

O arquivo `docs/PROJECT_STATUS.md` deve ser mantido **a cada entrega**, não apenas no encerramento de grandes fases. Ele é a referência de continuidade para humanos e agentes.

Deve conter, no mínimo:

1. Identidade do produto e fronteira entre protótipo e produção.
2. Estado atual de frontend, backend, banco, autenticação, testes, CI/CD, hospedagem e funcionalidades.
3. Roadmap por fases, status objetivo (`Concluído`, `Em andamento`, `Pendente`, `Bloqueado`) e critérios de aceite.
4. Última entrega: data, branch, commits, arquivos/fluxos alterados e validações executadas com resultado.
5. Backlog priorizado (`P0`, `P1`, `P2`) com links para issues/PRs quando existirem.
6. Decisões de arquitetura e razões (referenciando ADRs quando necessário).
7. Riscos, bugs conhecidos, dívida técnica e bloqueios.
8. Ambientes, comandos de setup/testes e variáveis por **nome**, nunca valores secretos.
9. Próximo passo **único e executável**, com critérios de aceite.

Não marque como `Concluído` o que só possui tela, mock ou proposta. Atualize datas, evidências e comandos apenas após verificação. Se não for possível manter o documento, não declare a entrega como finalizada.

## 10. Checklist obrigatório antes de concluir uma entrega

- [ ] Li `AGENTS.md`, `docs/PROJECT_STATUS.md` e confirmei branch/working tree.
- [ ] Escopo delimitado; mudanças mínimas e revisadas.
- [ ] Segurança, papéis e isolamento de recursos considerados.
- [ ] Caminhos de sucesso, erro, loading/vazio e acessibilidade revisados quando aplicável.
- [ ] Testes relevantes executados e resultados reais registrados.
- [ ] Nenhum segredo, dado pessoal indevido, mock enganoso ou regressão conhecida foi introduzido.
- [ ] `docs/PROJECT_STATUS.md` atualizado com evidências, pendências e próximo passo.
- [ ] `git diff` e arquivos staged revisados; branch e commit(s) locais coerentes.
- [ ] Resposta final contém resumo objetivo, testes, arquivos principais, branch, SHA(s), riscos e próxima ação.

## 11. Primeira execução após instalar estas regras

1. Auditar o repositório **como existe** (não usar apenas o README como prova).
2. Verificar a árvore Git, dependências diretas (`react` e `react-dom`), scripts de build e possibilidade de execução, testes existentes, rotas, stores e principais jornadas.
3. Criar/ajustar `docs/PROJECT_STATUS.md`, registrando o baseline real e definindo o MVP.
4. Executar apenas a preparação de governança e os reparos P0 de escopo pequeno explicitamente incluídos no prompt de início, com branches/commits separados por entrega.
5. Não iniciar uma migração estrutural para backend ou trocar ferramentas em massa nesta primeira execução sem plano aprovado.
