import { useEffect, useRef } from 'react';
import { whoami, whoamiIntro } from '../data/whoami';
import { useStore } from '../store/useStore';

/** Bottom-right hero panel — a "whoami" status feed (replaces Alche's NEWS). */
export default function Whoami() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const apply = (scroll: number) => {
      if (ref.current) ref.current.style.opacity = scroll > 0.1 ? '0' : '1';
    };
    apply(useStore.getState().scroll);
    return useStore.subscribe((s) => apply(s.scroll));
  }, []);

  return (
    <div className="hud hud-whoami mono" ref={ref}>
      <div className="hud-title">whoami</div>
      <div className="mono" style={{ color: 'var(--dim)', lineHeight: 1.6, marginBottom: 4 }}>
        {whoamiIntro.role}
      </div>
      <div className="whoami-list">
        {whoami.map((w, i) => (
          <div className="whoami-item" key={i}>
            <div className="date">{w.date}</div>
            <div className="head">{w.head}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
