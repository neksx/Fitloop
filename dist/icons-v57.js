'use strict';
(() => {
 // Reference: Purple Brand navigation, measured at 1440px; 1px strokes.
 const closePath='M.865 15.978a.5.5 0 0 0 .707.707l7.433-7.431 7.579 7.282a.501.501 0 0 0 .846-.37.5.5 0 0 0-.153-.351L9.712 8.546l7.417-7.416a.5.5 0 1 0-.707-.708L8.991 7.853 1.413.573a.5.5 0 1 0-.693.72l7.563 7.268z';
 const seen=new WeakSet();
 function normalize(root){
  const icons=[...(root.matches?.('svg')?[root]:[]),...root.querySelectorAll('svg')];
  for(const svg of icons){
   if(seen.has(svg)||svg.querySelector('image')||svg.closest('.ct_cr-navbar__logo,.loading'))continue;
   seen.add(svg);
   if(svg.closest('.icon--close,.fitting-close')){
    svg.setAttribute('viewBox','0 0 18 17');svg.innerHTML=`<path fill="currentColor" d="${closePath}"/>`;
   }else if(svg.closest('.icon--hamburger')){
    svg.querySelectorAll('rect').forEach(r=>{r.setAttribute('height','1');r.setAttribute('rx','0');r.setAttribute('fill','currentColor');});
   }
   for(const shape of svg.querySelectorAll('path,line,polyline,polygon,rect,circle,ellipse')){
    if(getComputedStyle(shape).stroke==='none')continue;
    shape.style.strokeWidth='1px';shape.style.vectorEffect='non-scaling-stroke';
   }
   svg.classList.add('fitloop-ui-icon');
  }
 }
 normalize(document);
 new MutationObserver(records=>{for(const record of records)for(const node of record.addedNodes)if(node.nodeType===1)normalize(node);}).observe(document.body,{childList:true,subtree:true});
})();
