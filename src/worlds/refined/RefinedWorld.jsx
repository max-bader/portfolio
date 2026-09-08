import React, { useCallback, useEffect, useRef, useState } from 'react';
import { gsap, motionContext, SplitText, useGSAP } from '../../lib/gsap';
import { rolesNewestFirst } from '../../lib/timeline';
import { projectsData } from '../../data/projects';
import { EMAIL, GITHUB_URL, LINKEDIN_URL, PAPER_URL, RESUME_URL } from '../../lib/links';
import Icon from '../../components/Icon';
import { ICONS } from '../../lib/icons';
import CareerChart from '../../components/CareerChart';
import CommandPalette from '../../components/CommandPalette';
import ScrollProgress from '../../components/ScrollProgress';
import ThemeToggle from '../../components/ThemeToggle';
import Toast from '../../components/Toast';
import { notify } from '../../lib/toast';
import './refined.css';

/**
 * World: refined.
 *
 * Restraint by subtraction, not by shrinking. Type is large and high
 * contrast; the discipline is in how few things are on the page and how much
 * air surrounds them. One typeface, one accent, one shadow, no boxes.
 *
 * Motion follows Emil Kowalski's rules: short, ease-out, small distances,
 * blur resolving to sharp.
 *
 * Two treatments, split by what the thing is. Headline type is set line by
 * line behind a mask, because type arriving as type is the one flourish that
 * argues for the craft rather than decorating it. Everything else — the
 * portrait, the links, the CV entries, the work — keeps the quieter fade, so
 * the reveal stays rare enough to mean something.
 *
 * The rest of the motion here answers to the pointer or to the data, never to
 * a timer: the chart and the CV are one linked view, the screenshots drift
 * against their frames at the rate the page is scrolled, and the links lean
 * the few pixels that make a flat page feel physical.
 */

const ENTER = { duration: 0.45, ease: 'power2.out' };

/* Masked line reveal. `mask: 'lines'` gives each line its own clipping box, so
   this moves a transform instead of repainting a blur every frame.
   `autoSplit` re-splits when the font lands or the column reflows, and the
   tween returned from `onSplit` is re-synced on each of those, so a resize
   cannot strand a half-revealed headline. `aria: 'auto'` keeps the original
   string on the element — without it a screen reader spells out the lines. */
const setLines = (target, vars) =>
  SplitText.create(target, {
    type: 'lines',
    mask: 'lines',
    autoSplit: true,
    aria: 'auto',
    onSplit: (self) =>
      gsap.from(self.lines, {
        yPercent: 110,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.08,
        ...vars
      })
  });

/* Elements lean towards the cursor and spring back when it leaves. The travel
   is a fraction of the distance to the centre, so nothing ever detaches from
   where it is supposed to sit — it is the difference between a target that
   acknowledges the pointer and one that chases it. */
const magnetise = (elements, strength) => {
  const undo = [];

  elements.forEach((el) => {
    const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });

    const follow = (event) => {
      const box = el.getBoundingClientRect();
      xTo((event.clientX - (box.left + box.width / 2)) * strength);
      yTo((event.clientY - (box.top + box.height / 2)) * strength);
    };
    const release = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener('pointermove', follow);
    el.addEventListener('pointerleave', release);
    undo.push(() => {
      el.removeEventListener('pointermove', follow);
      el.removeEventListener('pointerleave', release);
    });
  });

  return () => undo.forEach((fn) => fn());
};

/* Where the cursor is, as a percentage of the card, for the sheen the CSS
   draws over the screenshot. Written straight to custom properties: this runs
   on every pointer move, and a tween would only add lag to a value that is
   already a direct reading of the pointer. */
