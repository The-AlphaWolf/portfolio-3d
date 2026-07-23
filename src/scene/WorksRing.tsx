import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { fullscreenVert, thumbFrag } from './shaders';
import { paletteToVec, projects, type Project } from '../data/projects';
import { useStore } from '../store/useStore';

const patternIndex: Record<Project['pattern'], number> = {
  grid: 0,
  orbit: 1,
  wave: 2,
  lattice: 3,
  noise: 4,
  flow: 5,
};

const RADIUS = 5.6;
const CARD_W = 4.6; // world width — front card ~60% frame, neighbours as slivers
const CARD_H = 2.7;
const ARC = CARD_W / RADIUS; // angular width of a card

/** A rectangle wrapped onto a cylinder of the given radius, centred facing +Z. */
function curvedCardGeometry() {
  const segs = 24;
  const g = new THREE.PlaneGeometry(1, 1, segs, 1);
  const pos = g.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const u = pos.getX(i); // -0.5..0.5
    const v = pos.getY(i);
    const ang = u * ARC;
    pos.setX(i, Math.sin(ang) * RADIUS);
    pos.setZ(i, Math.cos(ang) * RADIUS - RADIUS);
    pos.setY(i, v * CARD_H);
  }
  pos.needsUpdate = true;
  g.computeVertexNormals();
  return g;
}

function useThumbMaterial(project: Project) {
  return useMemo(() => {
    const [a, b, c] = paletteToVec(project.palette);
    const seed = (project.id.split('').reduce((s, ch) => s + ch.charCodeAt(0), 0) % 100) / 100;
    return new THREE.ShaderMaterial({
      vertexShader: fullscreenVert3d,
      fragmentShader: thumbFrag,
      uniforms: {
        uTime: { value: 0 },
        uRes: { value: new THREE.Vector2(CARD_W * 120, CARD_H * 120) },
        uColorA: { value: new THREE.Vector3(...a) },
        uColorB: { value: new THREE.Vector3(...b) },
        uColorC: { value: new THREE.Vector3(...c) },
        uPattern: { value: patternIndex[project.pattern] },
        uSeed: { value: seed },
      },
      side: THREE.DoubleSide,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project.id]);
}

// 3d vertex shader that keeps model transform but passes uv (thumbFrag uses vUv)
const fullscreenVert3d = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

function Card({ project, angle }: { project: Project; angle: number }) {
  const mat = useThumbMaterial(project);
  const geo = useMemo(curvedCardGeometry, []);
  useFrame((s) => {
    (mat.uniforms.uTime as any).value = s.clock.elapsedTime;
  });
  return (
    <group rotation={[0, angle, 0]}>
      <mesh geometry={geo} material={mat} />
      {/* thin frame */}
      <lineSegments rotation={[0, 0, 0]}>
        <edgesGeometry args={[geo]} />
        <lineBasicMaterial color="#ffffff" transparent opacity={0.12} />
      </lineSegments>
    </group>
  );
}

/** "WORKS" wordmark rendered to a canvas texture, sitting behind the ring. */
function WorksLabel() {
  const tex = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 2048;
    c.height = 512;
    const ctx = c.getContext('2d')!;
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 380px "Space Grotesk", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('WORKS', c.width / 2, c.height / 2 + 20);
    const t = new THREE.CanvasTexture(c);
    t.anisotropy = 4;
    return t;
  }, []);
  return (
    <mesh position={[0, 0, -RADIUS - 3]}>
      <planeGeometry args={[20, 5]} />
      <meshBasicMaterial map={tex} transparent opacity={0.13} depthWrite={false} toneMapped={false} />
    </mesh>
  );
}

export default function WorksRing() {
  const group = useRef<THREE.Group>(null);
  const root = useRef<THREE.Group>(null);
  const N = projects.length;

  useFrame((_, delta) => {
    const st = useStore.getState();
    const active = st.worksActive;
    const target = active ? 1 : 0;

    // fade whole ring
    if (root.current) {
      const cur = root.current.scale.x;
      const s = THREE.MathUtils.damp(cur, target, 6, delta);
      root.current.scale.setScalar(s);
      root.current.visible = s > 0.02;
    }

    if (group.current) {
      const sweep = (2 * Math.PI * (N - 1)) / N;
      const targetRot = -st.worksProgress * sweep;
      group.current.rotation.y = THREE.MathUtils.damp(
        group.current.rotation.y,
        targetRot,
        8,
        delta
      );
    }
  });

  return (
    <group ref={root} scale={0} position={[0, 0, -1.4]}>
      <WorksLabel />
      <group ref={group}>
        {projects.map((p, i) => (
          <Card key={p.id} project={p} angle={(i * 2 * Math.PI) / N} />
        ))}
      </group>
    </group>
  );
}
