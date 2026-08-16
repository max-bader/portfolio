import React, { useRef } from 'react';
import { gsap, useGSAP } from '../../lib/gsap';

const ALPHABET = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/-.·&@';

/**
 * A run of split-flap cells that clacks through the alphabet to its word.
 *
 * Each cell steps through real intermediate characters rather than fading —
 * a board's whole character is that you can read the wrong letters on the way.
 * Cells further right take longer, which is what produces the ripple.
 */
const SplitFlap = ({ text, className = '', start = 'top 85%', cellDelay = 0.055 }) => {
  const ref = useRef(null);
  const chars = String(text).toUpperCase().split('');

  useGSAP(
    () => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduced) return;

      const cells = gsap.utils.toArray('.sf-cell-face', ref.current);

      cells.forEach((cell, index) => {
        const target = cell.dataset.char;
        if (target === ' ') return;

        const landing = Math.max(ALPHABET.indexOf(target), 0);
        // Always travel at least a full revolution so the flap reads mechanical.
        const travel = ALPHABET.length + landing;
        const counter = { step: 0 };

        cell.textContent = ALPHABET[0];

        gsap.to(counter, {
          step: travel,
          duration: 0.5 + index * cellDelay,
          ease: `steps(${travel})`,
          scrollTrigger: { trigger: ref.current, start, once: true },
          onUpdate: () => {
            cell.textContent = ALPHABET[Math.round(counter.step) % ALPHABET.length];
          },
          onComplete: () => {
            cell.textContent = target;
          }
        });
      });
    },
    { scope: ref, dependencies: [text] }
  );

  return (
    <span className={`sf ${className}`.trim()} ref={ref} aria-label={text}>
      {chars.map((char, index) => (
        <span className="sf-cell" key={`${char}-${index}`} aria-hidden="true">
          <span className="sf-cell-face" data-char={char}>
            {char}
          </span>
          <span className="sf-hinge" />
        </span>
      ))}
    </span>
  );
};

export default SplitFlap;
