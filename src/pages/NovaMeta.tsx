import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '@/context/AppContext'
import { Button } from '@/components/ui/Button'
import { Card, Eyebrow } from '@/components/ui/Card'
import { suggestSmart } from '@/lib/smart'
import { SmartGoal } from '@/lib/types'

const FIELD_LABELS: { key: keyof SmartGoal; label: string }[] = [
  { key: 'specific', label: 'Específica' },
  { key: 'measurable', label: 'Mensurável' },
  { key: 'achievable', label: 'Alcançável' },
  { key: 'relevant', label: 'Relevante' },
  { key: 'timeBound', label: 'Temporal' },
]

export default function NovaMeta() {
  const { createGoal } = useApp()
  const navigate = useNavigate()
  const [dream, setDream] = useState('')
  const [suggestion, setSuggestion] = useState<{ title: string; smart: SmartGoal; targetDate: string } | null>(null)
  const [title, setTitle] = useState('')
  const [smart, setSmart] = useState<SmartGoal | null>(null)
  const [targetDate, setTargetDate] = useState('')

  function handleSuggest() {
    if (!dream.trim()) return
    const s = suggestSmart(dream)
    setSuggestion(s)
    setTitle(s.title)
    setSmart(s.smart)
    setTargetDate(s.targetDate)
  }

  function handleAccept() {
    if (!smart || !title) return
    const goal = createGoal(dream, title, smart, targetDate)
    navigate(`/metas/${goal.id}`)
  }

  if (!suggestion) {
    return (
      <div className="max-w-prose">
        <h1 className="font-editorial text-3xl text-ink">Qual é o seu sonho agora?</h1>
        <p className="mt-2 text-sm text-muted">
          Escreva do jeito que vier à cabeça. Eu transformo isso em uma meta SMART e você decide o resultado final.
        </p>
        <textarea
          autoFocus
          value={dream}
          onChange={(e) => setDream(e.target.value)}
          placeholder="Ex: quero voltar a treinar sem desistir depois de duas semanas"
          rows={4}
          className="mt-6 w-full rounded-xl border border-line bg-transparent p-4 text-base text-ink placeholder:text-muted focus:outline-none focus:border-accent transition-soft resize-none"
        />
        <Button className="mt-5" onClick={handleSuggest} disabled={!dream.trim()}>
          Gerar meta SMART
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-prose">
      <h1 className="font-editorial text-3xl text-ink">Sua meta em formato SMART</h1>
      <p className="mt-2 text-sm text-muted">
        Isso é uma sugestão automática a partir do que você escreveu. Edite qualquer parte antes de aceitar — a decisão final é sempre sua.
      </p>

      <Card className="mt-6">
        <Eyebrow>Título da meta</Eyebrow>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-2 w-full border-b border-line bg-transparent pb-2 text-lg text-ink focus:outline-none focus:border-accent transition-soft"
        />
      </Card>

      <div className="mt-4 flex flex-col gap-4">
        {FIELD_LABELS.map(({ key, label }) => (
          <Card key={key}>
            <Eyebrow>{label}</Eyebrow>
            <textarea
              value={smart![key]}
              onChange={(e) => setSmart((s) => (s ? { ...s, [key]: e.target.value } : s))}
              rows={2}
              className="mt-2 w-full bg-transparent text-sm text-ink focus:outline-none resize-none"
            />
          </Card>
        ))}

        <Card>
          <Eyebrow>Data de avaliação do marco</Eyebrow>
          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            className="mt-2 bg-transparent text-sm text-ink focus:outline-none"
          />
        </Card>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <Button onClick={handleAccept}>Aceitar plano</Button>
        <Button variant="secondary" onClick={() => setSuggestion(null)}>
          Reescrever sonho
        </Button>
      </div>
    </div>
  )
}
