const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const intro=fs.readFileSync(new URL('../dist/experience.js',`file://${__filename}`),'utf8');
const sections=fs.readFileSync(new URL('../dist/sections.js',`file://${__filename}`),'utf8');

test('skipping an intro opened at a fitting-room URL resets the destination to hero before revealing the page',()=>{
 let handler,seen=[];const location={hash:'#next'};
 const registration=intro.slice(intro.indexOf(" skip.addEventListener('click'"),intro.indexOf("document.getElementById('replay-intro')"));
 vm.runInNewContext(registration,{skip:{addEventListener:(_,callback)=>handler=callback},location,finishIntro:()=>seen.push(location.hash),document:{dispatchEvent:event=>seen.push(event.type)},Event:class{constructor(type){this.type=type;}}});
 handler({preventDefault(){}});
 assert.equal(location.hash,'hero');assert.deepEqual(seen,['hero','fitloop-skip-to-hero']);
});

test('delayed initial navigation follows the current hash after the intro is skipped',()=>{
 let callback,ready=false;const shown=[],location={hash:'#next'};
 const initialization=sections.slice(sections.indexOf('const initial=Math.max('),sections.lastIndexOf('\n})();'));
 vm.runInNewContext(initialization,{screenHashes:['#hero','#how','#next','#saved'],location,ready:()=>ready,show:index=>shown.push(index),MutationObserver:class{constructor(fn){callback=fn;}observe(){}disconnect(){}},document:{body:{}},geometry(){},access(){}});
 location.hash='#hero';ready=true;callback();assert.deepEqual(shown,[]);
});
