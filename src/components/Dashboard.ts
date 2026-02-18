import { AppState } from '../types'
import { addGlass, getSettings, loadAppState, saveSettings, updateStreak } from '../utils/storage'
import { getNaggerMessage, getGlassLogMessage } from '../utils/nagger'
import { getDailyFact } from '../data/facts'

export class Dashboard {
  private state: AppState
  private onOpenSettings: () => void
  private lastLoggedAt: number | null = null

  constructor(state: AppState, onOpenSettings: () => void) {
    this.state = state
    this.onOpenSettings = onOpenSettings
  }

  render(): void {
    const app = document.getElementById('app')!
    app.innerHTML = this.getTemplate()
    this.attachEvents()
  }

  private getTemplate(): string {
    const { todayLog, settings, streak } = this.state
    const { glasses } = todayLog
    const { goal } = settings
    const percent = Math.min((glasses / goal) * 100, 100)
    const naggerMsg = getNaggerMessage(this.state)
    const fact = getDailyFact()

    return `
      <div class="container animate-fade-in">

        <!-- Header -->
        <div class="flex items-center justify-between mt-3">
          <div class="flex items-center gap-1">
            <span class="dashboard-logo">💧</span>
            <span class="dashboard-title">HydroNag</span>
          </div>
          <div class="flex items-center gap-1">
            <button class="btn-icon" id="btn-theme-toggle" title="Toggle theme">
              ${this.getThemeIcon()}
            </button>
            <button class="btn-icon" id="btn-settings" title="Settings">
              ⚙️
            </button>
          </div>
        </div>

        <!-- Streak Badge -->
        ${streak.current > 0 ? `
          <div class="flex items-center justify-center mt-3">
            <div class="streak-badge">
              🔥 ${streak.current} day streak
              ${streak.current >= 7 ? '— you absolute legend' : ''}
              ${streak.current === 1 ? '— okay, a start.' : ''}
            </div>
          </div>
        ` : ''}

        <!-- Jug -->
        <div class="jug-container mt-3">
          ${this.getJugSVG(percent)}
        </div>

        <!-- Count & Progress -->
        <div class="text-center mt-3">
          <div class="glass-count">
            <span class="glass-count-current">${glasses}</span>
            <span class="glass-count-divider"> / </span>
            <span class="glass-count-goal">${goal}</span>
            <span class="glass-count-label"> glasses</span>
          </div>
          <div class="progress-bar mt-2">
            <div class="progress-bar-fill" style="width: ${percent}%"></div>
          </div>
          <p class="text-muted mt-1" style="font-size: 0.875rem">
            ${glasses >= goal
              ? 'Daily goal reached! 🎉'
              : `${goal - glasses} more to go`}
          </p>
        </div>

        <!-- Nagger Message -->
        <div class="card nagger-card mt-3" id="nagger-message">
          <div class="nagger-emoji">${naggerMsg.emoji}</div>
          <p class="nagger-text">${naggerMsg.message}</p>
        </div>

        <!-- Main Action Button -->
        <button
          class="btn btn-primary btn-lg w-full mt-3 drink-btn"
          id="btn-drink"
          ${glasses >= goal ? 'disabled' : ''}
        >
          💧 I drank a glass
        </button>

        ${glasses >= goal ? `
          <p class="text-center text-muted mt-2" style="font-size:0.875rem">
            Goal met! Come back tomorrow. I'll be waiting.
          </p>
        ` : ''}

        <!-- Fact Card -->
        <div class="card fact-card mt-3 mb-4">
          <div class="fact-card-header">
            <span>💡</span>
            <span class="fact-card-label">Did you know?</span>
          </div>
          <p class="fact-text mt-2">${fact.fact}</p>
          <p class="fact-nagger-take mt-2">${fact.naggerTake}</p>
        </div>

      </div>
    `
  }

  private getThemeIcon(): string {
    const { theme } = this.state.settings
    if (theme === 'light') return '🌙'
    if (theme === 'dark') return '☀️'
    return '🌗'
  }

  private getJugSVG(percent: number): string {
    const fillHeight = 120 * (percent / 100)
    const fillY = 170 - fillHeight

    return `
      <svg class="jug-svg" viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg">
        <!-- Jug body outline -->
        <path
          d="M55 60 L45 180 Q45 195 60 195 L140 195 Q155 195 155 180 L145 60 Z"
          fill="var(--bg-card)"
          stroke="var(--color-primary)"
          stroke-width="3"
        />

        <!-- Water fill (clipped inside jug) -->
        <clipPath id="jug-clip">
          <path d="M55 60 L45 180 Q45 195 60 195 L140 195 Q155 195 155 180 L145 60 Z"/>
        </clipPath>

        <rect
          x="44"
          y="${fillY}"
          width="113"
          height="${fillHeight + 10}"
          fill="var(--water-color)"
          opacity="0.7"
          clip-path="url(#jug-clip)"
          class="jug-water-fill"
        />

        <!-- Wave on top of water -->
        ${percent > 0 ? `
        <g clip-path="url(#jug-clip)">
          <path
            d="M44 ${fillY} Q68 ${fillY - 6} 100 ${fillY} Q132 ${fillY + 6} 157 ${fillY} L157 ${fillY + 8} Q132 ${fillY + 14} 100 ${fillY + 8} Q68 ${fillY + 2} 44 ${fillY + 8} Z"
            fill="var(--water-wave)"
            opacity="0.5"
          />
        </g>
        ` : ''}

        <!-- Jug lid/top -->
        <rect
          x="65" y="50" width="70" height="14"
          rx="4"
          fill="var(--bg-card)"
          stroke="var(--color-primary)"
          stroke-width="3"
        />

        <!-- Jug handle -->
        <path
          d="M155 90 Q185 90 185 125 Q185 160 155 160"
          fill="none"
          stroke="var(--color-primary)"
          stroke-width="3"
          stroke-linecap="round"
        />

        <!-- Jug spout -->
        <path
          d="M75 50 Q70 30 55 25"
          fill="none"
          stroke="var(--color-primary)"
          stroke-width="3"
          stroke-linecap="round"
        />

        <!-- Percentage label -->
        <text
          x="100" y="135"
          text-anchor="middle"
          font-size="18"
          font-weight="bold"
          fill="${percent > 40 ? 'white' : 'var(--color-primary)'}"
          opacity="0.9"
        >
          ${Math.round(percent)}%
        </text>
      </svg>
    `
  }

