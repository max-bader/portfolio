import { useEffect, useRef } from 'react';

const SEQUENCE = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'b', 'a'
];

/** Calls back when the visitor types the Konami code. */
export const useKonamiCode = (onUnlock) => {
  const progress = useRef(0);

  useEffect(() => {
    const onKey = (event) => {
      // Don't compete with the palette for arrow keys and letters.
      const target = event.target;
      if (
        target instanceof HTMLElement &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      const expected = SEQUENCE[progress.current];
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;

      if (key !== expected) {
        // A wrong key might still be the start of a fresh attempt.
        progress.current = key === SEQUENCE[0] ? 1 : 0;
        return;
      }

      progress.current += 1;
      if (progress.current === SEQUENCE.length) {
        progress.current = 0;
        onUnlock();
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onUnlock]);
};
