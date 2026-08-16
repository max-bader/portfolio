import React, { useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import '../assets/styles/Cursor.css';

const INTERACTIVE = 'a, button, input, textarea, [role="button"], .technology-tag, .skill-item';

/**
 * Two-part cursor: a soft accent aura that trails behind, and a crisp dot that
 * tracks exactly. quickTo keeps a single reusable tween per property, so
 * pointer moves never allocate and never re-render React.
 */
const Cursor = () => {
  const auraRef = useRef(null);
  const dotRef = useRef(null);

  useGSAP(() => {
    // Touch devices have no cursor to decorate.
    if (window.matchMedia('(hover: none)').matches) return;

    const aura = auraRef.current;
    const dot = dotRef.current;

    gsap.set([aura, dot], { xPercent: -50, yPercent: -50 });

    // Reduced motion still gets a cursor, it just snaps instead of trailing.
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const trail = reduced ? 0 : 0.5;
    const track = reduced ? 0 : 0.12;

    const auraX = gsap.quickTo(aura, 'x', { duration: trail, ease: 'power3' });
    const auraY = gsap.quickTo(aura, 'y', { duration: trail, ease: 'power3' });
    const dotX = gsap.quickTo(dot, 'x', { duration: track, ease: 'power3' });
    const dotY = gsap.quickTo(dot, 'y', { duration: track, ease: 'power3' });
    const auraScale = gsap.quickTo(aura, 'scale', { duration: reduced ? 0 : 0.4, ease: 'power2' });

    const onMove = (event) => {
      auraX(event.clientX);
      auraY(event.clientY);
      dotX(event.clientX);
      dotY(event.clientY);
    };

    const onOver = (event) => {
      auraScale(event.target.closest?.(INTERACTIVE) ? 1.9 : 1);
    };

    document.body.classList.add('has-custom-cursor');
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerover', onOver, { passive: true });

    return () => {
      document.body.classList.remove('has-custom-cursor');
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
    };
  });

  return (
    <>
      <div ref={auraRef} className="cursor-aura" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  );
};

export default Cursor;
