import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../store/useStore';

/** Stacked wordmark rendered to a canvas texture, sitting just behind the
 * crystal so the transmission material refracts it (Alche placement). */
export default function NamePlate3D() {
  const mesh = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshBasicMaterial>(null);

  const { texture, canvas, ctx } = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 2048;
    c.height = 1280;
    const cx = c.getContext('2d')!;
    const t = new THREE.CanvasTexture(c);
    t.anisotropy = 8;
    t.colorSpace = THREE.SRGBColorSpace;
    return { texture: t, canvas: c, ctx: cx };
  }, []);

  useEffect(() => {
    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '700 440px "Space Grotesk", system-ui, sans-serif';
      ctx.fillText('ARIJIT', w / 2, h * 0.34);
      ctx.fillText('PAUL', w / 2, h * 0.68);
      ctx.font = '400 60px "Space Mono", monospace';
      ctx.fillStyle = 'rgba(180,180,180,0.9)';
      ctx.fillText('ELECTRONICS & TELECOMMUNICATION ENGINEER', w / 2, h * 0.9);
      texture.needsUpdate = true;
    };
    draw();
    // redraw once webfonts are ready so glyph metrics are correct
    (document as any).fonts?.ready?.then(draw);
  }, [canvas, ctx, texture]);

  useFrame((_, delta) => {
    if (!matRef.current || !mesh.current) return;
    const scroll = useStore.getState().scroll;
    const target = THREE.MathUtils.clamp(1 - scroll * 8, 0, 1);
    matRef.current.opacity = THREE.MathUtils.damp(matRef.current.opacity, target, 8, delta);
    mesh.current.visible = matRef.current.opacity > 0.02;
  });

  return (
    <mesh ref={mesh} position={[0, 0, -1.3]}>
      <planeGeometry args={[9.6, 6]} />
      <meshBasicMaterial
        ref={matRef}
        map={texture}
        transparent
        opacity={1}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}
