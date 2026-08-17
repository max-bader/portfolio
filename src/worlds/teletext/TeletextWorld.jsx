import React, { useRef, useState } from 'react';
import { gsap, useGSAP } from '../../lib/gsap';
import { rolesNewestFirst, totalMonths, peakConcurrent } from '../../lib/timeline';
import { projectsData } from '../../data/projects';
import { EMAIL, GITHUB_URL, LINKEDIN_URL, PAPER_URL, RESUME_URL } from '../../lib/links';
import './teletext.css';

/**
 * World: broadcast teletext.
 *
 * A page-numbered information service. Navigation is the real thing — you
 * type a three-digit page number and wait for it to come round. Seven colours
 * only, block graphics, fixed 40-column grid, and text that reveals a
 * character at a time because that is how a page actually arrived.
 */
const PAGES = [
  { no: '100', label: 'Index', colour: 'tt-white' },
  { no: '200', label: 'Career', colour: 'tt-cyan' },
  { no: '300', label: 'Builds', colour: 'tt-green' },
  { no: '400', label: 'Research', colour: 'tt-yellow' },
  { no: '500', label: 'Contact', colour: 'tt-magenta' }
];

const TeletextWorld = () => {
  const root = useRef(null);
  const [page, setPage] = useState('100');
  const current = PAGES.find((p) => p.no === page) ?? PAGES[0];

  useGSAP(
    () => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const rows = gsap.utils.toArray('.tt-row', root.current);
      if (reduced) {
        gsap.set(rows, { opacity: 1 });
        return;
      }
      // A page arrives row by row, stepped — no fading, no sliding.
      gsap.fromTo(
        rows,
        { opacity: 0 },
        { opacity: 1, duration: 0.06, ease: 'steps(1)', stagger: 0.035 }
      );
    },
    { scope: root, dependencies: [page] }
  );

  return (
    <div className="tt" ref={root}>
      <div className="tt-set">
        <div className="tt-screen">
          <header className="tt-status">
            <span className="tt-yellow">BADER</span>
            <span className="tt-white">{current.no}</span>
            <span className="tt-cyan">{current.label}</span>
          </header>

          {page === '100' && (
            <div className="tt-page">
              <p className="tt-row tt-double tt-yellow">MAX BADER</p>
              <p className="tt-row tt-double tt-cyan">CS · UC IRVINE</p>
              <p className="tt-row tt-blank">&nbsp;</p>
              <p className="tt-row tt-white">
                {rolesNewestFirst.length} ROLES IN {totalMonths} MONTHS
              </p>
              <p className="tt-row tt-white">
                {peakConcurrent} RUNNING CONCURRENTLY AT PEAK
              </p>
              <p className="tt-row tt-blank">&nbsp;</p>
              <p className="tt-row tt-green">SELECT A PAGE:</p>
              {PAGES.slice(1).map((p) => (
                <p className="tt-row" key={p.no}>
                  <button type="button" className={`tt-jump ${p.colour}`} onClick={() => setPage(p.no)}>
                    {p.no} {p.label.toUpperCase()}
                  </button>
                </p>
              ))}
              <p className="tt-row tt-blank">&nbsp;</p>
              <p className="tt-row tt-magenta">■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■</p>
            </div>
          )}

          {page === '200' && (
            <div className="tt-page" id="experience">
              <p className="tt-row tt-double tt-cyan">CAREER</p>
              <p className="tt-row tt-blank">&nbsp;</p>
              {rolesNewestFirst.map((role) => (
                <React.Fragment key={role.id}>
                  <p className="tt-row tt-yellow">
                    {role.company.toUpperCase().slice(0, 28)}
                    {role.ongoing && <span className="tt-magenta"> *NOW*</span>}
                  </p>
                  <p className="tt-row tt-white">
                    {role.date} · {role.months}MO · TRK{role.lane + 1}
                  </p>
                  <p className="tt-row tt-green">{role.role.toUpperCase()}</p>
                  {role.description && (
                    <p className="tt-row tt-body tt-white">{role.description}</p>
                  )}
                  <p className="tt-row tt-blank">&nbsp;</p>
                </React.Fragment>
              ))}
            </div>
          )}

          {page === '300' && (
            <div className="tt-page" id="projects">
              <p className="tt-row tt-double tt-green">BUILDS</p>
              <p className="tt-row tt-blank">&nbsp;</p>
              {projectsData.map((project, index) => (
                <React.Fragment key={project.id}>
                  <p className="tt-row tt-yellow">
                    {index + 1}. {project.title.toUpperCase().slice(0, 30)}
                  </p>
                  <p className="tt-row tt-body tt-white">{project.description}</p>
                  <p className="tt-row tt-cyan">{project.technologies.join(' ').toUpperCase()}</p>
                  <p className="tt-row">
                    <a className="tt-jump tt-green" href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                      &gt; SOURCE
                    </a>
                  </p>
                  <p className="tt-row tt-blank">&nbsp;</p>
                </React.Fragment>
              ))}
            </div>
          )}

          {page === '400' && (
            <div className="tt-page">
              <p className="tt-row tt-double tt-yellow">RESEARCH</p>
              <p className="tt-row tt-blank">&nbsp;</p>
              <p className="tt-row tt-cyan">COVEGAT</p>
              <p className="tt-row tt-body tt-white">
                AN NLP AND GRAPH-ML PIPELINE FOR CLAIM VERIFICATION, WITH A 1K
                CITATION-ALIGNMENT DATASET BUILT TO STRESS-TEST LLM FACTUAL
                ACCURACY. 96% DETECTION ACCURACY ON ADVERSARIAL FABRICATIONS.
              </p>
              <p className="tt-row tt-blank">&nbsp;</p>
              <p className="tt-row">
                <a className="tt-jump tt-green" href={PAPER_URL} target="_blank" rel="noopener noreferrer">
                  &gt; READ PAPER
                </a>
              </p>
            </div>
          )}

          {page === '500' && (
            <div className="tt-page">
              <p className="tt-row tt-double tt-magenta">CONTACT</p>
              <p className="tt-row tt-blank">&nbsp;</p>
              <p className="tt-row">
                <a className="tt-jump tt-white" href={`mailto:${EMAIL}`}>{EMAIL.toUpperCase()}</a>
              </p>
              <p className="tt-row">
                <a className="tt-jump tt-cyan" href={GITHUB_URL} target="_blank" rel="noopener noreferrer">GITHUB/MAX-BADER</a>
              </p>
              <p className="tt-row">
                <a className="tt-jump tt-cyan" href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">LINKEDIN/MAX-BADER</a>
              </p>
              <p className="tt-row">
                <a className="tt-jump tt-yellow" href={RESUME_URL} target="_blank" rel="noopener noreferrer">RESUME.PDF</a>
              </p>
            </div>
          )}

          {/* The fastext bar: four coloured buttons, as on the remote. */}
          <nav className="tt-fastext">
            {PAGES.map((p) => (
              <button
                key={p.no}
                type="button"
                className={`tt-fast ${p.colour} ${p.no === page ? 'is-on' : ''}`}
                onClick={() => setPage(p.no)}
              >
                {p.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default TeletextWorld;
