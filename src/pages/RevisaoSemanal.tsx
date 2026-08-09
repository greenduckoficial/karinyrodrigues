import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useApp } from '@/context/AppContext'
import { Button } from '@/components/ui/Button'
import { Eyebrow } from '@/components/ui/Card'

export default function RevisaoSemanal() {
  const { goalId } = useParams()
  const navigate = useNavigate()
  const { state, submitWeeklyReview } = useApp()
  const goal = state.goals.find((g) => g.id === goalId)
  const [worked, setWorked] = useState('')
  const [broke, setBroke] = useState('')

  if (!goal) return null

  function handleSubmit() {
    submitWeeklyReview(goal!.id, worked, broke)
    navigate(`/metas/${goal!.id}`)
  }

  return (
    <div className="max-w-prose">
      <h1 className="font-editorial text-3xl text-ink">Revisão semanal</h1>
      <p className="mt-2 text-sm text-muted">{goal.title} — 3 minutos para olhar a semana com honestidade.</p>

      <div className="mt-6">
        <Eyebrow>O que funcionou</Eyebrow>
        <textarea
          value={worked}
          onChange={(e) => setWorked(e.target.value)}
          rows={3}
          className="mt-2 w-full rounded-xl border border-line bg-transparent p-4 text-sm text-ink focus:outline-none focus:border-accent transition-soft resize-none"
        />
      </div>

      <div className="mt-4">
        <Eyebrow>O que quebrou</Eyebrow>
        <textarea
          value={broke}
          onChange={(e) => setBroke(e.target.value)}
          rows={3}
          className="mt-2 w-full rounded-xl border border-line bg-transparent p-4 text-sm text-ink focus:outline-none focus:border-accent transition-soft resize-none"
        />
      </div>

      <Button className="mt-6" onClick={handleSubmit}>
        Concluir revisão
      </Button>
    </div>
  )
}
