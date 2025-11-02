import { useEffect, useRef } from 'react';

export type FireballProps = {
  size?: number;
  duration?: number;
  particles?: number;
  onComplete?: () => void;
  fullscreen?: boolean;
  zIndex?: number;
};

export default function FireballExplosion({
  size = 400,
  duration = 1500,
  particles = 450,
  onComplete,
  fullscreen = true,
  zIndex = 20000,
}: FireballProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d', { alpha: true })!;
    const dpr = Math.max(1, window.devicePixelRatio || 1);

    const w = fullscreen
      ? window.innerWidth
      : canvas.parentElement?.clientWidth || size;
    const h = fullscreen
      ? window.innerHeight
      : canvas.parentElement?.clientHeight || size;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = 'lighter';

    const cx = w / 2;
    const cy = h / 2;

    type P = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      size: number;
      hue: number;
    };

    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    const TAU = Math.PI * 2;

    const parts: P[] = [];
    for (let i = 0; i < particles; i++) {
      const angle = Math.random() * TAU;
      const speed = (rand(200, 900) / 1000) * (size / 200);
      const spread = rand(0.7, 1.0);
      parts.push({
        x: cx + rand(-6, 6),
        y: cy + rand(-6, 6),
        vx: Math.cos(angle) * speed * spread,
        vy: Math.sin(angle) * speed * spread,
        life: 0,
        maxLife: rand(700, 1400),
        size: rand(2, 6) * (size / 400),
        hue: rand(15, 55),
      });
    }

    const shock = { r: 0, maxR: size * 0.9 };
    const flashDur = Math.min(220, duration * 0.2);

    function tick(t: number) {
      if (startRef.current == null) startRef.current = t;
      const elapsed = t - startRef.current;

      ctx.clearRect(0, 0, w, h);

      if (elapsed < flashDur) {
        const alpha = 1 - elapsed / flashDur;
        ctx.fillStyle = `rgba(255,240,200,${0.6 * alpha})`;
        ctx.fillRect(0, 0, w, h);
      }

      if (elapsed < duration) {
        shock.r = (elapsed / duration) * shock.maxR;
        const grd = ctx.createRadialGradient(
          cx,
          cy,
          Math.max(0, shock.r - 8),
          cx,
          cy,
          shock.r + 8
        );
        grd.addColorStop(0, 'rgba(255,220,160,0.0)');
        grd.addColorStop(0.8, 'rgba(255,220,160,0.0)');
        grd.addColorStop(1, 'rgba(255,240,200,0.25)');
        ctx.beginPath();
        ctx.fillStyle = grd;
        ctx.arc(cx, cy, shock.r + 12, 0, TAU);
        ctx.fill();
      }

      const dt = 16;
      for (const p of parts) {
        p.life += dt;
        p.vy -= 0.0006 * (size / 400) * dt;
        p.vx *= 0.995;
        p.vy *= 0.995;

        p.x += p.vx * dt;
        p.y += p.vy * dt;

        const lifeT = Math.min(1, p.life / p.maxLife);
        const alpha = Math.max(0, 1 - lifeT * 1.1);
        const s = p.size * (1 + 1.5 * (1 - lifeT));
        const color = `hsla(${p.hue + lifeT * 30}, 100%, ${
          60 - lifeT * 40
        }%, ${alpha})`;

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, s, 0, TAU);
        ctx.fill();

        if (Math.random() < 0.25 && alpha > 0.05) {
          ctx.fillStyle = `hsla(${p.hue + 40},100%,70%,${alpha * 0.4})`;
          ctx.beginPath();
          ctx.arc(p.x - p.vx * 8, p.y - p.vy * 8, s * 0.6, 0, TAU);
          ctx.fill();
        }
      }

      if (elapsed < duration) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        onComplete?.();
      }
    }

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [duration, particles, size, fullscreen, onComplete]);

  return (
    <div
      style={{
        position: fullscreen ? 'fixed' : 'absolute',
        inset: fullscreen ? 0 : undefined,
        left: 0,
        top: 0,
        width: fullscreen ? '100vw' : '100%',
        height: fullscreen ? '100vh' : '100%',
        pointerEvents: 'none',
        zIndex,
      }}
    >
      <canvas ref={canvasRef} />
    </div>
  );
}
