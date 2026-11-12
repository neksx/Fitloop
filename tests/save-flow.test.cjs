const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),test=require('node:test');
const source=fs.readFileSync(new URL('../dist/save-flow.js',`file://${__filename}`),'utf8');
test('the save-flight snapshot contains the full portrait at either canvas resolution',()=>{
 for(const [width,height] of [[1536,2048],[768,1024]]){
  let args;const canvas={getContext:()=>({drawImage:(...values)=>args=values})};
  const fn=source.slice(source.indexOf(' function copyPortrait('),source.indexOf(' async function play('));
  const copy=vm.runInNewContext(`(${fn.trim()})`,{document:{createElement:()=>canvas}}),portrait={width,height};
  assert.equal(copy(portrait),canvas);assert.deepEqual([canvas.width,canvas.height],[width,height]);assert.deepEqual(args,[portrait,0,0,width,height]);
 }
});
