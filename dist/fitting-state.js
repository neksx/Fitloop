'use strict';
(() => {
 const catalog=typeof module!=='undefined'?require('./fitting-catalog.js'):window.FitloopCatalog;
 const topIds=catalog.filter(p=>p.category==='Tops').map(p=>p.id),bottomIds=catalog.filter(p=>p.category==='Bottoms').sort((a,b)=>a.pants-b.pants).map(p=>p.id);
 const token=(look,id)=>`${look.gender}:${id}`;
 const clean=values=>[...new Set(Array.isArray(values)?values.filter(x=>{const m=/^(woman|man):(\d+)$/.exec(x);return m&&catalog[Number(m[2])];}):[])];
 const normalize=look=>({...look,jacket:topIds.includes(look.jacket)?look.jacket:0,pants:bottomIds[look.pants]!==undefined?look.pants:1,acknowledged:clean(look.acknowledged),reviewed:clean(look.reviewed)});
 const ids=look=>[topIds.includes(look.jacket)?look.jacket:0,bottomIds[look.pants]];
 const snapshot=look=>({jacket:look.jacket||0,pants:look.pants,acknowledged:clean(look.acknowledged),reviewed:clean(look.reviewed)});
 function select(look,id){
  const next=normalize(look);if(topIds.includes(id))next.jacket=id;else if(bottomIds.includes(id))next.pants=bottomIds.indexOf(id);else throw Error('Unknown garment');
  next.reviewed=clean([...next.reviewed,token(next,id)]);return next;
 }
 const mismatch=(look,id,gender=catalog[id]?.gender)=>look.gender!==gender&&clean(look.reviewed).includes(token(look,id))&&!clean(look.acknowledged).includes(token(look,id));
 const replacements=(look,category)=>catalog.filter(p=>p.gender===look.gender&&p.category===category).map(p=>p.id);
 function cycleCard(order,slot,allowed){
  const next=order.slice(),id=next[slot],candidates=[...new Set(allowed)];
  if(!candidates.includes(id)||candidates.length<2)return next;
  next[slot]=candidates[(candidates.indexOf(id)+1)%candidates.length];return next;
 }
 const portraitKey=look=>{const sex=look.gender==='man'?'man':'woman',top=look.jacket||0;if(top>=6)return `${sex}-${catalog[top].portrait}-${look.pants}`;if([4,5].includes(top))return `${sex}-${top===4?'tie-dye':'leather-anorak'}-${look.pants}`;if(look.pants>=3)return `${sex}-bottom-${look.pants}`;return sex==='man'||look.identity!=='original'?`${sex}-${look.pants}`:String(look.pants);};
 const keep=(look,id)=>({...look,acknowledged:clean([...(look.acknowledged||[]),token(look,id)])});
 function fit(look,field){
  const height=look.height||172,size=field==='jacketSize'?['XXS','XS','S','M','L','XL','XXL'].indexOf(look.jacketSize):0;
  const reference=field==='jacketSize'?[42,48,55,62,72,84,98][Math.max(0,size)]:62*Math.pow((look.pantSize||30)/30,2);
  const factor=Math.pow(height/172,2),min=Math.ceil(reference*.8*factor),max=Math.floor(reference*1.2*factor);
  return {outside:height<154||height>194||look.weight<min||look.weight>max,min,max,height,minHeight:154,maxHeight:194};
 }
 const api={normalize,ids,snapshot,select,mismatch,keep,fit,token,replacements,topIds,bottomIds,portraitKey,cycleCard};
 if(typeof module!=='undefined')module.exports=api;else window.FitloopState=api;
})();
