import React, { useRef } from 'react';
import { stagger, createTimeline } from 'animejs';
import { useGSAP } from '../../lib/gsap';
import { rolesNewestFirst, totalMonths, peakConcurrent, careerStart, careerEnd } from '../../lib/timeline';
import { projectsData } from '../../data/projects';
import { EMAIL, GITHUB_URL, LINKEDIN_URL, PAPER_URL, RESUME_URL } from '../../lib/links';
import './ticket.css';

/**
 * World: airline itinerary. Animated with anime.js.
 *
 * Each role is a boarding pass with a perforated stub. Concurrency shows up
 * the way it does on a real multi-city itinerary — overlapping segments,
 * flagged as such. Motion is the document being issued: the pass slides from
 * the printer, then the stub tears along the perforation.
 */
const codeFor = (company) =>
  company
    .replace(/[^A-Za-z ]/g, '')
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .concat(company.replace(/[^A-Za-z]/g, ''))
    .toUpperCase()
    .slice(0, 3);

const TicketWorld = () => {
  const root = useRef(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduced) return;

      createTimeline({ defaults: { ease: 'out(3)' } })
        .add(root.current.querySelectorAll('.tk-header > *'), {
          opacity: [0, 1],
          y: [-12, 0],
          duration: 520,
          delay: stagger(70)
        })
        .add(
          root.current.querySelectorAll('.tk-pass'),
          { opacity: [0, 1], x: [-40, 0], duration: 640, delay: stagger(110) },
          '-=200'
        )
        .add(
          root.current.querySelectorAll('.tk-stub'),
          { opacity: [0, 1], rotate: [-3, 0], duration: 460, delay: stagger(110) },
          '-=700'
        );
    },
    { scope: root }
  );

  return (
    <div className="tk" ref={root}>
      <header className="tk-header">
        <p className="tk-carrier">BADER AIR · ITINERARY / RECEIPT</p>
        <h1>MAX BADER</h1>
        <p className="tk-route">
          {careerStart} <span aria-hidden="true">→</span> {careerEnd} ·{' '}
          {rolesNewestFirst.length} segments · {totalMonths} months ·{' '}
          {peakConcurrent} overlapping
        </p>
        <nav className="tk-links">
          <a href={`mailto:${EMAIL}`}>Contact</a>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href={RESUME_URL} target="_blank" rel="noopener noreferrer">Résumé</a>
        </nav>
      </header>

      <section className="tk-passes" id="experience">
        {rolesNewestFirst.map((role, index) => (
          <article className={`tk-pass ${role.ongoing ? 'is-boarding' : ''}`} key={role.id}>
            <div className="tk-main">
              <div className="tk-row tk-row-top">
                <span className="tk-field">
                  <em>Passenger</em>
                  Max Bader
                </span>
                <span className="tk-field">
                  <em>Segment</em>
                  {String(index + 1).padStart(2, '0')} of {rolesNewestFirst.length}
                </span>
                <span className="tk-field tk-status">
                  <em>Status</em>
                  {role.ongoing ? 'Boarding' : 'Flown'}
                </span>
              </div>

              <div className="tk-row tk-row-main">
                <span className="tk-code">{codeFor(role.company)}</span>
                <span className="tk-arrow" aria-hidden="true">✈</span>
                <span className="tk-dest">
                  <a href={role.url} target="_blank" rel="noopener noreferrer">
                    {role.company}
                  </a>
                  <em>{role.role}</em>
                </span>
              </div>

              {role.description && <p className="tk-note">{role.description}</p>}

              {role.skills.length > 0 && (
                <p className="tk-baggage">Carrying: {role.skills.join(' · ')}</p>
              )}
            </div>

            {/* Perforation, then the stub the gate keeps. */}
            <div className="tk-perf" aria-hidden="true" />

            <div className="tk-stub">
              <span className="tk-field">
                <em>Dates</em>
                {role.date}
              </span>
              <span className="tk-field">
                <em>Duration</em>
                {role.months} mo
              </span>
              <span className="tk-field">
                <em>Track</em>
                {role.lane + 1}
              </span>
              <span className="tk-barcode" aria-hidden="true" />
            </div>
          </article>
        ))}
      </section>

      <section className="tk-baggage-claim" id="projects">
        <h2 className="tk-section">Baggage claim — things built</h2>
        <div className="tk-claim-grid">
          {projectsData.map((project, index) => (
            <article className="tk-tag" key={project.id}>
              <p className="tk-tag-no">TAG {String(index + 1).padStart(4, '0')}</p>
              <img src={`/${project.image}`} alt={project.title} loading="lazy" />
              <h3>{project.title}</h3>
              <p className="tk-note">{project.description}</p>
              <p className="tk-baggage">{project.technologies.join(' · ')}</p>
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                Track item
              </a>
            </article>
          ))}
        </div>
      </section>

      <footer className="tk-foot">
        <p className="tk-carrier">Declared items</p>
        <p className="tk-note">
          <a href={PAPER_URL} target="_blank" rel="noopener noreferrer">CoVeGAT</a> —
          claim verification with graph ML. 96% detection accuracy on
          adversarial fabrications.
        </p>
        <p className="tk-carrier">
          MAX BADER · <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
        </p>
      </footer>
    </div>
  );
};

export default TicketWorld;
