import React, { useState } from 'react'
import { Card } from '@/components/ui/Card'

export function CoachCard({ text }: { text: string }) {
  const [dismissed, setDismissed] = useState(false)
  if (dismissed) return null
  return (
    <Card className="mb-8 flex items-start justify-between gap-4">
      <div>
        <div className="text-xs font-medium tracking-wide text-accent uppercase">Coach</div>
        <p className="mt-1 text-sm text-ink">{text}</p>
      </div>
      <button onClick={() => setDismissed(true)} className="text-muted hover:text-ink text-sm transition-soft">
        ✕
      </button>
    </Card>
  )
}
