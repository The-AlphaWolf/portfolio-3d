import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../store/useStore';
import { projects } from '../data/projects';

const PROJECT_COUNT = projects.length;

/** Rounded triangle outline (optionally reversed for a hole) at radius R. */
function triPath<T extends THREE.Shape | THREE.Path>(path: T, R: number, round: number, reverse = false) {
  const pts: THREE.Vector2[] = [];
  for (let i = 0; i < 3; i++) {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / 3;
    pts.push(new THREE.Vector2(Math.cos(a) * R, Math.sin(a) * R));
  }
  if (reverse) pts.reverse();
  for (let i = 0; i < 3; i++) {
    const cur = pts[i];
    const next = pts[(i + 1) % 3];
    const prev = pts[(i + 2) % 3];
    const toPrev = prev.clone().sub(cur).normalize();
    const toNext = next.clone().sub(cur).normalize();
    const p1 = cur.clone().add(toPrev.multiplyScalar(round));
    const p2 = cur.clone().add(toNext.multiplyScalar(round));
    if (i === 0) path.moveTo(p1.x, p1.y);
    else path.lineTo(p1.x, p1.y);
    path.quadraticCurveTo(cur.x, cur.y, p2.x, p2.y);
  }
  path.closePath();
  return path;
}

/** Hollow triangular ring — the ALCHE △ mark, extruded as a faceted crystal. */
function hollowTriangleGeometry() {
  const shape = triPath(new THREE.Shape(), 1.45, 0.12);
  const hole = triPath(new THREE.Path(), 0.72, 0.08, true);
  shape.holes.push(hole);

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.42,
    bevelEnabled: true,
    bevelThickness: 0.1,
    bevelSize: 0.08,
    bevelSegments: 5,
    curveSegments: 20,
  });
  geo.center();
  return geo;
}

export default function CrystalTriangle() {
  const group = useRef<THREE.Group>(null);
  const matRef = useRef<any>(null);
  const { gl } = useThree();

  const material = useStore((s) => s.material);
  const setQuaternion = useStore((s) => s.setQuaternion);
  const storeQuat = useStore((s) => s.quaternion);
  const reducedMotion = useStore((s) => s.reducedMotion);

  const geometry = useMemo(hollowTriangleGeometry, []);

  const drag = useRef(false);
  const last = useRef({ x: 0, y: 0 });
  const vel = useRef({ x: 0, y: 0 });
  const frame = useRef(0);
  const externalQuat = useRef(new THREE.Quaternion());

  // pointer drag → trackball rotation
  useEffect(() => {
    const el = gl.domElement;
    const down = (e: PointerEvent) => {
      drag.current = true;
      last.current = { x: e.clientX, y: e.clientY };
      vel.current = { x: 0, y: 0 };
      el.setPointerCapture?.(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (!drag.current) return;
      const dx = e.clientX - last.current.x;
      const dy = e.clientY - last.current.y;
      last.current = { x: e.clientX, y: e.clientY };
      vel.current = { x: dy * 0.005, y: dx * 0.005 };
    };
    const up = () => {
      drag.current = false;
    };
    el.addEventListener('pointerdown', down);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    return () => {
      el.removeEventListener('pointerdown', down);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
  }, [gl]);

  // reflect external quaternion changes (e.g. Reset button)
  useEffect(() => {
    externalQuat.current.set(storeQuat[0], storeQuat[1], storeQuat[2], storeQuat[3]);
    if (group.current && (storeQuat[0] === 0 && storeQuat[1] === 0 && storeQuat[2] === 0 && storeQuat[3] === 1)) {
      group.current.quaternion.identity();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeQuat.join(',')]);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;

    if (drag.current) {
      const qx = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), vel.current.x);
      const qy = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), vel.current.y);
      g.quaternion.premultiply(qy).premultiply(qx);
    } else {
      // inertia + gentle idle drift
      vel.current.x *= 0.94;
      vel.current.y *= 0.94;
      const idle = reducedMotion ? 0 : 0.12 * delta;
      const qx = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), vel.current.x);
      const qy = new THREE.Quaternion().setFromAxisAngle(
        new THREE.Vector3(0, 1, 0),
        vel.current.y + idle
      );
      g.quaternion.premultiply(qy).premultiply(qx);
    }

    // float
    g.position.y = reducedMotion ? 0 : Math.sin(state.clock.elapsedTime * 0.6) * 0.05;

    // Crystal is the centre anchor through hero AND works. In works it stays
    // small and peeks between cards (bright mid-transition, hidden when a card
    // is settled dead-centre), matching alche.studio.
    const stt = useStore.getState();
    const heroVis = THREE.MathUtils.clamp(1 - stt.scroll * 6, 0, 1);
    let worksVis = 0;
    let scaleMul = 1.2;
    if (stt.worksActive) {
      const frac = (stt.worksProgress * (PROJECT_COUNT - 1)) % 1;
      const between = Math.sin(Math.abs(frac) * Math.PI); // 0 settled .. 1 mid
      worksVis = 0.3 + 0.7 * between;
      scaleMul = 0.85;
    }
    const vis = Math.max(heroVis, worksVis);
    const s = scaleMul * vis;
    g.scale.setScalar(s);
    g.visible = vis > 0.02;

    // publish quaternion to HUD ~10fps
    frame.current++;
    if (frame.current % 6 === 0) {
      const q = g.quaternion;
      setQuaternion([
        +q.x.toFixed(3),
        +q.y.toFixed(3),
        +q.z.toFixed(3),
        +q.w.toFixed(3),
      ]);
    }
  });

  const col = new THREE.Color(
    material.color[0] / 255,
    material.color[1] / 255,
    material.color[2] / 255
  );

  return (
    <group ref={group}>
      <mesh geometry={geometry}>
        <MeshTransmissionMaterial
          ref={matRef}
          transmission={1}
          thickness={0.55}
          roughness={material.roughness}
          ior={1.4}
          chromaticAberration={0.08 + material.noiseScale * 0.02}
          anisotropy={0.3}
          distortion={0.3}
          distortionScale={material.noiseScale * 0.04}
          temporalDistortion={0.1}
          attenuationColor={'#8f9bff'}
          attenuationDistance={4.0}
          clearcoat={1}
          clearcoatRoughness={0.1}
          iridescence={0.6}
          iridescenceIOR={1.25}
          iridescenceThicknessRange={[100, 700]}
          reflectivity={0.35}
          transparent
          opacity={0.9}
          color={col}
          resolution={512}
          samples={6}
        />
      </mesh>
    </group>
  );
}
