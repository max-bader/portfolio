import React from 'react';
import { socialLinks } from '../data/socialLinks';
import '../assets/styles/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>Max Bader</h3>
            <p>Computer Science @ UC Irvine · building things for the web.</p>
          </div>

          <div className="footer-social">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.name}
              >
                <i className={link.icon}></i>
              </a>
            ))}
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} Max Bader</p>
          <p className="footer-hint">
            Press <kbd>⌘</kbd><kbd>K</kbd> for the command palette
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
