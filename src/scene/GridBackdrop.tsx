import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../store/useStore';

const vert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.999, 1.0); // pin to far plane
  }
`;

// Full-screen engineering blueprint: converging perspective grid room + crosshair
// ticks + faint construction triangles. Drawn behind everything.
const frag = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2  uRes;
  uniform vec3  uColor;
  uniform float uActive; // 0 hero .. 1 works (shifts palette warmer/brighter)

  float gridPersp(vec2 uv, float scale, float t){
    // fake perspective: warp toward a vanishing point at centre
    vec2 c = uv - 0.5;
    float depth = 1.0 / (abs(c.y) + 0.14);
    vec2 g;
    g.x = c.x * depth * scale;
    g.y = (depth + t) * scale;
    vec2 gg = abs(fract(g) - 0.5) / fwidth(g);
    float line = min(gg.x, gg.y);
    return (1.0 - min(line, 1.0));
  }

  float crossMarks(vec2 uv, float scale){
    vec2 g = uv * scale;
    vec2 f = fract(g) - 0.5;
    vec2 d = abs(f);
    float arm = 0.06;
    float th = 0.012;
    float h = step(d.y, th) * step(d.x, arm);
    float v = step(d.x, th) * step(d.y, arm);
    return clamp(h + v, 0.0, 1.0);
  }

  void main(){
    vec2 uv = vUv;
    float t = uTime * 0.15;

    // twin grids: floor (lower half) and ceiling (upper half)
    float floorG = gridPersp(vec2(uv.x, max(uv.y, 0.5)), 12.0, t) * step(0.5, uv.y);
    float ceilG  = gridPersp(vec2(uv.x, min(1.0 - uv.y, 0.5) + 0.5), 12.0, t) * step(uv.y, 0.5);
    float grid = (floorG + ceilG);

    // static blueprint tick crosses layer
    float marks = crossMarks(uv, 16.0) * 0.5;

    // faint outline triangles drifting
    vec2 tp = uv * 6.0; tp.y += t * 0.5;
    vec2 tf = fract(tp) - 0.5;
    float tri = abs(tf.x) + abs(tf.y * 1.3);
    float triLine = smoothstep(0.02, 0.0, abs(tri - 0.34)) * 0.25;

    float g = grid * 0.6 + marks + triLine;

    // depth vignette from centre
    float d = distance(uv, vec2(0.5, 0.5));
    float vig = smoothstep(1.1, 0.15, d);

    vec3 warm = vec3(0.9, 0.55, 0.3);
    vec3 col = mix(uColor, mix(uColor, warm, 0.35), uActive);
    vec3 outc = col * g * (0.4 + 0.6 * vig);
    outc += col * 0.06 * vig; // ambient wash
    // soft central glow so the transmissive crystal has light to refract
    float cg = smoothstep(0.42, 0.0, d);
    vec3 glow = mix(vec3(0.16, 0.22, 0.6), vec3(0.6, 0.34, 0.18), uActive);
    outc += glow * cg * 0.9;
    gl_FragColor = vec4(outc, 1.0);
  }
`;

/** Alche-style perspective blueprint grid filling the viewport, behind all 3D. */
export default function GridBackdrop() {
  const ref = useRef<THREE.ShaderMaterial>(null);
  const { size } = useThree();
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uRes: { value: new THREE.Vector2(size.width, size.height) },
      uColor: { value: new THREE.Color('#3f52d8') },
      uActive: { value: 0 },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  useFrame((s) => {
    if (!ref.current) return;
    ref.current.uniforms.uTime.value = s.clock.elapsedTime;
    ref.current.uniforms.uRes.value.set(s.size.width, s.size.height);
    // ease palette toward "works" tint
    const target = useStore.getState().worksActive ? 1 : 0;
    const cur = ref.current.uniforms.uActive.value as number;
    ref.current.uniforms.uActive.value = cur + (target - cur) * 0.05;
  });
  return (
    <mesh frustumCulled={false} renderOrder={-10}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={ref}
        vertexShader={vert}
        fragmentShader={frag}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}
