import React from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '@/context/AppContext'
import { Card, Eyebrow } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import { ProgressRing } from '@/components/ui/ProgressRing'
import { overallProgress } from '@/lib/analytics'

const STATUS_LABEL: Record<string, string> = {
  active: 'Ativa',
  paused: 'Pausada',
  completed: 'Concluída',
  archived: 'Arquivada',
}

export default function Metas() {
  const { state } = useApp()

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-editorial text-3xl text-ink">Metas</h1>
        <Link to="/metas/nova">
          <Button>Nova meta</Button>
        </Link>
      </div>

      {state.goals.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="Nenhuma meta ainda"
            detail="Toda meta começa como um sonho em texto livre — eu transformo em plano."
            action={
              <Link to="/metas/nova">
                <Button>Criar primeira meta</Button>
              </Link>
            }
          />
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-3">
          {state.goals.map((goal) => (
            <Link key={goal.id} to={`/metas/${goal.id}`}>
              <Card className="flex items-center justify-between hover:border-accent/40 transition-soft">
                <div>
                  <Eyebrow>{STATUS_LABEL[goal.status]}</Eyebrow>
                  <div className="mt-1 text-lg text-ink font-medium">{goal.title}</div>
                  <div className="mt-1 text-xs text-muted">
                    Marco em {new Date(goal.targetDate + 'T00:00:00').toLocaleDateString('pt-BR')}
                  </div>
                </div>
                <ProgressRing percent={overallProgress(goal, state.checkIns)} />
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
