import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import CrystalTriangle from './CrystalTriangle';
import GridBackdrop from './GridBackdrop';
import { useStore } from '../store/useStore';

function Lighting() {
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 4, 5]} intensity={2} />
      <directionalLight position={[-4, -2, -3]} intensity={0.8} color={'#6a7bff'} />
      <pointLight position={[0, 0, 3]} intensity={6} color={'#aab6ff'} distance={12} />
      <Environment resolution={256}>
        <group>
          <Lightformer form="rect" intensity={5} position={[0, 3, 3]} scale={[8, 3, 1]} color="#ffffff" />
          <Lightformer form="rect" intensity={4} position={[-4, -1, 2]} scale={[3, 5, 1]} color="#8f9bff" />
          <Lightformer form="ring" intensity={4} position={[4, 2, 2]} scale={[3, 3, 1]} color="#c7d2ff" />
          <Lightformer form="circle" intensity={3} position={[0, -3, 3]} scale={[5, 5, 1]} color="#5060d0" />
          <Lightformer form="rect" intensity={2} position={[0, 0, -4]} scale={[10, 10, 1]} color="#2030a0" />
        </group>
      </Environment>
    </>
  );
}

function Effects({ mobile }: { mobile: boolean }) {
  if (mobile) return null;
  return (
    <EffectComposer multisampling={0}>
      <Bloom mipmapBlur intensity={0.9} luminanceThreshold={0.4} luminanceSmoothing={0.25} />
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={new THREE.Vector2(0.0009, 0.0009)}
        radialModulation={false}
        modulationOffset={0}
      />
    </EffectComposer>
  );
}

export default function Scene() {
  const isMobile = useStore((s) => s.isMobile);

  return (
    <Canvas
      className="scene-canvas interactive"
      dpr={isMobile ? [1, 1.3] : [1, 2]}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 5], fov: 42 }}
    >
      <color attach="background" args={['#05060f']} />
      <fog attach="fog" args={['#05060f', 7, 16]} />
      <Suspense fallback={null}>
        <GridBackdrop />
        <Lighting />
        <CrystalTriangle />
      </Suspense>
      <Effects mobile={isMobile} />
    </Canvas>
  );
}
