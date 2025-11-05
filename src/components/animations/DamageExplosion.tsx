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
    const clamp = (v: number, a: number, b: number) =>
      Math.max(a, Math.min(b, v));

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
      updateParticle?: (p: Particle, dt: number, t01: number) => void;
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
        buoyancy: 0.00025 * (size / 400),
        drag: 0.997,
        particleGen: () => {
          const angle = Math.random() * TAU;
          const speed = R(180, 520) / 1000;
          const baseSize = R(2.6, 5.5) * (size / 420);
          const maxLife = R(900, 1400);
          return {
            x: cx + R(-6, 6),
            y: cy + R(-6, 6),
            vx: Math.cos(angle) * speed * 0.7,
            vy: Math.sin(angle) * speed * 0.7,
            life: 0,
            maxLife,
            baseSize,
            colorFn: (t) =>
              hsla(H.green + R(-8, 8), 90, lerp(70, 40, t), 0.95 - t * 0.8),
            extra: { drip: true, wobble: Math.random() * TAU },
          };
        },
        updateParticle: (p, dt) => {
          p.vy += 0.00045 * (size / 400) * dt;
          p.vx += Math.sin(p.life * 0.01 + p.extra.wobble) * 0.00008 * dt;
        },
        drawExtra: (p, c, t, s) => {
          if (t > 0.45 && Math.random() < 0.12) {
            c.fillStyle = hsla(H.green, 85, 55, 0.25 * (1 - t));
            c.beginPath();
            c.ellipse(
              p.x + R(-3, 3),
              p.y + R(8, 18),
              s * 1.2,
              s * 0.6,
              0,
              0,
              TAU
            );
            c.fill();
          }
          c.fillStyle = `rgba(255,255,255,${(1 - t) * 0.2})`;
          c.beginPath();
          c.arc(p.x - s * 0.3, p.y - s * 0.3, s * 0.3, 0, TAU);
          c.fill();
        },
      }),

      bludgeoning: makeSimplePreset(H.gray, {
        flashAlpha: 0.2,
        buoyancy: 0.00012 * (size / 400),
        drag: 0.992,
        particleGen: () => {
          const angle = Math.random() * TAU;
          const speed = R(200, 700) / 1000;
          const gray = R(30, 55);
          const baseSize = R(3.2, 6.2) * (size / 420);
          return {
            x: cx,
            y: cy,
            vx: Math.cos(angle) * speed * 0.8,
            vy: Math.sin(angle) * speed * 0.8,
            life: 0,
            maxLife: R(650, 1000),
            baseSize,
            colorFn: (t) =>
              `hsla(0,0%,${gray - t * 25}%,${Math.max(0, 1 - t)})`,
            extra: { rock: true, bounced: false },
          };
        },
        updateParticle: (p) => {
          const floorY = cy + size * 0.28;
          if (!p.extra.bounced && p.y > floorY) {
            p.y = floorY;
            p.vy *= -0.35;
            p.vx *= 0.7;
            p.extra.bounced = true;
          }
        },
        drawExtra: (p, c, t, s) => {
          c.fillStyle = `rgba(90,90,90,${0.45 * (1 - t)})`;
          c.beginPath();
          c.moveTo(p.x - s * 0.7, p.y);
          c.lineTo(p.x - s * 0.3, p.y - s * 0.6);
          c.lineTo(p.x + s * 0.6, p.y - s * 0.2);
          c.lineTo(p.x + s * 0.4, p.y + s * 0.5);
          c.lineTo(p.x - s * 0.6, p.y + s * 0.3);
          c.closePath();
          c.fill();
        },
      }),

      cold: makeSimplePreset(H.cyan, {
        flashAlpha: 0,
        buoyancy: 0.0002 * (size / 400),
        drag: 0.992,
        particleGen: () => {
          const angle = Math.random() * TAU;
          const speed = R(260, 780) / 1000;
          const baseSize = R(2, 5) * (size / 420);
          return {
            x: cx + R(-4, 4),
            y: cy + R(-4, 4),
            vx: Math.cos(angle) * speed * 0.8,
            vy: Math.sin(angle) * speed * 0.8,
            life: 0,
            maxLife: R(850, 1400),
            baseSize,
            colorFn: (t) =>
              hsla(H.cyan, 80, lerp(82, 52, t), Math.max(0, 1 - t)),
            extra: { shard: Math.random() < 0.6 },
          };
        },
        drawExtra: (p, c, t, s) => {
          c.fillStyle = `rgba(210,235,255,${(1 - t) * 0.25})`;
          c.beginPath();
          c.arc(p.x, p.y, s * 0.8, 0, TAU);
          c.fill();
          if (p.extra?.shard) {
            c.fillStyle = 'rgba(230,245,255,0.65)';
            c.beginPath();
            c.moveTo(p.x, p.y - s);
            c.lineTo(p.x + s * 0.75, p.y + s * 0.6);
            c.lineTo(p.x - s * 0.75, p.y + s * 0.6);
            c.closePath();
            c.fill();
          }
        },
        extraFrame: (c, elapsed) => {
          const t = clamp(elapsed / (duration * 0.6), 0, 1);
          const r = size * lerp(0.15, 0.55, t);
          c.save();
          c.globalCompositeOperation = 'lighter';
          c.strokeStyle = `rgba(220,240,255,${0.9 * (1 - t)})`;
          c.lineWidth = Math.max(1, size / 160);
          // outer ring
          c.beginPath();
          c.arc(cx, cy, r, 0, TAU);
          c.stroke();
          // spokes
          const spokes = 8;
          for (let i = 0; i < spokes; i++) {
            const a = (i / spokes) * TAU;
            c.beginPath();
            c.moveTo(
              cx + Math.cos(a) * (r * 0.7),
              cy + Math.sin(a) * (r * 0.7)
            );
            c.lineTo(
              cx + Math.cos(a) * (r * 1.05),
              cy + Math.sin(a) * (r * 1.05)
            );
            c.stroke();
          }
          c.restore();
        },
      }),

      fire: makeSimplePreset(H.red, {
        flashAlpha: 0.6,
        buoyancy: -0.0006 * (size / 400),
        drag: 0.995,
        particleGen: () => {
          const angle = Math.random() * TAU;
          const speed = R(200, 900) / 1000;
          const baseSize = R(2, 6) * (size / 400);
          const maxLife = R(700, 1400);
          const hue = R(15, 55);
          return {
            x: cx + R(-6, 6),
            y: cy + R(-6, 6),
            vx: Math.cos(angle) * speed * 0.95,
            vy: Math.sin(angle) * speed * 0.95,
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
            x: cx + Math.cos(angle) * R(0, size * 0.15),
            y: cy + Math.sin(angle) * R(0, size * 0.15),
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 0,
            maxLife: R(700, 1200),
            baseSize,
            colorFn: (t) => hsla(H.purple, 70, 65 - t * 45, Math.max(0, 1 - t)),
            extra: { theta: angle, curl: R(0.001, 0.003) },
          };
        },
        updateParticle: (p, dt, t) => {
          const ax = cx - p.x;
          const ay = cy - p.y;
          const dist = Math.hypot(ax, ay) + 1e-6;
          const pull = 0.00025 * (1 - t) * (size / 400);
          p.vx += (ax / dist) * pull * dt;
          p.vy += (ay / dist) * pull * dt;
          const tangential = 0.00035 * (1 - t) * dt;
          const tx = -(ay / dist) * tangential;
          const ty = (ax / dist) * tangential;
          p.vx += tx;
          p.vy += ty;
        },
        drawExtra: (p, c, t, s) => {
          c.globalCompositeOperation = 'multiply';
          c.strokeStyle = `rgba(30,0,40,${(1 - t) * 0.35})`;
          c.lineWidth = Math.max(1, s * 0.15);
          c.beginPath();
          c.moveTo(p.x, p.y);
          c.lineTo(p.x - p.vx * 10, p.y - p.vy * 10);
          c.stroke();
          c.globalCompositeOperation = 'lighter';
        },
      }),

      piercing: makeSimplePreset(H.gray, {
        // high-speed needles with line “motion blur”
        flashAlpha: 0.2,
        buoyancy: 0.0001 * (size / 400),
        drag: 0.992,
        particleGen: () => {
          const angle = Math.random() * TAU;
          const speed = R(650, 1300) / 1000;
          const baseSize = R(1.4, 2.2) * (size / 460);
          const gray = R(35, 60);
          return {
            x: cx,
            y: cy,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 0,
            maxLife: R(500, 850),
            baseSize,
            colorFn: (t) =>
              `hsla(0,0%,${gray - t * 25}%,${Math.max(0, 0.9 - t)})`,
          };
        },
        drawExtra: (p, c, t, s) => {
          c.strokeStyle = `rgba(220,220,220,${1 - t})`;
          c.lineWidth = Math.max(1, s * 0.25);
          c.beginPath();
          c.moveTo(p.x, p.y);
          c.lineTo(p.x - p.vx * 16, p.y - p.vy * 16);
          c.stroke();
        },
      }),

      poison: makeSimplePreset(H.green, {
        flashAlpha: 0.2,
        buoyancy: -0.00006 * (size / 400),
        drag: 0.996,
        particleGen: () => {
          const angle = Math.random() * TAU;
          const speed = R(130, 420) / 1000;
          const baseSize = R(2.2, 5.8) * (size / 420);
          return {
            x: cx + R(-8, 8),
            y: cy + R(-8, 8),
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 0,
            maxLife: R(950, 1600),
            baseSize,
            colorFn: (t) =>
              hsla(H.green, 80, 65 - t * 30, Math.max(0, 0.9 - t * 0.9)),
            extra: { phase: Math.random() * TAU, bubble: Math.random() < 0.4 },
          };
        },
        updateParticle: (p, dt) => {
          // sideways sinusoidal drift
          p.vx += Math.sin(p.life * 0.008 + p.extra.phase) * 0.00009 * dt;
          // slight upward creep for haze
          p.vy -= 0.00005 * dt;
        },
        drawExtra: (p, c, t, s) => {
          if (p.extra?.bubble && Math.random() < 0.5) {
            c.strokeStyle = `rgba(150,210,140,${0.35 * (1 - t)})`;
            c.lineWidth = 1;
            c.beginPath();
            c.arc(p.x + R(-6, 6), p.y + R(-6, 6), s * 1.1, 0, TAU);
            c.stroke();
          }
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
              hsla(H.yellow, 100, 72 - t * 42, Math.max(0, 1 - t * 1.3)),
          };
        },
        extraFrame: (c, elapsed) => {
          const t = clamp(elapsed / (duration * 0.6), 0, 1);
          c.save();
          c.globalCompositeOperation = 'lighter';
          const rays = 10;
          c.strokeStyle = `rgba(255,255,200,${0.8 * (1 - t)})`;
          c.lineWidth = Math.max(1, size / 140);
          for (let i = 0; i < rays; i++) {
            const a = (i / rays) * TAU + Math.sin(elapsed * 0.002) * 0.15;
            const len = size * 0.9;
            c.beginPath();
            c.moveTo(cx, cy);
            c.lineTo(cx + Math.cos(a) * len, cy + Math.sin(a) * len);
            c.stroke();
          }
          const rings = 3;
          for (let r = 1; r <= rings; r++) {
            c.strokeStyle = `rgba(255,255,230,${0.35 * (1 - t)})`;
            c.lineWidth = 1;
            c.beginPath();
            c.arc(cx, cy, size * (0.15 + r * 0.12) * (1 + t * 0.3), 0, TAU);
            c.stroke();
          }
          c.restore();
        },
      }),

      slashing: makeSimplePreset(H.gray, {
        flashAlpha: 0.25,
        buoyancy: 0.0001 * (size / 400),
        drag: 0.992,
        extraFrame: (c, elapsed) => {
          const t = clamp(elapsed / (duration * 0.5), 0, 1);
          const sweeps = 3;
          for (let i = 0; i < sweeps; i++) {
            const phase = i * 0.8;
            const angle =
              Math.sin(elapsed * 0.003 + phase) * 0.9 + (i - 1) * 0.6;
            const r = size * (0.18 + i * 0.08);
            c.save();
            c.translate(cx, cy);
            c.rotate(angle);
            c.beginPath();
            c.strokeStyle = `rgba(230,230,240,${0.9 * (1 - t)})`;
            c.lineWidth = Math.max(2, size / 70);
            c.arc(0, 0, r, -0.6, 0.6);
            c.stroke();
            c.restore();
          }
        },
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

        const t01 = Math.min(1, p.life / p.maxLife);

        cfg.updateParticle?.(p, dt, t01);

        p.vy += cfg.buoyancy * dt;
        p.vx *= cfg.drag;
        p.vy *= cfg.drag;

        p.x += p.vx * dt;
        p.y += p.vy * dt;

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
