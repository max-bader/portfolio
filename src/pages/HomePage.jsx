import React from 'react';
import Hero from '../components/Hero';
import Experience from '../components/Experience';
import Projects from '../components/Projects';
import Footer from '../components/Footer';
import '../assets/styles/HomePage.css';

const HomePage = ({ onOpenTerminal }) => {
  return (
    <div className="home-page">
      <Hero onOpenTerminal={onOpenTerminal} />
      <Experience />
      <Projects />
      <Footer />
    </div>
  );
};

export default HomePage;
