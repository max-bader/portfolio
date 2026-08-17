import React, { useRef } from 'react';
import { animate, stagger, createTimeline } from 'animejs';
import { useGSAP } from '../../lib/gsap';
import { roles, totalMonths, peakConcurrent, laneCount } from '../../lib/timeline';
import { projectsData } from '../../data/projects';
import { EMAIL, GITHUB_URL, LINKEDIN_URL, PAPER_URL, RESUME_URL } from '../../lib/links';
import './atlas.css';

/**
 * World: celestial atlas plate. Animated with anime.js.
 *
 * Roles are stars whose magnitude is their duration — a longer role burns
 * brighter and larger, exactly the convention a star chart already uses. The
 * constellation lines join roles that overlapped in time, so the shape drawn
 * across the plate is the concurrency itself.
 */
const AtlasWorld = () => {
  const root = useRef(null);

  const W = 900;
  const H = 520;

  // Position by time on x, by track on y — a real projection of the data.
  const stars = roles.map((role, index) => ({
    role,
    index,
    x: 70 + (role.offset + role.extent / 2) * (W - 140),
    y: 70 + (role.lane / Math.max(laneCount - 1, 1)) * (H - 160),
    r: 3 + (role.months / Math.max(...roles.map((r) => r.months))) * 7
  }));

  // Join any two roles whose spans overlapped.
  const links = [];
  stars.forEach((a, i) => {
    stars.slice(i + 1).forEach((b) => {
      const overlap = Math.min(a.role.end, b.role.end) - Math.max(a.role.start, b.role.start);
      if (overlap > 0) links.push({ a, b, key: `${a.role.id}-${b.role.id}` });
    });
  });

  useGSAP(
    () => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const lines = root.current.querySelectorAll('.at-link');

      lines.forEach((line) => {
        const length = line.getTotalLength();
        line.style.strokeDasharray = String(length);
        line.style.strokeDashoffset = reduced ? '0' : String(length);
      });

      if (reduced) return;

      createTimeline({ defaults: { ease: 'out(3)' } })
        .add(root.current.querySelectorAll('.at-star'), {
          opacity: [0, 1],
          scale: [0, 1],
          duration: 700,
          delay: stagger(90)
        })
        .add(lines, { strokeDashoffset: 0, duration: 900, delay: stagger(70) }, '-=400')
        .add(
          root.current.querySelectorAll('.at-starlabel'),
          { opacity: [0, 1], duration: 500, delay: stagger(60) },
          '-=600'
        );

      animate(root.current.querySelectorAll('.at-plate-head > *'), {
        opacity: [0, 1],
        y: [12, 0],
        duration: 620,
        delay: stagger(70),
        ease: 'out(3)'
      });
    },
    { scope: root }
  );

  return (
    <div className="at" ref={root}>
      <header className="at-plate-head">
        <p className="at-plate-no">Plate {roles.length} · Northern career</p>
        <h1>Max Bader</h1>
        <p className="at-sub">
          Computer Science, UC Irvine. {roles.length} bodies catalogued over{' '}
          {totalMonths} months; maximum {peakConcurrent} visible at once.
          Magnitude denotes duration.
        </p>
        <nav className="at-links">
          <a href={`mailto:${EMAIL}`}>Email</a>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href={RESUME_URL} target="_blank" rel="noopener noreferrer">Résumé</a>
        </nav>
      </header>

      <section className="at-plate" id="experience">
        <svg viewBox={`0 0 ${W} ${H}`} className="at-chart" role="img" aria-label="Star chart of roles">
          <rect x="0" y="0" width={W} height={H} className="at-field" />

          {links.map(({ a, b, key }) => (
            <line
              key={key}
              className="at-link"
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
            />
          ))}

          {stars.map(({ role, x, y, r }) => (
            <g key={role.id}>
              <circle className={`at-star ${role.ongoing ? 'is-live' : ''}`} cx={x} cy={y} r={r} />
              <text className="at-starlabel" x={x + r + 8} y={y + 4}>
                {role.company.split(' ')[0]}
              </text>
            </g>
          ))}
        </svg>
        <p className="at-legend">
          Lines join roles whose spans overlapped. The figure they draw is the
          concurrency, not an invented shape.
        </p>
      </section>

      <section className="at-catalogue">
        <h2 className="at-section">Catalogue</h2>
        <ol className="at-entries">
          {roles.map((role, index) => (
            <li className="at-entry" key={role.id}>
              <span className="at-desig">MB&nbsp;{String(index + 1).padStart(3, '0')}</span>
              <div>
                <h3>
                  <a href={role.url} target="_blank" rel="noopener noreferrer">
                    {role.company}
                  </a>
                  {role.ongoing && <em>visible now</em>}
                </h3>
                <p className="at-meta">
                  {role.role} · {role.date} · mag {role.months}
                </p>
                {role.description && <p className="at-desc">{role.description}</p>}
                {role.skills.length > 0 && (
                  <p className="at-spectra">Spectra: {role.skills.join(' · ')}</p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="at-observed" id="projects">
        <h2 className="at-section">Observed objects</h2>
        <div className="at-observed-grid">
          {projectsData.map((project, index) => (
            <article className="at-object" key={project.id}>
              <p className="at-desig">OBJ&nbsp;{String(index + 1).padStart(3, '0')}</p>
              <img src={`/${project.image}`} alt={project.title} loading="lazy" />
              <h3>{project.title}</h3>
              <p className="at-desc">{project.description}</p>
              <p className="at-spectra">{project.technologies.join(' · ')}</p>
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">Observations</a>
            </article>
          ))}
        </div>
      </section>

      <footer className="at-foot">
        <p className="at-plate-no">Notes</p>
        <p className="at-desc">
          <a href={PAPER_URL} target="_blank" rel="noopener noreferrer">CoVeGAT</a> —
          claim verification with graph ML, 96% detection accuracy on
          adversarial fabrications.
        </p>
        <p className="at-plate-no">Max Bader · <a href={`mailto:${EMAIL}`}>{EMAIL}</a></p>
      </footer>
    </div>
  );
};

export default AtlasWorld;
