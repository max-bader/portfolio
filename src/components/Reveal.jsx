import React, { useRef } from 'react';
import { gsap, motionContext, useGSAP } from '../lib/gsap';

/**
 * Fades + lifts its children in the first time they scroll into view.
 *
 * The hidden state lives in the tween rather than in CSS, so markup that
 * never gets JS renders at its final state instead of staying invisible.
 */
const Reveal = ({ children, delay = 0, className = '', ...rest }) => {
  const ref = useRef(null);

  useGSAP(
    () => {
      motionContext(ref, (context) => {
        if (!context.conditions.motion) return;

        gsap.from(ref.current, {
          opacity: 0,
          y: 26,
          duration: 0.7,
          delay: delay / 1000,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 88%',
            once: true
          }
        });
      });
    },
    { scope: ref, dependencies: [delay] }
  );

  return (
    <div ref={ref} className={`reveal ${className}`.trim()} {...rest}>
      {children}
    </div>
  );
};

export default Reveal;
