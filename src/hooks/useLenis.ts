import { useEffect } from 'react';
import Lenis from 'lenis';
import { useStore } from '../store/useStore';

/** Shared Lenis instance so nav links can drive smooth, state-synced scrolling. */
let current: Lenis | null = null;
export function scrollToSection(target: string) {
  if (current) current.scrollTo(target, { offset: 0, duration: 1.2 });
  else document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' });
}

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
    current = lenis;

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
      if (current === lenis) current = null;
    };
  }, [enabled, reducedMotion, setScroll]);
}
