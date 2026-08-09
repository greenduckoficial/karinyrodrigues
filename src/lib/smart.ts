import { SmartGoal } from './types'
import { addDays, todayISO } from './id'

const NUMBER_RE = /(\d+)/

/**
 * Rule-based Discovery→SMART suggestion. Stands in for the Goal Engine's
 * "sonho -> meta SMART" conversion until an LLM backend is wired up; the
 * user always reviews and edits every field before accepting.
 */
export function suggestSmart(dream: string, targetDate?: string): { title: string; smart: SmartGoal; targetDate: string } {
  const clean = dream.trim().replace(/\.$/, '')
  const hasNumber = NUMBER_RE.test(clean)
  const number = clean.match(NUMBER_RE)?.[1]

  const title = clean.length > 60 ? clean.slice(0, 57) + '…' : clean || 'Nova meta'

  const specific = clean
    ? `Transformar "${clean}" em uma ação concreta e recorrente, começando pelo menor passo possível.`
    : 'Descreva a meta com uma ação concreta e recorrente.'

  const measurable = hasNumber
    ? `Acompanhar a execução até atingir ${number} como referência de progresso, com check-ins semanais.`
    : 'Definir um número de referência (dias, sessões ou unidades) para medir progresso semanalmente.'

  const achievable = 'Começar com cerca de 40% da carga imaginada — pequeno o suficiente para não falhar nas duas primeiras semanas.'

  const relevant = 'Conectar essa meta a um motivo pessoal claro, revisado a cada semana para manter o sentido.'

  const suggestedTargetDate = targetDate || addDays(todayISO(), 90)
  const timeBound = `Revisar o progresso a cada semana, com marco de avaliação em ${new Date(suggestedTargetDate + 'T00:00:00').toLocaleDateString('pt-BR')}.`

  return {
    title,
    smart: { specific, measurable, achievable, relevant, timeBound },
    targetDate: suggestedTargetDate,
  }
}

export function suggestHabits(title: string): { name: string; cadencePerWeek: number; difficulty: 'facil' | 'medio' | 'dificil' }[] {
  return [
    { name: `${title} — primeira sessão curta (10-15 min)`, cadencePerWeek: 3, difficulty: 'facil' },
  ]
}
