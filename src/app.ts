import './styles/main.css'
import { loadAppState, getSettings, saveSettings } from './utils/storage'
import { AppState } from './types'
import { Onboarding } from './components/Onboarding'
import { Dashboard } from './components/Dashboard'

export class App {
  private state: AppState

  constructor() {
    this.state = loadAppState()
  }

  init(): void {
    this.applyTheme()
    this.watchSystemTheme()
    this.render()
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
    const dashboard = new Dashboard(this.state, () => {
      this.openSettings()
    })
    dashboard.render()
  }

  private openSettings(): void {
    const app = document.getElementById('app')!
    app.innerHTML = `
      <div class="container animate-fade-in">
        <h2 class="text-center mt-4">Settings coming soon ⚙️</h2>
        <button class="btn btn-ghost w-full mt-3" id="btn-back">← Back</button>
      </div>
    `
    document.getElementById('btn-back')!.addEventListener('click', () => {
      this.state = loadAppState()
      this.renderDashboard()
    })
  }
}