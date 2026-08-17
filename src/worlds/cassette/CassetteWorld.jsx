import React, { useRef } from 'react';
import { gsap, motionContext, useGSAP } from '../../lib/gsap';
import { roles, totalMonths, peakConcurrent } from '../../lib/timeline';
import { projectsData } from '../../data/projects';
import { EMAIL, GITHUB_URL, LINKEDIN_URL, PAPER_URL, RESUME_URL } from '../../lib/links';
import './cassette.css';

/**
 * World: mixtape J-card.
 *
 * Roles are tracks with real running times — a month is a second, so the
 * tracklist totals the career. Side A and Side B split at the midpoint of
 * the timeline, and the reels turn at a rate set by how much tape is left.
 */
const runtime = (months) => `${Math.floor(months / 6)}:${String((months * 10) % 60).padStart(2, '0')}`;

const CassetteWorld = () => {
  const root = useRef(null);
  const midpoint = Math.ceil(roles.length / 2);
  const sideA = roles.slice(0, midpoint);
  const sideB = roles.slice(midpoint);

  useGSAP(
    () => {
      motionContext(root, (context) => {
        if (!context.conditions.motion) return;

        // The reels turn: the supply reel slows as the take-up reel fills.
        gsap.to('.cs-reel-left', { rotate: 360, duration: 7, repeat: -1, ease: 'none' });
        gsap.to('.cs-reel-right', { rotate: 360, duration: 4.5, repeat: -1, ease: 'none' });

        gsap
          .timeline({ defaults: { ease: 'power3.out' } })
          .from('.cs-shell', { opacity: 0, y: 24, duration: 0.8 })
          .from('.cs-hand > *', { opacity: 0, y: 10, duration: 0.5, stagger: 0.07 }, 0.25);

        gsap.utils.toArray('.cs-track').forEach((track) => {
          gsap.from(track, {
            opacity: 0,
            x: -14,
            duration: 0.45,
            ease: 'power2.out',
            scrollTrigger: { trigger: track, start: 'top 90%', once: true }
          });
        });

        gsap.utils.toArray('.cs-sleeve').forEach((sleeve) => {
          gsap.from(sleeve, {
            opacity: 0,
            y: 18,
            duration: 0.55,
            scrollTrigger: { trigger: sleeve, start: 'top 85%', once: true }
          });
        });
      });
    },
    { scope: root }
  );

  const renderSide = (label, list, offset) => (
    <div className="cs-side">
      <p className="cs-side-label">Side {label}</p>
      <ol className="cs-tracks">
        {list.map((role, index) => (
          <li className="cs-track" key={role.id}>
            <span className="cs-track-no">{offset + index + 1}</span>
            <span className="cs-track-body">
              <a href={role.url} target="_blank" rel="noopener noreferrer">
                {role.company}
              </a>
              <em>{role.role}</em>
              {role.description && <span className="cs-track-note">{role.description}</span>}
              {role.skills.length > 0 && (
                <span className="cs-track-tags">{role.skills.join(' · ')}</span>
              )}
            </span>
            <span className="cs-track-time">
              {runtime(role.months)}
              {role.ongoing && <em>▶</em>}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );

  return (
    <div className="cs" ref={root}>
      <header className="cs-hand">
        {/* The shell: two reels, a window, a hand-written label. */}
        <div className="cs-shell">
          <div className="cs-label">
            <p className="cs-brand">C-{totalMonths} · TYPE II · HIGH BIAS</p>
            <h1>Max Bader</h1>
            <p className="cs-scrawl">
              CS @ UC Irvine — {roles.length} tracks, {peakConcurrent} overdubbed
            </p>
          </div>
          <div className="cs-window">
            <span className="cs-reel cs-reel-left" aria-hidden="true" />
            <span className="cs-tape" aria-hidden="true" />
            <span className="cs-reel cs-reel-right" aria-hidden="true" />
          </div>
        </div>

        <nav className="cs-links">
          <a href={`mailto:${EMAIL}`}>Email</a>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href={RESUME_URL} target="_blank" rel="noopener noreferrer">Résumé</a>
        </nav>
      </header>

      <section className="cs-listing" id="experience">
        {renderSide('A', sideA, 0)}
        {renderSide('B', sideB, sideA.length)}
      </section>

      <section className="cs-sleeves" id="projects">
        <h2 className="cs-section">Also released</h2>
        <div className="cs-sleeve-grid">
          {projectsData.map((project, index) => (
            <article className="cs-sleeve" key={project.id}>
              <p className="cs-cat">CAT-{String(index + 1).padStart(3, '0')}</p>
              <img src={`/${project.image}`} alt={project.title} loading="lazy" />
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <p className="cs-track-tags">{project.technologies.join(' · ')}</p>
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">Liner notes</a>
            </article>
          ))}
        </div>
      </section>

      <footer className="cs-foot">
        <p className="cs-brand">Hidden track</p>
        <p>
          <a href={PAPER_URL} target="_blank" rel="noopener noreferrer">CoVeGAT</a> —
          claim verification with graph ML. 96% detection accuracy on
          adversarial fabrications.
        </p>
        <p className="cs-brand">
          Max Bader · <a href={`mailto:${EMAIL}`}>{EMAIL}</a> · dubbed in Irvine
        </p>
      </footer>
    </div>
  );
};

export default CassetteWorld;
