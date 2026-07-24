import { projects } from '../data/projects';
import ProjectDetail from './ProjectDetail';

/** The 5 non-flagship projects, in the order requested. */
const ORDER = ['codenslicer', 'beamforming', 'food-demand', 'antg1', 'style-analysis'];

export default function ProjectDetails() {
  const ordered = ORDER.map((id) => projects.find((p) => p.id === id)).filter(Boolean) as typeof projects;
  return (
    <div className="project-details">
      {ordered.map((p, i) => (
        <ProjectDetail key={p.id} project={p} index={i + 2} />
      ))}
    </div>
  );
}
