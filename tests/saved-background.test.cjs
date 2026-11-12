const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync(new URL('../dist/saved-looks.js',`file://${__filename}`),'utf8');
const block=source.slice(source.indexOf(' function backgroundReturnAllowed('),source.indexOf(" grid.addEventListener('click',async"));
function fixture(){
 const handlers={},state={desktop:true,active:true,menu:false,exportActive:false},location={hash:'#saved'};let created=0;
 const context={items:[],Event:class{constructor(type){this.type=type;}},desktopCursor:{get matches(){return state.desktop;}},page:{classList:{contains:()=>state.active},querySelector:()=>state.exportActive?{}:null,addEventListener:(name,fn)=>handlers[name]=fn,dispatchEvent:event=>{if(event.type==='fitloop-create-from-saved')created++;}},document:{body:{classList:{contains:()=>state.menu}}},exporting:null,closingExports:new Map(),window:{},location};
 vm.runInNewContext(block,context);
 const target=blocked=>({closest:selector=>selector==='#saved'?{}:blocked?{}:null});
 return {state,context,location,target,click(blocked=false,button=0){handlers.pointerdown();handlers.click({button,target:target(blocked)});},pointerdown:handlers.pointerdown,finishClick:()=>handlers.click({button:0,target:target(false)}),created:()=>created};
}
test('empty saved-page background starts creating the first model',()=>{const f=fixture();f.click();assert.equal(f.created(),1);});
test('a populated saved page has no background return action or arrow',()=>{const f=fixture();f.context.items.push({id:'one'});assert.equal(f.context.backgroundReturnAllowed(f.target(false),true),false);f.click();assert.equal(f.location.hash,'#saved');});
test('card controls and undo are handled without a background navigation',()=>{const f=fixture();f.click(true);assert.equal(f.location.hash,'#saved');assert.equal(f.created(),0);});
test('the empty-state create link gets the return cursor while keeping its native link action',()=>{
 const f=fixture(),target={closest:selector=>selector==='#saved'||selector==='.saved-empty a[href="#next"]'||selector.includes('button,a,input')?{}:null};
 assert.equal(f.context.backgroundReturnAllowed(target,true),true);assert.equal(f.context.backgroundReturnAllowed(target),false);
});
test('dismissing export does not also leave the page, even when closing completes immediately',()=>{const f=fixture();f.context.exporting={};f.pointerdown();f.context.exporting=null;f.finishClick();assert.equal(f.created(),0);f.click();assert.equal(f.created(),1);});
test('mobile, menus, export animation and non-primary clicks preserve navigation',()=>{
 for(const condition of ['desktop','menu','exportActive','active']){const f=fixture();f.state[condition]=condition==='desktop'||condition==='active'?false:true;f.click();assert.equal(f.created(),0);}
 const f=fixture();f.click(false,1);assert.equal(f.created(),0);
});
