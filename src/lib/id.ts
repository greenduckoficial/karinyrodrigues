export function newId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `id_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}

export function addDays(dateISO: string, days: number): string {
  const d = new Date(dateISO + 'T00:00:00')
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

export function formatDatePt(dateISO: string): string {
  const d = new Date(dateISO + 'T00:00:00')
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}

export function formatDateTimePt(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
}
