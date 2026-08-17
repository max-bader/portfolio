import React, { useRef } from 'react';
import { gsap, motionContext, useGSAP } from '../../lib/gsap';
import { roles, totalMonths, peakConcurrent } from '../../lib/timeline';
import { projectsData } from '../../data/projects';
import { EMAIL, GITHUB_URL, LINKEDIN_URL, PAPER_URL, RESUME_URL } from '../../lib/links';
import './seed.css';

/**
 * World: botanical field guide plate.
 *
 * Roles are specimens with binomial names, collection dates, and herbarium
 * sheet numbers. The stem height of each specimen is drawn from its real
 * duration, so the plate is a comparative growth study rather than a
 * decorative illustration.
 */
const genusFor = (company) => company.split(/[\s-]/)[0].replace(/[^A-Za-z]/g, '');

const SeedWorld = () => {
  const root = useRef(null);
  const longest = Math.max(...roles.map((r) => r.months));

  useGSAP(
    () => {
      motionContext(root, (context) => {
        if (!context.conditions.motion) return;

        gsap
          .timeline({ defaults: { ease: 'power2.out' } })
          .from('.sd-plate-no', { opacity: 0, duration: 0.5 })
          .from('.sd-title', { opacity: 0, y: 16, duration: 0.8 }, 0.1)
          .from('.sd-intro', { opacity: 0, y: 12, duration: 0.6 }, 0.3)
          .from('.sd-links a', { opacity: 0, y: 8, duration: 0.4, stagger: 0.06 }, 0.45);

        // Specimens grow: stem first, then leaves, then the label is pinned.
        gsap.utils.toArray('.sd-specimen').forEach((specimen) => {
          gsap
            .timeline({ scrollTrigger: { trigger: specimen, start: 'top 82%', once: true } })
            .from(specimen.querySelector('.sd-stem'), {
              scaleY: 0,
              transformOrigin: 'bottom center',
              duration: 0.9,
              ease: 'power2.out'
            })
            .from(
              specimen.querySelectorAll('.sd-leaf'),
              { scale: 0, transformOrigin: 'left center', duration: 0.4, stagger: 0.07, ease: 'back.out(2)' },
              '-=0.45'
            )
            .from(
              specimen.querySelector('.sd-tag'),
              { opacity: 0, rotate: -4, y: 10, duration: 0.5 },
              '-=0.3'
            )
            .from(
              specimen.querySelectorAll('.sd-desc > *'),
              { opacity: 0, y: 8, duration: 0.4, stagger: 0.06 },
              '-=0.35'
            );
        });

        gsap.utils.toArray('.sd-packet').forEach((packet) => {
          gsap.from(packet, {
            opacity: 0,
            y: 20,
            duration: 0.6,
            ease: 'power3.out',
            scrollTrigger: { trigger: packet, start: 'top 84%', once: true }
          });
        });
      });
    },
    { scope: root }
  );

  return (
    <div className="sd" ref={root}>
      <header className="sd-head">
        <p className="sd-plate-no">Plate I — Comparative growth</p>
        <h1 className="sd-title">Max Bader</h1>
        <p className="sd-intro">
          A field guide to {roles.length} specimens collected over{' '}
          {totalMonths} months, {peakConcurrent} of which were found growing
          together. Computer Science, University of California, Irvine.
        </p>
        <nav className="sd-links">
          <a href={`mailto:${EMAIL}`}>Correspondence</a>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">Herbarium</a>
          <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">Register</a>
          <a href={RESUME_URL} target="_blank" rel="noopener noreferrer">Field notes (PDF)</a>
        </nav>
      </header>

      <section className="sd-plate" id="experience">
        {roles.map((role, index) => (
          <article className="sd-specimen" key={role.id}>
            {/* Stem height is the role's duration against the longest. */}
            <div className="sd-drawing">
              <span
                className={`sd-stem ${role.ongoing ? 'is-living' : ''}`}
                style={{ height: `${30 + (role.months / longest) * 70}%` }}
              />
              {role.skills.slice(0, 5).map((skill, leafIndex) => (
                <span
                  className="sd-leaf"
                  key={skill}
                  style={{
                    bottom: `${18 + leafIndex * 14}%`,
                    left: leafIndex % 2 ? '50%' : 'auto',
                    right: leafIndex % 2 ? 'auto' : '50%',
                    transform: `scaleX(${leafIndex % 2 ? 1 : -1})`
                  }}
                >
                  <span className="sd-leaf-name">{skill}</span>
                </span>
              ))}
              <span className="sd-soil" aria-hidden="true" />
            </div>

            <div className="sd-desc">
              <p className="sd-tag">
                <span className="sd-sheet">Sheet {String(index + 1).padStart(2, '0')}</span>
                {role.date}
              </p>
              <h2>
                <a href={role.url} target="_blank" rel="noopener noreferrer">
                  {role.company}
                </a>
              </h2>
              <p className="sd-binomial">
                <em>{genusFor(role.company)} {role.ongoing ? 'vivens' : 'collecta'}</em> ·{' '}
                {role.months} months
              </p>
              <p className="sd-role">{role.role}</p>
              {role.description && <p className="sd-body">{role.description}</p>}
            </div>
          </article>
        ))}
      </section>

      <section className="sd-packets" id="projects">
        <h2 className="sd-section">Seed packets — cultivated</h2>
        <div className="sd-packet-grid">
          {projectsData.map((project, index) => (
            <article className="sd-packet" key={project.id}>
              <p className="sd-packet-no">No. {String(index + 1).padStart(2, '0')}</p>
              <img src={`/${project.image}`} alt={project.title} loading="lazy" />
              <h3>{project.title}</h3>
              <p className="sd-body">{project.description}</p>
              <p className="sd-sowing">Sow with: {project.technologies.join(', ')}</p>
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                Cultivation notes
              </a>
            </article>
          ))}
        </div>
      </section>

      <footer className="sd-foot">
        <p className="sd-plate-no">Appendix</p>
        <p className="sd-body">
          <a href={PAPER_URL} target="_blank" rel="noopener noreferrer">CoVeGAT</a> —
          claim verification with graph ML. 96% detection accuracy on
          adversarial fabrications.
        </p>
        <p className="sd-plate-no">
          Max Bader · <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
        </p>
      </footer>
    </div>
  );
};

export default SeedWorld;
