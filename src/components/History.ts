import { HistoryEntry, AppState } from '../types'

export class History {
  private state: AppState
  private onBack: () => void

  constructor(state: AppState, onBack: () => void) {
    this.state = state
    this.onBack = onBack
  }

  render(): void {
    const app = document.getElementById('app')!
    app.innerHTML = this.getTemplate()
    this.attachEvents()
  }

  private getTemplate(): string {
    const { history, settings } = this.state
    const stats = this.getStats()

    return `
      <div class="container animate-fade-in">

        <!-- Header -->
        <div class="flex items-center gap-2 mt-3">
          <button class="btn-icon" id="btn-back">←</button>
          <h2>Shame History 📊</h2>
        </div>

        <!-- Stats Summary -->
        <div class="history-stats mt-3">
          <div class="stat-card">
            <div class="stat-emoji">🔥</div>
            <div class="stat-value">${this.state.streak.longest}</div>
            <div class="stat-label">Best Streak</div>
          </div>
          <div class="stat-card">
            <div class="stat-emoji">💧</div>
            <div class="stat-value">${stats.average}</div>
            <div class="stat-label">Daily Average</div>
          </div>
          <div class="stat-card">
            <div class="stat-emoji">✅</div>
            <div class="stat-value">${stats.goalMetDays}</div>
            <div class="stat-label">Goals Met</div>
          </div>
          <div class="stat-card">
            <div class="stat-emoji">💀</div>
            <div class="stat-value">${stats.zeroDays}</div>
            <div class="stat-label">Zero Days</div>
          </div>
        </div>

        <!-- Nagger Summary -->
        <div class="card nagger-card mt-3">
          <div class="nagger-emoji">${this.getSummaryEmoji(stats)}</div>
          <p class="nagger-text">${this.getSummaryMessage(stats)}</p>
        </div>

        <!-- Today (always shown) -->
        <div class="mt-3">
          <p class="history-section-label">Today</p>
          ${this.getTodayRow()}
        </div>

        <!-- History List -->
        <div class="mt-3 mb-4">
          <p class="history-section-label">Last 30 Days</p>
          ${history.length === 0
            ? this.getEmptyState()
            : history.map(entry => this.getHistoryRow(entry)).join('')
          }
        </div>

      </div>
    `
  }

  // ─── Today Row ────────────────────────────────────────────────
  private getTodayRow(): string {
    const { glasses } = this.state.todayLog
    const { goal } = this.state.settings
    const percent = Math.min((glasses / goal) * 100, 100)
    const { emoji, label } = this.getRating(glasses, goal)
    const today = new Date()

    return `
      <div class="history-row history-row-today">
        <div class="history-date">
          <span class="history-date-day">Today</span>
          <span class="history-date-sub">${this.formatDate(today.toISOString().split('T')[0])}</span>
        </div>
        <div class="history-bar-wrap">
          <div class="history-bar">
            <div class="history-bar-fill" style="width:${percent}%"></div>
          </div>
          <span class="history-count">${glasses}/${goal}</span>
        </div>
        <div class="history-rating" title="${label}">${emoji}</div>
      </div>
    `
  }

  // ─── History Row ──────────────────────────────────────────────
  private getHistoryRow(entry: HistoryEntry): string {
    const percent = Math.min((entry.glasses / entry.goal) * 100, 100)
    const { emoji, label } = this.getRating(entry.glasses, entry.goal)

    return `
      <div class="history-row">
        <div class="history-date">
          <span class="history-date-day">${this.getDayName(entry.date)}</span>
          <span class="history-date-sub">${this.formatDate(entry.date)}</span>
        </div>
        <div class="history-bar-wrap">
          <div class="history-bar">
            <div class="history-bar-fill ${entry.glasses === 0 ? 'history-bar-zero' : ''}"
              style="width:${percent}%">
            </div>
          </div>
          <span class="history-count">${entry.glasses}/${entry.goal}</span>
        </div>
        <div class="history-rating" title="${label}">${emoji}</div>
      </div>
    `
  }

  // ─── Empty State ──────────────────────────────────────────────
  private getEmptyState(): string {
    return `
      <div class="card text-center mt-2">
        <div style="font-size:2rem">🌊</div>
        <p class="mt-2 text-muted">No history yet.</p>
        <p class="mt-1 text-muted" style="font-size:0.875rem">
          Come back tomorrow. Your shame will be recorded.
        </p>
      </div>
    `
  }

  // ─── Rating System ────────────────────────────────────────────
  private getRating(glasses: number, goal: number): { emoji: string, label: string } {
    const percent = (glasses / goal) * 100

    if (glasses === 0) return { emoji: '🪦', label: "You didn't even try." }
    if (percent < 30)  return { emoji: '💀', label: "Was that even trying?" }
    if (percent < 50)  return { emoji: '😑', label: "Deeply disappointing." }
    if (percent < 75)  return { emoji: '😐', label: "Almost. Almost." }
    if (percent < 100) return { emoji: '🙂', label: "So close. Try harder." }
    return { emoji: '✅', label: "Respectable. Finally." }
  }

  // ─── Stats ────────────────────────────────────────────────────
  private getStats() {
    const { history, settings, todayLog } = this.state
    const allDays = [...history, { date: 'today', glasses: todayLog.glasses, goal: settings.goal }]

    const totalGlasses = allDays.reduce((sum, d) => sum + d.glasses, 0)
    const average = allDays.length > 0
      ? (totalGlasses / allDays.length).toFixed(1)
      : '0'

    const goalMetDays = allDays.filter(d => d.glasses >= d.goal).length
    const zeroDays = history.filter(d => d.glasses === 0).length
    const worstDay = history.reduce((min, d) =>
      d.glasses < min ? d.glasses : min, Infinity)

    return {
      average,
      goalMetDays,
      zeroDays,
      worstDay: worstDay === Infinity ? 0 : worstDay,
    }
  }

  // ─── Summary Message ──────────────────────────────────────────
  private getSummaryMessage(stats: ReturnType<typeof this.getStats>): string {
    const avg = parseFloat(stats.average)
    const { goal } = this.state.settings

    if (stats.zeroDays >= 5) return `${stats.zeroDays} days with zero glasses. Truly remarkable negligence.`
    if (avg >= goal) return "You're actually doing it. I'm as surprised as you are."
    if (avg >= goal * 0.75) return "Not bad. Not great. But not embarrassing. Progress."
    if (avg >= goal * 0.5) return "You're hitting about half your goal. The bare minimum. Classic."
    if (avg > 0) return `${stats.average} glasses on average. Your kidneys are filing a formal complaint.`
    return "No data yet. Start drinking water. I'll be watching."
  }

  private getSummaryEmoji(stats: ReturnType<typeof this.getStats>): string {
    const avg = parseFloat(stats.average)
    const { goal } = this.state.settings
    if (stats.zeroDays >= 5) return '😤'
    if (avg >= goal) return '🏆'
    if (avg >= goal * 0.75) return '👍'
    if (avg >= goal * 0.5) return '😐'
    return '💀'
  }

  // ─── Date Helpers ─────────────────────────────────────────────
  private formatDate(dateStr: string): string {
    const date = new Date(dateStr + 'T00:00:00')
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  private getDayName(dateStr: string): string {
    const date = new Date(dateStr + 'T00:00:00')
    const today = new Date()
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday'
    return date.toLocaleDateString('en-US', { weekday: 'short' })
  }

  // ─── Events ──────────────────────────────────────────────────
  private attachEvents(): void {
    document.getElementById('btn-back')!.addEventListener('click', () => {
      this.onBack()
    })
  }
}