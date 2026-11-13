
'use strict';
(() => {
 const screenHashes=['#hero','#how','#next','#saved'],headingIds=['hero-heading','how-title','next-title','saved-title'];
 const screens=screenHashes.map(hash=>document.querySelector(hash)),section=screens[1],frame=section.querySelector('.opening-frame'),left=section.querySelector('.opening-left'),right=section.querySelector('.opening-right'),imageStage=section.querySelector('.services-image-stage'),servicesLabel=section.querySelector('.services-label'),images=[...section.querySelectorAll('.service-image-group')],labels=[...section.querySelectorAll('.service-label-item')],blocks=[...section.querySelectorAll('.service-block')],finale=section.querySelector('.how-finale'),flow=section.querySelector('.services-flow');
 const reduced=matchMedia('(prefers-reduced-motion:reduce)'),mobile=matchMedia('(max-width:767px)');
 let active=0,locked=false,opening=0,target=0,current=0,last=0,raf=0,wheelSum=0,wheelTime=0,touch=null,announced=-1,zoom=0,lastWheelAt=-Infinity,wheelBlocked=false,skipToHero=false;
 document.body.dataset.screen='0';
 const clamp=(x,min=0,max=1)=>Math.max(min,Math.min(max,x)),smooth=x=>{x=clamp(x);return x*x*(3-2*x);};
 const px=name=>Number.parseFloat(getComputedStyle(section).getPropertyValue(name));
 function metrics(){const h=section.clientHeight,item=h*(mobile.matches?1.2:1.25),gap=px('--service-title-copy-gap'),copyHeight=blocks[2].querySelector('.service-copy').getBoundingClientRect().height;const end=Math.max(3*item,h+80+2*item+gap+copyHeight);return {h,item,gap,end,total:end+h*.6};}
 function geometry(){
  section.style.setProperty('--opening-top',mobile.matches?'0px':`${document.querySelector('.ct_cr-navbar').getBoundingClientRect().bottom+20}px`);
  if(mobile.matches)section.style.removeProperty('--service-center-y');
  else section.style.setProperty('--service-center-y',`${frame.offsetTop+frame.clientHeight/2}px`);
  renderOpening(opening);renderFlow(current);renderZoom(zoom);
 }
 function renderOpening(p){opening=p;const edge=px('--opening-edge'),travel=Math.max(0,frame.clientWidth/2-edge)*smooth(p);left.style.transform=`translate3d(${-travel}px,0,0)`;right.style.transform=`translate3d(${travel}px,0,0)`;section.querySelectorAll('.opening-half img').forEach(e=>e.style.transform='translate3d(0,0,0)');const reveal=smooth(clamp((p-(mobile.matches?.58:.5))/(mobile.matches?.42:.5))),clip=`inset(0 0 ${(1-reveal)*100}% 0)`;imageStage.style.clipPath=clip;servicesLabel.style.clipPath=clip;}
 function renderFlow(y){
  const {h,item,gap,end,total}=metrics(),swap=h*(mobile.matches?.24:.3),t1=smooth((y-item+swap/2)/swap),t2=smooth((y-2*item+swap/2)/swap),opacities=[1-t1,t1*(1-t2),t2],out=smooth((y-end)/(total-end));
  const demo=section.classList.contains('has-how-demo'),unit=px('--service-square');
  imageStage.style.width=`${demo&&!mobile.matches?unit*(1+t1-t2):demo?unit:px('--service-square')*(1+t1)}px`;
  if(demo){const stageHeight=210+(mobile.matches?218*(t1-t2):0);imageStage.style.height=`${stageHeight}px`;section.style.setProperty('--demo-stage-height',`${stageHeight}px`);}
  servicesLabel.style.width=imageStage.style.width;
  servicesLabel.style.height=`${labels[0].offsetHeight*(1-t1)+labels[1].offsetHeight*t1}px`;
  images.forEach((e,i)=>{e.style.opacity=opacities[i];labels[i].style.opacity=opacities[i];});
  window.FitloopHowDemo?.update({opacities,active:active===1,opening,out});
  servicesLabel.dataset.current=String(opacities.indexOf(Math.max(...opacities)));flow.style.opacity=1-out;
  blocks.forEach((block,i)=>{
   const photoCenterOffset=mobile.matches?0:frame.offsetTop+frame.clientHeight/2-h/2+(demo?30:0);
   const anchorY=h+80-y+i*item+photoCenterOffset,title=block.querySelector('.service-title'),copy=block.querySelector('.service-copy');
   if(mobile.matches){title.style.top=`${anchorY}px`;copy.style.top=`${anchorY+gap}px`;}
   else{
    // The scroll anchor belongs to the whole title/copy group, so its center passes the photo's center.
    const titleHeight=title.offsetHeight,copyHeight=copy.offsetHeight,top=anchorY-(titleHeight+gap+copyHeight)/2;
    title.style.top=`${top}px`;copy.style.top=`${top+titleHeight+gap}px`;
   }
   block.setAttribute('aria-hidden',String(Math.floor(y/item)!==i||out>0));
  });
  updateTextSplit();
  finale.style.visibility=out>0?'visible':'hidden';finale.style.opacity=out;finale.style.transform=`translateY(${30*(1-out)}px)`;finale.inert=out<.99||active!==1;finale.setAttribute('aria-hidden',String(out<.99));
  section.dataset.phase=out>0?'finale':String(Math.min(2,Math.floor(y/item))+1);section.dataset.scroll=y.toFixed(1);section.dataset.scrollEnd=total.toFixed(1);
  const phase=out>.99?3:Math.min(2,Math.floor(y/item));if(active===1&&phase!==announced){announced=phase;document.querySelector('.section-announcer').textContent=phase===3?'Your style. A new perspective. Try it with an example.':`${phase+1}. ${blocks[phase].querySelector('h3').textContent}`;}
 }
 // Exact measured obstacle/row displacement algorithm from Offform Services.
    function updateTextSplit() {

        const imageRect =
            imageStage.getBoundingClientRect();


        const labelRect =
            labels[Number(servicesLabel.dataset.current)||0].getBoundingClientRect();


        /*
         * COPY + SERVICE TITLES avoid the complete visual unit:
         * SERVICES label + gap + image.
         * Both the regular copy rows and the titles split into
         * left/right halves while crossing the obstacle, then
         * close back together only after passing above SERVICES.
         */
        const obstacleTop =
            Math.min(
                labelRect.top,
                imageRect.top
            );


        const obstacleBottom =
            imageRect.bottom;
        const frameRect = frame.getBoundingClientRect();
        const sideStrip = px('--opening-edge');
        const darkLeft = frameRect.left + sideStrip;
        const darkRight = frameRect.right - sideStrip;


        const styles =
            getComputedStyle(section);


        const clearance =
            parseFloat(
                styles.getPropertyValue(
                    "--service-image-clearance"
                )
            ) ||
            35;


        const avoidDistance =
            parseFloat(
                styles.getPropertyValue(
                    "--service-avoid-distance"
                )
            ) ||
            100;


        const targetLeft =
            imageRect.left -
            clearance;


        const targetRight =
            imageRect.right +
            clearance;


        const lines =
            section.querySelectorAll(
                ".service-line, .service-title-line"
            );


        lines.forEach(
            function (line) {

                const leftText =
                    line.querySelector(
                        ".service-text-half--left"
                    );


                const rightText =
                    line.querySelector(
                        ".service-text-half--right"
                    );


                if (
                    !leftText ||
                    !rightText
                ) {
                    return;
                }


                line.style.setProperty(
                    "--left-shift",
                    "0px"
                );


                line.style.setProperty(
                    "--right-shift",
                    "0px"
                );


                const lineRect =
                    line.getBoundingClientRect();


                const leftRect =
                    leftText.getBoundingClientRect();


                const rightRect =
                    rightText.getBoundingClientRect();


                const lineCenterY =
                    lineRect.top +
                    lineRect.height /
                    2;


                let influence =
                    0;


                /* BELOW IMAGE */

                if (
                    lineCenterY >
                    obstacleBottom
                ) {

                    const distance =
                        lineCenterY -
                        obstacleBottom;


                    if (
                        distance <
                        avoidDistance
                    ) {

                        influence =
                            smooth(
                                1 -
                                (
                                    distance /
                                    avoidDistance
                                )
                            );

                    }

                }


                /* BESIDE IMAGE */

                else if (
                    lineCenterY >=
                    obstacleTop &&
                    lineCenterY <=
                    obstacleBottom
                ) {

                    influence =
                        1;

                }


                /* ABOVE IMAGE */

                else {

                    const distance =
                        obstacleTop -
                        lineCenterY;


                    if (
                        distance <
                        avoidDistance
                    ) {

                        influence =
                            smooth(
                                1 -
                                (
                                    distance /
                                    avoidDistance
                                )
                            );

                    }

                }


                const leftStyle =
                    getComputedStyle(
                        leftText
                    );


                const rightStyle =
                    getComputedStyle(
                        rightText
                    );


                const leftPadding =
                    parseFloat(
                        leftStyle.paddingRight
                    ) ||
                    0;


                const rightPadding =
                    parseFloat(
                        rightStyle.paddingLeft
                    ) ||
                    0;


                const realLeftEdge =
                    leftRect.right -
                    leftPadding;


                const realRightEdge =
                    rightRect.left +
                    rightPadding;


                // The hero's widely tracked label can be wider than its photograph.
                // Extend avoidance using the actual label bounds as a row crosses it.
                const labelDistance = Math.max(labelRect.top - lineCenterY, lineCenterY - labelRect.bottom, 0);
                const labelInfluence = smooth(1 - clamp(labelDistance / avoidDistance));
                const rowTargetLeft = Math.min(targetLeft, targetLeft + (labelRect.left - leftPadding - targetLeft) * labelInfluence);
                const rowTargetRight = Math.max(targetRight, targetRight + (labelRect.right + rightPadding - targetRight) * labelInfluence);

                const neededLeftShift =
                    Math.max(
                        0,
                        realLeftEdge -
                        rowTargetLeft
                    );


                const neededRightShift =
                    Math.max(
                        0,
                        rowTargetRight -
                        realRightEdge
                    );


                const finalLeftShift = Math.min(neededLeftShift * influence, Math.max(0, leftRect.left - darkLeft));


                const finalRightShift = Math.min(neededRightShift * influence, Math.max(0, darkRight - rightRect.right));


                line.style.setProperty(
                    "--left-shift",
                    finalLeftShift.toFixed(2) +
                    "px"
                );


                line.style.setProperty(
                    "--right-shift",
                    finalRightShift.toFixed(2) +
                    "px"
                );

            }
        );

    }
 function access(){const menu=document.body.classList.contains('menu-is-open');screens.forEach((e,i)=>{e.inert=i!==active||menu;e.setAttribute('aria-hidden',String(i!==active));});finale.inert=active!==1||menu||finale.getAttribute('aria-hidden')==='true';}
 function ready(){return !document.body.classList.contains('save-flow-running')&&document.body.classList.contains('experience-ready')&&!document.body.classList.contains('intro-running');}
 const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
 function split(to,duration=1450){const from=opening;if(reduced.matches){renderOpening(to);return Promise.resolve();}return new Promise(resolve=>{let start;function tick(t){start??=t;const p=clamp((t-start)/duration);renderOpening(from+(to-from)*p);if(p<1)requestAnimationFrame(tick);else resolve();}requestAnimationFrame(tick);});}
 // The closed photograph zooms into its white upper-right corner.
 function renderZoom(p){zoom=p;document.body.classList.toggle('nav-on-white',p>=.55);const eased=smooth(p),scale=Math.pow(64,eased);frame.style.transform=`translate3d(0,${-frame.offsetTop*eased}px,0) scale(${scale})`;document.body.style.setProperty('--nav-ink',String(eased));section.querySelector('.white-wash').style.opacity=String(smooth((p-.55)/.45));}
 function zoomTo(to,duration=1100){const from=zoom;if(reduced.matches){renderZoom(to);return Promise.resolve();}return new Promise(resolve=>{let start;function run(t){start??=t;const p=clamp((t-start)/duration);renderZoom(from+(to-from)*p);if(p<1)requestAnimationFrame(run);else resolve();}requestAnimationFrame(run);});}
 async function whiteHandoff(from,to){document.body.classList.add('white-handoff');screens[to].classList.add('is-active');screens[from].classList.remove('is-active');await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));document.body.classList.remove('white-handoff');}
 async function show(index){
  if(index<0||index>=screens.length||index===active||locked||!ready()||document.body.classList.contains('menu-is-open'))return;
  locked=true;wheelBlocked=true;wheelSum=0;screens[active].inert=true;cancelAnimationFrame(raf);raf=0;last=0;
  const previous=active,navbar=document.querySelector('.ct_cr-navbar');navbar.inert=true;
  try{
   if(previous===2&&index!==3)await window.FitloopFitting?.exit(index);
   if(previous===3&&index!==2)screens[2].classList.remove('fitting-suspended');
   if((previous===2&&index===3)||(previous===3&&index===2)){
    screens[2].classList.toggle('fitting-suspended',index===3);renderZoom(1);
    const handoff=window.FitloopSavedTransition;
    if(handoff?.canRun(previous,index)){
     await handoff.play(previous,index,()=>whiteHandoff(previous,index));
    }else if(previous===2&&index===3&&handoff?.browse){
     await handoff.browse(()=>whiteHandoff(previous,index));
    }else if(previous===3&&index===2&&!reduced.matches){
     document.body.classList.add('saved-view-transition');
     screens[index].classList.add('is-active');screens[previous].classList.remove('is-active');
     try{await wait(900);}finally{document.body.classList.remove('saved-view-transition');}
    }else await whiteHandoff(previous,index);
   }else if(index===2&&previous===1){
    section.classList.add('is-exiting');finale.inert=true;section.dataset.exitPhase='closing';await split(0);
    section.dataset.exitPhase='zooming';await zoomTo(1);
    await whiteHandoff(1,2);section.dataset.exitPhase='white';
   }else if(index===1&&previous===2){
    current=target=metrics().total;
    if(reduced.matches){
     section.classList.remove('is-exiting');
     renderOpening(1);renderZoom(0);renderFlow(current);
     await whiteHandoff(2,1);
    }else{
     section.classList.add('is-exiting','is-returning');
     renderFlow(current);renderOpening(0);renderZoom(1);
     section.classList.add('is-active');screens[2].classList.remove('is-active');
     section.dataset.exitPhase='unzooming';await zoomTo(0,850);
     finale.animate([{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],
      {duration:900,delay:150,easing:'cubic-bezier(.22,1,.36,1)',fill:'backwards'});
     section.classList.remove('is-exiting');
     section.dataset.exitPhase='opening';await split(1,1100);
     current=target=metrics().total;
    }
   }else if(index===1){
    current=target=0;renderFlow(0);renderZoom(0);section.classList.remove('is-exiting');renderOpening(0);section.classList.add('is-active');screens[previous].classList.remove('is-active');section.setAttribute('aria-hidden','false');if(!reduced.matches)await wait(650);await split(1);
   }else if(index===0){
    if(previous===1){current=target=0;renderFlow(0);await split(0);}screens[0].classList.add('is-active');screens[previous].classList.remove('is-active');renderZoom(0);if(!reduced.matches)await wait(650);
   }else{renderZoom(1);screens[index].classList.add('is-active');screens[previous].classList.remove('is-active');if(!reduced.matches)await wait(650);}
  }catch(error){
   console.error('Section transition recovered',error);
   screens.forEach((screen,i)=>screen.classList.toggle('is-active',i===index));renderZoom(index>=2?1:0);
   if(index===1){section.classList.remove('is-exiting');renderOpening(1);}
  }finally{
   if(index===3&&previous!==3)document.body.dataset.savedOrigin=screenHashes[previous];
   active=index;document.body.dataset.screen=String(index);locked=false;wheelBlocked=index===2;navbar.inert=false;access();
   if(index===1){
    section.classList.remove('is-exiting','is-returning');
    delete section.dataset.exitPhase;
    renderFlow(current);
   }
   history.replaceState(null,'',location.pathname+location.search+screenHashes[index]);document.getElementById(headingIds[index]).focus({preventScroll:true});
   if(index===2)document.querySelector('.section-announcer').textContent='Your fitting room.';
   document.dispatchEvent(new CustomEvent('fitloop-screen',{detail:{index}}));
   if(skipToHero){skipToHero=false;if(active!==0)queueMicrotask(()=>show(0));}
  }
 }
 function tick(t){const dt=last?Math.min(50,t-last):16;last=t;current=reduced.matches?target:current+(target-current)*(1-Math.exp(-dt/90));if(Math.abs(target-current)<.1)current=target;renderFlow(current);if(current!==target)raf=requestAnimationFrame(tick);else{raf=0;last=0;}}
 function fittingReady(){return active!==2||screens[2].classList.contains('fitting-arrived');}
 function advance(delta){if(locked||!ready()||!fittingReady()||document.body.classList.contains('menu-is-open'))return;if(active===0){if(delta>0)show(1);return;}if(active===2)return;if(active===3)return;if(delta>0&&target>=metrics().total&&current>=metrics().total-1){show(2);return;}if(delta<0&&target<=0&&current<1){show(0);return;}target=clamp(target+delta,0,metrics().total);if(!raf)raf=requestAnimationFrame(tick);}
 window.FitloopSections={navigate(href){const index=screenHashes.indexOf(href);if(index>=0)show(index);}};
 document.addEventListener('fitloop-skip-to-hero',()=>{skipToHero=true;if(!locked&&ready()){skipToHero=false;if(active!==0)show(0);}});
 document.addEventListener('click',event=>{const a=event.target.closest('a');if(!a)return;const href=a.getAttribute('href');if(!screenHashes.includes(href)&&href!=='#wardrobe-track')return;event.preventDefault();show(href==='#wardrobe-track'?0:screenHashes.indexOf(href));});
 // A wheel gesture may outlive both the section handoff and the model intro.
 // Consume its tail until the view is ready AND the wheel has been quiet for 240 ms.
 window.addEventListener('wheel',event=>{
  const openPanel=event.target.closest('.fitting-panel.is-open');
  if(event.ctrlKey||active===3||event.target.closest('.look-switcher,.fitting-measurement-wheel,.stylist-scope'))return;
  if(openPanel){const scroll=event.target.closest('.fitting-panel-scroll,.local-panel-viewport');if(!scroll){const viewport=openPanel.querySelector?.('.local-panel-viewport');if(viewport){event.preventDefault();viewport.scrollTop+=event.deltaY;}}return;}
  if(active===2&&document.querySelector('.fitting-room.is-replacing')){if(!event.target.closest('.fitting-rail'))event.preventDefault();return;}
  const now=performance.now(),freshGesture=now-lastWheelAt>240;lastWheelAt=now;
  if(active===2&&event.target.closest('.fitting-model-factory'))return;
  const horizontal=Math.abs(event.deltaX)>Math.abs(event.deltaY);
  if(horizontal&&((active===2&&event.target.closest('.fitting-rail'))||(active===0&&event.target.closest('#wardrobe-track'))))return;
  event.preventDefault();event.stopPropagation();
  // Discard the entering gesture; section two opens at its untouched first frame.
  if(locked){wheelBlocked=true;return;}
  if(!ready()||!fittingReady()||document.body.classList.contains('menu-is-open')){wheelBlocked=true;return;}
  if(active===2&&wheelBlocked&&!freshGesture)return;
  wheelBlocked=false;
  const delta=event.deltaY*(event.deltaMode===1?16:event.deltaMode===2?section.clientHeight:1);
  if(active===0){const time=Date.now();if(time-wheelTime>200)wheelSum=0;wheelTime=time;wheelSum+=delta;if(wheelSum>=60){show(1);wheelSum=0;}}else advance(delta);
 },{passive:false,capture:true});
 window.addEventListener('keydown',event=>{if(active===3||event.target.closest('.stylist-scope'))return;if(active===2&&document.querySelector('.fitting-room.is-replacing')){if(['ArrowRight','ArrowLeft','ArrowDown','ArrowUp','PageDown','PageUp','Home','End'].includes(event.key))event.preventDefault();return;}if(event.target.closest('.fitting-model-factory,.fitting-panel,.look-switcher'))return;if(event.ctrlKey||event.altKey||event.metaKey||event.target.closest('input,textarea,select,[contenteditable]')||document.body.classList.contains('menu-is-open'))return;
 if(active===2&&event.repeat&&['ArrowRight','ArrowLeft','ArrowDown','ArrowUp','PageDown','PageUp',' '].includes(event.key)){event.preventDefault();return;}
 if(active===2&&event.target.closest('.fitting-room')&&['ArrowLeft','Escape'].includes(event.key))return;if(event.key===' '&&event.target.closest('button,a'))return;let delta=0;if(['PageDown',' '].includes(event.key))delta=section.clientHeight*.8;if(event.key==='ArrowDown')delta=80;if(event.key==='PageUp')delta=-section.clientHeight*.8;if(event.key==='ArrowUp')delta=-80;if(delta){event.preventDefault();event.stopPropagation();advance(delta);}if(event.key==='Home'){event.preventDefault();show(0);}if(event.key==='End'&&active===1){event.preventDefault();target=metrics().total;if(!raf)raf=requestAnimationFrame(tick);} },true);
 window.addEventListener('touchstart',event=>{if(event.touches.length!==1||event.target.closest('.fitting-panel,.look-switcher,.fitting-rail,.ct_cr-menu,.stylist-scope,button,a,input')){touch=null;return;}touch={screen:active,x:event.touches[0].clientX,y:event.touches[0].clientY,lastY:event.touches[0].clientY};},{passive:true});
 window.addEventListener('touchmove',event=>{if(active===3||!touch||event.touches.length!==1||document.body.classList.contains('menu-is-open'))return;const t=event.touches[0],dy=touch.y-t.clientY,dx=touch.x-t.clientX;if(active>0||!event.target.closest('#wardrobe-track'))event.preventDefault();if(active===touch.screen&&active>0&&Math.abs(dy)>Math.abs(dx)){const delta=touch.lastY-t.clientY;advance(delta);}touch.lastY=t.clientY;},{passive:false});
 window.addEventListener('touchend',event=>{if(!touch||!event.changedTouches.length)return;const t=event.changedTouches[0],dy=touch.y-t.clientY,dx=touch.x-t.clientX;if(active===0&&dy>50&&dy>Math.abs(dx)*1.2)show(1);touch=null;},{passive:true});window.addEventListener('touchcancel',()=>{touch=null;},{passive:true});
 document.addEventListener('fitloop-menu',access);window.addEventListener('resize',()=>{target=clamp(target,0,metrics().total);current=Math.min(current,target);geometry();});window.addEventListener('hashchange',()=>{const index=screenHashes.indexOf(location.hash==='#fourth'?'#next':location.hash);if(index>=0)show(index);});
 document.addEventListener('fitloop-how-layout',geometry);
 geometry();access();const initial=Math.max(0,screenHashes.indexOf(location.hash==='#fourth'?'#next':location.hash));if(initial&&ready())show(initial);else if(initial){const observer=new MutationObserver(()=>{if(ready()){observer.disconnect();const destination=screenHashes.indexOf(location.hash==='#fourth'?'#next':location.hash);if(destination>0)show(destination);}});observer.observe(document.body,{attributes:true,attributeFilter:['class']});}
})();
