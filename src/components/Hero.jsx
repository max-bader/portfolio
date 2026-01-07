import React from 'react';
import { socialLinks } from '../data/socialLinks';
import '../assets/styles/Hero.css';

const Hero = () => {
  return (
    <section id="home" className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="highlight">Max Bader</span>
          </h1>
          <h2 className="hero-subtitle">
            Software Developer
          </h2>
          <div className="hero-buttons">
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
              >
                <i className={link.icon}></i>
              </a>
            ))}
            <a
              href="/MaxBaderResume copy.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
            >
              <i className="fas fa-file-alt"></i>
            </a>
          </div>
        </div>
        <div className="hero-image">
          <div className="profile-placeholder">
            <img src="/IMG_1563.jpeg" alt="Max Bader" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 