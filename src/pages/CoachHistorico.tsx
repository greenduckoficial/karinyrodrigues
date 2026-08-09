import React, { useMemo, useState } from 'react'
import { useApp } from '@/context/AppContext'
import { Card, Eyebrow } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { formatDateTimePt } from '@/lib/id'
import { reasonLabel } from '@/lib/reasons'

const TRIGGER_LABELS: Record<string, string> = {
  failure: 'Ajuste por falha',
  weekly_review: 'Revisão semanal',
  manual: 'Plano criado',
  onboarding: 'Descoberta',
}

export default function CoachHistorico() {
  const { state } = useApp()
  const [goalFilter, setGoalFilter] = useState<string>('all')

  const sessions = useMemo(() => {
    const filtered = goalFilter === 'all' ? state.coachSessions : state.coachSessions.filter((s) => s.goalId === goalFilter)
    return [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [state.coachSessions, goalFilter])

  function goalTitle(goalId: string) {
    return state.goals.find((g) => g.id === goalId)?.title ?? 'Meta removida'
  }

  function adaptationFor(id?: string) {
    if (!id) return undefined
    return state.adaptations.find((a) => a.id === id)
  }

  return (
    <div>
      <h1 className="font-editorial text-3xl text-ink">Histórico do coach</h1>
      <p className="mt-2 text-sm text-muted max-w-prose">
        Cada adaptação do seu plano, o motivo por trás dela e o que mudou — na ordem em que aconteceu.
      </p>

      {state.goals.length > 1 && (
        <div className="mt-5 flex flex-wrap gap-2">
          <button
            onClick={() => setGoalFilter('all')}
            className={`rounded-full px-3.5 py-1.5 text-sm transition-soft ${goalFilter === 'all' ? 'bg-line/70 text-ink' : 'text-muted hover:text-ink'}`}
          >
            Todas as metas
          </button>
          {state.goals.map((g) => (
            <button
              key={g.id}
              onClick={() => setGoalFilter(g.id)}
              className={`rounded-full px-3.5 py-1.5 text-sm transition-soft ${goalFilter === g.id ? 'bg-line/70 text-ink' : 'text-muted hover:text-ink'}`}
            >
              {g.title}
            </button>
          ))}
        </div>
      )}

      {sessions.length === 0 ? (
        <div className="mt-6">
          <EmptyState title="Nenhuma sessão ainda" detail="Quando o plano se ajustar pela primeira vez, o histórico aparece aqui." />
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-4">
          {sessions.map((session) => {
            const adaptation = adaptationFor(session.adaptationId)
            return (
              <Card key={session.id}>
                <div className="flex items-center justify-between">
                  <Eyebrow>{TRIGGER_LABELS[session.trigger] ?? session.trigger}</Eyebrow>
                  <span className="text-xs text-muted">{formatDateTimePt(session.createdAt)}</span>
                </div>
                <div className="mt-1 text-sm text-muted">{goalTitle(session.goalId)}</div>

                {adaptation && (
                  <div className="mt-3 rounded-xl bg-paper border border-line px-4 py-3">
                    <div className="text-xs text-muted">
                      Motivo informado: <span className="text-ink">{reasonLabel(adaptation.reasonId)}</span>
                      {adaptation.reasonNote && <span className="text-ink"> — {adaptation.reasonNote}</span>}
                    </div>
                    <div className="mt-2 text-sm text-ink">{adaptation.diagnosis}</div>
                    <div className="mt-1 text-sm text-accent">
                      Escolhido: {adaptation.optionChosen} — {adaptation.changeSummary}
                    </div>
                  </div>
                )}

                <div className="mt-3 flex flex-col gap-2">
                  {session.messages.map((m) => (
                    <div key={m.id} className="text-sm">
                      <span className="text-xs font-medium text-muted uppercase mr-2">
                        {m.role === 'coach' ? 'Coach' : 'Você'}
                      </span>
                      <span className="text-ink">{m.text}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
