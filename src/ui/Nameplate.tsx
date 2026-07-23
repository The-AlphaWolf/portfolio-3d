import { useEffect, useRef } from 'react';
import { profile } from '../data/profile';
import { useStore } from '../store/useStore';

/** Stacked first/last name behind the crystal (Alche wordmark placement). */
export default function Nameplate() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const apply = (scroll: number) => {
      if (ref.current) ref.current.style.opacity = scroll > 0.08 ? '0' : '1';
    };
    apply(useStore.getState().scroll);
    return useStore.subscribe((s) => apply(s.scroll));
  }, []);
  return (
    <div className="nameplate" ref={ref}>
      <div className="stack">
        <span className="l1">ARIJIT</span>
        <span className="l2">PAUL</span>
        <small>{profile.role}</small>
      </div>
    </div>
  );
}
