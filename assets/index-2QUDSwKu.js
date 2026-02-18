(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function a(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(n){if(n.ep)return;n.ep=!0;const o=a(n);fetch(n.href,o)}})();const l={SETTINGS:"hydronag_settings",DAILY_LOG:"hydronag_daily_log",STREAK:"hydronag_streak"},p={goal:8,theme:"auto",notificationsEnabled:!1,notificationTimes:["09:00","12:00","15:00","18:00"],onboardingComplete:!1},w={current:0,longest:0,lastLoggedDate:""},h=()=>new Date().toISOString().split("T")[0],f=()=>({date:h(),glasses:0}),g=()=>{const e=localStorage.getItem(l.SETTINGS);return e?{...p,...JSON.parse(e)}:p},m=e=>{localStorage.setItem(l.SETTINGS,JSON.stringify(e))},y=()=>{const e=localStorage.getItem(l.DAILY_LOG);if(!e)return f();const t=JSON.parse(e);if(t.date!==h()){const a=f();return v(a),a}return t},v=e=>{localStorage.setItem(l.DAILY_LOG,JSON.stringify(e))},S=()=>{const e=y(),t={...e,glasses:e.glasses+1};return v(t),t},k=()=>{const e=localStorage.getItem(l.STREAK);return e?JSON.parse(e):w},T=e=>{localStorage.setItem(l.STREAK,JSON.stringify(e))},L=e=>{const t=y(),a=k(),s=h();if(t.glasses<e||a.lastLoggedDate===s)return a;const n=new Date;n.setDate(n.getDate()-1);const o=n.toISOString().split("T")[0],r=a.lastLoggedDate===o?a.current+1:1,c={current:r,longest:Math.max(r,a.longest),lastLoggedDate:s};return T(c),c},u=()=>({settings:g(),todayLog:y(),streak:k()});class I{onComplete;constructor(t){this.onComplete=t}render(){const t=document.getElementById("app");t.innerHTML=this.getTemplate(),this.attachEvents()}getTemplate(){return`
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
    `}attachEvents(){this.attachStep1Events()}attachStep1Events(){document.getElementById("btn-step1").addEventListener("click",()=>{this.goToStep(2)})}attachStep2Events(){document.getElementById("btn-step2").addEventListener("click",()=>{this.goToStep(3)})}attachStep3Events(){document.getElementById("btn-allow-notif").addEventListener("click",async()=>{await this.requestNotifications(!0),this.goToStep(4)}),document.getElementById("btn-skip-notif").addEventListener("click",()=>{this.goToStep(4)})}attachStep4Events(){document.getElementById("btn-finish").addEventListener("click",()=>{this.finish()})}goToStep(t){const a=document.getElementById("onboarding-steps"),s={2:this.getStep2(),3:this.getStep3(),4:this.getStep4()};a.innerHTML=s[t],{2:()=>this.attachStep2Events(),3:()=>this.attachStep3Events(),4:()=>this.attachStep4Events()}[t]?.()}async requestNotifications(t){if(!t||!("Notification"in window))return;const a=await Notification.requestPermission(),s=g();m({...s,notificationsEnabled:a==="granted"})}finish(){const t=g();m({...t,onboardingComplete:!0}),this.onComplete()}}const E=()=>new Date().getHours(),j=e=>[{message:"Good morning. Have you had water yet? No? Disappointing.",emoji:"😑"},{message:"Your body lost water while you slept. Just thought you should know.",emoji:"💤"},{message:`You've had ${e} glass${e!==1?"es":""} so far. The day just started. No excuses.`,emoji:"🌅"},{message:"Coffee doesn't count. Drink water first. Then your coffee. I'll wait.",emoji:"☕"}],$=(e,t)=>[{message:`It's midday and you've had ${e} out of ${t} glasses. We need to talk.`,emoji:"🌤️"},{message:"That headache you have? Probably dehydration. Drink water, genius.",emoji:"🤕"},{message:`${t-e} more glasses to go. You can do this. Probably.`,emoji:"😒"},{message:"Your brain is literally shrinking from dehydration right now. No pressure.",emoji:"🧠"}],D=(e,t)=>[{message:`Evening already and only ${e} glasses? I'm not mad. I'm just disappointed.`,emoji:"🌆"},{message:"Last chance to not be a raisin today. Drink up.",emoji:"🍇"},{message:`${t-e} glasses left before bed. Don't you dare give up now.`,emoji:"🌙"},{message:"You know what pairs well with dinner? Water. Shocking concept.",emoji:"🍽️"}],M=(e,t)=>[{message:"It's late. Did you even try today?",emoji:"😴"},{message:`You managed ${e} out of ${t} glasses. Tomorrow is a new chance to do better. Maybe.`,emoji:"🌑"},{message:"Your kidneys are filing a complaint. Just so you know.",emoji:"📋"},{message:"Sleep hydrated. Or don't. I'm a website, not a doctor.",emoji:"🤷"}],x=()=>[{message:"You actually did it. I'm genuinely shocked. Well done.",emoji:"🏆"},{message:"Goal met! I'd say I'm proud but let's see if you do it again tomorrow.",emoji:"👏"},{message:"Look at you, hydrating like a functioning human being!",emoji:"🎉"},{message:"Goal achieved. Your kidneys thank you. Reluctantly, so do I.",emoji:"💧"}],Y=e=>[{message:`${e} day streak! Don't ruin it. I know you're thinking about ruining it.`,emoji:"🔥"},{message:`${e} days in a row. Honestly didn't think you had it in you.`,emoji:"😮"},{message:`${e} day streak! Your future self is mildly impressed.`,emoji:"⚡"}],d=e=>e[Math.floor(Math.random()*e.length)],N=e=>{const{todayLog:t,settings:a,streak:s}=e,{glasses:n}=t,{goal:o}=a,i=E();return n>=o?d(x()):s.current>1&&Math.random()<.3?d(Y(s.current)):i>=5&&i<12?d(j(n)):i>=12&&i<17?d($(n,o)):i>=17&&i<21?d(D(n,o)):d(M(n,o))},O=(e,t)=>{const a=t-e;return e===1?{message:"One down. Finally. Only took you this long.",emoji:"💧"}:a===0?{message:"GOAL MET. I can't believe it. You did it.",emoji:"🎊"}:a===1?{message:"One more glass. ONE. Don't quit now.",emoji:"😤"}:a<=3?{message:`So close! Just ${a} more. You're almost a real human today.`,emoji:"💪"}:{message:`${e} down, ${a} to go. Keep it up. I'm watching.`,emoji:"👀"}},b=[{fact:"Your body is about 60% water.",naggerTake:"And yet here you are, actively trying to reduce that number. Impressive."},{fact:"The '8 glasses a day' rule has no solid scientific backing. It came from a misread 1945 report.",naggerTake:"But 8 is still better than the 0 you've been managing. So we're keeping it."},{fact:"Mild dehydration of just 1-2% body water loss can impair your mood, memory and concentration.",naggerTake:"So that brain fog you're blaming on Monday? That's on you. Drink water."},{fact:"Your brain is approximately 75% water.",naggerTake:"No wonder you keep forgetting to hydrate. Your brain is literally drying out."},{fact:"Drinking water can boost your metabolism by up to 30% within 10 minutes.",naggerTake:"Free energy. Zero effort. And you still can't be bothered. Remarkable."},{fact:"You lose about 2.5 liters of water daily through breathing, sweating and other functions.",naggerTake:"Your body is literally leaking and you haven't refilled once today. Think about that."},{fact:"Thirst is actually a late indicator of dehydration. By the time you feel thirsty, you're already dehydrated.",naggerTake:"So waiting until you're thirsty is the hydration equivalent of waiting until your car is on fire to add oil."},{fact:"Water makes up about 92% of your blood.",naggerTake:"Your blood needs water to be blood. This shouldn't need further explanation."},{fact:"Dehydration is one of the most common causes of daytime fatigue.",naggerTake:"That afternoon slump? Not your job. Not your sleep. It's the water you're not drinking."},{fact:"Drinking enough water can reduce the risk of kidney stones by up to 50%.",naggerTake:"Kidney stones are apparently one of the most painful things a human can experience. Just drink the water."},{fact:"Your kidneys filter about 200 liters of blood daily and need water to do it properly.",naggerTake:"200 liters. Daily. And you can't manage 8 glasses. Your kidneys deserve better."},{fact:"Water is the only nutrient that can improve athletic performance by 20-30% when properly consumed.",naggerTake:"Not a protein shake. Not a pre-workout. Just water. Wild concept."},{fact:"A human can survive about 3 weeks without food but only 3 days without water.",naggerTake:"You skipped breakfast and thought that was rough. Perspective."},{fact:"Drinking water before meals can reduce calorie intake and aid weight management.",naggerTake:"A free appetite suppressant and you're ignoring it. Truly baffling."},{fact:"Cold water can help reduce core body temperature during exercise and heat exposure.",naggerTake:"You're out here sweating and suffering when the solution is just... a cold glass of water."},{fact:"The human body cannot store water the way it stores fat or carbohydrates.",naggerTake:"There is no water reserve. No backup tank. You have to keep refilling. Like a fish."},{fact:"Water lubricates your joints. Dehydration is a common trigger for joint pain.",naggerTake:"Your knees hurt? Your back aches? Have you tried not being dehydrated for once?"},{fact:"Your skin is about 64% water. Dehydration is one of the fastest ways to look tired and dull.",naggerTake:"No skincare routine in the world fixes dehydration. Drink water. It's cheaper than serum."},{fact:"Even mild dehydration can cause headaches in many people.",naggerTake:"Before you reach for painkillers, try drinking a glass of water first. You might be surprised."},{fact:"Water helps regulate your body temperature through sweating and respiration.",naggerTake:"Your body is a very sophisticated cooling system that requires water to function. You're not giving it water. Connect the dots."}],A=()=>{const e=Math.floor((Date.now()-new Date(new Date().getFullYear(),0,0).getTime())/864e5);return b[e%b.length]};class B{state;onOpenSettings;lastLoggedAt=null;constructor(t,a){this.state=t,this.onOpenSettings=a}render(){const t=document.getElementById("app");t.innerHTML=this.getTemplate(),this.attachEvents()}getTemplate(){const{todayLog:t,settings:a,streak:s}=this.state,{glasses:n}=t,{goal:o}=a,i=Math.min(n/o*100,100),r=N(this.state),c=A();return`
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
          ${this.getJugSVG(i)}
        </div>

        <!-- Count & Progress -->
        <div class="text-center mt-3">
          <div class="glass-count">
            <span class="glass-count-current">${n}</span>
            <span class="glass-count-divider"> / </span>
            <span class="glass-count-goal">${o}</span>
            <span class="glass-count-label"> glasses</span>
          </div>
          <div class="progress-bar mt-2">
            <div class="progress-bar-fill" style="width: ${i}%"></div>
          </div>
          <p class="text-muted mt-1" style="font-size: 0.875rem">
            ${n>=o?"Daily goal reached! 🎉":`${o-n} more to go`}
          </p>
        </div>

        <!-- Nagger Message -->
        <div class="card nagger-card mt-3" id="nagger-message">
          <div class="nagger-emoji">${r.emoji}</div>
          <p class="nagger-text">${r.message}</p>
        </div>

        <!-- Main Action Button -->
        <button
          class="btn btn-primary btn-lg w-full mt-3 drink-btn"
          id="btn-drink"
          ${n>=o?"disabled":""}
        >
          💧 I drank a glass
        </button>

        ${n>=o?`
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
    `}getThemeIcon(){const{theme:t}=this.state.settings;return t==="light"?"🌙":t==="dark"?"☀️":"🌗"}getJugSVG(t){const a=120*(t/100),s=170-a;return`
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
          height="${a+10}"
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
    `}attachEvents(){document.getElementById("btn-drink").addEventListener("click",()=>{this.logGlass()}),document.getElementById("btn-settings").addEventListener("click",()=>{this.onOpenSettings()}),document.getElementById("btn-theme-toggle").addEventListener("click",()=>{this.cycleTheme()})}logGlass(){const{glasses:t}=this.state.todayLog;if(t>0&&this.lastLoggedAt&&(Date.now()-this.lastLoggedAt)/1e3<60){this.showDoubleCheckModal();return}this.confirmLogGlass()}showDoubleCheckModal(){const t=[{question:"Two in a row? Really?",sub:"That was less than a minute ago. Are you actually drinking or just tapping buttons?"},{question:"Hold on.",sub:"Did you actually finish that glass already? You're either very hydrated or very bored."},{question:"...already?",sub:"I'm not saying I don't believe you. I'm just saying I don't believe you."},{question:"Two glasses back to back?",sub:"Either you were extremely thirsty or you're trying to game me. Which is it?"}],a=t[Math.floor(Math.random()*t.length)],s=document.createElement("div");s.className="modal-overlay animate-fade-in",s.id="double-check-modal",s.innerHTML=`
      <div class="modal-card animate-fade-in">
        <div class="modal-emoji">🤨</div>
        <h3 class="mt-2">${a.question}</h3>
        <p class="text-muted mt-2">${a.sub}</p>
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
    `,document.body.appendChild(t),document.getElementById("btn-caught-ok").addEventListener("click",()=>{t.remove()})}confirmLogGlass(){this.lastLoggedAt=Date.now();const t=S();this.state.todayLog=t,this.state.streak=L(this.state.settings.goal);const a=O(t.glasses,this.state.settings.goal);this.render(),setTimeout(()=>{const s=document.getElementById("nagger-message");s&&(s.innerHTML=`
          <div class="nagger-emoji">${a.emoji}</div>
          <p class="nagger-text">${a.message}</p>
        `,s.classList.add("animate-pop"))},50)}cycleTheme(){const{theme:t}=this.state.settings,a=t==="light"?"dark":t==="dark"?"auto":"light",s=g();m({...s,theme:a}),this.state.settings.theme=a,document.documentElement.setAttribute("data-theme",a),this.render()}}class C{state;constructor(){this.state=u()}init(){this.applyTheme(),this.watchSystemTheme(),this.render()}applyTheme(){const{theme:t}=this.state.settings;document.documentElement.setAttribute("data-theme",t)}watchSystemTheme(){window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",()=>{this.state.settings.theme==="auto"&&this.applyTheme()})}render(){const{onboardingComplete:t}=this.state.settings;t?this.renderDashboard():new I(()=>{this.state=u(),this.renderDashboard()}).render()}renderDashboard(){new B(this.state,()=>{this.openSettings()}).render()}openSettings(){const t=document.getElementById("app");t.innerHTML=`
      <div class="container animate-fade-in">
        <h2 class="text-center mt-4">Settings coming soon ⚙️</h2>
        <button class="btn btn-ghost w-full mt-3" id="btn-back">← Back</button>
      </div>
    `,document.getElementById("btn-back").addEventListener("click",()=>{this.state=u(),this.renderDashboard()})}}const G=new C;G.init();
