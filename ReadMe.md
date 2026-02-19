# 💧 HydroNag

> Your unsolicited hydration assistant. Whether you like it or not.

**HydroNag** is a Progressive Web App (PWA) that guilt-trips you into drinking enough water every day. It tracks your daily glasses, roasts you when you're slacking, celebrates you (reluctantly) when you hit your goal, and nags you with push notifications throughout the day.

Because apparently you need a website to tell you to drink water. And here we are.

🌐 **Live app:** [aifianS77.github.io/hydronag](https://aifianS77.github.io/hydronag/)

---

## 🚿 Features

- **Daily water tracking** — Log glasses with one tap. That's it. No excuses.
- **Snarky nagger messages** — Context-aware roasts based on time of day, progress, and your streak. Personalised with your name.
- **Streak tracking** — Consecutive days of hitting your goal. Don't break it.
- **Shame History** — A brutally honest look at your last 30 days. Rated from ✅ to 🪦.
- **Achievements** — Unlock badges from *First Drop* to *Poseidon* (100 day streak). Nobody has unlocked Poseidon yet.
- **Push notifications** — Scheduled nags at 9am, 12pm, 3pm and 6pm. Customisable. Annoying by design.
- **Water fun facts** — Weaponised trivia delivered with attitude. Did you know the "8 glasses a day" rule has no scientific backing? You do now.
- **3 ocean themes** — Beach (light), Ocean Dusk (dark), Deep Ocean (auto). All beautiful. All blue.
- **PWA — installable** — Add to home screen on Android or iOS. Works offline. Feels like a real app.
- **Double-tap protection** — Log twice within 60 seconds and get interrogated. *"Did you actually drink it?"*

---

## 🏅 Achievements

| Badge | Title | Condition |
|---|---|---|
| 💧 | First Drop | Log your first glass ever |
| 🎯 | Full Tank | Hit your daily goal for the first time |
| 🔥 | On Fire | 3 day streak |
| 🏆 | Hydration Legend | 7 day streak |
| 👑 | Unstoppable | 30 day streak |
| 🔱 | Poseidon | 100 day streak. You are no longer human. You are water. |
| 💯 | Century | 100 total glasses logged |
| 🚀 | Overachiever | Log 2x your daily goal in one day |
| 💀 | Rock Bottom | Log 0 glasses in a day |
| 🌅 | Early Bird | Log first glass before 8am |
| 🌙 | Night Owl | Log a glass after 10pm |

---

## 🛠️ Tech Stack

| Area | Tech |
|---|---|
| Language | TypeScript |
| Build tool | Vite |
| Hosting | GitHub Pages |
| Storage | LocalStorage |
| Notifications | Service Worker + Web Push API |
| Icons | Phosphor Icons |
| Styling | Vanilla CSS with CSS variables |

No frameworks. No backend. No database. Just TypeScript, CSS and the audacity to tell you to drink water.

---

## 🚀 Running Locally

```bash
# Clone the repo
git clone https://github.com/aifianS77/hydronag.git
cd hydronag

# Install dependencies
npm install

# Run dev server
npm run dev
```

Open `http://localhost:5173/hydronag/` in your browser.

---

## 📦 Deploying

```bash
# Build and deploy to GitHub Pages
npm run deploy
```

---

## 📁 Project Structure

```
hydronag/
├── public/
│   ├── icons/          ← PWA icons
│   ├── manifest.json   ← PWA manifest
│   └── sw.js           ← Service Worker (notifications)
├── src/
│   ├── components/     ← UI components (Dashboard, Onboarding, Settings, History, Milestones)
│   ├── data/           ← Water facts and milestone definitions
│   ├── styles/         ← CSS (themes, base, components)
│   ├── types/          ← TypeScript interfaces
│   ├── utils/          ← Storage, notifications, nagger logic, milestone checker
│   ├── app.ts          ← Main app controller
│   └── main.ts         ← Entry point
└── index.html
```

---

## 💡 The "8 Glasses" Thing

Yes, we default to 8 glasses. No, it's not scientifically exact — the rule came from a misread 1945 report that nobody questioned for 80 years. But you know what's worse than 8 glasses? Zero glasses. Which is what most people drink. So we're going with 8. You can change it in settings.

---

## 🔱 Poseidon

Nobody has unlocked Poseidon yet. 100 consecutive days of hitting your water goal. It's sitting there. Waiting. Judging you.

---

*Built with TypeScript, Vite, and an unhealthy amount of sarcasm.*