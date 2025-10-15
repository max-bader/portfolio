import React from 'react';
import ProjectCard from './ProjectCard';
import { projectsData } from '../data/projects';
import '../assets/styles/Projects.css';

const Projects = () => {

  return (
    <section id="projects" className="projects">
      <div className="container">
        <h2 className="section-title">My Projects</h2>
        <p className="section-subtitle">
          Here are some of the projects I've worked on. Each one represents 
          a unique challenge and learning experience.
        </p>
        
        {/* Filter buttons removed to always show all projects */}

        <div className="projects-grid">
          {projectsData.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        <div className="projects-cta">
          <p>Interested in seeing more of my work?</p>
          <a 
            href="https://github.com/max-bader" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-secondary"
          >
            View More on GitHub
          </a>
        </div>
      </div>
    </section>
  );
};

export default Projects; 