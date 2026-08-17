import React, { useRef } from 'react';
import { gsap, motionContext, useGSAP } from '../../lib/gsap';
import { rolesNewestFirst, totalMonths, peakConcurrent } from '../../lib/timeline';
import { projectsData } from '../../data/projects';
import { EMAIL, GITHUB_URL, LINKEDIN_URL, PAPER_URL, RESUME_URL } from '../../lib/links';
import './arcade.css';

/**
 * World: arcade cabinet attract mode.
 *
 * The high-score table is the résumé — six entries, initials, score, and stage.
 * Score is months served, so the ranking is real and the top entry is earned
 * rather than decorative. Motion steps rather than eases; a sprite has frames.
 */
const initialsFor = (company) =>
  company
    .replace(/[^A-Za-z ]/g, '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 3)
    .map((word) => word[0].toUpperCase())
    .join('')
    .padEnd(3, 'X')
    .slice(0, 3);

const ArcadeWorld = () => {
  const root = useRef(null);
  const ranked = [...rolesNewestFirst].sort((a, b) => b.months - a.months);

  useGSAP(
    () => {
      motionContext(root, (context) => {
        if (!context.conditions.motion) return;

        // Attract-mode blink, stepped so it reads as a CRT, not a fade.
        gsap.to('.ar-insert', {
          opacity: 0,
          duration: 0.5,
          repeat: -1,
          yoyo: true,
          ease: 'steps(1)'
        });

        gsap
          .timeline({ defaults: { ease: 'steps(4)' } })
          .from('.ar-logo', { opacity: 0, y: -18, duration: 0.5 })
          .from('.ar-sub', { opacity: 0, duration: 0.4 }, '-=0.15')
          .from('.ar-nav a', { opacity: 0, x: -10, duration: 0.35, stagger: 0.08 }, '-=0.1');

        gsap.from('.ar-row', {
          opacity: 0,
          x: -24,
          duration: 0.4,
          ease: 'steps(4)',
          stagger: 0.09,
          scrollTrigger: { trigger: '.ar-scores', start: 'top 80%', once: true }
        });

        gsap.utils.toArray('.ar-cart').forEach((cart) => {
          gsap.from(cart, {
            opacity: 0,
            y: 22,
            duration: 0.45,
            ease: 'steps(4)',
            scrollTrigger: { trigger: cart, start: 'top 84%', once: true }
          });
        });
      });
    },
    { scope: root }
  );

  return (
    <div className="ar" ref={root}>
      <div className="ar-scanlines" aria-hidden="true" />

      <header className="ar-cab">
        <h1 className="ar-logo">MAX BADER</h1>
        <p className="ar-sub">
          © UC IRVINE — CS DIVISION · {totalMonths} MONTHS · {peakConcurrent}P
          SIMULTANEOUS
        </p>
        <p className="ar-insert">INSERT COIN TO CONTINUE</p>
        <nav className="ar-nav">
          <a href={`mailto:${EMAIL}`}>EMAIL</a>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">GITHUB</a>
          <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">LINKEDIN</a>
          <a href={RESUME_URL} target="_blank" rel="noopener noreferrer">RESUME</a>
        </nav>
      </header>

      <section className="ar-scores" id="experience">
        <h2 className="ar-heading">— HIGH SCORES —</h2>
        <p className="ar-note">RANKED BY MONTHS SERVED</p>

        <div className="ar-table">
          <div className="ar-row ar-row-head">
            <span>RANK</span>
            <span>NAME</span>
            <span>SCORE</span>
            <span>STAGE</span>
          </div>

          {ranked.map((role, index) => (
            <article className={`ar-row ${role.ongoing ? 'is-live' : ''}`} key={role.id}>
              <span className="ar-rank">{String(index + 1).padStart(2, '0')}</span>
              <span className="ar-name">
                <a href={role.url} target="_blank" rel="noopener noreferrer">
                  {initialsFor(role.company)}
                </a>
                <em>{role.company}</em>
              </span>
              <span className="ar-score">{String(role.months * 1000).padStart(6, '0')}</span>
              <span className="ar-stage">
                {role.role}
                <em>{role.date}</em>
              </span>
              {role.description && <p className="ar-desc">{role.description}</p>}
              {role.skills.length > 0 && (
                <p className="ar-power">POWER-UPS: {role.skills.join(' / ')}</p>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="ar-carts" id="projects">
        <h2 className="ar-heading">— SELECT GAME —</h2>
        <div className="ar-cart-grid">
          {projectsData.map((project, index) => (
            <article className="ar-cart" key={project.id}>
              <div className="ar-screen">
                <img src={`/${project.image}`} alt={project.title} loading="lazy" />
              </div>
              <p className="ar-cart-no">GAME {index + 1}</p>
              <h3>{project.title}</h3>
              <p className="ar-desc">{project.description}</p>
              <p className="ar-power">{project.technologies.join(' / ')}</p>
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                ▶ PLAY
              </a>
            </article>
          ))}
        </div>
      </section>

      <footer className="ar-foot">
        <p className="ar-heading">— BONUS STAGE —</p>
        <p className="ar-desc">
          <a href={PAPER_URL} target="_blank" rel="noopener noreferrer">CoVeGAT</a> —
          CLAIM VERIFICATION WITH GRAPH ML. 96% DETECTION ACCURACY ON
          ADVERSARIAL FABRICATIONS.
        </p>
        <p className="ar-note">
          MAX BADER · <a href={`mailto:${EMAIL}`}>{EMAIL}</a> · GAME OVER
        </p>
      </footer>
    </div>
  );
};

export default ArcadeWorld;
