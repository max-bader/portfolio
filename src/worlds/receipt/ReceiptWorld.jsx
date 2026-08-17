import React, { useRef } from 'react';
import { gsap, motionContext, useGSAP } from '../../lib/gsap';
import { rolesNewestFirst, totalMonths, peakConcurrent, careerStart, careerEnd } from '../../lib/timeline';
import { projectsData } from '../../data/projects';
import { EMAIL, GITHUB_URL, LINKEDIN_URL, PAPER_URL, RESUME_URL } from '../../lib/links';
import './receipt.css';

/**
 * World: thermal till receipt.
 *
 * One narrow column, monospaced, printed line by line — the whole career as
 * an itemised bill. Months are the line-item quantity and the totals actually
 * add up, so the subtotal is the real sum of everything served.
 */
const ReceiptWorld = () => {
  const root = useRef(null);
  const totalServed = rolesNewestFirst.reduce((sum, role) => sum + role.months, 0);

  useGSAP(
    () => {
      motionContext(root, (context) => {
        if (!context.conditions.motion) return;

        // The printer feeds: each line appears, no easing, top to bottom.
        gsap.from('.rc-line', {
          opacity: 0,
          duration: 0.04,
          ease: 'steps(1)',
          stagger: 0.028
        });

        gsap.from('.rc-paper', {
          clipPath: 'inset(0 0 100% 0)',
          duration: 1.6,
          ease: 'power1.out'
        });

        gsap.utils.toArray('.rc-item').forEach((item) => {
          gsap.from(item, {
            opacity: 0,
            duration: 0.05,
            ease: 'steps(1)',
            scrollTrigger: { trigger: item, start: 'top 92%', once: true }
          });
        });
      });
    },
    { scope: root }
  );

  return (
    <div className="rc" ref={root}>
      <article className="rc-paper">
        <header className="rc-head">
          <p className="rc-line rc-center rc-big">MAX BADER</p>
          <p className="rc-line rc-center">COMPUTER SCIENCE · UC IRVINE</p>
          <p className="rc-line rc-center rc-dim">{careerStart} — {careerEnd}</p>
          <p className="rc-line rc-rule">{'='.repeat(34)}</p>
        </header>

        <section className="rc-items" id="experience">
          <p className="rc-line rc-cols rc-dim">
            <span>ITEM</span>
            <span>QTY</span>
            <span>TRK</span>
          </p>
          <p className="rc-line rc-rule">{'-'.repeat(34)}</p>

          {rolesNewestFirst.map((role) => (
            <div className="rc-item" key={role.id}>
              <p className="rc-line rc-cols">
                <span className="rc-name">
                  <a href={role.url} target="_blank" rel="noopener noreferrer">
                    {role.company.toUpperCase().slice(0, 22)}
                  </a>
                </span>
                <span>{String(role.months).padStart(2, '0')}</span>
                <span>{role.lane + 1}</span>
              </p>
              <p className="rc-line rc-sub">{role.role} · {role.date}</p>
              {role.ongoing && <p className="rc-line rc-flag">** CURRENTLY OPEN **</p>}
              {role.description && (
                <p className="rc-line rc-note">{role.description}</p>
              )}
              {role.skills.length > 0 && (
                <p className="rc-line rc-sub rc-dim">+ {role.skills.join(', ')}</p>
              )}
              <p className="rc-line rc-rule rc-dim">{'.'.repeat(34)}</p>
            </div>
          ))}

          <p className="rc-line rc-cols rc-total">
            <span>SUBTOTAL</span>
            <span>{totalServed}</span>
            <span>MO</span>
          </p>
          <p className="rc-line rc-cols rc-dim">
            <span>SPAN</span>
            <span>{totalMonths}</span>
            <span>MO</span>
          </p>
          <p className="rc-line rc-cols rc-dim">
            <span>PEAK CONCURRENT</span>
            <span>{peakConcurrent}</span>
            <span />
          </p>
          <p className="rc-line rc-rule">{'='.repeat(34)}</p>
        </section>

        <section className="rc-items" id="projects">
          <p className="rc-line rc-center rc-dim">— ALSO PURCHASED —</p>
          {projectsData.map((project, index) => (
            <div className="rc-item" key={project.id}>
              <p className="rc-line rc-cols">
                <span className="rc-name">
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                    {project.title.toUpperCase().slice(0, 22)}
                  </a>
                </span>
                <span>01</span>
                <span>{index + 1}</span>
              </p>
              <img className="rc-shot" src={`/${project.image}`} alt={project.title} loading="lazy" />
              <p className="rc-line rc-note">{project.description}</p>
              <p className="rc-line rc-sub rc-dim">{project.technologies.join(', ')}</p>
              <p className="rc-line rc-rule rc-dim">{'.'.repeat(34)}</p>
            </div>
          ))}
        </section>

        <footer className="rc-foot">
          <p className="rc-line rc-center">PUBLISHED RESEARCH</p>
          <p className="rc-line rc-note">
            <a href={PAPER_URL} target="_blank" rel="noopener noreferrer">COVEGAT</a> —
            CLAIM VERIFICATION, 96% DETECTION ACCURACY ON ADVERSARIAL
            FABRICATIONS.
          </p>
          <p className="rc-line rc-rule">{'='.repeat(34)}</p>
          <p className="rc-line rc-center">
            <a href={`mailto:${EMAIL}`}>{EMAIL.toUpperCase()}</a>
          </p>
          <p className="rc-line rc-center">
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">GITHUB</a>
            {' · '}
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">LINKEDIN</a>
            {' · '}
            <a href={RESUME_URL} target="_blank" rel="noopener noreferrer">RESUME</a>
          </p>
          <p className="rc-line rc-center rc-dim">THANK YOU — PLEASE CALL AGAIN</p>
          <p className="rc-line rc-barcode" aria-hidden="true" />
        </footer>
      </article>
    </div>
  );
};

export default ReceiptWorld;
