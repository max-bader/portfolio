import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap';

/**
 * Skews elements by how fast the page is scrolling, then eases them back to
 * flat. Gives the section a sense of weight — it lags slightly behind a fast
 * flick and settles when you stop.
 */
export const useScrollSkew = (scope, selector, { max = 5, divisor = 260 } = {}) => {
  useGSAP(
    () => {
      const targets = gsap.utils.toArray(selector, scope.current);
      if (!targets.length) return;

      gsap.matchMedia(scope).add('(prefers-reduced-motion: no-preference)', () => {
        const clamp = gsap.utils.clamp(-max, max);
        const setSkew = gsap.quickSetter(targets, 'skewY', 'deg');
        const proxy = { skew: 0 };

        const trigger = ScrollTrigger.create({
          onUpdate: (self) => {
            const skew = clamp(self.getVelocity() / -divisor);

            // Only take over on a faster flick than the one already decaying,
            // otherwise the spring-back keeps getting reset and never lands.
            if (Math.abs(skew) <= Math.abs(proxy.skew)) return;

            proxy.skew = skew;
            gsap.to(proxy, {
              skew: 0,
              duration: 0.7,
              ease: 'power3',
              overwrite: true,
              onUpdate: () => setSkew(proxy.skew)
            });
          }
        });

        gsap.set(targets, { transformOrigin: 'center center', force3D: true });
        return () => trigger.kill();
      });
    },
    { scope, dependencies: [selector, max, divisor] }
  );
};
