import React, { useEffect, useState } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

const NOISE = '!<>-_\\/[]{}=+*^?#$%&@01';
const TICK_MS = 45;
const FRAMES_PER_CHAR = 2;

/**
 * Decodes into its final text on mount, one character at a time.
 * Timer-driven rather than rAF so a background tab still resolves the text
 * instead of freezing mid-scramble.
 */
const ScrambleText = ({ text, className = '' }) => {
  const reducedMotion = useReducedMotion();
  const [display, setDisplay] = useState(reducedMotion ? text : '');

  useEffect(() => {
    if (reducedMotion) {
      setDisplay(text);
      return undefined;
    }

    let frame = 0;

    const id = window.setInterval(() => {
      const revealed = Math.floor(frame / FRAMES_PER_CHAR);

      if (revealed >= text.length) {
        setDisplay(text);
        window.clearInterval(id);
        return;
      }

      setDisplay(
        text
          .split('')
          .map((char, i) => {
            if (char === ' ') return ' ';
            if (i < revealed) return char;
            return NOISE[Math.floor(Math.random() * NOISE.length)];
          })
          .join('')
      );

      frame += 1;
    }, TICK_MS);

    return () => window.clearInterval(id);
  }, [text, reducedMotion]);

  // Once resolved, drop the duplicate so selecting the text copies it cleanly.
  if (display === text) {
    return <span className={className}>{text}</span>;
  }

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{display || ' '}</span>
    </span>
  );
};

export default ScrambleText;
