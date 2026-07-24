import React from 'react';
import { socialLinks } from '../data/socialLinks';
import '../assets/styles/Contact.css';

const Contact = () => {
  return (
    <section id="contact" className="section contact">
      <div className="container contact-inner" data-reveal>
        <p className="eyebrow">03. What's next?</p>
        <h2 className="contact-title">Get in touch</h2>
        <p className="contact-blurb">
          I'm currently open to internships, research collaborations, and
          interesting projects. My inbox is always open — whether you have a
          question or just want to say hi, I'll get back to you.
        </p>
        <a href="mailto:mibader@uci.edu" className="btn btn-primary contact-cta">
          Say hello
        </a>
        <div className="contact-socials">
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
    </section>
  );
};

export default Contact;
