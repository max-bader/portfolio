import React, { useRef } from 'react';
import { gsap, motionContext, useGSAP } from '../../lib/gsap';
import { rolesNewestFirst, totalMonths, peakConcurrent, laneCount } from '../../lib/timeline';
import { projectsData } from '../../data/projects';
import { EMAIL, GITHUB_URL, LINKEDIN_URL, PAPER_URL, RESUME_URL } from '../../lib/links';
import './riso.css';

/**
 * World: risograph print.
 *
 * Two fluorescent spot inks misregistering over toothy paper. The motion is
 * the press's own defect — layers drift a hair out of alignment and snap back,
 * blooming a third colour where they cross. Reduced motion locks perfect
 * registration, which is what a careful print run looks like.
 */

/**
 * A word printed three times, once per ink plus the key layer, offset so the
 * overlap blooms. Only the key layer is exposed — the ink plates are hidden
 * from assistive tech so the word is announced once, not three times.
 */
const Misregistered = ({ text, className = '' }) => (
  <span className={`rw-mis ${className}`.trim()}>
    <span className="rw-mis-layer rw-ink-pink" aria-hidden="true">{text}</span>
    <span className="rw-mis-layer rw-ink-blue" aria-hidden="true">{text}</span>
    <span className="rw-mis-layer rw-mis-key">{text}</span>
  </span>
);

const RisoWorld = () => {
  const root = useRef(null);

  useGSAP(
    () => {
      motionContext(root, (context) => {
        if (!context.conditions.motion) return;

        // Registration drifts in as the press comes up to speed.
        gsap
          .timeline({ defaults: { duration: 0.9, ease: 'power3.out' } })
          .from('.rw-title .rw-mis-layer', { y: 40, opacity: 0, stagger: 0.06 })
          .from('.rw-standfirst', { y: 16, opacity: 0, duration: 0.6 }, 0.3)
          .from('.rw-stat', { y: 14, opacity: 0, duration: 0.5, stagger: 0.06 }, 0.4)
          .from('.rw-shape', { scale: 0.7, opacity: 0, duration: 1, stagger: 0.1 }, 0.15);

        gsap.utils.toArray('.rw-card').forEach((card) => {
          gsap.from(card, {
            y: 30,
            opacity: 0,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 84%', once: true }
          });

          // Hover shudders the plates apart, the way a misfed sheet does.
          const pink = card.querySelector('.rw-plate-pink');
          const blue = card.querySelector('.rw-plate-blue');
          if (!pink || !blue) return;

          const shift = (x, y) => {
            gsap.to(pink, { x: -x, y: -y, duration: 0.25, ease: 'power2.out' });
            gsap.to(blue, { x, y, duration: 0.25, ease: 'power2.out' });
          };

          card.addEventListener('pointerenter', () => shift(4, 3));
          card.addEventListener('pointerleave', () => shift(0, 0));
        });

        gsap.utils.toArray('.rw-role').forEach((role) => {
          gsap.from(role, {
            x: -20,
            opacity: 0,
            duration: 0.55,
            ease: 'power3.out',
            scrollTrigger: { trigger: role, start: 'top 88%', once: true }
          });
        });
      });
    },
    { scope: root }
  );

  return (
    <div className="rw" ref={root}>
      {/* Cut-paper shapes, flat spot ink, no gradients. */}
      <div className="rw-shapes" aria-hidden="true">
        <span className="rw-shape rw-shape-disc" />
        <span className="rw-shape rw-shape-bar" />
        <span className="rw-shape rw-shape-arc" />
      </div>

      <header className="rw-head">
        <h1 className="rw-title">
          <Misregistered text="MAX" />
          <Misregistered text="BADER" />
        </h1>

        <p className="rw-standfirst">
          Computer Science at UC&nbsp;Irvine. {rolesNewestFirst.length} roles in{' '}
          {totalMonths} months, {peakConcurrent} of them at the same time.
        </p>

        <ul className="rw-stats">
          <li className="rw-stat"><b>{rolesNewestFirst.length}</b> roles</li>
          <li className="rw-stat"><b>{laneCount}</b> parallel tracks</li>
          <li className="rw-stat"><b>{projectsData.length}</b> builds</li>
          <li className="rw-stat"><b>1</b> paper</li>
        </ul>

        <nav className="rw-links">
          <a href={`mailto:${EMAIL}`}>Email</a>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href={RESUME_URL} target="_blank" rel="noopener noreferrer">Résumé</a>
        </nav>
      </header>

      <section className="rw-section" id="experience">
        <h2 className="rw-section-title"><Misregistered text="ROLES" /></h2>

        <ol className="rw-roles">
          {rolesNewestFirst.map((role) => (
            <li className="rw-role" key={role.id}>
              <p className="rw-role-date">{role.date}</p>
              <div>
                <h3>
                  <a href={role.url} target="_blank" rel="noopener noreferrer">
                    {role.company}
                  </a>
                  {role.ongoing && <span className="rw-now">now</span>}
                </h3>
                <p className="rw-role-title">{role.role}</p>
                {role.description && <p className="rw-role-body">{role.description}</p>}
                {role.skills.length > 0 && (
                  <ul className="rw-tags">
                    {role.skills.map((skill) => (
                      <li key={skill}>{skill}</li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="rw-section" id="projects">
        <h2 className="rw-section-title"><Misregistered text="BUILDS" /></h2>

        <div className="rw-cards">
          {projectsData.map((project) => (
            <article className="rw-card" key={project.id}>
              <div className="rw-plates">
                <span className="rw-plate rw-plate-pink" aria-hidden="true" />
                <span className="rw-plate rw-plate-blue" aria-hidden="true" />
                <img src={`/${project.image}`} alt={project.title} loading="lazy" />
              </div>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <ul className="rw-tags">
                {project.technologies.map((tech) => (
                  <li key={tech}>{tech}</li>
                ))}
              </ul>
              <a
                className="rw-card-link"
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Source
              </a>
            </article>
          ))}
        </div>
      </section>

      <footer className="rw-foot">
        <h2 className="rw-section-title"><Misregistered text="PAPER" /></h2>
        <p className="rw-foot-body">
          <a href={PAPER_URL} target="_blank" rel="noopener noreferrer">CoVeGAT</a> —
          claim verification with graph ML. 96% detection accuracy on adversarial
          fabrications.
        </p>
        <p className="rw-colophon">
          Max Bader · <a href={`mailto:${EMAIL}`}>{EMAIL}</a> · printed in two inks
        </p>
      </footer>
    </div>
  );
};

export default RisoWorld;
