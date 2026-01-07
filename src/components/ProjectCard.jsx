import React from 'react';
import '../assets/styles/ProjectCard.css';

const ProjectCard = ({ project }) => {
  const { title, description, image, technologies, liveUrl, githubUrl } = project;

  return (
    <div className="project-card">
      <div className="project-card-content">
        <div className="project-content">
          <h3 className="project-title">{title}</h3>
          <p className="project-description">{description}</p>
          <div className="project-technologies">
            {technologies.map((tech, index) => (
              <span key={index} className="technology-tag">
                {tech}
              </span>
            ))}
          </div>
        </div>
        
        <div className="project-image">
          {image ? (
            <img src={image.startsWith('/') ? image : `/${image}`} alt={title} />
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
    </div>
  );
};

export default ProjectCard; 