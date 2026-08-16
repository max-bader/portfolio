import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';
import '../assets/styles/Cursor.css';

const INTERACTIVE = 'a, button, input, textarea, [role="button"], .technology-tag, .skill-item';

/**
 * Two-part cursor: a soft accent aura that trails behind, and a crisp dot that
 * tracks exactly. Both are written straight to the DOM on rAF so pointer moves
 * never re-render React.
 */
const Cursor = () => {
  const auraRef = useRef(null);
  const dotRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    // Touch devices have no cursor to decorate.
    if (window.matchMedia('(hover: none)').matches) return;

    const aura = auraRef.current;
    const dot = dotRef.current;
    if (!aura || !dot) return;

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const eased = { ...target };
    let frame = 0;
    let scale = 1;
    let targetScale = 1;

    const onMove = (event) => {
      target.x = event.clientX;
      target.y = event.clientY;
      dot.style.transform = `translate(${event.clientX}px, ${event.clientY}px) translate(-50%, -50%)`;
    };

    const onOver = (event) => {
      targetScale = event.target.closest?.(INTERACTIVE) ? 1.9 : 1;
    };

    const render = () => {
      const ease = reducedMotion ? 1 : 0.14;
      eased.x += (target.x - eased.x) * ease;
      eased.y += (target.y - eased.y) * ease;
      scale += (targetScale - scale) * 0.12;
      aura.style.transform = `translate(${eased.x}px, ${eased.y}px) translate(-50%, -50%) scale(${scale})`;
      frame = window.requestAnimationFrame(render);
    };

    document.body.classList.add('has-custom-cursor');
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerover', onOver, { passive: true });
    frame = window.requestAnimationFrame(render);

    return () => {
      document.body.classList.remove('has-custom-cursor');
      window.cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
    };
  }, [reducedMotion]);

  return (
    <>
      <div ref={auraRef} className="cursor-aura" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  );
};

export default Cursor;
