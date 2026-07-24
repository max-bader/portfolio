import React, { useState } from 'react';
import '../assets/styles/Header.css';

const navLinks = [
  { href: '#experience', number: '01', label: 'experience' },
  { href: '#projects', number: '02', label: 'work' },
  { href: '#contact', number: '03', label: 'contact' },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="header-inner">
        <a href="#home" className="logo" aria-label="Home">
          mb<span className="logo-cursor">._</span>
        </a>

        <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
          <ul className="nav-list">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} onClick={() => setIsMenuOpen(false)}>
                  <span className="nav-number">{link.number}.</span>
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
