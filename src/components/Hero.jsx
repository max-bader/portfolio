import React from 'react';
import { socialLinks } from '../data/socialLinks';
import AuroraBackground from './AuroraBackground';
import '../assets/styles/Hero.css';

const Hero = () => {
  return (
    <section id="home" className="hero">
      <div className="container hero-inner">
        <div className="hero-content" data-reveal>
          <p className="hero-eyebrow">Irvine, California</p>
          <h1 className="hero-title">Max Bader</h1>
          <p className="hero-lede">
            I build <em>AI-powered software</em> — and study where it
            gets things wrong.
          </p>
          <p className="hero-description">
            CS student at UC Irvine working across full-stack web and
            LLM-reliability research. Currently a software engineering
            intern at{' '}
            <a href="https://codehs.com/" target="_blank" rel="noopener noreferrer">
              CodeHS
            </a>
            .
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

        {/* Colour plate: the portrait set into the shader, framed and
            captioned the way a figure would be. */}
        <figure className="hero-plate" data-reveal>
          <div className="hero-plate-frame">
            <AuroraBackground />
            <img src="/profile.png" alt="Max Bader" className="hero-plate-photo" />
          </div>
          <figcaption className="hero-plate-caption">
            <span>Fig. 1</span> Max Bader, 2026
          </figcaption>
        </figure>
      </div>
    </section>
  );
};

export default Hero;
