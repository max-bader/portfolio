import React from 'react';
import { skillsData } from '../data/skills';
import '../assets/styles/Skills.css';

const Skills = () => {
  return (
    <section id="skills" className="skills">
      <div className="container">
        <h2 className="section-title">Skills & Technologies</h2>
        <div className="skills-content">
          {skillsData.map((category, index) => (
            <div key={index} className="skills-category">
              <h3 className="category-title">{category.name}</h3>
              <div className="skills-grid">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skillIndex} className="skill-item">
                    <div className="skill-icon">
                      {skill.icon && <i className={skill.icon}></i>}
                    </div>
                    <span className="skill-name">{skill.name}</span>
                    <div className="skill-level">
                      <div 
                        className="skill-progress" 
                        style={{ width: `${skill.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills; 