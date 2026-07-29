import React from 'react';
import { experienceData } from '../data/experience';
import '../assets/styles/Experience.css';

const Experience = () => {
  return (
    <section id="experience" className="section experience">
      <div className="container">
        <div className="section-head" data-reveal>
          <span className="eyebrow">Record</span>
          <h2 className="section-title">Experience &amp; research</h2>
        </div>

        <div className="xp-list">
          {experienceData.map((job) => (
            <article className="xp-row" key={`${job.company}-${job.role}`} data-reveal>
              <div className="xp-date">{job.date}</div>
              <div className="xp-body">
                <h3 className="xp-role">
                  {job.role}
                  <span className="xp-at"> · </span>
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="xp-company"
                  >
                    <img src={`/${job.logo}`} alt="" className="xp-logo" />
                    {job.company}
                  </a>
                </h3>
                <p className="xp-description">{job.description}</p>
                {job.tags.length > 0 && (
                  <ul className="xp-tags">
                    {job.tags.map((tag) => (
                      <li className="tag" key={tag}>{tag}</li>
                    ))}
                  </ul>
                )}
                {job.paperUrl && (
                  <a
                    href={job.paperUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="xp-paper"
                  >
                    <i className="fas fa-file-pdf" aria-hidden="true"></i>
                    Read the paper
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
