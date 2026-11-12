const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const test=require('node:test');
const source=fs.readFileSync(new URL('../dist/fitting.js',`file://${__filename}`),'utf8');
const exit=source.slice(source.indexOf(' async function exitFitting('),source.indexOf(' let pendingSavedEdit='));
function fixture(reduced=false,replacing=false,hasCreated=true){
 const calls=[],classes=new Set(['fitting-arrived']);
 const node=name=>({name,inert:false,getBoundingClientRect:()=>({x:0,y:90,width:400,height:400})});
 const models=node('models'),intro=node('intro'),stage=node('stage'),selector=node('selector'),rail=node('rail'),undo=node('undo'),factory=node('factory');
 const context=vm.createContext({hasCreated,models,intro,stage,selector,rail,undo,replacementState:replacing?{restorePanel:true}:null,closeReplacement:async()=>{calls.push({name:'split',restorePanel:context.replacementState.restorePanel});context.replacementState=null;},reduced:{matches:reduced},
  panel:{classList:{contains:()=>false}},section:{classList:{contains:c=>classes.has(c),add:c=>classes.add(c),remove:c=>classes.delete(c)},querySelector:()=>factory},
  closeRailActions(){},closePanel(){},document:{dispatchEvent(){}},Event:class{},matchMedia:()=>({matches:true}),
  cancelArrival(){calls.push({name:'cancel'});},
  async animateArrival(element,frames){calls.push({name:element.name,frames,modelStillVisible:classes.has('fitting-arrived')});}
 });
 return {run:vm.runInContext(`(${exit.trim()})`,context),calls,stage,selector,rail};
}
test('logo closes the model once, without hiding it before the shrink or replaying the question',async()=>{
 const f=fixture();await f.run(0);
 const model=f.calls.filter(c=>c.name==='models');assert.equal(model.length,1);
 assert.equal(model[0].frames[0].opacity,1);assert.equal(model[0].frames[1].opacity,0);
 assert.equal(model[0].frames[0].transform,'scale(1)');assert.equal(model[0].frames[1].transform,'scale(.12)');
 assert.ok(f.calls.every(c=>c.modelStillVisible));assert.ok(!f.calls.some(c=>c.name==='intro'));
 assert.ok(f.stage.inert&&f.selector.inert&&f.rail.inert);
});
test('reduced-motion logo exit cancels arrival instead of playing another scale sequence',async()=>{
 const f=fixture(true);await f.run(0);assert.equal(f.calls.length,1);assert.equal(f.calls[0].name,'cancel');
});

test('home exit reverses an open replacement before the normal exit without reopening the profile',async()=>{
 const f=fixture(false,true);await f.run(0);assert.equal(f.calls[0].name,'split');assert.equal(f.calls[0].restorePanel,false);assert.equal(f.calls.filter(c=>c.name==='models').length,1);
});


test('BACK from the empty fitting room skips the model and intro exit animations',async()=>{
 const f=fixture(false,false,false);
 await f.run(1);
 assert.deepEqual(f.calls,[{name:'cancel'}]);
});
