import React from 'react';
import Hero from '../components/Hero';
import Experience from '../components/Experience';
import Projects from '../components/Projects';
import Contact from '../components/Contact';
import '../assets/styles/HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <Hero />
      <Experience />
      <Projects />
      <Contact />
    </div>
  );
};

export default HomePage; 