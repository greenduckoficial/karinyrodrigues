import { UserProfile } from './types'

const WEEKDAY_LABELS: Record<string, string> = {
  segunda: 'Segunda',
  terca: 'Terça',
  quarta: 'Quarta',
  quinta: 'Quinta',
  sexta: 'Sexta',
  sabado: 'Sábado',
  domingo: 'Domingo',
}

export const WEEKDAY_OPTIONS = Object.entries(WEEKDAY_LABELS).map(([value, label]) => ({ value, label }))

export function suggestCheckInTime(profile: UserProfile): string {
  if (profile.preferredCheckInTime) return profile.preferredCheckInTime
  if (profile.chronotype === 'manha') return '08:00'
  if (profile.chronotype === 'tarde') return '13:30'
  return '20:00'
}

export function suggestWeeklyReviewDay(profile: UserProfile): string {
  const all = Object.keys(WEEKDAY_LABELS)
  const free = all.filter((d) => !profile.busyDays.includes(d))
  return free.includes('domingo') ? 'domingo' : free[0] ?? profile.weeklyReviewDay ?? 'domingo'
}

export function weekdayLabel(value: string): string {
  return WEEKDAY_LABELS[value] ?? value
}
