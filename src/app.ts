import './styles/main.css'
import { loadAppState } from './utils/storage'
import { AppState } from './types'
import { Onboarding } from './components/Onboarding'
import { Dashboard } from './components/Dashboard'
import { initNotifications } from './utils/notifications'
import { Settings } from './components/Settings'
import { History } from './components/History'

export class App {
  private state: AppState

  constructor() {
    this.state = loadAppState()
  }

  init(): void {
    this.applyTheme()
    this.watchSystemTheme()
    this.initNotifications() 
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

  private render(): void {
    const { onboardingComplete } = this.state.settings

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

  private renderDashboard(): void {
    const dashboard = new Dashboard(
      this.state,
      () => this.openSettings(),
      () => this.openHistory()
    )
    dashboard.render()
  }

  private openSettings(): void {
    const settings = new Settings(() =>{
      this.state = loadAppState()
      this.renderDashboard()
    })
    settings.render()
  }

  private openHistory(): void {
    const history = new History(this.state, () => {
      this.state = loadAppState()
      this.renderDashboard()
    })
    history.render()
  }
}