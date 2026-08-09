import React from 'react'
import { LifeEvent } from '@/lib/types'
import { Button } from '@/components/ui/Button'

const LABELS: Record<LifeEvent['type'], string> = {
  viagem: 'Modo Viagem ativo',
  doenca: 'Modo Doença ativo',
  sobrecarga: 'Modo Sobrecarga ativo',
  pausa: 'Pausa consciente ativa',
}

export function ModeBanner({ event, onEnd }: { event: LifeEvent; onEnd: () => void }) {
  return (
    <div className="mb-8 flex items-center justify-between rounded-2xl border border-amber/40 bg-amber/10 px-5 py-3">
      <div className="text-sm text-ink">
        <span className="font-medium">{LABELS[event.type]}</span> — o plano está reduzido ao mínimo até você voltar.
      </div>
      <Button variant="secondary" onClick={onEnd}>
        Voltar à rotina
      </Button>
    </div>
  )
}
