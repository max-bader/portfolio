import React, { useRef } from 'react';
import { gsap, motionContext, useGSAP } from '../lib/gsap';

/**
 * Section heading that wipes in from the left as it enters view.
 *
 * A wipe rather than a per-character SplitText on purpose: these headings use
 * background-clip:text for the accent gradient, and splitting them into
 * transformed spans makes each character clip its own copy of the gradient.
 */
const SectionTitle = ({ children, className = '' }) => {
  const ref = useRef(null);

  useGSAP(
    () => {
      motionContext(ref, (context) => {
        if (!context.conditions.motion) return;

        gsap.fromTo(
          ref.current,
          { clipPath: 'inset(0 100% 0 0)', y: 20 },
          {
            clipPath: 'inset(0 0% 0 0)',
            y: 0,
            duration: 1.1,
            ease: 'power3.out',
            scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true }
          }
        );
      });
    },
    { scope: ref }
  );

  return (
    <h2 ref={ref} className={`section-title ${className}`.trim()}>
      {children}
    </h2>
  );
};

export default SectionTitle;
