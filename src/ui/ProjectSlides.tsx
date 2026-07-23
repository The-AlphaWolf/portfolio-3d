import { useEffect, useRef } from 'react';
import ProceduralThumb from '../scene/ProceduralThumb';
import { projects, type Project } from '../data/projects';

function Slide({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const primary = project.links[0]?.href;

  useEffect(() => {
    const el = ref.current!;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => e.isIntersecting && el.classList.add('reveal-in')),
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <article className="slide reveal" ref={ref} id={project.id}>
      <div
        className="slide-media"
        onClick={() => primary && window.open(primary, '_blank', 'noopener')}
        role="link"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && primary && window.open(primary, '_blank', 'noopener')}
      >
        <ProceduralThumb project={project} />
        <span className="idx mono">
          {String(index + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
        </span>
        <span className="open-tag mono">View Project ↗</span>
      </div>
      <div className="slide-info">
        <div className="date mono">{project.date}</div>
        <h3>{project.title}</h3>
        <div className="sub mono">{project.subtitle} — {project.description}</div>
        <div className="tags">
          {project.tags.map((t) => (
            <span className="tag" key={t}>{t}</span>
          ))}
        </div>
        <div className="slide-links">
          {project.links.map((l) => (
            <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer">
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </article>
  );
}

export default function ProjectSlides() {
  return (
    <section className="section" id="works">
      <div className="works-intro">
        <div className="kicker mono">WORKS — 選ばれた作品</div>
        <h2>
          Immersive systems, from signal to screen.
          <span className="jp">没入型・体験型のエンジニアリングを生み出す</span>
        </h2>
        <p>
          Pioneering immersive, experiential engineering like no other — spanning 5G / wireless
          research, machine learning, and full-stack worlds.
        </p>
      </div>
      {projects.map((p, i) => (
        <Slide key={p.id} project={p} index={i} />
      ))}
    </section>
  );
}
