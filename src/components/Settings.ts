import { getSettings, saveSettings, resetAll, getStreak} from '../utils/storage'
import { UserSettings } from '../types'
import { initNotifications, cancelNotifications } from '../utils/notifications'

export class Settings {
  private onBack: () => void
  private settings: UserSettings

  constructor(onBack: () => void) {
    this.onBack = onBack
    this.settings = getSettings()
  }

  render(): void {
    const app = document.getElementById('app')!
    app.innerHTML = this.getTemplate()
    this.attachEvents()
  }

  private getTemplate(): string {
    const { goal, theme, notificationsEnabled, notificationTimes } = this.settings

    return `
      <div class="container animate-fade-in">

        <!-- Header -->
        <div class="flex items-center gap-2 mt-3">
            <button class="btn-back-btn" id="btn-back">
                <i class="ph ph-arrow-left"></i> Back
            </button>
          <h2>Settings</h2>
        </div>

        <!-- Daily Goal -->
        <div class="card mt-3">
          <h3>🥅 Daily Goal</h3>
          <p class="text-muted mt-1" style="font-size:0.875rem">
            We default to 8. Science says it's complicated. We say just drink.
          </p>
          <div class="settings-row mt-3">
            <button class="btn btn-ghost settings-stepper" id="btn-goal-minus">−</button>
            <span class="settings-goal-value" id="goal-value">${goal}</span>
            <button class="btn btn-ghost settings-stepper" id="btn-goal-plus">+</button>
          </div>
          <p class="text-center text-muted mt-1" style="font-size:0.8rem">glasses per day</p>
        </div>

        <!-- Theme -->
        <div class="card mt-3">
          <h3>🎨 Theme</h3>
          <p class="text-muted mt-1" style="font-size:0.875rem">Pick your ocean vibe.</p>
          <div class="settings-theme-options mt-3">
            <button class="btn settings-theme-btn ${theme === 'light' ? 'active' : ''}" data-theme="light">
              ☀️ Beach
            </button>
            <button class="btn settings-theme-btn ${theme === 'dark' ? 'active' : ''}" data-theme="dark">
              🌊 Dusk
            </button>
            <button class="btn settings-theme-btn ${theme === 'auto' ? 'active' : ''}" data-theme="auto">
              🌗 Auto
            </button>
          </div>
        </div>

        <!-- Notifications -->
        <div class="card mt-3">
          <div class="flex items-center justify-between">
            <h3>🔔 Notifications</h3>
            <label class="toggle-switch">
              <input
                type="checkbox"
                id="toggle-notifications"
                ${notificationsEnabled ? 'checked' : ''}
              />
              <span class="toggle-slider"></span>
            </label>
          </div>
          <p class="text-muted mt-1" style="font-size:0.875rem">
            Let HydroNag annoy you at set times. Highly recommended.
          </p>

          <div class="notification-times mt-3" id="notification-times"
            style="${notificationsEnabled ? '' : 'opacity:0.4; pointer-events:none'}">
            <p style="font-size:0.875rem; font-weight:600; margin-bottom:0.5rem">Nag times:</p>
            ${notificationTimes.map((time, i) => `
              <div class="notification-time-row">
                <input
                  type="time"
                  class="time-input"
                  data-index="${i}"
                  value="${time}"
                />
                <button class="btn-icon btn-remove-time" data-index="${i}">🗑️</button>
              </div>
            `).join('')}
            ${notificationTimes.length < 8 ? `
              <button class="btn btn-ghost w-full mt-2" id="btn-add-time">
                + Add time
              </button>
            ` : ''}
          </div>
        </div>

        <!-- Save Button -->
        <button class="btn btn-primary btn-lg w-full mt-3" id="btn-save">
          💾 Save Settings
        </button>

        <!-- Danger Zone -->
        <div class="card mt-3 mb-4 danger-zone">
          <h3>⚠️ Danger Zone</h3>
          <p class="text-muted mt-1" style="font-size:0.875rem">
            Reset everything. Your streak, your logs, your dignity. All gone.
          </p>
          <button class="btn btn-danger w-full mt-3" id="btn-reset">
            Reset All Data
          </button>
        </div>

      </div>
    `
  }

