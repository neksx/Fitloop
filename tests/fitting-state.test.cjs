const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const state=require('../dist/fitting-state.js');
const base=()=>state.normalize({id:'a',gender:'woman',identity:'original',jacket:0,pants:1,height:172,weight:62,jacketSize:'M',pantSize:30});
test('all tops and bottoms stay independent in either selection order',()=>{
 for(const top of state.topIds)for(const bottom of state.bottomIds)for(const gender of ['woman','man']){
  const look={...base(),gender};
  assert.deepEqual(state.ids(state.select(state.select(look,top),bottom)),[top,bottom]);
  assert.deepEqual(state.ids(state.select(state.select(look,bottom),top)),[top,bottom]);
 }
});
test('replacement contains every item of that category and only the selected model gender',()=>{
 assert.deepEqual(state.replacements({gender:'woman'},'Tops'),[6,7,8]);assert.deepEqual(state.replacements({gender:'woman'},'Bottoms'),[9,10,11]);
 assert.deepEqual(state.replacements({gender:'man'},'Tops'),[0,4,5]);assert.deepEqual(state.replacements({gender:'man'},'Bottoms'),[1,2,3,12]);
});
test('new womenswear can also be deliberately tried on a man, then kept independently',()=>{
 const man={...base(),gender:'man',identity:'man'},look=state.select(state.select(man,8),10);
 assert.deepEqual(state.ids(look),[8,10]);assert.equal(state.mismatch(look,8),true);assert.equal(state.mismatch(look,10),true);
 const kept=state.keep(look,8);assert.equal(state.mismatch(kept,8),false);assert.equal(state.mismatch(kept,10),true);
 const restored=state.normalize(JSON.parse(JSON.stringify(kept)));assert.deepEqual(state.ids(restored),[8,10]);
});
test('opposite-gender advisory appears after applying; KEEP survives switching, saving and reload',()=>{
 const look=base();assert.equal(state.mismatch(look,0),false);
 const applied=state.select(look,4);assert.equal(applied.jacket,4);assert.equal(state.mismatch(applied,4),true);assert.equal(state.mismatch(applied,1),false);
 const kept=state.keep(applied,4);assert.equal(state.mismatch(kept,4),false);
 const reloaded=state.normalize(JSON.parse(JSON.stringify(kept)));assert.equal(state.mismatch(state.select(state.select(reloaded,5),4),4),false);
 assert.equal(state.mismatch(state.select({...base(),id:'b'},4),4),true);
 assert.equal(state.mismatch(state.select({...reloaded,gender:'man'},4),4),false);
});
test('legacy records get a valid top and no inherited advisory',()=>{
 assert.deepEqual(state.ids(state.normalize({pants:2})),[0,2]);assert.deepEqual(state.normalize({acknowledged:['bad','woman:4','woman:4']}).acknowledged,['woman:4']);
});
test('displayed range and warning share inclusive boundaries for every garment size and height',()=>{
 for(const height of [154,172,194])for(const jacketSize of ['XS','S','M','L','XL','XXL'])for(const pantSize of [24,30,48])for(const field of ['jacketSize','pantSize']){
  const look={...base(),height,jacketSize,pantSize},range=state.fit(look,field);
  assert.equal(state.fit({...look,weight:range.min},field).outside,false);assert.equal(state.fit({...look,weight:range.max},field).outside,false);
  assert.equal(state.fit({...look,weight:range.min-1},field).outside,true);assert.equal(state.fit({...look,weight:range.max+1},field).outside,true);
 }
});
const source=fs.readFileSync(new URL('../dist/fitting.js',`file://${__filename}`),'utf8');
test('legacy models without IDs migrate to distinct stable identities',()=>{
 let sequence=0;const declaration=source.slice(source.indexOf(' const createLook='),source.indexOf('\n let looks='));
 const create=vm.runInNewContext(`${declaration};createLook`,{outfitState:state,crypto:{randomUUID:()=>`model-${++sequence}`},limitName:x=>x});
 assert.notEqual(create(0,1,'A',{id:undefined}).id,create(0,1,'B',{id:undefined}).id);assert.equal(create(0,1,'A',{id:'known'}).id,'known');
});
function applicationFixture(){
 const look=base(),other={...base(),id:'b'},pending=[],calls=[],looks=[look,other];let selected=look;
 const context={products:Array.from({length:6},(_,i)=>({name:String(i),gender:'man'})),current:()=>selected,pendingOutfits:new Map(),outfitRequest:0,saving:false,replacementState:null,outfitState:state,track:{setAttribute(){},removeAttribute(){}},save:{disabled:false},livePreviews:new Map(),window:{FitloopMotion:{load:key=>new Promise((resolve,reject)=>pending.push({key,resolve,reject}))}},portraitKey:x=>`${x.gender}-${x.jacket}-${x.pants}`,looks,actionHistory:[],persistPeople:()=>calls.push('persist'),measurementDraft:x=>x,renderPeople:()=>calls.push('render'),updateUndo(){},mode:'look',panel:{classList:{contains:()=>false}},genderMismatch:()=>false,announce(){},productIdsFor:state.ids,console:{error(){}},Object,Set};
 const code=source.slice(source.indexOf(' async function applyProduct('),source.indexOf('\n const applyPants'));
 const run=vm.runInNewContext(`(${code.trim()})`,context);
 return {run,look,other,pending,calls,context,select:x=>selected=x};
}
test('a fast bottom selection retains an in-flight top and ignores the superseded response',async()=>{
 const f=applicationFixture(),top=f.run(4),bottom=f.run(2);await Promise.resolve();
 assert.equal(f.pending[1].key,'woman-4-2');f.pending[1].resolve();await bottom;f.pending[0].resolve();await top;
 assert.deepEqual(state.ids(f.look),[4,2]);assert.equal(f.context.actionHistory.length,1);assert.equal(f.context.save.disabled,false);
});
test('a late outfit updates its own model and never the newly selected model panel',async()=>{
 const f=applicationFixture(),apply=f.run(5);await Promise.resolve();f.select(f.other);f.pending[0].resolve();await apply;
 assert.equal(f.look.jacket,5);assert.equal(f.other.jacket,0);assert.deepEqual(f.calls,['persist']);
});
test('the advisory stays on the clicked copy, even when the same garment is repeated elsewhere',async()=>{
 const f=applicationFixture(),clicked={isConnected:true,dataset:{product:'4'}},other={isConnected:true,dataset:{product:'4'}},notices=[];
 f.context.cards=[other,clicked];f.context.genderMismatch=()=>true;f.context.alreadyWorn=(card,message)=>notices.push({card,message});
 const request=f.run(4,clicked);await Promise.resolve();f.pending[0].resolve();await request;assert.equal(notices.length,1);assert.equal(notices[0].card,clicked);
});
test('a gender change during garment loading resolves the matching portrait before committing',async()=>{
 const f=applicationFixture(),request=f.run(4);await Promise.resolve();assert.equal(f.pending[0].key,'woman-4-1');f.look.gender='man';f.look.identity='man';f.pending[0].resolve();await new Promise(resolve=>setImmediate(resolve));
 assert.equal(f.pending[1].key,'man-4-1');f.pending[1].resolve();await request;assert.equal(f.look.gender,'man');assert.equal(f.look.jacket,4);assert(f.look.reviewed.includes('man:4'));
});
test('failed loading leaves the outfit intact and permits a fresh selection',async()=>{
 const f=applicationFixture(),first=f.run(4);await Promise.resolve();f.pending[0].reject(Error('offline'));await first;
 assert.equal(f.look.jacket,0);assert.equal(f.context.save.disabled,false);
 const second=f.run(5);await Promise.resolve();f.pending[1].resolve();await second;assert.equal(f.look.jacket,5);
});
test('every selectable combination has a local portrait and head assets',()=>{
 const manifest=JSON.parse(fs.readFileSync(new URL('../dist/assets/fitting-room/static-models-v24.json',`file://${__filename}`)));
 for(const sex of ['woman','man'])for(const jacket of ['tie-dye','leather-anorak'])for(const pants of [0,1,2]){
  const set=manifest.sets[`${sex}-${jacket}-${pants}`];assert(set);for(const file of [...set.files,set.alpha,set.head?.file,set.head?.alpha].filter(Boolean))assert(fs.existsSync(new URL(`../dist/${file}`,`file://${__filename}`)),file);
 }
});
test('all 84 gender/top/bottom combinations resolve to complete local assets without cycles',()=>{
 const manifest=JSON.parse(fs.readFileSync(new URL('../dist/assets/fitting-room/static-models-v24.json',`file://${__filename}`)));
 const visit=(key,parents=new Set())=>{assert(!parents.has(key),'Asset dependency cycle: '+key);const set=manifest.sets[key];assert(set,'Missing '+key);const next=new Set([...parents,key]);for(const file of [...set.files,set.alpha,set.head?.file,set.head?.alpha].filter(Boolean))assert(fs.existsSync(new URL(`../dist/${file}`,`file://${__filename}`)),file);if(set.composite){visit(set.composite.top,next);visit(set.composite.bottom,next);}};
 for(const gender of ['woman','man'])for(const jacket of state.topIds)for(let pants=0;pants<state.bottomIds.length;pants++)visit(state.portraitKey({gender,identity:gender,jacket,pants}));
});
test('saving captures that model and its settings before an asynchronous model switch',async()=>{
 const first=base(),other={...base(),id:'b',height:190},saved=[];let selected=first,release;
 const pending=new Promise(resolve=>release=resolve),save={disabled:false,querySelector:()=>({textContent:''}),addEventListener(_event,fn){this.run=fn;}};
 const context={save,current:()=>selected,pendingOutfits:new Map(),livePreviews:new Map([[first.id,{promise:pending}]]),mode:'look',draft:{gender:'woman',height:175,weight:65,jacketSize:'M',pantSize:30},saving:false,replacementState:null,panel:{classList:{contains:()=>true}},looks:[first,other],window:{FitloopMotion:{load:async()=>{}},FitloopSaved:{save:x=>saved.push({...x})},FitloopSaveFlow:{play:async()=>{}}},portraitKey:x=>String(x.pants),persistPeople(){},localStorage:{setItem(){}},key:'test',renderPeople(){},announce(){},Date,Object,JSON};
 const handler=source.slice(source.indexOf(' async function saveCurrentLook('),source.indexOf('\n const originalCards'));
 vm.runInNewContext(handler,context);const saving=save.run();assert.equal(save.disabled,true);await save.run();selected=other;context.draft={...context.draft,height:190};release();await saving;
 assert.equal(saved.length,1);assert.equal(saved[0].id,'a');assert.equal(saved[0].height,175);assert.equal(other.height,190);assert.equal(save.disabled,false);
});
test('cycling a rail card changes only the clicked copy and covers its full category',()=>{
 const catalog=require('../dist/fitting-catalog.js'),initial=catalog.map(p=>p.id);
 for(const slot of initial){let order=initial.slice();const original=catalog[slot],allowed=state.replacements(original,original.category);
  const seen=new Set();for(let i=0;i<12;i++){const before=order.slice(),next=state.cycleCard(order,slot,allowed);assert.deepEqual(next.filter((_,index)=>index!==slot),before.filter((_,index)=>index!==slot));assert.notEqual(next[slot],before[slot]);assert.equal(catalog[next[slot]].category,original.category);assert.equal(catalog[next[slot]].gender,original.gender);seen.add(next[slot]);order=next;}assert.deepEqual([...seen].sort(),allowed.slice().sort());
 }
});
test('white card cycling never applies clothes or opens replacement navigation',()=>{
 const fn=source.slice(source.indexOf(' async function replace(card)'),source.indexOf('\n function refresh('));assert(!/applyProduct|openReplacement|refresh\(/.test(fn));
});
test('normal rows only offer VIEW; opposite-gender rows keep independent KEEP and REPLACE',()=>{
 const row=vm.runInNewContext(source.slice(source.indexOf(' function productRow('),source.indexOf('\n function updateFitNotices'))+';productRow',{products:require('../dist/fitting-catalog.js'),escape:x=>x,productLabel:x=>x,art:()=>'',thinCorners:()=>'',current:()=>base(),genderMismatch:id=>id===4});
 assert(!row(0).includes('>REPLACE<'));assert(row(0).includes('>VIEW<'));assert(row(4).includes('>KEEP<'));assert(row(4).includes('>REPLACE<'));
});

test('choosing a mobile replacement restores profile content before applying the garment',()=>{
 const branch=source.slice(source.indexOf("  if(mode==='replace'){mode='look'"),source.indexOf("  mode='gallery';galleryItem=id"));const calls=[],context={mode:'replace',filter:'Tops',renderPanel:()=>calls.push('profile'),applyProduct:id=>calls.push(id),id:5};
 vm.runInNewContext('(function(){'+branch+'})()',context);assert.equal(context.mode,'look');assert.equal(context.filter,'All');assert.deepEqual(calls,['profile',5]);
});
test('the save offer appears only for a real outfit change made by a REFRESH card',async()=>{
 const f=applicationFixture(),offers=[];f.context.window.FitloopSaveFlow={offer:id=>offers.push(id)};
 const first=f.run(4,{});await Promise.resolve();f.pending[0].resolve();await first;assert.deepEqual(offers,['a']);
 const unchanged=f.run(4,{});await Promise.resolve();f.pending[1].resolve();await unchanged;assert.deepEqual(offers,['a']);
 const sidebar=f.run(5);await Promise.resolve();f.pending[2].resolve();await sidebar;assert.deepEqual(offers,['a']);
});
test('REFRESH during split selection defers its offer until the selector returns',async()=>{
 const f=applicationFixture(),offers=[];f.context.window.FitloopSaveFlow={offer:id=>offers.push(id)};f.context.replacementState={};
 const change=f.run(4,{});await Promise.resolve();f.pending[0].resolve();await change;assert.equal(f.context.replacementState.pendingSaveOffer,'a');assert.deepEqual(offers,[]);
});
