import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import { rolesNewestFirst } from '../lib/timeline';
import { projectsData } from '../data/projects';
import { EMAIL, GITHUB_URL, LINKEDIN_URL, PAPER_URL, RESUME_URL } from '../lib/links';
import { getTheme, toggleTheme, useTheme } from '../lib/theme';
import Icon from './Icon';
import { ICONS } from '../lib/icons';
import { notify } from '../lib/toast';

/**
 * Command palette.
 *
 * A recruiter reading in a burst of tabs is already keyboard-first; this is
 * the fastest route from "what did he do at CodeHS" to that entry, and from
 * anywhere on the page to the resume. It indexes the same data the page
 * renders, so it can never offer a command for something that is not here.
 */

const still = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const goTo = (selector) => {
  const target = document.querySelector(selector);
  if (!target) return;
  window.scrollTo({
    top: target.getBoundingClientRect().top + window.scrollY - 28,
    behavior: still() ? 'auto' : 'smooth'
  });
};

const copy = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    notify(`Copied ${text}`);
  } catch {
    notify('Copy blocked — select the address instead');
  }
};

/**
 * Subsequence match with two bonuses: characters that land on a word start,
 * and characters that continue a run. "cds" finds CodeHS; "tsc" finds
 * TypeScript. No match at all returns -1 rather than 0, so a zero-scoring
 * exact-but-boring hit still ranks above nothing.
 */
