import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useStore } from '../store/useStore';
import { profile } from '../data/profile';

/**
 * Intro construction animation — draws an "AP" monogram with sacred-geometry
 * construction lines (Alche builds a single "A"; here both initials build).
 */
export default function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(false);
  const setLoaded = useStore((s) => s.setLoaded);
  const reducedMotion = useStore((s) => s.reducedMotion);

  useEffect(() => {
    const svg = svgRef.current!;
    const construct = Array.from(svg.querySelectorAll<SVGPathElement>('.construct-line'));
    const draw = Array.from(svg.querySelectorAll<SVGPathElement>('.draw-line'));
    const tagline = rootRef.current!.querySelector('.tagline');

    // init dash state (paths use pathLength="1")
    [...construct, ...draw].forEach((p) => {
      p.style.strokeDasharray = '1';
      p.style.strokeDashoffset = '1';
    });

    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      setLoaded(true);
      gsap.to(rootRef.current, {
        opacity: 0,
        duration: 0.9,
        delay: 0.3,
        onComplete: () => setHidden(true),
      });
    };
    // safety: never trap the user on the loader if the rAF timeline stalls
    const fallback = setTimeout(finish, 6500);

    if (reducedMotion) {
      [...construct, ...draw].forEach((p) => (p.style.strokeDashoffset = '0'));
      gsap.set(tagline, { opacity: 1 });
      const t = setTimeout(finish, 600);
      return () => clearTimeout(t);
    }

    const tl = gsap.timeline();
    tl.to(construct, {
      strokeDashoffset: 0,
      duration: 1.0,
      stagger: 0.06,
      ease: 'power1.inOut',
    })
      .to(
        draw,
        { strokeDashoffset: 0, duration: 0.9, stagger: 0.22, ease: 'power2.inOut' },
        '-=0.3'
      )
      .to('.mono-fill', { opacity: 1, duration: 0.6 }, '-=0.3')
      .to(construct, { opacity: 0, duration: 0.7 }, '-=0.2')
      .to(tagline, { opacity: 1, duration: 0.6 }, '-=0.4');

    const c = { v: 0 };
    gsap.to(c, {
      v: 100,
      duration: 2.6,
      ease: 'power1.inOut',
      onUpdate: () => {
        if (counterRef.current) counterRef.current.textContent = String(Math.round(c.v));
      },
      onComplete: finish,
    });

    return () => {
      tl.kill();
      clearTimeout(fallback);
    };
  }, [setLoaded, reducedMotion]);

  if (hidden) return null;

  return (
    <div ref={rootRef} className="preloader">
      <svg ref={svgRef} viewBox="0 0 620 380" fill="none">
        {/* --- construction geometry --- */}
        <circle className="construct-line" cx="310" cy="190" r="150" pathLength={1} />
        <circle className="construct-line" cx="310" cy="190" r="95" pathLength={1} />
        <path className="construct-line" d="M310 20 L310 360" pathLength={1} />
        <path className="construct-line" d="M60 340 L560 340" pathLength={1} />
        <path className="construct-line" d="M170 60 L450 320" pathLength={1} />
        <path className="construct-line" d="M450 60 L170 320" pathLength={1} />

        {/* --- "A" --- */}
        <path className="draw-line mono-line" d="M175 300 L235 90 L295 300" pathLength={1} />
        <path className="draw-line mono-line" d="M198 218 L272 218" pathLength={1} />

        {/* --- "P" --- */}
        <path className="draw-line mono-line" d="M345 90 L345 300" pathLength={1} />
        <path
          className="draw-line mono-line"
          d="M345 90 L415 90 Q460 90 460 145 Q460 200 415 200 L345 200"
          pathLength={1}
        />

        {/* glow fill layer */}
        <g className="mono-fill" style={{ opacity: 0 }}>
          <path d="M175 300 L235 90 L295 300" stroke="#fff" strokeWidth={2.5} strokeLinejoin="round" opacity={0.5} filter="url(#g)" fill="none" />
          <path d="M345 90 L345 300 M345 90 L415 90 Q460 90 460 145 Q460 200 415 200 L345 200" stroke="#fff" strokeWidth={2.5} strokeLinejoin="round" opacity={0.5} filter="url(#g)" fill="none" />
        </g>
        <defs>
          <filter id="g" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
      <div className="tagline">{profile.tagline}</div>
      <div className="counter" ref={counterRef}>0</div>
    </div>
  );
}
