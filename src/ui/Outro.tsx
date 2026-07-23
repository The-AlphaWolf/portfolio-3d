import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { profile } from '../data/profile';
import { useStore } from '../store/useStore';

/**
 * Second construction animation (Image 5) — builds the full name "ARIJIT PAUL"
 * as the user scrolls past the featured project, before the contact footer.
 */
export default function Outro() {
  const ref = useRef<HTMLDivElement>(null);
  const reveal = useRef<SVGRectElement>(null);
  const reducedMotion = useStore((s) => s.reducedMotion);

  useEffect(() => {
    const el = ref.current!;
    const construct = Array.from(el.querySelectorAll<SVGPathElement>('.construct-line'));
    construct.forEach((p) => {
      p.style.strokeDasharray = '1';
      p.style.strokeDashoffset = '1';
    });

    const play = () => {
      if (reducedMotion) {
        construct.forEach((p) => (p.style.strokeDashoffset = '0'));
        gsap.set(reveal.current, { attr: { width: 1200 } });
        gsap.set('.outro-fill', { opacity: 1 });
        return;
      }
      const tl = gsap.timeline();
      tl.to(construct, { strokeDashoffset: 0, duration: 0.9, stagger: 0.05, ease: 'power1.inOut' })
        .to(reveal.current, { attr: { width: 1200 }, duration: 1.1, ease: 'power2.inOut' }, '-=0.3')
        .to('.outro-fill', { opacity: 1, duration: 0.6 }, '-=0.5')
        .to(construct, { opacity: 0.15, duration: 0.6 }, '-=0.3');
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            play();
            io.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reducedMotion]);

  return (
    <section ref={ref} className="section" id="outro" style={{ display: 'grid', placeItems: 'center' }}>
      <svg viewBox="0 0 1200 300" fill="none" style={{ width: 'min(92vw, 1200px)' }}>
        <defs>
          <clipPath id="nameClip">
            <rect ref={reveal} x="0" y="0" width="0" height="300" />
          </clipPath>
        </defs>

        {/* construction guides */}
        <path className="construct-line" d="M0 150 L1200 150" pathLength={1} />
        <path className="construct-line" d="M600 20 L600 280" pathLength={1} />
        <path className="construct-line" d="M120 40 L120 260" pathLength={1} />
        <path className="construct-line" d="M1080 40 L1080 260" pathLength={1} />
        <circle className="construct-line" cx="600" cy="150" r="120" pathLength={1} />

        {/* name — stroke outline always, filled reveal under clip */}
        <text
          x="600"
          y="150"
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily="'Space Grotesk', sans-serif"
          fontWeight={700}
          fontSize="118"
          letterSpacing="2"
          fill="none"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth={1.2}
        >
          {profile.name}
        </text>
        <g className="outro-fill" style={{ opacity: 0 }} clipPath="url(#nameClip)">
          <text
            x="600"
            y="150"
            textAnchor="middle"
            dominantBaseline="central"
            fontFamily="'Space Grotesk', sans-serif"
            fontWeight={700}
            fontSize="118"
            letterSpacing="2"
            fill="#fff"
          >
            {profile.name}
          </text>
        </g>
      </svg>
    </section>
  );
}
