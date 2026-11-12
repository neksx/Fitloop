const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const state=require('../dist/fitting-state.js');
const source=fs.readFileSync(new URL('../dist/fitting.js',`file://${__filename}`),'utf8');
const deletion=source.slice(source.indexOf(' function deleteCurrentModel()'),source.indexOf(" removeModel.addEventListener('click',deleteCurrentModel)"));
const restoration=source.slice(source.indexOf(' async function undoLatest()'),source.indexOf(" undo.addEventListener('click',undoLatest)"));
function fixture(){
 const first=state.normalize({id:'first',name:'First',gender:'woman',identity:'woman',jacket:0,pants:3,height:172,weight:62,jacketSize:'M',pantSize:30});
 const second=state.normalize({...first,id:'second',name:'Second'}),actionHistory=[];
 const context={looks:[first,second],hasCreated:true,active:0,focus:0,thumbWindowStart:0,mode:'look',actionHistory,outfitRequest:0,undoing:false,
  undo:{disabled:true,focus(){}},pendingOutfits:new Map(),livePreviews:new Map(),portraitRenderers:new Map(),modelGhosts:new Map(),
  createLook:()=>({...first,id:'placeholder'}),measurementDraft:look=>({...look}),closePanel(){},renderPeople(){context.updateUndo();},persistPeople(){},announce(){},$(){return {focus(){}}},
  models:{children:[]},factoryRect:()=>null,modelRects:()=>new Map(),makeModelGhost:()=>null,animateModelShifts(){},animateFactoryFrom(){},animateModelEntry(){},
  current(){return context.looks[context.active];},outfitState:state,window:{FitloopMotion:{load:async()=>{}}},portraitKey:look=>`${look.jacket}-${look.pants}`,
  Math,Object};
 context.updateUndo=()=>{context.undo.disabled=context.undoing||!actionHistory.length;};
 const api=vm.runInNewContext(`${deletion}\n${restoration}\n({remove:deleteCurrentModel,undo:undoLatest})`,context);
 return {first,second,context,api};
}
test('Undo restores deleted models in reverse order, then the older garment change',async()=>{
 const {first,second,context,api}=fixture(),{actionHistory}=context;
 actionHistory.push({type:'outfit',id:first.id,...state.snapshot(first)});first.jacket=4;context.updateUndo();
 api.remove();assert.equal(context.looks.length,1);assert.equal(actionHistory.length,2);
 api.remove();assert.equal(context.hasCreated,false);assert.equal(context.undo.disabled,false);assert.equal(actionHistory.length,3);
 await api.undo();assert.equal(context.hasCreated,true);assert.equal(context.looks[0],second);assert.equal(actionHistory.length,2);
 await api.undo();assert.deepEqual(Array.from(context.looks,look=>look.id),[first.id,second.id]);assert.equal(first.jacket,4);
 await api.undo();assert.equal(first.jacket,0);assert.equal(actionHistory.length,0);assert.equal(context.undo.disabled,true);
});
test('deleting the only model leaves an empty fitting room with an enabled Undo',async()=>{
 const f=fixture();f.context.active=0;f.context.looks=[f.second];f.api.remove();
 assert.equal(f.context.hasCreated,false);assert.equal(f.context.undo.disabled,false);
 await f.api.undo();assert.equal(f.context.looks[0],f.second);assert.equal(f.context.hasCreated,true);
});
test('Undo follows mixed garment and model actions in their actual order',async()=>{
 const {first,second,context,api}=fixture(),history=context.actionHistory;
 history.push({type:'outfit',id:second.id,...state.snapshot(second)});second.jacket=4;context.active=1;context.updateUndo();
 api.remove();assert.equal(context.looks.length,1);
 history.push({type:'outfit',id:first.id,...state.snapshot(first)});first.pants=2;context.updateUndo();
 await api.undo();assert.equal(first.pants,3);assert.equal(context.looks.length,1);
 await api.undo();assert.equal(context.looks[1],second);assert.equal(second.jacket,4);
 await api.undo();assert.equal(second.jacket,0);assert.equal(history.length,0);
});
test('a fast Undo cancels the departing portrait before restoring that model',async()=>{
 const f=fixture();f.context.active=1;let cancelled=0;
 f.context.modelGhosts.set(f.second.id,{cancel(){cancelled++;}});
 f.api.remove();await f.api.undo();assert.equal(cancelled,1);assert.equal(f.context.looks[1],f.second);
});
