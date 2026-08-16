import React from 'react';
import SpotlightCard from './SpotlightCard';
import '../assets/styles/ProjectCard.css';

const ProjectCard = ({ project, index = 0 }) => {
  const { title, description, image, technologies, liveUrl, githubUrl } = project;

  // Every other row puts the screenshot on the left instead of the right.
  const reversed = index % 2 === 1;

  return (
    <SpotlightCard className={`project-card ${reversed ? 'is-reversed' : ''}`.trim()}>
      <div className="project-card-content">
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
