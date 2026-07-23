import { profile, nav } from '../data/profile';

/** Contact footer (Image 6) — giant wordmark + link columns + actions. */
export default function Contact() {
  return (
    <section className="section contact" id="contact">
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
          <div className="row">
            <a href={`mailto:${profile.email}`}>Contact <span aria-hidden>↗</span></a>
            <a href={`mailto:${profile.email}?subject=Opportunity`}>Recruit <span aria-hidden>↗</span></a>
          </div>
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
