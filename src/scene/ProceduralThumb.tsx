import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { fullscreenVert, thumbFrag } from './shaders';
import { paletteToVec, type Project } from '../data/projects';
import { useStore } from '../store/useStore';

const patternIndex: Record<Project['pattern'], number> = {
  grid: 0,
  orbit: 1,
  wave: 2,
  lattice: 3,
  noise: 4,
  flow: 5,
};

function Quad({ project }: { project: Project }) {
  const ref = useRef<THREE.ShaderMaterial>(null);
  const seed = useMemo(
    () => (project.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 100) / 100,
    [project.id]
  );
  const [a, b, c] = paletteToVec(project.palette);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uRes: { value: new THREE.Vector2(1, 1) },
      uColorA: { value: new THREE.Vector3(...a) },
      uColorB: { value: new THREE.Vector3(...b) },
      uColorC: { value: new THREE.Vector3(...c) },
      uPattern: { value: patternIndex[project.pattern] },
      uSeed: { value: seed },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [project.id]
  );

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.uniforms.uTime.value = state.clock.elapsedTime;
    const { width, height } = state.size;
    ref.current.uniforms.uRes.value.set(width, height);
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={ref}
        vertexShader={fullscreenVert}
        fragmentShader={thumbFrag}
        uniforms={uniforms}
      />
    </mesh>
  );
}

/** Lightweight fullscreen-shader canvas used as a project thumbnail. */
export default function ProceduralThumb({ project }: { project: Project }) {
  const reducedMotion = useStore((s) => s.reducedMotion);
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: false, powerPreference: 'low-power' }}
      frameloop={reducedMotion ? 'demand' : 'always'}
      camera={{ position: [0, 0, 1] }}
    >
      <Quad project={project} />
    </Canvas>
  );
}
