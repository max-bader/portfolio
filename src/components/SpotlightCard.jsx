import React, { useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap';

/**
 * Card wrapper that tracks the cursor and exposes it as --mx/--my, letting the
 * stylesheet paint a soft accent glow that follows the pointer.
 *
 * quickSetter writes the custom properties directly, skipping React's
 * synthetic event and re-render on every pointer move.
 */
const SpotlightCard = ({ className = '', children, ...rest }) => {
  const ref = useRef(null);

  useGSAP(() => {
    const node = ref.current;
    const setX = gsap.quickSetter(node, '--mx', 'px');
    const setY = gsap.quickSetter(node, '--my', 'px');

    const onPointerMove = (event) => {
      const rect = node.getBoundingClientRect();
      setX(event.clientX - rect.left);
      setY(event.clientY - rect.top);
    };

    node.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => node.removeEventListener('pointermove', onPointerMove);
  }, { scope: ref });

  return (
    <div ref={ref} className={`spotlight ${className}`.trim()} {...rest}>
      {children}
    </div>
  );
};

export default SpotlightCard;
