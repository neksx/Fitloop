'use strict';
(() => {
 const section=document.querySelector('#how');if(!section)return;
 const desktop=matchMedia('(min-width:0px)'),reduced=matchMedia('(prefers-reduced-motion:reduce)');
 const garments={"0":{"id":0,"name":"Pearl Cropped Jacket","file":"jacket-front.png","image":[1024,1536],"box":[18,384,991,768],"maxWidth":116,"maxHeight":132,"scale":0.1172901921132457,"tx":14.771486349848331,"ty":-0.07886754297270215,"visibleWidth":116.23458038422649,"visibleHeight":90.0788675429727,"center":[75,90],"sourceBoxBefore":[19,384,989,767],"scaleBefore":0.1172901921132457,"scaleAdjustment":1,"boundsMethod":"Native-pixel foreground: alpha >127 and min(R,G,B) <220; aspect ratio unchanged"},"4":{"id":4,"name":"Tie Dye Jacket","file":"tie-dye-front.jpg","image":[1668,2500],"box":[196,673,1276,1151],"maxWidth":104,"maxHeight":122,"scale":0.08150470219435736,"tx":7.025078369905955,"ty":-11.75862068965516,"visibleWidth":104,"visibleHeight":93.81191222570533,"center":[75,90],"sourceBoxBefore":[196,674,1276,1149],"scaleBefore":0.08150470219435736,"scaleAdjustment":1,"boundsMethod":"Native-pixel foreground: alpha >127 and min(R,G,B) <220; aspect ratio unchanged"},"5":{"id":5,"name":"Leather Tech Anorak Jacket","file":"leather-anorak-front.jpg","image":[1668,2500],"box":[312,675,1036,1199],"maxWidth":116,"maxHeight":132,"scale":0.08627450980392157,"tx":3.3921568627450966,"ty":-19.956862745098036,"visibleWidth":89.38039215686274,"visibleHeight":103.44313725490196,"center":[75,90],"sourceBoxBefore":[260,480,1160,1530],"scaleBefore":0.08627450980392157,"scaleAdjustment":1,"boundsMethod":"Native-pixel foreground: alpha >127 and min(R,G,B) <220; aspect ratio unchanged"},"6":{"id":6,"name":"Logo Bling Jacket","file":"women-logo-bling-jacket-1-0.jpg","image":[1668,2500],"box":[165,609,1339,1221],"maxWidth":116,"maxHeight":132,"scale":0.07970126960418222,"tx":8.489290515309932,"ty":-7.195698282300228,"visibleWidth":106.72,"visibleHeight":97.31525018670649,"center":[75,90],"sourceBoxBefore":[165,608,1339,1224],"scaleBefore":0.08663181478715459,"scaleAdjustment":0.92,"boundsMethod":"Native-pixel foreground: alpha >127 and min(R,G,B) <220; aspect ratio unchanged"},"7":{"id":7,"name":"Paint Splatter Jacket","file":"women-paint-splatter-jacket-black-0.jpg","image":[1668,2500],"box":[224,674,1225,1141],"maxWidth":116,"maxHeight":132,"scale":0.0882800608828006,"tx":1.153729071537299,"ty":-19.864535768645354,"visibleWidth":108.14307458143074,"visibleHeight":100.7275494672755,"center":[75,90],"sourceBoxBefore":[136,674,1314,1141],"scaleBefore":0.0882800608828006,"scaleAdjustment":1,"boundsMethod":"Native-pixel foreground: alpha >127 and min(R,G,B) <220; aspect ratio unchanged"},"8":{"id":8,"name":"Monogram Jacket","file":"women-monogram-cutout-v58.png","image":[1024,1536],"box":[22,183,983,1230],"maxWidth":116,"maxHeight":132,"scale":0.09889250814332248,"tx":24.218697068403905,"ty":11.083778501628657,"visibleWidth":97.211335504886,"visibleHeight":121.63778501628666,"center":[75,90],"sourceBoxBefore":[23,184,981,1228],"scaleBefore":0.10749185667752444,"scaleAdjustment":0.92,"boundsMethod":"Native-pixel foreground: alpha >127 and min(R,G,B) <220; aspect ratio unchanged"}};
 let mounted=null;const session={first:0,preview:0};
 function createDemo(){
  const catalog=window.FitloopCatalog,state=window.FitloopState,motion=window.FitloopMotion;
  const stage=section.querySelector('.services-image-stage'),groups=[...stage.querySelectorAll('.service-image-group')],blocks=[...section.querySelectorAll('.service-block')];
  const originalAria=stage.getAttribute('aria-hidden'),originalGroups=groups.map(group=>({aria:group.getAttribute('aria-hidden'),inert:group.hasAttribute('inert')}));
  const originalCopy=[1,2].map(i=>({desktop:blocks[i].querySelector('.service-copy .flow-desktop').innerHTML,sr:blocks[i].querySelector('p.sr-only').textContent}));
  const options=[0,4,5,6,7,8],loads=new Map(),portraits=new Map(),portraitRequests=new Map();
  let disposed=false,busy=false,preview=session.preview,phase=-1,source=null,renderer=null,current=null,previous=null,key='',frame=0,changeStart=0,initial=null,noticeAnimation=null;
  let look={identity:'woman',gender:'woman',jacket:0,pants:2,height:172,weight:62,jacketSize:'M',pantSize:30,acknowledged:[],reviewed:[]};
  const corners='<span class="fitting-thin-corners" aria-hidden="true"><i></i><i></i><i></i><i></i></span>';
  const artFor=id=>{const p=catalog[id],s=garments[id];return `<svg class="step-art" viewBox="0 0 150 180" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><image href="assets/fitting-room/${p.thumb}" width="${s.image[0]}" height="${s.image[1]}" transform="translate(${s.tx} ${s.ty}) scale(${s.scale})"/></svg>`;};
  const first=document.createElement('div');first.className='how-demo-card how-demo-single sample-rail fitting-rail white-screen';first.innerHTML=`<article class="product-card" data-product="${session.first}" aria-label="${catalog[session.first].name}"><div class="initial-art">${artFor(session.first)}</div><button class="fitting-card-action" type="button" data-action="replace" aria-label="Replace ${catalog[session.first].name}"><span class="button brand-badge"><span>REPLACE</span></span></button></article>`;
  const room=document.createElement('div');room.className='how-demo-card how-demo-room sample-rail fitting-rail white-screen';
  room.innerHTML=`<article class="product-card" data-product="0" aria-label="Pearl Cropped Jacket"><div class="initial-art">${artFor(0)}</div><button class="fitting-card-toggle" type="button" aria-label="Show actions for Pearl Cropped Jacket" aria-expanded="false"></button>${['refresh','replace'].map(action=>`<button class="fitting-card-action" type="button" data-action="${action}" aria-label="${action==='refresh'?'Refresh combination with':'Replace'} Pearl Cropped Jacket"><span class="button brand-badge"><span>${action.toUpperCase()}</span></span></button>`).join('')}</article><div class="how-demo-model-cell"><canvas class="how-demo-portrait" width="600" height="960" role="img" aria-label="Example outfit preview"></canvas></div>`;
  const saved=document.createElement('div');saved.className='how-demo-card how-demo-saved';
  saved.innerHTML=`<header><label class="saved-name"><input class="how-demo-look-name" type="text" aria-label="Name" placeholder="Name" maxlength="28" size="13">${corners}</label></header><canvas class="how-demo-portrait" width="936" height="960" role="img" aria-label="Example saved outfit"></canvas><div class="saved-status">Look saved.</div>`;
  const cards=[first,room,saved];cards.forEach((card,i)=>{card.dataset.howStep=String(i);card.inert=true;groups[i].append(card);});
  const status=document.createElement('span');status.className='how-demo-status';status.setAttribute('role','status');status.setAttribute('aria-live','polite');section.append(status);
  const card=room.querySelector('.product-card'),art=card.querySelector('.initial-art'),toggle=card.querySelector('.fitting-card-toggle'),canvas=room.querySelector('canvas'),savedCanvas=saved.querySelector('canvas'),contexts=[canvas.getContext('2d'),savedCanvas.getContext('2d')];
  toggle.tabIndex=matchMedia('(hover:hover) and (pointer:fine)').matches?-1:0;
  stage.removeAttribute('aria-hidden');section.classList.add('has-how-demo');
  const line=(left,right)=>`<div class="service-line"><span class="service-text-half service-text-half--left">${left}</span><span class="service-text-half service-text-half--right">${right}</span></div>`;
  blocks[1].querySelector('.service-copy .flow-desktop').innerHTML=line('Change one piece','at a time.')+line('See how it','comes together.');
  blocks[2].querySelector('.service-copy .flow-desktop').innerHTML=line('Keep the combinations','you love.')+line('Come back to','them anytime.');
  blocks[1].querySelector('p.sr-only').textContent='Change one piece at a time. See how it comes together.';
  blocks[2].querySelector('p.sr-only').textContent='Keep the combinations you love. Come back to them anytime.';
  function preload(id){
   if(!loads.has(id))loads.set(id,new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>{if(img.decode)img.decode().then(()=>resolve(img),()=>resolve(img));else resolve(img);};img.onerror=()=>{loads.delete(id);reject(Error('Garment unavailable'));};img.src='assets/fitting-room/'+catalog[id].thumb;}));
   return loads.get(id);
  }
  function selectPreview(id){
   preview=id;session.preview=id;const p=catalog[id],s=garments[id],image=art.querySelector('image');card.dataset.product=String(id);card.setAttribute('aria-label',p.name);
   image.setAttribute('href','assets/fitting-room/'+p.thumb);image.setAttribute('width',s.image[0]);image.setAttribute('height',s.image[1]);image.setAttribute('transform',`translate(${s.tx} ${s.ty}) scale(${s.scale})`);
   toggle.setAttribute('aria-label',`Show actions for ${p.name}`);card.querySelectorAll('.fitting-card-action').forEach(button=>button.setAttribute('aria-label',`${button.dataset.action==='refresh'?'Refresh combination with':'Replace'} ${p.name}`));
  }
  const firstCard=first.querySelector('.product-card'),firstArt=first.querySelector('.initial-art'),firstButton=first.querySelector('button');let firstBusy=false;
  firstButton.addEventListener('click',async()=>{
   if(firstBusy||disposed)return;firstBusy=true;firstButton.disabled=true;
   try{const id=state.cycleCard([session.first],0,options)[0];await preload(id);if(disposed)return;
    await firstArt.animate([{opacity:1},{opacity:0}],{duration:reduced.matches?0:250}).finished;
    const p=catalog[id],s=garments[id],image=firstArt.querySelector('image');session.first=id;firstCard.dataset.product=String(id);firstCard.setAttribute('aria-label',p.name);firstButton.setAttribute('aria-label',`Replace ${p.name}`);
    image.setAttribute('href','assets/fitting-room/'+p.thumb);image.setAttribute('width',s.image[0]);image.setAttribute('height',s.image[1]);image.setAttribute('transform',`translate(${s.tx} ${s.ty}) scale(${s.scale})`);
    await firstArt.animate([{opacity:0},{opacity:1}],{duration:reduced.matches?0:250}).finished;status.textContent=`${p.name} shown.`;
   }catch{status.textContent='The item could not load. Please try again.';}finally{firstBusy=false;firstButton.disabled=false;}
  });
  async function portrait(next){
   const id=state.portraitKey(next);if(portraits.has(id))return portraits.get(id);if(portraitRequests.has(id))return portraitRequests.get(id);
   const request=(async()=>{
   await motion.load(id);if(disposed)return null;
   renderer.draw(id,0,0,true,next,false);
   const copy=Object.assign(document.createElement('canvas'),{width:source.width,height:source.height}),ctx=copy.getContext('2d');ctx.drawImage(source,0,0);
   const pixels=ctx.getImageData(0,0,copy.width,copy.height).data;let x0=copy.width,y0=copy.height,x1=-1,y1=-1;
   for(let y=0;y<copy.height;y++)for(let x=0;x<copy.width;x++)if(pixels[(y*copy.width+x)*4+3]>160){x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);}
   if(x1<x0)throw Error('The model is unavailable.');
   const bound={x:Math.max(0,x0-4),y:Math.max(0,y0-4),w:Math.min(copy.width,x1+5)-Math.max(0,x0-4),h:Math.min(copy.height,y1+5)-Math.max(0,y0-4)},record={canvas:copy,bound,key:id};portraits.set(id,record);return record;
   })();portraitRequests.set(id,request);try{return await request;}finally{portraitRequests.delete(id);}
  }
  async function warmDemo(){
   const base={...look};
   for(const id of options){await new Promise(resolve=>{if(window.requestIdleCallback)window.requestIdleCallback(resolve,{timeout:1000});else setTimeout(resolve,32);});if(disposed)return;try{await portrait(state.select(base,id));}catch{}}
  }
  function paint(ctx,record,opacity=1,zoom=1){
   if(!record)return;const target=ctx.canvas,b=record.bound,unit=target.height/240,scale=Math.min(126*unit/b.w,156*unit/b.h)*zoom,w=b.w*scale,h=b.h*scale;
   ctx.globalAlpha=opacity;ctx.drawImage(record.canvas,b.x,b.y,b.w,b.h,(target.width-w)/2,(target.height-h)/2,w,h);ctx.globalAlpha=1;
   target.dataset.figureBox=JSON.stringify({x:(target.width-w)/2/unit,y:(target.height-h)/2/unit,w:w/unit,h:h/unit});
  }
  function draw(time){
   frame=0;if(disposed)return;const t=reduced.matches?1:Math.max(0,Math.min(1,(time-changeStart)/500)),mix=t*t*(3-2*t);
   for(const [i,ctx] of contexts.entries()){const zoom=i===1?1.232:1;ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);if(previous&&mix<1)paint(ctx,previous,1-mix,zoom);paint(ctx,current,previous?mix:1,zoom);ctx.canvas.dataset.portraitKey=key;ctx.canvas.dataset.liveTransition=previous&&mix<1?'outfit':'idle';}
   if(previous&&t<1)frame=requestAnimationFrame(draw);else previous=null;
  }
  function redraw(){cancelAnimationFrame(frame);frame=requestAnimationFrame(draw);}
  function ensureInitial(){
   if(!initial)initial=(async()=>{options.forEach(id=>preload(id).catch(()=>{}));source=Object.assign(document.createElement('canvas'),{width:768,height:1024});renderer=new motion.Motion(source);const record=await portrait(look);if(disposed||!record)return;current=record;key=record.key;room.dataset.ready='true';saved.dataset.ready='true';redraw();warmDemo();})().catch(()=>{if(!disposed)status.textContent='The example outfit could not load. Please try again.';initial=null;});
   return initial;
  }
  async function showNotice(beforeReveal){
   const notice=document.createElement('span');notice.className='how-item-notice';notice.setAttribute('role','status');notice.innerHTML='<span class="fitting-item-hint">Already wearing this.</span>';card.append(notice);card.classList.add('is-worn-notice');status.textContent='This item is already worn.';
   try{noticeAnimation=notice.animate([{opacity:0},{opacity:1,offset:.14},{opacity:1,offset:.82},{opacity:0}],{duration:reduced.matches?600:900,easing:'ease-in-out'});await noticeAnimation.finished;}catch{}finally{if(!disposed)beforeReveal?.();notice.remove();card.classList.remove('is-worn-notice');noticeAnimation=null;}
  }
  async function cycle(fromNotice=false){
   const next=state.cycleCard([preview],0,options)[0];await preload(next);if(disposed)return;
   if(fromNotice)await showNotice(()=>{art.style.opacity='0';selectPreview(next);});
   else{await art.animate([{opacity:1},{opacity:0}],{duration:reduced.matches?0:250,easing:'ease-out'}).finished;if(disposed)return;selectPreview(next);}
   if(fromNotice&&!reduced.matches)await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
   if(disposed)return;
   const reveal=art.animate([{opacity:0},{opacity:1}],{duration:reduced.matches?0:fromNotice?620:250,easing:'cubic-bezier(.22,1,.36,1)',fill:'both'});
   await reveal.finished;if(disposed)return;art.style.opacity='1';reveal.cancel();art.style.opacity='';status.textContent=`${catalog[preview].name} shown. Refresh to try it on.`;
  }
  async function action(type){
   if(busy||disposed)return;busy=true;card.setAttribute('aria-busy','true');card.classList.remove('is-action-open');toggle.setAttribute('aria-expanded','false');
   try{
    await ensureInitial();if(disposed||!current)return;
    if(type==='replace')await cycle();
    else if(state.ids(look).includes(preview))await cycle(true);
    else{const next=state.select(look,preview),record=await portrait(next);if(disposed||!record)return;previous=current;current=record;look=next;key=record.key;changeStart=performance.now();canvas.setAttribute('aria-label',`Model wearing ${catalog[preview].name}`);savedCanvas.setAttribute('aria-label',`Saved example wearing ${catalog[preview].name}`);redraw();status.textContent=`Now wearing ${catalog[preview].name}.`;}
   }catch{if(!disposed)status.textContent='The outfit could not load. Please try again.';}
   finally{busy=false;card.removeAttribute('aria-busy');}
  }
  card.querySelectorAll('[data-action]').forEach(button=>button.addEventListener('click',()=>action(button.dataset.action)));
  toggle.addEventListener('click',()=>{const open=card.classList.toggle('is-action-open');toggle.setAttribute('aria-expanded',String(open));});
  saved.querySelector('input').addEventListener('keydown',event=>{if(event.key==='Enter'){event.currentTarget.blur();saved.querySelector('.saved-status').textContent='Look saved.';}});
  function update({opacities,active,opening,out}){
   if(disposed)return;const index=opacities.indexOf(Math.max(...opacities)),enabled=active&&opening>.99&&out<.01&&opacities[index]>.99&&!document.body.classList.contains('menu-is-open');
   if(active&&opening>.5)ensureInitial();
   cards.forEach((node,i)=>{const on=enabled&&i===index;node.inert=!on;node.dataset.active=String(on);groups[i].inert=!on;groups[i].setAttribute('aria-hidden',String(!on));});
   phase=enabled?index:-1;
  }
  selectPreview(session.preview);
  blocks.forEach(block=>{for(const kind of ['service-title','service-copy'])block.querySelector('.'+kind+' .flow-mobile').innerHTML=block.querySelector('.'+kind+' .flow-desktop').innerHTML;});
  blocks[2].querySelector('.service-copy .flow-mobile').innerHTML=line('Keep the combina','tions you love.').replace('class="service-line"','class="service-line is-word-split"')+line('Come back to','them anytime.');
  const onScreen=()=>{if(document.body.dataset.screen!=='1'){cards.forEach((node,i)=>{node.inert=true;node.dataset.active='false';groups[i].inert=true;groups[i].setAttribute('aria-hidden','true');});phase=-1;}};
  document.addEventListener('fitloop-screen',onScreen);
  return {update,destroy(){disposed=true;cancelAnimationFrame(frame);noticeAnimation?.cancel();renderer?.dispose();document.removeEventListener('fitloop-screen',onScreen);cards.forEach(node=>node.remove());status.remove();section.classList.remove('has-how-demo');if(originalAria===null)stage.removeAttribute('aria-hidden');else stage.setAttribute('aria-hidden',originalAria);groups.forEach((group,i)=>{group.inert=originalGroups[i].inert;if(originalGroups[i].aria===null)group.removeAttribute('aria-hidden');else group.setAttribute('aria-hidden',originalGroups[i].aria);});[1,2].forEach((i,n)=>{blocks[i].querySelector('.service-copy .flow-desktop').innerHTML=originalCopy[n].desktop;blocks[i].querySelector('p.sr-only').textContent=originalCopy[n].sr;});}};
 }
 function sync(){
  if(desktop.matches&&!mounted){mounted=createDemo();document.dispatchEvent(new Event('fitloop-how-layout'));}
  else if(!desktop.matches&&mounted){mounted.destroy();mounted=null;document.dispatchEvent(new Event('fitloop-how-layout'));}
 }
 window.FitloopHowDemo={update:state=>mounted?.update(state)};
 desktop.addEventListener('change',sync);sync();
})();
