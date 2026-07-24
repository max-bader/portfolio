import React from 'react';
import '../assets/styles/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <p>
        Designed & built by Max Bader · © {currentYear}
      </p>
    </footer>
  );
};

export default Footer;
