'use strict';
(() => {
 const desktop=matchMedia('(min-width:768px) and (hover:hover) and (pointer:fine)');
 const reducedMotion=matchMedia('(prefers-reduced-motion:reduce)');
 const cursor=document.createElement('div');cursor.className='desktop-square-cursor';cursor.setAttribute('aria-hidden','true');document.body.append(cursor);
 const savedAdd=document.querySelector('#add-model')?.parentElement.cloneNode(true);
 if(savedAdd){savedAdd.querySelector('button')?.removeAttribute('id');savedAdd.setAttribute('aria-hidden','true');savedAdd.classList.add('saved-cursor-add');cursor.classList.add('white-screen');cursor.append(savedAdd);}
 let x=0,y=0,targetX=0,targetY=0,frame=0,lastTime=0,visible=false;
 const draw=()=>{
  const add=cursor.classList.contains('is-saved-action'),half=add?20:5;
  const px=add?Math.max(half,Math.min(innerWidth-half,x)):x,py=add?Math.max(half,Math.min(innerHeight-half,y)):y;
  cursor.style.transform=`translate3d(${px-half}px,${py-half}px,0)`;
 };
 function updateColor(target){
  const screen=target.closest('.page-screen')||document.querySelector('.page-screen.is-active');
  let light=!!screen&&!screen.classList.contains('white-screen');
  for(let element=target;element&&element!==document.body;element=element.parentElement){
   const color=getComputedStyle(element).backgroundColor.match(/[\d.]+/g);
   if(color&&color.length>=3&&(color.length===3||Number(color[3])>.5)){
    const [r,g,b]=color.map(Number);light=.2126*r+.7152*g+.0722*b<128;break;
   }
   if(element===screen)break;
  }
  cursor.classList.toggle('is-light',light);
 }
 function stop(){cancelAnimationFrame(frame);frame=0;lastTime=0;}
 function hide(){stop();visible=false;cursor.classList.remove('is-visible');}
 function follow(time){
  const elapsed=Math.min(time-lastTime,64);
  lastTime=time;
  // Keep frame-rate-independent drag: 60 ms for the square, 42 ms for saved-page actions.
  const ease=1-Math.exp(-elapsed/(cursor.classList.contains('is-saved-action')?42:60));
  x+=(targetX-x)*ease;y+=(targetY-y)*ease;
  if(Math.hypot(targetX-x,targetY-y)<.05){x=targetX;y=targetY;draw();stop();return;}
  draw();frame=requestAnimationFrame(follow);
 }
 function sync(){document.documentElement.classList.toggle('square-cursor-active',desktop.matches);hide();}
 document.addEventListener('pointermove',event=>{
  if(!desktop.matches||event.pointerType==='touch'){hide();return;}
  updateColor(event.target);
  const wasAdd=cursor.classList.contains('is-saved-action');
  cursor.classList.toggle('is-saved-action',!event.target.closest('.ct_cr-navbar,.saved-page-back')&&!!window.FitloopSaved?.backgroundReturnAllowed(event.target,true));
  if(wasAdd!==cursor.classList.contains('is-saved-action'))draw();
  cursor.classList.toggle('is-contextual',!!event.target.closest('.saved-view:not(:disabled),.fitting-confirm:not([hidden])'));
  targetX=event.clientX;targetY=event.clientY;
  if(!visible||reducedMotion.matches){stop();x=targetX;y=targetY;draw();}
  else if(!frame){lastTime=performance.now();frame=requestAnimationFrame(follow);}
  visible=true;cursor.classList.add('is-visible');
 },{passive:true});
 document.addEventListener('pointerdown',()=>{
  if(!visible)return;
  stop();x=targetX;y=targetY;draw();
 },{passive:true});
 document.addEventListener('pointerleave',hide);window.addEventListener('blur',hide);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)hide();});
 document.addEventListener('keydown',event=>{if(event.key==='Tab')hide();});
 document.addEventListener('fitloop-screen',()=>{cursor.classList.remove('is-saved-action','is-contextual');hide();});
 desktop.addEventListener('change',sync);reducedMotion.addEventListener('change',sync);sync();
})();
