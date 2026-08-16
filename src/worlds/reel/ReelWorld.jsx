import React, { useRef } from 'react';
import { stagger, createTimeline } from 'animejs';
import { gsap, useGSAP } from '../../lib/gsap';
import { roles, laneCount, totalMonths, peakConcurrent, careerStart, careerEnd } from '../../lib/timeline';
import { projectsData } from '../../data/projects';
import { EMAIL, GITHUB_URL, LINKEDIN_URL, PAPER_URL, RESUME_URL } from '../../lib/links';
import './reel.css';

/**
 * World: non-linear editor timeline. Animated with anime.js.
 *
 * Roles are clips on stacked video tracks, positioned and sized by their real
 * dates. Concurrency is what an NLE draws better than anything else: clips
 * sitting on top of each other in the same span of the timeline.
 */
const TRACK_HUES = ['#4ea3ff', '#ff8f4e', '#5ddb9a', '#c98bff'];

const ReelWorld = () => {
  const root = useRef(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (!reduced) {
        createTimeline({ defaults: { ease: 'out(3)' } })
          .add(root.current.querySelectorAll('.rl-chrome > *'), {
            opacity: [0, 1],
            y: [-10, 0],
            duration: 500,
            delay: stagger(60)
          })
          .add(
            root.current.querySelectorAll('.rl-clip'),
            { scaleX: [0, 1], opacity: [0, 1], duration: 620, delay: stagger(70) },
            '-=250'
          )
          .add(
            root.current.querySelectorAll('.rl-shot'),
            { opacity: [0, 1], y: [18, 0], duration: 520, delay: stagger(70) },
            '-=300'
          );
      }

      // The playhead is dragged by scroll — scrubbing the timeline is the
      // interaction an editor actually performs.
      const head = root.current.querySelector('.rl-playhead');
      const readout = root.current.querySelector('.rl-tc-current');
      gsap.to(head, {
        left: '100%',
        ease: 'none',
        scrollTrigger: {
          trigger: root.current.querySelector('.rl-timeline'),
          start: 'top 70%',
          end: 'bottom 30%',
          scrub: 0.3,
          onUpdate: (self) => {
            if (!readout) return;
            const month = Math.round(self.progress * totalMonths);
            readout.textContent = `00:${String(month).padStart(2, '0')}:00`;
          }
        }
      });
    },
    { scope: root }
  );

  return (
    <div className="rl" ref={root}>
      <header className="rl-chrome">
        <p className="rl-app">bader_career.prproj — timeline</p>
        <h1>Max Bader</h1>
        <p className="rl-sub">
          Computer Science, UC Irvine · {roles.length} clips on {laneCount} tracks ·{' '}
          {peakConcurrent} layered at peak
        </p>
        <nav className="rl-links">
          <a href={`mailto:${EMAIL}`}>Email</a>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href={RESUME_URL} target="_blank" rel="noopener noreferrer">Résumé</a>
        </nav>
      </header>

      <section className="rl-timeline" id="experience">
        <div className="rl-ruler">
          <span>{careerStart}</span>
          <span className="rl-tc-current">00:00:00</span>
          <span>{careerEnd}</span>
        </div>

        <div className="rl-tracks" style={{ '--tracks': laneCount }}>
          <span className="rl-playhead" aria-hidden="true" />

          {Array.from({ length: laneCount }, (_, lane) => (
            <div className="rl-track" key={lane}>
              <span className="rl-track-label">V{laneCount - lane}</span>
            </div>
          ))}

          {roles.map((role) => (
            <article
              className={`rl-clip ${role.ongoing ? 'is-live' : ''}`}
              key={role.id}
              style={{
                left: `${role.offset * 100}%`,
                width: `${role.extent * 100}%`,
                top: `${role.lane * 4.6}rem`,
                '--hue': TRACK_HUES[role.lane % TRACK_HUES.length]
              }}
            >
              <span className="rl-clip-name">{role.company}</span>
              <span className="rl-clip-dur">{role.months}mo</span>
            </article>
          ))}
        </div>

        <ol className="rl-log">
          {roles.map((role, index) => (
            <li className="rl-shot" key={role.id}>
              <span className="rl-slate" style={{ background: TRACK_HUES[role.lane % TRACK_HUES.length] }}>
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <h2>
                  <a href={role.url} target="_blank" rel="noopener noreferrer">
                    {role.company}
                  </a>
                  {role.ongoing && <em>rec</em>}
                </h2>
                <p className="rl-shot-meta">
                  {role.role} · {role.date} · V{role.lane + 1}
                </p>
                {role.description && <p className="rl-shot-desc">{role.description}</p>}
                {role.skills.length > 0 && (
                  <p className="rl-shot-tags">{role.skills.join('  ·  ')}</p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="rl-bin" id="projects">
        <h2 className="rl-section">Project bin</h2>
        <div className="rl-bin-grid">
          {projectsData.map((project) => (
            <article className="rl-shot rl-asset" key={project.id}>
              <img src={`/${project.image}`} alt={project.title} loading="lazy" />
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <p className="rl-shot-tags">{project.technologies.join('  ·  ')}</p>
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">Open source →</a>
            </article>
          ))}
        </div>
      </section>

      <footer className="rl-foot">
        <p className="rl-app">Notes</p>
        <p>
          <a href={PAPER_URL} target="_blank" rel="noopener noreferrer">CoVeGAT</a> —
          claim verification with graph ML, 96% detection accuracy on adversarial
          fabrications.
        </p>
        <p className="rl-app">Max Bader · <a href={`mailto:${EMAIL}`}>{EMAIL}</a></p>
      </footer>
    </div>
  );
};

export default ReelWorld;
