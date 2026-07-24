import React from 'react';
import { socialLinks } from '../data/socialLinks';
import AuroraBackground from './AuroraBackground';
import '../assets/styles/Hero.css';

const Hero = () => {
  return (
    <section id="home" className="hero">
      <AuroraBackground />
      <div className="hero-scrim" aria-hidden="true" />
      <div className="container hero-inner">
        <div className="hero-content" data-reveal>
          <p className="hero-eyebrow">Hi, my name is</p>
          <h1 className="hero-title">Max Bader.</h1>
          <h2 className="hero-tagline">I build AI-powered software.</h2>
          <p className="hero-description">
            CS student at UC Irvine working across full-stack web and
            LLM-reliability research. Currently a software engineering
            intern at <a href="https://codehs.com/" target="_blank" rel="noopener noreferrer">CodeHS</a>.
          </p>
          <div className="hero-actions">
            <a href="#projects" className="btn btn-primary">
              See my work
            </a>
            <div className="hero-socials">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="icon-link"
                  aria-label={link.name}
                >
                  <i className={link.icon} aria-hidden="true"></i>
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="hero-photo" data-reveal>
          <img src="/profile.png" alt="Max Bader" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
