import React from 'react'
import { Button } from '@/components/ui/Button'
import { FailureCategory } from '@/lib/types'
import { diagnose } from '@/lib/reasons'

export function PlanDiff({
  reasonId,
  onChoose,
  onCancel,
}: {
  reasonId: FailureCategory
  onChoose: (choice: 'A' | 'B') => void
  onCancel: () => void
}) {
  const d = diagnose(reasonId)

  return (
    <div className="fixed inset-0 bg-ink/30 flex items-center justify-center p-6 z-50">
      <div className="w-full max-w-md rounded-2xl bg-card border border-line p-6">
        <h2 className="font-editorial text-xl text-ink">Diagnóstico</h2>
        <p className="mt-2 text-sm text-ink">{d.diagnosis}</p>

        <div className="mt-5 flex flex-col gap-3">
          <button
            onClick={() => onChoose('A')}
            className="text-left rounded-xl border border-line px-4 py-3 text-sm hover:border-accent/40 transition-soft"
          >
            <div className="font-medium text-ink">{d.optionA.label}</div>
            <div className="mt-1 text-xs text-muted">{d.optionA.changeSummary}</div>
          </button>
          <button
            onClick={() => onChoose('B')}
            className="text-left rounded-xl border border-line px-4 py-3 text-sm hover:border-accent/40 transition-soft"
          >
            <div className="font-medium text-ink">{d.optionB.label}</div>
            <div className="mt-1 text-xs text-muted">{d.optionB.changeSummary}</div>
          </button>
        </div>

        <Button variant="ghost" className="mt-4" onClick={onCancel}>
          Decidir depois
        </Button>
      </div>
    </div>
  )
}
