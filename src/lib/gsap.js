import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Registered once for the whole app. useGSAP is registered too so its
// context cleanup survives StrictMode's double mount in development.
gsap.registerPlugin(useGSAP, ScrollTrigger);

gsap.defaults({ ease: 'power3.out', duration: 0.8 });

// ScrollTrigger caches element positions; fonts landing late shift them.
if (typeof document !== 'undefined' && document.fonts) {
  document.fonts.ready.then(() => ScrollTrigger.refresh());
}

// Dev-only handles. The preview browser reports visibilityState "hidden" and
// never fires requestAnimationFrame, so motion cannot be watched playing —
// it has to be verified by seeking this clock and capturing keyframes.
if (import.meta.env.DEV && typeof window !== 'undefined') {
  window.gsap = gsap;
  window.ScrollTrigger = ScrollTrigger;
}

/**
 * Every animated component runs its work inside this so a visitor who asked
 * for reduced motion gets the finished state instead of the movement.
 */
export const motionContext = (scope, build) =>
  gsap.matchMedia(scope).add(
    {
      motion: '(prefers-reduced-motion: no-preference)',
      reduced: '(prefers-reduced-motion: reduce)'
    },
    build
  );

export { gsap, useGSAP, ScrollTrigger };
