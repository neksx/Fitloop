const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync(new URL('../dist/fitting.js',`file://${__filename}`),'utf8');
const choose=source.slice(source.indexOf(' function choose(index)'),source.indexOf(" models.addEventListener('click'"));
const visibleFirst=source.slice(source.indexOf('const first=')+'const first='.length,source.indexOf(',visible=looks.slice'));
function fixture(active=0,hasCreated=true){
 const looks=[{name:'01'},{name:'02'},{name:'03'}],context={active,hasCreated,looks,thumbWindowStart:Math.min(active,1),replacementState:null,window:{FitloopSaveFlow:{hideOffer(){}}},mode:'look',measurementDraft:look=>look,renderPeople(){},warmOtherGender(){},persistPeople(){},announce(){},current(){return looks[context.active];},Math};
 const select=vm.runInNewContext(choose+';choose',context);
 const first=()=>vm.runInNewContext(visibleFirst,{...context,mobileThumbs:true,thumbLimit:2});
 return {select,first,context};
}
test('mobile thumbnails advance and return with the selected model visible',()=>{
 const f=fixture();assert.equal(f.first(),0);
 f.select(1);assert.equal(f.first(),1);assert.equal(f.context.active,1);
 f.select(2);assert.equal(f.first(),1);
 f.select(1);assert.equal(f.first(),0);assert.equal(f.context.active,1);
 f.select(0);assert.equal(f.first(),0);
});
test('reloaded third model starts with its own thumbnail visible',()=>{
 const f=fixture(2);assert.equal(f.first(),1);
 f.select(1);assert.equal(f.first(),0);
});
test('empty first visit cannot select an uncreated placeholder model',()=>{
 const f=fixture(0,false);f.select(0);assert.equal(f.context.hasCreated,false);assert.equal(f.first(),0);
});
