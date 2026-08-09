import React from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '@/context/AppContext'
import { Card, Eyebrow } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { suggestCheckInTime, suggestWeeklyReviewDay, weekdayLabel, WEEKDAY_OPTIONS } from '@/lib/notifications'

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 rounded-full transition-soft ${checked ? 'bg-accent' : 'bg-line'}`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-card transition-soft ${checked ? 'left-5' : 'left-0.5'}`}
      />
    </button>
  )
}

export default function Notificacoes() {
  const { state, updateNotifications, requestBrowserPermission } = useApp()
  const { notifications, profile } = state

  const suggestedCheckIn = suggestCheckInTime(profile)
  const suggestedReviewDay = suggestWeeklyReviewDay(profile)

  function applyAdaptiveSuggestion() {
    updateNotifications({
      checkInTime: suggestedCheckIn,
      weeklyReviewDay: suggestedReviewDay,
      adaptiveTiming: true,
    })
  }

  return (
    <div className="max-w-prose">
      <Link to="/perfil" className="text-sm text-muted hover:text-ink transition-soft">
        ← Perfil
      </Link>
      <h1 className="mt-2 font-editorial text-3xl text-ink">Lembretes</h1>
      <p className="mt-2 text-sm text-muted">
        Configurados de acordo com o seu ritmo — ajuste sempre que quiser.
      </p>

      <Card className="mt-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-ink font-medium">Check-in diário</div>
            <div className="text-xs text-muted">Um lembrete rápido de 15 segundos.</div>
          </div>
          <Toggle checked={notifications.checkInEnabled} onChange={(v) => updateNotifications({ checkInEnabled: v })} />
        </div>
        {notifications.checkInEnabled && (
          <div className="mt-4 flex items-center gap-3">
            <label className="text-sm text-muted">Horário</label>
            <input
              type="time"
              value={notifications.checkInTime}
              onChange={(e) => updateNotifications({ checkInTime: e.target.value, adaptiveTiming: false })}
              className="rounded-lg border border-line bg-transparent px-3 py-1.5 text-sm text-ink focus:outline-none focus:border-accent"
            />
          </div>
        )}
      </Card>

      <Card className="mt-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-ink font-medium">Revisão semanal</div>
            <div className="text-xs text-muted">3 minutos para olhar a semana e ajustar o plano.</div>
          </div>
          <Toggle checked={notifications.weeklyReviewEnabled} onChange={(v) => updateNotifications({ weeklyReviewEnabled: v })} />
        </div>
        {notifications.weeklyReviewEnabled && (
          <div className="mt-4 flex items-center gap-3">
            <select
              value={notifications.weeklyReviewDay}
              onChange={(e) => updateNotifications({ weeklyReviewDay: e.target.value, adaptiveTiming: false })}
              className="rounded-lg border border-line bg-transparent px-3 py-1.5 text-sm text-ink focus:outline-none focus:border-accent"
            >
              {WEEKDAY_OPTIONS.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
            <input
              type="time"
              value={notifications.weeklyReviewTime}
              onChange={(e) => updateNotifications({ weeklyReviewTime: e.target.value, adaptiveTiming: false })}
              className="rounded-lg border border-line bg-transparent px-3 py-1.5 text-sm text-ink focus:outline-none focus:border-accent"
            />
          </div>
        )}
      </Card>

      <Card className="mt-4">
        <Eyebrow>Ajuste automático pelo seu ritmo</Eyebrow>
        <p className="mt-2 text-sm text-ink">
          Com base na sua Descoberta: check-in por volta das <span className="font-medium">{suggestedCheckIn}</span>, revisão
          semanal em <span className="font-medium">{weekdayLabel(suggestedReviewDay)}</span> — evitando seus dias mais cheios.
        </p>
        <Button variant="secondary" className="mt-3" onClick={applyAdaptiveSuggestion}>
          Aplicar sugestão
        </Button>
      </Card>

      <Card className="mt-4">
        <Eyebrow>Notificações do navegador</Eyebrow>
        <p className="mt-2 text-sm text-muted">
          Status: <span className="text-ink">{notifications.browserPermission}</span>
        </p>
        {notifications.browserPermission !== 'granted' && notifications.browserPermission !== 'unsupported' && (
          <Button variant="secondary" className="mt-3" onClick={requestBrowserPermission}>
            Ativar notificações
          </Button>
        )}
        {notifications.browserPermission === 'unsupported' && (
          <p className="mt-2 text-xs text-muted">Este navegador não suporta notificações push.</p>
        )}
      </Card>
    </div>
  )
}
