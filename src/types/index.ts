export interface UserSettings {
  name: string
  goal: number              // daily glass goal, default 8
  theme: 'light' | 'dark' | 'auto'
  notificationsEnabled: boolean
  notificationTimes: string[]  // e.g. ["09:00", "12:00", "15:00", "18:00"]
  onboardingComplete: boolean
}

export interface DailyLog {
  date: string              // YYYY-MM-DD format
  glasses: number
}

export interface HistoryEntry {
  date: string     // YYYY-MM-DD
  glasses: number
  goal: number     // store goal at the time, in case user changes it later
}

export interface Streak {
  current: number
  longest: number
  lastLoggedDate: string    // YYYY-MM-DD format
}

export interface Milestone {
  id: string
  emoji: string
  title: string
  description: string
  unlockedAt: string | null   // ISO date string, null if not yet unlocked
}

export interface AppState {
  settings: UserSettings
  todayLog: DailyLog
  streak: Streak
  history: HistoryEntry[] // keep history
  milestones: Milestone[] // keep milestone 
}