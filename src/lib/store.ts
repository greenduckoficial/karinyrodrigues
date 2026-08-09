import { AppState, UserProfile, NotificationSettings } from './types'

const STORAGE_KEY = 'cadence.state.v1'

export const defaultProfile: UserProfile = {
  name: '',
  chronotype: '',
  busyDays: [],
  availableWindow: '',
  biggestObstacle: '',
  pastAbandonPattern: '',
  motivationStyle: '',
  preferredCheckInTime: '20:00',
  weeklyReviewDay: 'domingo',
  weeklyReviewTime: '19:00',
  discoveryCompletedAt: '',
}

export const defaultNotifications: NotificationSettings = {
  checkInEnabled: true,
  checkInTime: '20:00',
  weeklyReviewEnabled: true,
  weeklyReviewDay: 'domingo',
  weeklyReviewTime: '19:00',
  adaptiveTiming: true,
  browserPermission: typeof Notification !== 'undefined' ? Notification.permission : 'unsupported',
}

export function defaultState(): AppState {
  return {
    profile: defaultProfile,
    onboarded: false,
    discoveryAnswers: [],
    goals: [],
    planVersions: [],
    checkIns: [],
    adaptations: [],
    coachSessions: [],
    reflections: [],
    lifeEvents: [],
    notifications: defaultNotifications,
  }
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState()
    const parsed = JSON.parse(raw)
    return { ...defaultState(), ...parsed, profile: { ...defaultProfile, ...parsed.profile }, notifications: { ...defaultNotifications, ...parsed.notifications } }
  } catch {
    return defaultState()
  }
}

export function saveState(state: AppState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function clearState() {
  localStorage.removeItem(STORAGE_KEY)
}
