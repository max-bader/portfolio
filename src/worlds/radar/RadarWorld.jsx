import React, { useEffect, useRef } from 'react';
import { gsap, motionContext, useGSAP } from '../../lib/gsap';
import { roles, totalMonths, peakConcurrent, laneCount } from '../../lib/timeline';
import { projectsData } from '../../data/projects';
import { EMAIL, GITHUB_URL, LINKEDIN_URL, PAPER_URL, RESUME_URL } from '../../lib/links';
import './radar.css';

/**
 * World: PPI radar display.
 *
 * Contacts are placed by real data — bearing from the role's start date,
 * range from its track — and each blip only paints when the sweep passes over
 * it, then decays. That is how a PPI scope actually works: you see a contact
 * once per revolution and it fades until the next pass.
 */
const RadarWorld = () => {
  const root = useRef(null);
  const canvasRef = useRef(null);

  const contacts = roles.map((role) => ({
    role,
    bearing: role.offset * Math.PI * 2 - Math.PI / 2,
    range: 0.32 + (role.lane / Math.max(laneCount - 1, 1)) * 0.55
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let frame = 0;
    let angle = -Math.PI / 2;
    let size = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      size = canvas.clientWidth;
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      const c = size / 2;
      const r = c * 0.92;

      // Persistence: the phosphor decays rather than clearing.
      ctx.fillStyle = 'rgba(2, 14, 8, 0.09)';
      ctx.fillRect(0, 0, size, size);

      // Range rings and bearing spokes.
      ctx.strokeStyle = 'rgba(94, 255, 158, 0.16)';
      ctx.lineWidth = 1;
      [0.25, 0.5, 0.75, 1].forEach((ring) => {
        ctx.beginPath();
        ctx.arc(c, c, r * ring, 0, Math.PI * 2);
        ctx.stroke();
      });
      for (let i = 0; i < 12; i += 1) {
        const a = (i / 12) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(c, c);
        ctx.lineTo(c + Math.cos(a) * r, c + Math.sin(a) * r);
        ctx.stroke();
      }

      // The sweep, with a trailing wedge.
      const wedge = ctx.createConicGradient
        ? ctx.createConicGradient(angle, c, c)
        : null;
      if (wedge) {
        wedge.addColorStop(0, 'rgba(94, 255, 158, 0.32)');
        wedge.addColorStop(0.08, 'rgba(94, 255, 158, 0.04)');
        wedge.addColorStop(1, 'rgba(94, 255, 158, 0)');
        ctx.fillStyle = wedge;
        ctx.beginPath();
        ctx.moveTo(c, c);
        ctx.arc(c, c, r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.strokeStyle = 'rgba(160, 255, 200, 0.9)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(c, c);
      ctx.lineTo(c + Math.cos(angle) * r, c + Math.sin(angle) * r);
      ctx.stroke();

      // Blips paint when the sweep is near their bearing.
      contacts.forEach(({ role, bearing, range }) => {
        let delta = angle - bearing;
        while (delta < 0) delta += Math.PI * 2;
        while (delta > Math.PI * 2) delta -= Math.PI * 2;
        const freshness = delta < 0.5 ? 1 - delta / 0.5 : 0;
        if (freshness <= 0.02) return;

        const x = c + Math.cos(bearing) * r * range;
        const y = c + Math.sin(bearing) * r * range;
        ctx.fillStyle = `rgba(${role.ongoing ? '255, 214, 102' : '160, 255, 200'}, ${freshness})`;
        ctx.beginPath();
        ctx.arc(x, y, role.ongoing ? 6 : 4.5, 0, Math.PI * 2);
        ctx.fill();

        if (freshness > 0.35) {
          ctx.fillStyle = `rgba(200, 255, 224, ${freshness * 0.85})`;
          ctx.font = '10px "Chivo Mono", monospace';
          ctx.fillText(role.company.slice(0, 14).toUpperCase(), x + 9, y + 3);
        }
      });

      if (!reduced) angle += 0.012;
      frame = window.requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    frame = window.requestAnimationFrame(draw);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
    };
  }, [contacts]);

  useGSAP(
    () => {
      motionContext(root, (context) => {
        if (!context.conditions.motion) return;
        gsap.from('.rd-panel > *', { opacity: 0, y: 10, duration: 0.5, stagger: 0.07 });
        gsap.utils.toArray('.rd-contact').forEach((contact) => {
          gsap.from(contact, {
            opacity: 0,
            x: -14,
            duration: 0.5,
            scrollTrigger: { trigger: contact, start: 'top 88%', once: true }
          });
        });
      });
    },
    { scope: root }
  );

  return (
    <div className="rd" ref={root}>
      <div className="rd-console">
        <header className="rd-panel">
          <p className="rd-desig">PPI · SURVEILLANCE · 18NM RANGE</p>
          <h1>MAX BADER</h1>
          <p className="rd-sub">
            CS / UC IRVINE · {roles.length} CONTACTS · {totalMonths} MIN SWEEP ·
            MAX {peakConcurrent} SIMULTANEOUS
          </p>
          <nav className="rd-links">
            <a href={`mailto:${EMAIL}`}>EMAIL</a>
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">GITHUB</a>
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">LINKEDIN</a>
            <a href={RESUME_URL} target="_blank" rel="noopener noreferrer">RESUME</a>
          </nav>
        </header>

        <div className="rd-scope">
          <canvas ref={canvasRef} className="rd-canvas" />
        </div>
      </div>

      <p className="rd-caption">
        Bearing is the role&rsquo;s start date around the sweep; range is its
        track. Each contact paints only as the beam passes, then decays.
      </p>

      <section className="rd-contacts" id="experience">
        <h2 className="rd-section">Contact log</h2>
        {roles.map((role, index) => (
          <article className="rd-contact" key={role.id}>
            <span className="rd-id">C{String(index + 1).padStart(2, '0')}</span>
            <div>
              <h3>
                <a href={role.url} target="_blank" rel="noopener noreferrer">
                  {role.company}
                </a>
                {role.ongoing && <em>ACTIVE</em>}
              </h3>
              <p className="rd-meta">
                {role.role} / {role.date} / {role.months}MO / TRK {role.lane + 1}
              </p>
              {role.description && <p className="rd-desc">{role.description}</p>}
              {role.skills.length > 0 && (
                <p className="rd-sig">SIG: {role.skills.join(', ')}</p>
              )}
            </div>
          </article>
        ))}
      </section>

      <section className="rd-payloads" id="projects">
        <h2 className="rd-section">Payloads</h2>
        <div className="rd-payload-grid">
          {projectsData.map((project, index) => (
            <article className="rd-payload" key={project.id}>
              <p className="rd-meta">PL-{String(index + 1).padStart(2, '0')}</p>
              <img src={`/${project.image}`} alt={project.title} loading="lazy" />
              <h3>{project.title}</h3>
              <p className="rd-desc">{project.description}</p>
              <p className="rd-sig">{project.technologies.join(', ')}</p>
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">SOURCE</a>
            </article>
          ))}
        </div>
      </section>

      <footer className="rd-foot">
        <p className="rd-desig">APPENDIX</p>
        <p className="rd-desc">
          <a href={PAPER_URL} target="_blank" rel="noopener noreferrer">CoVeGAT</a> —
          claim verification with graph ML. 96% detection accuracy on
          adversarial fabrications.
        </p>
        <p className="rd-desig">MAX BADER · <a href={`mailto:${EMAIL}`}>{EMAIL}</a></p>
      </footer>
    </div>
  );
};

export default RadarWorld;
