'use strict';
(() => {
 const desktop=matchMedia('(min-width:768px)'),reduced=matchMedia('(prefers-reduced-motion:reduce)');
 const saved=document.querySelector('#saved'),room=document.querySelector('#next');
 if(!saved||!room)return;
 let targetId=null,forward=false,back=false,running=false;
 const card=()=>[...saved.querySelectorAll('.saved-card')].find(el=>el.dataset.savedId===targetId);
 const rect=canvas=>{
  const r=canvas.getBoundingClientRect(),s=Math.min(r.width/canvas.width,r.height/canvas.height),width=canvas.width*s,height=canvas.height*s;
  return {left:r.left+(r.width-width)/2,top:r.top+(r.height-height)/2,width,height};
 };
 function canRun(from,to){return desktop.matches&&!reduced.matches&&!running&&!!card()&&((from===3&&to===2&&forward)||(from===2&&to===3&&back));}
 async function play(from,to,activate){
  if(!canRun(from,to))return false;
  running=true;forward=back=false;
  const returning=from===2,sourceCard=card(),portrait=sourceCard.querySelector('.saved-portrait'),savedCanvas=portrait.querySelector('canvas');
  const selected=room.querySelector('.fitting-person.is-selected'),fittingCanvas=selected?.querySelector('canvas');
  if(!fittingCanvas){running=false;await activate();return true;}
  let fly,activated=false,cancelled=false;const animations=[],concealed=new Map();
  const hide=el=>{if(!concealed.has(el))concealed.set(el,el.style.visibility);el.style.visibility='hidden';};
  const show=el=>{if(concealed.has(el)){el.style.visibility=concealed.get(el);concealed.delete(el);}};
  const switchScreen=async()=>{if(activated)return;activated=true;await activate();};
  const stop=()=>{cancelled=true;animations.forEach(a=>a.cancel());};
  const key=event=>{if(event.key==='Escape'){event.preventDefault();event.stopImmediatePropagation();stop();}};
  const animate=async(el,frames,duration,easing='cubic-bezier(.4,0,.2,1)',delay=0)=>{
   if(cancelled)return;const a=el.animate(frames,{duration,easing,delay,fill:'both'});animations.push(a);await a.finished.catch(()=>{});
  };
  const phase=value=>document.body.dataset.savedFlight=value;
  const elements=[room.querySelector('.look-switcher'),room.querySelector('.fitting-rail')];
  const extras=[room.querySelector('#add-model'),room.querySelector('.fitting-undo'),...room.querySelectorAll('.fitting-person:not(.is-selected)')].filter(Boolean);
  async function controls(reverse){
   const stage=room.querySelector('.fitting-stage').getBoundingClientRect(),cx=stage.x+stage.width/2,cy=stage.y+stage.height/2;
   await Promise.all([
    ...elements.map((el,i)=>{const r=el.getBoundingClientRect(),small={opacity:0,transform:`translate(${cx-r.x-r.width/2}px,${cy-r.y-r.height/2}px) scale(.12)`},full={opacity:1,transform:'translate(0,0) scale(1)'};show(el);return animate(el,reverse?[full,small]:[small,full],650,'cubic-bezier(.76,0,.24,1)',reverse?(1-i)*80:i*80);}),
    ...extras.map(el=>{const opacity=getComputedStyle(el).opacity;show(el);return animate(el,reverse?[{opacity},{opacity:0}]:[{opacity:0},{opacity}],250);})
   ]);
  }
  function snapshot(canvas,start){
   fly=document.createElement('canvas');fly.width=canvas.width;fly.height=canvas.height;fly.className='saved-model-flight';fly.setAttribute('aria-hidden','true');
   fly.getContext('2d').drawImage(canvas,0,0);Object.assign(fly.style,Object.fromEntries(Object.entries(start).map(([name,value])=>[name,`${value}px`])));document.body.append(fly);
  }
  const flight=async(start,end)=>animate(fly,[start,end].map(r=>Object.fromEntries(Object.entries(r).map(([name,value])=>[name,`${value}px`]))),900);
  document.body.classList.add('saved-model-handoff');
  window.addEventListener('resize',stop);window.addEventListener('keydown',key,true);
  try{
   // Both screens retain their layout, so the actual portrait rectangles can be measured.
   if(returning){
    const r=sourceCard.getBoundingClientRect(),clearance=parseFloat(getComputedStyle(saved).paddingTop);
    if(r.bottom<=clearance||r.top>=innerHeight)saved.scrollTop=Math.max(0,sourceCard.offsetTop-clearance);
    phase('collapse');await controls(true);if(cancelled)return true;
    window.FitloopFitting.capture();const start=rect(fittingCanvas);snapshot(fittingCanvas,start);hide(selected);hide(portrait);
    phase('return-flight');await flight(start,rect(savedCanvas));if(cancelled)return true;
    await switchScreen();phase('restore-collection');
    await animate(saved,[{opacity:0},{opacity:1}],320);show(portrait);fly.remove();fly=null;
   }else{
    [...elements,...extras,selected].forEach(hide);
    const start=rect(savedCanvas);snapshot(savedCanvas,start);hide(portrait);
    phase('clear-collection');await animate(saved,[{opacity:1},{opacity:0}],320);if(cancelled)return true;
    await switchScreen();window.FitloopFitting.capture();
    phase('to-fitting');await flight(start,rect(fittingCanvas));if(cancelled)return true;
    // Swap the single flying portrait for the real selected canvas at the identical rectangle.
    show(selected);fly.remove();fly=null;phase('reveal-controls');await controls(false);
   }
   return true;
  }finally{
   await switchScreen();animations.forEach(a=>a.cancel());concealed.forEach((visibility,el)=>el.style.visibility=visibility);fly?.remove();
   window.removeEventListener('resize',stop);window.removeEventListener('keydown',key,true);
   document.body.classList.remove('saved-model-handoff');delete document.body.dataset.savedFlight;running=false;
  }
 }
 async function browse(activate){
  if(!desktop.matches||reduced.matches){await activate();return;}
  const animations=[],grid=saved.querySelector('.saved-grid'),label=document.querySelector('.saved-nav-label');
  let switched=false;
  const animate=(el,frames,duration,delay=0)=>{
   if(!el)return Promise.resolve();const animation=el.animate(frames,{duration,delay,easing:'cubic-bezier(.22,1,.36,1)',fill:'both'});
   animations.push(animation);return animation.finished.catch(()=>{});
  };
  document.body.classList.add('saved-collection-transition');
  try{
   // Clear the fitting room before the collection enters; keep its state for returning.
   const enter=grid.animate([{opacity:0,transform:'translateY(16px)'},{opacity:0,transform:'translateY(16px)'}],{duration:1,fill:'both'});animations.push(enter);
   await animate(room,[{opacity:1},{opacity:0}],300);
   await window.FitloopSaved?.preparePreview();
   await activate();switched=true;
   enter.cancel();
   await Promise.all([
    animate(grid,[{opacity:0,transform:'translateY(16px)'},{opacity:1,transform:'translateY(0)'}],750),
    animate(label,[{opacity:0},{opacity:1}],450,80)
   ]);
  }finally{
   if(!switched)await activate();
   animations.forEach(animation=>animation.cancel());document.body.classList.remove('saved-collection-transition');
  }
 }
 window.FitloopSavedTransition={
  remember(el){targetId=el.dataset.savedId;forward=true;back=false;},
  cancelPending(){forward=false;},
  requestBack(){if(desktop.matches&&targetId)back=true;},
  canRun,play,browse
 };
})();
