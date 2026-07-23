# Arijit Paul — 3D Portfolio

An immersive WebGL portfolio inspired by the architecture and style of [alche.studio](https://alche.studio/), rebuilt with Arijit Paul's own work.

## Stack
- **Vite + React + TypeScript**
- **three / react-three-fiber / drei / postprocessing** — crystal logo (transmission + dispersion), bloom, chromatic aberration
- **GSAP** — "AP" monogram intro build + "ARIJIT PAUL" outro build
- **Lenis** — smooth scroll driving the scroll-linked sections
- **zustand** — global state (scroll, live material params, logo quaternion)
- Procedural GLSL art for every project thumbnail (no external images)

## Sections
1. Preloader — constructs an **AP** monogram with sacred-geometry guides
2. Hero — draggable refractive crystal triangle, name wordmark, live **Quaternion** + **Material** HUDs, and a `whoami` status feed
3. Works — scroll-driven project slides with generative shader thumbnails
4. FlowSuite — featured flagship project showcase
5. Outro — constructs the full name **ARIJIT PAUL**
6. Contact — wordmark footer with links

## Develop
```bash
npm install
npm run dev
```

## Build
```bash
npm run build && npm run preview
```

## Deploy
Deployed on Vercel (framework preset: Vite).

---
© 2026 Arijit Paul
