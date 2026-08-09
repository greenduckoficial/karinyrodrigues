import React from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '@/context/AppContext'
import { Card, Eyebrow } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { reasonLabel } from '@/lib/reasons'
import { weekdayLabel } from '@/lib/notifications'

export default function Perfil() {
  const { state, resetAll } = useApp()
  const { profile } = state

  return (
    <div className="max-w-prose">
      <h1 className="font-editorial text-3xl text-ink">Perfil</h1>

      <Card className="mt-6">
        <Eyebrow>Sobre você</Eyebrow>
        <dl className="mt-3 flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">Nome</dt>
            <dd className="text-ink">{profile.name || '—'}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Melhor período do dia</dt>
            <dd className="text-ink capitalize">{profile.chronotype || '—'}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Dias mais cheios</dt>
            <dd className="text-ink">{profile.busyDays.map(weekdayLabel).join(', ') || '—'}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Janela disponível</dt>
            <dd className="text-ink">{profile.availableWindow || '—'}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Maior obstáculo</dt>
            <dd className="text-ink">{profile.biggestObstacle ? reasonLabel(profile.biggestObstacle) : '—'}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Estilo de motivação</dt>
            <dd className="text-ink">{profile.motivationStyle === 'accountability' ? 'Cobrança' : profile.motivationStyle === 'freedom' ? 'Liberdade' : '—'}</dd>
          </div>
        </dl>
      </Card>

      <Card className="mt-4 flex items-center justify-between">
        <div>
          <div className="text-ink font-medium">Lembretes</div>
          <div className="text-xs text-muted">Check-in diário e revisão semanal</div>
        </div>
        <Link to="/perfil/notificacoes">
          <Button variant="secondary">Configurar</Button>
        </Link>
      </Card>

      <Card className="mt-4 flex items-center justify-between">
        <div>
          <div className="text-ink font-medium">Histórico do coach</div>
          <div className="text-xs text-muted">Adaptações, motivos e mudanças de plano</div>
        </div>
        <Link to="/coach">
          <Button variant="secondary">Ver histórico</Button>
        </Link>
      </Card>

      <div className="mt-8">
        <Button variant="ghost" onClick={resetAll}>
          Reiniciar dados locais
        </Button>
      </div>
    </div>
  )
}
