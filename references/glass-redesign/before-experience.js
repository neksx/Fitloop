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
 skip.addEventListener('click',finishIntro);document.getElementById('replay-intro').addEventListener('click',()=>{runIntro();skip.focus();});document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!loader.classList.contains('hidden'))finishIntro();});
 reduced.addEventListener('change',()=>{if(reduced.matches)finishIntro();});
 document.querySelector('[data-action=signup]').addEventListener('click',()=>{location.href='https://fitloop-wardrobe.cherry-raven-6877.chatgpt.site/#demo';});
 document.fonts.ready.then(runIntro).catch(finishIntro);
 // Almira Kho carousel: local wheel multiplier .5, lerp .06, modulo wrapping and 0–30% image parallax, scale(1.2).
 // Wheel interception is intentionally scoped to this card so the FITLOOP page remains scrollable.
 const gallery=document.getElementById('look-gallery'),rows=[...gallery.querySelectorAll('.look-row')];let target=0,current=0,raf=null,pointer=null;
 function height(){return gallery.clientHeight||1;}
 function render(offset){const h=height(),total=rows.length*h;rows.forEach((row,index)=>{let wrapped=((index*h-offset)%total+total)%total;if(wrapped>total/2)wrapped-=total;row.style.transform=`translateY(${wrapped}px)`;const rect=row.getBoundingClientRect();const progress=Math.min(1,Math.max(0,(innerHeight-rect.top)/(innerHeight+h)));row.querySelector('.look-image').style.transform=`translateY(${reduced.matches?0:progress*30}%) scale(${reduced.matches?1:1.2})`;});gallery.dataset.activeLook=String(((Math.round(offset/h)%rows.length)+rows.length)%rows.length);}
 function update(){if(Math.abs(target-current)<.01){current=target;render(current);raf=null;return;}current=current+(target-current)*.06;render(current);raf=requestAnimationFrame(update);}
 function move(delta){target+=delta;if(reduced.matches){current=target;render(current);}else raf??=requestAnimationFrame(update);}
 gallery.addEventListener('wheel',event=>{event.preventDefault();move(event.deltaY*.5);},{passive:false});
 gallery.addEventListener('keydown',event=>{if(!['ArrowDown','ArrowUp','ArrowRight','ArrowLeft'].includes(event.key))return;event.preventDefault();move(height()*(['ArrowDown','ArrowRight'].includes(event.key)?1:-1));});
 document.getElementById('hero-next').addEventListener('click',()=>move(height()));
 gallery.addEventListener('pointerdown',event=>{if(event.pointerType!=='touch')return;pointer=event.clientY;gallery.setPointerCapture(event.pointerId);});gallery.addEventListener('pointermove',event=>{if(pointer===null)return;move((pointer-event.clientY)*.5);pointer=event.clientY;});const stop=()=>pointer=null;gallery.addEventListener('pointerup',stop);gallery.addEventListener('pointercancel',stop);
 let previousHeight=height();new ResizeObserver(()=>{const h=height();target=target/previousHeight*h;current=current/previousHeight*h;previousHeight=h;render(current);}).observe(gallery);render(0);
})();