  // ─── Events ──────────────────────────────────────────────────────
  private attachEvents(): void {
    // back
    document.getElementById('btn-back')!.addEventListener('click', () => {
      this.onBack()
    })

    // goal stepper
    document.getElementById('btn-goal-minus')!.addEventListener('click', () => {
      this.adjustGoal(-1)
    })
    document.getElementById('btn-goal-plus')!.addEventListener('click', () => {
      this.adjustGoal(1)
    })

    // theme buttons
    document.querySelectorAll('.settings-theme-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const theme = (e.currentTarget as HTMLElement).dataset.theme as UserSettings['theme']
        this.setTheme(theme)
      })
    })

    // notification toggle
    document.getElementById('toggle-notifications')!.addEventListener('change', (e) => {
      const enabled = (e.target as HTMLInputElement).checked
      this.settings.notificationsEnabled = enabled
      const timesEl = document.getElementById('notification-times')!
      timesEl.style.opacity = enabled ? '1' : '0.4'
      timesEl.style.pointerEvents = enabled ? 'auto' : 'none'
    })

    // time inputs
    document.querySelectorAll('.time-input').forEach(input => {
      input.addEventListener('change', (e) => {
        const el = e.target as HTMLInputElement
        const index = parseInt(el.dataset.index!)
        this.settings.notificationTimes[index] = el.value
      })
    })

    // remove time
    document.querySelectorAll('.btn-remove-time').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt((e.currentTarget as HTMLElement).dataset.index!)
        this.settings.notificationTimes.splice(index, 1)
        this.render()
      })
    })

    // add time
    document.getElementById('btn-add-time')?.addEventListener('click', () => {
      this.settings.notificationTimes.push('08:00')
      this.render()
    })

    // save
    document.getElementById('btn-save')!.addEventListener('click', () => {
      this.save()
    })

    // reset
    document.getElementById('btn-reset')!.addEventListener('click', () => {
      this.confirmReset()
    })
  }

  private adjustGoal(delta: number): void {
    const newGoal = Math.min(20, Math.max(1, this.settings.goal + delta))
    this.settings.goal = newGoal
    document.getElementById('goal-value')!.textContent = String(newGoal)
  }

  private setTheme(theme: UserSettings['theme']): void {
    this.settings.theme = theme
    document.documentElement.setAttribute('data-theme', theme)

    document.querySelectorAll('.settings-theme-btn').forEach(btn => {
      btn.classList.remove('active')
    })
    document.querySelector(`[data-theme="${theme}"]`)!.classList.add('active')
  }

  private async save(): Promise<void> {
    const nameInput = document.getElementById('input-name') as HTMLInputElement
    this.settings.name = nameInput.value.trim()
    saveSettings(this.settings)

    // reinit notifications with new settings
    if (this.settings.notificationsEnabled) {
      await initNotifications(true, this.settings.notificationTimes)
    } else {
      await cancelNotifications()
    }

    // show saved feedback
    const btn = document.getElementById('btn-save')!
    btn.textContent = '✅ Saved!'
    setTimeout(() => {
      this.onBack()
    }, 800)
  }

  private confirmReset(): void {
    const modal = document.createElement('div')
    modal.className = 'modal-overlay animate-fade-in'
    modal.innerHTML = `
      <div class="modal-card animate-fade-in">
        <div class="modal-emoji">💀</div>
        <h3 class="mt-2">Are you sure?</h3>
        <p class="text-muted mt-2">
          This wipes your streak, logs and all settings.
          Your hydration history will be gone forever.
          <br/><br/>
          That ${this.getCurrentStreak()} day streak? Gone.
        </p>
        <button class="btn btn-danger w-full mt-3" id="btn-confirm-reset">
          Yes, nuke everything
        </button>
        <button class="btn btn-ghost w-full mt-2" id="btn-cancel-reset">
          Cancel — I changed my mind
        </button>
      </div>
    `

    document.body.appendChild(modal)

    document.getElementById('btn-confirm-reset')!.addEventListener('click', () => {
      resetAll()
      modal.remove()
      window.location.reload()
    })

    document.getElementById('btn-cancel-reset')!.addEventListener('click', () => {
      modal.remove()
    })
  }

  private getCurrentStreak(): number {
    return getStreak().current
  }
}