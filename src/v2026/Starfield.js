import React, { useEffect, useRef } from 'react';
import { playBurst } from './audio';

// The night sky, drawn on a canvas.
//   Stars twinkle slowly, and a few of them glint.
//   A shooting star crosses the sky every few seconds.
//   A tap on empty sky makes stardust. After midnight it launches a firework (sometimes a heart).
//   Other parts of the page can ask for more with two events:
//     window.dispatchEvent(new Event('v26:shower'))                              -> meteor shower
//     window.dispatchEvent(new CustomEvent('v26:sparkle', { detail: { x, y } })) -> stardust at x, y
// If her device asks for less motion, the sky is drawn once and stays still.

const touchesControl = (el) =>
  Boolean(el && el.closest && el.closest('button, a, input, textarea, label, [role="tab"]'));

export default function Starfield({ fireworks = false }) {
  const canvasRef = useRef(null);
  const fireworksRef = useRef(fireworks);
  fireworksRef.current = fireworks;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas && canvas.getContext ? canvas.getContext('2d') : null;
    if (!ctx) return undefined;

    const reduceMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0;
    let height = 0;
    let stars = [];
    let meteors = [];
    let sparks = [];
    let rockets = [];
    let embers = [];
    let frame = 0;
    let lastTime = 0;
    let resizeTimer = 0;
    let meteorTimer = 0;
    const showerTimers = new Set();

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(200, Math.floor((width * height) / 8500));
      stars = Array.from({ length: count }, () => {
        const r = 0.35 + Math.random() * 1.05;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          r,
          base: 0.35 + Math.random() * 0.5,
          speed: 0.25 + Math.random() * 0.6,
          phase: Math.random() * Math.PI * 2,
          warm: Math.random() < 0.1,
          flare: r > 0.9 && Math.random() < 0.3
        };
      });
    };

    const launchMeteor = (bright) => {
      const angle = ((148 + Math.random() * 20) * Math.PI) / 180;
      const speed = 750 + Math.random() * 450;
      meteors.push({
        x: width * (0.35 + Math.random() * 0.75),
        y: -30 + Math.random() * height * 0.3,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        age: 0,
        life: 0.9 + Math.random() * 0.6,
        len: 110 + Math.random() * 90,
        bright
      });
    };

    const scheduleMeteor = (first) => {
      const wait = first ? 1800 + Math.random() * 1700 : 4500 + Math.random() * 5500;
      meteorTimer = window.setTimeout(() => {
        if (!document.hidden) launchMeteor(false);
        scheduleMeteor(false);
      }, wait);
    };

    const shower = () => {
      for (let i = 0; i < 14; i += 1) {
        const timer = window.setTimeout(() => {
          showerTimers.delete(timer);
          launchMeteor(true);
        }, i * 330 + Math.random() * 180);
        showerTimers.add(timer);
      }
    };

    const sparkle = (x, y) => {
      if (!Number.isFinite(x) || !Number.isFinite(y)) return;
      for (let i = 0; i < 16; i += 1) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 40 + Math.random() * 130;
        sparks.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 20,
          age: 0,
          life: 0.7 + Math.random() * 0.5,
          size: 1 + Math.random() * 1.6,
          warm: Math.random() < 0.6
        });
      }
    };

    const COLORS = ['#f3d58a', '#ffb4a8', '#eceeff', '#b9a8ff', '#9fd8ff'];

    // A firework: a small light rises from the bottom to the tapped spot, then bursts.
    const launchFirework = (x, y) => {
      if (!Number.isFinite(x) || !Number.isFinite(y)) return;
      rockets.push({ sx: x + (Math.random() - 0.5) * 60, sy: height + 10, x, y, age: 0, dur: 0.55 });
    };

    const burst = (x, y) => {
      const palette = [COLORS[Math.floor(Math.random() * COLORS.length)], COLORS[Math.floor(Math.random() * COLORS.length)]];
      const heart = Math.random() < 0.3;
      const count = 56;
      for (let i = 0; i < count; i += 1) {
        const t = (i / count) * Math.PI * 2;
        let vx;
        let vy;
        if (heart) {
          // the shape of a heart
          vx = 16 * Math.pow(Math.sin(t), 3) * 7;
          vy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * 7;
        } else {
          const speed = 120 + Math.random() * 90;
          vx = Math.cos(t) * speed;
          vy = Math.sin(t) * speed;
        }
        embers.push({
          x, y, vx, vy, px: x, py: y, age: 0,
          life: 1.1 + Math.random() * 0.7,
          color: palette[i % 2]
        });
      }
      playBurst();
    };

    const draw = (time) => {
      const dt = lastTime ? Math.min(0.05, (time - lastTime) / 1000) : 0.016;
      lastTime = time;
      ctx.clearRect(0, 0, width, height);
      const seconds = time / 1000;

      stars.forEach((s) => {
        const twinkle = reduceMotion ? 1 : 0.65 + 0.35 * Math.sin(seconds * s.speed + s.phase);
        ctx.globalAlpha = s.base * twinkle;
        ctx.fillStyle = s.warm ? '#f3d58a' : '#eceeff';
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
        if (s.flare) {
          // A thin cross of light that swells and fades with the twinkle
          const reach = (3 + s.r * 6) * Math.pow(twinkle, 3);
          ctx.strokeStyle = ctx.fillStyle;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(s.x - reach, s.y);
          ctx.lineTo(s.x + reach, s.y);
          ctx.moveTo(s.x, s.y - reach);
          ctx.lineTo(s.x, s.y + reach);
          ctx.stroke();
        }
      });
      ctx.globalAlpha = 1;

      meteors = meteors.filter((m) => m.age < m.life);
      meteors.forEach((m) => {
        m.age += dt;
        m.x += m.vx * dt;
        m.y += m.vy * dt;
        const t = m.age / m.life;
        const alpha = Math.min(1, m.age / 0.12) * (1 - t * t);
        const speed = Math.hypot(m.vx, m.vy);
        const tailX = m.x - (m.vx / speed) * m.len;
        const tailY = m.y - (m.vy / speed) * m.len;
        const gradient = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
        gradient.addColorStop(0, `rgba(255, 248, 227, ${alpha})`);
        gradient.addColorStop(0.3, `rgba(243, 213, 138, ${alpha * 0.55})`);
        gradient.addColorStop(1, 'rgba(243, 213, 138, 0)');
        ctx.strokeStyle = gradient;
        ctx.lineWidth = m.bright ? 2.2 : 1.6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = '#fff8e3';
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.bright ? 2.2 : 1.7, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      sparks = sparks.filter((p) => p.age < p.life);
      const drag = Math.pow(0.05, dt);
      sparks.forEach((p) => {
        p.age += dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vx *= drag;
        p.vy = p.vy * drag + 30 * dt;
        const fade = 1 - p.age / p.life;
        ctx.globalAlpha = fade;
        ctx.fillStyle = p.warm ? '#f3d58a' : '#eceeff';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (0.5 + fade * 0.5), 0, Math.PI * 2);
        ctx.fill();
      });
      rockets = rockets.filter((r) => {
        r.age += dt;
        const k = Math.min(1, r.age / r.dur);
        const ease = 1 - Math.pow(1 - k, 2);
        const rx = r.sx + (r.x - r.sx) * ease;
        const ry = r.sy + (r.y - r.sy) * ease;
        ctx.globalAlpha = 0.9;
        ctx.strokeStyle = '#fff3c4';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(rx, ry);
        ctx.lineTo(rx - (r.x - r.sx) * 0.04, ry + 14);
        ctx.stroke();
        if (k >= 1) {
          burst(r.x, r.y);
          return false;
        }
        return true;
      });

      embers = embers.filter((p) => p.age < p.life);
      const edrag = Math.pow(0.18, dt);
      embers.forEach((p) => {
        p.age += dt;
        p.px = p.x;
        p.py = p.y;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vx *= edrag;
        p.vy = p.vy * edrag + 70 * dt;
        const fade = 1 - p.age / p.life;
        ctx.globalAlpha = fade;
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(p.px, p.py);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      });
      ctx.globalAlpha = 1;

      if (!reduceMotion) frame = window.requestAnimationFrame(draw);
    };

    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        build();
        if (reduceMotion) draw(0);
      }, 150);
    };
    const onPointerDown = (event) => {
      if (touchesControl(event.target)) return;
      if (fireworksRef.current) launchFirework(event.clientX, event.clientY);
      else sparkle(event.clientX, event.clientY);
    };
    const onShower = () => {
      shower();
      if (!fireworksRef.current) return;
      [0, 450, 950].forEach((delay) => {
        const t = window.setTimeout(() => {
          showerTimers.delete(t);
          launchFirework(width * (0.2 + Math.random() * 0.6), height * (0.18 + Math.random() * 0.3));
        }, 300 + delay);
        showerTimers.add(t);
      });
    };
    const onSparkle = (event) => {
      const where = event.detail || {};
      sparkle(where.x, where.y);
    };

    build();
    draw(0);
    window.addEventListener('resize', onResize);

    if (!reduceMotion) {
      scheduleMeteor(true);
      window.addEventListener('pointerdown', onPointerDown);
      window.addEventListener('v26:shower', onShower);
      window.addEventListener('v26:sparkle', onSparkle);
    }

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(resizeTimer);
      window.clearTimeout(meteorTimer);
      showerTimers.forEach((timer) => window.clearTimeout(timer));
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('v26:shower', onShower);
      window.removeEventListener('v26:sparkle', onSparkle);
    };
  }, []);

  return <canvas ref={canvasRef} className="v26-sky" aria-hidden="true" />;
}
