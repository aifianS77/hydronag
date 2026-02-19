import './styles/main.css'
import { loadAppState } from './utils/storage'
import { AppState } from './types'
import { Onboarding } from './components/Onboarding'
import { Dashboard } from './components/Dashboard'
import { initNotifications } from './utils/notifications'
import { Settings } from './components/Settings'
import { History } from './components/History'
import { Milestones } from './components/Milestones'

export class App {
  private state: AppState

  constructor() {
    this.state = loadAppState()
  }

  init(): void {
    this.applyTheme()
    this.watchSystemTheme()
    this.initNotifications()
    this.watchBrowserHistory()
    this.render()
  }

  private async initNotifications(): Promise<void> {
    const { notificationsEnabled, notificationTimes } = this.state.settings
    await initNotifications(notificationsEnabled, notificationTimes)
  }

  private applyTheme(): void {
    const { theme } = this.state.settings
    document.documentElement.setAttribute('data-theme', theme)
  }

  private watchSystemTheme(): void {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', () => {
      if (this.state.settings.theme === 'auto') {
        this.applyTheme()
      }
    })
  }

  // ─── Browser History API ──────────────────────────────────────
  private watchBrowserHistory(): void {
    window.addEventListener('popstate', (event) => {
      const screen = event.state?.screen ?? 'dashboard'
      this.state = loadAppState()

      switch (screen) {
        case 'settings':
          this.openSettings(false)
          break
        case 'history':
          this.openHistory(false)
          break
        case 'milestones':
          this.openMilestones(false)
          break
        default:
          this.renderDashboard(false)
          break
      }
    })
  }

  private pushState(screen: string): void {
    window.history.pushState(
      { screen },
      '',
      `/hydronag/#${screen}`
    )
  }

  private render(): void {
    const { onboardingComplete } = this.state.settings

    // set initial history state
    window.history.replaceState({ screen: 'dashboard' }, '', '/hydronag/')

    if (!onboardingComplete) {
      const onboarding = new Onboarding(() => {
        this.state = loadAppState()
        this.renderDashboard()
      })
      onboarding.render()
    } else {
      this.renderDashboard()
    }
  }

  private renderDashboard(push: boolean = true): void {
    if (push) this.pushState('dashboard')
    const dashboard = new Dashboard(
      this.state,
      () => this.openSettings(),
      () => this.openHistory(),
      () => this.openMilestones()
    )
    dashboard.render()
  }

  private openSettings(push: boolean = true): void {
    if (push) this.pushState('settings')
    const settings = new Settings(() => {
      this.state = loadAppState()
      this.renderDashboard()
    })
    settings.render()
  }

  private openHistory(push: boolean = true): void {
    if (push) this.pushState('history')
    const history = new History(this.state, () => {
      this.state = loadAppState()
      this.renderDashboard()
    })
    history.render()
  }

  private openMilestones(push: boolean = true): void {
    if (push) this.pushState('milestones')
    const milestones = new Milestones(this.state, () => {
      this.state = loadAppState()
      this.renderDashboard()
    })
    milestones.render()
  }
}
