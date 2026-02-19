import { Milestone } from '../types'

export const DEFAULT_MILESTONES: Milestone[] = [
  {
    id: 'first_drop',
    emoji: '💧',
    title: 'First Drop',
    description: 'Logged your first glass ever. It begins.',
    unlockedAt: null,
  },
  {
    id: 'full_tank',
    emoji: '🎯',
    title: 'Full Tank',
    description: 'Hit your daily goal for the first time. I\'m mildly impressed.',
    unlockedAt: null,
  },
  {
    id: 'on_fire',
    emoji: '🔥',
    title: 'On Fire',
    description: '3 day streak. You\'re on a roll. Don\'t blow it.',
    unlockedAt: null,
  },
  {
    id: 'hydration_legend',
    emoji: '🏆',
    title: 'Hydration Legend',
    description: '7 day streak. A full week of not being a disappointment.',
    unlockedAt: null,
  },
  {
    id: 'unstoppable',
    emoji: '👑',
    title: 'Unstoppable',
    description: '30 day streak. A whole month. I didn\'t think you had it in you.',
    unlockedAt: null,
  },
  {
    id: 'poseidon',
    emoji: '🔱',
    title: 'Poseidon',
    description: '100 day streak. You are no longer human. You are water. The god of the sea bows to you.',
    unlockedAt: null,
  },
  {
    id: 'century',
    emoji: '💯',
    title: 'Century',
    description: '100 total glasses logged. Your kidneys are filing a thank you note.',
    unlockedAt: null,
  },
  {
    id: 'overachiever',
    emoji: '🚀',
    title: 'Overachiever',
    description: 'Logged 2x your daily goal in one day. Calm down.',
    unlockedAt: null,
  },
  {
    id: 'rock_bottom',
    emoji: '💀',
    title: 'Rock Bottom',
    description: 'Zero glasses logged in a day. Congratulations, I guess.',
    unlockedAt: null,
  },
  {
    id: 'early_bird',
    emoji: '🌅',
    title: 'Early Bird',
    description: 'Logged your first glass before 8am. The day is yours.',
    unlockedAt: null,
  },
  {
    id: 'night_owl',
    emoji: '🌙',
    title: 'Night Owl',
    description: 'Logged a glass after 10pm. Hydrating at midnight. Respect.',
    unlockedAt: null,
  },
]

export const getMilestoneById = (id: string): Milestone | undefined => {
  return DEFAULT_MILESTONES.find(m => m.id === id)
}