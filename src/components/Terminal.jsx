import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { commandNames, runCommand } from '../lib/commands';
import { applyAccent, applyTheme } from '../lib/theme';
import '../assets/styles/Terminal.css';

let lineId = 0;
const makeLine = (text, tone = 'default', kind = 'output') => ({
  id: (lineId += 1),
  text,
  tone,
  kind
});

const bootLines = () => [
  makeLine('portfolio-sh 1.0 — max@portfolio', 'accent'),
  makeLine("Type `help` for commands, or `neofetch` if you're in a hurry.", 'muted'),
  makeLine('')
];

const PROMPT = 'max@portfolio ~ %';

/**
 * A real (if small) shell living on the site. Commands read from the same data
 * that renders the page, so the terminal can never drift out of date.
 */
const Terminal = ({ open, onClose, onMatrix }) => {
  const [history, setHistory] = useState(bootLines);
  const [input, setInput] = useState('');
  const [past, setPast] = useState([]);
  const [pastIndex, setPastIndex] = useState(-1);

  const inputRef = useRef(null);
  const bodyRef = useRef(null);
  const names = useMemo(() => commandNames(), []);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [history, open]);

  const submit = useCallback(
    (value) => {
      const trimmed = value.trim();
      const echo = makeLine(`${PROMPT} ${trimmed}`, 'default', 'input');

      if (!trimmed) {
        setHistory((prev) => [...prev, echo]);
        return;
      }

      let cleared = false;
      const ctx = {
        clear: () => {
          cleared = true;
        },
        close: onClose,
        openUrl: (url) => window.open(url, '_blank', 'noopener,noreferrer'),
        copy: (text) => navigator.clipboard?.writeText(text),
        navigate: (id) => {
          onClose();
          document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        },
        setAccent: (id) => applyAccent(id),
        setAppearance: (mode) => applyTheme(mode),
        matrix: () => {
          onClose();
          onMatrix();
        }
      };

      const output = runCommand(trimmed, ctx).map((l) => makeLine(l.text, l.tone));

      setHistory((prev) => (cleared ? [] : [...prev, echo, ...output]));
      setPast((prev) => [...prev, trimmed]);
      setPastIndex(-1);
    },
    [onClose, onMatrix]
  );

  const onKeyDown = (event) => {
    if (event.key === 'Enter') {
      submit(input);
      setInput('');
      return;
    }

    if (event.key === 'Tab') {
      event.preventDefault();
      const [head, ...rest] = input.split(/\s+/);
      if (rest.length || !head) return;
      const match = names.find((name) => name.startsWith(head.toLowerCase()));
      if (match) setInput(match);
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (!past.length) return;
      const next = pastIndex < 0 ? past.length - 1 : Math.max(0, pastIndex - 1);
      setPastIndex(next);
      setInput(past[next]);
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (pastIndex < 0) return;
      const next = pastIndex + 1;
      if (next >= past.length) {
        setPastIndex(-1);
        setInput('');
      } else {
        setPastIndex(next);
        setInput(past[next]);
      }
    }
  };

  if (!open) return null;

  return (
    <div className="terminal-backdrop" onMouseDown={onClose}>
      <div
        className="terminal-window"
        role="dialog"
        aria-modal="true"
        aria-label="Interactive terminal"
        onMouseDown={(event) => event.stopPropagation()}
        onClick={() => inputRef.current?.focus()}
      >
        <div className="terminal-titlebar">
          <span className="terminal-dots">
            <button
              type="button"
              className="terminal-dot terminal-dot-close"
              onClick={onClose}
              aria-label="Close terminal"
            />
            <span className="terminal-dot terminal-dot-min" />
            <span className="terminal-dot terminal-dot-max" />
          </span>
          <span className="terminal-title">max@portfolio — zsh</span>
          <span className="terminal-hint">esc</span>
        </div>

        <div className="terminal-body" ref={bodyRef}>
          {history.map((entry) => (
            <pre key={entry.id} className={`terminal-line tone-${entry.tone}`}>
              {entry.text || ' '}
            </pre>
          ))}

          <div className="terminal-input-row">
            <span className="terminal-prompt">{PROMPT}</span>
            <input
              ref={inputRef}
              className="terminal-input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={onKeyDown}
              spellCheck="false"
              autoComplete="off"
              autoCapitalize="off"
              aria-label="Terminal input"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terminal;
