import React, { useRef } from 'react';
import { gsap, motionContext, useGSAP } from '../../lib/gsap';
import { roles, totalMonths, peakConcurrent } from '../../lib/timeline';
import { projectsData } from '../../data/projects';
import { EMAIL, GITHUB_URL, LINKEDIN_URL, PAPER_URL, RESUME_URL } from '../../lib/links';
import './score.css';

/**
 * World: engraved musical score.
 *
 * Roles become movements on a system of staves. A role that runs concurrently
 * with another is literally a second voice on the staff below — polyphony is
 * the notation's own word for the thing this career keeps doing.
 *
 * Motion is a playhead: it sweeps each system as it enters view, and notes
 * lift as it passes them, the way a score-follower highlights a performance.
 */
const STAFF_LINES = [0, 1, 2, 3, 4];

const ScoreWorld = () => {
  const root = useRef(null);

  useGSAP(
    () => {
      motionContext(root, (context) => {
        if (!context.conditions.motion) return;

        gsap
          .timeline({ defaults: { ease: 'power3.out' } })
          .from('.sc-title > *', { opacity: 0, y: 16, duration: 0.7, stagger: 0.08 })
          .from('.sc-staff-line', { scaleX: 0, transformOrigin: 'left center', duration: 0.9, stagger: 0.05 }, 0.2);

        // One playhead per system, sweeping as the system scrolls through.
        gsap.utils.toArray('.sc-system').forEach((system) => {
          const head = system.querySelector('.sc-playhead');
          const notes = system.querySelectorAll('.sc-note');

          gsap.set(notes, { opacity: 0.28 });

          gsap.fromTo(
            head,
            { xPercent: 0 },
            {
              xPercent: 100,
              ease: 'none',
              scrollTrigger: {
                trigger: system,
                start: 'top 78%',
                end: 'bottom 42%',
                scrub: 0.4
              }
            }
          );

          // Each note brightens as the playhead reaches its position.
          notes.forEach((note) => {
            gsap.to(note, {
              opacity: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: system,
                start: 'top 78%',
                end: 'bottom 42%',
                scrub: 0.4,
                onUpdate: (self) => {
                  const at = Number(note.dataset.at);
                  gsap.set(note, { opacity: self.progress >= at ? 1 : 0.28 });
                }
              }
            });
          });
        });

        gsap.utils.toArray('.sc-movement').forEach((movement) => {
          gsap.from(movement, {
            opacity: 0,
            y: 18,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: { trigger: movement, start: 'top 85%', once: true }
          });
        });
      });
    },
    { scope: root }
  );

  return (
    <div className="sc" ref={root}>
      <header className="sc-title">
        <p className="sc-opus">Opus {roles.length} · in {totalMonths} months</p>
        <h1>Max Bader</h1>
        <p className="sc-tempo">
          Computer Science, UC Irvine — for {peakConcurrent} concurrent voices
        </p>
        <nav className="sc-links">
          <a href={`mailto:${EMAIL}`}>Email</a>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href={RESUME_URL} target="_blank" rel="noopener noreferrer">Résumé</a>
        </nav>
      </header>

      <section className="sc-score" id="experience">
        {roles.map((role, index) => (
          <article className="sc-system sc-movement" key={role.id}>
            <div className="sc-movement-head">
              <p className="sc-mark">
                {index + 1}. <em>{role.ongoing ? 'con moto' : 'a tempo'}</em> — voice {role.lane + 1}
              </p>
              <h2>
                <a href={role.url} target="_blank" rel="noopener noreferrer">
                  {role.company}
                </a>
              </h2>
              <p className="sc-role">{role.role} · {role.date} · {role.months} bars</p>
            </div>

            {/* A staff whose note positions come from the role's own span. */}
            <div className="sc-staff">
              {STAFF_LINES.map((line) => (
                <span className="sc-staff-line" key={line} style={{ top: `${line * 25}%` }} />
              ))}

              <span className="sc-clef" aria-hidden="true">&#119070;</span>

              {role.skills.slice(0, 8).map((skill, noteIndex, list) => {
                const at = (noteIndex + 0.5) / Math.max(list.length, 1);
                return (
                  <span
                    className="sc-note"
                    key={skill}
                    data-at={at}
                    style={{ left: `${12 + at * 80}%`, top: `${68 - (noteIndex % 5) * 14}%` }}
                  >
                    <span className="sc-notehead" />
                    <span className="sc-notelabel">{skill}</span>
                  </span>
                );
              })}

              <span className="sc-playhead" aria-hidden="true" />
            </div>

            {role.description && <p className="sc-programme">{role.description}</p>}
          </article>
        ))}
      </section>

      <section className="sc-works" id="projects">
        <h2 className="sc-section">Selected works</h2>
        <div className="sc-work-grid">
          {projectsData.map((project, index) => (
            <article className="sc-movement sc-work" key={project.id}>
              <p className="sc-mark">Op. {index + 1}</p>
              <img src={`/${project.image}`} alt={project.title} loading="lazy" />
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <p className="sc-instr">{project.technologies.join(' · ')}</p>
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">Score</a>
            </article>
          ))}
        </div>
      </section>

      <footer className="sc-foot sc-movement">
        <p className="sc-mark">Coda</p>
        <p>
          <a href={PAPER_URL} target="_blank" rel="noopener noreferrer">CoVeGAT</a> —
          claim verification with graph ML. 96% detection accuracy on adversarial
          fabrications.
        </p>
        <p className="sc-instr">Max Bader · <a href={`mailto:${EMAIL}`}>{EMAIL}</a></p>
      </footer>
    </div>
  );
};

export default ScoreWorld;
