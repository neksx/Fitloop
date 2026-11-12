precision highp float;
#define GLSLIFY 1
uniform sampler2D uTexture;
uniform float uLoading;
uniform float uGlobalOpacity;
uniform float uRollOpacity;
uniform float uOpacity;
uniform float uBlur;
uniform float uTime;
uniform vec2 uResolution;
uniform vec3 vPosition;
varying vec2 vUv;

vec4 blur13(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {
  vec4 color = vec4(0.0);
  vec2 off1 = vec2(1.411764705882353) * direction;
  vec2 off2 = vec2(3.2941176470588234) * direction;
  vec2 off3 = vec2(5.176470588235294) * direction;
  color += texture2D(image, uv) * 0.1964825501511404;
  color += texture2D(image, uv + (off1 / resolution)) * 0.2969069646728344;
  color += texture2D(image, uv - (off1 / resolution)) * 0.2969069646728344;
  color += texture2D(image, uv + (off2 / resolution)) * 0.09447039785044732;
  color += texture2D(image, uv - (off2 / resolution)) * 0.09447039785044732;
  color += texture2D(image, uv + (off3 / resolution)) * 0.010381362401148057;
  color += texture2D(image, uv - (off3 / resolution)) * 0.010381362401148057;
  return color;
}

#define similarity 0.41
#define smoothness 0.1
#define spill 0.1

vec2 RGBtoUV(vec3 color) {
  return vec2(
    color.r * -0.169 + color.g * -0.331 + color.b * 0.5 + 0.5,
    color.r *  0.5   + color.g * -0.419 + color.b * -0.081 + 0.5
  );
}

vec4 processChromaKey(vec4 color) {
  vec4 keyColor  = vec4(0. ,1. ,0. ,1.);
  float chromaDist = distance(RGBtoUV(color.rgb), RGBtoUV(keyColor.rgb));

  float baseMask = chromaDist - similarity;
  float fullMask = pow(clamp(baseMask / smoothness, 0., 1.), 1.5);
  color.a = fullMask;

  float spillVal = pow(clamp(baseMask / spill, 0., 1.), 1.5);
  float desat = clamp(color.r * 0.2126 + color.g * 0.7152 + color.b * 0.0722, 0., 1.);
  color.rgb = mix(vec3(desat, desat, desat), color.rgb, spillVal);

  return color;
}

//
// Description : Array and textureless GLSL 2D simplex noise function.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : ijm
//     Lastmod : 20110822 (ijm)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License. See LICENSE file.
//               https://github.com/ashima/webgl-noise
//

vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec2 mod289(vec2 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec3 permute(vec3 x) {
  return mod289(((x*34.0)+1.0)*x);
}

float snoise(vec2 v)
  {
  const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                      0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                     -0.577350269189626,  // -1.0 + 2.0 * C.x
                      0.024390243902439); // 1.0 / 41.0
// First corner
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);

// Other corners
  vec2 i1;
  //i1.x = step( x0.y, x0.x ); // x0.x > x0.y ? 1.0 : 0.0
  //i1.y = 1.0 - i1.x;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  // x0 = x0 - 0.0 + 0.0 * C.xx ;
  // x1 = x0 - i1 + 1.0 * C.xx ;
  // x2 = x0 - 1.0 + 2.0 * C.xx ;
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;

// Permutations
  i = mod289(i); // Avoid truncation effects in permutation
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));

  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;

// Gradients: 41 points uniformly over a line, mapped onto a diamond.
// The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;

// Normalise gradients implicitly by scaling m
// Approximation of: m *= inversesqrt( a0*a0 + h*h );
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

// Compute final noise value at P
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float exponentialOut(float t) {
  return t == 1.0 ? t : 1.0 - pow(2.0, -10.0 * t);
}

// ease in function
float easeIn(float x) {
  return x * x;
}
float easeOut(float x) {
  return x * (2.0 - x);
}

float random (vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

float grad(float x) {
    float g = 1.0 - abs(2.0 * x - 1.0);
    return smoothstep(-0.1, 1.0, g);
}

void main() {
  vec2 _vUv = vUv;

  if (mod(uTime, 2.0) > 1.95)
    	_vUv += 1.0 / 256.0 * (2.0 * vec2(random(floor(vUv * 102.0) + vec2(32.05,236.0)), random(floor(vUv.y * 32.0) + vec2(-62.05,-36.0))) - 1.0);

  vec4 map = texture2D(uTexture, _vUv);
  vec2 effectUv = _vUv;

  float xIntensity = .01 / (vUv.x / 1.0);
  float yIntensity = 100.5;
  float randomIntensity = 0.01;

  float y = gl_FragCoord.y;
  if (mod(uTime, 2.0) > 1.95)
    xIntensity = 0.1;

  float horizontalVariation = snoise(vec2( y*yIntensity)) * (snoise(vec2((uTime*0.0005)* y*yIntensity))) * xIntensity;
  effectUv.x *= 1. +  horizontalVariation;

  vec4 effectMap = texture2D(uTexture, effectUv);
  vec4 maskedColor = processChromaKey(map);
  vec4 effectMaskedColor = processChromaKey(effectMap);

  // add grain on maskedColor
  float rand = random(vec2(uTime));
  float grain = random(vec2(gl_FragCoord.x + rand, gl_FragCoord.y + rand)) * 1.;
  // Convert #F5F5F5 to normalized color space (245/255 = ~0.9608)
  vec3 excludeColor = vec3(0.9608, 0.9608, 0.9608);
  float threshold = 0.01; // Tolerance for color comparison

  // Create a mask based on how different the color is from the exclude color
  float colorDiff = length(maskedColor.rgb - excludeColor);
  float grainMask = smoothstep(threshold, threshold * 2.0, colorDiff);

  // Apply grain with variable intensity based on the mask
  maskedColor.rgb += (grain - 0.5) * 0.1 * grainMask;

  float mask = grad(vUv.x - 0.05) * 0.8;

  vec4 color =  mix(effectMaskedColor, maskedColor, mask);
  color.a = color.a * uOpacity * uLoading * uGlobalOpacity * uRollOpacity * map.a;

  gl_FragColor = color;

}

