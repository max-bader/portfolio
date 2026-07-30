import React, { useRef } from 'react';

/**
 * Card wrapper that tracks the cursor and exposes it as --mx/--my, letting the
 * stylesheet paint a soft accent glow that follows the pointer.
 */
const SpotlightCard = ({ className = '', children, ...rest }) => {
  const ref = useRef(null);

  const onPointerMove = (event) => {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    node.style.setProperty('--mx', `${event.clientX - rect.left}px`);
    node.style.setProperty('--my', `${event.clientY - rect.top}px`);
  };

  return (
    <div
      ref={ref}
      className={`spotlight ${className}`.trim()}
      onPointerMove={onPointerMove}
      {...rest}
    >
      {children}
    </div>
  );
};

export default SpotlightCard;
