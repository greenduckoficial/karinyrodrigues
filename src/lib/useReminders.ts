import { useEffect, useRef } from 'react'
import { AppState } from './types'

const WEEKDAY_INDEX: Record<string, number> = {
  domingo: 0,
  segunda: 1,
  terca: 2,
  quarta: 3,
  quinta: 4,
  sexta: 5,
  sabado: 6,
}

/**
 * Best-effort in-browser reminder scheduler: while the app is open it checks
 * once a minute whether it's time for the check-in or weekly review and
 * fires a Notification. There is no backend push infra in this repo yet, so
 * this only covers the "app open" case.
 */
export function useReminders(state: AppState) {
  const firedToday = useRef<Set<string>>(new Set())

  useEffect(() => {
    if (typeof Notification === 'undefined') return

    const interval = setInterval(() => {
      if (Notification.permission !== 'granted') return
      const now = new Date()
      const hhmm = now.toTimeString().slice(0, 5)
      const dayKey = now.toISOString().slice(0, 10)

      const { notifications } = state
      if (notifications.checkInEnabled && notifications.checkInTime === hhmm) {
        const key = `checkin-${dayKey}`
        if (!firedToday.current.has(key)) {
          firedToday.current.add(key)
          new Notification('Cadence', { body: 'Hora do seu check-in de 15 segundos.' })
        }
      }

      if (
        notifications.weeklyReviewEnabled &&
        notifications.weeklyReviewTime === hhmm &&
        WEEKDAY_INDEX[notifications.weeklyReviewDay] === now.getDay()
      ) {
        const key = `review-${dayKey}`
        if (!firedToday.current.has(key)) {
          firedToday.current.add(key)
          new Notification('Cadence', { body: 'Hora da sua revisão semanal de 3 minutos.' })
        }
      }
    }, 30_000)

    return () => clearInterval(interval)
  }, [state.notifications])
}
