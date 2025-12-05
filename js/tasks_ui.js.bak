
(function(){
  function read(k,d){ return JSON.parse(localStorage.getItem(k) || JSON.stringify(d)); }
  function write(k,v){ localStorage.setItem(k, JSON.stringify(v)); }
  function renderList(id, items){
    const container = document.getElementById(id);
    if(!container) return;
    container.innerHTML='';
    items.forEach(t=>{
      const div=document.createElement('div'); div.className='task-item'; div.style.padding='10px'; div.style.marginBottom='8px'; div.style.border='1px solid #eee'; div.style.borderRadius='8px'; div.style.cursor='pointer';
      div.innerHTML = '<div style="font-weight:700">'+t.title+'</div><div class="small">'+(t.date? t.date + ' ' + (t.time||'') : '')+'</div>';
      div.addEventListener('click', ()=>{
        if(confirm('Start this mission?')){
          localStorage.setItem('stm_current_task', JSON.stringify(t));
          localStorage.setItem('stm_task_locked','1');
          window.location.href='focus-timer.html';
        }
      });
      container.appendChild(div);
    });
  }
  document.addEventListener('DOMContentLoaded', ()=>{
    try{ var s=document.createElement('script'); s.src='js/generate_quests.js'; document.body.appendChild(s);}catch(e){}
    const daily = read('stm_daily', []); const main=read('stm_main', []); const side=read('stm_side', []);
    renderList('daily-list', daily); renderList('main-list', main); renderList('side-list', side);
    // render user tasks
    const tasks = read('stm_tasks', []);
    renderList('task-list', tasks);
  });
})();
