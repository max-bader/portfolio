import React, { useRef } from 'react';
import { socialLinks } from '../data/socialLinks';
import { RESUME_URL } from '../lib/links';
import { gsap, motionContext, useGSAP } from '../lib/gsap';
import { useMagnetic } from '../hooks/useMagnetic';
import TypeRotator from './TypeRotator';
import '../assets/styles/Hero.css';

const NAME = 'Max Bader';
const SCRAMBLE_CHARS = '!<>-_\\/[]{}=+*^?#$%&@01';

const ROLES = [
  'Software Developer',
  'CS @ UC Irvine',
  'SWE Intern @ CodeHS',
  'AI / ML Researcher'
];

// The role rotator waits for the entrance to finish before it starts cycling.
const ENTRANCE_END = 1.6;

const Hero = () => {
  const root = useRef(null);

  useGSAP(
    () => {
      motionContext(root, (context) => {
        // Reduced motion: everything is already in its final state.
        if (!context.conditions.motion) return;

        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        tl.from('.hero-kicker', { opacity: 0, y: 14, duration: 0.5 }, 0)
          .from(
            '.hero-image',
            { opacity: 0, x: 40, scale: 0.96, duration: 1.1 },
            0.1
          )
          .to(
            '.hero-title .highlight',
            {
              duration: 1,
              ease: 'none',
              scrambleText: {
                text: NAME,
                chars: SCRAMBLE_CHARS,
                speed: 0.5,
                revealDelay: 0.15
              }
            },
            0.15
          )
          .from('.hero-subtitle', { opacity: 0, y: 12, duration: 0.5 }, 0.55)
          .from('.hero-description', { opacity: 0, y: 12, duration: 0.5 }, 0.75)
          .from(
            '.hero-buttons .social-link',
            { opacity: 0, y: 14, scale: 0.9, duration: 0.45, stagger: 0.07 },
            0.9
          )
          .from('.hero-scroll-cue', { opacity: 0, duration: 0.6 }, 1.35);

        // Scrolling away drifts the portrait and lets the copy fall behind,
        // so the hero has depth rather than moving as one flat slab.
        gsap.to('.hero-image', {
          yPercent: 16,
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true
          }
        });

        gsap.to('.hero-content', {
          yPercent: 6,
          opacity: 0.25,
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top top',
            end: 'bottom 20%',
            scrub: true
          }
        });
      });
    },
    { scope: root }
  );

  useMagnetic(root, '.hero-buttons .social-link', { strength: 0.4, scale: 1.15 });

  return (
    <section id="home" className="hero" ref={root}>
      <div className="hero-container">
        <div className="hero-content">
          <p className="hero-kicker">
            <span className="hero-kicker-prompt">~/portfolio $</span> whoami
          </p>

          <h1 className="hero-title">
            <span className="highlight">{NAME}</span>
          </h1>

          <h2 className="hero-subtitle">
            <TypeRotator phrases={ROLES} delay={ENTRANCE_END} />
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
