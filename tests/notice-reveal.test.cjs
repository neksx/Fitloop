const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync(new URL('../dist/fitting.js',`file://${__filename}`),'utf8');
const fn=source.slice(source.indexOf(' function alreadyWorn('),source.indexOf(" track.addEventListener('pointerenter'"));
for(const message of ['This item is already worn.','Designed for men.\nItem applied.','Designed for women.\nItem applied.'])test(`garment fades back without a visible flash after: ${message}`,async()=>{
 let reveal,opacityAtReveal;
 const visual={style:{},animate(frames,options){reveal={frames,options};return {finished:Promise.resolve(),cancel(){}};}};
 const notice={animate(){return {finished:Promise.resolve(),cancel(){}};}};
 const card={querySelector:s=>s==='.product-visual'?visual:notice,classList:{add(){},remove(){opacityAtReveal=visual.style.opacity;}}};
 const ctx={noticeAnimations:new WeakMap(),noticeReveals:new WeakMap(),reduced:{matches:false},announce(){}};
 const run=vm.runInNewContext(fn+';alreadyWorn',ctx);run(card,message);
 await new Promise(resolve=>setImmediate(resolve));
 assert.equal(opacityAtReveal,'0');assert.equal(reveal.options.duration,420);assert.deepEqual(JSON.parse(JSON.stringify(reveal.frames)),[{opacity:0},{opacity:1}]);assert.equal(visual.style.opacity,'');
});
