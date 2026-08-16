import React, { useRef } from 'react';
import { gsap, motionContext, useGSAP } from '../../lib/gsap';
import { rolesNewestFirst, laneCount, totalMonths, peakConcurrent } from '../../lib/timeline';
import { projectsData } from '../../data/projects';
import { EMAIL, GITHUB_URL, LINKEDIN_URL, PAPER_URL, RESUME_URL } from '../../lib/links';
import './pcb.css';

/**
 * World: printed circuit board silkscreen.
 *
 * Roles are components with reference designators; copper traces route between
 * them at the 45-degree angles a real autorouter is constrained to. The motion
 * is fabrication order — traces route, then pads tin, then silkscreen prints.
 */
const PcbWorld = () => {
  const root = useRef(null);

  useGSAP(
    () => {
      motionContext(root, (context) => {
        if (!context.conditions.motion) return;

        // Copper is laid down first, the way a board is actually made.
        const traces = root.current.querySelectorAll('.pb-trace');
        traces.forEach((trace) => {
          const length = trace.getTotalLength();
          gsap.set(trace, { strokeDasharray: length, strokeDashoffset: length });
        });

        gsap
          .timeline({ defaults: { ease: 'none' } })
          .to(traces, { strokeDashoffset: 0, duration: 1.4, stagger: 0.09 })
          .from('.pb-pad', { scale: 0, duration: 0.35, stagger: 0.05, ease: 'back.out(2)' }, '-=0.9')
          .from('.pb-silk > *', { opacity: 0, y: 10, duration: 0.5, stagger: 0.07, ease: 'power2.out' }, '-=0.8');

        gsap.utils.toArray('.pb-part').forEach((part) => {
          gsap.from(part, {
            opacity: 0,
            y: 22,
            duration: 0.6,
            ease: 'power3.out',
            scrollTrigger: { trigger: part, start: 'top 84%', once: true }
          });
        });

        gsap.utils.toArray('.pb-module').forEach((module) => {
          gsap.from(module, {
            opacity: 0,
            scale: 0.97,
            duration: 0.6,
            ease: 'power3.out',
            scrollTrigger: { trigger: module, start: 'top 82%', once: true }
          });
        });
      });
    },
    { scope: root }
  );

  return (
    <div className="pb" ref={root}>
      <header className="pb-head">
        {/* Copper routing behind the title block. */}
        <svg className="pb-routing" viewBox="0 0 900 260" aria-hidden="true" preserveAspectRatio="none">
          {[
            'M 20 40 L 180 40 L 220 80 L 620 80',
            'M 20 110 L 300 110 L 340 150 L 700 150',
            'M 20 180 L 140 180 L 180 140 L 560 140 L 600 180 L 860 180',
            'M 20 230 L 420 230 L 460 190 L 800 190'
          ].map((d, i) => (
            <path key={i} className="pb-trace" d={d} fill="none" strokeWidth="3" />
          ))}
          {[[180, 40], [340, 150], [600, 180], [460, 190], [700, 150]].map(([cx, cy], i) => (
            <circle key={i} className="pb-pad" cx={cx} cy={cy} r="7" />
          ))}
        </svg>

        <div className="pb-silk">
          <p className="pb-desig">REV {rolesNewestFirst.length}.0 · 2-LAYER · {laneCount} NETS</p>
          <h1>MAX BADER</h1>
          <p className="pb-sub">
            Computer Science, UC Irvine — {rolesNewestFirst.length} components,{' '}
            {totalMonths} months, {peakConcurrent} nets driven concurrently.
          </p>
          <nav className="pb-links">
            <a href={`mailto:${EMAIL}`}>EMAIL</a>
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">GITHUB</a>
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">LINKEDIN</a>
            <a href={RESUME_URL} target="_blank" rel="noopener noreferrer">DATASHEET</a>
          </nav>
        </div>
      </header>

      <section className="pb-bom" id="experience">
        <h2 className="pb-section">Bill of materials</h2>

        {rolesNewestFirst.map((role, index) => (
          <article className="pb-part" key={role.id}>
            <div className="pb-part-ref">
              <span className="pb-ref">U{index + 1}</span>
              <span className="pb-net">NET {role.lane + 1}</span>
            </div>
            <div className="pb-part-body">
              <h3>
                <a href={role.url} target="_blank" rel="noopener noreferrer">
                  {role.company}
                </a>
                {role.ongoing && <span className="pb-powered">powered</span>}
              </h3>
              <p className="pb-part-meta">
                {role.role} — {role.date} — {role.months} mo
              </p>
              {role.description && <p className="pb-part-desc">{role.description}</p>}
              {role.skills.length > 0 && (
                <ul className="pb-pins">
                  {role.skills.map((skill) => (
                    <li key={skill}>{skill}</li>
                  ))}
                </ul>
              )}
            </div>
          </article>
        ))}
      </section>

      <section className="pb-modules" id="projects">
        <h2 className="pb-section">Daughterboards</h2>
        <div className="pb-module-grid">
          {projectsData.map((project, index) => (
            <article className="pb-module" key={project.id}>
              <p className="pb-module-ref">J{index + 1}</p>
              <img src={`/${project.image}`} alt={project.title} loading="lazy" />
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <ul className="pb-pins">
                {project.technologies.map((tech) => (
                  <li key={tech}>{tech}</li>
                ))}
              </ul>
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                SOURCE →
              </a>
            </article>
          ))}
        </div>
      </section>

      <footer className="pb-foot">
        <p className="pb-desig">Appendix</p>
        <p>
          <a href={PAPER_URL} target="_blank" rel="noopener noreferrer">CoVeGAT</a> —
          claim verification with graph ML, 96% detection accuracy on adversarial
          fabrications.
        </p>
        <p className="pb-desig">
          MAX BADER · <a href={`mailto:${EMAIL}`}>{EMAIL}</a> · MADE IN IRVINE, CA
        </p>
      </footer>
    </div>
  );
};

export default PcbWorld;
