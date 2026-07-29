import React, { useEffect, useState } from 'react';
import '../assets/styles/Header.css';

const navLinks = [
  { href: '#experience', label: 'Experience' },
  { href: '#projects', label: 'Work' },
  { href: '#contact', label: 'Contact' },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState('');

  // Scroll-spy: mark whichever section is nearest the top of the viewport.
  useEffect(() => {
    const sections = navLinks
      .map((l) => document.querySelector(l.href))
      .filter(Boolean);
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length) setActiveId(`#${visible[0].target.id}`);
      },
      // Band just under the header, so "active" flips as a section reaches the top.
      { rootMargin: '-64px 0px -55% 0px', threshold: 0 }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="header">
      <div className="header-inner">
        <a href="#home" className="logo" aria-label="Home">
          Max Bader<span className="logo-cursor">.</span>
        </a>

        <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
          <ul className="nav-list">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={activeId === link.href ? 'is-active' : undefined}
                  aria-current={activeId === link.href ? 'true' : undefined}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="nav-resume"
                onClick={() => setIsMenuOpen(false)}
              >
                resume
              </a>
            </li>
          </ul>
        </nav>

        <button
          className={`hamburger ${isMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
};

export default Header;
