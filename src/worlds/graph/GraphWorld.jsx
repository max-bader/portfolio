import React, { useRef } from 'react';
import { gsap, motionContext, ScrollTrigger, useGSAP } from '../../lib/gsap';
import { rolesNewestFirst, laneCount, totalMonths, peakConcurrent } from '../../lib/timeline';
import { projectsData } from '../../data/projects';
import { EMAIL, GITHUB_URL, LINKEDIN_URL, PAPER_URL, RESUME_URL } from '../../lib/links';
import './graph.css';

// One hue per lane, the way every git client colours concurrent branches.
const LANE_HUES = ['#ff8a5b', '#f2c14e', '#5fd0a0', '#8ba7ff'];

const LANE_GAP = 30;
const GUTTER = 26;

/**
 * World: git commit graph.
 *
 * Six roles as a branch railroad. Lane assignment comes from the real dates,
 * so concurrent roles genuinely sit in parallel lanes — the graph is the range
 * claim rather than an illustration of it.
 */
const GraphWorld = () => {
  const root = useRef(null);
  const rows = rolesNewestFirst;

  useGSAP(
    () => {
      /**
       * Commit entries are as tall as their text, so the rail has to be
       * measured from real layout rather than a row constant — otherwise long
       * descriptions overflow their slot and collide with the next entry.
       */
      const layoutRail = () => {
        const list = root.current.querySelector('.gw-commits');
        const svg = root.current.querySelector('.gw-rail');
        const items = gsap.utils.toArray('.gw-commit', root.current);
        if (!list || !svg || !items.length) return;

        const listTop = list.getBoundingClientRect().top;
        const centres = items.map((item) => {
          const rect = item.getBoundingClientRect();
          return rect.top - listTop + rect.height / 2;
        });

        svg.setAttribute('height', String(list.offsetHeight));
        svg.setAttribute('width', String(GUTTER * 2 + laneCount * LANE_GAP));

        svg.querySelectorAll('.gw-node').forEach((node, index) => {
          node.setAttribute('cy', String(centres[index]));
        });

        svg.querySelectorAll('.gw-lane-path').forEach((path) => {
          const lane = Number(path.dataset.lane);
          const occupied = rows
            .map((role, index) => ({ role, index }))
            .filter((entry) => entry.role.lane === lane);
          if (!occupied.length) return;
          const x = GUTTER + lane * LANE_GAP;
          const first = centres[occupied[0].index];
          const last = centres[occupied[occupied.length - 1].index];
          path.setAttribute('d', `M ${x} ${first - 34} L ${x} ${last + 34}`);
        });
      };

      layoutRail();
      const observer = new ResizeObserver(() => {
        layoutRail();
        ScrollTrigger.refresh();
      });
      observer.observe(root.current.querySelector('.gw-commits'));

      motionContext(root, (context) => {
        if (!context.conditions.motion) return;

        // Lane spines ink downward, the way a graph renders top to bottom.
        root.current.querySelectorAll('.gw-lane-path').forEach((path) => {
          const length = path.getTotalLength();
          gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
          gsap.to(path, {
            strokeDashoffset: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: '.gw-graph',
              start: 'top 70%',
              end: 'bottom 85%',
              scrub: 0.5
            }
          });
        });

        gsap.from('.gw-node', {
          scale: 0,
          duration: 0.45,
          ease: 'back.out(2.2)',
          stagger: 0.1,
          scrollTrigger: { trigger: '.gw-graph', start: 'top 68%', once: true }
        });

        gsap.utils.toArray('.gw-commit').forEach((commit) => {
          gsap.from(commit, {
            opacity: 0,
            x: -18,
            duration: 0.6,
            ease: 'power3.out',
            scrollTrigger: { trigger: commit, start: 'top 84%', once: true }
          });
        });

        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        tl.from('.gw-repo-line', { opacity: 0, y: 10, duration: 0.5, stagger: 0.08 })
          .from('.gw-title', { opacity: 0, y: 22, duration: 0.7 }, 0.15)
          .from('.gw-stat', { opacity: 0, y: 12, duration: 0.5, stagger: 0.07 }, 0.4);

        gsap.utils.toArray('.gw-release').forEach((release) => {
          gsap.from(release, {
            opacity: 0,
            y: 26,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: { trigger: release, start: 'top 80%', once: true }
          });
        });
      });

      return () => observer.disconnect();
    },
    { scope: root }
  );

  return (
    <div className="gw" ref={root}>
      <header className="gw-head">
        <p className="gw-repo-line gw-repo">
          <span className="gw-repo-owner">max-bader</span>
          <span className="gw-repo-slash">/</span>
          <span className="gw-repo-name">career</span>
        </p>
        <h1 className="gw-title">Max Bader</h1>
        <p className="gw-repo-line gw-tagline">
          Computer Science at UC Irvine. Building product and researching models,
          usually at the same time.
        </p>

        <dl className="gw-stats">
          <div className="gw-stat">
            <dt>commits</dt>
            <dd>{rows.length}</dd>
          </div>
          <div className="gw-stat">
            <dt>branches</dt>
            <dd>{laneCount}</dd>
          </div>
          <div className="gw-stat">
            <dt>concurrent peak</dt>
            <dd>{peakConcurrent}</dd>
          </div>
          <div className="gw-stat">
            <dt>months</dt>
            <dd>{totalMonths}</dd>
          </div>
        </dl>

        <nav className="gw-repo-line gw-links">
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">github</a>
          <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">linkedin</a>
          <a href={RESUME_URL} target="_blank" rel="noopener noreferrer">résumé.pdf</a>
        </nav>
      </header>

      <section className="gw-graph" id="experience">
        <h2 className="gw-section-title">
          <span className="gw-prompt">$</span> git log --graph --all
        </h2>

        <div className="gw-graph-body">
          {/* Geometry is written by layoutRail() once real heights exist. */}
          <svg className="gw-rail" width={GUTTER * 2 + laneCount * LANE_GAP} aria-hidden="true">
            {Array.from({ length: laneCount }, (_, lane) => (
              <path
                key={lane}
                className="gw-lane-path"
                data-lane={lane}
                stroke={LANE_HUES[lane % LANE_HUES.length]}
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
              />
            ))}
            {rows.map((role) => (
              <circle
                key={role.id}
                className="gw-node"
                cx={GUTTER + role.lane * LANE_GAP}
                r={role.ongoing ? 8 : 6}
                fill={role.ongoing ? LANE_HUES[role.lane % LANE_HUES.length] : '#12161c'}
                stroke={LANE_HUES[role.lane % LANE_HUES.length]}
                strokeWidth="2.5"
              />
            ))}
          </svg>

          <ol className="gw-commits">
            {rows.map((role) => (
              <li className="gw-commit" key={role.id}>
                <p className="gw-commit-meta">
                  <span
                    className="gw-branch"
                    style={{ '--hue': LANE_HUES[role.lane % LANE_HUES.length] }}
                  >
                    {role.company.toLowerCase().replace(/[^a-z]+/g, '-').slice(0, 18)}
                  </span>
                  <span className="gw-date">{role.date}</span>
                  {role.ongoing && <span className="gw-head-tag">HEAD</span>}
                </p>
                <h3 className="gw-commit-title">
                  <a href={role.url} target="_blank" rel="noopener noreferrer">
                    {role.company}
                  </a>
                  <span className="gw-commit-role">{role.role}</span>
                </h3>
                {role.description ? (
                  <p className="gw-commit-body">{role.description}</p>
                ) : (
                  <p className="gw-commit-body gw-empty">
                    No description yet — this branch is still open.
                  </p>
                )}
                {role.skills.length > 0 && (
                  <p className="gw-commit-tech">{role.skills.join('  ·  ')}</p>
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="gw-releases" id="projects">
        <h2 className="gw-section-title">
          <span className="gw-prompt">$</span> git tag --list
        </h2>

        <div className="gw-release-grid">
          {projectsData.map((project, index) => (
            <article className="gw-release" key={project.id}>
              <figure className="gw-release-shot">
                <img src={`/${project.image}`} alt={project.title} loading="lazy" />
              </figure>
              <p className="gw-release-tag">v{index + 1}.0</p>
              <h3>{project.title}</h3>
              <p className="gw-release-body">{project.description}</p>
              <p className="gw-release-tech">{project.technologies.join('  ·  ')}</p>
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                view source →
              </a>
            </article>
          ))}
        </div>
      </section>

      <footer className="gw-foot">
        <p>
          <span className="gw-prompt">$</span> cat PAPER.md
        </p>
        <p className="gw-foot-paper">
          <a href={PAPER_URL} target="_blank" rel="noopener noreferrer">
            CoVeGAT
          </a>{' '}
          — an NLP/graph-ML pipeline for claim verification. 96% detection
          accuracy on adversarial fabrications.
        </p>
        <p className="gw-foot-sign">
          <span className="gw-prompt">$</span> whoami — Max Bader ·{' '}
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
        </p>
      </footer>
    </div>
  );
};

export default GraphWorld;
