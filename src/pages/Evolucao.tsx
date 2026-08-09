import React from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '@/context/AppContext'
import { Card, Eyebrow } from '@/components/ui/Card'
import { ProgressRing } from '@/components/ui/ProgressRing'
import { ConsistencyChart } from '@/components/ui/ConsistencyChart'
import {
  abandonmentRate,
  abandonmentRiskLabel,
  activeHabits,
  consistency14d,
  habitStrengths,
  overallProgress,
} from '@/lib/analytics'

export default function Evolucao() {
  const { state, planVersionHistory } = useApp()
  const { checkIns, goals, planVersions } = state

  const consistency = consistency14d(checkIns)
  const risk = abandonmentRiskLabel(checkIns)
  const rate = abandonmentRate(checkIns)

  const allHabits = goals.flatMap((g) => activeHabits(planVersions, g.id))
  const strengths = habitStrengths(allHabits, checkIns)
  const strongest = strengths[0]
  const hardest = strengths[strengths.length - 1]

  return (
    <div>
      <h1 className="font-editorial text-3xl text-ink">Evolução</h1>
      <p className="mt-2 text-sm text-muted max-w-prose">
        O que importa não é a sequência perfeita, é a curva subir ao longo dos meses.
      </p>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <Eyebrow>Consistência (14d)</Eyebrow>
          <div className="mt-2 font-editorial text-3xl text-ink">{consistency}%</div>
        </Card>
        <Card>
          <Eyebrow>Taxa de abandono</Eyebrow>
          <div className="mt-2 font-editorial text-3xl text-ink">{rate === null ? '—' : `${rate}%`}</div>
          <div className="mt-1 text-xs text-muted">{rate === null ? 'Sem check-ins ainda.' : 'Do total de check-ins registrados.'}</div>
        </Card>
        <Card>
          <Eyebrow>Risco de abandono</Eyebrow>
          <div className="mt-2 font-editorial text-3xl text-ink">{risk.label}</div>
          <div className="mt-1 text-xs text-muted">{risk.detail}</div>
        </Card>
      </div>

      <Card className="mt-4">
        <Eyebrow>Últimos 14 dias</Eyebrow>
        <div className="mt-4">
          <ConsistencyChart checkIns={checkIns} />
        </div>
      </Card>

      <div className="mt-4">
        <Eyebrow>Progresso geral por meta</Eyebrow>
        {goals.length === 0 ? (
          <Card className="mt-2">
            <div className="text-sm text-muted">Nenhuma meta criada ainda.</div>
          </Card>
        ) : (
          <div className="mt-2 flex flex-col gap-3">
            {goals.map((goal) => {
              const versions = planVersionHistory(goal.id)
              return (
                <Card key={goal.id} className="flex items-center justify-between">
                  <div>
                    <Link to={`/metas/${goal.id}`} className="text-ink font-medium hover:text-accent transition-soft">
                      {goal.title}
                    </Link>
                    <div className="mt-1 text-xs text-muted">{versions.length} versão(ões) de plano</div>
                  </div>
                  <ProgressRing percent={overallProgress(goal, checkIns)} />
                </Card>
              )
            })}
          </div>
        )}
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <Eyebrow>Hábito mais forte</Eyebrow>
          {strongest ? (
            <>
              <div className="mt-2 text-ink font-medium">{strongest.habit.name}</div>
              <div className="mt-1 text-sm text-accent">{strongest.score}% de execução</div>
            </>
          ) : (
            <div className="mt-2 text-sm text-muted">Ainda sem dados suficientes.</div>
          )}
        </Card>
        <Card>
          <Eyebrow>Hábito mais difícil</Eyebrow>
          {hardest && hardest !== strongest ? (
            <>
              <div className="mt-2 text-ink font-medium">{hardest.habit.name}</div>
              <div className="mt-1 text-sm text-amber">{hardest.score}% de execução</div>
            </>
          ) : (
            <div className="mt-2 text-sm text-muted">Ainda sem dados suficientes.</div>
          )}
        </Card>
      </div>

      <div className="mt-4">
        <Link to="/coach" className="text-sm text-accent hover:underline">
          Ver histórico completo do coach →
        </Link>
      </div>
    </div>
  )
}
