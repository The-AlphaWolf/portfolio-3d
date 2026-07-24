import { profile, nav } from '../data/profile';

/** Contact footer (Image 6) — giant wordmark + link columns + actions. */
export default function Contact() {
  return (
    <section className="section contact" id="contact">
      {/* Alche-style construction lines + perspective depth */}
      <svg className="contact-bg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden>
        <defs>
          <radialGradient id="cfade" cx="50%" cy="40%" r="70%">
            <stop offset="0%" stopColor="#0b1030" />
            <stop offset="100%" stopColor="#050509" />
          </radialGradient>
        </defs>
        <rect width="1600" height="900" fill="url(#cfade)" />
        <g stroke="rgba(150,165,255,0.16)" strokeWidth="1" fill="none">
          {/* perspective floor lines to a vanishing point */}
          {Array.from({ length: 13 }).map((_, i) => (
            <line key={`v${i}`} x1={i * 133} y1="900" x2="800" y2="430" />
          ))}
          {/* horizontal depth rules */}
          {Array.from({ length: 7 }).map((_, i) => {
            const y = 470 + Math.pow(i / 6, 1.8) * 430;
            return <line key={`h${i}`} x1="0" y1={y} x2="1600" y2={y} />;
          })}
        </g>
        {/* big crossing diagonals */}
        <g stroke="rgba(180,190,255,0.22)" strokeWidth="1">
          <line x1="-100" y1="1000" x2="900" y2="-100" />
          <line x1="1700" y1="1000" x2="700" y2="-100" />
        </g>
        {/* tick crosses */}
        <g stroke="rgba(150,165,255,0.35)" strokeWidth="1.2">
          {[[300, 250], [1300, 250], [800, 430], [500, 700], [1100, 700]].map(([x, y], i) => (
            <g key={i}>
              <line x1={x - 9} y1={y} x2={x + 9} y2={y} />
              <line x1={x} y1={y - 9} x2={x} y2={y + 9} />
            </g>
          ))}
        </g>
      </svg>
      <div className="big-mark">{profile.first}</div>

      <div className="contact-grid">
        <div className="contact-col">
          <a href="#top">Top</a>
          <a href="#works">Works</a>
          <a href="#flowsuite">FlowSuite</a>
        </div>
        <div className="contact-col">
          {nav.map((n) => (
            <a key={n.href} href={n.href}>{n.label}</a>
          ))}
        </div>
        <div className="contact-col links">
          <a href={profile.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a>
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
          <a href={profile.resume} target="_blank" rel="noopener noreferrer">Résumé ↗</a>
        </div>

        <div className="contact-actions">
          <div className="small">
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
            <a href={`tel:${profile.phone.replace(/[^+\d]/g, '')}`}>{profile.phone}</a>
          </div>
          <div className="small" style={{ color: 'var(--dimmer)' }}>{profile.location}</div>
        </div>
      </div>

      <div className="copyright">©2026 Arijit Paul</div>
    </section>
  );
}
