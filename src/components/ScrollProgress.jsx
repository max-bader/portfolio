import React, { useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap';

/**
 * How much is left. A hairline, not a chrome bar: on a page this long the
 * only question it answers is whether scrolling further is worth it.
 */
const ScrollProgress = () => {
  const fill = useRef(null);

  useGSAP(() => {
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    gsap.fromTo(
      fill.current,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: 'none',
        // Scrubbing with a small lag reads as inertia; reduced motion gets the
        // literal one-to-one mapping instead.
        scrollTrigger: { start: 0, end: 'max', scrub: smooth ? 0.3 : true }
      }
    );
  });

  return (
    <div className="rf-progress" aria-hidden="true">
      <span ref={fill} />
    </div>
  );
};

export default ScrollProgress;
