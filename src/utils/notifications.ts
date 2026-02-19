const SW_PATH = '/hydronag/sw.js'

// ─── Register Service Worker ──────────────────────────────────────
export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  if (!('serviceWorker' in navigator)) {
    console.warn('[HydroNag] Service Workers not supported')
    return null
  }

  try {
    const registration = await navigator.serviceWorker.register(SW_PATH, {
      scope: '/hydronag/',
    })
    console.log('[HydroNag] Service Worker registered')
    return registration
  } catch (err) {
    console.error('[HydroNag] Service Worker registration failed', err)
    return null
  }
}

// ─── Request Permission ───────────────────────────────────────────
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.warn('[HydroNag] Notifications not supported')
    return false
  }

  if (Notification.permission === 'granted') return true

  const permission = await Notification.requestPermission()
  return permission === 'granted'
}

// ─── Schedule Notifications ───────────────────────────────────────
export const scheduleNotifications = async (times: string[]): Promise<void> => {
  if (!('serviceWorker' in navigator)) return

  const registration = await navigator.serviceWorker.ready

  if (!registration.active) {
    console.warn('[HydroNag] No active service worker')
    return
  }

  registration.active.postMessage({
    type: 'SCHEDULE_NOTIFICATIONS',
    times,
  })

  console.log('[HydroNag] Notifications scheduled for:', times)
}

// ─── Cancel Notifications ─────────────────────────────────────────
export const cancelNotifications = async (): Promise<void> => {
  if (!('serviceWorker' in navigator)) return

  const registration = await navigator.serviceWorker.ready

  registration.active?.postMessage({
    type: 'CANCEL_NOTIFICATIONS',
  })

  console.log('[HydroNag] Notifications cancelled')
}

// ─── Init — call this on app start ───────────────────────────────
export const initNotifications = async (
  enabled: boolean,
  times: string[]
): Promise<void> => {
  await registerServiceWorker()

  if (!enabled) {
    await cancelNotifications()
    return
  }

  const granted = await requestNotificationPermission()
  if (!granted) {
    console.warn('[HydroNag] Notification permission denied')
    return
  }

  // small delay to ensure SW is ready
  setTimeout(async () => {
    await scheduleNotifications(times)
  }, 1000)
}