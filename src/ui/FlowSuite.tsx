import { useEffect, useRef } from 'react';
import { featured, featureBullets } from '../data/projects';

/** Featured project transition (Image 4) — full-bleed FlowSuite showcase. */
export default function FlowSuite() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current!;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && el.classList.add('reveal-in')),
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="section feature" id="flowsuite">
      <div className="rail mono">FEATURED WORK</div>
      {/* faint triangle motif backdrop */}
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.06 }}
      >
        <path d="M50 10 L90 85 L10 85 Z" fill="none" stroke="#8f9bff" strokeWidth={0.4} />
        <path d="M50 30 L74 78 L26 78 Z" fill="none" stroke="#8f9bff" strokeWidth={0.3} />
      </svg>

      <div className="feature-inner reveal" ref={ref}>
        <div className="featured-tag mono">{featured.date} — FLAGSHIP PROJECT</div>
        <h2>{featured.title}</h2>
        <div className="lead">{featured.subtitle}</div>
        <ul>
          {featureBullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
        <div className="tags">
          {featured.tags.map((t) => (
            <span className="tag" key={t}>{t}</span>
          ))}
        </div>
        <div className="btns">
          {featured.links.map((l, i) => (
            <a
              key={l.href}
              className={`btn ${i === 0 ? '' : 'ghost'}`}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
