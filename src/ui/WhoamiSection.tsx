import { useEffect, useRef } from 'react';
import { whoami, whoamiIntro } from '../data/whoami';
import { profile } from '../data/profile';

/** Full #whoami section (nav target) placed after the outro. */
export default function WhoamiSection() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current!;
    const io = new IntersectionObserver(
      (e) => e.forEach((x) => x.isIntersecting && el.classList.add('reveal-in')),
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="section info-section" id="whoami">
      <div className="info-inner reveal" ref={ref}>
        <div className="kicker mono">WHOAMI</div>
        <h2 className="info-title">{whoamiIntro.line}</h2>
        <p className="info-lead mono">{profile.about}</p>
        <div className="whoami-feed">
          {whoami.map((w, i) => (
            <div className="feed-row" key={i}>
              <span className="feed-date mono">{w.date}</span>
              <span className="feed-head">{w.head}</span>
            </div>
          ))}
        </div>
        <div className="info-meta mono">
          <span>{whoamiIntro.role}</span>
          <span>{profile.location}</span>
        </div>
      </div>
    </section>
  );
}
