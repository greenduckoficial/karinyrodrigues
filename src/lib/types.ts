export type ID = string

export type CheckInStatus = 'done' | 'partial' | 'missed'

export type FailureCategory =
  | 'time'
  | 'energy'
  | 'motivation'
  | 'unclear'
  | 'overload'
  | 'forgot'
  | 'travel'
  | 'illness'

export interface FailureReason {
  id: FailureCategory
  label: string
  helpText: string
}

export interface DiscoveryAnswer {
  id: ID
  questionId: string
  question: string
  answer: string | string[]
  createdAt: string
}

export interface UserProfile {
  name: string
  chronotype: 'manha' | 'tarde' | 'noite' | ''
  busyDays: string[]
  availableWindow: string
  biggestObstacle: FailureCategory | ''
  pastAbandonPattern: string
  motivationStyle: 'accountability' | 'freedom' | ''
  preferredCheckInTime: string
  weeklyReviewDay: string
  weeklyReviewTime: string
  discoveryCompletedAt: string | ''
}

export interface SmartGoal {
  specific: string
  measurable: string
  achievable: string
  relevant: string
  timeBound: string
}

export type GoalStatus = 'active' | 'paused' | 'completed' | 'archived'

export interface Goal {
  id: ID
  dream: string
  title: string
  smart: SmartGoal
  status: GoalStatus
  createdAt: string
  targetDate: string
}

export interface Habit {
  id: ID
  goalId: ID
  name: string
  cadencePerWeek: number
  difficulty: 'facil' | 'medio' | 'dificil'
}

export interface PlanVersion {
  id: ID
  goalId: ID
  version: number
  createdAt: string
  reason: string
  changeSummary: string
  habits: Habit[]
  capacityPercent: number
}

export interface CheckIn {
  id: ID
  date: string
  habitId: ID
  goalId: ID
  planVersionId: ID
  status: CheckInStatus
  reasonId?: FailureCategory
  reasonNote?: string
  createdAt: string
}

export interface Adaptation {
  id: ID
  goalId: ID
  fromVersionId: ID
  toVersionId: ID
  reasonId: FailureCategory
  reasonNote: string
  diagnosis: string
  changeSummary: string
  optionChosen: string
  createdAt: string
}

export type CoachTrigger = 'failure' | 'weekly_review' | 'manual' | 'onboarding'

export interface CoachMessage {
  id: ID
  role: 'coach' | 'user'
  text: string
  createdAt: string
}

export interface CoachSession {
  id: ID
  goalId: ID
  trigger: CoachTrigger
  createdAt: string
  messages: CoachMessage[]
  adaptationId?: ID
}

export interface Reflection {
  id: ID
  goalId: ID
  weekStart: string
  worked: string
  broke: string
  createdAt: string
}

export type LifeEventType = 'viagem' | 'doenca' | 'sobrecarga' | 'pausa'

export interface LifeEvent {
  id: ID
  type: LifeEventType
  startDate: string
  endDate: string | ''
  active: boolean
}

export interface NotificationSettings {
  checkInEnabled: boolean
  checkInTime: string
  weeklyReviewEnabled: boolean
  weeklyReviewDay: string
  weeklyReviewTime: string
  adaptiveTiming: boolean
  browserPermission: NotificationPermission | 'unsupported'
}

export interface AppState {
  profile: UserProfile
  onboarded: boolean
  discoveryAnswers: DiscoveryAnswer[]
  goals: Goal[]
  planVersions: PlanVersion[]
  checkIns: CheckIn[]
  adaptations: Adaptation[]
  coachSessions: CoachSession[]
  reflections: Reflection[]
  lifeEvents: LifeEvent[]
  notifications: NotificationSettings
}
