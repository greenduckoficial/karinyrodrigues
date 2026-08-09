import React from 'react'

export function ProgressRing({ percent, size = 56, label }: { percent: number; size?: number; label?: string }) {
  const stroke = 5
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const clamped = Math.max(0, Math.min(100, percent))
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="oklch(var(--line))" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="oklch(var(--accent))"
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={c - (clamped / 100) * c}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-xs font-medium text-ink">{label ?? `${clamped}%`}</span>
    </div>
  )
}
