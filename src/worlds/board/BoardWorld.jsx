import React, { useRef } from 'react';
import { gsap, motionContext, useGSAP } from '../../lib/gsap';
import { rolesNewestFirst, totalMonths, peakConcurrent } from '../../lib/timeline';
import { projectsData } from '../../data/projects';
import { EMAIL, GITHUB_URL, LINKEDIN_URL, PAPER_URL, RESUME_URL } from '../../lib/links';
import SplitFlap from './SplitFlap';
import './board.css';

/**
 * World: rail concourse split-flap board.
 *
 * Six roles as six departures. The board's own grammar does the work — ruled
 * rows, fixed cells, amber lamps for what is running now — and the flap
 * cascade is the motion the object actually has in life.
 */
const BoardWorld = () => {
  const root = useRef(null);

  useGSAP(
    () => {
      motionContext(root, (context) => {
        if (!context.conditions.motion) return;

        gsap
          .timeline({ defaults: { ease: 'power3.out' } })
          .from('.bw-frame', { opacity: 0, y: -14, duration: 0.7 })
          .from('.bw-clock', { opacity: 0, duration: 0.5 }, 0.3)
          .from('.bw-standfirst', { opacity: 0, y: 12, duration: 0.6 }, 0.45);

        gsap.utils.toArray('.bw-row').forEach((row, index) => {
          gsap.from(row, {
            opacity: 0,
            duration: 0.35,
            delay: index * 0.05,
            scrollTrigger: { trigger: '.bw-board', start: 'top 82%', once: true }
          });
        });

        gsap.from('.bw-lamp.is-live', {
          opacity: 0.15,
          duration: 0.9,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          scrollTrigger: { trigger: '.bw-board', start: 'top 85%' }
        });

        gsap.utils.toArray('.bw-service').forEach((service) => {
          gsap.from(service, {
            opacity: 0,
            y: 24,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: { trigger: service, start: 'top 80%', once: true }
          });
        });
      });
    },
    { scope: root }
  );

  return (
    <div className="bw" ref={root}>
      <header className="bw-head">
        <div className="bw-frame">
          <p className="bw-frame-label">Departures</p>
          <h1 className="bw-title">
            <SplitFlap text="MAX BADER" className="sf-display" start="top 95%" />
          </h1>
          <p className="bw-clock">
            <span className="bw-clock-dot" />
            {totalMonths} months on the board · {peakConcurrent} services running at once
          </p>
        </div>

        <p className="bw-standfirst">
          Computer Science at UC Irvine. Six roles across product engineering and
          AI research, several of them concurrent.
        </p>

        <nav className="bw-links">
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href={RESUME_URL} target="_blank" rel="noopener noreferrer">Résumé</a>
        </nav>
      </header>

      <section className="bw-board" id="experience">
        <div className="bw-board-head" aria-hidden="true">
          <span>Time</span>
          <span>Destination</span>
          <span>Service</span>
          <span>Status</span>
        </div>

        {rolesNewestFirst.map((role) => (
          <article className="bw-row" key={role.id}>
            <span className="bw-time">{role.date}</span>

            <span className="bw-dest">
              <a href={role.url} target="_blank" rel="noopener noreferrer">
                <SplitFlap text={role.company.slice(0, 22)} className="sf-row" />
              </a>
              {role.description && <span className="bw-note">{role.description}</span>}
              {role.skills.length > 0 && (
                <span className="bw-calling">
                  calling at {role.skills.join(', ')}
                </span>
              )}
            </span>

            <span className="bw-service-name">{role.role}</span>

            <span className={`bw-status ${role.ongoing ? 'is-live' : ''}`}>
              <span className={`bw-lamp ${role.ongoing ? 'is-live' : ''}`} />
              {role.ongoing ? 'Running' : 'Arrived'}
              <em>{role.months} mo</em>
            </span>
          </article>
        ))}
      </section>

      <section className="bw-services" id="projects">
        <h2 className="bw-section-title">
          <SplitFlap text="BUILT" className="sf-section" />
        </h2>

        <div className="bw-service-grid">
          {projectsData.map((project) => (
            <article className="bw-service" key={project.id}>
              <figure>
                <img src={`/${project.image}`} alt={project.title} loading="lazy" />
              </figure>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <p className="bw-service-tech">{project.technologies.join(' · ')}</p>
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                Source
              </a>
            </article>
          ))}
        </div>
      </section>

      <footer className="bw-foot">
        <p className="bw-foot-paper">
          <span className="bw-foot-key">Published research</span>
          <a href={PAPER_URL} target="_blank" rel="noopener noreferrer">
            CoVeGAT — claim verification, 96% detection accuracy
          </a>
        </p>
        <p className="bw-foot-sign">
          Max Bader · <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
        </p>
      </footer>
    </div>
  );
};

export default BoardWorld;
