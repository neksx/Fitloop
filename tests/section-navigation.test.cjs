const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const test = require('node:test');
const source = fs.readFileSync(new URL('../dist/sections.js', `file://${__filename}`), 'utf8');
const start = source.indexOf(" window.addEventListener('wheel',event=>");
const end = source.indexOf(" window.addEventListener('keydown'", start);
function controller(useAdvance = false) {
  let onWheel, clock = 0;
  const panelViewport = {scrollTop: 0};
  const calls = [];
  const state = vm.createContext({
    active: 1, locked: false, arrived: false, wheelBlocked: true,
    lastWheelAt: -Infinity, wheelTime: 0, wheelSum: 0, target: 0, current: 0, raf: 0,
    performance: { now: () => clock }, Date,
    ready: () => true, metrics: () => ({ total: 4000 }),
    clamp: (x,min=0,max=1) => Math.max(min,Math.min(max,x)),
    document: { querySelector:()=>null, body: { classList: { contains: () => false } } },
    matchMedia:()=>({matches:true}),
    section: { clientHeight: 777 },
    show: index => calls.push(index), tick(){}, requestAnimationFrame: () => 1,
    advance: delta => calls.push(delta > 0 ? 'forward' : 'back'),
    window: { addEventListener: (_, callback) => { onWheel = callback; } },
  });
  vm.runInContext('function fittingReady(){return active!==2||arrived;}', state);
  if (useAdvance) vm.runInContext(source.slice(source.indexOf(' function advance('), source.indexOf(" document.addEventListener('fitloop-skip-to-hero'")), state);
  vm.runInContext(source.slice(start, end), state);
  return { state, calls, panelViewport, wheel(at, deltaY = 30, deltaX = 0, inside = '') {
    clock = at; let prevented = false;
    onWheel({ deltaY, deltaX, deltaMode: 0,
      target: { closest: selector => inside && selector.includes(inside) ? (inside === '.fitting-panel.is-open' ? {querySelector:()=>panelViewport} : {}) : null },
      preventDefault(){prevented=true;}, stopPropagation(){} });
    return prevented;
  }};
}
test('the opening gesture leaves section two at its initial frame; subsequent scrolling needs no click', () => {
  const c=controller();Object.assign(c.state,{active:0,locked:true});
  for(let t=0;t<2100;t+=50)c.wheel(t);
  assert.equal(c.state.target,0);assert.deepEqual(c.calls,[]);
  Object.assign(c.state,{active:1,locked:false,entering:-1});
  c.wheel(2100);assert.deepEqual(c.calls,['forward']);
});
test('scrolling during a reverse transition is discarded and later scrolling resumes normally', () => {
  const c=controller();Object.assign(c.state,{active:2,locked:true,entering:1});
  for(let t=0;t<800;t+=40)c.wheel(t,-30);
  assert.deepEqual(c.calls,[]);
  Object.assign(c.state,{active:1,locked:false,entering:-1});
  c.wheel(800,-30);assert.deepEqual(c.calls,['back']);
});
test('the wheel tail cannot leave the fitting room while or just after its model appears', () => {
  const c=controller(true);Object.assign(c.state,{locked:true,entering:2});
  for(let t=0;t<2600;t+=50)c.wheel(t);
  Object.assign(c.state,{active:2,locked:false});
  for(let t=2600;t<6000;t+=50)c.wheel(t);
  c.state.arrived=true;
  for(let t=6000;t<9000;t+=50)c.wheel(t);
  assert.deepEqual(c.calls,[]);c.wheel(9300);assert.deepEqual(c.calls,[]);
});
test('the fitting room is the final presentation screen and scroll-down cannot open a blank page', () => {
  const c=controller(true);Object.assign(c.state,{active:2,arrived:true,wheelBlocked:false});
  c.wheel(0);assert.deepEqual(c.calls,[]);
  c.wheel(300,-30);assert.deepEqual(c.calls,[]);
});
test('horizontal garment gestures stay in the garment rail', () => {
  const c=controller();Object.assign(c.state,{active:2,arrived:true,wheelBlocked:false});
  assert.equal(c.wheel(0,0,100,'.fitting-rail'),false);assert.deepEqual(c.calls,[]);
});
test('saved looks and measurement controls retain native scrolling', () => {
  const c=controller();c.state.active=3;assert.equal(c.wheel(0),false);
  c.state.active=2;assert.equal(c.wheel(400,40,0,'.fitting-measurement-wheel'),false);
  assert.deepEqual(c.calls,[]);
});
test('scrolling up in the profile cannot leave the fitting room',()=>{
  const c=controller(true);Object.assign(c.state,{active:2,arrived:true,wheelBlocked:false});
  assert.equal(c.wheel(0,-40,0,'.fitting-panel.is-open'),true);assert.equal(c.panelViewport.scrollTop,-40);assert.deepEqual(c.calls,[]);
});
test('both entry pages contain only hero, how, fitting room and saved looks', () => {
  for(const file of ['index.html','manual/index.html']){
    const html=fs.readFileSync(new URL(`../dist/${file}`,`file://${__filename}`),'utf8');
    assert.ok(!html.includes('id="fourth"'));
    assert.ok(html.includes('id="saved"'));
  }
});

test('touch input during the opening preserves the first frame and resumes afterward', () => {
  const c=controller(true);const events={};
  c.state.window.addEventListener=(type,fn)=>events[type]=fn;
  Object.assign(c.state,{active:1,locked:true,entering:1,touch:null});
  vm.runInContext(source.slice(source.indexOf(" window.addEventListener('touchstart'"),source.indexOf(" document.addEventListener('fitloop-menu'")),c.state);
  const target={closest:()=>null};
  events.touchstart({target,touches:[{clientX:100,clientY:800}]});
  for(let y=700;y>=100;y-=100)events.touchmove({target,touches:[{clientX:100,clientY:y}],preventDefault(){}});
  assert.equal(c.state.target,0);assert.deepEqual(c.calls,[]);
  Object.assign(c.state,{locked:false,entering:-1});
  events.touchmove({target,touches:[{clientX:100,clientY:80}],preventDefault(){}});
  assert.equal(c.state.target,20);
});


test('the manual entry point loads the same scripts and styles as the main page', () => {
  const resources = file => {
    const html = fs.readFileSync(new URL(`../dist/${file}`, `file://${__filename}`), 'utf8');
    return Array.from(html.matchAll(/<(?:script src|link rel="stylesheet" href)="([^"]+)"/g), match => match[1]);
  };
  assert.deepEqual(resources('manual/index.html'), resources('index.html'));
});
