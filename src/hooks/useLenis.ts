import { useEffect } from 'react';
import Lenis from 'lenis';
import { useStore } from '../store/useStore';

/** Smooth scroll + publish global scroll progress (0..1) to the store. */
export function useLenis(enabled: boolean) {
  const setScroll = useStore((s) => s.setScroll);
  const reducedMotion = useStore((s) => s.reducedMotion);

  useEffect(() => {
    if (!enabled) return;

    const lenis = new Lenis({
      duration: reducedMotion ? 0 : 1.15,
      smoothWheel: !reducedMotion,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    });

    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScroll(max > 0 ? window.scrollY / max : 0);
    };
    lenis.on('scroll', onScroll);
    onScroll();

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, [enabled, reducedMotion, setScroll]);
}
