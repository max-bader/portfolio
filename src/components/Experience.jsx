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
              <div className="experience-card-content">
                <a 
                  href="https://yesmedia.us/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="experience-logo"
                >
                  <img src="/yes_mediaa_logo.jpeg" alt="YesMedia Logo" />
                </a>
                <div className="experience-details">
                  <div className="experience-header">
                    <div className="experience-company-title">
                      <h4>YesMedia</h4>
                      <h3>Software Engineer Intern</h3>
                    </div>
                    <span className="experience-date">10/25 - Present</span>
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
              </div>
            </div>

            {/* Handshake AI Fellowship */}
            <div className="experience-card">
              <div className="experience-card-content">
                <a 
                  href="https://joinhandshake.com/ai" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="experience-logo"
                >
                  <img src="/team_handshake_logo.jpeg" alt="Handshake AI Logo" />
                </a>
                <div className="experience-details">
                  <div className="experience-header">
                    <div className="experience-company-title">
                      <h4>Handshake AI</h4>
                      <h3>AI Trainer</h3>
                    </div>
                    <span className="experience-date">10/25 - Present</span>
                  </div>
              <div className="experience-description">
                <p>
                Developing and evaluating domain-specific prompts to assess the performance of large language models (LLMs). Analyzing LLM outputs for scientific accuracy, clarity, and depth in specialized subfields. Contributing to improving AI understanding of complex topics through expert review and feedback. Conducted independent research to support prompt development and evaluation tasks.
                </p>
              </div>
              <div className="research-skills">
                <h5>Technologies:</h5>
                <div className="skills-list">
                  <span className="skill-item">Large Language Models</span>
                  <span className="skill-item">Prompt Engineering</span>
                  <span className="skill-item">AI Evaluation</span>
                  <span className="skill-item">Research & Analysis</span>
                </div>
              </div>
                </div>
              </div>
            </div>

            {/* DapLab */}
            <div className="experience-card">
              <div className="experience-card-content">
                <a 
                  href="https://daplab.education.uci.edu/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="experience-logo"
                >
                  <img src="/daplab_uci_logo.jpeg" alt="DapLab Logo" />
                </a>
                <div className="experience-details">
                  <div className="experience-header">
                    <div className="experience-company-title">
                      <h4>DapLab</h4>
                      <h3>Software Developer Research Assistant</h3>
                    </div>
                    <span className="experience-date">9/25-Present</span>
                  </div>
              <div className="experience-description">
                <p>
                Creating and analyzing prompts for AI pipeline development, focusing on optimizing prompt design and evaluating their effectiveness.
                </p>
              </div>
              <div className="research-skills">
                <h5>Technologies:</h5>
                <div className="skills-list">
                  <span className="skill-item">Prompt Engineering</span>
                  <span className="skill-item">Pipeline Development</span>
                  <span className="skill-item">Data Analysis</span>
                  <span className="skill-item">Research Methods</span>
                </div>
              </div>
                </div>
              </div>
            </div>

            {/* Current Work */}
            <div className="experience-card">
              <div className="experience-card-content">
                <a 
                  href="https://boundaryrss.org/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="experience-logo"
                >
                  <img src="/1718740085368.jpeg" alt="Boundary Logo" />
                </a>
                <div className="experience-details">
                  <div className="experience-header">
                    <div className="experience-company-title">
                      <h4>Boundary Remote Subsurface Solutions</h4>
                      <h3>Software & AI Developer</h3>
                    </div>
                    <span className="experience-date">5/25 - 12/25</span>
                  </div>
              <div className="experience-description">
                <p>
                Collaborated on technical landscape reviews for geospatial and generative AI. Bootstrapped a foundational codebase by integrating open-source libraries, enabling the reuse of data loaders and training utilities across domains.
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
              </div>
            </div>

            {/* AI Research */}
            <div className="experience-card">
              <div className="experience-card-content">
                <a 
                  href="https://algoverseairesearch.org/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="experience-logo"
                >
                  <img src="/1715931568682.jpeg" alt="Algoverse" />
                </a>
                <div className="experience-details">
                  <div className="experience-header">
                    <div className="experience-company-title">
                      <h4>Algoverse</h4>
                      <h3>AI Research</h3>
                    </div>
                    <span className="experience-date">3/25 - 7/25</span>
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

          
        </div>
      </div>
    </section>
  );
};

export default Experience; 