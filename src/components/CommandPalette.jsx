import React, { useEffect, useMemo, useRef, useState } from 'react';
import { projectsData } from '../data/projects';
import { EMAIL, PAPER_URL, RESUME_URL } from '../lib/commands';
import { accents, applyAccent } from '../lib/theme';
import '../assets/styles/CommandPalette.css';

/**
 * Subsequence match with a bonus for consecutive hits and word starts.
 * Returns -1 when the query doesn't fit at all.
 */
const score = (query, text) => {
  if (!query) return 0;
  const q = query.toLowerCase();
  const t = text.toLowerCase();

  let qi = 0;
  let streak = 0;
  let total = 0;

  for (let i = 0; i < t.length && qi < q.length; i += 1) {
    if (t[i] !== q[qi]) {
      streak = 0;
      continue;
    }
    streak += 1;
    total += streak * 2;
    if (i === 0 || t[i - 1] === ' ') total += 4;
    qi += 1;
  }

  return qi === q.length ? total : -1;
};

const openUrl = (url) => window.open(url, '_blank', 'noopener,noreferrer');

const CommandPalette = ({ open, onClose, onOpenTerminal, onMatrix }) => {
  const [query, setQuery] = useState('');
  const [cursor, setCursor] = useState(0);
  const [toast, setToast] = useState('');

  const inputRef = useRef(null);
  const listRef = useRef(null);

  const actions = useMemo(() => {
    const scrollTo = (id) => () => {
      onClose();
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    return [
      { id: 'nav-home', group: 'Navigate', label: 'Go to Home', icon: 'fas fa-house', run: scrollTo('home') },
      { id: 'nav-exp', group: 'Navigate', label: 'Go to Experience & Research', icon: 'fas fa-briefcase', run: scrollTo('experience') },
      { id: 'nav-work', group: 'Navigate', label: 'Go to Projects', icon: 'fas fa-code', run: scrollTo('projects') },

      {
        id: 'terminal',
        group: 'Actions',
        label: 'Launch the terminal',
        hint: 'Try `neofetch`',
        icon: 'fas fa-terminal',
        run: () => {
          onClose();
          onOpenTerminal();
        }
      },
      {
        id: 'resume',
        group: 'Actions',
        label: 'Open resume',
        icon: 'fas fa-file-alt',
        run: () => openUrl(RESUME_URL)
      },
      {
        id: 'paper',
        group: 'Actions',
        label: 'Read CoVeGAT paper',
        icon: 'fas fa-file-pdf',
        run: () => openUrl(PAPER_URL)
      },
      {
        id: 'email',
        group: 'Actions',
        label: 'Copy email address',
        hint: EMAIL,
        icon: 'fas fa-envelope',
        keepOpen: true,
        run: () => {
          navigator.clipboard?.writeText(EMAIL);
          setToast('Email copied');
        }
      },
      {
        id: 'github',
        group: 'Actions',
        label: 'Open GitHub profile',
        icon: 'fab fa-github',
        run: () => openUrl('https://github.com/max-bader')
      },
      {
        id: 'linkedin',
        group: 'Actions',
        label: 'Open LinkedIn profile',
        icon: 'fab fa-linkedin',
        run: () => openUrl('https://linkedin.com/in/max-bader')
      },

      ...projectsData.map((project) => ({
        id: `project-${project.id}`,
        group: 'Projects',
        label: project.title,
        hint: project.technologies.slice(0, 3).join(' · '),
        icon: 'fas fa-arrow-up-right-from-square',
        run: () => openUrl(project.githubUrl)
      })),

      ...accents.map((accent) => ({
        id: `accent-${accent.id}`,
        group: 'Theme',
        label: `Accent: ${accent.label}`,
        icon: 'fas fa-palette',
        swatch: accent.base,
        keepOpen: true,
        run: () => {
          applyAccent(accent.id);
          setToast(`${accent.label} accent`);
        }
      })),

      {
        id: 'matrix',
        group: 'Theme',
        label: 'Enter the matrix',
        icon: 'fas fa-wand-magic-sparkles',
        run: () => {
          onClose();
          onMatrix();
        }
      }
    ];
  }, [onClose, onOpenTerminal, onMatrix]);

  const results = useMemo(() => {
    if (!query.trim()) return actions;
    return actions
      .map((action) => ({
        action,
        rank: Math.max(
          score(query.trim(), action.label),
          score(query.trim(), `${action.group} ${action.label}`) - 2
        )
      }))
      .filter((entry) => entry.rank >= 0)
      .sort((a, b) => b.rank - a.rank)
      .map((entry) => entry.action);
  }, [actions, query]);

  useEffect(() => {
    setCursor(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    setQuery('');
    setToast('');
    // Focus after the panel has mounted so the caret lands correctly.
    const id = window.requestAnimationFrame(() => inputRef.current?.focus());
    return () => window.cancelAnimationFrame(id);
  }, [open]);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(''), 1600);
    return () => window.clearTimeout(id);
  }, [toast]);

  // Esc has to work even when focus has moved to one of the result buttons.
  useEffect(() => {
    if (!open) return;
    const onKey = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    listRef.current
      ?.querySelector('[data-active="true"]')
      ?.scrollIntoView({ block: 'nearest' });
  }, [cursor, results]);

  if (!open) return null;

  const choose = (action) => {
    if (!action) return;
    action.run();
    if (!action.keepOpen) onClose();
  };

  const onKeyDown = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      onClose();
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setCursor((c) => (results.length ? (c + 1) % results.length : 0));
      return;
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setCursor((c) => (results.length ? (c - 1 + results.length) % results.length : 0));
      return;
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      choose(results[cursor]);
    }
  };

  let lastGroup = null;

  return (
    <div className="palette-backdrop" onMouseDown={onClose}>
      <div
        className="palette"
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="palette-search">
          <i className="fas fa-magnifying-glass" aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search sections, projects, actions…"
            aria-label="Search commands"
            spellCheck="false"
            autoComplete="off"
          />
          <kbd>esc</kbd>
        </div>

        <div className="palette-results" ref={listRef}>
          {results.length === 0 && (
            <p className="palette-empty">Nothing matches “{query}”.</p>
          )}

          {results.map((action, index) => {
            const showGroup = action.group !== lastGroup;
            lastGroup = action.group;

            return (
              <React.Fragment key={action.id}>
                {showGroup && <p className="palette-group">{action.group}</p>}
                <button
                  type="button"
                  className="palette-item"
                  data-active={index === cursor}
                  onMouseEnter={() => setCursor(index)}
                  onClick={() => choose(action)}
                >
                  {action.swatch ? (
                    <span
                      className="palette-swatch"
                      style={{ background: `rgb(${action.swatch})` }}
                    />
                  ) : (
                    <i className={action.icon} aria-hidden="true" />
                  )}
                  <span className="palette-label">{action.label}</span>
                  {action.hint && <span className="palette-hint">{action.hint}</span>}
                </button>
              </React.Fragment>
            );
          })}
        </div>

        <div className="palette-footer">
          <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
          <span><kbd>↵</kbd> select</span>
          <span className={`palette-toast ${toast ? 'is-visible' : ''}`}>{toast}</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
