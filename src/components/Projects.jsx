import React from 'react';
import ProjectCard from './ProjectCard';
import { projectsData } from '../data/projects';
import '../assets/styles/Projects.css';

const Projects = () => {

  return (
    <section className="projects">
      <div id="projects" className="container">
        <div className="projects-header">
          <h2 className="section-title">My Projects</h2>
          <a 
            href="https://github.com/max-bader" 
            target="_blank" 
            rel="noopener noreferrer"
            className="github-link"
          >
            <i className="fab fa-github"></i>
          </a>
        </div>
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
      </div>
    </section>
  );
};

export default Projects; 