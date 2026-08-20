import React, { useRef } from 'react';
import { gsap, motionContext, useGSAP } from '../../lib/gsap';
import { rolesNewestFirst } from '../../lib/timeline';
import { projectsData } from '../../data/projects';
import { EMAIL, GITHUB_URL, LINKEDIN_URL, PAPER_URL, RESUME_URL } from '../../lib/links';
import './refined.css';

/**
 * World: refined.
 *
 * Restraint by subtraction, not by shrinking. Type is large and high
 * contrast; the discipline is in how few things are on the page and how much
 * air surrounds them. One typeface, one accent, one shadow, no boxes.
 *
 * Motion follows Emil Kowalski's rules: short, ease-out, small distances,
 * blur resolving to sharp.
 */

const ENTER = { duration: 0.45, ease: 'power2.out' };

/* Inline icons: one 1.5px stroke, one 20px box, no icon font. */
const Icon = ({ path, label }) => (
  <svg
    className="rf-icon"
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={label ? undefined : 'true'}
    role={label ? 'img' : undefined}
  >
    {label && <title>{label}</title>}
    {path}
  </svg>
);

const ICONS = {
  mail: <><rect x="2.5" y="4.5" width="15" height="11" rx="2" /><path d="m3 6 7 5 7-5" /></>,
  github: <path d="M7.5 16.5c-3.5 1-3.5-1.8-5-2.2m10 4.2v-2.8c0-.8-.2-1.4-.7-1.8 2.3-.3 4.7-1.1 4.7-5a3.9 3.9 0 0 0-1-2.7 3.6 3.6 0 0 0-.1-2.7s-.9-.3-2.9 1a10 10 0 0 0-5 0C5.5 3.2 4.6 3.5 4.6 3.5a3.6 3.6 0 0 0-.1 2.7 3.9 3.9 0 0 0-1 2.7c0 3.9 2.4 4.7 4.7 5-.3.3-.6.8-.7 1.5v3.1" />,
  linkedin: <><rect x="3" y="3" width="14" height="14" rx="2.5" /><path d="M6.5 8.5v5M6.5 6v.01M10 13.5v-3a1.8 1.8 0 0 1 3.5 0v3" /></>,
  doc: <><path d="M11.5 2.5H6a1.5 1.5 0 0 0-1.5 1.5v12A1.5 1.5 0 0 0 6 17.5h8a1.5 1.5 0 0 0 1.5-1.5V6.5z" /><path d="M11.5 2.5v4h4" /></>,
  arrow: <path d="M4.5 10h11M11 5.5 15.5 10 11 14.5" />
};

const RefinedWorld = () => {
  const root = useRef(null);

  useGSAP(
    () => {
      motionContext(root, (context) => {
        if (!context.conditions.motion) return;

        gsap.from('.rf-enter', {
          opacity: 0,
          y: 10,
          filter: 'blur(6px)',
          stagger: 0.06,
          ...ENTER
        });

        gsap.utils.toArray('.rf-reveal').forEach((el) => {
          gsap.from(el, {
            opacity: 0,
            y: 12,
            filter: 'blur(6px)',
            ...ENTER,
            scrollTrigger: { trigger: el, start: 'top 92%', once: true }
          });
        });
      });
    },
    { scope: root }
  );

  return (
    <div className="rf" ref={root}>
      {/* Identity: the portrait carries the top, not a slogan. */}
      <header className="rf-open">
        <img className="rf-avatar rf-enter" src="/IMG_5553 copy.png" alt="Max Bader" />
        <h1 className="rf-enter">Max Bader</h1>
        <p className="rf-standfirst rf-enter">
          Computer Science at UC Irvine.
        </p>

        <nav className="rf-actions rf-enter">
          <a className="rf-action" href={`mailto:${EMAIL}`}>
            <Icon path={ICONS.mail} />
            <span>Get in touch</span>
          </a>
          <a className="rf-action" href={RESUME_URL} target="_blank" rel="noopener noreferrer">
            <Icon path={ICONS.doc} />
            <span>Resume</span>
          </a>
          <a className="rf-action" href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
            <Icon path={ICONS.github} />
            <span>GitHub</span>
          </a>
        </nav>
      </header>

      {/* Experience as a set CV: year, then the fact. */}
      <section className="rf-cv" id="experience">
        <h2 className="rf-reveal">Experience</h2>

        <ol>
          {rolesNewestFirst.map((role) => (
            <li className="rf-entry rf-reveal" key={role.id}>
              <span className="rf-when">
                <span className="rf-dates">
                  {role.date}
                  {role.ongoing && <em>Now</em>}
                </span>
              </span>
              <div className="rf-what">
                <h3>
                  <a href={role.url} target="_blank" rel="noopener noreferrer">
                    {role.company}
                  </a>
                  <img className="rf-mark" src={role.logo} alt="" loading="lazy" />
                </h3>
                <p className="rf-title-line">{role.role}</p>
                {role.description && <p className="rf-note">{role.description}</p>}
                {role.skills.length > 0 && (
                  <p className="rf-stack">{role.skills.join('  ·  ')}</p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Work first — the images are the argument. */}
      <section className="rf-work" id="projects">
        <h2 className="rf-reveal">Selected work</h2>

        {projectsData.map((project, index) => (
          <a
            className="rf-piece rf-reveal"
            key={project.id}
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <figure className="rf-shot">
              <img src={`/${project.image}`} alt="" loading="lazy" />
            </figure>
            <div className="rf-piece-text">
              <span className="rf-num">{String(index + 1).padStart(2, '0')}</span>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <span className="rf-stack">{project.technologies.slice(0, 5).join('  ·  ')}</span>
              <span className="rf-go">
                View source
                <Icon path={ICONS.arrow} />
              </span>
            </div>
          </a>
        ))}
      </section>

      <section className="rf-cv">
        <h2 className="rf-reveal">Research</h2>
        <ol>
          <li className="rf-entry rf-reveal">
            <span className="rf-when">First author</span>
            <div className="rf-what">
              <h3>
                <a href={PAPER_URL} target="_blank" rel="noopener noreferrer">CoVeGAT</a>
              </h3>
              <p className="rf-title-line">Claim verification with graph ML</p>
              <p className="rf-note">
                An NLP and graph-ML pipeline with a 1K citation-alignment dataset
                built to stress-test factual accuracy in large language models.
                96% detection accuracy on adversarial fabrications.
              </p>
            </div>
          </li>
        </ol>
      </section>

      <footer className="rf-close rf-reveal">
        <h2>Let&rsquo;s talk.</h2>
        <a className="rf-mail" href={`mailto:${EMAIL}`}>{EMAIL}</a>
        <nav className="rf-social">
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
            <Icon path={ICONS.github} label="GitHub" />
          </a>
          <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
            <Icon path={ICONS.linkedin} label="LinkedIn" />
          </a>
          <a href={RESUME_URL} target="_blank" rel="noopener noreferrer">
            <Icon path={ICONS.doc} label="Resume" />
          </a>
        </nav>
      </footer>
    </div>
  );
};

export default RefinedWorld;
