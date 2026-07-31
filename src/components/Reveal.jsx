import React, { useEffect, useRef, useState } from 'react';

/**
 * Fades + lifts its children in the first time they scroll into view.
 * Falls back to plain content when IntersectionObserver is missing.
 */
const Reveal = ({ children, delay = 0, className = '', ...rest }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    // An observer that is working reports on every element it observes soon
    // after observe(), intersecting or not. Silence means it never ran.
    let reported = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        reported = true;
        if (!entry.isIntersecting) return;
        setVisible(true);
        observer.disconnect();
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );

    observer.observe(node);

    // Safety net: unanimated content beats permanently invisible content.
    // Scoped to "heard nothing", so real scroll reveals still animate.
    const fallback = window.setTimeout(() => {
      if (!reported) setVisible(true);
    }, 2000);

    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`.trim()}
      style={{ transitionDelay: `${delay}ms` }}
      {...rest}
    >
      {children}
    </div>
  );
};

export default Reveal;
