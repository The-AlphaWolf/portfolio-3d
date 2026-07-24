import { nav, profile } from '../data/profile';
import { scrollToSection } from '../hooks/useLenis';

export default function Nav() {
  const go = (e: React.MouseEvent, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      scrollToSection(href);
    }
  };
  return (
    <nav className="nav">
      <a className="brand" href="#top" aria-label="Home" onClick={(e) => go(e, '#top')}>
        <svg className="tri" viewBox="0 0 20 18" fill="none" aria-hidden>
          <path d="M10 1 L19 17 L1 17 Z" stroke="currentColor" strokeWidth={1.6} strokeLinejoin="round" />
        </svg>
        ARIJIT
      </a>
      <div className="nav-links mono">
        {nav.map((n) => (
          <a key={n.href} href={n.href} onClick={(e) => go(e, n.href)}>
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
