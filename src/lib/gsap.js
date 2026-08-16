import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { TextPlugin } from 'gsap/TextPlugin';

// Registered once for the whole app. useGSAP is registered too so its
// context cleanup survives StrictMode's double mount in development.
gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, ScrambleTextPlugin, TextPlugin);

gsap.defaults({ ease: 'power3.out', duration: 0.8 });

// ScrollTrigger caches element positions; fonts landing late shift them.
if (typeof document !== 'undefined' && document.fonts) {
  document.fonts.ready.then(() => ScrollTrigger.refresh());
}

// Dev-only handles so timelines can be scrubbed from the console.
if (import.meta.env.DEV && typeof window !== 'undefined') {
  window.gsap = gsap;
  window.ScrollTrigger = ScrollTrigger;
}

/**
 * Every animated component runs its work inside this so a visitor who asked
 * for reduced motion gets the finished state instead of the movement.
 * GSAP reverts the reduced-motion branch automatically when the query flips.
 */
export const motionContext = (scope, build) =>
  gsap.matchMedia(scope).add(
    {
      motion: '(prefers-reduced-motion: no-preference)',
      reduced: '(prefers-reduced-motion: reduce)'
    },
    build
  );

export { gsap, useGSAP, ScrollTrigger, SplitText, ScrambleTextPlugin, TextPlugin };
