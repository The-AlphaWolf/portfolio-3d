import { useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';

/** Small canvas trackball gizmo that reflects the live logo quaternion. */
function QuaternionGizmo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const size = 120;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    let raf = 0;
    // rotate a vector by quaternion (x,y,z,w)
    const rot = (q: number[], v: number[]) => {
      const [x, y, z, w] = q;
      const [vx, vy, vz] = v;
      const ix = w * vx + y * vz - z * vy;
      const iy = w * vy + z * vx - x * vz;
      const iz = w * vz + x * vy - y * vx;
      const iw = -x * vx - y * vy - z * vz;
      return [
        ix * w + iw * -x + iy * -z - iz * -y,
        iy * w + iw * -y + iz * -x - ix * -z,
        iz * w + iw * -z + ix * -y - iy * -x,
      ];
    };

    const axes: [number[], string][] = [
      [[1, 0, 0], '#ff4d5e'],
      [[0, 1, 0], '#57d977'],
      [[0, 0, 1], '#5b8cff'],
    ];

    const draw = () => {
      const q = useStore.getState().quaternion;
      const cx = size / 2;
      const cy = size / 2;
      const r = 44;
      ctx.clearRect(0, 0, size, size);

      // outer sphere
      ctx.strokeStyle = 'rgba(255,255,255,0.18)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(cx, cy, r, r * 0.34, 0, 0, Math.PI * 2);
      ctx.stroke();

      const drawn = axes
        .map(([v, c]) => ({ p: rot(q, v), c }))
        .sort((a, b) => a.p[2] - b.p[2]);

      drawn.forEach(({ p, c }) => {
        const ex = cx + p[0] * r;
        const ey = cy - p[1] * r;
        ctx.strokeStyle = c;
        ctx.lineWidth = 1.6;
        ctx.globalAlpha = 0.5 + 0.5 * ((p[2] + 1) / 2);
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(ex, ey);
        ctx.stroke();
        ctx.fillStyle = c;
        ctx.beginPath();
        ctx.arc(ex, ey, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  return <canvas ref={canvasRef} className="quat-gizmo" style={{ width: 120, height: 120 }} />;
}

function QuatValues() {
  const q = useStore((s) => s.quaternion);
  return (
    <div className="quat-values">
      {q.map((v, i) => (
        <span key={i}>{v >= 0 ? ' ' : ''}{v.toFixed(2)}</span>
      ))}
    </div>
  );
}

export default function Hud() {
  const material = useStore((s) => s.material);
  const setMaterial = useStore((s) => s.setMaterial);
  const resetQuaternion = useStore((s) => s.resetQuaternion);
  const quatRef = useRef<HTMLDivElement>(null);
  const matRef = useRef<HTMLDivElement>(null);

  // fade HUD out once the hero scrolls away (transient — no React re-render storm)
  useEffect(() => {
    const apply = (scroll: number) => {
      const o = scroll > 0.1 ? 0 : 1;
      if (quatRef.current) {
        quatRef.current.style.opacity = String(o);
        quatRef.current.style.pointerEvents = o ? 'auto' : 'none';
      }
      if (matRef.current) {
        matRef.current.style.opacity = String(o);
        matRef.current.style.pointerEvents = o ? 'auto' : 'none';
      }
    };
    apply(useStore.getState().scroll);
    return useStore.subscribe((s) => apply(s.scroll));
  }, []);

  const [r, g, b] = material.color;

  return (
    <>
      <div className="hud hud-quat mono" ref={quatRef}>
        <div className="hud-title" style={{ justifyContent: 'flex-end' }}>MainLogo Quaternion</div>
        <QuatValues />
        <QuaternionGizmo />
        <div className="quat-reset" onClick={resetQuaternion}>
          Reset Quaternion
        </div>
      </div>

      <div className="hud hud-material mono" ref={matRef}>
        <div className="hud-title">MainLogo Material</div>
        <div className="mat-row">
          <label>roughness</label>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={material.roughness}
            onChange={(e) => setMaterial({ roughness: parseFloat(e.target.value) })}
          />
          <span className="val">{material.roughness.toFixed(2)}</span>
        </div>
        <div className="mat-row">
          <label>noiseScale</label>
          <input
            type="range"
            min={0}
            max={20}
            step={0.1}
            value={material.noiseScale}
            onChange={(e) => setMaterial({ noiseScale: parseFloat(e.target.value) })}
          />
          <span className="val">{material.noiseScale.toFixed(1)}</span>
        </div>
        <div className="mat-row">
          <label>color</label>
          <input
            type="color"
            value={`#${[r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('')}`}
            onChange={(e) => {
              const hex = e.target.value;
              const n = parseInt(hex.slice(1), 16);
              setMaterial({ color: [(n >> 16) & 255, (n >> 8) & 255, n & 255] });
            }}
            style={{ width: '100%', height: 18, background: 'none', border: '1px solid var(--line)', padding: 0 }}
          />
          <span className="val" style={{ fontSize: 10 }}>
            {r},{g},{b}
          </span>
        </div>
      </div>
    </>
  );
}
