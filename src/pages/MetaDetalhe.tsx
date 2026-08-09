import React from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useApp } from '@/context/AppContext'
import { Card, Eyebrow } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { habitStrengths, overallProgress } from '@/lib/analytics'
import { SmartGoal } from '@/lib/types'

const FIELD_LABELS: { key: keyof SmartGoal; label: string }[] = [
  { key: 'specific', label: 'Específica' },
  { key: 'measurable', label: 'Mensurável' },
  { key: 'achievable', label: 'Alcançável' },
  { key: 'relevant', label: 'Relevante' },
  { key: 'timeBound', label: 'Temporal' },
]

export default function MetaDetalhe() {
  const { goalId } = useParams()
  const navigate = useNavigate()
  const { state, activePlanVersion, planVersionHistory } = useApp()
  const goal = state.goals.find((g) => g.id === goalId)

  if (!goal) {
    return (
      <div>
        <p className="text-sm text-muted">Meta não encontrada.</p>
        <Link to="/metas" className="text-accent text-sm hover:underline">
          Voltar para metas
        </Link>
      </div>
    )
  }

  const version = activePlanVersion(goal.id)
  const history = planVersionHistory(goal.id)
  const strengths = habitStrengths(version?.habits ?? [], state.checkIns)

  return (
    <div className="max-w-prose">
      <Link to="/metas" className="text-sm text-muted hover:text-ink transition-soft">
        ← Metas
      </Link>
      <div className="mt-2 flex items-center justify-between">
        <h1 className="font-editorial text-3xl text-ink">{goal.title}</h1>
        <Button variant="secondary" onClick={() => navigate(`/metas/${goal.id}/revisao`)}>
          Revisão semanal
        </Button>
      </div>
      <div className="mt-2 text-sm text-muted">Progresso geral: {overallProgress(goal, state.checkIns)}%</div>

      <div className="mt-6">
        <Eyebrow>Meta SMART</Eyebrow>
        <div className="mt-2 flex flex-col gap-3">
          {FIELD_LABELS.map(({ key, label }) => (
            <Card key={key}>
              <div className="text-xs font-medium text-muted uppercase">{label}</div>
              <div className="mt-1 text-sm text-ink">{goal.smart[key]}</div>
            </Card>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <Eyebrow>Hábitos do plano atual (v{version?.version ?? '—'})</Eyebrow>
        <div className="mt-2 flex flex-col gap-2">
          {version?.habits.map((habit) => {
            const s = strengths.find((h) => h.habit.id === habit.id)
            return (
              <Card key={habit.id} className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-ink">{habit.name}</div>
                  <div className="text-xs text-muted">{habit.cadencePerWeek}x por semana</div>
                </div>
                <div className="text-sm text-muted">{s ? `${s.score}%` : 'sem dados'}</div>
              </Card>
            )
          })}
        </div>
      </div>

      <div className="mt-6">
        <Eyebrow>Histórico de versões do plano</Eyebrow>
        <div className="mt-2 flex flex-col gap-2">
          {history.map((v) => (
            <Card key={v.id}>
              <div className="flex items-center justify-between">
                <div className="text-sm text-ink font-medium">Versão {v.version}</div>
                <div className="text-xs text-muted">{new Date(v.createdAt).toLocaleDateString('pt-BR')}</div>
              </div>
              <div className="mt-1 text-sm text-muted">{v.changeSummary}</div>
              <div className="mt-1 text-xs text-muted">Capacidade: {v.capacityPercent}%</div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
