export interface Project {
  id: string;
  date: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  links: { label: string; href: string }[];
  /** palette + pattern seed drives the procedural shader thumbnail */
  palette: [string, string, string];
  pattern: 'grid' | 'wave' | 'lattice' | 'flow' | 'noise' | 'orbit';
  featured?: boolean;
}

const hex = (h: string): [number, number, number] => {
  const n = parseInt(h.replace('#', ''), 16);
  return [(n >> 16) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};
export const paletteToVec = (p: [string, string, string]) => p.map(hex);

/** Scrolling slides (Image 3). FlowSuite is featured and handled in its own section. */
export const projects: Project[] = [
  {
    id: 'codenslicer',
    date: '2026.07',
    title: 'CodeNSliceR',
    subtitle: '5G Packet-Classifier Puzzle Game',
    description:
      'A terminal puzzle game where players write assembly-like logic to route 5G traffic into network slices. Built as an interactive systems teaching tool.',
    tags: ['TypeScript', 'React', 'Vite', 'Monaco Editor', 'Zustand', 'Vitest'],
    links: [
      { label: 'Live ↗', href: 'https://codenslicer.vercel.app' },
      { label: 'GitHub ↗', href: 'https://github.com/The-AlphaWolf/CodeNSliceR' },
    ],
    palette: ['#00e5ff', '#0a2a6b', '#03050c'],
    pattern: 'grid',
  },
  {
    id: 'antg1',
    date: '2026.07',
    title: 'ANTG1',
    subtitle: 'Full-Stack Browser RPG',
    description:
      'A role-playing game with combat, crafting, quests, and progression systems — full-stack, persistent, and containerized.',
    tags: ['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL', 'Tailwind', 'Docker'],
    links: [
      { label: 'Live ↗', href: 'https://game-antg1.vercel.app' },
      { label: 'GitHub ↗', href: 'https://github.com/The-AlphaWolf/GAME-ANTG1' },
    ],
    palette: ['#ff7a3c', '#5a1e00', '#0a0603'],
    pattern: 'orbit',
  },
  {
    id: 'beamforming',
    date: '2025.11',
    title: 'AI Joint Beamforming',
    subtitle: 'RIS-Enabled Multi-User MIMO @ 28 GHz',
    description:
      'Simulates RIS-enabled multi-user MIMO beamforming at 28 GHz and applies reinforcement learning to optimize signal strength and SNR gain.',
    tags: ['MATLAB', 'RIS', '5G', 'Reinforcement Learning', 'MIMO'],
    links: [
      { label: 'GitHub ↗', href: 'https://github.com/The-AlphaWolf/RIS-SNR-Gain-Comparison' },
    ],
    palette: ['#7b5bff', '#1b1f5a', '#04040c'],
    pattern: 'wave',
  },
  {
    id: 'style-analysis',
    date: '2026.01',
    title: 'AI Style & Body Analysis',
    subtitle: 'Facial Structure + Skin-Tone Fashion Engine',
    description:
      'Analyzes facial structure and skin tone from photos to generate personalized fashion recommendations using computer vision.',
    tags: ['Python', 'MediaPipe', 'Computer Vision', 'React', 'Flask', 'PostgreSQL'],
    links: [
      { label: 'GitHub ↗', href: 'https://github.com/The-AlphaWolf/AI-Driven-body-analysis' },
    ],
    palette: ['#ff5c8a', '#3a0f2a', '#0a040a'],
    pattern: 'lattice',
  },
  {
    id: 'food-demand',
    date: '2025.11',
    title: 'Food Demand Prediction',
    subtitle: 'Smart Restaurant Time-Series ML',
    description:
      'A time-series ML model that predicts daily food demand to reduce wastage, deployed as an interactive Streamlit dashboard.',
    tags: ['Python', 'Machine Learning', 'Streamlit', 'Time-Series'],
    links: [
      { label: 'GitHub ↗', href: 'https://github.com/The-AlphaWolf/Restaurent-management' },
    ],
    palette: ['#3cff9e', '#0a3a2a', '#03080a'],
    pattern: 'flow',
  },
];

/** Featured transition project (Image 4). */
export const featured: Project = {
  id: 'flowsuite',
  date: '2026.07',
  title: 'FlowSuite',
  subtitle: 'Offline Voice-to-Text & Voice-to-Code Engine',
  description:
    'A local speech-recognition engine that converts spoken language into code and prose — entirely offline, with no cloud dependency. Fast, private, and cross-platform.',
  tags: ['Python', 'faster-whisper', 'Speech Recognition', 'Cross-platform', 'Offline'],
  links: [
    { label: 'GitHub ↗', href: 'https://github.com/The-AlphaWolf/FlowSuite' },
    { label: 'Download v0.1.0 ↗', href: 'https://github.com/The-AlphaWolf/FlowSuite/releases' },
  ],
  palette: ['#8f9bff', '#20194f', '#04030a'],
  pattern: 'flow',
  featured: true,
};

export const featureBullets = [
  'Real-time offline speech-to-text — no data ever leaves the machine.',
  'Voice-to-code mode maps natural speech to editor-ready syntax.',
  'Powered by faster-whisper for low-latency local inference.',
  'Cross-platform desktop engine, shipping as v0.1.0.',
];
