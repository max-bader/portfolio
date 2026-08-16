import { gsap, useGSAP } from '../lib/gsap';

/**
 * Makes elements lean toward the cursor while hovered, then spring back.
 *
 * Deliberately not wrapped in matchMedia: this is pointer-driven, so it only
 * ever runs in response to a hover the visitor initiated. It still bails out
 * entirely for reduced-motion and touch.
 */
export const useMagnetic = (scope, selector, { strength = 0.35, scale = 1.12 } = {}) => {
  useGSAP(
    () => {
      if (window.matchMedia('(hover: none)').matches) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const cleanups = gsap.utils.toArray(selector, scope.current).map((node) => {
        const xTo = gsap.quickTo(node, 'x', { duration: 0.5, ease: 'power3' });
        const yTo = gsap.quickTo(node, 'y', { duration: 0.5, ease: 'power3' });

        const onMove = (event) => {
          const rect = node.getBoundingClientRect();
          xTo((event.clientX - (rect.left + rect.width / 2)) * strength);
          yTo((event.clientY - (rect.top + rect.height / 2)) * strength);
        };

        const onEnter = () => {
          gsap.to(node, { scale, duration: 0.35, ease: 'power2.out', overwrite: 'auto' });
        };

        const onLeave = () => {
          xTo(0);
          yTo(0);
          gsap.to(node, { scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.4)', overwrite: 'auto' });
        };

        node.addEventListener('pointerenter', onEnter);
        node.addEventListener('pointermove', onMove);
        node.addEventListener('pointerleave', onLeave);

        return () => {
          node.removeEventListener('pointerenter', onEnter);
          node.removeEventListener('pointermove', onMove);
          node.removeEventListener('pointerleave', onLeave);
        };
      });

      return () => cleanups.forEach((fn) => fn());
    },
    { scope, dependencies: [selector, strength, scale] }
  );
};