const trackPointer = (elements) => {
  const undo = [];

  elements.forEach((el) => {
    const follow = (event) => {
      const box = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${((event.clientX - box.left) / box.width) * 100}%`);
      el.style.setProperty('--my', `${((event.clientY - box.top) / box.height) * 100}%`);
    };

    el.addEventListener('pointermove', follow);
    undo.push(() => el.removeEventListener('pointermove', follow));
  });

  return () => undo.forEach((fn) => fn());
};

const RefinedWorld = () => {
  const root = useRef(null);
  const [lit, setLit] = useState(null);
  const flash = useRef(0);

  /* One role at a time is "the one being looked at", whether that came from
     the chart, the list, or the palette. Pointer sources clear themselves;
     the palette sets a lamp that has to time out. */
  const highlightRole = useCallback((id) => {
    setLit(id);
    clearTimeout(flash.current);
    flash.current = setTimeout(() => setLit(null), 1800);
  }, []);

  useEffect(() => () => clearTimeout(flash.current), []);

  useGSAP(
    () => {
      motionContext(root, (context) => {
        if (!context.conditions.motion) return;

        // The opening, sequenced by hand. A stagger across the whole header
        // cannot express this: the name has to finish arriving before the
        // links show up, and the split tweens carry their own durations.
        gsap.from('.rf-avatar', { opacity: 0, y: 10, filter: 'blur(6px)', ...ENTER });
        setLines('.rf-open h1', { delay: 0.12 });
        setLines('.rf-standfirst', { delay: 0.26, duration: 0.6 });
        gsap.from('.rf-action', {
          opacity: 0,
          y: 10,
          filter: 'blur(6px)',
          stagger: 0.06,
          delay: 0.46,
          ...ENTER
        });

        // Section headings and the closer, set as they come into view.
        gsap.utils.toArray('.rf-headline').forEach((el) => {
          setLines(el, {
            scrollTrigger: { trigger: el, start: 'top 90%', once: true }
          });
        });

        gsap.utils.toArray('.rf-reveal').forEach((el) => {
          gsap.from(el, {
            opacity: 0,
            y: 12,
            filter: 'blur(6px)',
            ...ENTER,
            scrollTrigger: { trigger: el, start: 'top 92%', once: true }
          });
        });

        // Screenshots drift against their frames while the card crosses the
        // viewport. The image is cut oversize in CSS so the frame is never
        // short of picture at either end of the travel.
        gsap.utils.toArray('.rf-shot').forEach((frame) => {
          gsap.fromTo(
            frame.querySelector('img'),
            { yPercent: -5 },
            {
              yPercent: 5,
              ease: 'none',
              scrollTrigger: {
                trigger: frame.closest('.rf-piece'),
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
              }
            }
          );
        });

        // Pointer work is for pointers. On touch it would only fire once, on
        // tap, and leave the element stranded off-centre.
        if (!window.matchMedia('(pointer: fine)').matches) return undefined;

        const teardown = [
          magnetise(gsap.utils.toArray('.rf-action'), 0.28),
          magnetise(gsap.utils.toArray('.rf-social a'), 0.35),
          trackPointer(gsap.utils.toArray('.rf-shot'))
        ];

        return () => teardown.forEach((fn) => fn());
      });
    },
    { scope: root }
  );

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      notify(`Copied ${EMAIL}`);
    } catch {
      notify('Copy blocked — select the address instead');
    }
  };

  return (
    <div className="rf" ref={root}>
      <ScrollProgress />

      {/* Identity: the portrait carries the top, not a slogan. */}
      <header className="rf-open">
        <img className="rf-avatar" src="/IMG_5553 copy.png" alt="Max Bader" />
        <h1>Max Bader</h1>
        <p className="rf-standfirst">
          Computer Science at UC Irvine.
        </p>

        <nav className="rf-actions">
          <a className="rf-action" href={`mailto:${EMAIL}`}>
            <Icon path={ICONS.mail} />
            <span>Get in touch</span>
          </a>
          <a className="rf-action" href={RESUME_URL} target="_blank" rel="noopener noreferrer">
            <Icon path={ICONS.doc} />
            <span>Resume</span>
          </a>
          <a className="rf-action" href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
            <Icon path={ICONS.github} />
            <span>GitHub</span>
          </a>
        </nav>
      </header>

      {/* Experience as a set CV: year, then the fact. The chart above it is
          the same six rows read sideways, so the concurrency the list flattens
          is visible before the reading starts. */}
      <section className="rf-cv" id="experience">
        <h2 className="rf-headline">Experience</h2>

        <CareerChart focused={lit} onFocus={setLit} onSelect={highlightRole} />

        <ol>
          {rolesNewestFirst.map((role) => (
            <li
              className="rf-entry rf-reveal"
              key={role.id}
              id={`role-${role.id}`}
              data-lit={lit === role.id || undefined}
              onPointerEnter={() => setLit(role.id)}
              onPointerLeave={() => setLit(null)}
            >
              <span className="rf-when">
                <span className="rf-dates">
                  {role.date}
                  {role.ongoing && <em>Now</em>}
                </span>
              </span>
              <div className="rf-what">
                <h3>
                  <a href={role.url} target="_blank" rel="noopener noreferrer">
                    {role.company}
                  </a>
                  <img className="rf-mark" src={role.logo} alt="" loading="lazy" />
                </h3>
                <p className="rf-title-line">{role.role}</p>
                {role.description && <p className="rf-note">{role.description}</p>}
                {role.skills.length > 0 && (
                  <p className="rf-stack">{role.skills.join('  ·  ')}</p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Work first — the images are the argument. */}
      <section className="rf-work" id="projects">
        <h2 className="rf-headline">Selected work</h2>

        {projectsData.map((project, index) => (
          <a
            className="rf-piece rf-reveal"
            key={project.id}
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <figure className="rf-shot">
              <img src={`/${project.image}`} alt="" loading="lazy" />
              <span className="rf-sheen" aria-hidden="true" />
            </figure>
            <div className="rf-piece-text">
              <span className="rf-num">{String(index + 1).padStart(2, '0')}</span>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <span className="rf-stack">{project.technologies.slice(0, 5).join('  ·  ')}</span>
              <span className="rf-go">
                View source
                <Icon path={ICONS.arrow} />
              </span>
            </div>
          </a>
        ))}
      </section>

      <section className="rf-cv" id="research">
        <h2 className="rf-headline">Research</h2>
        <ol>
          <li className="rf-entry rf-reveal">
            <span className="rf-when">First author</span>
            <div className="rf-what">
              <h3>
                <a href={PAPER_URL} target="_blank" rel="noopener noreferrer">CoVeGAT</a>
              </h3>
              <p className="rf-title-line">Claim verification with graph ML</p>
              <p className="rf-note">
                An NLP and graph-ML pipeline with a 1K citation-alignment dataset
                built to stress-test factual accuracy in large language models.
                96% detection accuracy on adversarial fabrications.
              </p>
            </div>
          </li>
        </ol>
      </section>

      <footer className="rf-close" id="contact">
        <h2 className="rf-headline">Let&rsquo;s talk.</h2>
        <p className="rf-mail-row rf-reveal">
          <a className="rf-mail" href={`mailto:${EMAIL}`}>{EMAIL}</a>
          <button type="button" className="rf-copy" onClick={copyEmail} title="Copy address">
            <Icon path={ICONS.copy} label="Copy email address" />
          </button>
        </p>
        <nav className="rf-social rf-reveal">
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
            <Icon path={ICONS.github} label="GitHub" />
          </a>
          <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
            <Icon path={ICONS.linkedin} label="LinkedIn" />
          </a>
          <a href={RESUME_URL} target="_blank" rel="noopener noreferrer">
            <Icon path={ICONS.doc} label="Resume" />
          </a>
        </nav>
      </footer>

      {/* Persistent controls, out of the reading column. */}
      <div className="rf-floats">
        <ThemeToggle />
        <CommandPalette onHighlightRole={highlightRole} />
      </div>

      <Toast />
    </div>
  );
};

export default RefinedWorld;
