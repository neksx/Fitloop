'use strict';
(() => {
 const section=document.querySelector('.fitting-room'),stage=section?.querySelector('.fitting-stage'),heroButton=document.querySelector('.culture-ctas>.button');if(!stage||!heroButton)return;
 // Separate fitting-room glass surface; the source hero CTA remains untouched.
 const host=document.createElement('div');host.className='fitting-model-factory';
 const trigger=heroButton.cloneNode(true);trigger.classList.remove('svg-glass-button');trigger.classList.add('fitting-add');trigger.id='add-model';trigger.type='button';trigger.removeAttribute('data-action');trigger.setAttribute('aria-label','Add model');trigger.setAttribute('aria-expanded','false');trigger.setAttribute('aria-controls','fitting-panel');
 trigger.innerHTML='<i class="fitting-glass-art" aria-hidden="true"></i><i class="fitting-glass-pane" aria-hidden="true"></i><span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg></span>';
 host.append(trigger);const mobile=matchMedia('(max-width:767px)'),place=()=>{(mobile.matches?section:stage).append(host);};place();mobile.addEventListener('change',place);trigger.addEventListener('click',()=>window.FitloopFitting.openCreate());
})();
