const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const test=require('node:test');
const source=fs.readFileSync(new URL('../dist/fitting.js',`file://${__filename}`),'utf8');

function focusFixture(keyboard,rect,replacing=true){
 const context=vm.createContext({focusRail:false,offset:200,replacementState:replacing?{}:null,section:{clientWidth:1440},track:{clientWidth:1440}});
 const fn=source.slice(source.indexOf(' function focusRailControl('),source.indexOf(" track.addEventListener('focusin',focusRailControl)"));
 const run=vm.runInContext(`(${fn.trim()})`,context);
 run({target:{matches:()=>keyboard,closest:()=>({getBoundingClientRect:()=>rect})}});return context;
}
test('pointer focus on a card crossing the divider never recenters the rail',()=>{
 const f=focusFixture(false,{left:650,right:826});assert.equal(f.offset,200);assert.equal(f.focusRail,false);
});
test('keyboard focus still brings a partly hidden card into the visible half',()=>{
 const f=focusFixture(true,{left:650,right:826});assert.equal(f.focusRail,true);assert(Math.abs(f.offset-(200+(650-272)/1.1))<.001);
 const visible=focusFixture(true,{left:200,right:376});assert.equal(visible.offset,200);
});

function actionFixture(id=11){
 const calls=[],card={dataset:{product:String(id)}},action={dataset:{action:'refresh'}};
 const context=vm.createContext({railPress:{card,id,action:'refresh',busy:false},desktopActions:{matches:true},activeRailCard:null,replacementState:{ids:[9,10,11]},cyclingRail:false,
  productIds:()=>[6,9],closeRailActions:()=>calls.push('close'),refresh:(value,origin)=>calls.push({value,origin}),replace:()=>calls.push('replace')});
 const fn=source.slice(source.indexOf(' function actOnRail('),source.indexOf(" track.addEventListener('click',actOnRail)"));
 const run=vm.runInContext(`(${fn.trim()})`,context),event={detail:1,target:{closest:selector=>selector==='[data-product]'?card:action}};
 return {calls,card,action,context,run:()=>run(event),keyboard:()=>run({...event,detail:0})};
}
test('refresh applies the displayed garment ID, including after a card was cycled',()=>{
 const f=actionFixture(11);f.run();assert.deepEqual(f.calls,['close',{value:11,origin:f.card}]);
});
test('a card changing between pointer press and release cannot apply a different garment',()=>{
 const f=actionFixture(11);f.card.dataset.product='10';f.run();assert.deepEqual(f.calls,[]);
 const busy=actionFixture(11);busy.context.railPress.busy=true;busy.run();assert.deepEqual(busy.calls,[]);
});
test('keyboard refresh remains available without a pointer press',()=>{
 const f=actionFixture(10);f.context.railPress=null;f.keyboard();assert.deepEqual(f.calls,['close',{value:10,origin:f.card}]);
});
test('replacement Back closes the selector locally without a section navigation',()=>{
 let click,closed=0,prevented=0,stopped=0;
 const listener=source.slice(source.indexOf(" splitHome.addEventListener('click'"),source.indexOf('\n const divider='));
 vm.runInNewContext(listener,{splitHome:{addEventListener:(_name,fn)=>click=fn},closeReplacement:()=>closed++});
 click({target:{closest:()=>({})},preventDefault:()=>prevented++,stopPropagation:()=>stopped++});assert.deepEqual([closed,prevented,stopped],[1,1,1]);
});
test('returning from replacement restores the filter that was open before it',()=>{
 const calls=[],fn=source.slice(source.indexOf(' function restoreReplacementPanel('),source.indexOf(' async function openReplacement('));
 const run=vm.runInNewContext(`(${fn.trim()})`,{section:{classList:{contains:()=>true}},openPanel:(mode,filter)=>calls.push({mode,filter}),panel:{getAnimations:()=>[]},finished:x=>x,replacementState:{},Promise});
 run({restorePanel:true,category:'Bottoms',restoreFilter:'All'});assert.deepEqual(calls,[{mode:'look',filter:'All'}]);
});
test('white REPLACE animates and updates only the clicked DOM card, leaving other copies intact',async()=>{
 const state=require('../dist/fitting-state.js'),products=require('../dist/fitting-catalog.js'),animated=[];
 function makeCard(id){
  const card={dataset:{product:String(id)},setAttribute(){},removeAttribute(){},querySelectorAll:()=>[],querySelector:selector=>selector==='.local-worn-notice'?null:selector==='.fitting-card-toggle'?{setAttribute(){}}:{animate:()=>{animated.push(card);return {finished:Promise.resolve()};},set outerHTML(_value){}}};return card;
 }
 const clicked=makeCard(10),sameProductCopy=makeCard(10),neighbor=makeCard(11);
 const fn=source.slice(source.indexOf(' async function replace(card)'),source.indexOf('\n function refresh('));
 const context=vm.createContext({cyclingRail:false,replacementState:null,products,outfitState:state,reduced:{matches:false},noticeAnimations:new WeakMap(),railVisual:id=>String(id),announce(){}});
 await vm.runInContext(`(${fn.trim()})`,context)(clicked);
 assert.equal(clicked.dataset.product,'11');assert.equal(sameProductCopy.dataset.product,'10');assert.equal(neighbor.dataset.product,'11');assert.deepEqual(animated,[clicked,clicked]);assert.equal(context.cyclingRail,false);
});
