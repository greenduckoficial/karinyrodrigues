import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  AppState,
  CheckInStatus,
  FailureCategory,
  Goal,
  Habit,
  LifeEventType,
  NotificationSettings,
  PlanVersion,
  UserProfile,
} from '@/lib/types'
import { loadState, saveState } from '@/lib/store'
import { newId, todayISO } from '@/lib/id'
import { suggestHabits } from '@/lib/smart'
import { diagnose, reasonLabel } from '@/lib/reasons'
import { SmartGoal } from '@/lib/types'

interface AppContextValue {
  state: AppState
  updateProfile: (patch: Partial<UserProfile>) => void
  addDiscoveryAnswer: (questionId: string, question: string, answer: string | string[]) => void
  completeOnboarding: () => void
  createGoal: (dream: string, title: string, smart: SmartGoal, targetDate: string) => Goal
  activePlanVersion: (goalId: string) => PlanVersion | undefined
  planVersionHistory: (goalId: string) => PlanVersion[]
  checkIn: (habitId: string, goalId: string, status: CheckInStatus, reasonId?: FailureCategory, reasonNote?: string) => void
  applyAdaptation: (goalId: string, reasonId: FailureCategory, reasonNote: string, choice: 'A' | 'B') => void
  submitWeeklyReview: (goalId: string, worked: string, broke: string) => void
  startLifeEvent: (type: LifeEventType) => void
  endLifeEvent: (id: string) => void
  updateNotifications: (patch: Partial<NotificationSettings>) => void
  requestBrowserPermission: () => Promise<void>
  resetAll: () => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(() => loadState())

  useEffect(() => {
    saveState(state)
  }, [state])

  const updateProfile: AppContextValue['updateProfile'] = (patch) => {
    setState((s) => ({ ...s, profile: { ...s.profile, ...patch } }))
  }

  const addDiscoveryAnswer: AppContextValue['addDiscoveryAnswer'] = (questionId, question, answer) => {
    setState((s) => ({
      ...s,
      discoveryAnswers: [
        ...s.discoveryAnswers,
        { id: newId(), questionId, question, answer, createdAt: new Date().toISOString() },
      ],
    }))
  }

  const completeOnboarding: AppContextValue['completeOnboarding'] = () => {
    setState((s) => ({
      ...s,
      onboarded: true,
      profile: { ...s.profile, discoveryCompletedAt: new Date().toISOString() },
      notifications: {
        ...s.notifications,
        checkInTime: s.profile.preferredCheckInTime || s.notifications.checkInTime,
        weeklyReviewDay: s.profile.weeklyReviewDay || s.notifications.weeklyReviewDay,
        weeklyReviewTime: s.profile.weeklyReviewTime || s.notifications.weeklyReviewTime,
      },
    }))
  }

  const createGoal: AppContextValue['createGoal'] = (dream, title, smart, targetDate) => {
    const goal: Goal = {
      id: newId(),
      dream,
      title,
      smart,
      status: 'active',
      createdAt: new Date().toISOString(),
      targetDate,
    }
    const habitSeeds = suggestHabits(title)
    const habits: Habit[] = habitSeeds.map((h) => ({ id: newId(), goalId: goal.id, ...h }))
    const version: PlanVersion = {
      id: newId(),
      goalId: goal.id,
      version: 1,
      createdAt: new Date().toISOString(),
      reason: 'Plano inicial gerado a partir da meta SMART.',
      changeSummary: 'Começamos com cerca de 40% da carga imaginada para garantir as duas primeiras semanas.',
      habits,
      capacityPercent: 40,
    }
    const session = {
      id: newId(),
      goalId: goal.id,
      trigger: 'manual' as const,
      createdAt: new Date().toISOString(),
      messages: [
        {
          id: newId(),
          role: 'coach' as const,
          text: `Criei um primeiro plano para "${title}" começando em 40% da carga — pequeno o suficiente para não falhar nas duas primeiras semanas.`,
          createdAt: new Date().toISOString(),
        },
      ],
    }
    setState((s) => ({
      ...s,
      goals: [...s.goals, goal],
      planVersions: [...s.planVersions, version],
      coachSessions: [...s.coachSessions, session],
    }))
    return goal
  }

  const activePlanVersion: AppContextValue['activePlanVersion'] = (goalId) => {
    const versions = state.planVersions.filter((v) => v.goalId === goalId)
    if (versions.length === 0) return undefined
    return versions.reduce((a, b) => (b.version > a.version ? b : a))
  }

  const planVersionHistory: AppContextValue['planVersionHistory'] = (goalId) => {
    return state.planVersions.filter((v) => v.goalId === goalId).sort((a, b) => a.version - b.version)
  }

  const checkIn: AppContextValue['checkIn'] = (habitId, goalId, status, reasonId, reasonNote) => {
    const version = activePlanVersion(goalId)
    if (!version) return
    setState((s) => ({
      ...s,
      checkIns: [
        ...s.checkIns,
        {
          id: newId(),
          date: todayISO(),
          habitId,
          goalId,
          planVersionId: version.id,
          status,
          reasonId,
          reasonNote,
          createdAt: new Date().toISOString(),
        },
      ],
    }))
  }

