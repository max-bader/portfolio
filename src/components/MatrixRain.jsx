import React, { useEffect, useRef } from 'react';
import '../assets/styles/MatrixRain.css';

const GLYPHS = 'アカサタナハマヤラワabcdefghijklmnopqrstuvwxyz0123456789<>/{}[]=+*';
const DURATION = 7000;

/** Konami-code / `matrix` payoff. Dismisses on any key, click, or timeout. */
const MatrixRain = ({ onExit }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = window.innerWidth;
    let height = window.innerHeight;
    const fontSize = 16;
    let columns = 0;
    let drops = [];
    let frame = 0;
    let last = 0;

    const accent = getComputedStyle(document.documentElement)
      .getPropertyValue('--accent-rgb-bright')
      .trim() || '61, 166, 107';

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      columns = Math.ceil(width / fontSize);
      drops = Array.from({ length: columns }, () => Math.random() * -50);
    };

    const render = (now) => {
      frame = window.requestAnimationFrame(render);
      if (now - last < 45) return;
      last = now;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(0, 0, width, height);
      ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;

      drops.forEach((y, i) => {
        const glyph = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        const x = i * fontSize;

        ctx.fillStyle = `rgba(${accent}, 0.95)`;
        ctx.fillText(glyph, x, y * fontSize);

        if (y * fontSize > height && Math.random() > 0.975) {
          drops[i] = 0;
        } else {
          drops[i] = y + 1;
        }
      });
    };

    resize();
    window.addEventListener('resize', resize);
    frame = window.requestAnimationFrame(render);

    const timer = window.setTimeout(onExit, DURATION);
    window.addEventListener('keydown', onExit);
    window.addEventListener('pointerdown', onExit);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
      window.removeEventListener('resize', resize);
      window.removeEventListener('keydown', onExit);
      window.removeEventListener('pointerdown', onExit);
    };
  }, [onExit]);

  return (
    <div className="matrix-overlay">
      <canvas ref={canvasRef} aria-hidden="true" />
      <p className="matrix-caption">click anywhere to wake up</p>
    </div>
  );
};

export default MatrixRain;
