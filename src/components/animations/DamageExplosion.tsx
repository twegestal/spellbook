import { useEffect, useRef } from 'react';

export type DamageType =
  | 'acid'
  | 'bludgeoning'
  | 'cold'
  | 'fire'
  | 'force'
  | 'lightning'
  | 'necrotic'
  | 'piercing'
  | 'poison'
  | 'psychic'
  | 'radiant'
  | 'slashing'
  | 'thunder';

export type DamageExplosionProps = {
  type: DamageType;
  size?: number;
  duration?: number;
  particles?: number;
  fullscreen?: boolean;
  zIndex?: number;
  onComplete?: () => void;
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  baseSize: number;
  colorFn: (t: number) => string;
  extra?: any;
};

export default function DamageExplosion({
  type,
  size = 420,
  duration = 1200,
  particles = 420,
  fullscreen = true,
  zIndex = 20000,
  onComplete,
}: DamageExplosionProps) {
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
    const TAU = Math.PI * 2;
    const R = (a: number, b: number) => a + Math.random() * (b - a);

    const H = {
      green: 130,
      gray: 0,
      cyan: 190,
      red: 15,
      pink: 330,
      blue: 210,
      purple: 270,
      fuchsia: 300,
      yellow: 50,
      indigo: 235,
    } as const;

    const hsla = (h: number, s: number, l: number, a: number) =>
      `hsla(${h},${s}%,${l}%,${a})`;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    type Preset = {
      flashAlpha?: number;
      shockColor: (a: number) => string;
      buoyancy: number;
      drag: number;
      speedScale: number;
      particleGen: () => Particle;
      drawExtra?: (
        p: Particle,
        ctx: CanvasRenderingContext2D,
        t01: number,
        s: number
      ) => void;
      extraFrame?: (ctx: CanvasRenderingContext2D, elapsed: number) => void;
    };

    const makeSimplePreset = (hue: number, opts?: Partial<Preset>): Preset => ({
      flashAlpha: opts?.flashAlpha ?? 0.35,
      shockColor: (a) => hsla(hue, 100, 80, 0.22 * a),
      buoyancy: opts?.buoyancy ?? -0.0002 * (size / 400),
      drag: opts?.drag ?? 0.994,
      speedScale: opts?.speedScale ?? size / 220,
      particleGen: () => {
        const angle = Math.random() * TAU;
        const speed = R(300, 900) / 1000;
        const spread = R(0.6, 1.0);
        const hueJit = R(-10, 10);
        const maxLife = R(700, 1200);
        const baseSize = R(1.8, 4.5) * (size / 420);
        return {
          x: cx + R(-4, 4),
          y: cy + R(-4, 4),
          vx: Math.cos(angle) * speed * spread,
          vy: Math.sin(angle) * speed * spread,
          life: 0,
          maxLife,
          baseSize,
          colorFn: (t) =>
            hsla(
              hue + hueJit * (1 - t),
              90,
              lerp(75, 45, t),
              Math.max(0, 1 - t * 1.1)
            ),
        };
      },
      ...opts,
    });

    const presets: Record<DamageType, Preset> = {
      acid: makeSimplePreset(H.green, {
        buoyancy: 0.00015 * (size / 400),
        drawExtra: (p, c, t, s) => {
          if (Math.random() < 0.3 && t < 0.8) {
            c.fillStyle = hsla(H.green, 90, 60, 0.35 * (1 - t));
            c.beginPath();
            c.arc(
              p.x + (Math.random() - 0.5) * 4,
              p.y + R(8, 18),
              s * 0.5,
              0,
              TAU
            );
            c.fill();
          }
        },
      }),

      bludgeoning: makeSimplePreset(H.gray, {
        flashAlpha: 0.2,
        buoyancy: 0.0001 * (size / 400),
        drag: 0.992,
        particleGen: () => {
          const angle = Math.random() * TAU;
          const speed = R(200, 700) / 1000;
          const spread = R(0.5, 1.0);
          const gray = R(35, 60);
          const baseSize = R(2.5, 5) * (size / 430);
          return {
            x: cx,
            y: cy,
            vx: Math.cos(angle) * speed * spread,
            vy: Math.sin(angle) * speed * spread,
            life: 0,
            maxLife: R(600, 1000),
            baseSize,
            colorFn: (t) =>
              `hsla(0,0%,${gray - t * 25}%,${Math.max(0, 1 - t)})`,
            extra: { rock: Math.random() < 0.35 },
          };
        },
        drawExtra: (p, c, t, s) => {
          if (p.extra?.rock && t < 0.8) {
            c.fillStyle = `rgba(80,80,80,${0.4 * (1 - t)})`;
            c.fillRect(p.x - s * 0.6, p.y - s * 0.4, s * 1.2, s * 0.8);
          }
        },
      }),

      cold: makeSimplePreset(H.cyan, {
        flashAlpha: 0,
        buoyancy: 0.0002 * (size / 400),
        drag: 0.992,
        particleGen: () => {
          const angle = Math.random() * TAU;
          const speed = R(300, 850) / 1000;
          const spread = R(0.5, 0.9);
          const baseSize = R(2, 5) * (size / 420);
          return {
            x: cx + R(-4, 4),
            y: cy + R(-4, 4),
            vx: Math.cos(angle) * speed * spread,
            vy: Math.sin(angle) * speed * spread,
            life: 0,
            maxLife: R(800, 1400),
            baseSize,
            colorFn: (t) =>
              hsla(H.cyan, 80, lerp(80, 50, t), Math.max(0, 1 - t)),
            extra: { shard: Math.random() < 0.55 },
          };
        },
        drawExtra: (p, c, t, s) => {
          c.fillStyle = `rgba(200,230,255,${(1 - t) * 0.35})`;
          c.beginPath();
          c.arc(p.x, p.y, s * 0.7, 0, TAU);
          c.fill();
          if (p.extra?.shard) {
            c.fillStyle = 'rgba(220,240,255,0.6)';
            c.beginPath();
            c.moveTo(p.x, p.y - s);
            c.lineTo(p.x + s * 0.7, p.y + s * 0.6);
            c.lineTo(p.x - s * 0.7, p.y + s * 0.6);
            c.closePath();
            c.fill();
          }
        },
      }),

      fire: makeSimplePreset(H.red, {
        flashAlpha: 0.6,
        buoyancy: -0.0006 * (size / 400),
        drag: 0.995,
        particleGen: () => {
          const angle = Math.random() * TAU;
          const speed = R(200, 900) / 1000;
          const spread = R(0.7, 1.0);
          const hue = R(15, 55);
          const baseSize = R(2, 6) * (size / 400);
          const maxLife = R(700, 1400);
          return {
            x: cx + R(-6, 6),
            y: cy + R(-6, 6),
            vx: Math.cos(angle) * speed * spread,
            vy: Math.sin(angle) * speed * spread,
            life: 0,
            maxLife,
            baseSize,
            colorFn: (t) =>
              hsla(hue + t * 30, 100, 60 - t * 40, Math.max(0, 1 - t * 1.1)),
          };
        },
        drawExtra: (p, c, t, s) => {
          if (Math.random() < 0.25 && 1 - t > 0.05) {
            c.fillStyle = hsla(H.red + 25, 100, 70, (1 - t) * 0.4);
            c.beginPath();
            c.arc(p.x - p.vx * 8, p.y - p.vy * 8, s * 0.6, 0, TAU);
            c.fill();
          }
        },
      }),

      force: makeSimplePreset(H.blue, {
        flashAlpha: 0.8,
        drag: 0.99,
        speedScale: size / 180,
        particleGen: () => {
          const angle = Math.random() * TAU;
          const speed = R(350, 1000) / 1000;
          const baseSize = R(1.5, 3) * (size / 460);
          return {
            x: cx,
            y: cy,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 0,
            maxLife: R(450, 800),
            baseSize,
            colorFn: (t) =>
              hsla(H.blue, 100, 90 - t * 60, Math.max(0, 1 - t * 1.6)),
          };
        },
      }),

      lightning: makeSimplePreset(H.blue, {
        flashAlpha: 0.7,
        drag: 0.99,
        speedScale: size / 180,
        particleGen: () => {
          const angle = Math.random() * TAU;
          const speed = R(400, 1200) / 1000;
          const baseSize = R(1.6, 3.2) * (size / 450);
          return {
            x: cx + R(-3, 3),
            y: cy + R(-3, 3),
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 0,
            maxLife: R(500, 900),
            baseSize,
            colorFn: (t) =>
              hsla(H.blue, 100, 85 - t * 60, Math.max(0, 1 - t * 1.5)),
            extra: { spark: Math.random() < 0.6 },
          };
        },
        drawExtra: (p, c, t, s) => {
          if (p.extra?.spark) {
            c.fillStyle = `rgba(200,240,255,${(1 - t) * 0.6})`;
            c.beginPath();
            c.arc(
              p.x + (Math.random() - 0.5) * 8,
              p.y + (Math.random() - 0.5) * 8,
              s * 0.5,
              0,
              TAU
            );
            c.fill();
          }
        },
        extraFrame: (c, elapsed) => {
          if (elapsed > duration * 0.5) return;
          c.save();
          c.globalCompositeOperation = 'lighter';
          c.strokeStyle = 'rgba(190, 230, 255, 0.85)';
          c.lineWidth = Math.max(2, size / 80);
          const bolts = 2 + Math.round(Math.random() * 2);
          for (let b = 0; b < bolts; b++) {
            const len = size * (0.7 + Math.random() * 0.7);
            const angle = Math.random() * TAU;
            const steps = 18 + Math.floor(Math.random() * 10);
            const jitter = Math.max(3, size / 32);
            let x = cx,
              y = cy;
            c.beginPath();
            c.moveTo(x, y);
            for (let i = 0; i < steps; i++) {
              x += Math.cos(angle) * (len / steps);
              y += Math.sin(angle) * (len / steps);
              x += (Math.random() - 0.5) * jitter;
              y += (Math.random() - 0.5) * jitter;
              c.lineTo(x, y);
              if (Math.random() < 0.2) {
                c.moveTo(x, y);
                c.lineTo(
                  x + (Math.random() - 0.5) * jitter * 3,
                  y + (Math.random() - 0.5) * jitter * 3
                );
                c.moveTo(x, y);
              }
            }
            c.stroke();
          }
          c.restore();
        },
      }),

      necrotic: makeSimplePreset(H.purple, {
        flashAlpha: 0.15,
        buoyancy: 0,
        drag: 0.993,
        particleGen: () => {
          const angle = Math.random() * TAU;
          const speed = R(250, 800) / 1000;
          const baseSize = R(2, 5) * (size / 430);
          return {
            x: cx,
            y: cy,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 0,
            maxLife: R(700, 1200),
            baseSize,
            colorFn: (t) => hsla(H.purple, 70, 65 - t * 45, Math.max(0, 1 - t)),
            extra: { dark: true },
          };
        },
        drawExtra: (p, c, t, s) => {
          c.globalCompositeOperation = 'multiply';
          c.fillStyle = `rgba(20,0,30,${(1 - t) * 0.25})`;
          c.beginPath();
          c.arc(p.x, p.y, s * 1.1, 0, TAU);
          c.fill();
          c.globalCompositeOperation = 'lighter';
        },
      }),

      piercing: makeSimplePreset(H.gray, {
        flashAlpha: 0.2,
        buoyancy: 0.0001 * (size / 400),
        drag: 0.992,
        particleGen: () => {
          const angle = Math.random() * TAU;
          const speed = R(260, 800) / 1000;
          const baseSize = R(2, 4.5) * (size / 440);
          const gray = R(35, 60);
          return {
            x: cx,
            y: cy,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 0,
            maxLife: R(600, 950),
            baseSize,
            colorFn: (t) =>
              `hsla(0,0%,${gray - t * 25}%,${Math.max(0, 1 - t)})`,
          };
        },
      }),

      poison: makeSimplePreset(H.green, {
        flashAlpha: 0.2,
        buoyancy: -0.0001 * (size / 400),
        drag: 0.996,
        particleGen: () => {
          const angle = Math.random() * TAU;
          const speed = R(150, 500) / 1000;
          const baseSize = R(2, 5.5) * (size / 420);
          return {
            x: cx,
            y: cy,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 0,
            maxLife: R(900, 1500),
            baseSize,
            colorFn: (t) =>
              hsla(H.green, 80, 65 - t * 30, Math.max(0, 0.9 - t * 0.9)),
            extra: { haze: true },
          };
        },
        drawExtra: (p, c, t, s) => {
          c.fillStyle = `rgba(100,170,90,${(1 - t) * 0.25})`;
          c.beginPath();
          c.arc(p.x + R(-6, 6), p.y + R(-6, 6), s * 1.2, 0, TAU);
          c.fill();
        },
      }),

      psychic: makeSimplePreset(H.fuchsia, {
        flashAlpha: 0.25,
        buoyancy: 0,
        drag: 0.994,
        particleGen: () => {
          const angle = Math.random() * TAU;
          const speed = R(250, 850) / 1000;
          const baseSize = R(1.8, 3.8) * (size / 440);
          return {
            x: cx,
            y: cy,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 0,
            maxLife: R(600, 1000),
            baseSize,
            colorFn: (t) =>
              hsla(H.fuchsia, 85, 80 - t * 55, Math.max(0, 1 - t * 1.2)),
            extra: { sparkle: Math.random() < 0.5 },
          };
        },
        drawExtra: (p, c, t, s) => {
          if (p.extra?.sparkle) {
            c.fillStyle = `rgba(255,255,255,${(1 - t) * 0.6})`;
            c.beginPath();
            c.arc(p.x, p.y, s * 0.5, 0, TAU);
            c.fill();
          }
        },
      }),

      radiant: makeSimplePreset(H.yellow, {
        flashAlpha: 0.85,
        buoyancy: -0.00015 * (size / 400),
        drag: 0.993,
        particleGen: () => {
          const angle = Math.random() * TAU;
          const speed = R(300, 900) / 1000;
          const baseSize = R(2, 4.5) * (size / 430);
          return {
            x: cx,
            y: cy,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 0,
            maxLife: R(600, 1000),
            baseSize,
            colorFn: (t) =>
              hsla(H.yellow, 100, 70 - t * 40, Math.max(0, 1 - t * 1.3)),
          };
        },
      }),

      slashing: makeSimplePreset(H.gray, {
        flashAlpha: 0.2,
        buoyancy: 0.0001 * (size / 400),
        drag: 0.992,
      }),

      thunder: makeSimplePreset(H.indigo, {
        flashAlpha: 0.55,
        drag: 0.99,
        speedScale: size / 190,
        particleGen: () => {
          const angle = Math.random() * TAU;
          const speed = R(350, 1100) / 1000;
          const baseSize = R(1.8, 3.2) * (size / 450);
          return {
            x: cx,
            y: cy,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 0,
            maxLife: R(450, 750),
            baseSize,
            colorFn: (t) =>
              hsla(H.indigo, 80, 85 - t * 65, Math.max(0, 1 - t * 1.5)),
          };
        },
      }),
    };

    const cfg = presets[type];

    const parts: Particle[] = [];
    for (let i = 0; i < particles; i++) {
      const p = cfg.particleGen();
      p.vx *= cfg.speedScale;
      p.vy *= cfg.speedScale;
      parts.push(p);
    }

    const shock = { r: 0, maxR: size * 0.9 };
    const flashDur = cfg.flashAlpha ? Math.min(220, duration * 0.22) : 0;

    function frame(ts: number) {
      if (startRef.current == null) startRef.current = ts;
      const elapsed = ts - startRef.current;

      ctx.clearRect(0, 0, w, h);

      if (flashDur && elapsed < flashDur) {
        const a = 1 - elapsed / flashDur;
        ctx.fillStyle = `rgba(255,255,255,${(cfg.flashAlpha ?? 0) * a})`;
        ctx.fillRect(0, 0, w, h);
      }

      if (elapsed < duration) {
        shock.r = (elapsed / duration) * shock.maxR;
        const a = 1 - elapsed / duration;
        const grd = ctx.createRadialGradient(
          cx,
          cy,
          Math.max(0, shock.r - 8),
          cx,
          cy,
          shock.r + 8
        );
        grd.addColorStop(0, 'rgba(0,0,0,0)');
        grd.addColorStop(0.8, 'rgba(0,0,0,0)');
        grd.addColorStop(1, cfg.shockColor(a));
        ctx.beginPath();
        ctx.fillStyle = grd;
        ctx.arc(cx, cy, shock.r + 12, 0, TAU);
        ctx.fill();
      }

      cfg.extraFrame?.(ctx, elapsed);

      const dt = 16;
      for (const p of parts) {
        p.life += dt;

        p.vy += cfg.buoyancy * dt;
        p.vx *= cfg.drag;
        p.vy *= cfg.drag;

        p.x += p.vx * dt;
        p.y += p.vy * dt;

        const t01 = Math.min(1, p.life / p.maxLife);
        const s = p.baseSize * (1 + 1.5 * (1 - t01));
        ctx.fillStyle = p.colorFn(t01);
        ctx.beginPath();
        ctx.arc(p.x, p.y, s, 0, TAU);
        ctx.fill();

        cfg.drawExtra?.(p, ctx, t01, s);
      }

      if (elapsed < duration) {
        rafRef.current = requestAnimationFrame(frame);
      } else {
        onComplete?.();
      }
    }

    rafRef.current = requestAnimationFrame(frame);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [type, size, duration, particles, fullscreen, zIndex, onComplete]);

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
