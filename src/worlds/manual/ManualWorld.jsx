import React, { useRef, useState } from 'react';
import { gsap, useGSAP } from '../../lib/gsap';
import { rolesNewestFirst, totalMonths, peakConcurrent } from '../../lib/timeline';
import { projectsData } from '../../data/projects';
import { EMAIL, GITHUB_URL, LINKEDIN_URL, PAPER_URL, RESUME_URL } from '../../lib/links';
import './manual.css';

/**
 * World: boxed-software reference manual, open at a tabbed divider.
 *
 * The competitive challenger from the direction round. Navigation is the
 * physical object's own: a stepped tab rail down the fore edge, one tab per
 * division, and the selected tab extends and *becomes* the board you read on.
 *
 * Motion grammar is deliberately anti-easing — every change is a two-frame
 * hinge at 90ms, because paper does not ease.
 */
const SECTIONS = [
  { id: 'about', tab: '1', label: 'Getting started', hue: '#d2571f' },
  { id: 'roles', tab: '2', label: 'Reference: roles', hue: '#e8b21c' },
  { id: 'built', tab: '3', label: 'Reference: builds', hue: '#3f7d3a' },
  { id: 'research', tab: '4', label: 'Appendix: research', hue: '#1f6f7d' },
  { id: 'contact', tab: '5', label: 'Support', hue: '#3a3f8f' }
];

const HINGE = { duration: 0.09, ease: 'steps(2)' };

const ManualWorld = () => {
  const root = useRef(null);
  const [active, setActive] = useState(SECTIONS[0].id);
  const section = SECTIONS.find((entry) => entry.id === active);

  // Every leaf hinges in from its punched edge when the division changes.
  useGSAP(
    () => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const leaves = gsap.utils.toArray('.mw-leaf', root.current);
      if (reduced) {
        gsap.set(leaves, { opacity: 1, rotateX: 0 });
        return;
      }
      gsap.fromTo(
        leaves,
        { opacity: 0, rotateX: -8 },
        { opacity: 1, rotateX: 0, stagger: 0.045, ...HINGE }
      );
    },
    { scope: root, dependencies: [active] }
  );

  return (
    <div className="mw" ref={root} style={{ '--board': section.hue }}>
      <div className="mw-book">
        {/* The board: one section hue at full strength, no mark on it. */}
        <div className="mw-board">
          <header className="mw-masthead">
            <p className="mw-leaf mw-imprint">Max Bader — Reference Manual</p>
            <p className="mw-leaf mw-edition">
              Edition {totalMonths} · {rolesNewestFirst.length} entries ·{' '}
              {peakConcurrent} concurrent
            </p>
          </header>

          <div className="mw-sheet">
            {active === 'about' && (
              <section className="mw-division">
                <h1 className="mw-leaf mw-h1">Max Bader</h1>
                <p className="mw-leaf mw-standfirst">
                  Computer Science at the University of California, Irvine.
                  Product engineering and AI research, usually at the same time.
                </p>
                <p className="mw-leaf mw-body">
                  This manual documents {rolesNewestFirst.length} roles held over{' '}
                  {totalMonths} months, {peakConcurrent} of them running
                  concurrently at peak, alongside four shipped builds and one
                  first-author paper. Use the tabs at the fore edge to move
                  between divisions.
                </p>
                <dl className="mw-leaf mw-keyvals">
                  <div><dt>Discipline</dt><dd>Software engineering, applied ML</dd></div>
                  <div><dt>Location</dt><dd>Irvine, California</dd></div>
                  <div><dt>Status</dt><dd>Software Engineer Intern, CodeHS</dd></div>
                </dl>
              </section>
            )}

            {active === 'roles' && (
              <section className="mw-division">
                <h2 className="mw-leaf mw-h2">Reference: roles</h2>
                <ol className="mw-entries">
                  {rolesNewestFirst.map((role, index) => (
                    <li className="mw-leaf mw-entry" key={role.id}>
                      <p className="mw-entry-no">
                        {section.tab}.{index + 1}
                      </p>
                      <div>
                        <h3>
                          <a href={role.url} target="_blank" rel="noopener noreferrer">
                            {role.company}
                          </a>
                        </h3>
                        <p className="mw-entry-meta">
                          {role.role} · {role.date} · {role.months} months
                          {role.ongoing && <span className="mw-flag">current</span>}
                        </p>
                        {role.description && <p className="mw-body">{role.description}</p>}
                        {role.skills.length > 0 && (
                          <p className="mw-machine">{role.skills.join('  ')}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            )}

            {active === 'built' && (
              <section className="mw-division">
                <h2 className="mw-leaf mw-h2">Reference: builds</h2>
                {projectsData.map((project, index) => (
                  <article className="mw-leaf mw-build" key={project.id}>
                    <figure>
                      <img src={`/${project.image}`} alt={project.title} loading="lazy" />
                      <figcaption>
                        Fig. {section.tab}.{index + 1} — {project.title}
                      </figcaption>
                    </figure>
                    <div>
                      <h3>{project.title}</h3>
                      <p className="mw-body">{project.description}</p>
                      <p className="mw-machine">{project.technologies.join('  ')}</p>
                      <a
                        className="mw-link"
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Source listing
                      </a>
                    </div>
                  </article>
                ))}
              </section>
            )}

            {active === 'research' && (
              <section className="mw-division">
                <h2 className="mw-leaf mw-h2">Appendix: research</h2>
                <p className="mw-leaf mw-body">
                  <strong>CoVeGAT</strong> — an NLP and graph-ML pipeline for
                  claim verification, with a 1K citation-alignment dataset built
                  to stress-test LLM factual accuracy. Reported 96% detection
                  accuracy on adversarial fabrications using a lightweight
                  similarity baseline.
                </p>
                <p className="mw-leaf">
                  <a className="mw-link" href={PAPER_URL} target="_blank" rel="noopener noreferrer">
                    Read the paper (PDF)
                  </a>
                </p>
                <p className="mw-leaf mw-machine">
                  Related roles: Algoverse, DapLab, Handshake AI, Boundary RSS
                </p>
              </section>
            )}

            {active === 'contact' && (
              <section className="mw-division">
                <h2 className="mw-leaf mw-h2">Support</h2>
                <dl className="mw-leaf mw-keyvals">
                  <div><dt>Email</dt><dd><a className="mw-link" href={`mailto:${EMAIL}`}>{EMAIL}</a></dd></div>
                  <div><dt>Source</dt><dd><a className="mw-link" href={GITHUB_URL} target="_blank" rel="noopener noreferrer">github.com/max-bader</a></dd></div>
                  <div><dt>Profile</dt><dd><a className="mw-link" href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">linkedin.com/in/max-bader</a></dd></div>
                  <div><dt>Résumé</dt><dd><a className="mw-link" href={RESUME_URL} target="_blank" rel="noopener noreferrer">MaxBader.pdf</a></dd></div>
                </dl>
              </section>
            )}
          </div>
        </div>

        {/* Fore-edge tab rail: tab height is proportional to division extent. */}
        <nav className="mw-rail" aria-label="Manual divisions">
          {SECTIONS.map((entry) => (
            <button
              key={entry.id}
              type="button"
              className={`mw-tab ${entry.id === active ? 'is-open' : ''}`}
              style={{ '--tab': entry.hue }}
              onClick={() => setActive(entry.id)}
              aria-current={entry.id === active}
            >
              <span className="mw-tab-no">{entry.tab}</span>
              <span className="mw-tab-label">{entry.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default ManualWorld;
