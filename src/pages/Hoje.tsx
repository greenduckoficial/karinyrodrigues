import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '@/context/AppContext'
import { Card, Eyebrow } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { CoachCard } from '@/components/CoachCard'
import { ReasonPicker } from '@/components/ReasonPicker'
import { PlanDiff } from '@/components/PlanDiff'
import { ModeBanner } from '@/components/ModeBanner'
import { FailureCategory, Habit, LifeEventType } from '@/lib/types'
import { todayISO } from '@/lib/id'

const MODES: { type: LifeEventType; label: string }[] = [
  { type: 'viagem', label: 'Viagem' },
  { type: 'doenca', label: 'Doença' },
  { type: 'sobrecarga', label: 'Sobrecarga' },
  { type: 'pausa', label: 'Pausa consciente' },
]

export default function Hoje() {
  const { state, activePlanVersion, checkIn, applyAdaptation, startLifeEvent, endLifeEvent } = useApp()
  const [failing, setFailing] = useState<{ habit: Habit } | null>(null)
  const [reason, setReason] = useState<{ habit: Habit; reasonId: FailureCategory; note: string } | null>(null)

  const activeEvent = state.lifeEvents.find((e) => e.active)
  const activeGoals = state.goals.filter((g) => g.status === 'active')
  const today = todayISO()

  const todaysActions = activeGoals.flatMap((goal) => {
    const version = activePlanVersion(goal.id)
    if (!version) return []
    return version.habits.map((habit) => ({ goal, habit, version }))
  })

  const doneToday = (habitId: string) => state.checkIns.some((c) => c.habitId === habitId && c.date === today)

  function handleStatus(habit: Habit, goalId: string, status: 'done' | 'partial' | 'missed') {
    if (status === 'missed') {
      setFailing({ habit })
      return
    }
    checkIn(habit.id, goalId, status)
  }

  function handleReasonSubmit(reasonId: FailureCategory, note: string) {
    if (!failing) return
    checkIn(failing.habit.id, failing.habit.goalId, 'missed', reasonId, note)
    setReason({ habit: failing.habit, reasonId, note })
    setFailing(null)
  }

  function handleChoice(choice: 'A' | 'B') {
    if (!reason) return
    applyAdaptation(reason.habit.goalId, reason.reasonId, reason.note, choice)
    setReason(null)
  }

  const coachText = activeGoals.length === 0
    ? 'Ainda não temos uma meta ativa. Que tal começar pela primeira?'
    : `Bem-vindo(a) de volta${state.profile.name ? `, ${state.profile.name}` : ''}. Foco em consistência, não em perfeição.`

  return (
    <div className="max-w-prose">
      <CoachCard text={coachText} />

      {activeEvent && (
        <ModeBanner event={activeEvent} onEnd={() => endLifeEvent(activeEvent.id)} />
      )}

      <h1 className="font-editorial text-3xl text-ink">Hoje</h1>

      {todaysActions.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="Nenhuma ação planejada ainda"
            detail="Crie sua primeira meta para receber um plano de ações."
            action={
              <Link to="/metas/nova">
                <Button>Criar primeira meta</Button>
              </Link>
            }
          />
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-3">
          {todaysActions.map(({ goal, habit }) => {
            const done = doneToday(habit.id)
            const checkInRecord = state.checkIns.find((c) => c.habitId === habit.id && c.date === today)
            return (
              <Card key={habit.id}>
                <Eyebrow>{goal.title}</Eyebrow>
                <div className="mt-1 text-base text-ink">{habit.name}</div>
                {done ? (
                  <div className="mt-3 text-sm text-muted">
                    Registrado hoje como{' '}
                    <span className="text-ink font-medium">
                      {checkInRecord?.status === 'done' ? 'feito' : checkInRecord?.status === 'partial' ? 'parcial' : 'não feito'}
                    </span>
                    .
                  </div>
                ) : (
                  <div className="mt-3 flex gap-2">
                    <Button variant="secondary" onClick={() => handleStatus(habit, goal.id, 'done')}>
                      Feito
                    </Button>
                    <Button variant="secondary" onClick={() => handleStatus(habit, goal.id, 'partial')}>
                      Parcial
                    </Button>
                    <Button variant="secondary" onClick={() => handleStatus(habit, goal.id, 'missed')}>
                      Não feito
                    </Button>
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      )}

      {!activeEvent && activeGoals.length > 0 && (
        <div className="mt-10">
          <Eyebrow>Ciclos de vida</Eyebrow>
          <div className="mt-2 flex flex-wrap gap-2">
            {MODES.map((m) => (
              <Button key={m.type} variant="ghost" onClick={() => startLifeEvent(m.type)}>
                {m.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {failing && (
        <ReasonPicker onSubmit={handleReasonSubmit} onCancel={() => setFailing(null)} />
      )}
      {reason && <PlanDiff reasonId={reason.reasonId} onChoose={handleChoice} onCancel={() => setReason(null)} />}
    </div>
  )
}
