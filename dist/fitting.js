'use strict';
(() => {
 const section=document.querySelector('.fitting-room');
 if(!section)return;
 const $=s=>section.querySelector(s), models=$('#fitting-models'),stage=$('.fitting-stage'),panel=$('#fitting-panel'),content=$('#fitting-panel-content'),filters=$('#fitting-filters'),track=$('#fitting-track'),name=$('#look-name'),thumbs=$('#look-thumbnails'),save=$('#save-look'),status=$('#fitting-status');
 const panelProducts=$('#fitting-products-bar');
 const desktopActions=matchMedia('(min-width:768px) and (hover:hover) and (pointer:fine)');
 const panelViewport=document.createElement('div'),panelInner=document.createElement('div');panelViewport.className='local-panel-viewport';panelInner.className='local-panel-inner';
 panelInner.append(...panel.childNodes);panelViewport.append(panelInner);panel.append(panelViewport);
 const savedLink=document.createElement('p');savedLink.className='local-saved-link';savedLink.innerHTML='My saved looks. <a href="#saved">GO TO</a>';panelInner.append(savedLink);
 const savedReturn=document.createElement('div');savedReturn.className='local-saved-return';savedReturn.hidden=true;savedReturn.innerHTML='<span class="return-label">My saved looks.</span> <a href="#saved">BACK</a><span class="local-return-time">10 sec</span>';section.append(savedReturn);
 const pageReturn=document.createElement('div');pageReturn.className='local-saved-return fitting-page-return';pageReturn.innerHTML='<span class="return-label">Website pages.</span><a href="#how">BACK</a>';section.append(pageReturn);
 let returnInterval=0,returnDeadline=0,pendingReturn=false,returnVersion=0;
 function clearSavedReturn(immediate=false){clearInterval(returnInterval);const version=++returnVersion;savedReturn.getAnimations().forEach(a=>a.cancel());if(immediate||savedReturn.hidden||matchMedia('(prefers-reduced-motion:reduce)').matches){savedReturn.hidden=true;return;}savedReturn.animate([{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(-4px)'}],{duration:180,fill:'forwards'}).finished.then(()=>{if(version===returnVersion)savedReturn.hidden=true;}).catch(()=>{});}
 function showSavedReturn(){clearSavedReturn(true);returnDeadline=Date.now()+10000;savedReturn.hidden=false;savedReturn.animate([{opacity:0,transform:'translateY(4px)'},{opacity:1,transform:'translateY(0)'}],{duration:240});const update=()=>{const seconds=Math.ceil((returnDeadline-Date.now())/1000);if(seconds<=0){clearSavedReturn();return;}savedReturn.querySelector('.local-return-time').textContent=`${seconds} sec`;};update();returnInterval=setInterval(update,200);}
 [savedLink,savedReturn].forEach(el=>el.addEventListener('click',event=>{if(event.target.closest('a')){if(el===savedReturn)window.FitloopSavedTransition?.requestBack();clearSavedReturn();if(panel.classList.contains('is-open'))closePanel();}}));

 new ResizeObserver(()=>panel.style.setProperty('--fitting-items-height',`${panelProducts.getBoundingClientRect().height}px`)).observe(panelProducts);
 const nameLimit=10;
 const graphemes=typeof Intl.Segmenter==='function'?new Intl.Segmenter(undefined,{granularity:'grapheme'}):null;
 const limitName=value=>(graphemes?[...graphemes.segment(String(value))].map(item=>item.segment):Array.from(String(value))).slice(0,nameLimit).join('');
 name.removeAttribute('maxlength');name.setAttribute('aria-description','Up to 10 characters.');
 const nameMeasure=document.createElement('span');nameMeasure.className='look-name-measure';nameMeasure.setAttribute('aria-hidden','true');name.after(nameMeasure);
 const nameLimitButton=document.createElement('button');nameLimitButton.type='button';nameLimitButton.className='look-name-limit';nameLimitButton.setAttribute('aria-expanded','false');
 nameLimitButton.innerHTML='<span class="look-limit-icon" aria-hidden="true">!</span><span class="look-limit-value" aria-hidden="true">0 / 10</span><span class="fitting-thin-corners" aria-hidden="true"><i></i><i></i><i></i><i></i></span>';nameMeasure.after(nameLimitButton);
 const nameLength=value=>graphemes?[...graphemes.segment(value)].length:Array.from(value).length;
 function updateNameLimit(){const count=nameLength(name.value),reached=count>=nameLimit;nameLimitButton.querySelector('.look-limit-value').textContent=`${count} / ${nameLimit}`;nameLimitButton.setAttribute('aria-label',`Look name: ${count} of ${nameLimit} characters`);nameLimitButton.classList.toggle('is-limit-reached',reached);const automatic=document.activeElement===name&&reached,open=automatic||nameLimitButton.dataset.pinned==='true';nameLimitButton.classList.toggle('is-limit-open',open);nameLimitButton.setAttribute('aria-expanded',String(open||desktopActions.matches&&nameLimitButton.matches(':hover,:focus-visible')));}
 nameLimitButton.addEventListener('click',()=>{nameLimitButton.dataset.pinned=String(nameLimitButton.dataset.pinned!=='true');updateNameLimit();});
 for(const event of ['focus','blur'])name.addEventListener(event,()=>{nameLimitButton.dataset.pinned='false';updateNameLimit();});
 nameLimitButton.addEventListener('pointerenter',updateNameLimit);nameLimitButton.addEventListener('pointerleave',updateNameLimit);
 nameLimitButton.addEventListener('blur',()=>{nameLimitButton.dataset.pinned='false';updateNameLimit();});
 function sizeLookName(){
  name.title=name.value;const style=getComputedStyle(name);nameMeasure.style.font=style.font;nameMeasure.style.letterSpacing=style.letterSpacing;nameMeasure.style.textTransform=style.textTransform;
  nameMeasure.textContent='WWWWWWWWWW';const widest=nameMeasure.getBoundingClientRect().width;
  section.style.setProperty('--look-switcher-fixed-width',`${matchMedia('(max-width:767px)').matches?188:Math.max(308,Math.ceil(widest)+210)}px`);
  nameMeasure.style.font=getComputedStyle($('.look-count')).font;nameMeasure.textContent='10 / 10';nameLimitButton.style.setProperty('--limit-expanded-width',`${Math.ceil(nameMeasure.getBoundingClientRect().width)+12}px`);
  nameMeasure.style.font=style.font;nameMeasure.textContent=name.value||' ';name.style.setProperty('--look-name-width',`${Math.ceil(nameMeasure.getBoundingClientRect().width)}px`);updateNameLimit();
 }
 document.fonts.ready.then(sizeLookName);
 const headingMeasure=document.createElement('canvas').getContext('2d');
 function alignPanelHeading(){
  const title=$('#fitting-panel-title'),kicker=$('#fitting-panel-kicker');if(!headingMeasure||!title?.textContent||!kicker?.textContent)return;
  const bearing=element=>{const style=getComputedStyle(element),text=style.textTransform==='uppercase'?element.textContent.toLocaleUpperCase():element.textContent;headingMeasure.font=`${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;return headingMeasure.measureText(text).actualBoundingBoxLeft||0;};
  title.style.setProperty('--title-optical-offset',`${bearing(title)-bearing(kicker)}px`);
 }

 const close=$('.fitting-close'),panelActions=document.createElement('div'),removeModel=document.createElement('button');panelActions.className='fitting-panel-actions';removeModel.className='fitting-remove';removeModel.type='button';removeModel.setAttribute('aria-label','Delete model');removeModel.title='Delete model';removeModel.hidden=true;removeModel.innerHTML='<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.00585" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2.83 5.47h14.34M5.75 5.47 7.48 2h5.04l1.89 3.47M4.64 5.47v10.87a1.65 1.65 0 0 0 1.65 1.66h7.49a1.66 1.66 0 0 0 1.66-1.66V5.47"/></svg>';close.before(panelActions);panelActions.append(removeModel,close);
 const undo=document.createElement('button');undo.className='fitting-undo fitting-glass';undo.type='button';undo.id='undo-look';undo.disabled=true;undo.setAttribute('aria-label','Undo last change');undo.title='Undo last change';undo.innerHTML='<svg width="24" height="24" viewBox="60 20 180 150" fill="none" stroke="currentColor" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M108 36 77 67l31 31M78 67h95a38 38 0 0 1 0 76h-34"/></svg>';section.append(undo);const actionHistory=[];
 const boundaries=document.createElement('div');boundaries.className='fitting-panel-boundaries';boundaries.setAttribute('aria-hidden','true');boundaries.innerHTML='<i class="fitting-boundary-left"></i><i class="fitting-boundary-right"></i>';section.append(boundaries);
 function updateBoundaries(){
  const menu=document.getElementById('menu-toggle').getBoundingClientRect(),room=section.getBoundingClientRect(),p=panel.getBoundingClientRect(),corners=panel.querySelector('.fitting-motion-options,.fitting-item-row>.fitting-thin-corners');
  const dx=panel.offsetLeft-(p.left-room.left),bounds=corners?.getBoundingClientRect();
  const left=menu.left-room.left,cornerLeft=bounds?bounds.left-room.left+dx:panel.offsetLeft-8,cornerRight=bounds?bounds.right-room.left+dx:panel.offsetLeft+panel.clientWidth+8;
  const gap=cornerLeft-left-1,right=cornerRight+gap;
  boundaries.style.setProperty('--panel-line-left',`${left}px`);boundaries.style.setProperty('--panel-line-right',`${right}px`);boundaries.style.setProperty('--panel-line-end',`${section.querySelector('.fitting-rail').offsetTop}px`);
 }
 const thinCorners=()=>'<span class="fitting-thin-corners" aria-hidden="true"><i></i><i></i><i></i><i></i></span>';
 [close,removeModel].forEach(button=>button.insertAdjacentHTML('beforeend',thinCorners()));
 let undoing=false;
 const updateUndo=()=>{undo.disabled=undoing||!actionHistory.length;undo.setAttribute('aria-label',actionHistory.at(-1)?.type==='delete'?'Undo model deletion':'Undo outfit change');};
 const reduced=matchMedia('(prefers-reduced-motion:reduce)'),key='fitloop-fitting-jeans-v3';
 section.dataset.rotationMode='static';
 const motionOptions=[{id:'static',label:'STATIC'},{id:'jitter',label:'JITTER'},{id:'jitter-sway',label:'JITTER + SWAY'}];
 let motionChoice='jitter-sway';try{const saved=localStorage.getItem('fitloop-model-motion-v1');if(motionOptions.some(option=>option.id===saved))motionChoice=saved;}catch{}
 section.dataset.motionChoice=motionChoice;
 const products=window.FitloopCatalog;
 const productNameLimit=24;
 const productLabel=name=>Array.from(name).length>productNameLimit?Array.from(name).slice(0,productNameLimit-1).join('')+'…':name;
 const outfitState=window.FitloopState,pendingOutfits=new Map();let saving=false;
 const genderMismatch=(id,look)=>outfitState.mismatch(look,id,products[id].gender);
 const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const art=(id,context='row')=>{const p=products[id];if(context==='row'&&p.rowBox)return `<svg class="step-art" viewBox="${p.rowBox}" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><image href="assets/fitting-room/${p.thumb}" width="${p.thumbWidth}" height="${p.thumbHeight}"/></svg>`;return p.thumbTransform?`<svg class="step-art" viewBox="0 0 160 104" aria-hidden="true"><image href="assets/fitting-room/${p.thumb}" width="${p.thumbWidth}" height="${p.thumbHeight}" transform="${p.thumbTransform}"/></svg>`:`<svg class="step-art" viewBox="${p.thumbBox}" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><image href="assets/fitting-room/${p.thumb}" width="${p.thumbWidth}" height="${p.thumbHeight}"/></svg>`;};
 const portraitKey=look=>window.FitloopMotion.portraitKey(look);
 const sprite=look=>`assets/fitting-room/static-${look?.identity&&look.identity!=='original'?look.identity+'-':''}${(({0:'flare',1:'pearl',2:'gradient'})[look?.pants??1]||'pearl')}-v24.png`;
 // One front-facing portrait per outfit; no turntable or photographic interpolation.
 const rotationSets={},portraitRenderers=new Map();
 function warmOtherGender(look){
  if(!hasCreated||!look)return;
  const gender=look.gender==='man'?'woman':'man';
  const identity=gender==='man'?'man':look.femaleIdentity||(look.identity==='original'?'original':'woman');
  window.FitloopMotion.load(portraitKey({...look,gender,identity})).catch(()=>{});
 }
 window.FitloopMotion?.ready.then(data=>{Object.assign(rotationSets,data.sets);renderPeople();warmOtherGender(current());}).catch(()=>{});
 function setFrame(element,look){
  const file=rotationSets[portraitKey(look)]?.previewFile||rotationSets[portraitKey(look)]?.files[0]||sprite(look);
  if(element.dataset.portraitFile===file)return;element.dataset.portraitFile=file;
  element.style.backgroundImage=`url('${file}')`;element.style.backgroundSize='contain';element.style.backgroundPosition='center';element.style.transform='none';
  const alpha=rotationSets[portraitKey(look)]?.alpha;element.style.maskImage=alpha?`url('${alpha}')`:'';element.style.maskSize='contain';element.style.maskPosition='center';element.style.maskRepeat='no-repeat';
 }
 const fallbackImage=new Image();fallbackImage.src=sprite();
 const jacketSizes=['XXS','XS','S','M','L','XL','XXL'],pantSizes=Array.from({length:25},(_,i)=>24+i);
 const createLook=(model,pants,label,details={})=>outfitState.normalize({model,pants,jacket:0,name:limitName(label),angle:0,identity:'original',gender:'woman',height:172,weight:62,jacketSize:'M',pantSize:30,...details,id:details.id||crypto.randomUUID(),name:limitName(details.name??label)});
 let looks=[createLook(0,3,'Look 01',{jacket:6,identity:'woman'})],hasCreated=false,active=0,focus=0,focusVelocity=0,offset=0,last=0,frame=0,mode='look',filter='All',outfitRequest=0,galleryItem=0,galleryPhoto=0,hoverRail=false,focusRail=false,previousFocus=null,thumbWindowStart=0;
 try{const saved=JSON.parse(localStorage.getItem(key)||'null');if(!localStorage.getItem('fitloop-fitting-people-v1')&&saved&&[0,1].includes(saved.model)&&(Number.isInteger(saved.pants)&&saved.pants>=0&&saved.pants<outfitState.bottomIds.length)&&typeof saved.name==='string'){looks=[{...createLook(0,saved.pants,saved.name.slice(0,48))}];hasCreated=true;}}catch{}
 try{const saved=JSON.parse(localStorage.getItem('fitloop-fitting-people-v1')||'null');if(Array.isArray(saved?.looks)&&saved.looks.length){const valid=saved.looks.filter(look=>['original','woman','man'].includes(look.identity)&&['woman','man'].includes(look.gender)&&(Number.isInteger(look.pants)&&look.pants>=0&&look.pants<outfitState.bottomIds.length)&&Number.isFinite(look.height)&&look.height>=140&&look.height<=210&&Number.isFinite(look.weight)&&look.weight>=40&&look.weight<=140);if(valid.length){hasCreated=true;looks=valid.map(look=>createLook(0,look.pants,String(look.name||'Look').slice(0,48),{id:look.id,acknowledged:look.acknowledged,reviewed:look.reviewed,femaleIdentity:look.femaleIdentity,savedId:look.savedId,identity:look.identity,gender:look.gender,height:look.height,weight:look.weight,jacket:[0,4,5,6,7,8].includes(look.jacket)?look.jacket:0,jacketSize:jacketSizes.includes(look.jacketSize)?look.jacketSize:'M',pantSize:pantSizes.includes(look.pantSize)?look.pantSize:30}));active=Math.min(valid.length-1,Math.max(0,Number(saved.active)||0));focus=active;}}}catch{}
 thumbWindowStart=Math.min(active,Math.max(0,looks.length-2));
 function persistPeople(){try{localStorage.setItem('fitloop-fitting-people-v1',JSON.stringify({looks:(hasCreated?looks:[]).map(({id,savedId,name,identity,gender,height,weight,pants,jacket,jacketSize,pantSize,acknowledged,reviewed,femaleIdentity})=>({id,savedId,name,identity,gender,height,weight,pants,jacket,jacketSize,pantSize,acknowledged,reviewed,femaleIdentity})),active}));}catch{}}
 const measurementFields=[{id:'gender',label:'GENDER',values:['woman','man']},{id:'height',label:'HEIGHT',values:Array.from({length:71},(_,i)=>140+i),suffix:' CM'},{id:'weight',label:'WEIGHT',values:Array.from({length:101},(_,i)=>40+i),suffix:' KG'},{id:'jacketSize',label:'TOPS',values:jacketSizes},{id:'pantSize',label:'BOTTOMS',values:pantSizes}];
 let draft=null;
 const liveDesktop=matchMedia('(min-width:768px)'),livePreviews=new Map(),femaleIdentities=new Map();
 const measurementDraft=person=>Object.fromEntries(measurementFields.map(field=>[field.id,person[field.id]]));
 function current(){return looks[active];}
 function productIds(){return productIdsFor(current());}
 function productRow(id){
  const product=products[id],label=escape(productLabel(product.name)),audience=product.gender==='man'?'men':'women';
  if(genderMismatch(id,current()))return `<div class="fitting-item-row is-gender-mismatch" role="group" aria-label="${escape(product.name)} — designed for ${audience}"><span class="service-product">${art(id)}</span><span class="fitting-item-copy"><span class="fitting-item-name" title="${escape(product.name)}">${label}</span><span class="fitting-item-hint">Designed for ${audience}.</span></span><span class="fitting-item-actions"><button type="button" data-keep-product="${id}">KEEP</button><button type="button" data-replace-category="${product.category}">REPLACE</button></span>${thinCorners()}</div>`;
  return `<div class="fitting-item-row" role="group" aria-label="${escape(product.name)}"><span class="service-product">${art(id)}</span><button class="fitting-item-name fitting-item-open" data-product="${id}" title="${escape(product.name)}" aria-label="View all photos of ${escape(product.name)}">${label}</button><span class="fitting-item-actions"><button type="button" data-product="${id}" aria-label="View ${escape(product.name)}">VIEW</button></span>${thinCorners()}</div>`;
 }
 function updateFitNotices(){
  if(!draft)return;
  for(const field of ['jacketSize','pantSize']){
   const notice=content.querySelector(`[data-fit-notice="${field}"]`);if(!notice)continue;
   const range=outfitState.fit(draft,field);notice.hidden=!range.outside;
   notice.querySelector('.fit-range').textContent=`154–194 CM · ${range.min}–${range.max} KG`;
   const info=notice.parentElement.querySelector('.fit-info');if(info){info.querySelector('[data-fit-weight]').textContent=`${range.min}–${range.max} KG`;if(!range.outside){notice.setAttribute('aria-expanded','false');info.hidden=true;notice.parentElement.classList.remove('is-fit-expanded');}}
   notice.title=`Visual estimate for ${range.height} cm: ${range.min}–${range.max} kg. Confirm the garment’s measurements.`;
   notice.style.setProperty('--fit-base-width',`${notice.querySelector('.fit-label').getBoundingClientRect().width+20}px`);
   notice.style.setProperty('--fit-range-width',`${Math.ceil(notice.querySelector('.fit-range').getBoundingClientRect().width)+12}px`);
  }
 }
 function refreshProductRows(){if(mode==='look'){panelProducts.innerHTML=productIds().map(productRow).join('');updateFitNotices();}}
 function announce(text){status.textContent=text;}
 function renderPeople(){
  section.classList.toggle('fitting-no-model',!hasCreated);
  if(!hasCreated){models.replaceChildren();thumbs.replaceChildren();updateGeometry();updateUndo();return;}
  // Keep buttons/canvases alive across selection; no texture or transform reset.
  const existing=new Map([...models.children].map(button=>[button.dataset.personId,button]));
  looks.forEach((look,i)=>{
   let button=existing.get(look.id);
   if(!button){
    button=document.createElement('button');button.type='button';button.className='fitting-person';button.dataset.personId=look.id;
    button.innerHTML='<span class="fitting-photo" role="img"><span class="fitting-sprite"></span><span class="fitting-sprite"></span></span><span class="fitting-corners" aria-hidden="true"><i></i><i></i><i></i><i></i></span>';
    const canvas=Object.assign(document.createElement('canvas'),{className:'fitting-motion',width:1536,height:2048});button.prepend(canvas);
    if(window.FitloopMotion){try{portraitRenderers.set(look.id,new window.FitloopMotion.Motion(canvas));}catch{}}
    models.append(button);
   }
   existing.delete(look.id);button.dataset.look=String(i);button.classList.toggle('is-selected',i===active);button.setAttribute('aria-pressed',String(i===active));button.setAttribute('aria-label',`${look.name} — ${i===active?'view clothes':'select model'}`);
   button.querySelector('.fitting-photo').setAttribute('aria-label',`${look.gender==='man'?'Man':'Woman'} wearing ${products[productIdsFor(look)[1]].name} and ${products[productIdsFor(look)[0]].name}`);
  });
  existing.forEach(button=>button.remove());
  const oldThumbs=new Map([...thumbs.children].map(el=>[el.dataset.personId,{element:el,left:el.getBoundingClientRect().left}]));
  const mobileThumbs=matchMedia('(max-width:767px)').matches,thumbLimit=mobileThumbs?2:3;
  const first=Math.max(0,Math.min(mobileThumbs?thumbWindowStart:active-1,looks.length-thumbLimit)),visible=looks.slice(first,first+thumbLimit),visibleIds=new Set(visible.map(look=>look.id));
  thumbs.style.setProperty('--visible-thumbnails',String(visible.length));
  oldThumbs.forEach(({element},id)=>{if(!visibleIds.has(id)){element.getAnimations().forEach(a=>a.cancel());element.remove();}});
  visible.forEach((look,j)=>{
   const i=first+j;let button=oldThumbs.get(look.id)?.element;
   if(!button){button=document.createElement('button');button.type='button';button.className='look-thumbnail';button.dataset.personId=look.id;button.innerHTML=`<span class="fitting-sprite"></span>${thinCorners()}`;}
   button.dataset.selectLook=String(i);button.setAttribute('aria-label',`Select ${look.name}, model ${i+1} of ${looks.length}`);button.setAttribute('aria-pressed',String(i===active));thumbs.append(button);setFrame(button.querySelector('.fitting-sprite'),look);
  });
  [...thumbs.children].forEach(button=>{
   const previous=oldThumbs.get(button.dataset.personId);button.getAnimations().forEach(a=>a.cancel());
   const dx=previous?previous.left-button.getBoundingClientRect().left:0;
   if(!reduced.matches&&!previous)button.animate([{opacity:0,transform:mobileThumbs?'translateX(28px)':'none'},{opacity:button.getAttribute('aria-pressed')==='true'?1:.4,transform:'translateX(0)'}],{duration:450,easing:'ease-in-out'});
   if(!reduced.matches&&Math.abs(dx)>.5)button.animate([{transform:`translateX(${dx}px)`},{transform:'translateX(0)'}],{duration:650,easing:'cubic-bezier(.4,0,.2,1)'});
  });
  name.value=current().name;sizeLookName();$('.look-count').textContent=`${String(active+1).padStart(2,'0')} / ${String(looks.length).padStart(2,'0')}`;
  updateGeometry();renderPositions();updateUndo();if(panel.classList.contains('is-open'))renderPanel();
  looks.forEach(look=>window.FitloopMotion?.load(portraitKey(look)).catch(()=>{}));
 }
 function productIdsFor(look){return outfitState.ids(look);}
 function updateGeometry(){const height=matchMedia('(max-width:767px)').matches?Math.min(stage.clientHeight,(stage.clientWidth-32)/.75):stage.clientHeight;section.style.setProperty('--fitting-model-width',`${height*.75}px`);section.style.setProperty('--fitting-person-height',`${height}px`);updateBoundaries();sizeLookName();alignPanelHeading();}
 // New model centers while preceding models slide left, shrink and fade into white.
 function renderPositions(){
  [...models.children].forEach((button,i)=>{
   const distance=i-focus,d=Math.min(1,Math.abs(distance)),away=d*d*(3-2*d),scale=Math.max(.45,1-.26*Math.abs(distance)),x=distance*.28*stage.clientWidth;
   const n=0,mix=0;
   button.style.zIndex=String(10-Math.min(9,Math.round(Math.abs(distance)*3)));
   button.style.transform=`translateX(calc(-50% + ${x}px)) scale(${scale})`;button.style.opacity=String(1-.62*away);button.style.filter=`saturate(${1-.5*away}) brightness(${1+.12*away})`;
   const layers=button.querySelectorAll('.fitting-photo .fitting-sprite');
   setFrame(layers[0],looks[i],n);setFrame(layers[1],looks[i],n+1);
   layers[0].style.opacity='1';layers[1].style.opacity='0';button.dataset.frame='0';button.dataset.frameCount='1';
   button.dataset.motion=portraitRenderers.get(looks[i].id)?.draw(portraitKey(looks[i]),n,mix,reduced.matches||motionChoice==='static'||Math.abs(active-focus)>.002||document.body.classList.contains('saved-model-handoff'),liveDesktop.matches?looks[i]:null,liveDesktop.matches&&!reduced.matches&&!document.body.classList.contains('saved-model-handoff'))?'ready':'fallback';
   if(button.dataset.motion==='fallback'){layers[0].style.opacity=String(1-mix);layers[1].style.opacity=String(mix);}

  });
  section.dataset.pants=String(current().pants);section.dataset.look=String(active+1);section.dataset.lookCount=String(looks.length);section.dataset.rotation='0';
 }
 function choose(index){if(replacementState)return;window.FitloopSaveFlow?.hideOffer?.();if(!hasCreated||index<0||index>=looks.length)return;thumbWindowStart=index<active?Math.max(0,index-1):Math.min(index,Math.max(0,looks.length-2));active=index;mode='look';draft=measurementDraft(current());renderPeople();warmOtherGender(current());persistPeople();announce(current().name);}
 models.addEventListener('click',event=>{if(replacementState)return;const button=event.target.closest('[data-look]');if(!button)return;const index=Number(button.dataset.look);if(index!==active)choose(index);else if(panel.classList.contains('is-open'))closePanel();else openPanel('look');});
 section.addEventListener('click',event=>{if(!panel.classList.contains('is-open')||event.target.closest('.fitting-panel,.fitting-person,.fitting-model-factory,.look-switcher,.fitting-rail,.fitting-undo,button,a,input'))return;closePanel();});
 thumbs.setAttribute('role','group');thumbs.setAttribute('aria-label','Models — use left and right arrow keys to browse');
 function selectThumbnail(index){choose(index);thumbs.querySelector(`[data-select-look="${active}"]`)?.focus({preventScroll:true});}
 thumbs.addEventListener('click',event=>{const button=event.target.closest('[data-select-look]');if(button)selectThumbnail(Number(button.dataset.selectLook));});
 thumbs.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();event.stopPropagation();selectThumbnail(event.key==='Home'?0:event.key==='End'?looks.length-1:Math.max(0,Math.min(looks.length-1,active+(event.key==='ArrowRight'?1:-1))));});
 let modelPointer=null,modelSwiped=false;
 stage.addEventListener('click',event=>{if(modelSwiped){event.preventDefault();event.stopPropagation();}},true);
 stage.addEventListener('pointerdown',event=>{if(event.pointerType==='touch')modelPointer={x:event.clientX,y:event.clientY};});
 stage.addEventListener('pointerup',event=>{if(!modelPointer)return;const dx=modelPointer.x-event.clientX,dy=modelPointer.y-event.clientY;modelPointer=null;if(Math.abs(dx)>40&&Math.abs(dx)>Math.abs(dy)*1.2){modelSwiped=true;setTimeout(()=>modelSwiped=false,0);choose(Math.max(0,Math.min(looks.length-1,active+(dx>0?1:-1))));}});
 stage.addEventListener('pointercancel',()=>modelPointer=null);
 name.addEventListener('input',event=>{if(event.isComposing)return;name.value=limitName(name.value);current().name=name.value;sizeLookName();[...thumbs.children].forEach(e=>{const i=Number(e.dataset.selectLook);e.setAttribute('aria-label',`Select ${looks[i].name}, model ${i+1} of ${looks.length}`);});if(mode==='look'){$('#fitting-panel-title').textContent=name.value;$('#fitting-panel-title').title=name.value;alignPanelHeading();}});
 name.addEventListener('compositionend',()=>name.dispatchEvent(new Event('input')));
 name.addEventListener('blur',()=>{current().name=limitName(name.value.trim())||`Look ${String(active+1).padStart(2,'0')}`;name.value=current().name;renderPeople();persistPeople();});
 name.addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();name.blur();}});
 function renderFilters(){filters.hidden=true;filters.innerHTML='';}
 function renderPanel(){
  save.disabled=saving||pendingOutfits.has(current().id);
  if(panel.dataset.mode!==mode){panelViewport.scrollTop=0;panel.querySelector('.fitting-panel-scroll').scrollTop=0;}
  renderFilters();panel.dataset.mode=mode;savedLink.hidden=mode!=='look';
  removeModel.hidden=mode!=='look'||!hasCreated;
  $('#fitting-panel-kicker').textContent=mode==='create'?'NEW LOOK':mode==='look'?'LOOK':mode==='gallery'?products[galleryItem].category:'WARDROBE';
  $('#fitting-panel-title').textContent=mode==='create'?'ADD MODEL':mode==='look'?current().name:mode==='gallery'?products[galleryItem].name:`REPLACE ${filter==='Tops'?'TOPS':'BOTTOMS'}`;
  $('#fitting-panel-title').title=$('#fitting-panel-title').textContent;
  alignPanelHeading();
  save.hidden=!['look','create'].includes(mode);save.querySelector('span').textContent=mode==='create'?'CREATE MODEL':'SAVE MY LOOK';
  panel.setAttribute('aria-label',mode==='create'?'Create a model':'Look details');
  $('#add-model')?.setAttribute('aria-expanded',String(mode==='create'&&panel.classList.contains('is-open')));
  panelProducts.innerHTML='';
  if(mode==='gallery'){
   const p=products[galleryItem],photos=p.photos||[`assets/fitting-room/${p.thumb}`,...Array.from({length:p.count},(_,i)=>`assets/fitting-room/${p.gallery}-${i+1}.png`)];
   content.innerHTML=`<button class="fitting-back" data-back>Back</button><div class="fitting-gallery-main"><img src="${photos[galleryPhoto]}" alt="${escape(p.name)} — photo ${galleryPhoto+1}"></div><div class="fitting-gallery-thumbs">${photos.map((src,i)=>`<button data-photo="${i}" aria-label="Photo ${i+1} of ${photos.length}" aria-pressed="${i===galleryPhoto}"><img src="${src}" alt="">${thinCorners()}</button>`).join('')}</div><p class="fitting-photo-count">${String(galleryPhoto+1).padStart(2,'0')} / ${String(photos.length).padStart(2,'0')}</p>${window.FitloopSizeGuide.markup(p,current())}`;
   return;
  }
  const ids=mode==='replace'?outfitState.replacements(current(),filter):productIds();
  const rows=ids.map(id=>mode==='replace'?`<button class="fitting-item-row" data-product="${id}" aria-pressed="${productIds().includes(id)}" aria-label="Replace with ${escape(products[id].name)}"><span class="service-product">${art(id)}</span><span class="fitting-item-name">${escape(productLabel(products[id].name))}</span><span class="fitting-item-view">${productIds().includes(id)?'ON MODEL':'REPLACE'}</span></button>`:productRow(id)).join('');
  if(mode==='replace'){content.innerHTML=`<button class="fitting-back" data-back>Back</button><div class="fitting-catalog">${rows}</div>`;return;}
  if(!draft)draft=measurementDraft(current());
  const measurements=['look','create'].includes(mode)?`<dl class="fitting-measurements fitting-measurement-controls">${measurementFields.map(field=>`<dt id="measurement-${field.id}-label">${field.label}</dt><dd><div class="fitting-measurement-wheel" role="listbox" tabindex="0" data-field="${field.id}" aria-labelledby="measurement-${field.id}-label">${field.values.map((value,index)=>`<div role="option" id="measurement-${field.id}-${index}" data-index="${index}" aria-selected="${value===draft[field.id]}">${value}${field.suffix||''}</div>`).join('')}</div></dd>`).join('')}</dl>`:`<dl class="fitting-measurements">${measurementFields.map(field=>`<dt>${field.label}</dt><dd>${current()[field.id]}${field.suffix||''}</dd>`).join('')}</dl>`;
  content.innerHTML=`<div class="fitting-rotation fitting-motion-options"><span class="fitting-motion-label">${motionOptions.find(option=>option.id===motionChoice).label}<i class="fitting-baseline" aria-hidden="true"></i></span><div class="fitting-rotation-frames fitting-motion-previews">${motionOptions.map(option=>`<button class="fitting-mode-preview" data-motion-choice="${option.id}" aria-label="${option.label}" title="${option.label}" aria-pressed="${option.id===motionChoice}"><span class="fitting-sprite"></span></button>`).join('')}</div></div>${measurements}`;
  content.querySelectorAll('.fitting-measurement-wheel').forEach(wheel=>{const field=measurementFields.find(field=>field.id===wheel.dataset.field),index=Math.max(0,field.values.indexOf(draft[field.id]));wheel.scrollTop=index*16;syncMeasurement(wheel,index);});

  section.querySelectorAll('.fitting-mode-preview .fitting-sprite').forEach(element=>setFrame(element,current()));
  panelProducts.innerHTML=mode==='create'?'':rows;
  panel.querySelectorAll('.fitting-motion-options,.fitting-mode-preview[aria-pressed=true]').forEach(element=>element.insertAdjacentHTML('beforeend',thinCorners()));
  for(const field of ['jacketSize','pantSize'])content.querySelector(`[data-field="${field}"]`)?.parentElement.insertAdjacentHTML('beforeend',`<button type="button" class="fitting-fit-notice" data-fit-notice="${field}" hidden aria-label="${field==='jacketSize'?'Top':'Bottom'} outside fit range. Show size information" aria-expanded="false" aria-controls="fit-info-${field}"><span class="fit-label">OUTSIDE FIT RANGE.</span><span class="fit-range"></span><span class="fit-alert" aria-hidden="true"><span>!</span>${thinCorners()}</span>${thinCorners()}</button><div class="fit-info" id="fit-info-${field}" hidden><span class="fit-info-heading">OUTSIDE FIT RANGE.</span><dl><dt>HEIGHT</dt><dd>154–194 CM</dd><dt>WEIGHT</dt><dd data-fit-weight></dd></dl>${thinCorners()}</div>`);
  updateFitNotices();
  updateBoundaries();
 }
 async function previewMeasurements(look,settings){
  const state={settings,promise:null};livePreviews.set(look.id,state);
  state.promise=(async()=>{
   if(look.gender==='woman'){femaleIdentities.set(look.id,look.identity);look.femaleIdentity=look.identity;}
   const identity=settings.gender==='woman'?(look.femaleIdentity||femaleIdentities.get(look.id)||'woman'):'man';
   try{
    await window.FitloopMotion.load(portraitKey({...look,...settings,identity}));
    if(livePreviews.get(look.id)!==state||!looks.includes(look))return;
    Object.assign(look,settings,{identity});
    if(current()===look)refreshProductRows();
    const button=models.querySelector(`[data-person-id="${look.id}"]`);
    if(button){
     button.querySelector('.fitting-photo').setAttribute('aria-label',`${look.gender==='man'?'Man':'Woman'} wearing ${products[productIdsFor(look)[1]].name} and ${products[productIdsFor(look)[0]].name}`);
     button.querySelectorAll('.fitting-sprite').forEach(element=>setFrame(element,look));
    }
    const thumbnail=thumbs.querySelector(`[data-person-id="${look.id}"] .fitting-sprite`);if(thumbnail)setFrame(thumbnail,look);
    if(current()===look)section.querySelectorAll('.fitting-mode-preview .fitting-sprite').forEach(element=>setFrame(element,look));
    persistPeople();
   }catch{if(livePreviews.get(look.id)===state)announce('The model update could not load. Please try again.');}
  })();
  return state.promise;
 }
 function syncMeasurement(wheel,index){
  const field=measurementFields.find(field=>field.id===wheel.dataset.field);index=Math.max(0,Math.min(field.values.length-1,index));
  const changed=draft[field.id]!==field.values[index];draft[field.id]=field.values[index];
  wheel.setAttribute('aria-activedescendant',`measurement-${field.id}-${index}`);[...wheel.children].forEach((option,i)=>{option.setAttribute('aria-selected',String(i===index));option.style.opacity=i===index?'1':'.35';});
  if(changed&&mode==='look'&&(liveDesktop.matches||field.id==='gender'))previewMeasurements(current(),{...draft});
  if(changed)updateFitNotices();
 }

 content.addEventListener('click',event=>{
  const trigger=event.target.closest('[data-fit-notice]');if(!trigger||liveDesktop.matches)return;
  event.preventDefault();event.stopPropagation();const info=document.getElementById(trigger.getAttribute('aria-controls')),expanded=trigger.getAttribute('aria-expanded')!=='true';
  trigger.setAttribute('aria-expanded',String(expanded));info.hidden=!expanded;trigger.parentElement.classList.toggle('is-fit-expanded',expanded);
 });
 const wheelTargets=new WeakMap();
 function moveMeasurement(wheel,index){const field=measurementFields.find(field=>field.id===wheel.dataset.field);index=Math.max(0,Math.min(field.values.length-1,index));wheelTargets.set(wheel,index);syncMeasurement(wheel,index);wheel.scrollTo({top:index*16,behavior:reduced.matches?'auto':'smooth'});}
 content.addEventListener('scroll',event=>{const wheel=event.target;if(!wheel.matches('.fitting-measurement-wheel'))return;const target=wheelTargets.get(wheel);if(target!==undefined){if(Math.abs(wheel.scrollTop-target*16)<.5)wheelTargets.delete(wheel);return;}syncMeasurement(wheel,Math.round(wheel.scrollTop/16));},true);
 content.addEventListener('wheel',event=>{const wheel=event.target.closest('.fitting-measurement-wheel');if(wheel){wheelTargets.delete(wheel);event.stopPropagation();}},{passive:true});
 content.addEventListener('pointerdown',event=>{const wheel=event.target.closest('.fitting-measurement-wheel');if(wheel)wheelTargets.delete(wheel);});
 content.addEventListener('keydown',event=>{const wheel=event.target.closest('.fitting-measurement-wheel');if(!wheel||!['ArrowUp','ArrowDown','Home','End'].includes(event.key))return;event.preventDefault();event.stopPropagation();const field=measurementFields.find(field=>field.id===wheel.dataset.field),index=field.values.indexOf(draft[field.id]);moveMeasurement(wheel,event.key==='Home'?0:event.key==='End'?field.values.length-1:index+(event.key==='ArrowDown'?1:-1));});
 function openPanel(nextMode='look',category='All'){window.FitloopSaveFlow?.hideOffer?.();const beforeFactory=!hasCreated&&nextMode==='create'?factoryRect():null;warmOtherGender(current());panelViewport.scrollTop=0;closeRailActions();previousFocus=document.activeElement;mode=nextMode;draft=measurementDraft(current());filter=category;panel.inert=false;panel.setAttribute('aria-hidden','false');panel.classList.add('is-open');section.classList.add('fitting-panel-open');renderPanel();animateFactoryFrom(beforeFactory);$('.fitting-close').focus({preventScroll:true});}
 function closePanel({returnFactory=true}={}){const beforeFactory=returnFactory&&!hasCreated&&mode==='create'?factoryRect():null;panel.classList.remove('is-open');panel.inert=true;panel.setAttribute('aria-hidden','true');section.classList.remove('fitting-panel-open');$('#add-model')?.setAttribute('aria-expanded','false');animateFactoryFrom(beforeFactory);(previousFocus?.isConnected?previousFocus:models.children[active])?.focus({preventScroll:true});}
 $('.fitting-close').addEventListener('click',closePanel);
 const modelEase='cubic-bezier(.22,1,.36,1)';
 const modelGhosts=new Map(),modelMoves=new WeakMap();let factoryMotion=null;
 document.addEventListener('fitloop-screen',event=>{if(event.detail.index!==2)for(const animation of modelGhosts.values())animation.cancel();});
 function settleAnimation(animation){animation.finished.catch(()=>{}).finally(()=>animation.cancel());}
 function factoryRect(){return section.querySelector('.fitting-model-factory')?.getBoundingClientRect();}
 function animateFactoryFrom(before){
  if(reduced.matches||!before||!section.classList.contains('is-active'))return;
  factoryMotion?.cancel();factoryMotion=null;
  const factory=section.querySelector('.fitting-model-factory'),after=factory?.getBoundingClientRect();if(!after)return;
  const dx=before.left-after.left,dy=before.top-after.top;if(Math.hypot(dx,dy)<2)return;
  const animation=factory.animate([{transform:`translate(${dx}px,${dy}px)`},{transform:'translate(0,0)'}],{duration:760,easing:modelEase,fill:'both'});factoryMotion=animation;
  animation.finished.catch(()=>{}).finally(()=>{if(factoryMotion===animation)factoryMotion=null;animation.cancel();});
 }
 function modelRects(){return new Map([...models.children].map(button=>[button.dataset.personId,{rect:button.getBoundingClientRect(),opacity:getComputedStyle(button).opacity}]));}
 function animateModelShifts(before){
  if(reduced.matches||!section.classList.contains('is-active'))return;
  for(const button of models.children){const previous=before.get(button.dataset.personId);if(!previous)continue;
   modelMoves.get(button)?.cancel();
   const now=button.getBoundingClientRect(),dx=previous.rect.left+previous.rect.width/2-now.left-now.width/2;
   const end=button.style.transform,scale=Number(end.match(/scale\(([^)]+)\)/)?.[1])||1,startScale=scale*previous.rect.width/now.width;
   if(Math.abs(dx)<2&&Math.abs(startScale-scale)<.01&&previous.opacity===button.style.opacity)continue;
   const start=end.replace(/scale\([^)]+\)/,`scale(${startScale})`),animation=button.animate([{transform:`translateX(${dx}px) ${start}`,opacity:previous.opacity},{transform:end,opacity:button.style.opacity}],{duration:680,easing:modelEase,fill:'both'});modelMoves.set(button,animation);
   animation.finished.catch(()=>{}).finally(()=>{if(modelMoves.get(button)===animation)modelMoves.delete(button);animation.cancel();});
  }
 }
 function animateModelEntry(direction=0){
  if(reduced.matches||!section.classList.contains('is-active'))return;
  const button=models.children[active];if(!button)return;const end=button.style.transform;
  settleAnimation(button.animate([{transform:`translateX(${direction*72}px) ${end.replace(/scale\([^)]+\)/,'scale(.9)')}`,opacity:0},{transform:end,opacity:button.style.opacity||1}],{duration:720,easing:modelEase,fill:'both'}));
 }
 function makeModelGhost(button){
  if(!button||reduced.matches||!section.classList.contains('is-active'))return null;
  const style=getComputedStyle(button);if(style.visibility==='hidden')return null;
  const rect=button.getBoundingClientRect(),opacity=style.opacity;button.remove();document.body.append(button);
  Object.assign(button.style,{position:'fixed',left:`${rect.left}px`,top:`${rect.top}px`,width:`${rect.width}px`,height:`${rect.height}px`,margin:'0',transform:'none',opacity,pointerEvents:'none',zIndex:'23'});
  const animation=button.animate([{opacity,transform:'scale(1)'},{opacity:0,transform:'scale(.94)'}],{duration:620,easing:modelEase,fill:'both'});
  modelGhosts.set(button.dataset.personId,animation);
  return animation.finished.catch(()=>{}).finally(()=>{if(modelGhosts.get(button.dataset.personId)===animation)modelGhosts.delete(button.dataset.personId);animation.cancel();button.remove();});
 }
 function deleteCurrentModel(){
  if(!hasCreated||mode!=='look'||pendingOutfits.has(current().id))return;
  const index=active,removed=looks[index],beforeFactory=factoryRect(),beforeModels=modelRects(),ghost=makeModelGhost(models.children[index]);outfitRequest++;pendingOutfits.delete(removed.id);livePreviews.delete(removed.id);
  actionHistory.push({type:'delete',look:removed,index});looks.splice(index,1);
  const renderer=portraitRenderers.get(removed.id);portraitRenderers.delete(removed.id);if(ghost)ghost.finally(()=>renderer?.dispose());else renderer?.dispose();
  if(!looks.length){closePanel();hasCreated=false;looks=[createLook(0,3,'Look 01',{jacket:6,identity:'woman'})];active=focus=thumbWindowStart=0;draft=null;}
  else{active=Math.min(index,looks.length-1);focus=active;thumbWindowStart=Math.min(active,Math.max(0,looks.length-2));draft=measurementDraft(current());}
  renderPeople();animateModelShifts(beforeModels);animateFactoryFrom(beforeFactory);persistPeople();(hasCreated?$('.fitting-close'):undo).focus({preventScroll:true});announce(`${removed.name} deleted`);
 }
 removeModel.addEventListener('click',deleteCurrentModel);
 filters.addEventListener('click',event=>{const button=event.target.closest('[data-filter]');if(button){filter=button.dataset.filter;renderPanel();filters.querySelector(`[data-filter="${filter}"]`)?.focus({preventScroll:true});}});
 panel.addEventListener('click',event=>{
  const keep=event.target.closest('[data-keep-product]'),replacement=event.target.closest('[data-replace-category]');
  if(keep){keepGarment(keep);return;}
  if(replacement){openReplacement(replacement.dataset.replaceCategory);return;}
  const option=event.target.closest('.fitting-measurement-wheel [data-index]');if(option){moveMeasurement(option.parentElement,Number(option.dataset.index));return;}
  const motionButton=event.target.closest('.fitting-mode-preview[data-motion-choice]');if(motionButton){motionChoice=motionButton.dataset.motionChoice;section.dataset.motionChoice=motionChoice;try{localStorage.setItem('fitloop-model-motion-v1',motionChoice);}catch{}renderPositions();renderPanel();panel.querySelector(`[data-motion-choice="${motionChoice}"]`)?.focus({preventScroll:true});announce(motionOptions.find(option=>option.id===motionChoice).label);return;}
  const back=event.target.closest('[data-back]'),photo=event.target.closest('[data-photo]'),item=event.target.closest('[data-product]');
  if(back){mode='look';filter='All';renderPanel();filters.querySelector('button')?.focus({preventScroll:true});return;}
  if(photo){galleryPhoto=Number(photo.dataset.photo);renderPanel();content.querySelector(`[data-photo="${galleryPhoto}"]`)?.focus({preventScroll:true});return;}
  if(!item)return;const id=Number(item.dataset.product);
  if(mode==='replace'){mode='look';filter='All';renderPanel();applyProduct(id);return;}
  mode='gallery';galleryItem=id;galleryPhoto=0;renderPanel();content.querySelector('[data-back]')?.focus({preventScroll:true});
 });
 async function keepGarment(button){
  const look=current(),row=button.closest('.fitting-item-row');Object.assign(look,outfitState.keep(look,Number(button.dataset.keepProduct)));persistPeople();
  row.querySelectorAll('button').forEach(e=>e.disabled=true);
  await Promise.all([...row.querySelectorAll('.fitting-item-copy,.fitting-item-actions')].map(e=>e.animate([{opacity:1},{opacity:0,transform:'translateY(-2px)'}],{duration:reduced.matches?0:160,easing:'ease-in-out'}).finished.catch(()=>{})));
  if(current()!==look||!row.isConnected)return;refreshProductRows();
  panelProducts.querySelectorAll('.fitting-item-name,.fitting-item-view,.fitting-item-actions').forEach(e=>e.animate([{opacity:0,transform:'translateY(2px)'},{opacity:1,transform:'none'}],{duration:reduced.matches?0:160,easing:'ease-in-out'}));
 }
 async function applyProduct(id,originCard=null){
  if(!products[id])return;outfitRequest++;const look=current(),previous=pendingOutfits.get(look.id),desired=outfitState.select({...look,...outfitState.snapshot(previous?.desired||look)},id),state={desired};
  pendingOutfits.set(look.id,state);track.setAttribute('aria-busy','true');save.disabled=true;
  try{
   let loadedKey;do{await livePreviews.get(look.id)?.promise;loadedKey=portraitKey({...look,...outfitState.snapshot(desired)});await window.FitloopMotion.load(loadedKey);}while(pendingOutfits.get(look.id)===state&&looks.includes(look)&&loadedKey!==portraitKey({...look,...outfitState.snapshot(desired)}));
   if(pendingOutfits.get(look.id)!==state||!looks.includes(look))return;
   const changed=look.jacket!==desired.jacket||look.pants!==desired.pants;if(changed)actionHistory.push({type:'outfit',id:look.id,...outfitState.snapshot(look)});
   desired.reviewed=[...new Set([...desired.reviewed,outfitState.token(look,id)])];const accepted=[...(look.acknowledged||[]),...(desired.acknowledged||[])];Object.assign(look,outfitState.snapshot(desired),{acknowledged:[...new Set(accepted)]});persistPeople();
   if(current()===look){
    draft=measurementDraft(look);renderPeople();updateUndo();
    if(mode==='look'&&panel.classList.contains('is-open'))refreshProductRows();
    if(genderMismatch(id,look)){if(originCard?.isConnected&&Number(originCard.dataset.product)===id)alreadyWorn(originCard,`Designed for ${products[id].gender==='man'?'men':'women'}.\nItem applied.`);}
    announce(`Now wearing ${products[productIdsFor(look)[0]].name} and ${products[productIdsFor(look)[1]].name}`);if(originCard&&changed){if(replacementState)replacementState.pendingSaveOffer=look.id;else window.FitloopSaveFlow?.offer?.(look.id);}
   }
  }catch(error){if(current()===look)announce('The look could not load. Please try again.');console.error('Outfit update failed',error);}
  finally{if(pendingOutfits.get(look.id)===state)pendingOutfits.delete(look.id);if(!pendingOutfits.has(current().id))track.removeAttribute('aria-busy');save.disabled=saving||pendingOutfits.has(current().id);}
 }
 const applyPants=pants=>applyProduct(products.findIndex(p=>p.pants===pants));
 const applyJacket=id=>applyProduct(id);
 async function undoLatest(){
  const change=actionHistory.at(-1);if(!change||undoing)return;undoing=true;undo.disabled=true;
  if(change.type==='delete'){
   const beforeFactory=factoryRect(),beforeModels=modelRects(),wasEmpty=!hasCreated;
   const restored=change.look;modelGhosts.get(restored.id)?.cancel();actionHistory.pop();if(!hasCreated){looks=[];hasCreated=true;}
   const index=Math.min(change.index,looks.length);looks.splice(index,0,restored);active=focus=index;thumbWindowStart=Math.min(index,Math.max(0,looks.length-2));draft=measurementDraft(restored);
   renderPeople();animateModelShifts(beforeModels);animateFactoryFrom(beforeFactory);if(wasEmpty||!beforeModels.has(restored.id))animateModelEntry(wasEmpty?0:index===0?-1:1);persistPeople();announce(`${restored.name} restored`);undoing=false;updateUndo();return;
  }
  const look=looks.find(x=>x.id===change.id);if(!look){undoing=false;updateUndo();return;}
  pendingOutfits.delete(look.id);const request=++outfitRequest,selected=current();
  try{await window.FitloopMotion.load(portraitKey({...look,...change}));if(actionHistory.at(-1)!==change||outfitRequest!==request||!looks.includes(look))return;actionHistory.pop();Object.assign(look,outfitState.snapshot(change));if(current()===selected){active=looks.indexOf(look);draft=measurementDraft(look);}renderPeople();persistPeople();announce('Outfit change undone');}catch{announce('The previous outfit could not load. Please try again.');}finally{undoing=false;updateUndo();}
 }
 undo.addEventListener('click',undoLatest);
 let cyclingRail=false;
 async function replace(card){
  if(cyclingRail||replacementState&&replacementState.phase!=='open')return;
  const id=Number(card.dataset.product),product=products[id],allowed=replacementState?.ids||outfitState.replacements({gender:product.gender},product.category);
  const nextId=outfitState.cycleCard([id],0,allowed)[0];if(nextId===id)return;
  cyclingRail=true;card.setAttribute('aria-busy','true');
  try{
   await card.querySelector('.product-visual').animate([{opacity:1},{opacity:0}],{duration:reduced.matches?0:250,easing:'ease-out'}).finished.catch(()=>{});
   noticeAnimations.get(card)?.cancel();card.querySelector('.local-worn-notice')?.remove();card.dataset.product=String(nextId);card.querySelector('.product-visual').outerHTML=railVisual(nextId);card.querySelector('.fitting-card-toggle').setAttribute('aria-label',`Show actions for ${products[nextId].name}`);card.querySelectorAll('.fitting-card-action').forEach(b=>b.setAttribute('aria-label',`${b.dataset.action==='refresh'?'Refresh combination with':'Replace'} ${products[nextId].name}`));
   await card.querySelector('.product-visual').animate([{opacity:0},{opacity:1}],{duration:reduced.matches?0:250,easing:'ease-in-out'}).finished.catch(()=>{});
   announce(`${products[nextId].name} shown. Refresh to try it on.`);
  }finally{cyclingRail=false;card.removeAttribute('aria-busy');}
 }

 function refresh(id,card){applyProduct(id,card);}
 async function saveCurrentLook(){
  if(saving||pendingOutfits.has(current().id)||replacementState)return;
  const look=current(),settings=panel.classList.contains('is-open')&&mode==='look'?{...draft}:measurementDraft(look);saving=true;save.disabled=true;
  try{
   await livePreviews.get(look.id)?.promise;
   if(!looks.includes(look))return;
   const identity=settings.gender===look.gender?look.identity:settings.gender==='woman'?(look.femaleIdentity||'woman'):'man';
   await window.FitloopMotion.load(portraitKey({...look,...settings,identity}));
   Object.assign(look,settings,{identity});window.FitloopSaved.save(look);persistPeople();
   localStorage.setItem(key,JSON.stringify({model:look.model,pants:look.pants,name:look.name,savedAt:new Date().toISOString()}));
   renderPeople();save.querySelector('span').textContent='SAVED';announce(`${look.name} saved on this device`);
   await window.FitloopSaveFlow?.play(look);
   if(mode==='look')save.querySelector('span').textContent='SAVE MY LOOK';
  }catch{announce('The browser could not save this look.');}
  finally{saving=false;save.disabled=pendingOutfits.has(current().id);}
 }
 save.addEventListener('click',async()=>{
  if(save.disabled||pendingOutfits.has(current().id))return;
  if(mode==='look')return saveCurrentLook();
  if(mode!=='create'||!draft)return;const settings={...draft};save.disabled=true;save.querySelector('span').textContent='CREATING…';
  try{await window.FitloopFitting.createPerson(settings);}
  catch{announce('The model could not load. Please try again.');}
  finally{save.disabled=false;save.querySelector('span').textContent=mode==='create'?'CREATE MODEL':'SAVE MY LOOK';}
 });
 const originalCards=[...document.querySelectorAll('#wardrobe-track .product-card')].slice(0,4);
 const cards=[];let activeRailCard=null;
 let replacementState=null;
 const noticeAnimations=new WeakMap(),noticeReveals=new WeakMap();
 function alreadyWorn(card,message='This item is already worn.'){
  noticeAnimations.get(card)?.cancel();noticeReveals.get(card)?.cancel();const visual=card.querySelector('.product-visual');if(visual)visual.style.opacity='';let notice=card.querySelector('.local-worn-notice');if(!notice){notice=document.createElement('span');notice.className='local-worn-notice';notice.setAttribute('role','status');card.append(notice);}notice.textContent=message;
  card.classList.add('is-worn-notice');const animation=notice.animate([{opacity:0},{opacity:1,offset:.14},{opacity:1,offset:.82},{opacity:0}],{duration:reduced.matches?600:message==='This item is already worn.'?700:1200,easing:'ease-in-out'});noticeAnimations.set(card,animation);animation.finished.then(()=>{if(noticeAnimations.get(card)!==animation)return;if(visual)visual.style.opacity='0';card.classList.remove('is-worn-notice');if(visual){const reveal=visual.animate([{opacity:0},{opacity:1}],{duration:reduced.matches?0:420,easing:'cubic-bezier(.22,1,.36,1)',fill:'both'});noticeReveals.set(card,reveal);reveal.finished.then(()=>{if(noticeReveals.get(card)===reveal){visual.style.opacity='';reveal.cancel();noticeReveals.delete(card);}}).catch(()=>{});}}).catch(()=>{});announce(message);
 }
 track.addEventListener('pointerenter',event=>{if(desktopActions.matches&&event.pointerType!=='touch')hoverRail=true;});
 track.addEventListener('pointermove',event=>{if(!desktopActions.matches||event.pointerType==='touch')return;hoverRail=true;const card=event.target.closest('.product-card');cards.forEach(c=>{const hovered=c===card;c.querySelectorAll('.fitting-card-action').forEach(b=>{b.tabIndex=hovered?0:-1;if(hovered)b.removeAttribute('aria-hidden');else b.setAttribute('aria-hidden','true');});});});
 desktopActions.addEventListener('change',()=>{hoverRail=false;closeRailActions();sizeLookName();});
 matchMedia('(max-width:767px)').addEventListener('change',renderPeople);

 function closeRailActions(){if(!activeRailCard)return;const previous=activeRailCard;activeRailCard=null;previous.classList.remove('is-action-open');previous.querySelector('.fitting-card-toggle')?.setAttribute('aria-expanded','false');previous.querySelectorAll('.fitting-card-action').forEach(button=>{button.tabIndex=-1;button.setAttribute('aria-hidden','true');});track.dataset.actionPaused='false';}
 function toggleRailActions(card){if(activeRailCard===card){closeRailActions();return;}closeRailActions();activeRailCard=card;card.classList.add('is-action-open');card.querySelector('.fitting-card-toggle').setAttribute('aria-expanded','true');card.querySelectorAll('.fitting-card-action').forEach(button=>{button.tabIndex=0;button.removeAttribute('aria-hidden');});track.dataset.actionPaused='true';announce(`Actions for ${products[Number(card.dataset.product)].name}`);}
 document.addEventListener('click',event=>{if(activeRailCard&&!event.target.closest('.fitting-rail'))closeRailActions();});
 document.addEventListener('fitloop-screen',event=>{if(event.detail.index!==2)closeRailActions();});

 const railVisual=id=>originalCards[id]?.querySelector('.product-visual').outerHTML||art(id,'rail').replace('class="step-art"','class="product-visual"');
 function renderRailCard(card,id){
  const repeated=Number(card.dataset.copy)>=(replacementState?replacementState.ids.length:products.length);card.dataset.product=String(id);
  const visual=railVisual(id);
  card.innerHTML=visual+`<button class="fitting-card-toggle" type="button" aria-label="Show actions for ${escape(products[id].name)}" aria-expanded="false"${repeated?' tabindex="-1" aria-hidden="true"':''}></button>`+['refresh','replace'].map(action=>`<button class="fitting-card-action" type="button" data-action="${action}" aria-label="${action==='refresh'?'Refresh combination with':'Replace'} ${escape(products[id].name)}" tabindex="-1" aria-hidden="true"><span class="button brand-badge"><span>${action.toUpperCase()}</span></span></button>`).join('');
 }

 for(let i=0;i<products.length*4;i++){
  const id=i%products.length,card=document.createElement('div');card.className='product-card';card.dataset.slot=String(id);card.dataset.copy=String(i);renderRailCard(card,id);
  track.append(card);cards.push(card);
 }
 // Warm only visible candidates, one idle job at a time. Clicks still use the
 // existing latest-request guard and the loader's shared in-flight promise.
 const warmKeys=new Set(),warmQueue=[];let warming=false;
 function warmOutfit(id){
  if(document.body.dataset.screen!=='2'||!products[id])return;
  const key=portraitKey(outfitState.select(current(),id));if(warmKeys.has(key))return;warmKeys.add(key);warmQueue.push(key);pumpWarmOutfits();
 }
 function pumpWarmOutfits(){
  if(warming||!warmQueue.length)return;warming=true;
  const run=async()=>{const key=warmQueue.shift();try{await window.FitloopMotion.load(key);}catch{warmKeys.delete(key);}finally{warming=false;pumpWarmOutfits();}};
  if(window.requestIdleCallback)window.requestIdleCallback(run,{timeout:1200});else setTimeout(run,32);
 }
 function warmVisibleOutfits(){
  if(document.body.dataset.screen!=='2')return;
  const box=track.getBoundingClientRect();for(const card of cards){const r=card.getBoundingClientRect();if(r.right>box.left&&r.left<box.right)warmOutfit(Number(card.dataset.product));}
 }
 if(window.IntersectionObserver){const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting)warmOutfit(Number(entry.target.dataset.product));},{root:track,threshold:.2});cards.forEach(card=>observer.observe(card));}
 new MutationObserver(warmVisibleOutfits).observe(track,{subtree:true,attributes:true,attributeFilter:['data-product']});
 document.addEventListener('fitloop-screen',warmVisibleOutfits);
 track.addEventListener('pointermove',event=>{const card=event.target.closest('.product-card');if(card)warmOutfit(Number(card.dataset.product));},{passive:true});
 let railPointer=null,railPress=null;
 track.addEventListener('pointerdown',event=>{const card=event.target.closest('[data-product]'),action=event.target.closest('[data-action]');railPress=card&&action?{card,id:Number(card.dataset.product),action:action.dataset.action,busy:cyclingRail}:null;});
 track.addEventListener('pointerdown',event=>{if(event.pointerType==='touch'){railPointer={x:event.clientX,moved:false};hoverRail=true;}});
 track.addEventListener('pointermove',event=>{if(!railPointer)return;const delta=railPointer.x-event.clientX;if(Math.abs(delta)>2)railPointer.moved=true;offset+=delta;railPointer.x=event.clientX;});
 track.addEventListener('pointerup',()=>{if(!railPointer)return;hoverRail=false;setTimeout(()=>railPointer=null,0);});track.addEventListener('pointercancel',()=>{hoverRail=false;railPointer=null;railPress=null;});
 track.addEventListener('click',event=>{if(railPointer?.moved){event.preventDefault();event.stopImmediatePropagation();}},true);
 track.addEventListener('pointerleave',()=>{if(!railPointer)hoverRail=false;});
 function focusRailControl(event){
  focusRail=event.target.matches(':focus-visible');if(!focusRail)return;
  const card=event.target.closest('.product-card');if(!card)return;
  const rect=card.getBoundingClientRect(),width=replacementState?section.clientWidth/2:track.clientWidth,scale=replacementState?1.1:1;
  if(rect.left<0||rect.right>width)offset+=(rect.left-(width-160*scale)/2)/scale;
 }
 track.addEventListener('focusin',focusRailControl);track.addEventListener('focusout',()=>{focusRail=false;});
 function actOnRail(event){
  const pressed=railPress;railPress=null;
  const card=event.target.closest('[data-product]');if(!card)return;
  const action=event.target.closest('[data-action]');if(!action){toggleRailActions(card);return;}
  if(!desktopActions.matches&&card!==activeRailCard)return;
  const id=Number(card.dataset.product);
  // Pointer focus must never move or change the garment between press and release.
  if(event.detail>0&&(!pressed||pressed.busy||pressed.card!==card||pressed.id!==id||pressed.action!==action.dataset.action))return;
  if(replacementState&&!replacementState.ids.includes(id))return;if(cyclingRail)return;
  if(action.dataset.action==='refresh'){closeRailActions();if(productIds().includes(id)){if(current().gender!==products[id].gender&&!current().acknowledged.includes(outfitState.token(current(),id)))applyProduct(id,card);else alreadyWorn(card);}else refresh(id,card);}else replace(card);
 }
 track.addEventListener('click',actOnRail);
 track.addEventListener('wheel',event=>{if(!replacementState&&Math.abs(event.deltaX)<=Math.abs(event.deltaY))return;event.preventDefault();event.stopPropagation();if(!activeRailCard)offset+=(Math.abs(event.deltaX)>Math.abs(event.deltaY)?event.deltaX:event.deltaY)*.5;},{passive:false});
 section.addEventListener('keydown',event=>{if(event.key==='Escape'&&activeRailCard){event.preventDefault();const toggle=activeRailCard.querySelector('.fitting-card-toggle');closeRailActions();toggle.focus({preventScroll:true});return;}if(event.key==='Escape'&&panel.classList.contains('is-open')){event.preventDefault();closePanel();}});
 const splitHome=document.createElement('div');splitHome.className='local-saved-return fitting-home-return';splitHome.hidden=true;splitHome.innerHTML='<span class="return-label">Fitting room.</span> <a href="#next">BACK</a>';section.append(splitHome);
 splitHome.addEventListener('click',event=>{if(!event.target.closest('a'))return;event.preventDefault();event.stopPropagation();closeReplacement();});
 const divider=document.createElement('div');divider.className='fitting-split-divider';divider.setAttribute('aria-hidden','true');section.append(divider);
 const confirm=document.createElement('button');confirm.type='button';confirm.className='fitting-confirm';confirm.hidden=true;confirm.setAttribute('aria-label','Confirm clothing selection');
 confirm.innerHTML='<svg class="fitting-confirm-cursor" width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true"><path class="confirm-corners" d="M8.5.5H.5V8.5M27.5.5H35.5V8.5M35.5 27.5V35.5H27.5M8.5 35.5H.5V27.5" stroke-width="1"/><path class="confirm-tick" d="m1.5 6 3 3 6-6" transform="translate(10 10) scale(1.333333)" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/></svg>';section.append(confirm);
 let confirmPointer=null,confirmSampleKey='',confirmPixels=null;
 const confirmSample=Object.assign(document.createElement('canvas'),{width:128,height:171}),sampleContext=confirmSample.getContext('2d',{willReadFrequently:true});
 confirm.addEventListener('pointermove',event=>{const r=confirm.getBoundingClientRect(),x=Math.max(18,Math.min(r.width-18,event.clientX-r.left)),y=Math.max(18,Math.min(r.height-18,event.clientY-r.top));if(!confirmPointer)confirmPointer={x,y};confirmPointer.targetX=x;confirmPointer.targetY=y;confirm.classList.add('has-pointer');});
 confirm.addEventListener('pointerleave',()=>{confirm.classList.remove('has-pointer','is-over-model');confirmPointer=null;});
 confirm.addEventListener('click',()=>closeReplacement());
 function sampleConfirm(dt=16){
  if(!confirmPointer||!replacementState)return;
  const source=models.children[active]?.querySelector('canvas');if(!source)return;
  const box=confirm.getBoundingClientRect(),mix=reduced.matches?1:1-Math.exp(-dt/42);confirmPointer.x+=(confirmPointer.targetX-confirmPointer.x)*mix;confirmPointer.y+=(confirmPointer.targetY-confirmPointer.y)*mix;confirm.style.setProperty('--confirm-x',`${confirmPointer.x}px`);confirm.style.setProperty('--confirm-y',`${confirmPointer.y}px`);
  const look=current(),key=JSON.stringify([look.id,portraitKey(look),...measurementFields.map(f=>look[f.id]),Math.floor(performance.now()/150)]);
  if(key!==confirmSampleKey){sampleContext.clearRect(0,0,128,171);sampleContext.drawImage(source,0,0,128,171);confirmPixels=sampleContext.getImageData(0,0,128,171).data;confirmSampleKey=key;}
  const r=source.getBoundingClientRect(),x=Math.floor((box.left+confirmPointer.x-r.left)/r.width*128),y=Math.floor((box.top+confirmPointer.y-r.top)/r.height*171);
  confirm.classList.toggle('is-over-model',x>=0&&x<128&&y>=0&&y<171&&confirmPixels[(y*128+x)*4+3]>128);
 }
 const wrapRail=(index,count,phase)=>{let x=((index*160-phase)%(count*160)+count*160)%(count*160);if(x>count*80)x-=count*160;return x;};
 const replacementAnimation=(state,element,frames,duration,delay=0)=>{const a=element.animate(frames,{duration:reduced.matches?0:duration,delay:reduced.matches?0:delay,easing:'cubic-bezier(.4,0,.2,1)',fill:'forwards'});state.animations.push(a);return a;};
 const finished=a=>a.finished.catch(()=>{});
 function resetReplacement(keepPanelMotion=false){
  const state=replacementState;if(!state)return;if(state.filtered)offset=offset*cards.length/state.indices.length;replacementState=null;state.animations.forEach(a=>a.cancel());section.classList.remove('is-replacing');if(!keepPanelMotion)section.classList.remove('replacement-panel-motion');confirm.hidden=true;splitHome.hidden=true;splitHome.classList.remove('is-leaving');confirmPointer=null;confirmSampleKey='';confirmPixels=null;confirm.classList.remove('has-pointer','is-over-model');
  [stage,selector,rail].forEach(element=>element.inert=false);state.controls?.forEach(({element,inert})=>element.inert=inert);cards.forEach((c,i)=>{c.inert=false;c.style.pointerEvents='';const button=c.querySelector('.fitting-card-toggle');button.tabIndex=i<products.length?0:-1;button.setAttribute('aria-hidden',String(i>=products.length));c.style.opacity='1';c.style.transform=`translateX(${wrapRail(i,cards.length,offset)}px)`;});
 }
 function restoreReplacementPanel(state){
  if(state.restorePanel&&section.classList.contains('is-active')){openPanel('look',state.restoreFilter);Promise.all(panel.getAnimations().map(finished)).then(()=>{if(!replacementState)section.classList.remove('replacement-panel-motion');});}
  else section.classList.remove('replacement-panel-motion');
 }
 async function openReplacement(category){
  if(replacementState)return;const look=current();await livePreviews.get(look.id)?.promise;if(current()!==look||replacementState)return;if(!liveDesktop.matches){openPanel('replace',category);return;}
  closeRailActions();clearSavedReturn();
  const state={category,restoreFilter:filter,ids:outfitState.replacements(current(),category),animations:[],cardAnimations:[],phase:'closing',look:current(),restorePanel:true};
  state.indices=cards.map((c,i)=>state.ids.includes(Number(c.dataset.product))?i:-1).filter(i=>i>=0);state.ranks=new Map(state.indices.map((i,rank)=>[i,rank]));
  replacementState=state;cards.forEach((card,i)=>{card.inert=!state.ranks.has(i);card.style.pointerEvents=state.ranks.has(i)?'':'none';});section.classList.add('is-replacing','replacement-panel-motion');closePanel();
  state.controls=[selector,undo,section.querySelector('.fitting-model-factory'),...models.children].filter(e=>e&&e!==models.children[active]).map(element=>({element,opacity:getComputedStyle(element).opacity,inert:element.inert}));state.controls.forEach(({element})=>element.inert=true);stage.inert=true;selector.inert=true;rail.inert=true;
  const fades=[...state.controls,...cards.filter((_,i)=>!state.ranks.has(i)).map(element=>({element,opacity:1}))].map(({element,opacity})=>finished(replacementAnimation(state,element,[{opacity},{opacity:0}],280)));
  await Promise.all(fades);if(replacementState!==state)return;state.phase='moving';
  const startOffset=offset,targetOffset=offset*state.indices.length/cards.length;
  cards.forEach((card,i)=>{const rank=state.ranks.get(i),x=wrapRail(i,cards.length,startOffset),base=rank===undefined?x:wrapRail(rank,state.indices.length,targetOffset),target=rank===undefined?x:window.FitloopMotion.railTarget(x,base,state.indices.length,section.clientWidth);const a=replacementAnimation(state,card,[{transform:`translateX(${x}px)`,opacity:rank===undefined?0:1},{transform:`translateX(${target}px)`,opacity:rank===undefined?0:1}],700);state.cardAnimations.push(a);});
  const shift=section.clientHeight/2-(rail.offsetTop+rail.offsetHeight/2);state.shift=shift;
  state.railMotion=replacementAnimation(state,rail,[{transform:'none',clipPath:'inset(0 0 0 0)'},{transform:`translateY(${shift}px) scale(1.1)`,clipPath:'inset(0 54.5454545% 0 0)'}],700);
  await Promise.all([finished(state.railMotion),finished(replacementAnimation(state,models,[{transform:'none'},{transform:'translateX(25%)'}],700)),finished(replacementAnimation(state,divider,[{transform:'scaleY(0)'},{transform:'scaleY(1)'}],280,420))]);if(replacementState!==state)return;
  offset=targetOffset;state.filtered=true;cards.forEach((card,i)=>{const rank=state.ranks.get(i);card.style.transform=`translateX(${rank===undefined?0:wrapRail(rank,state.indices.length,offset)}px)`;card.style.opacity=rank===undefined?'0':'1';});state.cardAnimations.forEach(a=>a.cancel());
  state.phase='open';splitHome.hidden=false;rail.inert=false;cards.forEach((card,i)=>{const button=card.querySelector('.fitting-card-toggle'),entry=state.indices.indexOf(i);button.tabIndex=entry>=0&&entry<state.ids.length?0:-1;button.setAttribute('aria-hidden',String(button.tabIndex<0));});confirm.hidden=false;confirm.focus({preventScroll:true});announce(`Choose ${category.toLowerCase()}, then confirm on the right.`);
 }
 async function closeReplacement(){
  const state=replacementState;if(!state||state.phase==='returning')return;
  splitHome.classList.add('is-leaving');
  if(state.phase!=='open'){resetReplacement(true);restoreReplacementPanel(state);return;}
  state.phase='returning';rail.inert=true;confirm.hidden=true;confirmPointer=null;closeRailActions();
  const normalOffset=offset*cards.length/state.indices.length;
  cards.forEach((card,i)=>{const from=getComputedStyle(card).transform,to=wrapRail(i,cards.length,normalOffset);state.cardAnimations.push(replacementAnimation(state,card,[{transform:from,opacity:state.ranks.has(i)?1:0},{transform:`translateX(${to}px)`,opacity:1}],620));});
  const controls=state.controls.map(({element,opacity})=>finished(replacementAnimation(state,element,[{opacity:0},{opacity:0,offset:.52},{opacity}],620)));
  await Promise.all([finished(replacementAnimation(state,divider,[{transform:'scaleY(1)'},{transform:'scaleY(0)'}],300)),finished(replacementAnimation(state,rail,[{transform:getComputedStyle(rail).transform,clipPath:'inset(0 54.5454545% 0 0)'},{transform:'none',clipPath:'inset(0 0 0 0)'}],620)),finished(replacementAnimation(state,models,[{transform:'translateX(25%)'},{transform:'none'}],620)),...controls]);if(replacementState!==state)return;
  offset=normalOffset;state.filtered=false;resetReplacement(true);restoreReplacementPanel(state);if(state.pendingSaveOffer===current().id)window.FitloopSaveFlow?.offer?.(current().id);
 }
 document.addEventListener('keydown',event=>{if(event.key==='Escape'&&replacementState){event.preventDefault();event.stopPropagation();closeReplacement();}},true);
 document.addEventListener('fitloop-screen',event=>{if(event.detail.index!==2)resetReplacement();});
 window.addEventListener('resize',()=>{if(replacementState){const category=replacementState.category;resetReplacement();if(section.classList.contains('is-active'))openPanel('look',category);}});
 let entered=false,arrivalToken=0,arrivalAnimations=[];
 const intro=$('.fitting-intro'),selector=$('.look-switcher'),rail=$('.fitting-rail');
 const animateArrival=(element,frames,options)=>{const animation=element.animate(frames,{fill:'both',...options});arrivalAnimations.push(animation);return animation.finished.catch(()=>{});};
 function cancelArrival(){arrivalToken++;arrivalAnimations.forEach(a=>a.cancel());arrivalAnimations=[];section.classList.remove('fitting-arrived','fitting-entering','fitting-leaving');stage.inert=true;selector.inert=true;rail.inert=true;}
 async function enterFitting(){
  cancelArrival();const token=arrivalToken;section.classList.add('fitting-entering');
  if(!hasCreated){section.classList.remove('fitting-entering');section.classList.add('fitting-arrived');stage.inert=false;selector.inert=true;rail.inert=true;return;}
  if(reduced.matches||section.dataset.restoreLook==='true'){delete section.dataset.restoreLook;section.classList.remove('fitting-entering');section.classList.add('fitting-arrived');stage.inert=false;selector.inert=false;rail.inert=false;return;}
  await animateArrival(intro,[{opacity:0,transform:'translate(-50%,-50%) scale(.95)',filter:'blur(8px)'},{opacity:1,transform:'translate(-50%,-50%) scale(1)',filter:'blur(0)'}],{duration:450,easing:'cubic-bezier(.22,1,.36,1)'});if(token!==arrivalToken)return;
  await new Promise(resolve=>setTimeout(resolve,350));if(token!==arrivalToken)return;
  const disappear=animateArrival(intro,[{opacity:1,transform:'translate(-50%,-50%) scale(1)',filter:'blur(0)'},{opacity:0,transform:'translate(-50%,-50%) scale(.12)',filter:'blur(8px)'}],{duration:450,easing:'cubic-bezier(.4,0,.2,1)'});
  await animateArrival(models,[{opacity:0,transform:'scale(.12)'},{opacity:1,transform:'scale(.12)'}],{duration:450,easing:'ease-in-out'});await disappear;if(token!==arrivalToken)return;
  const growth=animateArrival(models,[{opacity:1,transform:'scale(.12)'},{opacity:1,transform:'scale(1)'}],{duration:760,easing:'cubic-bezier(.22,1,.36,1)'});
  const center=stage.getBoundingClientRect(),cx=center.x+center.width/2,cy=center.y+center.height/2;
  await Promise.all([growth,...[selector,rail].map((element,i)=>{const rect=element.getBoundingClientRect();return animateArrival(element,[{opacity:0,transform:`translate(${cx-rect.x-rect.width/2}px,${cy-rect.y-rect.height/2}px) scale(.12)`},{opacity:1,transform:'translate(0,0) scale(1)'}],{duration:600,delay:160+i*60,easing:'cubic-bezier(.22,1,.36,1)'});})]);if(token!==arrivalToken)return;
  section.classList.add('fitting-arrived');section.classList.remove('fitting-entering');stage.inert=false;selector.inert=false;rail.inert=false;
  arrivalAnimations.forEach(a=>a.cancel());arrivalAnimations=[];announce('Your fitting room is ready.');
 }
 async function exitFitting(destination=1){
  if(replacementState){replacementState.restorePanel=false;await closeReplacement();}
  closeRailActions();document.dispatchEvent(new Event('fitloop-close-factory'));
  if(panel.classList.contains('is-open'))closePanel();
  const arrived=section.classList.contains('fitting-arrived');
  if(!hasCreated||!arrived||reduced.matches){cancelArrival();return;}
  section.classList.add('fitting-leaving');stage.inert=true;selector.inert=true;rail.inert=true;
  const center=stage.getBoundingClientRect(),cx=center.x+center.width/2,cy=center.y+center.height/2;
  const controls=Promise.all([selector,rail].map((element,i)=>{const rect=element.getBoundingClientRect();return animateArrival(element,[{opacity:1,transform:'none'},{opacity:0,transform:`translate(${cx-rect.x-rect.width/2}px,${cy-rect.y-rect.height/2}px) scale(.12)`}],{duration:450,delay:i*40,easing:'cubic-bezier(.76,0,.24,1)'});}));
  if(destination===0&&matchMedia('(min-width:768px)').matches){
   await Promise.all([
    controls,animateArrival(models,[{opacity:1,transform:'scale(1)'},{opacity:0,transform:'scale(.12)'}],{duration:650,easing:'cubic-bezier(.4,0,.2,1)'}),
    ...[section.querySelector('.fitting-model-factory'),undo].filter(Boolean).map(el=>animateArrival(el,[{opacity:1},{opacity:0}],{duration:250,easing:'ease-out'}))
   ]);
   return;
  }
  await Promise.all([controls,animateArrival(models,[{opacity:1,transform:'scale(1)'},{opacity:1,transform:'scale(.12)'}],{duration:650,easing:'cubic-bezier(.4,0,.2,1)'})]);
  section.classList.remove('fitting-arrived');
  // Reverse the model/question crossfade before returning to the black section.
  await Promise.all([
   animateArrival(models,[{opacity:1,transform:'scale(.12)'},{opacity:0,transform:'scale(.12)'}],{duration:420,easing:'ease-in-out'}),
   animateArrival(intro,[{opacity:0,transform:'translate(-50%,-50%) scale(.12)',filter:'blur(8px)'},{opacity:1,transform:'translate(-50%,-50%) scale(1)',filter:'blur(0)'}],{duration:420,easing:'cubic-bezier(.4,0,.2,1)'})
  ]);
  await new Promise(resolve=>setTimeout(resolve,250));
  await animateArrival(intro,[{opacity:1,transform:'translate(-50%,-50%) scale(1)',filter:'blur(0)'},{opacity:0,transform:'translate(-50%,-50%) scale(.95)',filter:'blur(8px)'}],{duration:400,easing:'cubic-bezier(.4,0,.2,1)'});
 }
 let pendingSavedEdit=false;
 document.addEventListener('fitloop-screen',event=>{if(event.detail.index!==2)clearSavedReturn();if(event.detail.index===2){if(pendingReturn){pendingReturn=false;showSavedReturn();}delete section.dataset.restoreLook;if(pendingSavedEdit){pendingSavedEdit=false;openPanel('look');}}});
 async function prepareSave(){
  closeRailActions();
  if(panel.classList.contains('is-open')){
   closePanel();getComputedStyle(panel).transform;
   await Promise.all(panel.getAnimations().map(animation=>animation.finished.catch(()=>{})));
  }
  await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  renderPositions();
 }
 window.FitloopFitting={saveCurrent:saveCurrentLook,saveState:()=>({id:hasCreated?current().id:null,panelMode:panel.classList.contains('is-open')?mode:null,available:hasCreated&&!saving&&!pendingOutfits.has(current().id)&&!replacementState}),capture:renderPositions,prepareSave,async openSaved(record,edit=false){pendingReturn=true;await window.FitloopMotion.load(portraitKey(record));let index=hasCreated?looks.findIndex(look=>look.savedId===record.id):-1;const details={...record,savedId:record.id};delete details.id;if(index<0){if(!hasCreated){looks=[createLook(0,record.pants,record.name,details)];index=0;hasCreated=true;}else{looks.push(createLook(0,record.pants,record.name,details));index=looks.length-1;}}else Object.assign(looks[index],details,{name:limitName(record.name)});focus=index;focusVelocity=0;choose(index);if(panel.classList.contains('is-open'))closePanel();section.dataset.restoreLook='true';pendingSavedEdit=edit;if(location.hash==='#next'){if(edit)openPanel('look');}else location.hash='next';},exit:exitFitting,openCreate:()=>openPanel('create'),async createPerson({gender,height,weight,jacketSize='M',pantSize=30}){if(!['woman','man'].includes(gender)||!Number.isInteger(height)||height<140||height>210||!Number.isInteger(weight)||weight<40||weight>140||!jacketSizes.includes(jacketSize)||!pantSizes.includes(pantSize))throw Error('Invalid model settings');const pants=gender==='woman'?3:1,jacket=gender==='woman'?6:0;await window.FitloopMotion.load(portraitKey({gender,identity:gender,pants,jacket}));const beforeFactory=factoryRect(),wasEmpty=!hasCreated;if(panel.classList.contains('is-open'))closePanel({returnFactory:false});const look=createLook(0,pants,`Look ${String(hasCreated?looks.length+1:1).padStart(2,'0')}`,{identity:gender,gender,height,weight,jacket,jacketSize,pantSize});if(hasCreated)looks.push(look);else{looks=[look];hasCreated=true;}active=looks.length-1;thumbWindowStart=Math.max(0,active-1);mode='look';draft=measurementDraft(look);renderPeople();warmOtherGender(look);animateFactoryFrom(beforeFactory);if(wasEmpty)animateModelEntry();persistPeople();announce(`${gender==='man'?'Man':'Woman'} added, ${height} cm, ${weight} kg`);}};
 function observeEntry(){
  const active=section.classList.contains('is-active')&&document.body.classList.contains('experience-ready');
  if(section.classList.contains('fitting-suspended')){stage.inert=true;selector.inert=true;rail.inert=true;return;}
  if(replacementState){stage.inert=true;selector.inert=true;rail.inert=replacementState.phase!=='open';return;}
  if(active&&entered&&section.classList.contains('fitting-arrived')&&!section.classList.contains('fitting-leaving')){stage.inert=false;selector.inert=false;rail.inert=false;}
  if(active&&!entered){entered=true;last=0;updateGeometry();enterFitting();}else if(!active&&entered){entered=false;cancelArrival();if(panel.classList.contains('is-open'))closePanel();}
 }
 const observer=new MutationObserver(observeEntry);observer.observe(section,{attributes:true,attributeFilter:['class']});observer.observe(document.body,{attributes:true,attributeFilter:['class']});observeEntry();
 new ResizeObserver(updateGeometry).observe(stage);new ResizeObserver(updateBoundaries).observe(panel);
 document.fonts.ready.then(()=>{sizeLookName();updateBoundaries();updateFitNotices();alignPanelHeading();});
 function tick(time){
  const dt=last?Math.min(40,Math.max(0,time-last)):0;last=time;
  if(section.classList.contains('is-active')&&!document.hidden&&!document.body.classList.contains('menu-is-open')){
   if(reduced.matches||(Math.abs(active-focus)<.0001&&Math.abs(focusVelocity)<.001)){focus=active;focusVelocity=0;}else{const seconds=dt/1000,omega=9,displacement=focus-active,decay=Math.exp(-omega*seconds),step=(focusVelocity+omega*displacement)*seconds;focus=active+(displacement+step)*decay;focusVelocity=(focusVelocity-omega*step)*decay;}
   const split=replacementState,canMove=!split||['open','line'].includes(split.phase);
   if(canMove&&!hoverRail&&!focusRail&&!activeRailCard&&!reduced.matches)offset=(offset+18*dt/1000)%((split?split.indices.length:cards.length)*160);
   if(canMove)cards.forEach((card,i)=>{const rank=split?.ranks.get(i);card.style.opacity=split&&rank===undefined?'0':'1';const x=split?(rank===undefined?0:wrapRail(rank,split.indices.length,offset)):wrapRail(i,cards.length,offset);card.style.transform=`translateX(${x}px)`;});
   track.dataset.offset=offset.toFixed(2);renderPositions();sampleConfirm(dt);
  }
  frame=requestAnimationFrame(tick);
 }
 window.addEventListener('pagehide',()=>cancelAnimationFrame(frame));window.addEventListener('pageshow',event=>{if(event.persisted){last=0;frame=requestAnimationFrame(tick);}});
 renderPeople();frame=requestAnimationFrame(tick);
})();
