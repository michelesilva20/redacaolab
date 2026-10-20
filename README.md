# RedaçãoLab

An education frontend prototype for writing practice and essay-review journeys across student, teacher and administrator screens.

**Status:** frontend prototype. **Stack:** React-oriented UI, TypeScript, Vite, Tailwind CSS, Tiptap and Zustand.

## Scope and boundaries

The service layer is a fake API backed by mocks. Role switching and grading screens are demonstrations, not server-enforced security or AI-generated assessment. The dependency manifest also needs validation: React/React DOM are not explicitly declared as direct dependencies.

## Explore and run

The [existing demo link](https://emilabs.cloud/demo/redacaolab/) is retained from the project documentation; hosting availability and interactive behavior must be checked separately.

```sh
npm install
npm run dev
```

The existing `build` script performs TypeScript compilation and a Vite build. This editorial update does not establish a successful build, accessibility audit or automated test suite.

## Documentação em português

A apresentação original do projeto continua abaixo, com seus detalhes visuais e de navegação. As funcionalidades descritas referem-se ao protótipo.

---

# RedaçãoLab 📝

> **Plataforma premium de treinamento de redação para ENEM, UNESP e concursos públicos.**  
> Um protótipo completo de EdTech com foco em prática guiada, correção detalhada, gamificação e experiência moderna.

## 🔗 Demo online
[Acessar demonstração](https://emilabs.cloud/demo/redacaolab/)

## 📸 Visão geral

O **RedaçãoLab** é um protótipo frontend completo de uma plataforma educacional voltada para estudantes que desejam evoluir na escrita para exames como **ENEM, UNESP e concursos públicos**.

O projeto foi pensado para simular uma aplicação real de mercado, com:
- landing page pública
- login
- dashboard autenticado
- perfis de acesso por função
- fluxo de escrita e correção de redações
- feedback detalhado ao aluno
- gamificação para engajamento

A proposta foi unir **UX/UI moderna**, **arquitetura escalável** e uma experiência consistente para diferentes perfis dentro da plataforma.

---

## ✨ Principais funcionalidades

### Área pública
- Landing page com foco em conversão
- Seções de recursos, funcionamento, planos, CTA e FAQ
- Interface premium com visual moderno e animado

### Área do aluno
- Onboarding personalizado no primeiro acesso
- Dashboard com progresso e recomendações
- Escrita e envio de redações
- Visualização de correções e feedbacks
- Gamificação com XP, streak, badges e missões

### Área do professor
- Fluxo completo de correção de redações
- Avaliação por competências
- Comentários e destaques no texto
- Gestão de turmas e relatórios

### Área do admin
- Gestão de usuários
- Gestão de turmas
- Relatórios gerais
- Configurações da plataforma

---

## 👥 Perfis de acesso

### Admin
Acesso total às funcionalidades da plataforma, incluindo usuários, turmas, configurações e relatórios.

### Professor
Acesso à correção de redações, gestão de turmas e relatórios pedagógicos.

### Aluno
Acesso à prática de redação, aulas, temas, correções, feedbacks e elementos de gamificação.

---

## 🧠 Diferenciais do projeto

- Simulação completa de uma plataforma SaaS educacional
- Experiência pensada para múltiplos perfis de usuário
- Fluxo de redação, correção e feedback bem estruturado
- Interface moderna, colorida e orientada à experiência do usuário
- Aplicação de gamificação para aumentar engajamento
- Organização escalável de componentes e páginas

---

## 👩‍💻 Meu papel no projeto

Neste projeto, fui responsável por:
- concepção do produto
- estruturação da experiência do usuário
- definição da interface visual
- arquitetura frontend
- componentização da aplicação
- organização de fluxos e rotas
- simulação da experiência completa da plataforma

---

## 🛠️ Stack utilizada

| Tecnologia | Uso |
|------------|-----|
| React 18 | Interface da aplicação |
| TypeScript | Tipagem estática |
| Vite | Build tool |
| TailwindCSS | Estilização |
| React Router | Navegação |
| Zustand | Estado global |
| TanStack Query | Simulação de data fetching |
| React Hook Form | Formulários |
| Zod | Validação |
| Framer Motion | Animações |
| Recharts | Gráficos |
| TipTap | Editor de texto |
| Lucide React | Ícones |

---

## 🎮 Destaques do produto

### Editor de Redação
- Editor rico com TipTap
- Contagem de palavras
- Timer opcional
- Seleção de tema e modalidade
- Upload de foto
- Autosave simulado

### Correção (Professor)
- Layout em duas colunas
- Avaliação por competências
- Comentários por trecho
- Destaques de pontos fortes e melhorias

### Feedback (Aluno)
- Nota total em destaque
- Gráfico radar por competências
- Comentários detalhados
- Incentivo à reescrita com base no feedback

### Gamificação
- Sistema de XP
- Sequência de dias (streak)
- Badges desbloqueáveis
- Missões diárias e semanais

---

## 🚀 Como rodar localmente

```bash
npm install
npm run dev
npm run build

```
