(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const i of n)if(i.type==="childList")for(const o of i.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function e(n){const i={};return n.integrity&&(i.integrity=n.integrity),n.referrerPolicy&&(i.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?i.credentials="include":n.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(n){if(n.ep)return;n.ep=!0;const i=e(n);fetch(n.href,i)}})();const l={SETTINGS:"hydronag_settings",DAILY_LOG:"hydronag_daily_log",STREAK:"hydronag_streak",HISTORY:"hydronag_history"},w={goal:8,theme:"auto",notificationsEnabled:!1,notificationTimes:["09:00","12:00","15:00","18:00"],onboardingComplete:!1},j={current:0,longest:0,lastLoggedDate:""},p=()=>new Date().toISOString().split("T")[0],k=()=>({date:p(),glasses:0}),u=()=>{const a=localStorage.getItem(l.SETTINGS);return a?{...w,...JSON.parse(a)}:w},y=a=>{localStorage.setItem(l.SETTINGS,JSON.stringify(a))},T=()=>{const a=localStorage.getItem(l.HISTORY);return a?JSON.parse(a):[]},N=a=>{const t=a.sort((e,s)=>s.date.localeCompare(e.date)).slice(0,30);localStorage.setItem(l.HISTORY,JSON.stringify(t))},x=(a,t)=>{const e=T();if(e.some(i=>i.date===a.date))return;const n={date:a.date,glasses:a.glasses,goal:t};N([...e,n])},v=()=>{const a=localStorage.getItem(l.DAILY_LOG);if(!a)return k();const t=JSON.parse(a);if(t.date!==p()){const e=u();x(t,e.goal);const s=k();return E(s),s}return t},E=a=>{localStorage.setItem(l.DAILY_LOG,JSON.stringify(a))},M=()=>{const a=v(),t={...a,glasses:a.glasses+1};return E(t),t},b=()=>{const a=localStorage.getItem(l.STREAK);return a?JSON.parse(a):j},Y=a=>{localStorage.setItem(l.STREAK,JSON.stringify(a))},H=a=>{const t=v(),e=b(),s=p();if(t.glasses<a||e.lastLoggedDate===s)return e;const n=new Date;n.setDate(n.getDate()-1);const i=n.toISOString().split("T")[0],d=e.lastLoggedDate===i?e.current+1:1,c={current:d,longest:Math.max(d,e.longest),lastLoggedDate:s};return Y(c),c},h=()=>({settings:u(),todayLog:v(),streak:b(),history:T()}),B=()=>{Object.values(l).forEach(a=>localStorage.removeItem(a))},A="/hydronag/sw.js",O=async()=>{if(!("serviceWorker"in navigator))return console.warn("[HydroNag] Service Workers not supported"),null;try{const a=await navigator.serviceWorker.register(A,{scope:"/hydronag/"});return console.log("[HydroNag] Service Worker registered"),a}catch(a){return console.error("[HydroNag] Service Worker registration failed",a),null}},I=async()=>"Notification"in window?Notification.permission==="granted"?!0:await Notification.requestPermission()==="granted":(console.warn("[HydroNag] Notifications not supported"),!1),L=async a=>{if(!("serviceWorker"in navigator))return;const t=await navigator.serviceWorker.ready;if(!t.active){console.warn("[HydroNag] No active service worker");return}t.active.postMessage({type:"SCHEDULE_NOTIFICATIONS",times:a}),console.log("[HydroNag] Notifications scheduled for:",a)},$=async()=>{if(!("serviceWorker"in navigator))return;(await navigator.serviceWorker.ready).active?.postMessage({type:"CANCEL_NOTIFICATIONS"}),console.log("[HydroNag] Notifications cancelled")},D=async(a,t)=>{if(await O(),!a){await $();return}if(!await I()){console.warn("[HydroNag] Notification permission denied");return}setTimeout(async()=>{await L(t)},1e3)};class C{onComplete;constructor(t){this.onComplete=t}render(){const t=document.getElementById("app");t.innerHTML=this.getTemplate(),this.attachEvents()}getTemplate(){return`
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
    `}getStep1(){return`
      <div class="card mt-4 text-center animate-fade-in" id="step-1">
        <p class="onboarding-step-text">
          We're going to make sure you drink water today.
          <br/><br/>
          <span class="text-muted">Whether you like it or not.</span>
        </p>
        <button class="btn btn-primary btn-lg w-full mt-3" id="btn-step1">
          Fine. Let's do this.
        </button>
      </div>
    `}getStep2(){return`
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
    `}getStep3(){return`
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
    `}getStep4(){return`
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
    `}attachEvents(){this.attachStep1Events()}attachStep1Events(){document.getElementById("btn-step1").addEventListener("click",()=>{this.goToStep(2)})}attachStep2Events(){document.getElementById("btn-step2").addEventListener("click",()=>{this.goToStep(3)})}attachStep3Events(){document.getElementById("btn-allow-notif").addEventListener("click",async()=>{await this.requestNotifications(!0),this.goToStep(4)}),document.getElementById("btn-skip-notif").addEventListener("click",()=>{this.goToStep(4)})}attachStep4Events(){document.getElementById("btn-finish").addEventListener("click",()=>{this.finish()})}goToStep(t){const e=document.getElementById("onboarding-steps"),s={2:this.getStep2(),3:this.getStep3(),4:this.getStep4()};e.innerHTML=s[t],{2:()=>this.attachStep2Events(),3:()=>this.attachStep3Events(),4:()=>this.attachStep4Events()}[t]?.()}async requestNotifications(t){if(!t)return;const e=await I(),s=u();y({...s,notificationsEnabled:e}),e&&await L(s.notificationTimes)}finish(){const t=u();y({...t,onboardingComplete:!0}),this.onComplete()}}const G=()=>new Date().getHours(),W=a=>[{message:"Good morning. Have you had water yet? No? Disappointing.",emoji:"😑"},{message:"Your body lost water while you slept. Just thought you should know.",emoji:"💤"},{message:`You've had ${a} glass${a!==1?"es":""} so far. The day just started. No excuses.`,emoji:"🌅"},{message:"Coffee doesn't count. Drink water first. Then your coffee. I'll wait.",emoji:"☕"}],R=(a,t)=>[{message:`It's midday and you've had ${a} out of ${t} glasses. We need to talk.`,emoji:"🌤️"},{message:"That headache you have? Probably dehydration. Drink water, genius.",emoji:"🤕"},{message:`${t-a} more glasses to go. You can do this. Probably.`,emoji:"😒"},{message:"Your brain is literally shrinking from dehydration right now. No pressure.",emoji:"🧠"}],J=(a,t)=>[{message:`Evening already and only ${a} glasses? I'm not mad. I'm just disappointed.`,emoji:"🌆"},{message:"Last chance to not be a raisin today. Drink up.",emoji:"🍇"},{message:`${t-a} glasses left before bed. Don't you dare give up now.`,emoji:"🌙"},{message:"You know what pairs well with dinner? Water. Shocking concept.",emoji:"🍽️"}],z=(a,t)=>[{message:"It's late. Did you even try today?",emoji:"😴"},{message:`You managed ${a} out of ${t} glasses. Tomorrow is a new chance to do better. Maybe.`,emoji:"🌑"},{message:"Your kidneys are filing a complaint. Just so you know.",emoji:"📋"},{message:"Sleep hydrated. Or don't. I'm a website, not a doctor.",emoji:"🤷"}],q=()=>[{message:"You actually did it. I'm genuinely shocked. Well done.",emoji:"🏆"},{message:"Goal met! I'd say I'm proud but let's see if you do it again tomorrow.",emoji:"👏"},{message:"Look at you, hydrating like a functioning human being!",emoji:"🎉"},{message:"Goal achieved. Your kidneys thank you. Reluctantly, so do I.",emoji:"💧"}],F=a=>[{message:`${a} day streak! Don't ruin it. I know you're thinking about ruining it.`,emoji:"🔥"},{message:`${a} days in a row. Honestly didn't think you had it in you.`,emoji:"😮"},{message:`${a} day streak! Your future self is mildly impressed.`,emoji:"⚡"}],g=a=>a[Math.floor(Math.random()*a.length)],P=a=>{const{todayLog:t,settings:e,streak:s}=a,{glasses:n}=t,{goal:i}=e,o=G();return n>=i?g(q()):s.current>1&&Math.random()<.3?g(F(s.current)):o>=5&&o<12?g(W(n)):o>=12&&o<17?g(R(n,i)):o>=17&&o<21?g(J(n,i)):g(z(n,i))},Q=(a,t)=>{const e=t-a;return a===1?{message:"One down. Finally. Only took you this long.",emoji:"💧"}:e===0?{message:"GOAL MET. I can't believe it. You did it.",emoji:"🎊"}:e===1?{message:"One more glass. ONE. Don't quit now.",emoji:"😤"}:e<=3?{message:`So close! Just ${e} more. You're almost a real human today.`,emoji:"💪"}:{message:`${a} down, ${e} to go. Keep it up. I'm watching.`,emoji:"👀"}},S=[{fact:"Your body is about 60% water.",naggerTake:"And yet here you are, actively trying to reduce that number. Impressive."},{fact:"The '8 glasses a day' rule has no solid scientific backing. It came from a misread 1945 report.",naggerTake:"But 8 is still better than the 0 you've been managing. So we're keeping it."},{fact:"Mild dehydration of just 1-2% body water loss can impair your mood, memory and concentration.",naggerTake:"So that brain fog you're blaming on Monday? That's on you. Drink water."},{fact:"Your brain is approximately 75% water.",naggerTake:"No wonder you keep forgetting to hydrate. Your brain is literally drying out."},{fact:"Drinking water can boost your metabolism by up to 30% within 10 minutes.",naggerTake:"Free energy. Zero effort. And you still can't be bothered. Remarkable."},{fact:"You lose about 2.5 liters of water daily through breathing, sweating and other functions.",naggerTake:"Your body is literally leaking and you haven't refilled once today. Think about that."},{fact:"Thirst is actually a late indicator of dehydration. By the time you feel thirsty, you're already dehydrated.",naggerTake:"So waiting until you're thirsty is the hydration equivalent of waiting until your car is on fire to add oil."},{fact:"Water makes up about 92% of your blood.",naggerTake:"Your blood needs water to be blood. This shouldn't need further explanation."},{fact:"Dehydration is one of the most common causes of daytime fatigue.",naggerTake:"That afternoon slump? Not your job. Not your sleep. It's the water you're not drinking."},{fact:"Drinking enough water can reduce the risk of kidney stones by up to 50%.",naggerTake:"Kidney stones are apparently one of the most painful things a human can experience. Just drink the water."},{fact:"Your kidneys filter about 200 liters of blood daily and need water to do it properly.",naggerTake:"200 liters. Daily. And you can't manage 8 glasses. Your kidneys deserve better."},{fact:"Water is the only nutrient that can improve athletic performance by 20-30% when properly consumed.",naggerTake:"Not a protein shake. Not a pre-workout. Just water. Wild concept."},{fact:"A human can survive about 3 weeks without food but only 3 days without water.",naggerTake:"You skipped breakfast and thought that was rough. Perspective."},{fact:"Drinking water before meals can reduce calorie intake and aid weight management.",naggerTake:"A free appetite suppressant and you're ignoring it. Truly baffling."},{fact:"Cold water can help reduce core body temperature during exercise and heat exposure.",naggerTake:"You're out here sweating and suffering when the solution is just... a cold glass of water."},{fact:"The human body cannot store water the way it stores fat or carbohydrates.",naggerTake:"There is no water reserve. No backup tank. You have to keep refilling. Like a fish."},{fact:"Water lubricates your joints. Dehydration is a common trigger for joint pain.",naggerTake:"Your knees hurt? Your back aches? Have you tried not being dehydrated for once?"},{fact:"Your skin is about 64% water. Dehydration is one of the fastest ways to look tired and dull.",naggerTake:"No skincare routine in the world fixes dehydration. Drink water. It's cheaper than serum."},{fact:"Even mild dehydration can cause headaches in many people.",naggerTake:"Before you reach for painkillers, try drinking a glass of water first. You might be surprised."},{fact:"Water helps regulate your body temperature through sweating and respiration.",naggerTake:"Your body is a very sophisticated cooling system that requires water to function. You're not giving it water. Connect the dots."}],_=()=>{const a=Math.floor((Date.now()-new Date(new Date().getFullYear(),0,0).getTime())/864e5);return S[a%S.length]};class Z{state;onOpenSettings;onOpenHistory;lastLoggedAt=null;constructor(t,e,s){this.state=t,this.onOpenSettings=e,this.onOpenHistory=s}render(){const t=document.getElementById("app");t.innerHTML=this.getTemplate(),this.attachEvents()}getTemplate(){const{todayLog:t,settings:e,streak:s}=this.state,{glasses:n}=t,{goal:i}=e,o=Math.min(n/i*100,100),d=P(this.state),c=_();return`
      <div class="container animate-fade-in">

        <!-- Header -->
        <div class="flex items-center justify-between mt-3">
          <div class="flex items-center gap-1">
            <span class="dashboard-logo">💧</span>
            <span class="dashboard-title">HydroNag</span>
          </div>
          <div class="flex items-center gap-1">
            <button class="btn-icon" id="btn-history" title="Shame History">📊</button>
            <button class="btn-icon" id="btn-theme-toggle" title="Toggle theme">
              ${this.getThemeIcon()}
            </button>
            <button class="btn-icon" id="btn-settings" title="Settings">
              ⚙️
            </button>
          </div>
        </div>

        <!-- Streak Badge -->
        ${s.current>0?`
          <div class="flex items-center justify-center mt-3">
            <div class="streak-badge">
              🔥 ${s.current} day streak
              ${s.current>=7?"— you absolute legend":""}
              ${s.current===1?"— okay, a start.":""}
            </div>
          </div>
        `:""}

        <!-- Jug -->
        <div class="jug-container mt-3">
          ${this.getJugSVG(o)}
        </div>

        <!-- Count & Progress -->
        <div class="text-center mt-3">
          <div class="glass-count">
            <span class="glass-count-current">${n}</span>
            <span class="glass-count-divider"> / </span>
            <span class="glass-count-goal">${i}</span>
            <span class="glass-count-label"> glasses</span>
          </div>
          <div class="progress-bar mt-2">
            <div class="progress-bar-fill" style="width: ${o}%"></div>
          </div>
          <p class="text-muted mt-1" style="font-size: 0.875rem">
            ${n>=i?"Daily goal reached! 🎉":`${i-n} more to go`}
          </p>
        </div>

        <!-- Nagger Message -->
        <div class="card nagger-card mt-3" id="nagger-message">
          <div class="nagger-emoji">${d.emoji}</div>
          <p class="nagger-text">${d.message}</p>
        </div>

        <!-- Main Action Button -->
        <button
          class="btn btn-primary btn-lg w-full mt-3 drink-btn"
          id="btn-drink"
          ${n>=i?"disabled":""}
        >
          💧 I drank a glass
        </button>

        ${n>=i?`
          <p class="text-center text-muted mt-2" style="font-size:0.875rem">
            Goal met! Come back tomorrow. I'll be waiting.
          </p>
        `:""}

        <!-- Fact Card -->
        <div class="card fact-card mt-3 mb-4">
          <div class="fact-card-header">
            <span>💡</span>
            <span class="fact-card-label">Did you know?</span>
          </div>
          <p class="fact-text mt-2">${c.fact}</p>
          <p class="fact-nagger-take mt-2">${c.naggerTake}</p>
        </div>

      </div>
    `}getThemeIcon(){const{theme:t}=this.state.settings;return t==="light"?"🌙":t==="dark"?"☀️":"🌗"}getJugSVG(t){const e=120*(t/100),s=170-e;return`
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
          y="${s}"
          width="113"
          height="${e+10}"
          fill="var(--water-color)"
          opacity="0.7"
          clip-path="url(#jug-clip)"
          class="jug-water-fill"
        />

        <!-- Wave on top of water -->
        ${t>0?`
        <g clip-path="url(#jug-clip)">
          <path
            d="M44 ${s} Q68 ${s-6} 100 ${s} Q132 ${s+6} 157 ${s} L157 ${s+8} Q132 ${s+14} 100 ${s+8} Q68 ${s+2} 44 ${s+8} Z"
            fill="var(--water-wave)"
            opacity="0.5"
          />
        </g>
        `:""}

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
          fill="${t>40?"white":"var(--color-primary)"}"
          opacity="0.9"
        >
          ${Math.round(t)}%
        </text>
      </svg>
    `}attachEvents(){document.getElementById("btn-drink").addEventListener("click",()=>{this.logGlass()}),document.getElementById("btn-settings").addEventListener("click",()=>{this.onOpenSettings()}),document.getElementById("btn-theme-toggle").addEventListener("click",()=>{this.cycleTheme()}),document.getElementById("btn-history").addEventListener("click",()=>{this.onOpenHistory()})}logGlass(){const{glasses:t}=this.state.todayLog;if(t>0&&this.lastLoggedAt&&(Date.now()-this.lastLoggedAt)/1e3<60){this.showDoubleCheckModal();return}this.confirmLogGlass()}showDoubleCheckModal(){const t=[{question:"Two in a row? Really?",sub:"That was less than a minute ago. Are you actually drinking or just tapping buttons?"},{question:"Hold on.",sub:"Did you actually finish that glass already? You're either very hydrated or very bored."},{question:"...already?",sub:"I'm not saying I don't believe you. I'm just saying I don't believe you."},{question:"Two glasses back to back?",sub:"Either you were extremely thirsty or you're trying to game me. Which is it?"}],e=t[Math.floor(Math.random()*t.length)],s=document.createElement("div");s.className="modal-overlay animate-fade-in",s.id="double-check-modal",s.innerHTML=`
      <div class="modal-card animate-fade-in">
        <div class="modal-emoji">🤨</div>
        <h3 class="mt-2">${e.question}</h3>
        <p class="text-muted mt-2">${e.sub}</p>
        <button class="btn btn-primary w-full mt-3" id="btn-confirm-glass">
          Yes, I actually drank it
        </button>
        <button class="btn btn-ghost w-full mt-2" id="btn-deny-glass">
          Okay fine, I didn't
        </button>
      </div>
    `,document.body.appendChild(s),document.getElementById("btn-confirm-glass").addEventListener("click",()=>{s.remove(),this.confirmLogGlass()}),document.getElementById("btn-deny-glass").addEventListener("click",()=>{s.remove(),this.showCaughtModal()})}showCaughtModal(){const t=document.createElement("div");t.className="modal-overlay animate-fade-in",t.innerHTML=`
      <div class="modal-card animate-fade-in">
        <div class="modal-emoji">😑</div>
        <h3 class="mt-2">I knew it.</h3>
        <p class="text-muted mt-2">Go drink your water. Come back when you've actually done it.</p>
        <button class="btn btn-primary w-full mt-3" id="btn-caught-ok">
          Fine. I'll go drink it.
        </button>
      </div>
    `,document.body.appendChild(t),document.getElementById("btn-caught-ok").addEventListener("click",()=>{t.remove()})}confirmLogGlass(){this.lastLoggedAt=Date.now();const t=M();this.state.todayLog=t,this.state.streak=H(this.state.settings.goal);const e=Q(t.glasses,this.state.settings.goal);this.render(),setTimeout(()=>{const s=document.getElementById("nagger-message");s&&(s.innerHTML=`
          <div class="nagger-emoji">${e.emoji}</div>
          <p class="nagger-text">${e.message}</p>
        `,s.classList.add("animate-pop"))},50)}cycleTheme(){const{theme:t}=this.state.settings,e=t==="light"?"dark":t==="dark"?"auto":"light",s=u();y({...s,theme:e}),this.state.settings.theme=e,document.documentElement.setAttribute("data-theme",e),this.render()}}class K{onBack;settings;constructor(t){this.onBack=t,this.settings=u()}render(){const t=document.getElementById("app");t.innerHTML=this.getTemplate(),this.attachEvents()}getTemplate(){const{goal:t,theme:e,notificationsEnabled:s,notificationTimes:n}=this.settings;return`
      <div class="container animate-fade-in">

        <!-- Header -->
        <div class="flex items-center gap-2 mt-3">
          <button class="btn-icon" id="btn-back">←</button>
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
            <span class="settings-goal-value" id="goal-value">${t}</span>
            <button class="btn btn-ghost settings-stepper" id="btn-goal-plus">+</button>
          </div>
          <p class="text-center text-muted mt-1" style="font-size:0.8rem">glasses per day</p>
        </div>

        <!-- Theme -->
        <div class="card mt-3">
          <h3>🎨 Theme</h3>
          <p class="text-muted mt-1" style="font-size:0.875rem">Pick your ocean vibe.</p>
          <div class="settings-theme-options mt-3">
            <button class="btn settings-theme-btn ${e==="light"?"active":""}" data-theme="light">
              ☀️ Beach
            </button>
            <button class="btn settings-theme-btn ${e==="dark"?"active":""}" data-theme="dark">
              🌊 Dusk
            </button>
            <button class="btn settings-theme-btn ${e==="auto"?"active":""}" data-theme="auto">
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
                ${s?"checked":""}
              />
              <span class="toggle-slider"></span>
            </label>
          </div>
          <p class="text-muted mt-1" style="font-size:0.875rem">
            Let HydroNag annoy you at set times. Highly recommended.
          </p>

          <div class="notification-times mt-3" id="notification-times"
            style="${s?"":"opacity:0.4; pointer-events:none"}">
            <p style="font-size:0.875rem; font-weight:600; margin-bottom:0.5rem">Nag times:</p>
            ${n.map((i,o)=>`
              <div class="notification-time-row">
                <input
                  type="time"
                  class="time-input"
                  data-index="${o}"
                  value="${i}"
                />
                <button class="btn-icon btn-remove-time" data-index="${o}">🗑️</button>
              </div>
            `).join("")}
            ${n.length<8?`
              <button class="btn btn-ghost w-full mt-2" id="btn-add-time">
                + Add time
              </button>
            `:""}
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
    `}attachEvents(){document.getElementById("btn-back").addEventListener("click",()=>{this.onBack()}),document.getElementById("btn-goal-minus").addEventListener("click",()=>{this.adjustGoal(-1)}),document.getElementById("btn-goal-plus").addEventListener("click",()=>{this.adjustGoal(1)}),document.querySelectorAll(".settings-theme-btn").forEach(t=>{t.addEventListener("click",e=>{const s=e.currentTarget.dataset.theme;this.setTheme(s)})}),document.getElementById("toggle-notifications").addEventListener("change",t=>{const e=t.target.checked;this.settings.notificationsEnabled=e;const s=document.getElementById("notification-times");s.style.opacity=e?"1":"0.4",s.style.pointerEvents=e?"auto":"none"}),document.querySelectorAll(".time-input").forEach(t=>{t.addEventListener("change",e=>{const s=e.target,n=parseInt(s.dataset.index);this.settings.notificationTimes[n]=s.value})}),document.querySelectorAll(".btn-remove-time").forEach(t=>{t.addEventListener("click",e=>{const s=parseInt(e.currentTarget.dataset.index);this.settings.notificationTimes.splice(s,1),this.render()})}),document.getElementById("btn-add-time")?.addEventListener("click",()=>{this.settings.notificationTimes.push("08:00"),this.render()}),document.getElementById("btn-save").addEventListener("click",()=>{this.save()}),document.getElementById("btn-reset").addEventListener("click",()=>{this.confirmReset()})}adjustGoal(t){const e=Math.min(20,Math.max(1,this.settings.goal+t));this.settings.goal=e,document.getElementById("goal-value").textContent=String(e)}setTheme(t){this.settings.theme=t,document.documentElement.setAttribute("data-theme",t),document.querySelectorAll(".settings-theme-btn").forEach(e=>{e.classList.remove("active")}),document.querySelector(`[data-theme="${t}"]`).classList.add("active")}async save(){y(this.settings),this.settings.notificationsEnabled?await D(!0,this.settings.notificationTimes):await $();const t=document.getElementById("btn-save");t.textContent="✅ Saved!",setTimeout(()=>{this.onBack()},800)}confirmReset(){const t=document.createElement("div");t.className="modal-overlay animate-fade-in",t.innerHTML=`
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
    `,document.body.appendChild(t),document.getElementById("btn-confirm-reset").addEventListener("click",()=>{B(),t.remove(),window.location.reload()}),document.getElementById("btn-cancel-reset").addEventListener("click",()=>{t.remove()})}getCurrentStreak(){return b().current}}class U{state;onBack;constructor(t,e){this.state=t,this.onBack=e}render(){const t=document.getElementById("app");t.innerHTML=this.getTemplate(),this.attachEvents()}getTemplate(){const{history:t,settings:e}=this.state,s=this.getStats();return`
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
            <div class="stat-value">${s.average}</div>
            <div class="stat-label">Daily Average</div>
          </div>
          <div class="stat-card">
            <div class="stat-emoji">✅</div>
            <div class="stat-value">${s.goalMetDays}</div>
            <div class="stat-label">Goals Met</div>
          </div>
          <div class="stat-card">
            <div class="stat-emoji">💀</div>
            <div class="stat-value">${s.zeroDays}</div>
            <div class="stat-label">Zero Days</div>
          </div>
        </div>

        <!-- Nagger Summary -->
        <div class="card nagger-card mt-3">
          <div class="nagger-emoji">${this.getSummaryEmoji(s)}</div>
          <p class="nagger-text">${this.getSummaryMessage(s)}</p>
        </div>

        <!-- Today (always shown) -->
        <div class="mt-3">
          <p class="history-section-label">Today</p>
          ${this.getTodayRow()}
        </div>

        <!-- History List -->
        <div class="mt-3 mb-4">
          <p class="history-section-label">Last 30 Days</p>
          ${t.length===0?this.getEmptyState():t.map(n=>this.getHistoryRow(n)).join("")}
        </div>

      </div>
    `}getTodayRow(){const{glasses:t}=this.state.todayLog,{goal:e}=this.state.settings,s=Math.min(t/e*100,100),{emoji:n,label:i}=this.getRating(t,e),o=new Date;return`
      <div class="history-row history-row-today">
        <div class="history-date">
          <span class="history-date-day">Today</span>
          <span class="history-date-sub">${this.formatDate(o.toISOString().split("T")[0])}</span>
        </div>
        <div class="history-bar-wrap">
          <div class="history-bar">
            <div class="history-bar-fill" style="width:${s}%"></div>
          </div>
          <span class="history-count">${t}/${e}</span>
        </div>
        <div class="history-rating" title="${i}">${n}</div>
      </div>
    `}getHistoryRow(t){const e=Math.min(t.glasses/t.goal*100,100),{emoji:s,label:n}=this.getRating(t.glasses,t.goal);return`
      <div class="history-row">
        <div class="history-date">
          <span class="history-date-day">${this.getDayName(t.date)}</span>
          <span class="history-date-sub">${this.formatDate(t.date)}</span>
        </div>
        <div class="history-bar-wrap">
          <div class="history-bar">
            <div class="history-bar-fill ${t.glasses===0?"history-bar-zero":""}"
              style="width:${e}%">
            </div>
          </div>
          <span class="history-count">${t.glasses}/${t.goal}</span>
        </div>
        <div class="history-rating" title="${n}">${s}</div>
      </div>
    `}getEmptyState(){return`
      <div class="card text-center mt-2">
        <div style="font-size:2rem">🌊</div>
        <p class="mt-2 text-muted">No history yet.</p>
        <p class="mt-1 text-muted" style="font-size:0.875rem">
          Come back tomorrow. Your shame will be recorded.
        </p>
      </div>
    `}getRating(t,e){const s=t/e*100;return t===0?{emoji:"🪦",label:"You didn't even try."}:s<30?{emoji:"💀",label:"Was that even trying?"}:s<50?{emoji:"😑",label:"Deeply disappointing."}:s<75?{emoji:"😐",label:"Almost. Almost."}:s<100?{emoji:"🙂",label:"So close. Try harder."}:{emoji:"✅",label:"Respectable. Finally."}}getStats(){const{history:t,settings:e,todayLog:s}=this.state,n=[...t,{date:"today",glasses:s.glasses,goal:e.goal}],i=n.reduce((r,m)=>r+m.glasses,0),o=n.length>0?(i/n.length).toFixed(1):"0",d=n.filter(r=>r.glasses>=r.goal).length,c=t.filter(r=>r.glasses===0).length,f=t.reduce((r,m)=>m.glasses<r?m.glasses:r,1/0);return{average:o,goalMetDays:d,zeroDays:c,worstDay:f===1/0?0:f}}getSummaryMessage(t){const e=parseFloat(t.average),{goal:s}=this.state.settings;return t.zeroDays>=5?`${t.zeroDays} days with zero glasses. Truly remarkable negligence.`:e>=s?"You're actually doing it. I'm as surprised as you are.":e>=s*.75?"Not bad. Not great. But not embarrassing. Progress.":e>=s*.5?"You're hitting about half your goal. The bare minimum. Classic.":e>0?`${t.average} glasses on average. Your kidneys are filing a formal complaint.`:"No data yet. Start drinking water. I'll be watching."}getSummaryEmoji(t){const e=parseFloat(t.average),{goal:s}=this.state.settings;return t.zeroDays>=5?"😤":e>=s?"🏆":e>=s*.75?"👍":e>=s*.5?"😐":"💀"}formatDate(t){return new Date(t+"T00:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric"})}getDayName(t){const e=new Date(t+"T00:00:00"),s=new Date;return s.setDate(s.getDate()-1),e.toDateString()===s.toDateString()?"Yesterday":e.toLocaleDateString("en-US",{weekday:"short"})}attachEvents(){document.getElementById("btn-back").addEventListener("click",()=>{this.onBack()})}}class V{state;constructor(){this.state=h()}init(){this.applyTheme(),this.watchSystemTheme(),this.initNotifications(),this.render()}async initNotifications(){const{notificationsEnabled:t,notificationTimes:e}=this.state.settings;await D(t,e)}applyTheme(){const{theme:t}=this.state.settings;document.documentElement.setAttribute("data-theme",t)}watchSystemTheme(){window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",()=>{this.state.settings.theme==="auto"&&this.applyTheme()})}render(){const{onboardingComplete:t}=this.state.settings;t?this.renderDashboard():new C(()=>{this.state=h(),this.renderDashboard()}).render()}renderDashboard(){new Z(this.state,()=>this.openSettings(),()=>this.openHistory()).render()}openSettings(){new K(()=>{this.state=h(),this.renderDashboard()}).render()}openHistory(){new U(this.state,()=>{this.state=h(),this.renderDashboard()}).render()}}const X=new V;X.init();
