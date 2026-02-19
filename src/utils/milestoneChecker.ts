import { AppState, Milestone } from '../types'
import { unlockMilestone, getTotalGlasses } from './storage'

export interface UnlockedMilestone extends Milestone {
  justUnlocked: boolean
}

export const checkMilestones = (state: AppState): Milestone[] => {
  const { todayLog, settings, streak, milestones } = state
  const { glasses } = todayLog
  const { goal } = settings
  const hour = new Date().getHours()
  const newlyUnlocked: Milestone[] = []
  const totalGlasses = getTotalGlasses()

  const tryUnlock = (id: string) => {
    const already = milestones.find(m => m.id === id)
    if (already?.unlockedAt) return

    const unlocked = unlockMilestone(id)
    if (unlocked) newlyUnlocked.push(unlocked)
  }

  // first drop — first glass ever
  if (totalGlasses >= 1) tryUnlock('first_drop')

  // full tank — hit goal
  if (glasses >= goal) tryUnlock('full_tank')

  // streak milestones
  if (streak.current >= 3) tryUnlock('on_fire')
  if (streak.current >= 7) tryUnlock('hydration_legend')
  if (streak.current >= 30) tryUnlock('unstoppable')
  if (streak.current >= 100) tryUnlock('poseidon')

  // century — 100 total glasses
  if (totalGlasses >= 100) tryUnlock('century')

  // overachiever — 2x goal in one day
  if (glasses >= goal * 2) tryUnlock('overachiever')

  // early bird — first glass before 8am
  if (glasses === 1 && hour < 8) tryUnlock('early_bird')

  // night owl — log after 10pm
  if (hour >= 22) tryUnlock('night_owl')

  return newlyUnlocked
}