const score = (haystack, needle) => {
  if (!needle) return 0;
  const text = haystack.toLowerCase();
  let cursor = 0;
  let total = 0;
  let run = 0;

  for (const char of needle.toLowerCase()) {
    if (char === ' ') continue;
    const at = text.indexOf(char, cursor);
    if (at === -1) return -1;

    let point = 1;
    if (at === cursor && cursor > 0) {
      run += 1;
      point += run * 3;
    } else {
      run = 0;
    }
    if (at === 0 || /[\s\-–—·(/,.]/.test(text[at - 1])) point += 8;
    total += point - Math.min(at - cursor, 4);
    cursor = at + 1;
  }

  return Math.max(total, 0);
};

const CommandPalette = ({ onHighlightRole }) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);

  const scrim = useRef(null);
  const panel = useRef(null);
  const list = useRef(null);
  const launcher = useRef(null);
  const restoreTo = useRef(null);
  const leaving = useRef(false);

  const commands = useMemo(() => {
    const items = [
      {
        id: 'go-experience',
        group: 'Jump to',
        label: 'Experience',
        icon: ICONS.section,
        keywords: 'work history cv roles timeline',
        run: () => goTo('#experience')
      },
      {
        id: 'go-projects',
        group: 'Jump to',
        label: 'Selected work',
        icon: ICONS.section,
        keywords: 'projects portfolio builds',
        run: () => goTo('#projects')
      },
      {
        id: 'go-research',
        group: 'Jump to',
        label: 'Research',
        icon: ICONS.section,
        keywords: 'paper covegat publication',
        run: () => goTo('#research')
      },
      {
        id: 'go-contact',
        group: 'Jump to',
        label: 'Contact',
        icon: ICONS.section,
        keywords: 'email reach hire talk',
        run: () => goTo('#contact')
      }
    ];

    rolesNewestFirst.forEach((role) => {
      items.push({
        id: `role-${role.id}`,
        group: 'Roles',
        label: role.company,
        hint: role.role,
        icon: ICONS.briefcase,
        keywords: `${role.role} ${role.date} ${role.skills.join(' ')}`,
        run: () => {
          goTo(`#role-${role.id}`);
          onHighlightRole(role.id);
        }
      });
    });

    projectsData.forEach((project) => {
      items.push({
        id: `project-${project.id}`,
        group: 'Work',
        label: project.title,
        hint: 'Open source',
        icon: ICONS.cube,
        keywords: project.technologies.join(' '),
        run: () => window.open(project.githubUrl, '_blank', 'noopener,noreferrer')
      });
    });

    items.push(
      {
        id: 'link-resume',
        group: 'Open',
        label: 'Resume',
        hint: 'PDF',
        icon: ICONS.doc,
        keywords: 'cv download pdf',
        run: () => window.open(RESUME_URL, '_blank', 'noopener,noreferrer')
      },
      {
        id: 'link-paper',
        group: 'Open',
        label: 'CoVeGAT paper',
        hint: 'PDF',
        icon: ICONS.doc,
        keywords: 'research claim verification graph ml first author',
        run: () => window.open(PAPER_URL, '_blank', 'noopener,noreferrer')
      },
      {
        id: 'link-github',
        group: 'Open',
        label: 'GitHub',
        hint: 'max-bader',
        icon: ICONS.github,
        keywords: 'code source repositories',
        run: () => window.open(GITHUB_URL, '_blank', 'noopener,noreferrer')
      },
      {
        id: 'link-linkedin',
        group: 'Open',
        label: 'LinkedIn',
        hint: 'max-bader',
        icon: ICONS.linkedin,
        keywords: 'profile social',
        run: () => window.open(LINKEDIN_URL, '_blank', 'noopener,noreferrer')
      },
      {
        id: 'do-email',
        group: 'Do',
        label: 'Email Max',
        hint: EMAIL,
        icon: ICONS.mail,
        keywords: 'contact write mailto',
        run: () => {
          window.location.href = `mailto:${EMAIL}`;
        }
      },
      {
        id: 'do-copy',
        group: 'Do',
        label: 'Copy email address',
        hint: EMAIL,
        icon: ICONS.copy,
        keywords: 'clipboard address',
        run: () => copy(EMAIL)
      },
      {
        id: 'do-theme',
        group: 'Do',
        label: 'Switch appearance',
        hint: 'Light and dark',
        icon: theme === 'dark' ? ICONS.sun : ICONS.moon,
        keywords: 'theme dark light mode night',
        run: () => {
          // The swap is deferred behind a view transition, so the label is
          // read off the value going in rather than the one coming out.
          const next = getTheme() === 'dark' ? 'Light' : 'Dark';
          toggleTheme();
          notify(next);
        }
      }
    );

    return items;
  }, [onHighlightRole, theme]);

  const results = useMemo(() => {
    const term = query.trim();
    if (!term) return commands;
    return commands
      .map((item) => ({
        item,
        rank: Math.max(
          score(item.label, term),
          score(`${item.label} ${item.hint ?? ''} ${item.keywords ?? ''}`, term) - 4
        )
      }))
      .filter((row) => row.rank >= 0)
      .sort((a, b) => b.rank - a.rank)
      .map((row) => row.item);
  }, [commands, query]);

  const close = useCallback(() => {
    if (leaving.current) return;
    const finish = () => {
      leaving.current = false;
      setOpen(false);
      setQuery('');
      setActive(0);
    };

    if (still() || !panel.current) {
      finish();
      return;
    }

    leaving.current = true;
    gsap.to(panel.current, { opacity: 0, y: -8, scale: 0.985, duration: 0.15, ease: 'power2.in' });
    gsap.to(scrim.current, { opacity: 0, duration: 0.15 });
    // Unmounted on a wall clock rather than the tween's onComplete: GSAP runs
    // on requestAnimationFrame, which a hidden tab stops firing, and a panel
    // that cannot be dismissed while backgrounded is worse than one whose exit
    // is occasionally not seen.
    setTimeout(finish, 160);
  }, []);

  const run = useCallback(
    (item) => {
      close();
      // After the exit tween, so a smooth scroll is not fighting a fade.
      setTimeout(() => item.run(), still() ? 0 : 160);
    },
    [close]
  );

  // Global shortcut. Cmd/Ctrl+K anywhere; "/" only when not already typing.
  useEffect(() => {
    const onKey = (event) => {
      const typing = /^(input|textarea|select)$/i.test(event.target?.tagName ?? '');

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        if (open) close();
        else setOpen(true);
        return;
      }

      if (event.key === '/' && !typing && !open) {
        event.preventDefault();
        setOpen(true);
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [close, open]);

  // The page must not scroll behind the panel, and focus has to come back to
  // whatever opened it.
  useEffect(() => {
    if (!open) return undefined;
    restoreTo.current = document.activeElement;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => setActive(0), [query]);

  /* Focus goes back where it came from — but if the palette was opened from
     the launcher, that button no longer exists by the time this runs, because
     it is what the panel replaced. Restoring after the commit means the new
     launcher is mounted and can take the focus instead of dropping it on the
     body. */
  useEffect(() => {
    if (open || !restoreTo.current) return;
    const back = restoreTo.current.isConnected ? restoreTo.current : launcher.current;
    back?.focus?.();
    restoreTo.current = null;
  }, [open]);

  // Keep the highlighted row on screen when arrowing past the fold.
  useEffect(() => {
    if (!open) return;
    list.current
      ?.querySelector('[data-active="true"]')
      ?.scrollIntoView({ block: 'nearest' });
  }, [active, open, results]);

  useGSAP(
    () => {
      if (!open || still()) return;
      gsap.from(scrim.current, { opacity: 0, duration: 0.2, ease: 'power2.out' });
      gsap.from(panel.current, {
        opacity: 0,
        y: -10,
        scale: 0.975,
        filter: 'blur(6px)',
        duration: 0.3,
        ease: 'power3.out'
      });
      gsap.from('.rf-cmd-row', {
        opacity: 0,
        y: 6,
        duration: 0.28,
        ease: 'power2.out',
        stagger: 0.016,
        delay: 0.05
      });
    },
    { dependencies: [open], scope: panel }
  );

  const onPanelKey = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }
    if (event.key === 'ArrowDown' || (event.key === 'Tab' && !event.shiftKey)) {
      event.preventDefault();
      setActive((i) => (results.length ? (i + 1) % results.length : 0));
      return;
    }
    if (event.key === 'ArrowUp' || (event.key === 'Tab' && event.shiftKey)) {
      event.preventDefault();
      setActive((i) => (results.length ? (i - 1 + results.length) % results.length : 0));
      return;
    }
    if (event.key === 'Enter' && results[active]) {
      event.preventDefault();
      run(results[active]);
    }
  };

  if (!open) {
    return (
      <button
        type="button"
        className="rf-cmd-open"
        ref={launcher}
        onClick={() => setOpen(true)}
      >
        <Icon path={ICONS.search} />
        <span>Search</span>
        <kbd>
          <Icon path={ICONS.command} className="rf-kbd-glyph" />K
        </kbd>
      </button>
    );
  }

  // Headings belong to the browse view. Once a query ranks the results, the
  // best match for "re" is a section, a link and an action in that order —
  // reprinting a heading before each one turns five rows into ten.
  const grouped = query.trim() === '';
  let lastGroup = null;

  return (
    <div className="rf-cmd" onKeyDown={onPanelKey}>
      <div className="rf-cmd-scrim" ref={scrim} onClick={close} />

      <div
        className="rf-cmd-panel"
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label="Search this site"
      >
        <div className="rf-cmd-field">
          <Icon path={ICONS.search} />
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search roles, work, links…"
            aria-label="Search roles, work and links"
            role="combobox"
            aria-expanded="true"
            aria-controls="rf-cmd-list"
            aria-activedescendant={results[active] ? `rf-cmd-${results[active].id}` : undefined}
            autoComplete="off"
            spellCheck="false"
          />
          <button type="button" className="rf-cmd-esc" onClick={close}>
            Esc
          </button>
        </div>

        <div className="rf-cmd-list" id="rf-cmd-list" role="listbox" ref={list}>
          {results.length === 0 && <p className="rf-cmd-empty">Nothing matches “{query}”.</p>}

          {results.map((item, index) => {
            const heading = grouped && item.group !== lastGroup ? item.group : null;
            lastGroup = item.group;

            return (
              <React.Fragment key={item.id}>
                {heading && <p className="rf-cmd-group">{heading}</p>}
                <button
                  type="button"
                  id={`rf-cmd-${item.id}`}
                  className="rf-cmd-row"
                  role="option"
                  aria-selected={index === active}
                  data-active={index === active}
                  tabIndex={-1}
                  onPointerMove={() => setActive(index)}
                  onClick={() => run(item)}
                >
                  <Icon path={item.icon} />
                  <span className="rf-cmd-label">{item.label}</span>
                  {item.hint && <span className="rf-cmd-hint">{item.hint}</span>}
                  <Icon path={ICONS.enter} className="rf-icon rf-cmd-enter" />
                </button>
              </React.Fragment>
            );
          })}
        </div>

        <footer className="rf-cmd-foot">
          <span>
            <kbd>↑</kbd>
            <kbd>↓</kbd> move
          </span>
          <span>
            <kbd>↵</kbd> open
          </span>
          <span>
            <kbd>esc</kbd> close
          </span>
        </footer>
      </div>
    </div>
  );
};

export default CommandPalette;
