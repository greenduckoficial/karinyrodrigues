# Cadence

Sistema inteligente de evolução pessoal: um plano que se reconstrói continuamente para reduzir o abandono, em vez de um habit tracker estático.

## Stack

React + TypeScript + Vite + Tailwind CSS + React Router. Sem backend próprio ainda — o estado (perfil, metas, planos, check-ins, sessões do coach) é persistido em `localStorage` no navegador (`src/lib/store.ts`), com uma camada de tipos e lógica de domínio isolada em `src/lib/` e `src/context/AppContext.tsx` para facilitar a troca futura por um backend real (ex: Lovable Cloud/Supabase) sem reescrever as telas.

## Rodando localmente

```bash
npm install
npm run dev
```

## O que está implementado

- **Onboarding conversacional (Discovery)** — assistente adaptativo de uma pergunta por tela (`src/pages/Discovery.tsx`) cobrindo rotina, disponibilidade, maior obstáculo e padrão de abandono; uma pergunta extra aparece condicionalmente quando o obstáculo relatado é sobrecarga.
- **Conversão automática para SMART** — `src/lib/smart.ts` gera uma sugestão de meta SMART a partir do sonho em texto livre; o usuário edita cada campo antes de aceitar (`src/pages/NovaMeta.tsx`).
- **Check-in diário + causa + adaptação** — em `src/pages/Hoje.tsx`, uma falha aciona o `ReasonPicker`, gera um diagnóstico e propõe duas opções de ajuste (`src/components/PlanDiff.tsx`, `src/lib/reasons.ts`), sempre criando uma nova versão do plano em vez de alterar a antiga.
- **Histórico de sessões do coach** — `src/pages/CoachHistorico.tsx` lista cronologicamente as adaptações, o motivo informado e o resumo da mudança de plano, filtrável por meta.
- **Dashboard de Evolução** — `src/pages/Evolucao.tsx` mostra consistência (14d), taxa de abandono, risco de abandono, progresso por meta e os hábitos mais forte/mais difícil (`src/lib/analytics.ts`).
- **Lembretes e notificações** — `src/pages/Notificacoes.tsx` permite configurar horário de check-in e dia/hora da revisão semanal, com uma sugestão automática baseada nas respostas da Descoberta; `src/lib/useReminders.ts` dispara notificações do navegador (best-effort, só com o app aberto — ainda não há push server-side).

## Limitações conhecidas

Este repositório estava vazio; o app foi construído do zero seguindo a fundação de produto (arquitetura de motores, entidades, design system) descrita no briefing. Persistência é local ao navegador — a próxima etapa natural é conectar um backend (Lovable Cloud) para contas reais, sincronização entre dispositivos e push notifications de verdade.

Ver [`CHANGELOG.md`](./CHANGELOG.md) para o detalhamento do que foi entregue em cada versão.
