import React, { useRef } from 'react';
import { experienceData } from '../data/experience';
import Reveal from './Reveal';
import SectionTitle from './SectionTitle';
import ExperienceCard from './ExperienceCard';
import { useScrollSkew } from '../hooks/useScrollSkew';
import '../assets/styles/Experience.css';

const Experience = () => {
  const root = useRef(null);

  useScrollSkew(root, '.experience-card', { max: 3.5 });

  return (
    <section id="experience" className="experience" ref={root}>
      <div className="container">
        <SectionTitle>Experience &amp; Research</SectionTitle>
        <div className="experience-content">
          <div className="experience-grid">
            {experienceData.map((job, index) => (
              <Reveal key={job.id} delay={index * 60}>
                <ExperienceCard job={job} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
