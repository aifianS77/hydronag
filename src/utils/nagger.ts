import { AppState } from '../types'

interface NaggerMessage {
  message: string
  emoji: string
}

const getHour = (): number => new Date().getHours()

// name prefix — only if name is set
const n = (name: string): string => name ? `${name}. ` : ''

const getMorningMessages = (glasses: number, name: string): NaggerMessage[] => [
  { message: `${n(name)}Good morning. Have you had water yet? No? Disappointing.`, emoji: "😑" },
  { message: `${n(name)}Your body lost water while you slept. Just thought you should know.`, emoji: "💤" },
  { message: `${n(name)}You've had ${glasses} glass${glasses !== 1 ? 'es' : ''} so far. The day just started. No excuses.`, emoji: "🌅" },
  { message: `${n(name)}Coffee doesn't count. Drink water first. Then your coffee. I'll wait.`, emoji: "☕" },
]

const getAfternoonMessages = (glasses: number, goal: number, name: string): NaggerMessage[] => [
  { message: `${n(name)}It's midday and you've had ${glasses} out of ${goal} glasses. We need to talk.`, emoji: "🌤️" },
  { message: `${n(name)}That headache you have? Probably dehydration. Drink water, genius.`, emoji: "🤕" },
  { message: `${n(name)}${goal - glasses} more glasses to go. You can do this. Probably.`, emoji: "😒" },
  { message: `${n(name)}Your brain is literally shrinking from dehydration right now. No pressure.`, emoji: "🧠" },
]

const getEveningMessages = (glasses: number, goal: number, name: string): NaggerMessage[] => [
  { message: `${n(name)}Evening already and only ${glasses} glasses? I'm not mad. I'm just disappointed.`, emoji: "🌆" },
  { message: `${n(name)}Last chance to not be a raisin today. Drink up.`, emoji: "🍇" },
  { message: `${n(name)}${goal - glasses} glasses left before bed. Don't you dare give up now.`, emoji: "🌙" },
  { message: `${n(name)}You know what pairs well with dinner? Water. Shocking concept.`, emoji: "🍽️" },
]

const getNightMessages = (glasses: number, goal: number, name: string): NaggerMessage[] => [
  { message: `${n(name)}It's late. Did you even try today?`, emoji: "😴" },
  { message: `${n(name)}You managed ${glasses} out of ${goal} glasses. Tomorrow is a new chance to do better. Maybe.`, emoji: "🌑" },
  { message: `${n(name)}Your kidneys are filing a complaint. Just so you know.`, emoji: "📋" },
  { message: `${n(name)}Sleep hydrated. Or don't. I'm a website, not a doctor.`, emoji: "🤷" },
]

const getGoalMetMessages = (name: string): NaggerMessage[] => [
  { message: `${n(name)}You actually did it. I'm genuinely shocked. Well done.`, emoji: "🏆" },
  { message: `${n(name)}Goal met! I'd say I'm proud but let's see if you do it again tomorrow.`, emoji: "👏" },
  { message: `${n(name)}Look at you, hydrating like a functioning human being!`, emoji: "🎉" },
  { message: `${n(name)}Goal achieved. Your kidneys thank you. Reluctantly, so do I.`, emoji: "💧" },
]

const getStreakMessages = (streak: number, name: string): NaggerMessage[] => [
  { message: `${n(name)}${streak} day streak! Don't ruin it. I know you're thinking about ruining it.`, emoji: "🔥" },
  { message: `${n(name)}${streak} days in a row. Honestly didn't think you had it in you.`, emoji: "😮" },
  { message: `${n(name)}${streak} day streak! Your future self is mildly impressed.`, emoji: "⚡" },
]

const getRandom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

export const getNaggerMessage = (state: AppState): NaggerMessage => {
  const { todayLog, settings, streak } = state
  const { glasses } = todayLog
  const { goal, name } = settings
  const hour = getHour()
  const goalMet = glasses >= goal

  if (goalMet) return getRandom(getGoalMetMessages(name))

  if (streak.current > 1 && Math.random() < 0.3) {
    return getRandom(getStreakMessages(streak.current, name))
  }

  if (hour >= 5 && hour < 12) return getRandom(getMorningMessages(glasses, name))
  if (hour >= 12 && hour < 17) return getRandom(getAfternoonMessages(glasses, goal, name))
  if (hour >= 17 && hour < 21) return getRandom(getEveningMessages(glasses, goal, name))
  return getRandom(getNightMessages(glasses, goal, name))
}

export const getGlassLogMessage = (glasses: number, goal: number, name: string = ''): NaggerMessage => {
  const remaining = goal - glasses
  if (glasses === 1) return { message: `${n(name)}One down. Finally. Only took you this long.`, emoji: "💧" }
  if (remaining === 0) return { message: `${n(name)}GOAL MET. I can't believe it. You did it.`, emoji: "🎊" }
  if (remaining === 1) return { message: `${n(name)}One more glass. ONE. Don't quit now.`, emoji: "😤" }
  if (remaining <= 3) return { message: `${n(name)}So close! Just ${remaining} more. You're almost a real human today.`, emoji: "💪" }
  return { message: `${n(name)}${glasses} down, ${remaining} to go. Keep it up. I'm watching.`, emoji: "👀" }
}