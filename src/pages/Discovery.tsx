import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '@/context/AppContext'
import { Button } from '@/components/ui/Button'
import { FAILURE_REASONS } from '@/lib/reasons'
import { FailureCategory } from '@/lib/types'

type StepType = 'text' | 'choice' | 'multi' | 'time'

interface Step {
  id: string
  question: string
  helper?: string
  type: StepType
  options?: { value: string; label: string }[]
  placeholder?: string
  skip?: (answers: Record<string, string | string[]>) => boolean
}

const WEEKDAYS = [
  { value: 'segunda', label: 'Segunda' },
  { value: 'terca', label: 'Terça' },
  { value: 'quarta', label: 'Quarta' },
  { value: 'quinta', label: 'Quinta' },
  { value: 'sexta', label: 'Sexta' },
  { value: 'sabado', label: 'Sábado' },
  { value: 'domingo', label: 'Domingo' },
]

const BASE_STEPS: Step[] = [
  { id: 'name', question: 'Como você quer ser chamado?', type: 'text', placeholder: 'Seu primeiro nome' },
  {
    id: 'chronotype',
    question: 'Em que parte do dia você costuma render mais?',
    type: 'choice',
    options: [
      { value: 'manha', label: 'De manhã' },
      { value: 'tarde', label: 'À tarde' },
      { value: 'noite', label: 'À noite' },
    ],
  },
  {
    id: 'busyDays',
    question: 'Quais dias da semana costumam ser mais cheios pra você?',
    helper: 'Selecione quantos quiser — isso ajuda a evitar horários impossíveis.',
    type: 'multi',
    options: WEEKDAYS,
  },
  {
    id: 'availableWindow',
    question: 'Quando costuma sobrar um tempinho livre no seu dia?',
    type: 'text',
    placeholder: 'Ex: depois do jantar, no intervalo do almoço...',
  },
  {
    id: 'biggestObstacle',
    question: 'O que mais costuma te fazer parar quando você começa algo novo?',
    type: 'choice',
    options: FAILURE_REASONS.filter((r) => r.id !== 'travel' && r.id !== 'illness').map((r) => ({ value: r.id, label: r.label })),
  },
  {
    id: 'overloadDetail',
    question: 'Quantas coisas diferentes você costuma tentar mudar ao mesmo tempo?',
    helper: 'Isso ajuda a evitar sobrecarregar seu plano logo de início.',
    type: 'choice',
    options: [
      { value: '1', label: 'Só uma' },
      { value: '2-3', label: '2 ou 3' },
      { value: '4+', label: '4 ou mais' },
    ],
    skip: (a) => a.biggestObstacle !== 'overload',
  },
  {
    id: 'pastAbandonPattern',
    question: 'Pensando em tentativas passadas: como elas costumam terminar?',
    type: 'text',
    placeholder: 'Ex: começo forte e abandono na terceira semana...',
  },
  {
    id: 'motivationStyle',
    question: 'O que funciona melhor pra te manter no ritmo?',
    type: 'choice',
    options: [
      { value: 'accountability', label: 'Alguém ou algo cobrando' },
      { value: 'freedom', label: 'Liberdade sem cobrança' },
    ],
  },
  {
    id: 'preferredCheckInTime',
    question: 'Que horas costuma ser um bom momento pra um check-in rápido de 15 segundos?',
    type: 'time',
  },
  {
    id: 'weeklyReviewDay',
    question: 'Qual dia da semana faz mais sentido para uma revisão de 3 minutos?',
    type: 'choice',
    options: WEEKDAYS,
  },
]

