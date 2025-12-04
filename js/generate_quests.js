
(function(){
  function read(k,d){ return JSON.parse(localStorage.getItem(k) || JSON.stringify(d)); }
  function write(k,v){ localStorage.setItem(k, JSON.stringify(v)); }
  const today = new Date().toISOString().slice(0,10);
  if(localStorage.getItem('stm_quests_date')===today) return;
  const dailyPool = ['Stretch for 5 mins','Drink water','Read 1 page','Take a 5-min walk','Tidy desk','Meditate 5 mins'];
  const mainPool = ['Study 30 minutes','Exercise 20 minutes','Organize your space','Complete a lesson','Work on project'];
  const sidePool = ['Cook a healthy meal','Finish a creative task','Plan a week','Clean one drawer','Try a new recipe'];
  function pick(pool,n){ const out=[]; const cp=pool.slice(); for(let i=0;i<n;i++){ if(cp.length===0) break; const idx=Math.floor(Math.random()*cp.length); out.push(cp.splice(idx,1)[0]); } return out; }
  const daily = pick(dailyPool,4).map((t,i)=>({id:'d_'+Date.now()+'_'+i,title:t,realm:'wisdom',date:today,time:'',proof:false}));
  const main = pick(mainPool,3).map((t,i)=>({id:'m_'+Date.now()+'_'+i,title:t,realm:'strength',date:today,time:'',proof:false}));
  const side = pick(sidePool,2).map((t,i)=>({id:'s_'+Date.now()+'_'+i,title:t,realm:'spirit',date:today,time:'',proof:false}));
  write('stm_daily', daily); write('stm_main', main); write('stm_side', side); localStorage.setItem('stm_quests_date', today);
})();
