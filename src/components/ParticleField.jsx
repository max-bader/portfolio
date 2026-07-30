import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { ACCENT_EVENT } from '../lib/theme';
import '../assets/styles/ParticleField.css';

const LINK_DISTANCE = 132;
const MOUSE_RADIUS = 190;

/**
 * Ambient constellation behind the whole page. Nodes drift on their own and
 * lean toward the cursor, wiring themselves together when they get close.
 */
const ParticleField = () => {
  const canvasRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = 0;
    let height = 0;
    let particles = [];
    let frame = 0;
    let accent = '45, 134, 89';

    const readAccent = () => {
      const value = getComputedStyle(document.documentElement)
        .getPropertyValue('--accent-rgb')
        .trim();
      if (value) accent = value;
    };

    const pointer = { x: -9999, y: -9999, active: false };

    const seed = () => {
      const density = Math.round((width * height) / 15000);
      const count = Math.max(28, Math.min(90, density));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        r: Math.random() * 1.6 + 0.7
      }));
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];

        // Link to nearby neighbours.
        for (let j = i + 1; j < particles.length; j += 1) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.hypot(dx, dy);
          if (dist > LINK_DISTANCE) continue;

          ctx.strokeStyle = `rgba(${accent}, ${(1 - dist / LINK_DISTANCE) * 0.22})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }

        // Link to the cursor, brighter than neighbour links.
        if (pointer.active) {
          const dist = Math.hypot(p.x - pointer.x, p.y - pointer.y);
          if (dist < MOUSE_RADIUS) {
            ctx.strokeStyle = `rgba(${accent}, ${(1 - dist / MOUSE_RADIUS) * 0.5})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(pointer.x, pointer.y);
            ctx.stroke();
          }
        }

        ctx.fillStyle = `rgba(${accent}, 0.55)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const step = () => {
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (pointer.active) {
          const dx = pointer.x - p.x;
          const dy = pointer.y - p.y;
          const dist = Math.hypot(dx, dy);
          if (dist < MOUSE_RADIUS && dist > 1) {
            const pull = (1 - dist / MOUSE_RADIUS) * 0.045;
            p.x += (dx / dist) * pull * 8;
            p.y += (dy / dist) * pull * 8;
          }
        }

        // Wrap around the edges so the field never thins out.
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;
      });

      draw();
      frame = window.requestAnimationFrame(step);
    };

    const onPointerMove = (event) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      pointer.active = true;
    };

    const onPointerLeave = () => {
      pointer.active = false;
    };

    const onVisibility = () => {
      if (document.hidden) {
        window.cancelAnimationFrame(frame);
      } else if (!reducedMotion) {
        frame = window.requestAnimationFrame(step);
      }
    };

    readAccent();
    resize();

    window.addEventListener('resize', resize);
    window.addEventListener(ACCENT_EVENT, readAccent);

    if (reducedMotion) {
      draw();
    } else {
      window.addEventListener('pointermove', onPointerMove, { passive: true });
      document.addEventListener('pointerleave', onPointerLeave);
      document.addEventListener('visibilitychange', onVisibility);
      frame = window.requestAnimationFrame(step);
    }

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      window.removeEventListener(ACCENT_EVENT, readAccent);
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerleave', onPointerLeave);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [reducedMotion]);

  return <canvas ref={canvasRef} className="particle-field" aria-hidden="true" />;
};

export default ParticleField;
