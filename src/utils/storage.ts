import { AppState, DailyLog, Streak, UserSettings } from '../types'

const KEYS = {
  SETTINGS: 'hydronag_settings',
  DAILY_LOG: 'hydronag_daily_log',
  STREAK: 'hydronag_streak',
}

// --- Defaults ---

const defaultSettings: UserSettings = {
  goal: 8,
  theme: 'auto',
  notificationsEnabled: false,
  notificationTimes: ['09:00', '12:00', '15:00', '18:00'],
  onboardingComplete: false,
}

const defaultStreak: Streak = {
  current: 0,
  longest: 0,
  lastLoggedDate: '',
}

const getTodayString = (): string => {
  return new Date().toISOString().split('T')[0] // YYYY-MM-DD
}

const defaultDailyLog = (): DailyLog => ({
  date: getTodayString(),
  glasses: 0,
})

// --- Settings ---

export const getSettings = (): UserSettings => {
  const raw = localStorage.getItem(KEYS.SETTINGS)
  if (!raw) return defaultSettings
  return { ...defaultSettings, ...JSON.parse(raw) }
}

export const saveSettings = (settings: UserSettings): void => {
  localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings))
}

// --- Daily Log ---

export const getTodayLog = (): DailyLog => {
  const raw = localStorage.getItem(KEYS.DAILY_LOG)
  if (!raw) return defaultDailyLog()

  const log: DailyLog = JSON.parse(raw)

  // if stored date is not today, reset it
  if (log.date !== getTodayString()) {
    const fresh = defaultDailyLog()
    saveDailyLog(fresh)
    return fresh
  }

  return log
}

export const saveDailyLog = (log: DailyLog): void => {
  localStorage.setItem(KEYS.DAILY_LOG, JSON.stringify(log))
}

export const addGlass = (): DailyLog => {
  const log = getTodayLog()
  const updated = { ...log, glasses: log.glasses + 1 }
  saveDailyLog(updated)
  return updated
}

// --- Streak ---

export const getStreak = (): Streak => {
  const raw = localStorage.getItem(KEYS.STREAK)
  if (!raw) return defaultStreak
  return JSON.parse(raw)
}

export const saveStreak = (streak: Streak): void => {
  localStorage.setItem(KEYS.STREAK, JSON.stringify(streak))
}

export const updateStreak = (goal: number): Streak => {
  const log = getTodayLog()
  const streak = getStreak()
  const today = getTodayString()

  // only update streak if goal is met
  if (log.glasses < goal) return streak
  // already updated today
  if (streak.lastLoggedDate === today) return streak

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayString = yesterday.toISOString().split('T')[0]

  const isConsecutive = streak.lastLoggedDate === yesterdayString
  const newCurrent = isConsecutive ? streak.current + 1 : 1
  const updated: Streak = {
    current: newCurrent,
    longest: Math.max(newCurrent, streak.longest),
    lastLoggedDate: today,
  }

  saveStreak(updated)
  return updated
}

// --- Full State ---

export const loadAppState = (): AppState => ({
  settings: getSettings(),
  todayLog: getTodayLog(),
  streak: getStreak(),
})

// --- Reset (for settings page) ---

export const resetAll = (): void => {
  Object.values(KEYS).forEach(key => localStorage.removeItem(key))
}