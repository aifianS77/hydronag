const CACHE_NAME = 'hydronag-v1'

// ─── Nagger Messages for Notifications ───────────────────────────
const notificationMessages = [
  { title: "Hey. Drink water.", body: "You know why I'm here. Go get a glass." },
  { title: "Hydration check.", body: "When was the last time you had water? That's what I thought." },
  { title: "Your kidneys called.", body: "They're not happy. Drink water." },
  { title: "Water. Now.", body: "I'm not asking. Well, I am. But you should do it anyway." },
  { title: "Still dehydrated?", body: "Because statistically, you probably are. Drink up." },
  { title: "HydroNag reminder 💧", body: "A glass of water won't drink itself. Unfortunately." },
  { title: "Excuse me.", body: "Have you had water recently? No? Go fix that." },
  { title: "Your brain is drying out.", body: "Not literally. But close enough. Drink water." },
  { title: "Hey you.", body: "Yes, you. The one ignoring their hydration goals. Drink water." },
  { title: "Water o'clock. 💧", body: "It's always water o'clock somewhere. Specifically here. Now." },
]

const getRandomMessage = () => {
  return notificationMessages[Math.floor(Math.random() * notificationMessages.length)]
}

// ─── Install ──────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  console.log('[HydroNag SW] Installed')
  self.skipWaiting()
})

// ─── Activate ─────────────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  console.log('[HydroNag SW] Activated')
  event.waitUntil(self.clients.claim())
})

// ─── Message Handler ──────────────────────────────────────────────
// Receives schedule from the main app
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SCHEDULE_NOTIFICATIONS') {
    const { times } = event.data
    scheduleNotifications(times)
  }

  if (event.data?.type === 'CANCEL_NOTIFICATIONS') {
    cancelAllNotifications()
  }
})

// ─── Notification Click ───────────────────────────────────────────
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clientList) => {
      // if app is already open, focus it
      for (const client of clientList) {
        if (client.url.includes('hydronag') && 'focus' in client) {
          return client.focus()
        }
      }
      // otherwise open it
      if (self.clients.openWindow) {
        return self.clients.openWindow('/')
      }
    })
  )
})

// ─── Scheduling Logic ─────────────────────────────────────────────
const scheduledTimers = []

const cancelAllNotifications = () => {
  scheduledTimers.forEach(id => clearTimeout(id))
  scheduledTimers.length = 0
  console.log('[HydroNag SW] All notifications cancelled')
}

const scheduleNotifications = (times) => {
  cancelAllNotifications()

  const now = new Date()

  times.forEach((timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number)

    const scheduled = new Date()
    scheduled.setHours(hours, minutes, 0, 0)

    // if time already passed today, skip it
    if (scheduled <= now) {
      console.log(`[HydroNag SW] Skipping ${timeStr} — already passed`)
      return
    }

    const delay = scheduled.getTime() - now.getTime()
    console.log(`[HydroNag SW] Scheduling notification at ${timeStr} in ${Math.round(delay / 1000 / 60)} mins`)

    const timerId = setTimeout(() => {
      const msg = getRandomMessage()
      self.registration.showNotification(msg.title, {
        body: msg.body,
        icon: '/hydronag/favicon.ico',
        badge: '/hydronag/favicon.ico',
        tag: `hydronag-${timeStr}`,
        renotify: true,
        data: { time: timeStr },
      })
    }, delay)

    scheduledTimers.push(timerId)
  })
}