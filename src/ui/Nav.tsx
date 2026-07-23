import { nav, profile } from '../data/profile';

export default function Nav() {
  return (
    <nav className="nav">
      <a className="brand" href="#top" aria-label="Home">
        <svg className="tri" viewBox="0 0 20 18" fill="none" aria-hidden>
          <path d="M10 1 L19 17 L1 17 Z" stroke="currentColor" strokeWidth={1.6} strokeLinejoin="round" />
        </svg>
        ARIJIT
      </a>
      <div className="nav-links mono">
        {nav.map((n) => (
          <a key={n.href} href={n.href}>
            {n.label}
          </a>
        ))}
      </div>
      <a className="cta mono" href={`mailto:${profile.email}`}>
        Contact / Recruit
      </a>
    </nav>
  );
}
