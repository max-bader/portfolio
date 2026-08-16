import { useEffect, useState } from 'react';

/**
 * Scroll spy. Returns the id of whichever section currently owns the
 * viewport, so the nav can highlight it.
 */
export const useActiveSection = (sectionIds, offset = 120) => {
  const [activeId, setActiveId] = useState(sectionIds[0]);

  useEffect(() => {
    const findActive = () => {
      let current = sectionIds[0];

      sectionIds.forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;
        if (el.getBoundingClientRect().top <= offset) current = id;
      });

      // The last section rarely reaches the top of the viewport, so claim it
      // once we've hit the bottom of the page.
      const atBottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 4;
      if (atBottom) current = sectionIds[sectionIds.length - 1];

      setActiveId(current);
    };

    findActive();
    window.addEventListener('scroll', findActive, { passive: true });
    window.addEventListener('resize', findActive);
    return () => {
      window.removeEventListener('scroll', findActive);
      window.removeEventListener('resize', findActive);
    };
  }, [sectionIds, offset]);

  return activeId;
};
