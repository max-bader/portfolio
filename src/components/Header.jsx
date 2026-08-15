import React, { useEffect, useMemo, useState } from 'react';
import { useActiveSection } from '../hooks/useActiveSection';
import '../assets/styles/Header.css';

const NAV_ITEMS = [
  { id: 'home', label: 'home', number: '01' },
  { id: 'experience', label: 'experience', number: '02' },
  { id: 'projects', label: 'work', number: '03' }
];

const Header = ({ onOpenPalette }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const sectionIds = useMemo(() => NAV_ITEMS.map((item) => item.id), []);
  const activeId = useActiveSection(sectionIds);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={`header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="header-container">
        <div className="logo">
          <h1>Max Bader.</h1>
        </div>

        <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
          <ul className="nav-list">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  data-number={item.number}
                  className={activeId === item.id ? 'is-active' : ''}
                  aria-current={activeId === item.id ? 'true' : undefined}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-actions">
          <button
            type="button"
            className="header-action header-action-palette"
            onClick={onOpenPalette}
            aria-label="Open command palette"
          >
            <i className="fas fa-magnifying-glass" aria-hidden="true" />
            <kbd>⌘K</kbd>
          </button>

          <button
            className={`hamburger ${isMenuOpen ? 'active' : ''}`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
