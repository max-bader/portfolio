import React, { useRef } from 'react';
import { gsap, motionContext, useGSAP } from '../../lib/gsap';
import {
  roles,
  rolesNewestFirst,
  laneCount,
  totalMonths,
  careerStart,
  careerEnd,
  peakConcurrent
} from '../../lib/timeline';
import { projectsData } from '../../data/projects';
import { EMAIL, GITHUB_URL, LINKEDIN_URL, PAPER_URL, RESUME_URL } from '../../lib/links';
import './draft.css';

const ZONES = ['A', 'B', 'C', 'D'];

/**
 * World: cyanotype engineering drawing.
 *
 * A career rendered as a drafting sheet — sheet frame, dimensioned timeline,
 * revision block, detail callouts, title block. Every measurement on the page
 * is computed from the real dates in experience.js, so the drawing cannot
 * drift from the résumé, and the motion is a plotter laying down ink.
 */
const DraftWorld = () => {
  const root = useRef(null);

  useGSAP(
    () => {
      motionContext(root, (context) => {
        if (!context.conditions.motion) return;

        // Plotter pass: the sheet frame inks itself, then the title block.
        const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });

        tl.from('.dw-frame-h', { scaleX: 0, duration: 1.1, stagger: 0.08 }, 0)
          .from('.dw-frame-v', { scaleY: 0, duration: 1.1, stagger: 0.08 }, 0.15)
          .from('.dw-zone', { opacity: 0, duration: 0.4, stagger: 0.03 }, 0.4)
          .from('.dw-titleblock-row', { opacity: 0, x: -8, duration: 0.4, stagger: 0.06 }, 0.5)
          .from('.dw-name-word', { opacity: 0, y: 28, duration: 0.7, stagger: 0.09, ease: 'power3.out' }, 0.25)
          .from('.dw-lede', { opacity: 0, y: 12, duration: 0.6 }, 0.7)
          .from('.dw-portrait', { opacity: 0, scale: 0.94, duration: 0.9, ease: 'power3.out' }, 0.45)
          .from('.dw-portrait-leader', { scaleX: 0, transformOrigin: 'left center', duration: 0.5 }, 0.9)
          .from('.dw-portrait-note', { opacity: 0, duration: 0.4 }, 1.2);

        // Duration bars grow to the width their real dates dictate.
        gsap.utils.toArray('.dw-bar').forEach((bar) => {
          gsap.from(bar, {
            scaleX: 0,
            transformOrigin: 'left center',
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: { trigger: '.dw-chart', start: 'top 78%', once: true },
            delay: Number(bar.dataset.order) * 0.08
          });
        });

        gsap.from('.dw-gridline', {
          scaleY: 0,
          transformOrigin: 'top center',
          duration: 0.6,
          stagger: 0.04,
          scrollTrigger: { trigger: '.dw-chart', start: 'top 82%', once: true }
        });

        gsap.from('.dw-rev-row', {
          opacity: 0,
          x: -14,
          duration: 0.5,
          stagger: 0.07,
          scrollTrigger: { trigger: '.dw-revblock', start: 'top 76%', once: true }
        });

        // Each detail view draws its leader line, then the plate arrives.
        gsap.utils.toArray('.dw-detail').forEach((detail) => {
          gsap
            .timeline({
              scrollTrigger: { trigger: detail, start: 'top 72%', once: true }
            })
            .from(detail.querySelector('.dw-detail-marker'), {
              scale: 0,
              duration: 0.4,
              ease: 'back.out(2)'
            })
            .from(
              detail.querySelector('.dw-detail-leader'),
              { scaleX: 0, transformOrigin: 'left center', duration: 0.45 },
              '-=0.15'
            )
            .from(
              detail.querySelector('.dw-plate'),
              { opacity: 0, y: 20, duration: 0.7, ease: 'power3.out' },
              '-=0.2'
            )
            .from(
              detail.querySelectorAll('.dw-spec li'),
              { opacity: 0, x: -8, duration: 0.3, stagger: 0.04 },
              '-=0.4'
            );
        });
      });
    },
    { scope: root }
  );

  return (
    <div className="dw" ref={root}>
      {/* Sheet frame: the drawing's own border, drawn edge by edge. */}
      <div className="dw-frame" aria-hidden="true">
        <span className="dw-frame-h dw-frame-top" />
        <span className="dw-frame-h dw-frame-bottom" />
        <span className="dw-frame-v dw-frame-left" />
        <span className="dw-frame-v dw-frame-right" />
      </div>

      <div className="dw-zones" aria-hidden="true">
        {ZONES.map((zone) => (
          <span className="dw-zone" key={zone}>{zone}</span>
        ))}
      </div>

      <header className="dw-hero">
        <div className="dw-hero-text">
          <p className="dw-lede dw-eyebrow">Drawing 01 — Subject</p>
          <h1 className="dw-name">
            <span className="dw-name-word">MAX</span>{' '}
            <span className="dw-name-word">BADER</span>
          </h1>
          <p className="dw-lede dw-subtitle">
            Computer Science, University of California, Irvine
          </p>
          <p className="dw-lede dw-claim">
            <strong>{totalMonths} months</strong> · <strong>{roles.length} roles</strong> ·{' '}
            <strong>{peakConcurrent} running at once</strong>
          </p>
          <ul className="dw-lede dw-links">
            <li><a href={`mailto:${EMAIL}`}>{EMAIL}</a></li>
            <li><a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">github/max-bader</a></li>
            <li><a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">linkedin/max-bader</a></li>
            <li><a href={RESUME_URL} target="_blank" rel="noopener noreferrer">résumé.pdf</a></li>
          </ul>
        </div>

        <figure className="dw-portrait-wrap">
          <div className="dw-portrait">
            <img src="/IMG_5553 copy.png" alt="Max Bader" />
          </div>
          <span className="dw-portrait-leader" aria-hidden="true" />
          <figcaption className="dw-portrait-note">
            <span className="dw-portrait-note-key">DETAIL A</span>
            Subject, scale 1:1
          </figcaption>
        </figure>
      </header>

      {/* The centrepiece: six roles in packed lanes, so overlap is visible. */}
      <section className="dw-chart" id="experience">
        <div className="dw-section-head">
          <h2>Occupancy diagram</h2>
          <p>
            {careerStart} – {careerEnd}. Bars are drawn to length from the dates
            in each role; {laneCount} lanes because that many ran concurrently.
          </p>
        </div>

        <div className="dw-chart-body" style={{ '--lanes': laneCount }}>
          <div className="dw-gridlines" aria-hidden="true">
            {Array.from({ length: 7 }).map((_, i) => (
              <span className="dw-gridline" key={i} style={{ left: `${(i / 6) * 100}%` }} />
            ))}
          </div>

          {roles.map((role, index) => (
            <div
              className={`dw-bar ${role.ongoing ? 'is-ongoing' : ''}`}
              key={role.id}
              data-order={index}
              style={{
                left: `${role.offset * 100}%`,
                width: `${role.extent * 100}%`,
                top: `${role.lane * 3.4}rem`
              }}
            >
              <span className="dw-bar-fill" />
              <span className="dw-bar-label">
                {role.company}
                <em>{role.months} mo</em>
              </span>
            </div>
          ))}
        </div>

        <div className="dw-chart-axis" aria-hidden="true">
          <span>{careerStart}</span>
          <span>{careerEnd}</span>
        </div>
      </section>

      {/* Revision block: the drafting table that already exists for this job. */}
      <section className="dw-revblock">
        <div className="dw-section-head">
          <h2>Revision block</h2>
          <p>Six entries, newest first.</p>
        </div>

        <div className="dw-rev-table" role="table">
          <div className="dw-rev-head" role="row">
            <span role="columnheader">Rev</span>
            <span role="columnheader">Dates</span>
            <span role="columnheader">Role</span>
            <span role="columnheader">Description</span>
          </div>

          {rolesNewestFirst.map((role, index) => (
            <article className="dw-rev-row" role="row" key={role.id}>
              <span className="dw-rev-no" role="cell">
                {String(rolesNewestFirst.length - index).padStart(2, '0')}
              </span>
              <span className="dw-rev-date" role="cell">
                {role.date}
                {role.ongoing && <em className="dw-current">current</em>}
              </span>
              <span className="dw-rev-role" role="cell">
                <a href={role.url} target="_blank" rel="noopener noreferrer">
                  {role.company}
                </a>
                <em>{role.role}</em>
              </span>
              <span className="dw-rev-desc" role="cell">
                {role.description || (
                  <span className="dw-pending">Description pending — role in progress.</span>
                )}
                {role.skills.length > 0 && (
                  <span className="dw-rev-tech">{role.skills.join(' · ')}</span>
                )}
              </span>
            </article>
          ))}
        </div>
      </section>

      {/* Projects as detail views, each with its own callout marker. */}
      <section className="dw-details" id="projects">
        <div className="dw-section-head">
          <h2>Detail views</h2>
          <p>Four built things, drawn at working scale.</p>
        </div>

        {projectsData.map((project, index) => (
          <article className="dw-detail" key={project.id}>
            <div className="dw-detail-callout">
              <span className="dw-detail-marker">{String(index + 1).padStart(2, '0')}</span>
              <span className="dw-detail-leader" aria-hidden="true" />
            </div>

            <div className="dw-detail-body">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <ul className="dw-spec">
                {project.technologies.map((tech) => (
                  <li key={tech}>{tech}</li>
                ))}
              </ul>
              <a
                className="dw-detail-link"
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Source →
              </a>
            </div>

            <figure className="dw-plate">
              <img src={`/${project.image}`} alt={project.title} loading="lazy" />
            </figure>
          </article>
        ))}
      </section>

      {/* Title block: where a real drawing puts its metadata. */}
      <footer className="dw-titleblock">
        <div className="dw-titleblock-grid">
          <div className="dw-titleblock-row dw-titleblock-main">
            <span className="dw-tb-key">Drawn by</span>
            <span className="dw-tb-val">Max Bader</span>
          </div>
          <div className="dw-titleblock-row">
            <span className="dw-tb-key">Paper</span>
            <span className="dw-tb-val">
              <a href={PAPER_URL} target="_blank" rel="noopener noreferrer">
                CoVeGAT — claim verification
              </a>
            </span>
          </div>
          <div className="dw-titleblock-row">
            <span className="dw-tb-key">Contact</span>
            <span className="dw-tb-val">
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            </span>
          </div>
          <div className="dw-titleblock-row">
            <span className="dw-tb-key">Sheet</span>
            <span className="dw-tb-val">01 of 01 · scale 1:1 · rev {roles.length}</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DraftWorld;
