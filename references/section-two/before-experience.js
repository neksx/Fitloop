'use strict';
(() => {
 const loader=document.getElementById('loading'),skip=document.getElementById('skip-intro');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const counter=loader.querySelector('.loading_counter'),inner=loader.querySelector('.loading_counter_inner'),value=loader.querySelector('.loading_counter_value'),logo=loader.querySelector('.loading_logo>span'),frames=[...loader.querySelectorAll('.loading_sequence_item')];
 let generation=0,animations=[],countFrame=0,previousFocus=null;
 const inertTargets=[document.querySelector('main')];
 function finishIntro(){generation++;cancelAnimationFrame(countFrame);animations.forEach(a=>a.cancel());animations=[];loader.classList.add('hidden');loader.setAttribute('aria-busy','false');document.body.classList.remove('intro-running');document.body.classList.add('experience-ready');inertTargets.forEach(el=>el.inert=false);if(loader.contains(document.activeElement))previousFocus?.focus();}
 function wait(ms,token){return new Promise(resolve=>setTimeout(()=>resolve(token===generation),ms));}
 function animate(el,keyframes,options){const animation=el.animate(keyframes,{fill:'forwards',...options});animations.push(animation);return animation.finished.catch(()=>{});}
 function count(token){return new Promise(resolve=>{let start;function tick(time){if(token!==generation){resolve();return;}start??=time;const progress=Math.min((time-start)/2500,1);const eased=progress*(2-progress);value.textContent=String(Math.round(eased*100)).padStart(2,'0');if(progress<1)countFrame=requestAnimationFrame(tick);else resolve();}countFrame=requestAnimationFrame(tick);});}
 async function runIntro(){
  finishIntro();if(reduced.matches)return;
  const token=++generation;previousFocus=document.activeElement;document.body.classList.add('intro-running');document.body.classList.remove('experience-ready');inertTargets.forEach(el=>el.inert=true);loader.classList.remove('hidden');loader.setAttribute('aria-busy','true');counter.classList.remove('end');counter.style.opacity='1';counter.style.filter='';value.textContent='00';logo.style.transform='translateY(100%) rotate(4deg)';inner.style.transform='translateY(100%)';frames.forEach((frame,i)=>{frame.style.opacity=i===0?'1':'0';frame.style.transform='scale(1.5) rotate(8deg)';});
  if(!await wait(500,token))return;
  await animate(logo,[{transform:'translateY(100%) rotate(4deg)'},{transform:'translateY(0) rotate(0)'}],{duration:800,easing:'cubic-bezier(.19,1,.22,1)'});if(token!==generation)return;
  if(!await wait(1000,token))return;
  animate(logo,[{transform:'translateY(0) rotate(0)'},{transform:'translateY(-100%) rotate(-4deg)'}],{duration:800,easing:'cubic-bezier(.19,1,.22,1)'});
  if(!await wait(100,token))return;
  await animate(inner,[{transform:'translateY(100%) scale(.6)'},{transform:'translateY(0) scale(1)'}],{duration:800,easing:'cubic-bezier(.19,1,.22,1)'});if(token!==generation)return;
  await count(token);if(token!==generation)return;
  counter.classList.add('end');frames.forEach((frame,i)=>animate(frame,[{transform:'scale(1.5) rotate(8deg)',opacity:0},{transform:'scale(1) rotate(0)',opacity:1}],{duration:800,delay:300+i*120,easing:'cubic-bezier(.19,1,.22,1)'}));
  if(!await wait(800,token))return;
  await animate(counter,[{transform:'translate(-50%,-50%) scale(1) rotate(0)',filter:'blur(0px)',opacity:1},{transform:'translate(-50%,-50%) scale(.75) rotate(-4deg)',filter:'blur(20px)',opacity:0}],{duration:600,easing:'cubic-bezier(.19,1,.22,1)'});if(token===generation)finishIntro();
 }
 skip.addEventListener('click',finishIntro);document.getElementById('replay-intro')?.addEventListener('click',()=>{runIntro();skip.focus();});document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!loader.classList.contains('hidden'))finishIntro();});
 reduced.addEventListener('change',()=>{if(reduced.matches)finishIntro();});
 document.querySelector('[data-action=signup]').addEventListener('click',()=>{location.href='https://fitloop-wardrobe.cherry-raven-6877.chatgpt.site/#demo';});
 document.fonts.ready.then(runIntro).catch(finishIntro);
 // Almira Kho source retained: .5 wheel, .06 interpolation and signed modulo. Product parallax removed at user request.
 // Custom request: narrow square cards, 18px/second autoplay, white fields, centered garments and immediate pause on pointer hover.
 const hero=document.querySelector('.culture-hero'), photo=document.getElementById('glass-background');
 // Fit the actual figure bounds inside the stage above the product strip.
 const stage=document.querySelector('.background-stage');
 const figure={"x": 575, "y": 0, "width": 541, "height": 900};
 function alignPhoto(){
  const w=stage.clientWidth,h=stage.clientHeight;
  const scale=Math.min((w-64)/figure.width,(h-64)/figure.height)*2.6;
  photo.style.width=`${1672*scale}px`;photo.style.height=`${940*scale}px`;
  photo.style.left=`${w/2-(figure.x+figure.width/2)*scale}px`;photo.style.top=`${h-32-(figure.y+figure.height)*scale}px`;
 }
 new ResizeObserver(alignPhoto).observe(stage);photo.addEventListener('load',alignPhoto);alignPhoto();
 // Grid positions copied from Oakley's rendered code at desktop/mobile widths.
 const grid=document.getElementById('reference-grid');
 function renderGrid(){
  const w=innerWidth,positions=w>=768?['40px','calc(100vw - 40px)','calc(20vw + 24px)','calc(40vw + 8px)','calc(60vw - 8px)','calc(80vw - 24px)']:['40px','50vw',`${w-40}px`];
  grid.replaceChildren(...positions.map(left=>{const line=document.createElement('div');line.className='line v-line';line.style.left=left;return line;}));
  if(w>=768){const line=document.createElement('div');line.className='line h-line';line.style.bottom='0px';grid.append(line);}
 }
 renderGrid();window.addEventListener('resize',renderGrid);
 const menuButton=document.getElementById('menu-toggle'),menu=document.getElementById('fitloop-menu'),navCta=document.getElementById('nav-cta'),contents=document.querySelector('.culture-contents');
 let menuOpen=false;
 function setMenu(open){
  menuOpen=open;hero.classList.toggle('menu-is-open',open);menuButton.classList.toggle('is-active',open);menuButton.setAttribute('aria-expanded',String(open));
  menu.classList.toggle('is-visible',open);menu.inert=!open;menu.setAttribute('aria-hidden',String(!open));
  navCta.classList.toggle('is-visible',open);navCta.tabIndex=open?0:-1;navCta.setAttribute('aria-hidden',String(!open));
  contents.inert=open;document.querySelector('.wardrobe-rail').inert=open;
  if(open)menu.querySelector('a').focus({preventScroll:true});else menuButton.focus({preventScroll:true});
 }
 menuButton.addEventListener('click',()=>setMenu(!menuOpen));
 document.querySelector('.ct_cr-navbar__logo').addEventListener('click',()=>{if(menuOpen)setMenu(false);});
 menu.addEventListener('click',event=>{if(event.target.closest('a'))setMenu(false);});
 document.addEventListener('keydown',event=>{
  if(event.key==='Escape'&&menuOpen){setMenu(false);return;}
  if(event.key==='Tab'&&menuOpen){
   const focusable=[menuButton,document.querySelector('.ct_cr-navbar__logo'),navCta,...menu.querySelectorAll('a')],index=focusable.indexOf(document.activeElement);
   if(event.shiftKey&&index===0){event.preventDefault();focusable.at(-1).focus();}else if(!event.shiftKey&&index===focusable.length-1){event.preventDefault();menuButton.focus();}
  }
 });
 const rail=document.querySelector('.wardrobe-rail'),track=document.getElementById('wardrobe-track');
 const rows=[...track.querySelectorAll('.product-card')],toggle=null;
 let target=0,current=0,lastTime=0,raf=null,pointer=null,paused=reduced.matches,hoverPaused=false;
 const speed=18;
 function height(){return track.clientHeight||1;}
 function render(offset){
  const h=height(),total=rows.length*h;
  rows.forEach((row,index)=>{
   let wrapped=((index*h-offset)%total+total)%total;if(wrapped>total/2)wrapped-=total;
   row.style.transform=`translateX(${wrapped}px)`;
  });
  track.dataset.offset=current.toFixed(2);
 }
 function update(time){
  const dt=lastTime?Math.min(time-lastTime,250)/1000:0;lastTime=time;
  if(hoverPaused){raf=requestAnimationFrame(update);return;}
  if(!paused&&!menuOpen&&!document.hidden&&document.body.classList.contains('experience-ready'))target+=speed*dt;
  if(reduced.matches||Math.abs(target-current)<.01)current=target;else current+=(target-current)*.06;
  // Bound values after a full repeated cycle, preserving signed modulo continuity.
  const total=rows.length*height();if(current>total*2){current-=total;target-=total;}
  render(current);raf=requestAnimationFrame(update);
 }
 function move(delta){if(hoverPaused)return;target+=delta;if(reduced.matches){current=target;render(current);}}
 function freeze(){target=current;render(current);}
 track.addEventListener('pointerenter',event=>{if(event.pointerType==='touch')return;hoverPaused=true;freeze();track.dataset.hoverPaused='true';});
 track.addEventListener('pointerleave',()=>{hoverPaused=false;lastTime=0;track.dataset.hoverPaused='false';});
 track.addEventListener('wheel',event=>{event.preventDefault();move((Math.abs(event.deltaX)>Math.abs(event.deltaY)?event.deltaX:event.deltaY)*.5);},{passive:false});
 track.addEventListener('keydown',event=>{
  if(!['ArrowDown','ArrowUp','ArrowRight','ArrowLeft'].includes(event.key))return;
  event.preventDefault();move(height()*(['ArrowDown','ArrowRight'].includes(event.key)?1:-1));
 });
 track.addEventListener('scroll',()=>{if(track.scrollLeft)track.scrollLeft=0;});
 track.addEventListener('focusin',event=>{const card=event.target.closest('.product-card');if(!card)return;track.scrollLeft=0;const h=height(),total=rows.length*h;let y=((rows.indexOf(card)*h-current)%total+total)%total;if(y>total/2)y-=total;if(y<0||y+h>track.clientWidth)move(y-(track.clientWidth-h)/2);});
 reduced.addEventListener('change',()=>{paused=reduced.matches;});
 track.addEventListener('pointerdown',event=>{if(event.pointerType!=='touch')return;pointer={x:event.clientX,moved:false};track.setPointerCapture(event.pointerId);});
 track.addEventListener('pointermove',event=>{if(!pointer)return;const d=pointer.x-event.clientX;if(Math.abs(d)>2)pointer.moved=true;move(d*.5);pointer.x=event.clientX;});
 track.addEventListener('click',event=>{if(pointer?.moved)event.preventDefault();});
 track.addEventListener('pointerup',()=>{setTimeout(()=>pointer=null,0);});track.addEventListener('pointercancel',()=>pointer=null);
 let previousHeight=height();new ResizeObserver(()=>{const h=height();target=target/previousHeight*h;current=current/previousHeight*h;previousHeight=h;render(current);}).observe(track);
 document.addEventListener('visibilitychange',()=>{lastTime=0;});
 window.addEventListener('pagehide',()=>{cancelAnimationFrame(raf);});window.addEventListener('pageshow',event=>{if(event.persisted){lastTime=0;raf=requestAnimationFrame(update);}});
 render(0);raf=requestAnimationFrame(update);
})();
