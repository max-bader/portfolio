import React, { useEffect, useState } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

const TYPE_MS = 55;
const DELETE_MS = 28;
const HOLD_MS = 1900;

/** Types each phrase out, holds, deletes, moves on. */
const TypeRotator = ({ phrases, className = '' }) => {
  const reducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [length, setLength] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (reducedMotion) return undefined;

    const phrase = phrases[index % phrases.length];

    if (!deleting && length === phrase.length) {
      const id = window.setTimeout(() => setDeleting(true), HOLD_MS);
      return () => window.clearTimeout(id);
    }

    if (deleting && length === 0) {
      setDeleting(false);
      setIndex((i) => (i + 1) % phrases.length);
      return undefined;
    }

    const id = window.setTimeout(
      () => setLength((l) => l + (deleting ? -1 : 1)),
      deleting ? DELETE_MS : TYPE_MS
    );
    return () => window.clearTimeout(id);
  }, [phrases, index, length, deleting, reducedMotion]);

  if (reducedMotion) {
    return <span className={className}>{phrases[0]}</span>;
  }

  return (
    <span className={className}>
      {phrases[index % phrases.length].slice(0, length)}
      <span className="type-caret" aria-hidden="true" />
    </span>
  );
};

export default TypeRotator;
