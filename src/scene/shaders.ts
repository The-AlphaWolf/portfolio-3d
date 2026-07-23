export const fullscreenVert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

/**
 * Procedural generative art per project.
 * Parameterized by a 3-colour palette + a pattern id, animated by time.
 */
export const thumbFrag = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2  uRes;
  uniform vec3  uColorA;
  uniform vec3  uColorB;
  uniform vec3  uColorC;
  uniform int   uPattern;
  uniform float uSeed;

  // --- hash / noise ---
  float hash(vec2 p){ p = fract(p*vec2(123.34, 456.21)); p += dot(p, p+45.32); return fract(p.x*p.y); }
  float noise(vec2 p){
    vec2 i = floor(p); vec2 f = fract(p);
    float a = hash(i), b = hash(i+vec2(1,0)), c = hash(i+vec2(0,1)), d = hash(i+vec2(1,1));
    vec2 u = f*f*(3.0-2.0*f);
    return mix(a,b,u.x) + (c-a)*u.y*(1.0-u.x) + (d-b)*u.x*u.y;
  }
  float fbm(vec2 p){
    float v = 0.0, a = 0.5;
    for(int i=0;i<5;i++){ v += a*noise(p); p *= 2.0; a *= 0.5; }
    return v;
  }
  mat2 rot(float a){ float c=cos(a), s=sin(a); return mat2(c,-s,s,c); }

  void main(){
    vec2 uv = vUv;
    float aspect = uRes.x/uRes.y;
    vec2 p = (uv - 0.5); p.x *= aspect;
    float t = uTime*0.25 + uSeed*10.0;
    float m = 0.0;

    if(uPattern==0){ // grid — perspective 5G lattice
      vec2 g = p*3.0; g *= rot(0.0);
      vec2 gid = abs(fract(g*2.0)-0.5);
      float line = smoothstep(0.02,0.0, min(gid.x,gid.y)-0.46);
      float depth = fbm(g*0.5 + t);
      m = line*0.9 + depth*0.35;
      m += 0.15*sin(g.x*4.0 - t*4.0);
    } else if(uPattern==1){ // orbit — rings + particles
      float r = length(p);
      float ang = atan(p.y, p.x);
      float rings = sin(r*22.0 - t*3.0);
      rings = smoothstep(0.7,1.0, rings);
      float spokes = 0.5+0.5*sin(ang*8.0 + t*2.0);
      m = rings*0.8 + spokes*0.25 + fbm(p*3.0+t)*0.3;
    } else if(uPattern==2){ // wave — RF interference
      float w = sin(p.x*10.0 + t*2.0) * cos(p.y*10.0 - t*1.5);
      w += sin(length(p)*18.0 - t*3.0);
      m = 0.5+0.5*w;
      m = smoothstep(0.35,0.75,m);
      m += fbm(p*4.0 - t)*0.25;
    } else if(uPattern==3){ // lattice — facial/mesh contours
      vec2 q = p*4.0;
      float f = fbm(q + fbm(q + t*0.5));
      float iso = abs(fract(f*6.0)-0.5);
      m = smoothstep(0.06,0.0, iso-0.02);
      m += f*0.4;
    } else if(uPattern==4){ // noise — data field
      float f = fbm(p*3.0 + t);
      float bars = step(0.5, fract(uv.x*30.0 + f*3.0));
      m = f*0.8 + bars*0.15;
    } else { // flow — voice / spectrogram streams
      vec2 q = p; q.y += 0.12*sin(q.x*6.0 + t*2.0);
      float f = fbm(vec2(q.x*2.0 + t, q.y*5.0));
      float streams = smoothstep(0.35,0.65, fbm(vec2(uv.x*8.0, uv.y*3.0 - t)));
      m = f*0.7 + streams*0.5;
    }

    m = clamp(m, 0.0, 1.4);
    vec3 col = mix(uColorC, uColorB, smoothstep(0.0,0.7,m));
    col = mix(col, uColorA, smoothstep(0.55,1.2,m));
    // subtle vignette + scanline grain
    float vig = smoothstep(1.15,0.2, length(p));
    col *= 0.35 + 0.65*vig;
    col += (hash(uv*uRes + t)-0.5)*0.04;
    gl_FragColor = vec4(col, 1.0);
  }
`;
