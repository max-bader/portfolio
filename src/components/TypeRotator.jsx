import React, { useRef } from 'react';
import { gsap, motionContext, useGSAP } from '../lib/gsap';

const TYPE_PER_CHAR = 0.055;
const DELETE_PER_CHAR = 0.028;
const HOLD = 1.9;

/**
 * Types each phrase out, holds, deletes, moves on — as one looping timeline
 * rather than a chain of setTimeouts, so it can be delayed to land after the
 * hero entrance and is paused/killed as a unit.
 */
const TypeRotator = ({ phrases, className = '', delay = 0 }) => {
  const textRef = useRef(null);

  useGSAP(
    () => {
      motionContext(textRef, (context) => {
        // Reduced motion keeps the first phrase, already in the markup.
        if (!context.conditions.motion) return;

        const tl = gsap.timeline({ repeat: -1, delay });
        tl.set(textRef.current, { text: '' });

        phrases.forEach((phrase) => {
          tl.to(textRef.current, {
            duration: phrase.length * TYPE_PER_CHAR,
            text: { value: phrase, delimiter: '' },
            ease: 'none'
          })
            .to({}, { duration: HOLD })
            .to(textRef.current, {
              duration: phrase.length * DELETE_PER_CHAR,
              text: { value: '', delimiter: '' },
              ease: 'none'
            });
        });
      });
    },
    { scope: textRef, dependencies: [phrases, delay] }
  );

  return (
    <span className={className}>
      {/* Seeded with the first phrase so no-JS and screen readers get text. */}
      <span ref={textRef}>{phrases[0]}</span>
      <span className="type-caret" aria-hidden="true" />
    </span>
  );
};

export default TypeRotator;
