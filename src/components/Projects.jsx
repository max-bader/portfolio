import React, { useRef } from 'react';
import ProjectCard from './ProjectCard';
import Reveal from './Reveal';
import SectionTitle from './SectionTitle';
import { projectsData } from '../data/projects';
import { GITHUB_URL } from '../lib/links';
import { useScrollSkew } from '../hooks/useScrollSkew';
import '../assets/styles/Projects.css';

const Projects = () => {
  const root = useRef(null);

  useScrollSkew(root, '.project-card', { max: 4 });

  return (
    <section className="projects" ref={root}>
      <div id="projects" className="container">
        <Reveal>
          <div className="projects-header">
            <SectionTitle>My Projects</SectionTitle>
            <a
              href={GITHUB_URL}
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
