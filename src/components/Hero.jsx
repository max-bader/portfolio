import React from 'react';
import { socialLinks } from '../data/socialLinks';
import { RESUME_URL } from '../lib/links';
import ScrambleText from './ScrambleText';
import TypeRotator from './TypeRotator';
import '../assets/styles/Hero.css';

const ROLES = [
  'Software Developer',
  'CS @ UC Irvine',
  'SWE Intern @ CodeHS',
  'AI / ML Researcher'
];

const Hero = () => {
  return (
    <section id="home" className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <p className="hero-kicker">
            <span className="hero-kicker-prompt">~/portfolio $</span> whoami
          </p>

          <h1 className="hero-title">
            <ScrambleText text="Max Bader" className="highlight" />
          </h1>

          <h2 className="hero-subtitle">
            <TypeRotator phrases={ROLES} />
          </h2>

          <p className="hero-description">
            Currently interning at CodeHS and researching AI at UC Irvine.
          </p>

          <div className="hero-buttons">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label={link.name}
              >
                <i className={link.icon}></i>
              </a>
            ))}
            <a
              href={RESUME_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              aria-label="Resume"
            >
              <i className="fas fa-file-alt"></i>
            </a>
          </div>
        </div>

        <div className="hero-image">
          <div className="profile-placeholder">
            <img src="/IMG_5553 copy.png" alt="Max Bader" />
          </div>
        </div>
      </div>

      <a className="hero-scroll-cue" href="#experience" aria-label="Scroll to experience">
        <span />
      </a>
    </section>
  );
};

export default Hero;
