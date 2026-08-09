import React from 'react'

export function EmptyState({ title, detail, action }: { title: string; detail: string; action?: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-line p-10 text-center">
      <div className="font-editorial text-lg text-ink">{title}</div>
      <div className="mt-2 text-sm text-muted max-w-sm mx-auto">{detail}</div>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
