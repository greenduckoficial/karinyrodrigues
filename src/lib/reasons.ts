import { FailureReason } from './types'

export const FAILURE_REASONS: FailureReason[] = [
  { id: 'time', label: 'Faltou tempo', helpText: 'O dia não abriu espaço para isso.' },
  { id: 'energy', label: 'Sem energia', helpText: 'Cansaço físico ou mental.' },
  { id: 'motivation', label: 'Sem vontade', helpText: 'A motivação sumiu hoje.' },
  { id: 'unclear', label: 'Não ficou claro o que fazer', helpText: 'A ação não estava clara o suficiente.' },
  { id: 'overload', label: 'Excesso de coisas ao mesmo tempo', helpText: 'Muita coisa acontecendo em paralelo.' },
  { id: 'forgot', label: 'Esqueci', helpText: 'Simplesmente saiu da cabeça.' },
  { id: 'travel', label: 'Viagem', helpText: 'Fora da rotina por deslocamento.' },
  { id: 'illness', label: 'Doença', helpText: 'Não estava bem de saúde.' },
]

export function reasonLabel(id: string): string {
  return FAILURE_REASONS.find((r) => r.id === id)?.label ?? id
}

interface Diagnosis {
  diagnosis: string
  optionA: { label: string; changeSummary: string; capacityDelta: number }
  optionB: { label: string; changeSummary: string; capacityDelta: number }
}

export function diagnose(reasonId: string): Diagnosis {
  switch (reasonId) {
    case 'time':
      return {
        diagnosis: 'A rotina atual não está encaixando com o tempo real disponível.',
        optionA: { label: 'Reduzir a carga semanal', changeSummary: 'Reduzimos a frequência dos hábitos para caber no seu tempo real.', capacityDelta: -15 },
        optionB: { label: 'Manter e ajustar o horário', changeSummary: 'Mantivemos a carga, mas movemos as ações para uma janela mais provável.', capacityDelta: 0 },
      }
    case 'energy':
      return {
        diagnosis: 'O esforço pedido está acima da energia disponível nos dias atuais.',
        optionA: { label: 'Reduzir a intensidade', changeSummary: 'Simplificamos as ações para exigir menos energia por execução.', capacityDelta: -15 },
        optionB: { label: 'Manter e tentar de novo', changeSummary: 'Mantivemos o plano — foi um dia isolado de baixa energia.', capacityDelta: 0 },
      }
    case 'motivation':
      return {
        diagnosis: 'A meta pode estar distante demais do motivo original.',
        optionA: { label: 'Simplificar o próximo passo', changeSummary: 'Reduzimos o próximo passo a algo bem menor e mais imediato.', capacityDelta: -10 },
        optionB: { label: 'Manter e tentar de novo', changeSummary: 'Mantivemos o plano — a motivação costuma variar sem mudar o plano.', capacityDelta: 0 },
      }
    case 'unclear':
      return {
        diagnosis: 'A ação não estava específica o suficiente para ser executada sem pensar.',
        optionA: { label: 'Tornar a ação mais específica', changeSummary: 'Reescrevemos os hábitos como ações concretas e específicas.', capacityDelta: 0 },
        optionB: { label: 'Manter e tentar de novo', changeSummary: 'Mantivemos o plano como está.', capacityDelta: 0 },
      }
    case 'overload':
      return {
        diagnosis: 'Muitas frentes ao mesmo tempo estão competindo pela sua atenção.',
        optionA: { label: 'Reduzir para o essencial', changeSummary: 'Cortamos temporariamente para o hábito mais importante da meta.', capacityDelta: -25 },
        optionB: { label: 'Manter e tentar de novo', changeSummary: 'Mantivemos o plano — pode ter sido uma semana pontual.', capacityDelta: 0 },
      }
    case 'forgot':
      return {
        diagnosis: 'O plano não está aparecendo no momento certo do seu dia.',
        optionA: { label: 'Ajustar horário do lembrete', changeSummary: 'Movemos o lembrete para um horário com mais chance de execução.', capacityDelta: 0 },
        optionB: { label: 'Manter e tentar de novo', changeSummary: 'Mantivemos o plano como está.', capacityDelta: 0 },
      }
    case 'travel':
      return {
        diagnosis: 'Rotina fora do padrão por deslocamento.',
        optionA: { label: 'Ativar modo Viagem', changeSummary: 'Reduzimos o plano ao mínimo viável até você voltar à rotina.', capacityDelta: -40 },
        optionB: { label: 'Manter e tentar de novo', changeSummary: 'Mantivemos o plano como está.', capacityDelta: 0 },
      }
    case 'illness':
      return {
        diagnosis: 'Prioridade agora é recuperar — o plano pode esperar.',
        optionA: { label: 'Ativar modo Doença', changeSummary: 'Pausamos a cobrança e reduzimos o plano ao mínimo até você melhorar.', capacityDelta: -60 },
        optionB: { label: 'Manter e tentar de novo', changeSummary: 'Mantivemos o plano como está.', capacityDelta: 0 },
      }
    default:
      return {
        diagnosis: 'Vamos entender melhor o que aconteceu.',
        optionA: { label: 'Reduzir a carga', changeSummary: 'Reduzimos a carga do plano.', capacityDelta: -10 },
        optionB: { label: 'Manter e tentar de novo', changeSummary: 'Mantivemos o plano como está.', capacityDelta: 0 },
      }
  }
}
