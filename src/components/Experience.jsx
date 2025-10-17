import React from 'react';
import '../assets/styles/Experience.css';

const Experience = () => {
  return (
    <section id="experience" className="experience">
      <div className="container">
        <h2 className="section-title">Experience & Research</h2>
        <div className="experience-content">
          <div className="experience-grid">
            {/* Current Work */}
            <div className="experience-card">
              <div className="experience-header">
                <h3>Software & AI Developer</h3>
                <span className="experience-date">5/25 - Present</span>
              </div>
              <div className="experience-company">
                <h4>Boundary Remote Subsurface Solutions</h4>
                
              </div>
              <div className="experience-description">
                <p>
                Collaborating on technical landscape reviews for geospatial and generative AI. Bootstrapped a foundational codebase by integrating open-source libraries, enabling the reuse of data loaders and training utilities across domains.
                </p>
              </div>
              <div className="research-skills">
                <h5>Technologies:</h5>
                <div className="skills-list">
                  <span className="skill-item">Generative AI</span>
                  <span className="skill-item">Small Language Models</span>
                  <span className="skill-item">Data Validation</span>
                  <span className="skill-item">Python</span>
                  <span className="skill-item">TensorFlow/PyTorch</span>
                  <span className="skill-item">Hugging Face</span>
                  <span className="skill-item">scikit-learn</span>
                  <span className="skill-item">Geospatial Technologies</span>
                </div>
              </div>
            </div>

            {/* Current Work */}
            <div className="experience-card">
              <div className="experience-header">
                <h3>Software Engineer Intern</h3>
                <span className="experience-date">10/25 - Present</span>
              </div>
              <div className="experience-company">
                <h4>YesMedia</h4>
              </div>
              <div className="experience-description">
                <p>
                Working on frontend development for YesMedia's website, where I'm playing a pivotal role in the design, development, and deployment of the company's flagship website. My primary focus is on implementing a user-centric and responsive interface that catered to a diverse audience.
                </p>
              </div>
              <div className="research-skills">
                <h5>Technologies:</h5>
                <div className="skills-list">
                  <span className="skill-item">React</span>
                  <span className="skill-item">TypeScript</span>
                  <span className="skill-item">Tailwind CSS</span>
                  <span className="skill-item">Next.js</span>
                </div>
              </div>
            </div>

            {/* AI Research */}
            <div className="experience-card">
              <div className="experience-header">
                <h3>AI Research</h3>
                <span className="experience-date">2025</span>
              </div>
              <div className="experience-company">
                <h4>Research Focus</h4>
              </div>
              <div className="experience-description">
                <p>
                Developed CoVeGAT, an NLP/Graph ML pipeline for claim verification, and curated a 1K citation-alignment dataset to stress-test LLM factual accuracy. Achieved 96% detection accuracy on adversarial fabrications using a lightweight similarity baseline.
                </p>
              </div>
              <div className="research-skills">
                <h5>Research Skills:</h5>
                <div className="skills-list">
                  <span className="skill-item">Machine Learning</span>
                  <span className="skill-item">Natural Language Processing</span>
                  <span className="skill-item">Data Analysis</span>
                  <span className="skill-item">Python</span>
                  <span className="skill-item">TensorFlow/PyTorch</span>
                  <span className="skill-item">LLM</span>
                  <span className="skill-item">Experimentation and Evaluation</span>
                  <span className="skill-item">Dataset Creation</span>
                </div>
              </div>
              <div className="paper-actions">
                <a 
                  href="/CoVeGAT (6).pdf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  View Paper
                </a>
                <a 
                  href="/CoVeGAT (6).pdf" 
                  download
                  className="btn btn-secondary"
                >
                  Download PDF
                </a>
              </div>
            </div>
          </div>

          
        </div>
      </div>
    </section>
  );
};

export default Experience; 