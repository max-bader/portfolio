import React from 'react';
import { experienceData } from '../data/experience';
import Reveal from './Reveal';
import SpotlightCard from './SpotlightCard';
import '../assets/styles/Experience.css';

const Experience = () => {
  return (
    <section id="experience" className="experience">
      <div className="container">
        <Reveal>
          <h2 className="section-title">Experience &amp; Research</h2>
        </Reveal>
        <div className="experience-content">
          <div className="experience-grid">
            {experienceData.map((job, index) => (
              <Reveal key={job.id} delay={index * 60}>
                <SpotlightCard className="experience-card">
                  <div className="experience-card-content">
                    <a
                      href={job.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="experience-logo"
                      aria-label={job.company}
                    >
                      <img src={job.logo} alt={`${job.company} Logo`} loading="lazy" />
                    </a>
                    <div className="experience-details">
                      <div className="experience-header">
                        <div className="experience-company-title">
                          <h4>{job.company}</h4>
                          <h3>{job.role}</h3>
                        </div>
                        <span className="experience-date">{job.date}</span>
                      </div>

                      {job.description && (
                        <div className="experience-description">
                          <p>{job.description}</p>
                        </div>
                      )}

                      {job.skills.length > 0 && (
                        <div className="research-skills">
                          <h5>{job.skillsLabel}</h5>
                          <div className="skills-list">
                            {job.skills.map((skill) => (
                              <span key={skill} className="skill-item">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {job.actions && (
                        <div className="paper-actions">
                          {job.actions.map((action) => (
                            <a
                              key={action.label}
                              href={action.href}
                              className={`btn ${action.variant}`}
                              {...(action.download ? { download: true } : {})}
                              {...(action.newTab
                                ? { target: '_blank', rel: 'noopener noreferrer' }
                                : {})}
                            >
                              {action.label}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </SpotlightCard>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
