const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),test=require('node:test');
const source=fs.readFileSync(new URL('../dist/save-flow.js',`file://${__filename}`),'utf8');
function fixture(){
 let now=0,saved=0;const classes=new Set(),frames=[],intervals=new Map(),state={id:'a',available:true},time={textContent:''},button={addEventListener(_name,fn){this.click=fn;}};
 const offer={inert:true,classList:{add:c=>classes.add(c),remove:c=>classes.delete(c)},setAttribute(){},querySelector:s=>s==='button'?button:time};
 const room={classList:{contains:c=>['is-active','fitting-arrived'].includes(c)}};
 const context={offer,room,running:false,offerTimer:0,offerVersion:0,offeredId:null,offerDeadline:0,Date:{now:()=>now},Math,clearInterval:id=>intervals.delete(id),setInterval:fn=>{const id=intervals.size+1;intervals.set(id,fn);return id;},requestAnimationFrame:fn=>frames.push(fn),window:{FitloopFitting:{saveState:()=>({...state}),saveCurrent:()=>saved++}}};
 const code=source.slice(source.indexOf(' function hideOffer('),source.indexOf(" document.addEventListener('fitloop-screen'"));
 const api=vm.runInNewContext(code+';({offerLook,hideOffer})',context);
 return{...api,offer,state,time,button,classes,context,saved:()=>saved,flush:()=>{while(frames.length)frames.shift()();},advance:ms=>{now=ms;[...intervals.values()].forEach(fn=>fn());}};
}
test('the under-model offer counts down ten seconds and expires without saving automatically',()=>{
 const f=fixture();f.offerLook('a');f.flush();assert.equal(f.time.textContent,'10 sec');assert.equal(f.offer.inert,false);
 f.advance(9001);assert.equal(f.time.textContent,'1 sec');f.advance(10000);assert.equal(f.offer.inert,true);assert.equal(f.classes.has('is-visible'),false);assert.equal(f.saved(),0);
});
test('a queued prompt for the previous model cannot replace or save the newer model',()=>{
 const f=fixture();f.offerLook('a');f.state.id='b';f.offerLook('b');f.flush();assert.equal(f.context.offeredId,'b');
 f.state.id='c';f.button.click();assert.equal(f.saved(),0);assert.equal(f.offer.inert,true);
});
test('clicking SAVE invokes the shared saver once and dismisses the timed offer',()=>{
 const f=fixture();f.offerLook('a');f.flush();f.button.click();assert.equal(f.saved(),1);assert.equal(f.offer.inert,true);f.button.click();assert.equal(f.saved(),1);
});
test('saving from the closed panel uses the active model settings instead of an older draft',async()=>{
 const fitting=fs.readFileSync(new URL('../dist/fitting.js',`file://${__filename}`),'utf8'),look={id:'a',name:'Current',identity:'woman',gender:'woman',height:172,weight:62,pants:6,jacket:6},saved=[];
 const code=fitting.slice(fitting.indexOf(' async function saveCurrentLook('),fitting.indexOf(" save.addEventListener('click'"));
 const fn=vm.runInNewContext(`(${code.trim()})`,{saving:false,pendingOutfits:new Map(),replacementState:null,current:()=>look,panel:{classList:{contains:()=>false}},mode:'look',draft:{height:190,gender:'man'},measurementDraft:x=>({gender:x.gender,height:x.height,weight:x.weight}),save:{disabled:false,querySelector:()=>({textContent:''})},livePreviews:new Map(),looks:[look],window:{FitloopMotion:{load:async()=>{}},FitloopSaved:{save:x=>saved.push({...x})},FitloopSaveFlow:{play:async()=>{}}},portraitKey:()=>'',persistPeople(){},localStorage:{setItem(){}},key:'test',renderPeople(){},announce(){},Date,Object,JSON});
 await fn();assert.equal(saved.length,1);assert.equal(saved[0].height,172);assert.equal(saved[0].gender,'woman');assert.equal(saved[0].pants,6);
});
