import React from 'react';
import '../assets/styles/About.css';

const About = () => {
  return (
    <section id="about" className="about">
      <div className="container">
        <h2 className="section-title">About Me</h2>
        <div className="about-content">
          <div className="about-text">
            <p>
              I'm a passionate Full Stack Developer with a love for creating innovative digital solutions. 
              With expertise in modern web technologies, I bring ideas to life through clean, efficient code 
              and intuitive user experiences.
            </p>
            <p>
              My journey in web development started with curiosity and has evolved into a career focused on 
              building scalable applications that make a difference. I believe in continuous learning and 
              staying up-to-date with the latest technologies and best practices.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About; 