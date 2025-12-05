
/* app_mod.js - enhancements: nav toggle, timer, AR capture, mood, XP, tasks scheduling, feed */
document.addEventListener('DOMContentLoaded', ()=>{
  // ---- NAV: create top hamburger that reveals nav links (move from bottom) ----
  function ensureTopNav(){
    let top = document.querySelector('.top-nav');
    if(top) return;
    top = document.createElement('div');
    top.className = 'top-nav';
    top.innerHTML = `
      <button id="menu-toggle" class="menu-btn" aria-label="Menu">☰</button>
      <div id="top-links" class="top-links" aria-hidden="true">
        <a href="home.html">Home</a>
        <a href="focus-timer.html">Focus Timer</a>
        <a href="tasks.html">Tasks</a>
        <a href="mood-tracker.html">Mood</a>
        <a href="community.html">Feed</a>
      </div>
    `;
    document.body.insertBefore(top, document.body.firstChild);
    const toggle = document.getElementById('menu-toggle');
    const links = document.getElementById('top-links');
    toggle.addEventListener('click', ()=>{
      const hidden = links.getAttribute('aria-hidden') === 'true';
      links.setAttribute('aria-hidden', String(!hidden));
      links.style.display = hidden ? 'flex' : 'none';
    });
    // collapse bottom nav if present
    const bottom = document.querySelector('.app-nav, .bottom-nav');
    if(bottom) bottom.style.display = 'none';
  }
  ensureTopNav();

  // ---- Basic storage helpers ----
  function read(key, def){ return JSON.parse(localStorage.getItem(key) || JSON.stringify(def)); }
  function write(key, val){ localStorage.setItem(key, JSON.stringify(val)); }

  // ---- XP & Realms ----
  const DEFAULT_REALMS = [
    {id:'wisdom', title:'Wisdom XP', xp:0, level:1, color:'#A3E4D7'},
    {id:'strength', title:'Strength XP', xp:0, level:1, color:'#FFD59E'},
    {id:'spirit', title:'Spirit XP', xp:0, level:1, color:'#D6C9FF'}
  ];
  let realms = read('stm_realms', DEFAULT_REALMS);
  function saveRealms(){ write('stm_realms', realms); renderXPOverview(); }
  // level curve
  function xpForLevel(l){ return 100 + (l-1)*50; }
  function addXPToRealm(id, amount){
    const r = realms.find(x=>x.id===id);
    if(!r) return;
    r.xp = (r.xp||0) + amount;
    // level-up while xp exceeds threshold
    while(r.xp >= xpForLevel(r.level)){
      r.xp -= xpForLevel(r.level);
      r.level += 1;
    }
    saveRealms();
  }
  function totalPlayerLevel(){
    return realms.reduce((s,r)=>s + (r.level||1), 0);
  }

  // Render XP Overview widget if container exists
  function renderXPOverview(){
    const el = document.getElementById('xp-overview');
    if(!el) return;
    el.innerHTML = '';
    realms.forEach(r=>{
      const container = document.createElement('div');
      container.className = 'xp-row';
      container.innerHTML = `
        <div class="xp-left"><span class="xp-emoji">${r.id==='wisdom'?'🧠': r.id==='strength'?'⚡':'💗'}</span>
        <div><div class="xp-title">${r.title}</div><div class="xp-sub">${r.xp}/${xpForLevel(r.level)}</div></div></div>
        <div class="xp-right"><div class="xp-level">Level ${r.level}</div></div>
        <div class="xp-bar-wrap"><div class="xp-bar" style="width:${Math.min(100, Math.round((r.xp/xpForLevel(r.level))*100))}%; background:${r.color};"></div></div>
      `;
      el.appendChild(container);
    });
    // totals
    const totals = document.createElement('div');
    totals.className='xp-totals';
    totals.innerHTML = `<div class="total-level">Total Player Level: Lv.${totalPlayerLevel()}</div>`;
    el.appendChild(totals);
  }
  renderXPOverview();

  // ---- Feed (photo proof) ----
  function renderFeed(){
    const feed = read('stm_feed', []);
    const el = document.getElementById('feed-list');
    if(!el) return;
    el.innerHTML = feed.map(item=>`<div class="feed-item"><img src="${item.img}" alt="proof"><div class="feed-caption">${item.caption||''}</div></div>`).join('');
  }
  renderFeed();

  // ---- Task system (add logical flow, schedule, ringtone) ----
  let tasks = read('stm_tasks', []);
  function saveTasks(){ write('stm_tasks', tasks); renderTaskList(); scheduleAllNotifications(); }
  function renderTaskList(){
    const list = document.getElementById('task-list');
    if(!list) return;
    list.innerHTML = tasks.map(t=>`
      <div class="task-row" data-id="${t.id}">
        <div class="task-left"><strong>${t.title}</strong><div class="small">Realm: ${t.realm} ${t.proof? '· Proof required' : ''}</div></div>
        <div class="task-right">${t.time?('<div class="small">At '+t.time+'</div>') : ''}<button class="btn-start" data-id="${t.id}">Start</button></div>
      </div>
    `).join('');
    // attach start handlers
    list.querySelectorAll('.btn-start').forEach(b=> b.addEventListener('click', (ev)=>{
      const id = b.getAttribute('data-id');
      startTaskById(id);
    }));
  }
  function addTask(task){
    task.id = 't_'+Date.now();
    tasks.push(task);
    saveTasks();
  }
  // Improve add-task form behavior if present
  const atAddForm = document.getElementById('add-task-form');
  if(atAddForm){
    atAddForm.addEventListener('submit', (ev)=>{
      ev.preventDefault();
      const fd = new FormData(atAddForm);
      const title = fd.get('title')||'Untitled';
      const realm = fd.get('realm')||'wisdom';
      const time = fd.get('time')||'';
      const proof = fd.get('proof') === 'on';
      addTask({title, realm, time, proof, created:Date.now()});
      atAddForm.reset();
      alert('Task added');
    });
  }
  renderTaskList();

  // Task start integrates with focus timer: sets current task and opens focus page
  function startTaskById(id){
    const t = tasks.find(x=>x.id===id);
    if(!t) return alert('Task not found');
    localStorage.setItem('stm_current_task', JSON.stringify(t));
    localStorage.setItem('stm_task_locked', '1');
    window.location.href = 'focus-timer.html';
  }

  // Notification scheduling for tasks with time (HH:MM)
  let notificationAudio = null;
  try{
    notificationAudio = new Audio('js/ringtone.mp3');
  }catch(e){ notificationAudio = null; }
  function scheduleNotificationForTask(task){
    if(!task.time) return;
    // parse HH:MM from task.time; schedule next occurrence today or tomorrow
    const parts = task.time.split(':').map(x=>Number(x));
    if(parts.length<2) return;
    const now = new Date();
    const target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), parts[0], parts[1], 0, 0);
    if(target < now) target.setDate(target.getDate()+1);
    const diff = target - now;
    setTimeout(()=>{
      // show notification (if permitted)
      if(window.Notification && Notification.permission === 'granted'){
        const n = new Notification('Task Reminder', {body: task.title, icon: ''});
      } else {
        alert('Task Reminder: ' + task.title);
      }
      if(notificationAudio) notificationAudio.play().catch(()=>{});
      // reschedule for next day
      scheduleNotificationForTask(task);
    }, diff);
  }
  function scheduleAllNotifications(){
    tasks.forEach(scheduleNotificationForTask);
  }
  // request permission if needed
  if(window.Notification && Notification.permission !== 'granted') {
    Notification.requestPermission();
  }
  scheduleAllNotifications();

  // ---- Focus timer enhancements: moving visual, AR camera accessible while locked, motivational quotes ----
  const focusPage = document.querySelector('[aria-label="Focus Timer"], .focus-page');
  if(focusPage){
    // create timer UI if missing
    const timerDisplay = document.getElementById('timer-display') || document.createElement('div');
    timerDisplay.id = 'timer-display';
    if(!document.getElementById('timer-display')){
      timerDisplay.className='timer-display';
      focusPage.querySelector('.safe')?.appendChild(timerDisplay);
    }
    // attach progress and controls if missing
    const controlsWrap = document.getElementById('timer-controls') || document.createElement('div');
    controlsWrap.id='timer-controls';
    controlsWrap.className='timer-controls';
    if(!document.getElementById('timer-controls')){
      controlsWrap.innerHTML = `
        <div id="timer-progress-wrap"><div id="timer-progress-bar"></div></div>
        <div class="controls-row"><button id="ft-start">Start</button><button id="ft-pause">Pause</button><button id="ft-finish">Finish Task</button><button id="ft-ar">📸 AR Photo</button></div>
        <div class="ft-info">XP: <span id="xp-display">0</span> · Level: <span id="level-display">1</span></div>
      `;
      focusPage.querySelector('.safe')?.appendChild(controlsWrap);
    }
    // timer state
    let total = Number(localStorage.getItem('stm_total_seconds')||1500); // default 25m
    let remaining = Number(localStorage.getItem('stm_timer_remaining')|| total);
    let running = false;
    let timerInt = null;
    const quotes = ["Keep going — you got this!","Small steps win the day.","Focus for now, celebrate later.","Breathe, then begin."];
    function formatTime(s){ const m=Math.floor(s/60); const sec=s%60; return String(m).padStart(2,'0')+":"+String(sec).padStart(2,'0'); }
    function renderTimerUI(){
      document.getElementById('timer-display').textContent = formatTime(remaining);
      const perc = Math.round((1 - remaining/total) * 100);
      document.getElementById('timer-progress-bar').style.width = perc + '%';
      document.getElementById('xp-display').textContent = realms.reduce((s,r)=>s + (r.xp||0), 0);
      document.getElementById('level-display').textContent = totalPlayerLevel();
    }
    renderTimerUI();
    function tick(){
      if(remaining>0){
        remaining -= 1;
        localStorage.setItem('stm_timer_remaining', remaining);
        renderTimerUI();
        // flash motivational quote occasionally
        if(Math.random() < 0.02){
          showMotivation(quotes[Math.floor(Math.random()*quotes.length)]);
        }
      } else {
        // complete
        clearInterval(timerInt); running=false; localStorage.removeItem('stm_timer_remaining');
        // award XP to realm of current task or default wisdom
        const ct = JSON.parse(localStorage.getItem('stm_current_task')||'{}');
        const realmId = (ct.realm) || 'wisdom';
        // base xp 20 for full session
        const base = 20;
        addXPToRealm(realmId, base);
        renderTimerUI();
        alert('Focus session complete! +' + base + ' XP to ' + realmId);
        // stop lock
        localStorage.removeItem('stm_task_locked');
        localStorage.removeItem('stm_current_task');
      }
    }
    document.getElementById('ft-start').addEventListener('click', ()=>{
      if(running) return;
      running=true;
      timerInt = setInterval(tick, 1000);
    });
    document.getElementById('ft-pause').addEventListener('click', ()=>{
      if(timerInt){ clearInterval(timerInt); timerInt=null; running=false; }
    });
    document.getElementById('ft-finish').addEventListener('click', ()=>{
      // finish early: award proportional XP
      const elapsed = total - remaining;
      const ratio = Math.max(0, Math.min(1, elapsed/total));
      const gained = Math.round(20 * ratio);
      const ct = JSON.parse(localStorage.getItem('stm_current_task')||'{}');
      const realmId = ct.realm || 'wisdom';
      addXPToRealm(realmId, gained);
      renderTimerUI();
      alert('Task finished! +' + gained + ' XP to ' + realmId);
      // stop and unlock
      if(timerInt) clearInterval(timerInt);
      running=false;
      remaining = total;
      localStorage.removeItem('stm_task_locked');
      localStorage.removeItem('stm_current_task');
      renderTimerUI();
    });

    // AR camera modal available even if locked
    const arBtn = document.getElementById('ft-ar');
    if(arBtn){
      arBtn.addEventListener('click', async ()=>{
        openARModal();
      });
    }
    // motivational overlay
    function showMotivation(text){
      let box = document.getElementById('motivation-box');
      if(!box){
        box = document.createElement('div'); box.id='motivation-box';
        document.body.appendChild(box);
      }
      box.textContent = text;
      box.classList.add('show');
      setTimeout(()=> box.classList.remove('show'), 2500);
    }

    // if there's a lock, ensure overlay shows but AR button still active
    const locked = localStorage.getItem('stm_task_locked') === '1';
    if(locked){
      // show small lock banner but allow AR and finish
      let lockBanner = document.getElementById('focus-lock-banner');
      if(!lockBanner){
        lockBanner = document.createElement('div'); lockBanner.id='focus-lock-banner';
        lockBanner.innerHTML = `<div class="lock-inner">Task in progress <button id="lock-finish">Finish</button></div>`;
        document.body.appendChild(lockBanner);
        document.getElementById('lock-finish').addEventListener('click', ()=>{
          document.getElementById('ft-finish').click();
          lockBanner.remove();
        });
      }
    }

  } // end focusPage

  // ---- AR modal & capture ----
  function openARModal(){
    let modal = document.getElementById('ar-modal');
    if(modal){ modal.style.display='flex'; return; }
    modal = document.createElement('div'); modal.id='ar-modal'; modal.className='ar-modal';
    modal.innerHTML = `<div class="ar-inner"><video id="ar-video" autoplay playsinline></video><canvas id="ar-canvas"></canvas><div class="ar-controls"><button id="ar-capture-btn">Capture</button><button id="ar-close-btn">Close</button></div></div>`;
    document.body.appendChild(modal);
    const video = document.getElementById('ar-video');
    const canvas = document.getElementById('ar-canvas');
    let stream = null;
    async function startCamera(){
      try{
        stream = await navigator.mediaDevices.getUserMedia({video:true,audio:false});
        video.srcObject = stream;
      }catch(e){
        alert('Camera unavailable.');
      }
    }
    startCamera();
    document.getElementById('ar-close-btn').addEventListener('click', ()=>{
      modal.style.display='none';
      if(stream) stream.getTracks().forEach(t=>t.stop());
    });
    document.getElementById('ar-capture-btn').addEventListener('click', ()=>{
      canvas.width = video.videoWidth; canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video,0,0);
      // simple overlay - star
      ctx.font = '64px serif'; ctx.fillText('✨', canvas.width-100, 80);
      const data = canvas.toDataURL('image/png');
      // save to feed
      const feed = read('stm_feed', []);
      const ct = JSON.parse(localStorage.getItem('stm_current_task')||'{}');
      feed.unshift({img:data, caption: (ct.title? ct.title + ' — Proof' : 'Task proof'), ts: Date.now()});
      write('stm_feed', feed);
      renderFeed();
      alert('Captured and saved to feed.');
      modal.style.display='none';
      if(stream) stream.getTracks().forEach(t=>t.stop());
    });
  }

  // ---- Mood tracker: improved styling interactions ----
  const moodBtns = document.querySelectorAll('.mood-btn');
  if(moodBtns.length){
    moodBtns.forEach(b=>{
      b.addEventListener('click', ()=>{
        moodBtns.forEach(x=>x.classList.remove('selected'));
        b.classList.add('selected');
        localStorage.setItem('stm_selected_mood', b.dataset.mood);
      });
    });
  }
  const saveMood = document.getElementById('save-mood');
  if(saveMood){
    saveMood.addEventListener('click', ()=>{
      const mood = localStorage.getItem('stm_selected_mood') || 'neutral';
      const hist = read('stm_mood_history', []);
      hist.unshift({mood, ts: Date.now()});
      write('stm_mood_history', hist);
      // small XP boost
      addXPToRealm('spirit', mood==='happy'||mood==='excited'?5:2);
      alert('Mood saved.');
      renderXPOverview();
    });
  }

  // Expose some functions to console for testing
  window.stm = {addTask, tasks, realms, addXPToRealm, renderXPOverview, renderFeed, startTaskById};
}); // DOMContentLoaded
