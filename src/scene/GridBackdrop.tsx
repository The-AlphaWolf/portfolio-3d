import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const vert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const frag = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec3 uColor;

  float gridLine(vec2 uv, float scale, float w){
    vec2 g = abs(fract(uv * scale - 0.5) - 0.5) / fwidth(uv * scale);
    float line = min(g.x, g.y);
    return 1.0 - min(line, 1.0);
  }

  void main(){
    vec2 uv = vUv;
    // scrolling perspective-ish grid
    vec2 p = uv;
    p.y += uTime * 0.02;
    float fine = gridLine(p, 40.0, 1.0) * 0.25;
    float coarse = gridLine(p, 8.0, 1.0) * 0.5;
    float g = fine + coarse;

    // radial falloff from centre
    float d = distance(uv, vec2(0.5));
    float vig = smoothstep(0.9, 0.15, d);

    vec3 col = uColor * g * vig;
    // faint central glow
    col += uColor * 0.35 * smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(col, 1.0);
  }
`;

/** Alche-style perspective grid backdrop that the crystal refracts. */
export default function GridBackdrop() {
  const ref = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color('#3a4bd0') },
    }),
    []
  );
  useFrame((s) => {
    if (ref.current) ref.current.uniforms.uTime.value = s.clock.elapsedTime;
  });
  return (
    <mesh position={[0, 0, -3.2]} rotation={[0, 0, 0]}>
      <planeGeometry args={[26, 16]} />
      <shaderMaterial
        ref={ref}
        vertexShader={vert}
        fragmentShader={frag}
        uniforms={uniforms}
        depthWrite={false}
      />
    </mesh>
  );
}
