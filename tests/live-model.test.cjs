const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const motionSource=fs.readFileSync(new URL('../dist/fitting-motion.js',`file://${__filename}`),'utf8');
async function motionFixture(){
 let time=0;const uniforms={},sets=Object.fromEntries(['0','1','2','man-1','woman-1'].map(key=>[key,{files:[key],placement:[.5,.02,1,1]}]));
 const gl=new Proxy({COMPILE_STATUS:1,LINK_STATUS:2,TEXTURE0:0,TEXTURE1:1,getShaderParameter:()=>true,getProgramParameter:()=>true,getUniformLocation:(_,name)=>name,uniform4fv:(name,value)=>uniforms[name]=Array.from(value),uniform1f:(name,value)=>uniforms[name]=value}, {get:(o,key)=>key in o?o[key]:()=>({})});
 const canvas={dataset:{},width:768,height:1024,getContext:()=>gl,addEventListener(){}};
 const context={window:{},performance:{now:()=>time},fetch:async()=>({ok:true,json:async()=>({sets})}),Image:class{set src(_){this.onload();}},Math,Promise};
 vm.runInNewContext(motionSource,context);await context.window.FitloopMotion.ready;await Promise.all(['man-1','woman-1'].map(key=>context.window.FitloopMotion.load(key)));
 const renderer=new context.window.FitloopMotion.Motion(canvas);await Promise.resolve();
 return {renderer,canvas,uniforms,api:context.window.FitloopMotion,setTime:value=>time=value};
}
const fit={height:172,weight:62,jacketSize:'M',pantSize:30};
test('a card ending inside the replacement panel cannot jump when its animation finishes',async()=>{
 const {api}=await motionFixture();
 assert.equal(api.railTarget(1880,230,12,1280),230);
 for(const width of [1280,1440,1920])for(let to=-160;to<width/2/1.1+160;to+=80)for(const from of [-3500,-1800,1000,3500])assert.equal(api.railTarget(from,to,12,width),to);
});
test('live sizing starts at the displayed shape and settles over 320ms',async()=>{
 const f=await motionFixture();f.renderer.draw('1',0,0,true,fit,true);
 f.renderer.draw('1',0,0,true,{...fit,height:176,weight:70},true);assert.deepEqual(f.uniforms.fit,[1,1,1,1]);
 f.setTime(160);f.renderer.draw('1',0,0,true,{...fit,height:176,weight:70},true);assert(f.uniforms.fit[0]>1&&f.uniforms.fit[0]<176/172);
 f.setTime(320);f.renderer.draw('1',0,0,true,{...fit,height:176,weight:70},true);assert.equal(f.uniforms.fit[0],176/172);
});
test('an explicit gender change animates even with idle jitter disabled, then settles',async()=>{
 const f=await motionFixture();f.renderer.draw('1',0,0,true,fit,true);f.renderer.draw('man-1',0,0,true,fit,true);
 assert.equal(f.canvas.dataset.liveTransition,'identity');assert.equal(f.uniforms.change,0);assert.equal(f.uniforms.effects,0);
 f.setTime(450);f.renderer.draw('man-1',0,0,true,fit,true);assert.equal(f.uniforms.change,.5);
 f.setTime(900);f.renderer.draw('man-1',0,0,true,fit,true);assert.equal(f.canvas.dataset.liveTransition,'idle');assert.equal(f.uniforms.change,1);
});
test('saved-card shared rendering and reduced motion do not crossfade between different people',async()=>{
 const f=await motionFixture();f.renderer.draw('1',0,0,true,fit,false);f.renderer.draw('man-1',0,0,true,{...fit,weight:80},false);
 assert.equal(f.canvas.dataset.liveTransition,'idle');assert.equal(f.uniforms.change,1);assert.equal(f.uniforms.fit[1],1+18*.0045);
});
const fittingSource=fs.readFileSync(new URL('../dist/fitting.js',`file://${__filename}`),'utf8');
const preview=fittingSource.slice(fittingSource.indexOf(' async function previewMeasurements('),fittingSource.indexOf('\n function syncMeasurement('));
function previewFixture(){
 const pending=[],calls=[],look={id:'a',identity:'original',gender:'woman',pants:1},other={id:'b',identity:'man',gender:'man',pants:1};
 const context={livePreviews:new Map(),femaleIdentities:new Map(),looks:[look,other],window:{FitloopMotion:{load:key=>new Promise(resolve=>pending.push({key,resolve}))}},portraitKey:p=>p.identity==='original'?String(p.pants):`${p.identity}-${p.pants}`,models:{querySelector:()=>null},thumbs:{querySelector:()=>null},current:()=>other,section:{querySelectorAll(){throw Error('Another selected person must not be refreshed');}},persistPeople:()=>calls.push('persist'),announce:()=>{},Object};
 return {look,other,pending,calls,run:vm.runInNewContext(`(${preview.trim()})`,vm.createContext(context))};
}
test('a late male asset cannot overwrite the newer female selection',async()=>{
 const f=previewFixture(),a=f.run(f.look,{gender:'man',height:180}),b=f.run(f.look,{gender:'woman',height:175});
 f.pending[1].resolve();await b;f.pending[0].resolve();await a;
 assert.equal(f.look.gender,'woman');assert.equal(f.look.height,175);assert.equal(f.look.identity,'original');assert.equal(f.calls.length,1);assert.equal(f.other.gender,'man');
});
test('switching back restores the same original woman identity',async()=>{
 const f=previewFixture();const male=f.run(f.look,{gender:'man',height:172});f.pending[0].resolve();await male;
 assert.equal(f.look.identity,'man');const female=f.run(f.look,{gender:'woman',height:172});assert.equal(f.pending[1].key,'1');f.pending[1].resolve();await female;assert.equal(f.look.identity,'original');
});
