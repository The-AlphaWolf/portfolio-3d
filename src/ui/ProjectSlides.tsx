import { useEffect, useRef, useState } from 'react';
import { projects } from '../data/projects';
import { useStore } from '../store/useStore';

/**
 * Works — a tall scroll region that drives the 3D ring in the scene.
 * The DOM here is just the intro heading + a fixed info overlay that tracks
 * the front-most card, plus a progress rail.
 */
export default function ProjectSlides() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);
  const setWorks = useStore((s) => s.setWorks);

  useEffect(() => {
    const N = projects.length;
    const compute = () => {
      const el = wrapRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = el.offsetHeight - vh; // scrollable distance inside works
      // progress: 0 when top reaches viewport top, 1 when bottom - vh passes
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / total));
      const inRange = rect.top <= vh * 0.5 && rect.bottom >= vh * 0.5;
      const index = Math.round(progress * (N - 1));
      setWorks({ active: inRange, progress, index });
      setActive(index);
      setVisible(inRange && progress > 0.02 && progress < 0.99);
    };
    compute();
    const unsub = useStore.subscribe(compute);
    window.addEventListener('resize', compute);
    return () => {
      unsub();
      window.removeEventListener('resize', compute);
      setWorks({ active: false, progress: 0, index: 0 });
    };
  }, [setWorks]);

  const p = projects[active];

  return (
    <section className="works-wrap" id="works" ref={wrapRef} style={{ height: `${(projects.length + 1) * 100}vh` }}>
      {/* intro heading pinned at the very top of the works region */}
      <div className="section" style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="kicker mono" style={{ color: 'var(--dim)', letterSpacing: '0.3em', fontSize: 12, marginBottom: 20 }}>
          WORKS — SELECTED PROJECTS
        </div>
        <h2 style={{ fontFamily: 'var(--sans)', fontWeight: 500, fontSize: 'clamp(30px,5vw,78px)', lineHeight: 1.06, maxWidth: '16ch' }}>
          Immersive systems, from signal to screen.
        </h2>
        <p style={{ marginTop: 26, fontFamily: 'var(--mono)', color: 'var(--dim)', fontSize: 'clamp(12px,1vw,15px)', maxWidth: '46ch', lineHeight: 1.7 }}>
          Pioneering immersive, experiential engineering like no other — spanning 5G / wireless
          research, machine learning, and full-stack worlds. Scroll to rotate the reel.
        </p>
        <div className="mono" style={{ marginTop: 30, color: 'var(--dimmer)', fontSize: 12, letterSpacing: '0.2em' }}>
          ↓ SCROLL
        </div>
      </div>

      {/* fixed overlay tracking the active card */}
      <div className={`works-overlay ${visible ? 'visible' : ''}`}>
        <div className="count">
          {String(active + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')} · {p.date}
        </div>
        <h3 style={{ fontFamily: 'var(--sans)', fontWeight: 700, fontSize: 'clamp(26px,3.6vw,54px)', lineHeight: 1.02 }}>
          {p.title}
        </h3>
        <div className="sub mono" style={{ color: 'var(--dim)', fontSize: 'clamp(12px,1vw,15px)', lineHeight: 1.6, marginTop: 8 }}>
          {p.subtitle}
        </div>
        <div className="tags" style={{ marginTop: 16 }}>
          {p.tags.slice(0, 5).map((t) => (
            <span className="tag" key={t}>{t}</span>
          ))}
        </div>
        <div className="slide-links" style={{ marginTop: 18 }}>
          {p.links.map((l) => (
            <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer">{l.label}</a>
          ))}
        </div>
      </div>

      <div className={`works-progress ${visible ? 'visible' : ''}`}>
        {projects.map((_, i) => (
          <span key={i} className={`dot ${i === active ? 'on' : ''}`} />
        ))}
      </div>
    </section>
  );
}
