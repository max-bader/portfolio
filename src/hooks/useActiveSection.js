import { useState } from 'react';
import { ScrollTrigger, useGSAP } from '../lib/gsap';

/**
 * Scroll spy. Returns the id of whichever section currently owns the
 * viewport, so the nav can highlight it.
 *
 * One ScrollTrigger per section rather than a scroll listener: onEnter and
 * onEnterBack cover both directions, and ScrollTrigger already batches its
 * position reads into a single measurement per frame.
 */
export const useActiveSection = (sectionIds) => {
  const [activeId, setActiveId] = useState(sectionIds[0]);

  useGSAP(
    () => {
      sectionIds.forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;

        ScrollTrigger.create({
          trigger: el,
          start: 'top 40%',
          end: 'bottom 40%',
          onEnter: () => setActiveId(id),
          onEnterBack: () => setActiveId(id)
        });
      });
    },
    { dependencies: [sectionIds] }
  );

  return activeId;
};
