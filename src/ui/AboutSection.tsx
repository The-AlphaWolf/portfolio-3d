import { useEffect, useRef } from 'react';
import { profile } from '../data/profile';
import { experience, education, skills, extracurricular } from '../data/about';

/** Full #about section (nav target) placed after the outro. */
export default function AboutSection() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current!;
    const io = new IntersectionObserver(
      (e) => e.forEach((x) => x.isIntersecting && el.classList.add('reveal-in')),
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="section info-section" id="about">
      <div className="info-inner reveal" ref={ref}>
        <div className="kicker mono">ABOUT</div>
        <h2 className="info-title">{profile.role}.</h2>
        <p className="info-lead mono">{profile.about}</p>

        <div className="about-grid">
          <div className="about-col">
            <div className="about-h mono">EXPERIENCE</div>
            {experience.map((e, i) => (
              <div className="about-item" key={i}>
                <div className="about-date mono">{e.date}</div>
                <div className="about-role">{e.role} · <span>{e.org}</span></div>
                <div className="about-desc mono">{e.desc}</div>
              </div>
            ))}
          </div>

          <div className="about-col">
            <div className="about-h mono">EDUCATION</div>
            {education.map((e, i) => (
              <div className="about-item" key={i}>
                <div className="about-date mono">{e.date} · {e.detail}</div>
                <div className="about-role">{e.school}</div>
                <div className="about-desc mono">{e.degree}</div>
              </div>
            ))}
            <div className="about-h mono" style={{ marginTop: 26 }}>ACTIVITIES</div>
            {extracurricular.map((x, i) => (
              <div className="about-desc mono" key={i} style={{ marginTop: 6 }}>{x}</div>
            ))}
          </div>
        </div>

        <div className="about-h mono" style={{ marginTop: 40 }}>SKILLS</div>
        <div className="skills-grid">
          {Object.entries(skills).map(([group, items]) => (
            <div className="skill-group" key={group}>
              <div className="skill-label mono">{group}</div>
              <div className="tags">
                {items.map((t) => (
                  <span className="tag" key={t}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
