'use strict';
// A bounded petal pool: a sparse fall and a single thin resting band.
(function(root){
 class Petals{
  constructor(width,height,random=Math.random){this.random=random;this.resize(width,height);this.items=Array.from({length:this.count},(_,i)=>this.make(i,i<this.restCount));}
  resize(width,height){this.width=width;this.height=height;this.restCount=Math.min(64,Math.ceil(width/22));this.fallCount=Math.min(18,Math.max(7,Math.ceil(width/90)));this.count=this.restCount+this.fallCount;}
  make(i,rest=false){const r=this.random;return {x:r()*this.width,y:rest?this.height-r()*6:r()*this.height,vx:0,vy:rest?0:12+r()*14,angle:r()*360,spin:r()*22-11,size:2+r()*2.5,age:rest?r()*24:0,rest,seed:r()*7};}
  scatter(x,y,dx,dy){for(const p of this.items){const a=p.x-x,b=p.y-y,d=Math.hypot(a,b);if(d<48){const force=(1-d/48);p.rest=false;p.age=0;p.vx+=(dx*5+(a||1)*.7)*force;p.vy=-Math.min(90,28+Math.abs(dy)*4)*force;}}}
  step(dt,time){
   for(let i=0;i<this.items.length;i++){
    const p=this.items[i];p.age+=dt;
    if(p.rest){p.y+=dt*.12;if(p.y>this.height+p.size||p.age>42){this.items[i]=this.make(i);this.items[i].y=-8;}continue;}
    p.vx*=Math.exp(-dt*2);p.vy=Math.min(28,p.vy+dt*14);p.x+=(p.vx+Math.sin(time*.7+p.seed)*5)*dt;p.y+=p.vy*dt;p.angle+=p.spin*dt;
    if(p.x< -10)p.x=this.width+8;if(p.x>this.width+10)p.x=-8;
    if(p.y>=this.height-6){if(this.items.filter(q=>q.rest).length<this.restCount){p.rest=true;p.y=this.height-this.random()*6;p.vx=0;p.vy=0;p.age=0;}else{this.items[i]=this.make(i);this.items[i].y=-8;}}
   }
  }
 }
 if(typeof module==='object'&&module.exports){module.exports=Petals;return;}
 const section=document.querySelector('#next');if(!section)return;
 const ns='http://www.w3.org/2000/svg',host=document.createElement('div'),svg=document.createElementNS(ns,'svg'),reduced=matchMedia('(prefers-reduced-motion:reduce)');
 host.className='sakura-overlay';host.setAttribute('aria-hidden','true');host.inert=true;svg.setAttribute('focusable','false');host.append(svg);section.append(host);
 let pool,paths=[],raf=0,last=0,pointer=null;
 function resize(){pool=new Petals(section.clientWidth,section.clientHeight);svg.setAttribute('viewBox',`0 0 ${pool.width} ${pool.height}`);paths=pool.items.map((p,i)=>{const path=document.createElementNS(ns,'path');path.setAttribute('d','M0 0C-1.8-2.8-5.3-2-4.6.5C-4 2.4-1.7 3.1 0 4C1.8 2.2 3 .7 2.1-.8C1.4-1.9.5-1.2 0 0Z');path.setAttribute('fill',['#e6a6c4','#f0bbd3','#dfa0bc'][i%3]);path.setAttribute('opacity',i<pool.restCount?'.68':'.58');return path;});svg.replaceChildren(...paths);paint();sync();}
 function paint(){pool.items.forEach((p,i)=>{paths[i].setAttribute('transform',`translate(${p.x.toFixed(2)} ${p.y.toFixed(2)}) rotate(${p.angle.toFixed(1)}) scale(${(p.size/4).toFixed(2)})`);paths[i].style.visibility=reduced.matches&&!p.rest?'hidden':'';});}
 const visible=()=>document.body.dataset.screen==='2'&&!document.body.classList.contains('menu-is-open')&&!document.hidden;
 function tick(now){raf=0;if(!visible()||reduced.matches){last=0;return;}pool.step(Math.min(.04,last?(now-last)/1000:0),now/1000);last=now;paint();raf=requestAnimationFrame(tick);}
 function sync(){if(!pool)return;if(visible()&&!reduced.matches&&!raf)raf=requestAnimationFrame(tick);else if(!visible()||reduced.matches){cancelAnimationFrame(raf);raf=0;last=0;paint();}}
 window.addEventListener('pointermove',event=>{if(!visible()||reduced.matches)return;const next={x:event.clientX,y:event.clientY};if(pointer)pool.scatter(next.x,next.y,Math.max(-15,Math.min(15,next.x-pointer.x)),Math.max(-15,Math.min(15,next.y-pointer.y)));pointer=next;},{passive:true});
 window.addEventListener('pointerout',event=>{if(!event.relatedTarget)pointer=null;},{passive:true});
 document.addEventListener('fitloop-screen',sync);document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);
 new MutationObserver(sync).observe(document.body,{attributes:true,attributeFilter:['class']});new ResizeObserver(resize).observe(section);resize();
})(typeof window==='undefined'?globalThis:window);
