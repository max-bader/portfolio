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
                <span className="experience-date">2025 - Present</span>
              </div>
              <div className="experience-company">
                <h4>Boundary Remote Sensing Systems</h4>
                
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
            </div>
          </div>

          {/* Paper Display */}
          <div className="paper-section">
            <h3>Research Publications</h3>
            <div className="paper-card">
              <div className="paper-info">
                <h4>CoVeGAT: A Hybrid LLM & Graph Attention Pipeline for Accurate Citation Aligned Claim Verification</h4>
                
                <p className="paper-abstract">
                  To quantify LLM fabrication, we built a 1,000-sample Citation-Alignment Dataset and proposed CoVeGAT, an NLP/Graph ML pipeline for citation verification. Our evaluation of top LLMs revealed a trade-off in accuracy, while a simple MiniLM + RBF kernel baseline achieved a superior 96.4% accuracy, demonstrating the effectiveness of interpretable methods.
                </p>
              </div>
              <div className="paper-actions">
                <a 
                  href="/CoVeGAT (6).pdf" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  <i className="fas fa-file-pdf"></i>
                  View Paper
                </a>
                <a 
                  href="/CoVeGAT (6).pdf" 
                  download
                  className="btn btn-secondary"
                >
                  <i className="fas fa-download"></i>
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