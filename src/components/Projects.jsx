import React from 'react';
import ProjectCard from './ProjectCard';
import Reveal from './Reveal';
import { projectsData } from '../data/projects';
import '../assets/styles/Projects.css';

const Projects = () => {
  return (
    <section className="projects">
      <div id="projects" className="container">
        <Reveal>
          <div className="projects-header">
            <h2 className="section-title">My Projects</h2>
            <a
              href="https://github.com/max-bader"
              target="_blank"
              rel="noopener noreferrer"
              className="github-link"
              aria-label="GitHub profile"
            >
              <i className="fab fa-github"></i>
            </a>
          </div>
          <p className="section-subtitle">
            Here are some of the projects I've worked on. Each one represents
            a unique challenge and learning experience.
          </p>
        </Reveal>

        <div className="projects-grid">
          {projectsData.map((project, index) => (
            <Reveal key={project.id} delay={index * 70}>
              <ProjectCard project={project} index={index} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
