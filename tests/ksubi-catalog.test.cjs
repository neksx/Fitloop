const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),test=require('node:test');
const catalog=require('../dist/fitting-catalog.js'),state=require('../dist/fitting-state.js');
test('the new Ksubi bottom survives saved-look validation and invalid indices are rejected',()=>{
 const source=fs.readFileSync(new URL('../dist/saved-looks.js',`file://${__filename}`),'utf8');
 const declaration=source.slice(source.indexOf(' const valid='),source.indexOf('\n let items='));
 const valid=vm.runInNewContext(declaration+';valid',{window:{FitloopState:state}}),record={name:'Ksubi look',identity:'man',gender:'man',pants:6};
 assert(valid(record));assert(!valid({...record,pants:7}));assert(!valid({...record,pants:'6'}));
 for(const gender of ['woman','man'])for(const jacket of state.topIds){const look=state.select({gender,identity:gender,jacket,pants:1},12);assert.equal(look.jacket,jacket);assert.equal(look.pants,6);assert.equal(state.ids(look)[1],12);}
});
test('Ksubi gallery links to the Ksubi guide and retains the Purple guide for existing garments',()=>{
 const source=fs.readFileSync(new URL('../dist/fitting-sizing.js',`file://${__filename}`),'utf8'),context={window:{}};vm.runInNewContext(source,context);
 const look={gender:'man',height:172,weight:62},ksubi=context.window.FitloopSizeGuide.markup(catalog[12],look),purple=context.window.FitloopSizeGuide.markup(catalog[0],look);
 assert(ksubi.includes('https://ksubi.com.au/pages/jean-fit-guide-mens'));assert(ksubi.includes('KSUBI SIZE GUIDE'));assert(!ksubi.includes('PURPLE SIZE GUIDE'));assert(purple.includes('PURPLE SIZE GUIDE'));
});
