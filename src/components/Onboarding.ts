import { getSettings, saveSettings } from '../utils/storage'
import { requestNotificationPermission, scheduleNotifications } from '../utils/notifications'

export class Onboarding {
  private onComplete: () => void

  constructor(onComplete: () => void) {
    this.onComplete = onComplete
  }

  render(): void {
    const app = document.getElementById('app')!
    app.innerHTML = this.getTemplate()
    this.attachEvents()
  }

  private getTemplate(): string {
    return `
      <div class="container animate-fade-in">

        <!-- Header -->
        <div class="text-center mt-4">
          <div class="onboarding-logo">💧</div>
          <h1 class="mt-2">HydroNag</h1>
          <p class="onboarding-tagline mt-1">Your unsolicited hydration assistant.</p>
        </div>

        <!-- Steps -->
        <div id="onboarding-steps">
          ${this.getStep1()}
        </div>

      </div>
    `
  }


  // ─── Step 1 — The Welcome ───────────────────────────────────────
    private getStep1(): string {
        return `
        <div class="card mt-4 text-center animate-fade-in" id="step-1">
            <p class="onboarding-step-text">
            We're going to make sure you drink water today.
            <br/>
            <span class="text-muted">Whether you like it or not.</span>
            </p>
            <div class="name-input-wrap mt-3">
            <label class="name-label">What should I call you?</label>
            <input
                type="text"
                id="input-name"
                class="name-input"
                placeholder="Your name (optional)"
                maxlength="20"
            />
            <p class="text-muted mt-1" style="font-size:0.8rem">
                Leave blank if you prefer to remain anonymous and dehydrated.
            </p>
            </div>
            <button class="btn btn-primary btn-lg w-full mt-3" id="btn-step1">
            Fine. Let's do this.
            </button>
        </div>
        `
    }

  // ─── Step 2 — The Myth Disclaimer ──────────────────────────────
  private getStep2(): string {
    return `
      <div class="card mt-4 text-center animate-fade-in" id="step-2">
        <div class="fact-icon">🧪</div>
        <h3 class="mt-2">About that "8 glasses" thing...</h3>
        <p class="mt-2">
          Scientifically speaking, <strong>"8 glasses a day"</strong> has no solid backing.
          It came from a misread 1945 report that nobody bothered to fact-check for 80 years.
        </p>
        <p class="mt-2 text-muted">
          But you know what's worse than 8 glasses? Zero glasses.
          Which is what most people drink. So we're going with 8.
        </p>
        <div class="disclaimer-box mt-3">
          <p>We've set your default goal to <strong>8 glasses</strong>. You can change it anytime in settings.</p>
        </div>
        <button class="btn btn-primary btn-lg w-full mt-3" id="btn-step2">
          Fair enough. Continue.
        </button>
      </div>
    `
  }

  // ─── Step 3 — Notification Permission ──────────────────────────
  private getStep3(): string {
    return `
      <div class="card mt-4 text-center animate-fade-in" id="step-3">
        <div class="fact-icon">🔔</div>
        <h3 class="mt-2">Can I annoy you properly?</h3>
        <p class="mt-2">
          I'd like to send you reminders throughout the day.
          Not too many. Just enough to be mildly irritating.
        </p>
        <p class="mt-2 text-muted">
          Default times: 9am, 12pm, 3pm and 6pm.
          You can change these later.
        </p>
        <button class="btn btn-primary btn-lg w-full mt-3" id="btn-allow-notif">
          🔔 Yes, nag me
        </button>
        <button class="btn btn-ghost w-full mt-2" id="btn-skip-notif">
          No thanks, I'll forget to drink water on my own
        </button>
      </div>
    `
  }

  // ─── Step 4 — Ready ────────────────────────────────────────────
  private getStep4(): string {
    return `
      <div class="card mt-4 text-center animate-fade-in" id="step-4">
        <div class="fact-icon">🎉</div>
        <h3 class="mt-2">Alright. We're doing this.</h3>
        <p class="mt-2">
          Your goal is set. Your nagger is ready.
          Your excuses are no longer valid.
        </p>
        <p class="mt-2 text-muted">
          Open HydroNag every time you drink a glass and log it.
          That's literally all you have to do.
        </p>
        <button class="btn btn-primary btn-lg w-full mt-3" id="btn-finish">
          💧 Let's go
        </button>
      </div>
    `
  }

  // ─── Events ────────────────────────────────────────────────────
  private attachEvents(): void {
    this.attachStep1Events()
  }

  private attachStep1Events(): void {
    document.getElementById('btn-step1')!.addEventListener('click', () => {
      const nameInput = document.getElementById('input-name') as HTMLInputElement
      const name = nameInput.value.trim()
      const settings = getSettings()
      saveSettings({ ...settings, name })
      this.goToStep(2)
    })
  }

  private attachStep2Events(): void {
    document.getElementById('btn-step2')!.addEventListener('click', () => {
      this.goToStep(3)
    })
  }

  private attachStep3Events(): void {
    document.getElementById('btn-allow-notif')!.addEventListener('click', async () => {
      await this.requestNotifications(true)
      this.goToStep(4)
    })

    document.getElementById('btn-skip-notif')!.addEventListener('click', () => {
      this.goToStep(4)
    })
  }

  private attachStep4Events(): void {
    document.getElementById('btn-finish')!.addEventListener('click', () => {
      this.finish()
    })
  }

  private goToStep(step: number): void {
    const container = document.getElementById('onboarding-steps')!

    const templates: Record<number, string> = {
      2: this.getStep2(),
      3: this.getStep3(),
      4: this.getStep4(),
    }

    container.innerHTML = templates[step]

    const attachers: Record<number, () => void> = {
      2: () => this.attachStep2Events(),
      3: () => this.attachStep3Events(),
      4: () => this.attachStep4Events(),
    }

    attachers[step]?.()
  }

  private async requestNotifications(enable: boolean): Promise<void> {
    if (!enable) return

    const granted = await requestNotificationPermission()
    const settings = getSettings()
    saveSettings({
     ...settings,
     notificationsEnabled: granted,   
    })

    if (granted){
        await scheduleNotifications(settings.notificationTimes)
    }
  }
  private finish():void{
    const settings = getSettings()
    saveSettings({...settings,onboardingComplete:true})
    this.onComplete()
  }

}