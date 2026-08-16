import React, { useRef } from 'react';
import SpotlightCard from './SpotlightCard';
import { gsap, motionContext, SplitText, useGSAP } from '../lib/gsap';
import '../assets/styles/ProjectCard.css';

const ProjectCard = ({ project, index = 0 }) => {
  const { title, description, image, technologies, liveUrl, githubUrl } = project;
  const ref = useRef(null);

  // Every other row puts the screenshot on the left instead of the right.
  const reversed = index % 2 === 1;

  useGSAP(
    () => {
      motionContext(ref, (context) => {
        if (!context.conditions.motion) return;

        const frame = ref.current.querySelector('.project-image');
        const img = frame.querySelector('img');

        // The screenshot drifts against the page as the row passes.
        if (img) {
          gsap.fromTo(
            img,
            { yPercent: -8, scale: 1.16 },
            {
              yPercent: 8,
              ease: 'none',
              scrollTrigger: {
                trigger: ref.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
              }
            }
          );
        }

        // The frame itself wipes open from the side the row leads with.
        gsap.fromTo(
          frame,
          { clipPath: reversed ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)' },
          {
            clipPath: 'inset(0 0% 0 0%)',
            duration: 1.1,
            ease: 'power3.inOut',
            scrollTrigger: { trigger: ref.current, start: 'top 78%', once: true }
          }
        );

        // mask:'chars' wraps each character in its own overflow-hidden box,
        // so they rise from behind the baseline instead of fading in place.
        const split = new SplitText(ref.current.querySelector('.project-title'), {
          type: 'chars',
          charsClass: 'split-char',
          mask: 'chars'
        });

        gsap.from(split.chars, {
          opacity: 0,
          yPercent: 110,
          duration: 0.5,
          stagger: 0.014,
          ease: 'power3.out',
          scrollTrigger: { trigger: ref.current, start: 'top 78%', once: true }
        });

        gsap.from(ref.current.querySelectorAll('.technology-tag'), {
          opacity: 0,
          y: 14,
          duration: 0.4,
          stagger: 0.025,
          ease: 'power2.out',
          scrollTrigger: { trigger: ref.current, start: 'top 62%', once: true }
        });

        return () => split.revert();
      });
    },
    { scope: ref, dependencies: [reversed] }
  );

  return (
    <SpotlightCard className={`project-card ${reversed ? 'is-reversed' : ''}`.trim()}>
      <span className="card-spine" aria-hidden="true" />
      <div className="project-card-content" ref={ref}>
        <div className="project-content">
          <span className="project-index">{String(index + 1).padStart(2, '0')}</span>
          <h3 className="project-title">{title}</h3>
          <p className="project-description">{description}</p>
          <div className="project-technologies">
            {technologies.map((tech) => (
              <span key={tech} className="technology-tag">
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="project-image">
          {image ? (
            <img
              src={image.startsWith('/') ? image : `/${image}`}
              alt={title}
              loading="lazy"
            />
          ) : (
            <div className="project-placeholder">
              <span>Project Image</span>
            </div>
          )}
          <div className="project-overlay">
            <div className="project-links">
              {liveUrl && (
                <a href={liveUrl} target="_blank" rel="noopener noreferrer" className="project-link">
                  <i className="fas fa-external-link-alt"></i>
                  Live Demo
                </a>
              )}
              {githubUrl && (
                <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="project-link">
                  <i className="fab fa-github"></i>
                  Code
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </SpotlightCard>
  );
};

export default ProjectCard;
