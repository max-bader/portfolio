import React from 'react';
import '../assets/styles/Hero.css';

const Hero = () => {
  return (
    <section id="home" className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">
            Hi, I'm<br />
            <span className="highlight">Max Bader</span>
          </h1>
          <h2 className="hero-subtitle">
            Aspiring Software Engineer
          </h2>
          <p className="hero-description">
            I'm a passionate and dedicated software engineer with a strong foundation in computer science and an interest in intelligent systems.   
          </p>
          <div className="hero-buttons">
            <a href="#projects" className="btn btn-primary">
              View My Work
            </a>
            <a href="#contact" className="btn btn-secondary">
              Get In Touch
            </a>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
            >
              View Resume
            </a>
          </div>
        </div>
        <div className="hero-image">
          {/* Add your profile image here */}
          <div className="profile-placeholder">
            <span>Your Photo</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 