  const applyAdaptation: AppContextValue['applyAdaptation'] = (goalId, reasonId, reasonNote, choice) => {
    const fromVersion = activePlanVersion(goalId)
    if (!fromVersion) return
    const d = diagnose(reasonId)
    const option = choice === 'A' ? d.optionA : d.optionB
    const nextCapacity = Math.max(15, Math.min(100, fromVersion.capacityPercent + option.capacityDelta))
    const scaledHabits: Habit[] = fromVersion.habits.map((h) => ({
      ...h,
      id: newId(),
      cadencePerWeek:
        option.capacityDelta < 0
          ? Math.max(1, Math.round(h.cadencePerWeek * (nextCapacity / fromVersion.capacityPercent)))
          : h.cadencePerWeek,
    }))
    const toVersion: PlanVersion = {
      id: newId(),
      goalId,
      version: fromVersion.version + 1,
      createdAt: new Date().toISOString(),
      reason: `Adaptação após "${reasonLabel(reasonId)}".`,
      changeSummary: option.changeSummary,
      habits: scaledHabits,
      capacityPercent: nextCapacity,
    }
    const adaptation = {
      id: newId(),
      goalId,
      fromVersionId: fromVersion.id,
      toVersionId: toVersion.id,
      reasonId,
      reasonNote,
      diagnosis: d.diagnosis,
      changeSummary: option.changeSummary,
      optionChosen: option.label,
      createdAt: new Date().toISOString(),
    }
    const session = {
      id: newId(),
      goalId,
      trigger: 'failure' as const,
      createdAt: new Date().toISOString(),
      adaptationId: adaptation.id,
      messages: [
        {
          id: newId(),
          role: 'user' as const,
          text: `Motivo: ${reasonLabel(reasonId)}${reasonNote ? ` — ${reasonNote}` : ''}`,
          createdAt: new Date().toISOString(),
        },
        {
          id: newId(),
          role: 'coach' as const,
          text: `${d.diagnosis} ${option.changeSummary}`,
          createdAt: new Date().toISOString(),
        },
      ],
    }
    setState((s) => ({
      ...s,
      planVersions: [...s.planVersions, toVersion],
      adaptations: [...s.adaptations, adaptation],
      coachSessions: [...s.coachSessions, session],
    }))
  }

  const submitWeeklyReview: AppContextValue['submitWeeklyReview'] = (goalId, worked, broke) => {
    const reflection = {
      id: newId(),
      goalId,
      weekStart: todayISO(),
      worked,
      broke,
      createdAt: new Date().toISOString(),
    }
    const session = {
      id: newId(),
      goalId,
      trigger: 'weekly_review' as const,
      createdAt: new Date().toISOString(),
      messages: [
        {
          id: newId(),
          role: 'user' as const,
          text: `Funcionou: ${worked || '—'}. Quebrou: ${broke || '—'}.`,
          createdAt: new Date().toISOString(),
        },
        {
          id: newId(),
          role: 'coach' as const,
          text: 'Obrigado pela revisão — vou manter isso em mente na próxima versão do plano.',
          createdAt: new Date().toISOString(),
        },
      ],
    }
    setState((s) => ({
      ...s,
      reflections: [...s.reflections, reflection],
      coachSessions: [...s.coachSessions, session],
    }))
  }

  const startLifeEvent: AppContextValue['startLifeEvent'] = (type) => {
    setState((s) => ({
      ...s,
      lifeEvents: [
        ...s.lifeEvents.map((e) => ({ ...e, active: false })),
        { id: newId(), type, startDate: todayISO(), endDate: '', active: true },
      ],
    }))
  }

  const endLifeEvent: AppContextValue['endLifeEvent'] = (id) => {
    setState((s) => ({
      ...s,
      lifeEvents: s.lifeEvents.map((e) => (e.id === id ? { ...e, active: false, endDate: todayISO() } : e)),
    }))
  }

  const updateNotifications: AppContextValue['updateNotifications'] = (patch) => {
    setState((s) => ({ ...s, notifications: { ...s.notifications, ...patch } }))
  }

  const requestBrowserPermission: AppContextValue['requestBrowserPermission'] = async () => {
    if (typeof Notification === 'undefined') {
      updateNotifications({ browserPermission: 'unsupported' })
      return
    }
    const perm = await Notification.requestPermission()
    updateNotifications({ browserPermission: perm })
  }

  const resetAll: AppContextValue['resetAll'] = () => {
    localStorage.removeItem('cadence.state.v1')
    window.location.reload()
  }

  const value = useMemo<AppContextValue>(
    () => ({
      state,
      updateProfile,
      addDiscoveryAnswer,
      completeOnboarding,
      createGoal,
      activePlanVersion,
      planVersionHistory,
      checkIn,
      applyAdaptation,
      submitWeeklyReview,
      startLifeEvent,
      endLifeEvent,
      updateNotifications,
      requestBrowserPermission,
      resetAll,
    }),
    [state],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
