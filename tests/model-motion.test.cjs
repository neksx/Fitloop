const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync(new URL('../dist/fitting.js',`file://${__filename}`),'utf8');
const motion=source.slice(source.indexOf(" const modelEase='"),source.indexOf(' function deleteCurrentModel()'));
function fixture(reduced=false){
 const calls=[],factory={getBoundingClientRect:()=>({left:120,top:80}),animate:(frames,options)=>{calls.push({element:'plus',frames,options});return {finished:new Promise(()=>{}),cancel(){}};}};
 const model={dataset:{personId:'person'},style:{transform:'translateX(-50%) scale(1)',opacity:'1'},getBoundingClientRect:()=>({left:100,top:70,width:100,height:300}),animate:(frames,options)=>{calls.push({element:'model',frames,options});return {finished:new Promise(()=>{}),cancel(){}};}};
 const context={reduced:{matches:reduced},active:0,document:{addEventListener(){}},section:{classList:{contains:()=>true},querySelector:()=>factory},models:{children:[model]},Math,Map,WeakMap};
 const api=vm.runInNewContext(motion+';({animateFactoryFrom,animateModelShifts,animateModelEntry})',context);
 return {api,calls,model};
}
test('the first-model plus travels from its prior point while the panel opens',()=>{
 const f=fixture();f.api.animateFactoryFrom({left:20,top:50});
 assert.equal(f.calls[0].element,'plus');assert.equal(f.calls[0].frames[0].transform,'translate(-100px,-30px)');assert.equal(f.calls[0].frames[1].transform,'translate(0,0)');assert(f.calls[0].options.duration>=700);
});
test('surviving models slide to their new positions and a restored model fades in',()=>{
 const f=fixture();f.api.animateModelShifts(new Map([['person',{rect:{left:200,top:90,width:80,height:240},opacity:'.4'}]]));f.api.animateModelEntry(-1);
 assert.equal(f.calls[0].frames[0].transform,'translateX(90px) translateX(-50%) scale(0.8)');assert.equal(f.calls[0].frames[0].opacity,'.4');
 assert.match(f.calls[1].frames[0].transform,/translateX\(-72px\).*scale\(\.9\)/);assert.equal(f.calls[1].frames[0].opacity,0);assert.equal(f.calls[1].frames[1].opacity,'1');
});
test('reduced motion skips the added transitions',()=>{
 const f=fixture(true);f.api.animateFactoryFrom({left:20,top:50});f.api.animateModelShifts(new Map([['person',{rect:{left:200,top:90,width:80,height:240},opacity:'.4'}]]));f.api.animateModelEntry();assert.equal(f.calls.length,0);
});
test('closing the first-model panel returns the plus to the center',()=>{
 const close=source.slice(source.indexOf(' function closePanel('),source.indexOf(" $('.fitting-close').addEventListener('click',closePanel)"));
 const moves=[],before={left:100,top:80},panel={classList:{remove(){}},setAttribute(){},inert:false},context={hasCreated:false,mode:'create',panel,section:{classList:{remove(){}}},factoryRect:()=>before,animateFactoryFrom:rect=>moves.push(rect),previousFocus:{isConnected:true,focus(){}},models:{children:[]},$(){return {setAttribute(){}}}};
 const run=vm.runInNewContext(close+';closePanel',context);run();assert.equal(moves[0],before);run({returnFactory:false});assert.equal(moves[1],null);
});
