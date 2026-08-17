import React, { useEffect, useRef } from 'react';
import { gsap, motionContext, useGSAP } from '../../lib/gsap';
import { roles, totalMonths, peakConcurrent, laneCount } from '../../lib/timeline';
import { projectsData } from '../../data/projects';
import { EMAIL, GITHUB_URL, LINKEDIN_URL, PAPER_URL, RESUME_URL } from '../../lib/links';
import './scope.css';

/**
 * World: storage oscilloscope.
 *
 * The trace is not decorative — it is the career, sampled. Each month's
 * amplitude is the number of roles running that month, so the waveform peaks
 * exactly where the concurrency does. Phosphor persistence does the rest.
 */
const ScopeWorld = () => {
  const root = useRef(null);
  const canvasRef = useRef(null);

  // Sample the real data into a signal: amplitude = roles active that month.
  const signal = (() => {
    const earliest = Math.min(...roles.map((r) => r.start));
    const latest = Math.max(...roles.map((r) => r.end));
    const out = [];
    for (let m = earliest; m <= latest; m += 1) {
      out.push(roles.filter((r) => r.start <= m && r.end >= m).length);
    }
    return out;
  })();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let frame = 0;
    let sweep = reduced ? 1 : 0;
    let width = 0;
    let height = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const peak = Math.max(...signal, 1);

    const draw = () => {
      // Phosphor persistence: never fully clear, just fade the last frame.
      ctx.fillStyle = 'rgba(4, 14, 10, 0.16)';
      ctx.fillRect(0, 0, width, height);

      const pad = 26;
      const usableW = width - pad * 2;
      const usableH = height - pad * 2;
      const upTo = Math.floor(sweep * (signal.length - 1));

      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(126, 255, 168, 0.95)';
      ctx.shadowBlur = 12;
      ctx.shadowColor = 'rgba(126, 255, 168, 0.85)';
      ctx.beginPath();

      for (let i = 0; i <= upTo; i += 1) {
        const x = pad + (i / (signal.length - 1)) * usableW;
        const y = pad + usableH - (signal[i] / peak) * usableH;
        if (i === 0) ctx.moveTo(x, y);
        else {
          // Square-ish transitions: a month is a discrete sample.
          const prevX = pad + ((i - 1) / (signal.length - 1)) * usableW;
          ctx.lineTo(prevX + (x - prevX) / 2, y);
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      if (upTo >= 0 && upTo < signal.length) {
        const x = pad + (upTo / (signal.length - 1)) * usableW;
        const y = pad + usableH - (signal[upTo] / peak) * usableH;
        ctx.fillStyle = '#d9ffe8';
        ctx.beginPath();
        ctx.arc(x, y, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!reduced && sweep < 1) sweep = Math.min(1, sweep + 0.006);
      frame = window.requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    frame = window.requestAnimationFrame(draw);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
    };
  }, [signal]);

  useGSAP(
    () => {
      motionContext(root, (context) => {
        if (!context.conditions.motion) return;
        gsap.from('.so-readout > *', { opacity: 0, y: 10, duration: 0.5, stagger: 0.07 });
        gsap.utils.toArray('.so-channel').forEach((channel) => {
          gsap.from(channel, {
            opacity: 0,
            x: -16,
            duration: 0.55,
            ease: 'power3.out',
            scrollTrigger: { trigger: channel, start: 'top 86%', once: true }
          });
        });
      });
    },
    { scope: root }
  );

  return (
    <div className="so" ref={root}>
      <header className="so-readout">
        <p className="so-model">TEK-BADER 4180 · STORAGE OSCILLOSCOPE</p>
        <h1>MAX BADER</h1>
        <p className="so-sub">
          CS @ UC IRVINE · {totalMonths} SAMPLES · PEAK {peakConcurrent}CH ·{' '}
          {laneCount} TRACES
        </p>
        <nav className="so-links">
          <a href={`mailto:${EMAIL}`}>EMAIL</a>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">GITHUB</a>
          <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">LINKEDIN</a>
          <a href={RESUME_URL} target="_blank" rel="noopener noreferrer">RESUME</a>
        </nav>
      </header>

      <section className="so-screen-wrap">
        <div className="so-screen">
          <canvas ref={canvasRef} className="so-canvas" />
          <div className="so-graticule" aria-hidden="true" />
        </div>
        <p className="so-caption">
          CH1 — concurrent roles per month. Vertical: 1 role/div. Horizontal: 1
          month/div. Sampled from the dates in each role, not drawn by hand.
        </p>
      </section>

      <section className="so-channels" id="experience">
        <h2 className="so-section">Channel list</h2>
        {roles.map((role, index) => (
          <article className="so-channel" key={role.id}>
            <span className="so-ch">CH{index + 1}</span>
            <div>
              <h3>
                <a href={role.url} target="_blank" rel="noopener noreferrer">
                  {role.company}
                </a>
                {role.ongoing && <em className="so-live">ACQ</em>}
              </h3>
              <p className="so-meta">
                {role.role} / {role.date} / {role.months} SAMPLES / TRACE {role.lane + 1}
              </p>
              {role.description && <p className="so-desc">{role.description}</p>}
              {role.skills.length > 0 && (
                <p className="so-probe">PROBES: {role.skills.join(', ')}</p>
              )}
            </div>
          </article>
        ))}
      </section>

      <section className="so-captures" id="projects">
        <h2 className="so-section">Saved captures</h2>
        <div className="so-capture-grid">
          {projectsData.map((project, index) => (
            <article className="so-capture" key={project.id}>
              <p className="so-meta">REF{index + 1}</p>
              <img src={`/${project.image}`} alt={project.title} loading="lazy" />
              <h3>{project.title}</h3>
              <p className="so-desc">{project.description}</p>
              <p className="so-probe">{project.technologies.join(', ')}</p>
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">SOURCE</a>
            </article>
          ))}
        </div>
      </section>

      <footer className="so-foot">
        <p className="so-model">APPENDIX</p>
        <p className="so-desc">
          <a href={PAPER_URL} target="_blank" rel="noopener noreferrer">CoVeGAT</a> —
          claim verification with graph ML, 96% detection accuracy on
          adversarial fabrications.
        </p>
        <p className="so-model">MAX BADER · <a href={`mailto:${EMAIL}`}>{EMAIL}</a></p>
      </footer>
    </div>
  );
};

export default ScopeWorld;
