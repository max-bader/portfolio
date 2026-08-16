import React, { useRef } from 'react';
import { gsap, motionContext, useGSAP } from '../../lib/gsap';
import { rolesNewestFirst, totalMonths, peakConcurrent, laneCount } from '../../lib/timeline';
import { projectsData } from '../../data/projects';
import { EMAIL, GITHUB_URL, LINKEDIN_URL, PAPER_URL, RESUME_URL } from '../../lib/links';
import './paper.css';

/**
 * World: arXiv preprint.
 *
 * The only world that leads with the research half. A career typeset as a
 * paper — abstract, numbered sections, a table, figures with captions, and
 * references. Motion is a page setting itself: blocks land in reading order,
 * nothing overlaps or slides sideways, because a typesetter does not animate.
 */
const PaperWorld = () => {
  const root = useRef(null);

  useGSAP(
    () => {
      motionContext(root, (context) => {
        if (!context.conditions.motion) return;

        gsap
          .timeline({ defaults: { ease: 'power2.out', duration: 0.55 } })
          .from('.pw-stamp', { opacity: 0, x: -10 })
          .from('.pw-title', { opacity: 0, y: 14 }, 0.1)
          .from('.pw-authors', { opacity: 0, y: 10 }, 0.22)
          .from('.pw-abstract', { opacity: 0, y: 12 }, 0.32);

        // Sections set in reading order as they come into view.
        gsap.utils.toArray('.pw-block').forEach((block) => {
          gsap.from(block, {
            opacity: 0,
            y: 16,
            duration: 0.55,
            ease: 'power2.out',
            scrollTrigger: { trigger: block, start: 'top 86%', once: true }
          });
        });

        gsap.utils.toArray('.pw-row').forEach((row, index) => {
          gsap.from(row, {
            opacity: 0,
            duration: 0.35,
            delay: index * 0.04,
            scrollTrigger: { trigger: '.pw-table', start: 'top 82%', once: true }
          });
        });

        gsap.utils.toArray('.pw-figure').forEach((figure) => {
          gsap.from(figure, {
            opacity: 0,
            y: 20,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: { trigger: figure, start: 'top 84%', once: true }
          });
        });
      });
    },
    { scope: root }
  );

  return (
    <div className="pw" ref={root}>
      <article className="pw-sheet">
        {/* Deliberately no accession number: the preprint form is the page's
            conceit, and a fabricated arXiv id would read as a real claim. */}
        <p className="pw-stamp">
          Portfolio, typeset as a preprint · self-published · not peer reviewed
        </p>

        <h1 className="pw-title">
          Concurrent Role Execution in an Undergraduate Engineering Career:
          A Case Study
        </h1>

        <p className="pw-authors">
          Max Bader<sup>1</sup>
          <span className="pw-affil">
            <sup>1</sup>Department of Computer Science, University of California, Irvine ·{' '}
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          </span>
        </p>

        <section className="pw-abstract">
          <h2>Abstract</h2>
          <p>
            We report {rolesNewestFirst.length} engineering and research roles held
            over a {totalMonths}-month period, of which a maximum of{' '}
            {peakConcurrent} ran concurrently, requiring {laneCount} parallel
            tracks. Work spans frontend product engineering, applied machine
            learning, and large language model evaluation. We further describe{' '}
            {projectsData.length} shipped software artifacts and one first-author
            paper on claim verification. Results suggest that breadth and
            delivery are not mutually exclusive at this career stage.
          </p>
        </section>

        <nav className="pw-links pw-block">
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">Code</a>
          <a href={RESUME_URL} target="_blank" rel="noopener noreferrer">CV (PDF)</a>
          <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">Profile</a>
          <a href={PAPER_URL} target="_blank" rel="noopener noreferrer">Prior work</a>
        </nav>

        <section className="pw-block" id="experience">
          <h2 className="pw-h2"><span className="pw-num">1</span> Roles</h2>
          <p className="pw-lead">
            Roles are listed in reverse chronological order. Duration is given in
            months; concurrency is reported in Table 1.
          </p>

          <ol className="pw-roles">
            {rolesNewestFirst.map((role, index) => (
              <li className="pw-role" key={role.id}>
                <h3>
                  <span className="pw-num">1.{index + 1}</span>{' '}
                  <a href={role.url} target="_blank" rel="noopener noreferrer">
                    {role.company}
                  </a>
                  <em>{role.role}</em>
                </h3>
                <p className="pw-role-meta">
                  {role.date} ({role.months} months)
                  {role.ongoing && ' — ongoing'}
                </p>
                {role.description ? (
                  <p>{role.description}</p>
                ) : (
                  <p className="pw-note">
                    Description omitted; role in progress at time of writing.
                  </p>
                )}
                {role.skills.length > 0 && (
                  <p className="pw-keywords">
                    <em>Keywords:</em> {role.skills.join('; ')}
                  </p>
                )}
              </li>
            ))}
          </ol>
        </section>

        <section className="pw-block">
          <h2 className="pw-h2"><span className="pw-num">2</span> Concurrency</h2>
          <table className="pw-table">
            <caption>
              Table 1. Role overlap. Track assignment is computed by interval
              packing over the reported start and end dates.
            </caption>
            <thead>
              <tr>
                <th scope="col">Role</th>
                <th scope="col">Period</th>
                <th scope="col">Months</th>
                <th scope="col">Track</th>
              </tr>
            </thead>
            <tbody>
              {rolesNewestFirst.map((role) => (
                <tr className="pw-row" key={role.id}>
                  <td>{role.company}</td>
                  <td>{role.date}</td>
                  <td className="pw-numeric">{role.months}</td>
                  <td className="pw-numeric">{role.lane + 1}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="pw-block" id="projects">
          <h2 className="pw-h2"><span className="pw-num">3</span> Artifacts</h2>
          {projectsData.map((project, index) => (
            <figure className="pw-figure" key={project.id}>
              <img src={`/${project.image}`} alt={project.title} loading="lazy" />
              <figcaption>
                <strong>Figure {index + 1}.</strong> {project.title}. {project.description}{' '}
                <em>Implementation:</em> {project.technologies.join(', ')}.{' '}
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  Source
                </a>
                .
              </figcaption>
            </figure>
          ))}
        </section>

        <section className="pw-block">
          <h2 className="pw-h2"><span className="pw-num">4</span> Prior work</h2>
          <p>
            CoVeGAT introduces an NLP and graph-ML pipeline for claim
            verification, with a 1K citation-alignment dataset constructed to
            stress-test factual accuracy in large language models. A lightweight
            similarity baseline achieved 96% detection accuracy on adversarial
            fabrications.
          </p>
        </section>

        <section className="pw-block pw-refs">
          <h2 className="pw-h2">References</h2>
          <ol>
            <li>
              M. Bader. <em>CoVeGAT: claim verification with graph attention.</em>{' '}
              <a href={PAPER_URL} target="_blank" rel="noopener noreferrer">PDF</a>.
            </li>
            <li>
              M. Bader. <em>Source repositories.</em>{' '}
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
                github.com/max-bader
              </a>.
            </li>
            <li>
              M. Bader. <em>Curriculum vitae.</em>{' '}
              <a href={RESUME_URL} target="_blank" rel="noopener noreferrer">PDF</a>.
            </li>
          </ol>
        </section>

        <footer className="pw-foot pw-block">
          Correspondence to <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
        </footer>
      </article>
    </div>
  );
};

export default PaperWorld;
