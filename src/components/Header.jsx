import React, { useState } from 'react';
import '../assets/styles/Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <h1>Max Bader._</h1>
        </div>
        
        <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
          <ul className="nav-list">
            <li><a href="#home" data-number="01" onClick={() => setIsMenuOpen(false)}>home</a></li>
            <li><a href="#experience" data-number="02" onClick={() => setIsMenuOpen(false)}>experience</a></li>
            <li><a href="#projects" data-number="03" onClick={() => setIsMenuOpen(false)}>work</a></li>
          </ul>
        </nav>

        <button 
          className={`hamburger ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
};

export default Header; 