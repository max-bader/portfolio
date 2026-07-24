import React from 'react';
import '../assets/styles/ProjectCard.css';

const ProjectCard = ({ project }) => {
  const { title, description, bullets, image, technologies, liveUrl, githubUrl } = project;

  return (
    <article className="project" data-reveal>
      <div className="project-media">
        <a
          href={liveUrl || githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${title} — ${liveUrl ? 'live demo' : 'source code'}`}
        >
          <img src={`/${image}`} alt={`${title} screenshot`} loading="lazy" />
        </a>
      </div>

      <div className="project-body">
        <h3 className="project-title">{title}</h3>
        <p className="project-description">{description}</p>
        {bullets && bullets.length > 0 && (
          <ul className="project-bullets">
            {bullets.map((bullet, index) => (
              <li key={index}>{bullet}</li>
            ))}
          </ul>
        )}
        <ul className="project-tech">
          {technologies.map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>
        <div className="project-links">
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="icon-link"
              aria-label={`${title} source code on GitHub`}
            >
              <i className="fab fa-github" aria-hidden="true"></i>
            </a>
          )}
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="icon-link"
              aria-label={`${title} live demo`}
            >
              <i className="fas fa-external-link-alt" aria-hidden="true"></i>
            </a>
          )}
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;
