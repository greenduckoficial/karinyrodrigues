import React from 'react'
import { CheckIn } from '@/lib/types'
import { formatDatePt } from '@/lib/id'
import { last14Days } from '@/lib/analytics'

export function ConsistencyChart({ checkIns }: { checkIns: CheckIn[] }) {
  const days = last14Days()
  const byDay = days.map((date) => {
    const dayCheckIns = checkIns.filter((c) => c.date === date)
    if (dayCheckIns.length === 0) return { date, value: -1 }
    const scored = dayCheckIns.reduce((sum, c) => sum + (c.status === 'done' ? 1 : c.status === 'partial' ? 0.5 : 0), 0)
    return { date, value: scored / dayCheckIns.length }
  })

  return (
    <div className="flex items-end gap-2 h-32">
      {byDay.map(({ date, value }) => (
        <div key={date} className="flex flex-1 flex-col items-center gap-2">
          <div className="w-full flex-1 flex items-end">
            <div
              className={`w-full rounded-md transition-soft ${value < 0 ? 'bg-line' : 'bg-accent'}`}
              style={{ height: value < 0 ? '6px' : `${Math.max(6, value * 100)}%`, opacity: value < 0 ? 0.5 : 0.35 + value * 0.65 }}
              title={`${formatDatePt(date)}: ${value < 0 ? 'sem registro' : Math.round(value * 100) + '%'}`}
            />
          </div>
          <span className="text-[10px] text-muted">{formatDatePt(date).slice(0, 2)}</span>
        </div>
      ))}
    </div>
  )
}
