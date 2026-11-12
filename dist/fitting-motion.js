'use strict';
(() => {
 const imageCache=new Map();
 const loadImage=src=>{if(!imageCache.has(src))imageCache.set(src,new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=()=>{imageCache.delete(src);reject(Error(`Image unavailable: ${src}`));};image.src=src;}));return imageCache.get(src);};
 let allSets;
 // Render every garment combination from aligned full-body photographs; native pairs use their own photograph.
 function flatLayer(set,placement){
  const canvas=Object.assign(document.createElement('canvas'),{width:1024,height:1536}),ctx=canvas.getContext('2d'),box=set.placement;
  if(!set.flatImage){const source=Object.assign(document.createElement('canvas'),{width:1024,height:1536}),c=source.getContext('2d');c.drawImage(set.images[0],0,0,1024,1536);c.globalCompositeOperation='destination-in';c.drawImage(set.alphaImage,0,0,1024,1536);set.flatImage=source;}
  const sx=placement[2]/box[2],sy=placement[3]/box[3];ctx.drawImage(set.flatImage,(placement[0]-box[0]*sx)*1024,(placement[1]-box[1]*sy)*1536,1024*sx,1536*sy);return canvas;
 }
 function compose(set,upper,lower){
  const canvas=Object.assign(document.createElement('canvas'),{width:1024,height:1536}),ctx=canvas.getContext('2d');ctx.drawImage(flatLayer(lower,set.placement),0,0);
  const top=flatLayer(upper,set.placement),c=top.getContext('2d'),waist=(set.composite.gender==='man'?.39:.355)*1536,hands=.50*1536;
  c.globalCompositeOperation='destination-in';c.fillStyle='#fff';c.beginPath();c.moveTo(0,0);c.lineTo(1024,0);c.lineTo(1024,hands);c.lineTo(1024*.655,hands);c.lineTo(1024*.65,waist);c.lineTo(1024*.35,waist);c.lineTo(1024*.345,hands);c.lineTo(0,hands);c.closePath();c.fill();ctx.drawImage(top,0,0);
  set.images=[canvas];set.alphaImage=canvas;set.previewFile=canvas.toDataURL('image/png');return set;
 }
 const loadSet=set=>{
  if(!set.loading)set.loading=(async()=>{
   if(set.composite){const [top,bottom]=await Promise.all([loadSet(allSets[set.composite.top]),loadSet(allSets[set.composite.bottom])]);compose(set,top,bottom);}
   else{const images=await Promise.all([...set.files,set.alpha||set.files[0]].map(loadImage));set.images=images.slice(0,set.files.length);set.alphaImage=images.at(-1);}
   const head=set.head;[set.headImage,set.headAlphaImage]=head?await Promise.all([loadImage(head.file),loadImage(head.alpha||head.file)]):[set.images[0],set.alphaImage];return set;
  })().catch(error=>{set.loading=null;throw error;});return set.loading;
 };
 const ready=fetch('assets/fitting-room/static-models-v24.json?v=61').then(response=>{if(!response.ok)throw Error('Model unavailable');return response.json();}).then(async data=>{allSets=data.sets;await Promise.all(['0','1','2'].map(key=>loadSet(data.sets[key])));return data;});
 const load=async key=>{const data=await ready,set=data.sets[key];if(!set)throw Error('Model unavailable');return loadSet(set);};
 const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
 const fitFor=person=>person?[clamp((person.height||172)/172,.8,1.23),clamp(1+((person.weight||62)-62)*.0045,.9,1.25),1+(['XXS','XS','S','M','L','XL','XXL'].indexOf(person.jacketSize||'M')-3)*.025,1+((person.pantSize||30)-30)*.004]:[1,1,1,1];
 const genderFor=key=>String(key).startsWith('man-')?'man':'woman';
 class Motion{
  constructor(canvas){
   this.canvas=canvas;this.gl=canvas.getContext('webgl',{alpha:true,antialias:true,premultipliedAlpha:true});this.textures=new Map();this.data=null;if(!this.gl)return;
   const gl=this.gl,shader=(type,source)=>{const value=gl.createShader(type);gl.shaderSource(value,source);gl.compileShader(value);if(!gl.getShaderParameter(value,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(value));return value;};
   const vertex=shader(gl.VERTEX_SHADER,'attribute vec2 position;varying vec2 uv;void main(){uv=vec2((position.x+1.)*.5,(1.-position.y)*.5);gl_Position=vec4(position,0.,1.);}');
   const fragment=shader(gl.FRAGMENT_SHADER,`precision highp float;varying vec2 uv;uniform sampler2D portrait,previousPortrait,portraitAlpha,previousAlpha,face,previousFace,faceAlpha,previousFaceAlpha;uniform vec4 placement,previousPlacement,fit,facePlacement,previousFacePlacement;uniform float time,effects,change,identityChange,sizing,preserveFace,previousPreserveFace,faceNeckCrop,previousFaceNeckCrop;
    vec4 photo(sampler2D image,sampler2D mask,vec2 p,vec4 box){p=vec2((p.x-.5)*box.z+box.x,(p.y-.02)*box.w+box.y);if(p.x<0.||p.x>1.||p.y<0.||p.y>1.)return vec4(0.);vec4 c=texture2D(image,p);float a=texture2D(mask,p).a;return vec4(c.rgb*a,a);}
    float random(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}
    vec2 fitted(vec2 p){
     // Keep the feet planted. Reserve room for the supported 210cm maximum;
     // scale both axes equally so height never bends the pelvis or stretches the face.
     float height=mix(1.,fit.x*(172./210.),sizing);p.y=.985+(p.y-.985)/height;
     p.x=.5+(p.x-.5)/height;
     float body=smoothstep(.12,.27,p.y)*(1.-smoothstep(.85,.98,p.y));
     float garment=mix(fit.z,fit.w,smoothstep(.39,.52,p.y));
     float width=mix(1.,fit.y*garment,body);p.x=.5+(p.x-.5)/width;return p;
    }
    void main(){
     float phase=mod(time,4.8);float pulse=effects*smoothstep(4.48,4.56,phase)*(1.-smoothstep(4.68,4.8,phase));
     float burst=identityChange*smoothstep(0.,.18,change)*(1.-smoothstep(.45,.88,change));
     vec2 p=uv;float band=floor(uv.y*56.);float noise=random(vec2(band,floor(time*36.)))-.5;
     float idleNoise=random(vec2(floor(uv.y*48.),floor(time*36.)))-.5;
     p.x+=pulse*(.003*sin(time*115.)+.0015*sin(time*189.)+.0015*idleNoise);
     p.x+=burst*(.004*sin(time*110.)+.025*noise*step(.60,random(vec2(band,2.))));
     p.y+=(pulse*.0006+burst*.001)*sin(time*97.);p=fitted(p);
     float reveal=smoothstep(.08,.84,change);
     reveal=clamp(reveal+burst*.32*noise,0.,1.);
     vec4 currentColor=photo(portrait,portraitAlpha,p,placement),oldColor=photo(previousPortrait,previousAlpha,p,previousPlacement);
     // Restore the face and neck without importing the source jacket collar.
     float neck=1.-smoothstep(.045,.075,abs(p.x-.5));
     float head=1.-smoothstep(.145,.175,p.y);
     float croppedHead=(1.-smoothstep(.118,.132,p.y))*mix(1.,neck,smoothstep(.10,.118,p.y));
     currentColor=mix(currentColor,photo(face,faceAlpha,p,facePlacement),mix(head,croppedHead,faceNeckCrop)*preserveFace);
     oldColor=mix(oldColor,photo(previousFace,previousFaceAlpha,p,previousFacePlacement),mix(head,croppedHead,previousFaceNeckCrop)*previousPreserveFace);
     vec4 color=mix(oldColor,currentColor,reveal);
     color.rgb+=(random(gl_FragCoord.xy+floor(time*30.))-.5)*.025*max(pulse,burst)*color.a;
     gl_FragColor=color;
    }`);
   this.program=gl.createProgram();gl.attachShader(this.program,vertex);gl.attachShader(this.program,fragment);gl.linkProgram(this.program);if(!gl.getProgramParameter(this.program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(this.program));gl.useProgram(this.program);
   const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);const location=gl.getAttribLocation(this.program,'position');gl.enableVertexAttribArray(location);gl.vertexAttribPointer(location,2,gl.FLOAT,false,0,0);
   this.uniforms={};for(const name of ['portrait','previousPortrait','portraitAlpha','previousAlpha','placement','previousPlacement','fit','time','effects','change','identityChange','sizing','face','previousFace','faceAlpha','previousFaceAlpha','facePlacement','previousFacePlacement','preserveFace','previousPreserveFace','faceNeckCrop','previousFaceNeckCrop'])this.uniforms[name]=gl.getUniformLocation(this.program,name);gl.uniform1i(this.uniforms.portrait,0);gl.uniform1i(this.uniforms.previousPortrait,1);gl.uniform1i(this.uniforms.portraitAlpha,2);gl.uniform1i(this.uniforms.previousAlpha,3);gl.uniform1i(this.uniforms.face,4);gl.uniform1i(this.uniforms.previousFace,5);gl.uniform1i(this.uniforms.faceAlpha,6);gl.uniform1i(this.uniforms.previousFaceAlpha,7);gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,false);gl.viewport(0,0,canvas.width,canvas.height);
   ready.then(data=>this.data=data).catch(()=>{});canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();this.gl=null;canvas.parentElement?.setAttribute('data-motion','fallback');});
  }
  dispose(){if(this.gl){for(const texture of this.textures.values())this.gl.deleteTexture(texture);this.gl.deleteProgram(this.program);}this.textures.clear();this.gl=null;}
  texture(image,unit){
   const gl=this.gl;gl.activeTexture(unit);
   if(!this.textures.has(image)){const texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);for(const property of [gl.TEXTURE_WRAP_S,gl.TEXTURE_WRAP_T])gl.texParameteri(gl.TEXTURE_2D,property,gl.CLAMP_TO_EDGE);for(const property of [gl.TEXTURE_MIN_FILTER,gl.TEXTURE_MAG_FILTER])gl.texParameteri(gl.TEXTURE_2D,property,gl.LINEAR);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image);this.textures.set(image,texture);}
   gl.bindTexture(gl.TEXTURE_2D,this.textures.get(image));
  }
  draw(pants,_index,_progress,still=false,person=null,animated=false){
   const gl=this.gl,set=this.data?.sets[pants];if(!gl||!set?.images||!set.headImage||!set.headAlphaImage)return false;
   const now=performance.now(),nextFit=fitFor(person),key=String(pants);
   const fitProgress=this.fitChange?clamp((now-this.fitChange.start)/320,0,1):1,easedFit=fitProgress*fitProgress*(3-2*fitProgress);
   const currentFit=this.fitChange?this.fitChange.from.map((value,i)=>value+(this.fitChange.to[i]-value)*easedFit):nextFit;
   if(!this.fitChange||nextFit.some((value,i)=>value!==this.fitChange.to[i]))this.fitChange={from:animated?currentFit:nextFit,to:nextFit,start:now};
   if(!animated)this.fitChange={from:nextFit,to:nextFit,start:now-320};
   const fitMix=animated?clamp((now-this.fitChange.start)/320,0,1):1,smoothFit=fitMix*fitMix*(3-2*fitMix);
   const fit=this.fitChange.from.map((value,i)=>value+(this.fitChange.to[i]-value)*smoothFit);
   if(this.key!==key){
    const previous=this.transition&&now-this.transition.start<this.transition.duration*.5?this.transition.from:this.key;
    this.transition=animated&&previous&&this.data.sets[previous]?.images?{from:previous,start:now,duration:genderFor(previous)!==genderFor(key)?900:500,identity:genderFor(previous)!==genderFor(key)}:null;
    this.key=key;
   }
   if(!animated)this.transition=null;
   const change=this.transition?clamp((now-this.transition.start)/this.transition.duration,0,1):1;
   const previous=change<1?this.data.sets[this.transition.from]:set;
   gl.useProgram(this.program);this.texture(set.images[0],gl.TEXTURE0);this.texture(previous.images[0],gl.TEXTURE1);
   this.texture(set.alphaImage,gl.TEXTURE2);this.texture(previous.alphaImage,gl.TEXTURE3);
   this.texture(set.headImage,gl.TEXTURE4);this.texture(previous.headImage,gl.TEXTURE5);this.texture(set.headAlphaImage,gl.TEXTURE6);this.texture(previous.headAlphaImage,gl.TEXTURE7);
   gl.uniform4fv(this.uniforms.facePlacement,set.head?.placement||set.placement);gl.uniform4fv(this.uniforms.previousFacePlacement,previous.head?.placement||previous.placement);
   gl.uniform1f(this.uniforms.faceNeckCrop,genderFor(key)==='man'?1:0);gl.uniform1f(this.uniforms.previousFaceNeckCrop,genderFor(this.transition?.from||key)==='man'?1:0);
   gl.uniform1f(this.uniforms.preserveFace,set.head?1:0);gl.uniform1f(this.uniforms.previousPreserveFace,previous.head?1:0);
   gl.uniform4fv(this.uniforms.placement,set.placement);gl.uniform4fv(this.uniforms.previousPlacement,previous.placement);gl.uniform4fv(this.uniforms.fit,fit);
   gl.uniform1f(this.uniforms.change,change);gl.uniform1f(this.uniforms.identityChange,this.transition?.identity&&change<1?1:0);
   gl.uniform1f(this.uniforms.sizing,person?1:0);
   gl.uniform1f(this.uniforms.time,now/1000);gl.uniform1f(this.uniforms.effects,still?0:1);gl.drawArrays(gl.TRIANGLES,0,6);
   if(this.textures.size>8){const used=new Set([set.images[0],previous.images[0],set.alphaImage,previous.alphaImage,set.headImage,previous.headImage,set.headAlphaImage,previous.headAlphaImage]);for(const [image,texture] of this.textures)if(!used.has(image)){gl.deleteTexture(texture);this.textures.delete(image);}}
   this.canvas.dataset.portraitKey=key;this.canvas.dataset.liveTransition=change<1?(this.transition.identity?'identity':'outfit'):'idle';
   if(change===1)this.transition=null;
   return true;
  }

 }
 const portraitKey=look=>window.FitloopState?.portraitKey(look)||([4,5].includes(look.jacket)?`${look.gender==='man'?'man':'woman'}-${look.jacket===4?'tie-dye':'leather-anorak'}-${look.pants}`:look.identity&&look.identity!=='original'?`${look.identity}-${look.pants}`:String(look.pants));
 const railTarget=(from,to,count,width)=>{const span=count*160,edge=width/2/1.1+160,visible=x=>x>=-160&&x<=edge,candidate=to+Math.round((from-to)/span)*span;return visible(to)||visible(candidate)?to:candidate;};
 window.FitloopMotion={ready,load,Motion,portraitKey,railTarget};ready.catch(()=>{});
})();
