const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync(new URL('../dist/fitting.js',`file://${__filename}`),'utf8');
const input={removeAttribute(){},setAttribute(){}};
const api=vm.runInNewContext(source.slice(source.indexOf(' const nameLimit='),source.indexOf(' const nameMeasure='))+';({nameLimit,limitName})',{Intl,name:input});
test('a fitting name accepts ten characters and rejects the eleventh',()=>{assert.equal(api.nameLimit,10);assert.equal(api.limitName('My Looksdw!'),'My Looksdw');assert.equal(api.limitName('WWWWWWWWWW'),'WWWWWWWWWW');});
test('the limit counts user-visible emoji and combining characters as single characters',()=>{const family='👩‍👩‍👧‍👦',accent='e\u0301';assert.equal(api.limitName(family.repeat(11)),family.repeat(10));assert.equal(api.limitName(accent.repeat(11)),accent.repeat(10));});
