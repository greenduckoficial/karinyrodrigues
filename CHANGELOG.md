# Changelog

## 0.1.0 — Release inicial (2026-08-09)

### Contexto

O repositório `cadance` estava vazio (sem commits, sem branches) quando este trabalho começou, apesar de um preview existente no Lovable já mostrar as telas Hoje, Discovery e Evolução. Como não havia nada versionado para continuar, o MVP foi construído do zero em `claude/cadence-personal-evolution-27kxoq`, seguindo a fundação de produto do briefing (arquitetura de motores, entidades, jornada, design system) e implementando os cinco pedidos abertos da tarefa.

### Stack

React 18 + TypeScript + Vite + Tailwind CSS + React Router. Sem backend próprio ainda: o estado é persistido em `localStorage` do navegador, atrás de uma camada de domínio tipada (`src/lib/types.ts`, `src/lib/store.ts`, `src/context/AppContext.tsx`) pensada para ser trocada por um backend real (ex.: Lovable Cloud/Supabase) sem reescrever as telas.

### Funcionalidades entregues

1. **Onboarding conversacional (Discovery)** — `src/pages/Discovery.tsx`
   Assistente adaptativo de uma pergunta por tela (progresso "N de M"), cobrindo nome, período de melhor rendimento, dias mais cheios, janela de tempo livre, maior obstáculo ao começar algo novo, padrão de abandono em tentativas passadas, estilo de motivação e horários preferidos de check-in/revisão semanal. Uma pergunta extra ("quantas coisas diferentes você tenta mudar ao mesmo tempo?") aparece só quando o obstáculo relatado é sobrecarga — a parte "adaptativa" do fluxo. Respostas viram `DiscoveryAnswer[]` (log bruto) e populam o `UserProfile`.

2. **Conversão automática de objetivos para SMART** — `src/lib/smart.ts`, `src/pages/NovaMeta.tsx`
   O usuário escreve o sonho em texto livre; uma função baseada em regras (`suggestSmart`) gera uma sugestão para os 5 campos SMART (Específica, Mensurável, Alcançável, Relevante, Temporal) mais um título e uma data de marco. Cada campo é editável antes de aceitar — a decisão final é sempre do usuário. Ao aceitar, gera a primeira `PlanVersion` já em 40% de capacidade (regra dos 40% do briefing).

3. **Check-in diário + causa + adaptação** — `src/pages/Hoje.tsx`, `src/components/ReasonPicker.tsx`, `src/components/PlanDiff.tsx`, `src/lib/reasons.ts`
   Cada hábito do plano ativo aparece em Hoje com os estados Feito/Parcial/Não feito. "Não feito" abre o seletor de motivo (8 categorias: tempo, energia, motivação, falta de clareza, sobrecarga, esquecimento, viagem, doença), que gera um diagnóstico em uma frase e propõe exatamente duas opções de ajuste (nunca mais que isso, por princípio de UX do briefing). A opção escolhida gera uma nova `PlanVersion` (imutável, nunca sobrescreve a anterior) e registra a `Adaptation` + `CoachSession` correspondentes.

4. **Histórico de sessões do coach** — `src/pages/CoachHistorico.tsx`
   Lista cronológica de todas as `CoachSession` (criação de plano, ajuste por falha, revisão semanal), mostrando o motivo informado, o diagnóstico, a opção escolhida e o resumo da mudança — filtrável por meta quando há mais de uma.

5. **Dashboard de Evolução** — `src/pages/Evolucao.tsx`, `src/lib/analytics.ts`
   Consistência dos últimos 14 dias, taxa de abandono, nível de risco de abandono (indefinido/baixo/moderado/alto, calculado sobre os últimos check-ins), gráfico de barras dos últimos 14 dias, progresso geral por meta (com contagem de versões de plano) e insights de hábito mais forte / mais difícil por taxa de execução.

6. **Lembretes e notificações** — `src/pages/Notificacoes.tsx`, `src/lib/notifications.ts`, `src/lib/useReminders.ts`
   Configuração de horário do check-in diário e dia/hora da revisão semanal, com um botão "Aplicar sugestão" que deriva um horário e dia recomendados a partir das respostas da Descoberta (cronotipo e dias mais cheios). Disparo best-effort via Web Notifications API enquanto o app está aberto — ainda não há push server-side.

### Telas e componentes de apoio

Nav (Hoje/Metas/Evolução/Perfil), Metas (lista + detalhe com histórico de versões do plano), Nova meta, Revisão semanal, Perfil, `CoachCard`, `ModeBanner` (modos Viagem/Doença/Sobrecarga/Pausa consciente reduzindo o plano ao mínimo), `ProgressRing`, `ConsistencyChart`, `EmptyState` — seguindo os tokens de design do briefing (`oklch`, off-white quente + verde-pinheiro, tipografia serifada editorial + sans, cantos suaves, sem confete/badges/mascotes).

### Verificação

`npm run build` limpo (`tsc -b && vite build`) e fluxo completo testado via Playwright headless: Discovery → Nova meta → SMART → aceitar plano → check-in "não feito" → seletor de motivo → diagnóstico → escolha de opção → nova versão do plano → Evolução → Histórico do coach → Perfil → Notificações, sem erros de console.

### Limitações conhecidas / próximos passos

- Persistência é local ao navegador (sem contas, sem sincronização entre dispositivos).
- Notificações só disparam com o app aberto (sem push real).
- Telas P1/P2 do roadmap do briefing (linha do tempo de evolução, insights avançados, configurações avançadas) não foram implementadas nesta rodada.
