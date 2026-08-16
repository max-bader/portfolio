import React, { useRef } from 'react';
import SpotlightCard from './SpotlightCard';
import { gsap, motionContext, SplitText, useGSAP } from '../lib/gsap';

const ExperienceCard = ({ job }) => {
  const ref = useRef(null);

  useGSAP(
    () => {
      motionContext(ref, (context) => {
        if (!context.conditions.motion) return;

        // The timeline spine draws itself as the card passes through view.
        gsap.fromTo(
          ref.current.querySelector('.card-spine'),
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: ref.current,
              start: 'top 82%',
              end: 'bottom 65%',
              scrub: 0.6
            }
          }
        );

        // Company name arrives word by word.
        const split = new SplitText(ref.current.querySelector('.experience-company-title h4'), {
          type: 'words',
          wordsClass: 'split-word'
        });

        gsap.from(split.words, {
          opacity: 0,
          y: 18,
          rotateX: -60,
          duration: 0.6,
          stagger: 0.06,
          ease: 'back.out(1.6)',
          scrollTrigger: { trigger: ref.current, start: 'top 78%', once: true }
        });

        gsap.from(ref.current.querySelectorAll('.skill-item'), {
          opacity: 0,
          y: 12,
          scale: 0.94,
          duration: 0.4,
          stagger: 0.03,
          ease: 'power2.out',
          scrollTrigger: { trigger: ref.current, start: 'top 65%', once: true }
        });

        return () => split.revert();
      });
    },
    { scope: ref }
  );

  return (
    <SpotlightCard className="experience-card">
      <span className="card-spine" aria-hidden="true" />
      <div className="experience-card-content" ref={ref}>
        <a
          href={job.url}
          target="_blank"
          rel="noopener noreferrer"
          className="experience-logo"
          aria-label={job.company}
        >
          <img src={job.logo} alt={`${job.company} Logo`} loading="lazy" />
        </a>
        <div className="experience-details">
          <div className="experience-header">
            <div className="experience-company-title">
              <h4>{job.company}</h4>
              <h3>{job.role}</h3>
            </div>
            <span className="experience-date">{job.date}</span>
          </div>

          {job.description && (
            <div className="experience-description">
              <p>{job.description}</p>
            </div>
          )}

          {job.skills.length > 0 && (
            <div className="research-skills">
              <h5>{job.skillsLabel}</h5>
              <div className="skills-list">
                {job.skills.map((skill) => (
                  <span key={skill} className="skill-item">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {job.actions && (
            <div className="paper-actions">
              {job.actions.map((action) => (
                <a
                  key={action.label}
                  href={action.href}
                  className={`btn ${action.variant}`}
                  {...(action.download ? { download: true } : {})}
                  {...(action.newTab
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                >
                  {action.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </SpotlightCard>
  );
};

export default ExperienceCard;
