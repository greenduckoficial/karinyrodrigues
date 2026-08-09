import { CheckIn, Habit, PlanVersion, Goal } from './types'
import { addDays, todayISO } from './id'

export function last14Days(): string[] {
  const days: string[] = []
  for (let i = 13; i >= 0; i--) days.push(addDays(todayISO(), -i))
  return days
}

export function consistencyForRange(checkIns: CheckIn[], dates: string[]): number {
  const inRange = checkIns.filter((c) => dates.includes(c.date))
  if (inRange.length === 0) return 0
  const scored = inRange.reduce((sum, c) => sum + (c.status === 'done' ? 1 : c.status === 'partial' ? 0.5 : 0), 0)
  return Math.round((scored / inRange.length) * 100)
}

export function consistency14d(checkIns: CheckIn[]): number {
  return consistencyForRange(checkIns, last14Days())
}

export function abandonmentRate(checkIns: CheckIn[]): number | null {
  if (checkIns.length === 0) return null
  const missed = checkIns.filter((c) => c.status === 'missed').length
  return Math.round((missed / checkIns.length) * 100)
}

export function abandonmentRiskLabel(checkIns: CheckIn[]): { label: string; detail: string; level: 'baixo' | 'moderado' | 'alto' | 'indefinido' } {
  if (checkIns.length < 5) {
    return { label: 'Indefinido', detail: 'Poucos dados ainda — siga com os check-ins.', level: 'indefinido' }
  }
  const recent = checkIns.slice(-10)
  const missed = recent.filter((c) => c.status === 'missed').length
  const ratio = missed / recent.length
  if (ratio >= 0.5) return { label: 'Alto', detail: 'Várias faltas recentes — o plano provavelmente precisa de ajuste.', level: 'alto' }
  if (ratio >= 0.25) return { label: 'Moderado', detail: 'Algumas faltas recentes — vale observar de perto.', level: 'moderado' }
  return { label: 'Baixo', detail: 'A execução recente está consistente.', level: 'baixo' }
}

export function overallProgress(goal: Goal, checkIns: CheckIn[]): number {
  const goalCheckIns = checkIns.filter((c) => c.goalId === goal.id)
  if (goalCheckIns.length === 0) return 0
  return consistencyForRange(goalCheckIns, goalCheckIns.map((c) => c.date))
}

export interface HabitStrength {
  habit: Habit
  score: number
  done: number
  total: number
}

export function habitStrengths(habits: Habit[], checkIns: CheckIn[]): HabitStrength[] {
  return habits
    .map((habit) => {
      const relevant = checkIns.filter((c) => c.habitId === habit.id)
      const total = relevant.length
      const done = relevant.filter((c) => c.status === 'done').length
      const scored = relevant.reduce((sum, c) => sum + (c.status === 'done' ? 1 : c.status === 'partial' ? 0.5 : 0), 0)
      const score = total > 0 ? Math.round((scored / total) * 100) : -1
      return { habit, score, done, total }
    })
    .filter((h) => h.total > 0)
    .sort((a, b) => b.score - a.score)
}

export function activeHabits(planVersions: PlanVersion[], goalId: string): Habit[] {
  const versions = planVersions.filter((v) => v.goalId === goalId)
  if (versions.length === 0) return []
  const latest = versions.reduce((a, b) => (b.version > a.version ? b : a))
  return latest.habits
}
