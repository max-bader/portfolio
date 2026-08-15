import React from 'react';
import Hero from '../components/Hero';
import Experience from '../components/Experience';
import Projects from '../components/Projects';
import Footer from '../components/Footer';
import '../assets/styles/HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <Hero />
      <Experience />
      <Projects />
      <Footer />
    </div>
  );
};

export default HomePage;
