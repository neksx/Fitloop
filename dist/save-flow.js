'use strict';
(() => {
 let running=false;
 const reduced=matchMedia('(prefers-reduced-motion:reduce)');
 function copyScreen(source){const clone=source.cloneNode(true);const originals=source.querySelectorAll('canvas');clone.querySelectorAll('canvas').forEach((canvas,i)=>{canvas.getContext('2d')?.drawImage(originals[i],0,0);});clone.inert=true;clone.setAttribute('aria-hidden','true');return clone;}
 function copyPortrait(source){const canvas=document.createElement('canvas');canvas.width=source.width;canvas.height=source.height;canvas.getContext('2d').drawImage(source,0,0,canvas.width,canvas.height);return canvas;}
 async function play(look){
  if(running)return;running=true;hideOffer();
  const source=document.querySelector('#next'),nav=document.querySelector('.ct_cr-navbar'),menu=document.querySelector('#fitloop-menu'),main=document.querySelector('#main'),focus=source.querySelector('.fitting-person.is-selected');
  const inertState=[main,nav,menu].map(el=>[el,el.inert]);let overlay,viewport,animations=[],cancelled=false,showChoices=true;
  const animate=async(el,frames,duration,easing='cubic-bezier(.22,1,.36,1)')=>{if(cancelled)return;const a=el.animate(frames,{duration,easing,fill:'forwards'});animations.push(a);await a.finished.catch(()=>{});};
  const stop=()=>{cancelled=true;animations.forEach(a=>a.cancel());};
  const key=event=>{if(event.key==='Escape'){event.preventDefault();event.stopImmediatePropagation();showChoices=false;stop();}};
  document.body.classList.add('save-flow-running');inertState.forEach(([el])=>el.inert=true);window.addEventListener('keydown',key,true);window.addEventListener('resize',stop);
  try{
   await window.FitloopFitting.prepareSave();if(cancelled||reduced.matches)return;
   window.FitloopFitting.capture();
   const w=innerWidth,h=innerHeight;
   overlay=document.createElement('div');overlay.className='save-flow';overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-label',`Saving ${look.name}`);overlay.tabIndex=-1;
   const stage=document.createElement('div');stage.className='save-flow-stage';stage.style.width=`${w}px`;stage.style.height=`${h}px`;viewport=document.createElement('div');viewport.className='save-flow-viewport';viewport.dataset.phase='shrink';viewport.style.width=`${w}px`;viewport.style.height=`${h}px`;stage.append(viewport);overlay.append(stage);
   const first=copyScreen(source),navbar=copyScreen(nav),menuCopy=copyScreen(menu);menuCopy.classList.remove('is-visible');navbar.inert=true;
   viewport.append(first,menuCopy,navbar);const corners=document.createElement('span');corners.className='fitting-corners save-flow-corners';corners.innerHTML='<i></i><i></i><i></i><i></i>';viewport.append(corners);
   const skip=document.createElement('button');skip.className='save-flow-skip';skip.textContent='SKIP';skip.onclick=stop;overlay.append(skip);
   document.body.append(overlay);const nodes=source.querySelectorAll('*'),copies=first.querySelectorAll('*');nodes.forEach((node,i)=>{if(node.scrollTop){copies[i].style.scrollSnapType='none';copies[i].scrollTop=node.scrollTop;}if(node.scrollLeft)copies[i].scrollLeft=node.scrollLeft;});overlay.focus({preventScroll:true});
   const rectLocal=el=>{const r=el.getBoundingClientRect(),v=viewport.getBoundingClientRect(),s=v.width/w;return {x:(r.left-v.left)/s+r.width/s/2,y:(r.top-v.top)/s+r.height/s/2};};
   // Measure both portraits in this viewport before scaling the camera.
   const clonedPortrait=first.querySelector('.fitting-person.is-selected'),portraitRect=clonedPortrait.getBoundingClientRect(),viewportRect=viewport.getBoundingClientRect(),viewportScale=viewportRect.width/w;
   const rect={x:(portraitRect.left-viewportRect.left)/viewportScale,y:(portraitRect.top-viewportRect.top)/viewportScale,width:portraitRect.width/viewportScale,height:portraitRect.height/viewportScale};
   const fly=copyPortrait(clonedPortrait.querySelector('canvas'));fly.className='save-flow-fly';Object.assign(fly.style,{left:`${rect.x}px`,top:`${rect.y}px`,width:`${rect.width}px`,height:`${rect.height}px`,visibility:'hidden'});viewport.append(fly);
   await animate(stage,[{transform:'translate(-50%,-50%) scale(1)'},{transform:'translate(-50%,-50%) scale(.7)'}],650);
   if(cancelled)return;
   // Swap at the same local rectangle; the model starts in the third section.
   clonedPortrait.style.visibility='hidden';fly.style.visibility='visible';viewport.dataset.phase='to-menu';
   let point={x:rect.x+rect.width/2,y:rect.y+rect.height/2,scale:1};
   async function flight(to,duration,scale,lift){const from=point,frames=[];for(let i=0;i<=60;i++){const t=i/60,u=1-t;const x=u*u*u*from.x+3*u*u*t*(from.x+(to.x-from.x)*.18)+3*u*t*t*(to.x-(to.x-from.x)*.2)+t*t*t*to.x;const y=u*u*u*from.y+3*u*u*t*(from.y-lift)+3*u*t*t*(to.y-lift*.3)+t*t*t*to.y;frames.push({transform:`translate(${x-(rect.x+rect.width/2)}px,${y-(rect.y+rect.height/2)}px) scale(${from.scale+(scale-from.scale)*t})`});}await animate(fly,frames,duration,'cubic-bezier(.45,0,.18,1)');point={...to,scale};}
   const targetMenu=navbar.querySelector('#menu-toggle');await flight(rectLocal(targetMenu),950,.065,h*.24);if(cancelled)return;
   viewport.dataset.phase='menu';viewport.classList.add('menu-is-open');menuCopy.classList.add('is-visible');navbar.querySelectorAll('.ct_cr-menu__shopCollection').forEach(el=>{el.classList.add('is-visible');el.removeAttribute('aria-hidden');});targetMenu.classList.add('is-active');
   await animate(menuCopy,[{opacity:0},{opacity:1}],220,'ease-out');if(cancelled)return;
   const destination=navbar.querySelector('#nav-saved-looks');await flight(rectLocal(destination),850,.065,h*.08);if(cancelled)return;
   await animate(fly,[{opacity:1},{opacity:0}],150);if(cancelled)return;
   await window.FitloopSaved.preparePreview();if(cancelled)return;
   first.style.display='none';fly.remove();viewport.dataset.phase='choice';viewport.classList.remove('menu-is-open');menuCopy.classList.remove('is-visible');menuCopy.style.visibility='hidden';navbar.querySelectorAll('.ct_cr-menu__shopCollection').forEach(el=>el.classList.remove('is-visible'));targetMenu.classList.remove('is-active');
   animations.filter(a=>a.effect?.target===menuCopy).forEach(a=>a.cancel());
   await animate(stage,[{transform:'translate(-50%,-50%) scale(.7)'},{transform:'translate(-50%,-50%) scale(1)'}],650);

  }catch(error){console.error('Save preview unavailable',error);}
  finally{
   animations.forEach(a=>a.cancel());document.body.classList.remove('save-flow-running');inertState.forEach(([el,inert])=>el.inert=inert);window.removeEventListener('keydown',key,true);window.removeEventListener('resize',stop);
   const choice=showChoices&&source.classList.contains('is-active')?showDecision():null;
   overlay?.remove();
   try{if(choice)await choice;else if(focus?.isConnected)requestAnimationFrame(()=>focus.focus({preventScroll:true}));}finally{running=false;}
  }
 }

 const room=document.querySelector('#next'),offer=document.createElement('p');
 offer.className='fitting-save-offer';offer.inert=true;offer.setAttribute('aria-hidden','true');
 offer.innerHTML='<span>Your look is ready.</span><button type="button">SAVE</button><span class="fitting-save-offer-time" aria-hidden="true">10 sec</span>';
 room.append(offer);
 let offerTimer=0,offerVersion=0,offeredId=null,offerDeadline=0;
 function hideOffer(){offerVersion++;clearInterval(offerTimer);offerTimer=0;offeredId=null;offer.inert=true;offer.classList.remove('is-visible');offer.setAttribute('aria-hidden','true');}
 function offerLook(id){
  const version=++offerVersion;
  requestAnimationFrame(()=>{
   if(version!==offerVersion)return;
   const state=window.FitloopFitting.saveState();
   if(running||!state.available||state.id!==id||!room.classList.contains('is-active')||!room.classList.contains('fitting-arrived')||(room.classList.contains('fitting-panel-open')&&(matchMedia('(max-width:767px)').matches||state.panelMode!=='look'))||room.classList.contains('fitting-leaving'))return;
   clearInterval(offerTimer);offeredId=id;offerDeadline=Date.now()+10000;
   const tick=()=>{const seconds=Math.ceil((offerDeadline-Date.now())/1000);if(seconds<=0){hideOffer();return;}offer.querySelector('.fitting-save-offer-time').textContent=`${seconds} sec`;};
   tick();offer.inert=false;offer.setAttribute('aria-hidden','false');offer.classList.add('is-visible');offerTimer=setInterval(tick,200);
  });
 }
 offer.querySelector('button').addEventListener('click',()=>{
  const state=window.FitloopFitting.saveState();if(!state.available||state.id!==offeredId){hideOffer();return;}
  hideOffer();window.FitloopFitting.saveCurrent();
 });
 document.addEventListener('fitloop-screen',event=>{if(event.detail.index!==2)hideOffer();});
 window.addEventListener('pagehide',hideOffer);

 async function showDecision(){
  const main=document.querySelector('#main'),wasInert=main.inert,focus=room.querySelector('.fitting-person.is-selected'),layer=document.createElement('section');
  layer.className='save-decision';layer.setAttribute('aria-label','Look saved');
  const arrow='<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12.5 3.5 3.5 12.5M3.5 5.5v7h7"/></svg>';
  const corners='<span class="fitting-thin-corners" aria-hidden="true"><i></i><i></i><i></i><i></i></span>';
  layer.innerHTML=`<div class="save-decision-actions" role="group" aria-label="After saving"><button type="button" class="saved-export-action save-decision-action" data-save-choice="saved">${corners}<span class="saved-export-content"><span class="save-decision-forward">${arrow}</span><span>My saved looks</span></span></button><button type="button" class="saved-export-action save-decision-action" data-save-choice="back">${corners}<span class="saved-export-content">${arrow}<span>Back</span></span></button></div>`;
  main.inert=true;document.body.classList.add('save-choice-open');document.body.append(layer);
  const actions=layer.querySelector('.save-decision-actions');
  if(!reduced.matches)actions.animate([{opacity:0,transform:'translate(-50%,calc(-50% + 10px))'},{opacity:1,transform:'translate(-50%,-50%)'}],{duration:420,easing:'cubic-bezier(.22,1,.36,1)'});
  layer.querySelector('button').focus({preventScroll:true});
  let closing=false;
  return new Promise(resolve=>{
   const finish=async action=>{
    if(closing)return;closing=true;layer.querySelectorAll('button').forEach(button=>button.disabled=true);
    try{
     if(action==='saved'){
      main.inert=wasInert;
      await new Promise(arrived=>{let timeout;const done=()=>{clearTimeout(timeout);document.removeEventListener('fitloop-screen',onSaved);arrived();},onSaved=event=>{if(event.detail.index===3)done();};document.addEventListener('fitloop-screen',onSaved);timeout=setTimeout(done,2500);location.hash='saved';});
     }
     if(!reduced.matches){const fade=layer.animate([{opacity:1},{opacity:0}],{duration:360,easing:'cubic-bezier(.4,0,.2,1)',fill:'forwards'});await fade.finished.catch(()=>{});}
    }finally{
     layer.remove();document.body.classList.remove('save-choice-open');main.inert=wasInert;document.removeEventListener('fitloop-screen',onScreen);document.removeEventListener('click',onLink);window.removeEventListener('keydown',onKey,true);
     if(action==='back'&&focus?.isConnected)focus.focus({preventScroll:true});resolve(action);
    }
   };
   const onScreen=event=>{if(event.detail.index!==2&&!closing)finish('navigation');};
   const onLink=event=>{const a=event.target.closest('a');if(a?.getAttribute('href')==='#next')finish('back');};
   const onKey=event=>{if(event.key==='Escape'&&!document.body.classList.contains('menu-is-open')){event.preventDefault();event.stopImmediatePropagation();finish('back');}};
   layer.addEventListener('click',event=>{const button=event.target.closest('[data-save-choice]');if(button)finish(button.dataset.saveChoice);});
   document.addEventListener('fitloop-screen',onScreen);document.addEventListener('click',onLink);window.addEventListener('keydown',onKey,true);
  });
 }

 window.FitloopSaveFlow={play,offer:offerLook,hideOffer};
})();
