import React from 'react';
import ProjectCard from './ProjectCard';
import { projectsData } from '../data/projects';
import '../assets/styles/Projects.css';

const Projects = () => {
  return (
    <section id="projects" className="section projects">
      <div className="container">
        <div className="section-head" data-reveal>
          <span className="eyebrow">02.</span>
          <h2 className="section-title">Things I've Built</h2>
        </div>

        <div className="projects-list">
          {projectsData.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        <div className="projects-more" data-reveal>
          <a
            href="https://github.com/max-bader"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
          >
            <i className="fab fa-github" aria-hidden="true"></i>
            More on GitHub
          </a>
        </div>
      </div>
    </section>
  );
};

export default Projects;
