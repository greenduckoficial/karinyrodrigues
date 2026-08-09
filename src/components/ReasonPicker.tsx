import React, { useState } from 'react'
import { FAILURE_REASONS } from '@/lib/reasons'
import { FailureCategory } from '@/lib/types'
import { Button } from '@/components/ui/Button'

export function ReasonPicker({
  onSubmit,
  onCancel,
}: {
  onSubmit: (reasonId: FailureCategory, note: string) => void
  onCancel: () => void
}) {
  const [reasonId, setReasonId] = useState<FailureCategory | null>(null)
  const [note, setNote] = useState('')

  return (
    <div className="fixed inset-0 bg-ink/30 flex items-center justify-center p-6 z-50">
      <div className="w-full max-w-md rounded-2xl bg-card border border-line p-6">
        <h2 className="font-editorial text-xl text-ink">O que aconteceu hoje?</h2>
        <p className="mt-1 text-sm text-muted">Sem culpa — só quero entender pra ajustar o plano.</p>

        <div className="mt-4 flex flex-col gap-2">
          {FAILURE_REASONS.map((r) => (
            <button
              key={r.id}
              onClick={() => setReasonId(r.id)}
              className={`text-left rounded-xl border px-4 py-3 text-sm transition-soft ${
                reasonId === r.id ? 'border-accent bg-accent-soft/20 text-ink' : 'border-line text-ink hover:border-accent/40'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Quer contar mais alguma coisa? (opcional)"
          rows={2}
          className="mt-4 w-full rounded-xl border border-line bg-transparent p-3 text-sm text-ink placeholder:text-muted focus:outline-none focus:border-accent transition-soft resize-none"
        />

        <div className="mt-5 flex gap-3">
          <Button disabled={!reasonId} onClick={() => reasonId && onSubmit(reasonId, note)}>
            Continuar
          </Button>
          <Button variant="ghost" onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  )
}
