import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useStore } from '../store/useStore';

function roundedTriangleGeometry() {
  const R = 1.15;
  const round = 0.14;
  const pts: THREE.Vector2[] = [];
  for (let i = 0; i < 3; i++) {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / 3;
    pts.push(new THREE.Vector2(Math.cos(a) * R, Math.sin(a) * R));
  }
  const shape = new THREE.Shape();
  // build a triangle with rounded corners via quadratic curves
  for (let i = 0; i < 3; i++) {
    const prev = pts[(i + 2) % 3];
    const cur = pts[i];
    const next = pts[(i + 1) % 3];
    const toPrev = prev.clone().sub(cur).normalize();
    const toNext = next.clone().sub(cur).normalize();
    const p1 = cur.clone().add(toPrev.multiplyScalar(round));
    const p2 = cur.clone().add(toNext.multiplyScalar(round));
    if (i === 0) shape.moveTo(p1.x, p1.y);
    else shape.lineTo(p1.x, p1.y);
    shape.quadraticCurveTo(cur.x, cur.y, p2.x, p2.y);
  }
  shape.closePath();

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.5,
    bevelEnabled: true,
    bevelThickness: 0.12,
    bevelSize: 0.1,
    bevelSegments: 6,
    curveSegments: 24,
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

  const geometry = useMemo(roundedTriangleGeometry, []);

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

    // hide/scale by scroll (crystal belongs to the hero)
    const scroll = useStore.getState().scroll;
    const vis = THREE.MathUtils.clamp(1 - scroll * 6, 0, 1);
    const s = 1 * vis;
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
          transmission={0.92}
          thickness={1.6}
          roughness={material.roughness}
          ior={1.5}
          chromaticAberration={0.06 + material.noiseScale * 0.02}
          anisotropy={0.4}
          distortion={0.4}
          distortionScale={material.noiseScale * 0.05}
          temporalDistortion={0.12}
          attenuationColor={'#6a7bff'}
          attenuationDistance={1.4}
          clearcoat={1}
          clearcoatRoughness={0.12}
          iridescence={1}
          iridescenceIOR={1.3}
          iridescenceThicknessRange={[100, 900]}
          reflectivity={0.6}
          color={col}
          resolution={512}
          samples={6}
        />
      </mesh>
    </group>
  );
}
