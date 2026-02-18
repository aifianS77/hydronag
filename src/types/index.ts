export interface UserSettings {
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

export interface Streak {
  current: number
  longest: number
  lastLoggedDate: string    // YYYY-MM-DD format
}

export interface AppState {
  settings: UserSettings
  todayLog: DailyLog
  streak: Streak
}