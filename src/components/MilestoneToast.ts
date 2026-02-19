import { Milestone } from '../types'

export const showMilestoneToast = (milestone: Milestone): void => {
  // remove existing toast if any
  document.getElementById('milestone-toast')?.remove()

  const toast = document.createElement('div')
  toast.id = 'milestone-toast'
  toast.className = 'milestone-toast animate-fade-in'
  toast.innerHTML = `
    <div class="milestone-toast-inner">
      <div class="milestone-toast-emoji">${milestone.emoji}</div>
      <div class="milestone-toast-content">
        <div class="milestone-toast-label">Achievement Unlocked!</div>
        <div class="milestone-toast-title">${milestone.title}</div>
        <div class="milestone-toast-desc">${milestone.description}</div>
      </div>
    </div>
  `

  document.body.appendChild(toast)

  // auto remove after 4 seconds
  setTimeout(() => {
    toast.classList.add('milestone-toast-out')
    setTimeout(() => toast.remove(), 400)
  }, 4000)
}