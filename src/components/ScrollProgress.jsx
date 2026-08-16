import React, { useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap';

/** Accent bar across the top of the page tracking read progress. */
const ScrollProgress = () => {
  const barRef = useRef(null);

  useGSAP(() => {
    // Scrubbed rather than listener-driven: ScrollTrigger reads scroll once
    // per frame for every trigger on the page instead of once per handler.
    //
    // Deliberately not behind a reduced-motion check — this reports scroll
    // position, like a scrollbar, rather than adding decorative movement.
    gsap.to(barRef.current, {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: document.documentElement,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true
      }
    });
  });

  return (
    <div className="scroll-progress" aria-hidden="true">
      <div className="scroll-progress-bar" ref={barRef} />
    </div>
  );
};

export default ScrollProgress;
