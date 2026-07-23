import { create } from 'zustand';

export interface MaterialState {
  roughness: number;
  noiseScale: number;
  color: [number, number, number]; // 0..255
}

interface AppState {
  loaded: boolean;
  scroll: number; // 0..1 global page progress
  section: string;
  material: MaterialState;
  quaternion: [number, number, number, number]; // x,y,z,w
  reducedMotion: boolean;
  isMobile: boolean;

  setLoaded: (v: boolean) => void;
  setScroll: (v: number) => void;
  setSection: (s: string) => void;
  setMaterial: (m: Partial<MaterialState>) => void;
  setQuaternion: (q: [number, number, number, number]) => void;
  resetQuaternion: () => void;
  setEnv: (p: { reducedMotion: boolean; isMobile: boolean }) => void;
}

export const useStore = create<AppState>((set) => ({
  loaded: false,
  scroll: 0,
  section: 'hero',
  material: { roughness: 0.1, noiseScale: 9.0, color: [255, 255, 255] },
  quaternion: [0, 0, 0, 1],
  reducedMotion: false,
  isMobile: false,

  setLoaded: (v) => set({ loaded: v }),
  setScroll: (v) => set({ scroll: v }),
  setSection: (s) => set({ section: s }),
  setMaterial: (m) => set((st) => ({ material: { ...st.material, ...m } })),
  setQuaternion: (q) => set({ quaternion: q }),
  resetQuaternion: () => set({ quaternion: [0, 0, 0, 1] }),
  setEnv: (p) => set({ reducedMotion: p.reducedMotion, isMobile: p.isMobile }),
}));
