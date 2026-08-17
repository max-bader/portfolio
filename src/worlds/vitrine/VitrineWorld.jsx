import React, { useRef } from 'react';
import { gsap, motionContext, useGSAP } from '../../lib/gsap';
import { rolesNewestFirst, totalMonths, peakConcurrent, careerStart, careerEnd } from '../../lib/timeline';
import { projectsData } from '../../data/projects';
import { EMAIL, GITHUB_URL, LINKEDIN_URL, PAPER_URL, RESUME_URL } from '../../lib/links';
import './vitrine.css';

/**
 * World: museum exhibition.
 *
 * Roles are catalogued objects with accession numbers and wall labels; the
 * motion is gallery lighting — a spot warms each object as you arrive at it,
 * which is what actually happens when you walk a room.
 */
const VitrineWorld = () => {
  const root = useRef(null);

  useGSAP(
    () => {
      motionContext(root, (context) => {
        if (!context.conditions.motion) return;

        gsap
          .timeline({ defaults: { ease: 'power2.out' } })
          .from('.vt-room', { opacity: 0, duration: 0.6 })
          .from('.vt-title', { opacity: 0, y: 20, duration: 0.9 }, 0.15)
          .from('.vt-intro', { opacity: 0, y: 14, duration: 0.7 }, 0.35)
          .from('.vt-hours > *', { opacity: 0, duration: 0.5, stagger: 0.08 }, 0.55);

        // Each plinth lights as it enters the room.
        gsap.utils.toArray('.vt-object').forEach((object) => {
          gsap
            .timeline({ scrollTrigger: { trigger: object, start: 'top 80%', once: true } })
            .from(object.querySelector('.vt-plinth'), {
              opacity: 0,
              y: 26,
              duration: 0.8,
              ease: 'power3.out'
            })
            .from(
              object.querySelector('.vt-spot'),
              { opacity: 0, scaleY: 0.4, transformOrigin: 'top center', duration: 1 },
              '-=0.55'
            )
            .from(
              object.querySelectorAll('.vt-label > *'),
              { opacity: 0, x: -10, duration: 0.45, stagger: 0.07 },
              '-=0.6'
            );
        });
      });
    },
    { scope: root }
  );

  return (
    <div className="vt" ref={root}>
      <div className="vt-room" aria-hidden="true" />

      <header className="vt-entrance">
        <p className="vt-gallery">Gallery 1 · {careerStart} – {careerEnd}</p>
        <h1 className="vt-title">Max Bader</h1>
        <p className="vt-intro">
          A working collection of {rolesNewestFirst.length} positions assembled
          over {totalMonths} months, {peakConcurrent} of them held
          simultaneously. Computer Science, University of California, Irvine.
        </p>
        <nav className="vt-hours">
          <a href={`mailto:${EMAIL}`}>Enquiries</a>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">Archive</a>
          <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">Provenance</a>
          <a href={RESUME_URL} target="_blank" rel="noopener noreferrer">Catalogue (PDF)</a>
        </nav>
      </header>

      <section className="vt-objects" id="experience">
        {rolesNewestFirst.map((role, index) => (
          <article className="vt-object" key={role.id}>
            <div className="vt-case">
              <span className="vt-spot" aria-hidden="true" />
              <div className="vt-plinth">
                <span className="vt-acc">
                  {new Date().getFullYear()}.{String(index + 1).padStart(3, '0')}
                </span>
                <span className="vt-months">{role.months}</span>
                <span className="vt-months-unit">months</span>
              </div>
            </div>

            <div className="vt-label">
              <h2>
                <a href={role.url} target="_blank" rel="noopener noreferrer">
                  {role.company}
                </a>
              </h2>
              <p className="vt-medium">
                {role.role}
                {role.ongoing && <em>on loan — currently active</em>}
              </p>
              <p className="vt-date">{role.date}</p>
              {role.description && <p className="vt-desc">{role.description}</p>}
              {role.skills.length > 0 && (
                <p className="vt-materials">Materials: {role.skills.join(', ')}</p>
              )}
            </div>
          </article>
        ))}
      </section>

      <section className="vt-annex" id="projects">
        <h2 className="vt-annex-title">Annex — works produced</h2>
        <div className="vt-annex-grid">
          {projectsData.map((project, index) => (
            <article className="vt-work" key={project.id}>
              <figure>
                <img src={`/${project.image}`} alt={project.title} loading="lazy" />
                <figcaption>
                  <strong>{project.title}</strong>
                  <span className="vt-acc">W.{String(index + 1).padStart(3, '0')}</span>
                </figcaption>
              </figure>
              <p className="vt-desc">{project.description}</p>
              <p className="vt-materials">{project.technologies.join(', ')}</p>
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                Documentation
              </a>
            </article>
          ))}
        </div>
      </section>

      <footer className="vt-colophon">
        <p className="vt-gallery">Publication</p>
        <p className="vt-desc">
          <a href={PAPER_URL} target="_blank" rel="noopener noreferrer">CoVeGAT</a> —
          claim verification with graph ML. 96% detection accuracy on
          adversarial fabrications.
        </p>
        <p className="vt-gallery">
          Max Bader · <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
        </p>
      </footer>
    </div>
  );
};

export default VitrineWorld;
