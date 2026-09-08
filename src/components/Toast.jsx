import React, { useEffect, useRef, useState } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import { onNotify } from '../lib/toast';

/** The pill itself. Announced politely, so it is heard as well as seen. */
const Toast = () => {
  const [message, setMessage] = useState(null);
  const pill = useRef(null);
  const timer = useRef(0);

  useEffect(() => {
    const stop = onNotify((text) => {
      setMessage({ text, key: Date.now() });
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setMessage(null), 2200);
    });
    return () => {
      stop();
      clearTimeout(timer.current);
    };
  }, []);

  useGSAP(
    () => {
      if (!pill.current) return;
      gsap.from(pill.current, {
        opacity: 0,
        y: 12,
        scale: 0.96,
        duration: 0.32,
        ease: 'power3.out'
      });
    },
    { dependencies: [message?.key] }
  );

  return (
    <div className="rf-toast-slot" role="status" aria-live="polite">
      {message && (
        <p className="rf-toast" ref={pill} key={message.key}>
          {message.text}
        </p>
      )}
    </div>
  );
};

export default Toast;