  // ─── Events ────────────────────────────────────────────────────
  private attachEvents(): void {
    document.getElementById('btn-drink')!.addEventListener('click', () => {
      this.logGlass()
    })

    document.getElementById('btn-settings')!.addEventListener('click', () => {
      this.onOpenSettings()
    })

    document.getElementById('btn-theme-toggle')!.addEventListener('click', () => {
      this.cycleTheme()
    })
  }

private logGlass(): void {
    const { glasses } = this.state.todayLog

    // if they log a second glass in a row, challenge them
    if (glasses > 0 && this.lastLoggedAt) {
      const secondsSinceLast = (Date.now() - this.lastLoggedAt) / 1000
      if (secondsSinceLast < 60) {
        this.showDoubleCheckModal()
        return
      }
    }

    this.confirmLogGlass()
  }

  private showDoubleCheckModal(): void {
    const messages = [
      { question: "Two in a row? Really?", sub: "That was less than a minute ago. Are you actually drinking or just tapping buttons?" },
      { question: "Hold on.", sub: "Did you actually finish that glass already? You're either very hydrated or very bored." },
      { question: "...already?", sub: "I'm not saying I don't believe you. I'm just saying I don't believe you." },
      { question: "Two glasses back to back?", sub: "Either you were extremely thirsty or you're trying to game me. Which is it?" },
    ]

    const msg = messages[Math.floor(Math.random() * messages.length)]

    const modal = document.createElement('div')
    modal.className = 'modal-overlay animate-fade-in'
    modal.id = 'double-check-modal'
    modal.innerHTML = `
      <div class="modal-card animate-fade-in">
        <div class="modal-emoji">🤨</div>
        <h3 class="mt-2">${msg.question}</h3>
        <p class="text-muted mt-2">${msg.sub}</p>
        <button class="btn btn-primary w-full mt-3" id="btn-confirm-glass">
          Yes, I actually drank it
        </button>
        <button class="btn btn-ghost w-full mt-2" id="btn-deny-glass">
          Okay fine, I didn't
        </button>
      </div>
    `

    document.body.appendChild(modal)

    document.getElementById('btn-confirm-glass')!.addEventListener('click', () => {
      modal.remove()
      this.confirmLogGlass()
    })

    document.getElementById('btn-deny-glass')!.addEventListener('click', () => {
      modal.remove()
      this.showCaughtModal()
    })
  }

  private showCaughtModal(): void {
    const modal = document.createElement('div')
    modal.className = 'modal-overlay animate-fade-in'
    modal.innerHTML = `
      <div class="modal-card animate-fade-in">
        <div class="modal-emoji">😑</div>
        <h3 class="mt-2">I knew it.</h3>
        <p class="text-muted mt-2">Go drink your water. Come back when you've actually done it.</p>
        <button class="btn btn-primary w-full mt-3" id="btn-caught-ok">
          Fine. I'll go drink it.
        </button>
      </div>
    `

    document.body.appendChild(modal)
    document.getElementById('btn-caught-ok')!.addEventListener('click', () => {
      modal.remove()
    })
  }

  private confirmLogGlass(): void {
    this.lastLoggedAt = Date.now()

    const updatedLog = addGlass()
    this.state.todayLog = updatedLog
    this.state.streak = updateStreak(this.state.settings.goal)

    const naggerMsg = getGlassLogMessage(updatedLog.glasses, this.state.settings.goal)

    this.render()

    setTimeout(() => {
      const naggerEl = document.getElementById('nagger-message')
      if (naggerEl) {
        naggerEl.innerHTML = `
          <div class="nagger-emoji">${naggerMsg.emoji}</div>
          <p class="nagger-text">${naggerMsg.message}</p>
        `
        naggerEl.classList.add('animate-pop')
      }
    }, 50)
  }

    private cycleTheme(): void {
        const { theme } = this.state.settings
        const next = theme === 'light' ? 'dark' : theme === 'dark' ? 'auto' : 'light'

        const settings = getSettings()
        saveSettings({ ...settings, theme: next })
        this.state.settings.theme = next

        document.documentElement.setAttribute('data-theme', next)
        this.render()
    }
}