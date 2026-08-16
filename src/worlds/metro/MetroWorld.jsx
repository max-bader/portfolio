import React, { useRef } from 'react';
import { animate, stagger, createTimeline } from 'animejs';
import { useGSAP } from '../../lib/gsap';
import { roles, laneCount, totalMonths, peakConcurrent, careerStart, careerEnd } from '../../lib/timeline';
import { projectsData } from '../../data/projects';
import { EMAIL, GITHUB_URL, LINKEDIN_URL, PAPER_URL, RESUME_URL } from '../../lib/links';
import './metro.css';

/**
 * World: transit map. Animated with anime.js rather than GSAP.
 *
 * Six roles as six numbered lines. Concurrency becomes the thing a transit map
 * already knows how to draw: an interchange, where lines run alongside each
 * other through the same stretch of time. The x axis is the real calendar.
 */

const LINE_COLOURS = ['#e2373f', '#0072bc', '#f5a623', '#00954d', '#8a4f9e', '#00a5b5'];

const TRACK_H = 54;
const PAD_X = 60;
const PAD_Y = 46;

const MetroWorld = () => {
  const root = useRef(null);

  const width = 1000;
  const height = PAD_Y * 2 + roles.length * TRACK_H;
  const xAt = (t) => PAD_X + t * (width - PAD_X * 2);

  // Each role is a line: a run from its start date to its end date.
  const lines = roles.map((role, index) => {
    const y = PAD_Y + index * TRACK_H;
    const x1 = xAt(role.offset);
    const x2 = xAt(role.offset + role.extent);
    return { role, index, y, x1, x2, colour: LINE_COLOURS[index % LINE_COLOURS.length] };
  });

  useGSAP(
    () => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const paths = root.current.querySelectorAll('.mt-line');

      paths.forEach((path) => {
        const length = path.getTotalLength();
        path.style.strokeDasharray = String(length);
        path.style.strokeDashoffset = reduced ? '0' : String(length);
      });

      if (reduced) return;

      // anime.js draws the routes out, then the stations pop on.
      const tl = createTimeline({ defaults: { ease: 'inOut(3)' } });

      tl.add(paths, {
        strokeDashoffset: 0,
        duration: 1100,
        delay: stagger(120)
      })
        .add(
          root.current.querySelectorAll('.mt-station'),
          { scale: [0, 1], duration: 420, ease: 'out(3)', delay: stagger(55) },
          '-=700'
        )
        .add(
          root.current.querySelectorAll('.mt-label'),
          { opacity: [0, 1], x: [-8, 0], duration: 380, delay: stagger(50) },
          '-=500'
        );

      animate(root.current.querySelectorAll('.mt-head > *'), {
        opacity: [0, 1],
        y: [14, 0],
        duration: 620,
        ease: 'out(3)',
        delay: stagger(70)
      });
    },
    { scope: root }
  );

  return (
    <div className="mt" ref={root}>
      <header className="mt-head">
        <p className="mt-eyebrow">Network map</p>
        <h1>Max Bader</h1>
        <p className="mt-standfirst">
          Computer Science at UC Irvine. {roles.length} lines running{' '}
          {careerStart}–{careerEnd}, up to {peakConcurrent} in service at once
          across {laneCount} interchanges.
        </p>
        <nav className="mt-links">
          <a href={`mailto:${EMAIL}`}>Email</a>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href={RESUME_URL} target="_blank" rel="noopener noreferrer">Résumé</a>
        </nav>
      </header>

      <section className="mt-map-wrap" id="experience">
        <svg
          className="mt-map"
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={`Transit map of ${roles.length} roles over ${totalMonths} months`}
        >
          {/* Time ruler along the bottom. */}
          {[0, 0.25, 0.5, 0.75, 1].map((t) => (
            <line
              key={t}
              className="mt-tick"
              x1={xAt(t)}
              x2={xAt(t)}
              y1={PAD_Y - 24}
              y2={height - PAD_Y + 12}
            />
          ))}

          {lines.map(({ role, y, x1, x2, colour }) => (
            <g key={role.id}>
              <path
                className="mt-line"
                d={`M ${x1} ${y} L ${x2} ${y}`}
                stroke={colour}
                strokeWidth="9"
                strokeLinecap="round"
                fill="none"
              />
              <circle className="mt-station" cx={x1} cy={y} r="7" fill="#fff" stroke={colour} strokeWidth="3.5" />
              <circle
                className="mt-station"
                cx={x2}
                cy={y}
                r={role.ongoing ? 9 : 7}
                fill={role.ongoing ? colour : '#fff'}
                stroke={colour}
                strokeWidth="3.5"
              />
            </g>
          ))}
        </svg>

        <ol className="mt-key">
          {lines.map(({ role, colour, index }) => (
            <li className="mt-label" key={role.id}>
              <span className="mt-bullet" style={{ background: colour }}>
                {index + 1}
              </span>
              <div>
                <h2>
                  <a href={role.url} target="_blank" rel="noopener noreferrer">
                    {role.company}
                  </a>
                  {role.ongoing && <em className="mt-live">in service</em>}
                </h2>
                <p className="mt-role">{role.role} · {role.date} · {role.months} months</p>
                {role.description && <p className="mt-desc">{role.description}</p>}
                {role.skills.length > 0 && (
                  <p className="mt-calls">Calling at: {role.skills.join(' · ')}</p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-builds" id="projects">
        <h2 className="mt-section-title">Termini</h2>
        <div className="mt-build-grid">
          {projectsData.map((project, index) => (
            <article className="mt-build" key={project.id}>
              <span className="mt-build-no" style={{ background: LINE_COLOURS[index % LINE_COLOURS.length] }}>
                {String(index + 1).padStart(2, '0')}
              </span>
              <img src={`/${project.image}`} alt={project.title} loading="lazy" />
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <p className="mt-calls">{project.technologies.join(' · ')}</p>
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">Source</a>
            </article>
          ))}
        </div>
      </section>

      <footer className="mt-foot">
        <p>
          <a href={PAPER_URL} target="_blank" rel="noopener noreferrer">CoVeGAT</a> —
          claim verification with graph ML, 96% detection accuracy on adversarial
          fabrications.
        </p>
        <p className="mt-foot-sign">Max Bader · <a href={`mailto:${EMAIL}`}>{EMAIL}</a></p>
      </footer>
    </div>
  );
};

export default MetroWorld;
