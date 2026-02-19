import { AppState } from '../types'

export class Milestones {
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
    const { milestones } = this.state
    const unlocked = milestones.filter(m => m.unlockedAt)
    const locked = milestones.filter(m => !m.unlockedAt)

    return `
      <div class="container animate-fade-in">

        <!-- Header -->
        <div class="flex items-center gap-2 mt-3">
            <button class="btn-back-btn" id="btn-back">
                <i class="ph ph-arrow-left"></i> Back
            </button>
          <h2>Achievements 🏅</h2>
        </div>

        <!-- Summary -->
        <div class="card mt-3 text-center">
          <div class="milestone-summary-count">
            ${unlocked.length} / ${milestones.length}
          </div>
          <p class="text-muted mt-1" style="font-size:0.875rem">
            ${unlocked.length === 0
              ? "No achievements yet. Get to work."
              : unlocked.length === milestones.length
              ? "All achievements unlocked. You are a hydration god. 🔱"
              : `${locked.length} more to unlock. You know what to do.`
            }
          </p>
          <div class="milestone-progress-bar mt-2">
            <div class="milestone-progress-fill"
              style="width: ${(unlocked.length / milestones.length) * 100}%">
            </div>
          </div>
        </div>

        <!-- Unlocked -->
        ${unlocked.length > 0 ? `
          <p class="history-section-label mt-3">Unlocked 🔓</p>
          ${unlocked.map(m => this.getMilestoneCard(m, true)).join('')}
        ` : ''}

        <!-- Locked -->
        <p class="history-section-label mt-3">Locked 🔒</p>
        ${locked.length === 0
          ? `<div class="card text-center mt-2">
              <p class="text-muted">All achievements unlocked. Poseidon is proud. 🔱</p>
            </div>`
          : locked.map(m => this.getMilestoneCard(m, false)).join('')
        }

        <div class="mt-4"></div>
      </div>
    `
  }

  private getMilestoneCard(milestone: any, unlocked: boolean): string {
    const date = unlocked
      ? new Date(milestone.unlockedAt).toLocaleDateString('en-US', {
          month: 'short', day: 'numeric', year: 'numeric'
        })
      : null

    return `
      <div class="milestone-card ${unlocked ? 'milestone-unlocked' : 'milestone-locked'}">
        <div class="milestone-card-emoji">${unlocked ? milestone.emoji : '🔒'}</div>
        <div class="milestone-card-content">
          <div class="milestone-card-title">${milestone.title}</div>
          <div class="milestone-card-desc">
            ${unlocked ? milestone.description : '???'}
          </div>
          ${date ? `<div class="milestone-card-date">Unlocked ${date}</div>` : ''}
        </div>
      </div>
    `
  }

  private attachEvents(): void {
    document.getElementById('btn-back')!.addEventListener('click', () => {
      this.onBack()
    })
  }
}