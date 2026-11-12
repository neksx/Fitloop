'use strict';
(() => {
 const page=document.querySelector('#saved');if(!page)return;
 const grid=page.querySelector('.saved-grid'),status=page.querySelector('[role=status]'),key='fitloop-saved-looks-v1',reduced=matchMedia('(prefers-reduced-motion:reduce)');
 const desktopCursor=matchMedia('(min-width:768px) and (hover:hover) and (pointer:fine)');
 const cursorIcon='<svg class="saved-cursor" width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true" focusable="false"><path class="saved-cursor-corners" d="M8.5.5H.5V8.5M27.5.5H35.5V8.5M35.5 27.5V35.5H27.5M8.5 35.5H.5V27.5" stroke-width="1"/><path class="saved-cursor-arrow" d="M12.5 23.5 23.5 12.5M12.5 12.5H23.5V23.5" stroke-width="1.5"/></svg>';
 const exportArrow='<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12.5 3.5 3.5 12.5M3.5 5.5v7h7"/></svg>';
 const exportIcons={copy:'<path d="M4 3V1.5h6.5V9H9M1.5 4H8v7H1.5z"/>',download:'<path d="M6 1v7m-3-3 3 3 3-3M1.5 9v2h9V9"/>'};
 const exportCheck='<svg class="saved-export-result" width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.15" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m1.5 6 3 3 6-6"/></svg>';
 const silhouettes=new WeakMap();let cursor=null,exporting=null;
 const exportBlobs=new Map(),closingExports=new Map();

 const corners=kind=>`<span class="${kind}" aria-hidden="true"><i></i><i></i><i></i><i></i></span>`;
 const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const fields=['name','identity','gender','height','weight','pants','jacket','acknowledged','reviewed','femaleIdentity','jacketSize','pantSize'];
 const valid=x=>x&&typeof x.name==='string'&&['original','woman','man'].includes(x.identity)&&(Number.isInteger(x.pants)&&x.pants>=0&&x.pants<window.FitloopState.bottomIds.length)&&['woman','man'].includes(x.gender);
 let items=[];try{const data=JSON.parse(localStorage.getItem(key)||'null');if(Array.isArray(data))items=data.filter(valid);}catch{}
 // Migrate the previously saved singleton without treating unsaved working models as saved looks.
 if(!localStorage.getItem(key)){try{const old=JSON.parse(localStorage.getItem('fitloop-fitting-jeans-v3')||'null');if(old&&typeof old.name==='string'&&(Number.isInteger(old.pants)&&old.pants>=0&&old.pants<window.FitloopState.bottomIds.length))items=[{id:crypto.randomUUID(),name:old.name,identity:'original',gender:'woman',height:172,weight:62,pants:old.pants,jacketSize:'M',pantSize:30}];}catch{}}
 const renderers=new Map(),surface=Object.assign(document.createElement('canvas'),{width:1536,height:2048}),portraitRenderer=new window.FitloopMotion.Motion(surface);let frame=0;
 function draw(item,moving){if(!portraitRenderer.draw(portraitKey(item),0,0,!moving,matchMedia('(min-width:768px)').matches?item:null,false))return;const ctx=renderers.get(item.id);if(ctx){ctx.clearRect(0,0,1536,2048);ctx.drawImage(surface,0,0);}}
 function persist(){localStorage.setItem(key,JSON.stringify(items));}
 function save(look){const id=look.savedId||crypto.randomUUID(),record={id,...Object.fromEntries(fields.map(field=>[field,look[field]]))},index=items.findIndex(x=>x.id===id);if(!valid(record))throw Error('Invalid saved look');const next=items.slice();if(index<0)next.push(record);else next[index]=record;localStorage.setItem(key,JSON.stringify(next));items=next;look.savedId=id;render();return id;}
 function render(){
  closeExport(true);clearCursor();renderers.clear();
  grid.innerHTML=items.map(item=>`<article class="saved-card" data-saved-id="${escape(item.id)}" aria-label="${escape(item.name)}">${corners('fitting-corners')}<header class="saved-card-header"><span class="saved-name">${escape(item.name)}${corners('fitting-thin-corners')}</span><div class="fitting-panel-actions"><button class="fitting-remove saved-export-toggle" aria-label="Export ${escape(item.name)}" data-saved-action="export" aria-expanded="false">${exportArrow}${corners('fitting-thin-corners')}</button><button class="fitting-remove saved-delete" aria-label="Delete ${escape(item.name)}" data-saved-action="delete">${document.querySelector('.fitting-remove svg').outerHTML}${corners('fitting-thin-corners')}</button></div></header><div class="saved-portrait" role="img" aria-label="${escape(item.name)} outfit"><canvas width="1536" height="2048"></canvas></div><div class="saved-export-options" role="group" aria-label="Export ${escape(item.name)} image" aria-hidden="true">${['copy','download'].map(action=>`<button type="button" class="saved-export-action" data-saved-action="${action}" aria-label="${action==='copy'?'Copy':'Download'} ${escape(item.name)} image">${corners('fitting-thin-corners')}<span class="saved-export-content"><svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.15" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${exportIcons[action]}</svg><span>${action==='copy'?'Copy':'Download'}</span></span>${exportCheck}</button>`).join('')}</div><button class="ct_cr-cta saved-view" data-saved-action="view" aria-label="View ${escape(item.name)}"><span class="saved-view-label">VIEW LOOK</span>${cursorIcon}</button></article>`).join('');
  grid.querySelectorAll('.saved-export-options').forEach(options=>options.inert=true);
  page.querySelector('.saved-empty').hidden=items.length>0;
  items.forEach(item=>{const canvas=grid.querySelector(`[data-saved-id="${CSS.escape(item.id)}"] canvas`);renderers.set(item.id,canvas.getContext('2d'));window.FitloopMotion.load(portraitKey(item)).then(()=>{draw(item,false);silhouettes.delete(canvas);}).catch(()=>{status.textContent='An outfit could not load. Please try again.';});});
 }
 const portraitKey=item=>window.FitloopMotion.portraitKey(item);
 function closeExport(immediate=false){
  const state=exporting;if(!state)return;exporting=null;clearTimeout(state.timer);
  const {card}=state;card.classList.remove('is-export-open');card.querySelector('.saved-export-toggle').setAttribute('aria-expanded','false');
  const options=card.querySelector('.saved-export-options');options.inert=true;options.setAttribute('aria-hidden','true');
  const finish=()=>{closingExports.delete(card);card.classList.remove('export-active');card.querySelectorAll('.saved-export-action').forEach(button=>{button.disabled=false;button.classList.remove('is-success','is-muted');button.removeAttribute('aria-busy');});if(state.restoreFocus&&card.isConnected&&page.classList.contains('is-active'))card.querySelector('.saved-export-toggle').focus({preventScroll:true});};
  if(immediate||reduced.matches)finish();else{state.timer=setTimeout(finish,650);closingExports.set(card,state.timer);}
 }
 function openExport(card){
  if(exporting?.busy)return;
  if(exporting?.card===card){exporting.restoreFocus=true;closeExport();return;}
  closeExport(true);clearCursor();clearTimeout(closingExports.get(card));closingExports.delete(card);
  const state=exporting={card,busy:false,timer:0,restoreFocus:false};
  // Finish any previous close on this card before starting its next opening.
  card.querySelectorAll('.saved-export-action').forEach(button=>{button.disabled=false;button.classList.remove('is-success','is-muted');button.removeAttribute('aria-busy');});
  card.classList.add('export-active');card.querySelector('.saved-export-toggle').setAttribute('aria-expanded','true');
  const options=card.querySelector('.saved-export-options');options.inert=false;options.setAttribute('aria-hidden','false');
  requestAnimationFrame(()=>{if(exporting===state)card.classList.add('is-export-open');});
 }
 function exportBlob(item){
  const desktop=matchMedia('(min-width:768px)').matches,id=JSON.stringify([desktop,...fields.map(field=>item[field])]);if(!exportBlobs.has(id)){
   if(!desktop&&!item.jacket&&item.pants<3){
    const promise=window.FitloopMotion.ready.then(data=>fetch(data.sets[portraitKey(item)].files[0])).then(response=>{if(!response.ok)throw Error('The image could not load.');return response.blob();});
    exportBlobs.set(id,promise);promise.catch(()=>exportBlobs.delete(id));return promise;
   }
   const promise=window.FitloopMotion.load(portraitKey(item)).then(()=>{
    draw(item,false);const canvas=grid.querySelector(`[data-saved-id="${CSS.escape(item.id)}"] canvas`);
    return new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(Error('The PNG image is unavailable.')),'image/png'));
   });
   exportBlobs.set(id,promise);promise.catch(()=>exportBlobs.delete(id));
  }return exportBlobs.get(id);
 }

 async function exportImage(item,button){
  const state=exporting;if(!state||state.busy||state.card!==button.closest('.saved-card'))return;state.busy=true;
  const buttons=[...state.card.querySelectorAll('.saved-export-action')];buttons.forEach(other=>{other.disabled=true;other.classList.toggle('is-muted',other!==button);});button.setAttribute('aria-busy','true');status.textContent='';
  try{
   // Start ClipboardItem during the click gesture; its PNG promise may finish later.
   const png=exportBlob(item);
   if(button.dataset.savedAction==='copy'){
    if(!navigator.clipboard?.write||typeof ClipboardItem==='undefined')throw Error('Image copying is unavailable in this browser. Please use Download.');
    await navigator.clipboard.write([new ClipboardItem({'image/png':png})]);
   }else{
    const blob=await png;if(exporting!==state)return;
    const url=URL.createObjectURL(blob),link=document.createElement('a'),name=item.name.replace(/[^\p{L}\p{N}_ -]/gu,'').trim()||'Look';
    link.href=url;link.download=`FITLOOP-${name}.png`;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);
   }
   if(exporting!==state)return;button.removeAttribute('aria-busy');button.classList.add('is-success');status.textContent=button.dataset.savedAction==='copy'?'Image copied.':'Image download started.';
   state.restoreFocus=true;state.timer=setTimeout(()=>{if(exporting===state)closeExport();},850);
  }catch(error){if(exporting!==state)return;state.busy=false;buttons.forEach(other=>{other.disabled=false;other.classList.remove('is-muted');});button.removeAttribute('aria-busy');status.textContent=error.message||'The image could not be exported. Please try again.';}
 }
 page.addEventListener('keydown',event=>{if(event.key==='Escape'&&exporting&&!exporting.busy){event.preventDefault();event.stopPropagation();exporting.restoreFocus=true;closeExport();}});
 document.addEventListener('pointerdown',event=>{if(exporting&&!exporting.busy&&!exporting.card.contains(event.target))closeExport();});
 document.addEventListener('fitloop-screen',()=>closeExport(true));

 // Sample the rendered portrait alpha, including its actual object-fit padding.
 function overPortrait(canvas,x,y){
  const r=canvas.getBoundingClientRect(),scale=Math.min(r.width/canvas.width,r.height/canvas.height);
  const px=Math.floor((x-r.left-(r.width-canvas.width*scale)/2)/scale),py=Math.floor((y-r.top-(r.height-canvas.height*scale)/2)/scale);
  if(px<0||py<0||px>=canvas.width||py>=canvas.height)return false;
  let pixels=silhouettes.get(canvas);if(!pixels){pixels=canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height).data;silhouettes.set(canvas,pixels);}
  return pixels[(py*canvas.width+px)*4+3]>160;
 }
 function clearCursor(){if(cursor){cursor.button.classList.remove('is-over-model');cursor.button.style.removeProperty('--saved-cursor-x');cursor.button.style.removeProperty('--saved-cursor-y');cursor=null;}}
 function moveCursor(time){
  if(!cursor)return;if(!desktopCursor.matches||!page.classList.contains('is-active')||cursor.button.disabled||!cursor.button.isConnected){clearCursor();return;}
  const b=cursor.button.getBoundingClientRect();if(cursor.clientX<b.left||cursor.clientX>b.right||cursor.clientY<b.top||cursor.clientY>b.bottom){clearCursor();return;}
  const x=Math.max(18,Math.min(b.width-18,cursor.clientX-b.left)),y=Math.max(18,Math.min(b.height-18,cursor.clientY-b.top));
  const dt=cursor.time?Math.min(50,time-cursor.time):16,mix=reduced.matches?1:1-Math.exp(-dt/42);cursor.time=time;
  cursor.x+=(x-cursor.x)*mix;cursor.y+=(y-cursor.y)*mix;
  cursor.button.style.setProperty('--saved-cursor-x',`${cursor.x}px`);cursor.button.style.setProperty('--saved-cursor-y',`${cursor.y}px`);
  cursor.button.classList.toggle('is-over-model',overPortrait(cursor.canvas,b.left+cursor.x,b.top+cursor.y));
 }
 grid.addEventListener('pointermove',event=>{
  const button=event.target.closest('.saved-view');if(!desktopCursor.matches||event.pointerType==='touch'||!button||button.disabled){clearCursor();return;}
  if(cursor?.button!==button){clearCursor();const b=button.getBoundingClientRect();cursor={button,canvas:button.closest('.saved-card').querySelector('canvas'),clientX:event.clientX,clientY:event.clientY,x:Math.max(18,Math.min(b.width-18,event.clientX-b.left)),y:Math.max(18,Math.min(b.height-18,event.clientY-b.top)),time:0};}
  cursor.clientX=event.clientX;cursor.clientY=event.clientY;
 });
 grid.addEventListener('pointerleave',clearCursor);desktopCursor.addEventListener('change',clearCursor);
 document.addEventListener('fitloop-screen',clearCursor);window.addEventListener('blur',clearCursor);
 function backgroundReturnAllowed(target,includeCreateLink=false){
  return desktopCursor.matches&&items.length===0&&page.classList.contains('is-active')&&!document.body.classList.contains('menu-is-open')&&
   !!target.closest('#saved')&&((includeCreateLink&&target.closest('.saved-empty a[href="#next"]'))||!target.closest('.saved-card,button,a,input,textarea,select,[contenteditable]'))&&!page.querySelector('.saved-card.export-active');
 }
 let suppressBackgroundClick=false;
 page.addEventListener('pointerdown',()=>{suppressBackgroundClick=!!exporting||closingExports.size>0;});
 page.addEventListener('click',event=>{
  const dismissing=suppressBackgroundClick;suppressBackgroundClick=false;
  if(event.button!==0||dismissing||!backgroundReturnAllowed(event.target))return;
  page.dispatchEvent(new Event('fitloop-create-from-saved'));
 });
 grid.addEventListener('click',async event=>{const button=event.target.closest('[data-saved-action]');if(!button)return;const card=button.closest('.saved-card'),item=items.find(x=>x.id===card.dataset.savedId);if(!item)return;
  if(button.dataset.savedAction==='export'){openExport(card);return;}
  if(['copy','download'].includes(button.dataset.savedAction)){await exportImage(item,button);return;}
  if(button.dataset.savedAction==='delete'){const previous=items;items=items.filter(x=>x.id!==item.id);try{persist();render();status.textContent=`${item.name} deleted. `;const undo=document.createElement('button');undo.textContent='UNDO';undo.className='saved-undo';undo.onclick=()=>{items=previous;persist();render();status.textContent='Look restored.';};status.append(undo);}catch{items=previous;status.textContent='The look could not be deleted.';}return;}
  if(button.disabled)return;
  button.disabled=true;button.setAttribute('aria-busy','true');
  try{
   if(button.dataset.savedAction==='view'&&!reduced.matches&&(matchMedia('(max-width:767px)').matches||!matchMedia('(hover:hover) and (pointer:fine)').matches)){
    button.classList.add('is-opening');
    await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
    await Promise.all(button.getAnimations({subtree:true}).map(animation=>animation.finished.catch(()=>{})));
   }
   if(button.dataset.savedAction==='view')window.FitloopSavedTransition?.remember(card);
   await window.FitloopFitting.openSaved(item,button.dataset.savedAction==='edit');
  }catch{window.FitloopSavedTransition?.cancelPending();status.textContent='The look could not open. Please try again.';}
  finally{button.disabled=false;button.removeAttribute('aria-busy');button.classList.remove('is-opening');}
 });
 function tick(time){moveCursor(time);if(page.classList.contains('is-active')&&!document.hidden){for(const item of items){const card=grid.querySelector(`[data-saved-id="${CSS.escape(item.id)}"]`),hovered=card.matches(':hover,:focus-within');if(card.getBoundingClientRect().bottom>0&&card.getBoundingClientRect().top<innerHeight){const moving=!reduced.matches&&hovered&&!card.classList.contains('export-active');if(moving||card.dataset.paintedMotion!=='static'){draw(item,moving);card.dataset.paintedMotion=moving?'moving':'static';}}}}frame=requestAnimationFrame(tick);}
 window.FitloopSaved={save,cursorIcon,backgroundReturnAllowed,async preparePreview(){await Promise.all(items.map(item=>window.FitloopMotion.load(portraitKey(item))));items.forEach(item=>draw(item,false));}};window.addEventListener('storage',event=>{if(event.key===key){try{const data=JSON.parse(event.newValue||'[]');items=Array.isArray(data)?data.filter(valid):[];render();}catch{}}});
 render();frame=requestAnimationFrame(tick);window.addEventListener('pagehide',()=>cancelAnimationFrame(frame));window.addEventListener('pageshow',event=>{if(event.persisted)frame=requestAnimationFrame(tick);});
})();
