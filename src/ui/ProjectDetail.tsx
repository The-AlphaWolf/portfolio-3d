import { useEffect, useRef, useState } from 'react';
import ProceduralThumb from '../scene/ProceduralThumb';
import type { Project } from '../data/projects';

/** FlowSuite-style detail block (text left, related visual right) for a single
 * project. The WebGL visual is mounted only while the section is near the
 * viewport to keep the number of live contexts (and mobile cost) low. */
export default function ProjectDetail({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [mountViz, setMountViz] = useState(false);

  useEffect(() => {
    const el = ref.current!;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) el.classList.add('reveal-in');
          setMountViz(e.isIntersecting);
        }),
      { rootMargin: '200px 0px', threshold: 0.01 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="section feature project-detail" id={project.id}>
      <div className="feature-inner">
        <div className="feature-grid reveal" ref={ref}>
          <div className="feature-text">
            <div className="featured-tag mono">
              {String(index).padStart(2, '0')} · {project.date}
            </div>
            <h2>{project.title}</h2>
            <div className="lead">{project.subtitle}</div>
            <p className="pd-desc mono">{project.description}</p>
            <div className="tags">
              {project.tags.map((t) => (
                <span className="tag" key={t}>{t}</span>
              ))}
            </div>
            <div className="btns">
              {project.links.map((l, i) => (
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

          <div className="feature-visual">
            <div className="visual-frame">
              {mountViz ? (
                <ProceduralThumb project={project} />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    background: `linear-gradient(140deg, ${project.palette[2]}, ${project.palette[1]})`,
                  }}
                />
              )}
              <span className="visual-idx mono">{project.id.toUpperCase()}</span>
            </div>
            <div className="visual-meta mono">
              {project.tags.slice(0, 3).map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
