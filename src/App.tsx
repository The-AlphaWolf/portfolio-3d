import { useEffect } from 'react';
import Scene from './scene/Scene';
import Preloader from './ui/Preloader';
import Nav from './ui/Nav';
import Hero from './ui/Hero';
import Hud from './ui/Hud';
import Whoami from './ui/Whoami';
import ProjectSlides from './ui/ProjectSlides';
import FlowSuite from './ui/FlowSuite';
import Outro from './ui/Outro';
import Contact from './ui/Contact';
import { useLenis } from './hooks/useLenis';
import { useStore } from './store/useStore';

export default function App() {
  const setEnv = useStore((s) => s.setEnv);
  const isMobile = useStore((s) => s.isMobile);
  const loaded = useStore((s) => s.loaded);

  // environment detection
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mobile = window.matchMedia('(max-width: 720px)').matches;
    setEnv({ reducedMotion, isMobile: mobile });
    const onResize = () =>
      setEnv({
        reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        isMobile: window.matchMedia('(max-width: 720px)').matches,
      });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [setEnv]);

  useLenis(loaded);

  return (
    <>
      <Scene />
      <Preloader />
      <Nav />
      {!isMobile && <Hud />}
      <Whoami />

      <main className="content">
        <Hero />
        <ProjectSlides />
        <FlowSuite />
        <Outro />
        <Contact />
      </main>
    </>
  );
}
