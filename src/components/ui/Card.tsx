import React from 'react'

export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-line bg-card p-6 ${className}`}>{children}</div>
  )
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <div className="text-xs font-medium tracking-wide text-muted uppercase">{children}</div>
}