export default function Discovery() {
  const { addDiscoveryAnswer, updateProfile, completeOnboarding } = useApp()
  const navigate = useNavigate()
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [index, setIndex] = useState(0)
  const [draft, setDraft] = useState<string | string[]>('')

  const visibleSteps = useMemo(() => BASE_STEPS.filter((s) => !s.skip || !s.skip(answers)), [answers])
  const step = visibleSteps[index]
  const isLast = index === visibleSteps.length - 1

  React.useEffect(() => {
    if (!step) return
    const existing = answers[step.id]
    if (existing !== undefined) {
      setDraft(existing)
    } else {
      setDraft(step.type === 'multi' ? [] : step.type === 'time' ? '20:00' : '')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step?.id])

  function commitAndNext() {
    if (!step) return
    const value = draft
    setAnswers((a) => ({ ...a, [step.id]: value }))
    addDiscoveryAnswer(step.id, step.question, value)

    if (isLast) {
      const finalAnswers = { ...answers, [step.id]: value }
      updateProfile({
        name: (finalAnswers.name as string) || '',
        chronotype: (finalAnswers.chronotype as any) || '',
        busyDays: (finalAnswers.busyDays as string[]) || [],
        availableWindow: (finalAnswers.availableWindow as string) || '',
        biggestObstacle: (finalAnswers.biggestObstacle as FailureCategory) || '',
        pastAbandonPattern: (finalAnswers.pastAbandonPattern as string) || '',
        motivationStyle: (finalAnswers.motivationStyle as any) || '',
        preferredCheckInTime: (finalAnswers.preferredCheckInTime as string) || '20:00',
        weeklyReviewDay: (finalAnswers.weeklyReviewDay as string) || 'domingo',
      })
      completeOnboarding()
      navigate('/metas/nova')
      return
    }
    setIndex((i) => i + 1)
  }

  function goBack() {
    if (index === 0) return
    setIndex((i) => i - 1)
  }

  if (!step) return null

  const canContinue =
    step.type === 'multi' ? true : typeof draft === 'string' ? draft.trim().length > 0 : false

  return (
    <div className="min-h-full">
      <header className="border-b border-line">
        <div className="max-w-4xl mx-auto px-6 py-4 font-editorial text-lg text-ink">Cadence</div>
      </header>
      <main className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="font-editorial text-3xl text-ink leading-tight">{step.question}</h1>
        {step.helper && <p className="mt-2 text-sm text-muted">{step.helper}</p>}
        <div className="mt-6 text-xs font-medium tracking-wide text-accent uppercase">
          {index + 1} de {visibleSteps.length}
        </div>

        <div className="mt-6">
          {step.type === 'text' && (
            <input
              autoFocus
              value={draft as string}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={step.placeholder}
              className="w-full border-b border-line bg-transparent pb-3 text-lg text-ink placeholder:text-muted focus:outline-none focus:border-accent transition-soft"
              onKeyDown={(e) => e.key === 'Enter' && canContinue && commitAndNext()}
            />
          )}

          {step.type === 'time' && (
            <input
              autoFocus
              type="time"
              value={(draft as string) || '20:00'}
              onChange={(e) => setDraft(e.target.value)}
              className="w-40 border-b border-line bg-transparent pb-3 text-lg text-ink focus:outline-none focus:border-accent transition-soft"
            />
          )}

          {step.type === 'choice' && (
            <div className="flex flex-col gap-2">
              {step.options!.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setDraft(opt.value)}
                  className={`text-left rounded-xl border px-4 py-3 text-sm transition-soft ${
                    draft === opt.value ? 'border-accent bg-accent-soft/20 text-ink' : 'border-line text-ink hover:border-accent/40'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {step.type === 'multi' && (
            <div className="flex flex-wrap gap-2">
              {step.options!.map((opt) => {
                const list = (draft as string[]) || []
                const selected = list.includes(opt.value)
                return (
                  <button
                    key={opt.value}
                    onClick={() =>
                      setDraft(selected ? list.filter((v) => v !== opt.value) : [...list, opt.value])
                    }
                    className={`rounded-full border px-4 py-2 text-sm transition-soft ${
                      selected ? 'border-accent bg-accent-soft/20 text-ink' : 'border-line text-ink hover:border-accent/40'
                    }`}
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <div className="mt-8 flex items-center gap-3">
          <Button onClick={commitAndNext} disabled={!canContinue}>
            {isLast ? 'Concluir' : 'Continuar'}
          </Button>
          {index > 0 && (
            <Button variant="ghost" onClick={goBack}>
              Voltar
            </Button>
          )}
        </div>
      </main>
    </div>
  )
}
