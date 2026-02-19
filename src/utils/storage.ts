import { AppState, DailyLog, HistoryEntry, Milestone, Streak, UserSettings } from '../types'
import { DEFAULT_MILESTONES } from '../data/milestone'

const KEYS = {
  SETTINGS: 'hydronag_settings',
  DAILY_LOG: 'hydronag_daily_log',
  STREAK: 'hydronag_streak',
  HISTORY: 'hydronag_history',
  MILESTONES: 'hydronag_milestones',
}

// --- Defaults ---
const defaultSettings: UserSettings = {
  name: '',
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
  return new Date().toISOString().split('T')[0]
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

// --- History ---

export const getHistory = (): HistoryEntry[] => {
  const raw = localStorage.getItem(KEYS.HISTORY)
  if (!raw) return []
  return JSON.parse(raw)
}

export const saveHistory = (history: HistoryEntry[]): void => {
  // keep only last 30 days
  const trimmed = history
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 30)
  localStorage.setItem(KEYS.HISTORY, JSON.stringify(trimmed))
}

const archiveDay = (log: DailyLog, goal: number): void => {
  // don't archive if already in history
  const history = getHistory()
  const alreadyArchived = history.some(h => h.date === log.date)
  if (alreadyArchived) return

  const entry: HistoryEntry = {
    date: log.date,
    glasses: log.glasses,
    goal,
  }

  saveHistory([...history, entry])
}

// --- Daily Log ---

export const getTodayLog = (): DailyLog => {
  const raw = localStorage.getItem(KEYS.DAILY_LOG)
  if (!raw) return defaultDailyLog()

  const log: DailyLog = JSON.parse(raw)

  // if stored date is not today, archive it then reset
  if (log.date !== getTodayString()) {
    const settings = getSettings()
    archiveDay(log, settings.goal)
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

  if (log.glasses < goal) return streak
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
  history: getHistory(),
  milestones: getMilestones(),
})

// --- Milestones ---
export const getMilestones = (): Milestone[] => {
  const raw = localStorage.getItem(KEYS.MILESTONES)
  if (!raw) return DEFAULT_MILESTONES.map(m => ({ ...m }))

  const stored: Milestone[] = JSON.parse(raw)

  // merge in case new milestones were added in updates
  return DEFAULT_MILESTONES.map(def => {
    const found = stored.find(s => s.id === def.id)
    return found ? { ...def, unlockedAt: found.unlockedAt } : def
  })
}

export const saveMilestones = (milestones: Milestone[]): void => {
  localStorage.setItem(KEYS.MILESTONES, JSON.stringify(milestones))
}

export const unlockMilestone = (id: string): Milestone | null => {
  const milestones = getMilestones()
  const index = milestones.findIndex(m => m.id === id)
  if (index === -1) return null

  // already unlocked
  if (milestones[index].unlockedAt) return null

  milestones[index].unlockedAt = new Date().toISOString()
  saveMilestones(milestones)
  return milestones[index]
}

export const getTotalGlasses = (): number => {
  const history = getHistory()
  const todayLog = getTodayLog()
  const historyTotal = history.reduce((sum, h) => sum + h.glasses, 0)
  return historyTotal + todayLog.glasses
}

// --- Reset ---
export const resetAll = (): void => {
  Object.values(KEYS).forEach(key => localStorage.removeItem(key))
}