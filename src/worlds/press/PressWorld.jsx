import React, { useRef } from 'react';
import { gsap, motionContext, useGSAP } from '../../lib/gsap';
import { rolesNewestFirst, totalMonths, peakConcurrent } from '../../lib/timeline';
import { projectsData } from '../../data/projects';
import { EMAIL, GITHUB_URL, LINKEDIN_URL, PAPER_URL, RESUME_URL } from '../../lib/links';
import './press.css';

/**
 * World: letterpress wood-type poster.
 *
 * Type is set at the scale a poster actually uses — enormous, filling the
 * measure, hyphenated where the line runs out. Motion is the press: each
 * line is struck once, hard, with no easing, because an impression either
 * lands or it does not.
 */
const PressWorld = () => {
  const root = useRef(null);

  useGSAP(
    () => {
      motionContext(root, (context) => {
        if (!context.conditions.motion) return;

        // Each line takes an impression, one after another.
        gsap.from('.pr-strike', {
          opacity: 0,
          scaleY: 1.14,
          transformOrigin: 'center bottom',
          duration: 0.22,
          ease: 'steps(2)',
          stagger: 0.14
        });

        gsap.from('.pr-rule', {
          scaleX: 0,
          transformOrigin: 'left center',
          duration: 0.5,
          ease: 'power2.inOut',
          stagger: 0.1,
          delay: 0.4
        });

        gsap.utils.toArray('.pr-entry').forEach((entry) => {
          gsap.from(entry, {
            opacity: 0,
            y: 20,
            duration: 0.4,
            ease: 'steps(3)',
            scrollTrigger: { trigger: entry, start: 'top 86%', once: true }
          });
        });

        gsap.utils.toArray('.pr-cut').forEach((cut) => {
          gsap.from(cut, {
            opacity: 0,
            scale: 0.96,
            duration: 0.5,
            ease: 'power2.out',
            scrollTrigger: { trigger: cut, start: 'top 84%', once: true }
          });
        });
      });
    },
    { scope: root }
  );

  return (
    <div className="pr" ref={root}>
      <header className="pr-bill">
        <p className="pr-strike pr-overline">Now setting</p>
        <h1 className="pr-display">
          <span className="pr-strike pr-line pr-line-a">MAX</span>
          <span className="pr-strike pr-line pr-line-b">BADER</span>
        </h1>
        <span className="pr-rule" />
        <p className="pr-strike pr-sub">
          Computer Science &middot; UC Irvine &middot; {rolesNewestFirst.length}{' '}
          engagements in {totalMonths} months &middot; {peakConcurrent} at once
        </p>
        <span className="pr-rule" />
        <nav className="pr-strike pr-links">
          <a href={`mailto:${EMAIL}`}>Write</a>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">Source</a>
          <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">Profile</a>
          <a href={RESUME_URL} target="_blank" rel="noopener noreferrer">Résumé</a>
        </nav>
      </header>

      <section className="pr-bill-matter" id="experience">
        <h2 className="pr-heading">The Programme</h2>
        <ol className="pr-entries">
          {rolesNewestFirst.map((role, index) => (
            <li className="pr-entry" key={role.id}>
              <span className="pr-no">{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h3>
                  <a href={role.url} target="_blank" rel="noopener noreferrer">
                    {role.company}
                  </a>
                </h3>
                <p className="pr-meta">
                  {role.role} &middot; {role.date} &middot; {role.months} months
                  {role.ongoing && <em> &middot; now playing</em>}
                </p>
                {role.description && <p className="pr-body">{role.description}</p>}
                {role.skills.length > 0 && (
                  <p className="pr-setting">{role.skills.join(' · ')}</p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="pr-bill-matter" id="projects">
        <h2 className="pr-heading">Cuts &amp; Blocks</h2>
        <div className="pr-cuts">
          {projectsData.map((project, index) => (
            <article className="pr-cut" key={project.id}>
              <p className="pr-no">Blk {String(index + 1).padStart(2, '0')}</p>
              <img src={`/${project.image}`} alt={project.title} loading="lazy" />
              <h3>{project.title}</h3>
              <p className="pr-body">{project.description}</p>
              <p className="pr-setting">{project.technologies.join(' · ')}</p>
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                Proof
              </a>
            </article>
          ))}
        </div>
      </section>

      <footer className="pr-colophon">
        <span className="pr-rule" />
        <p className="pr-heading">Colophon</p>
        <p className="pr-body">
          <a href={PAPER_URL} target="_blank" rel="noopener noreferrer">CoVeGAT</a> —
          claim verification with graph ML. 96% detection accuracy on
          adversarial fabrications.
        </p>
        <p className="pr-setting">
          Max Bader &middot; <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
        </p>
      </footer>
    </div>
  );
};

export default PressWorld;
