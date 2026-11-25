import React, { useEffect, useRef, useState } from 'react';
import './flowers.css';

const bloom = String.raw`
                  . . .
              .  *  .  *  .
           *      .-.-.      *
                .'  |  '.
          .    /  .-+- .  \    .
              ;  /  |  \  ;
          *   |  \  |  /  |   *
              ;   \ | /   ;
           .   \   '|'   /   .
                '.  |  .'
             *    '-+-'    *
                     |
                  \  |  /
                   \ | /
                    \|/
                     |
                   .-'-.
                 .'     '.
                /         \
               '-----------'
`;

const Flowers = () => {
  const [isGrowing, setIsGrowing] = useState(true);
  const [hasBloomed, setHasBloomed] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    if (!isGrowing) return undefined;

    timer.current = window.setTimeout(() => setHasBloomed(true), 2350);
    return () => window.clearTimeout(timer.current);
  }, [isGrowing]);

  const replay = () => {
    window.clearTimeout(timer.current);
    setHasBloomed(false);
    setIsGrowing(false);
    window.requestAnimationFrame(() => setIsGrowing(true));
  };

  return (
    <main className={`flowers ${isGrowing ? 'flowers--growing' : ''}`}>
      <div className="flowers__grain" aria-hidden="true" />
      <section className="flowers__terminal" aria-labelledby="flowers-title">
        <header className="flowers__bar">
          <div className="flowers__lights" aria-hidden="true"><i /><i /><i /></div>
          <p id="flowers-title">flower.py — python3</p>
          <button type="button" onClick={replay} aria-label="Replay the flower animation">
            replay()
          </button>
        </header>

        <div className="flowers__content">
          <p className="flowers__prompt"><span>max@portfolio</span>:<b>~</b>$ python flower.py</p>
          <p className="flowers__line flowers__line--one">planting a small thing in the browser...</p>
          <pre className="flowers__bloom" aria-label="An animated ASCII flower">{bloom}</pre>
          <p className="flowers__status" aria-live="polite">
            {hasBloomed ? '✦ bloom complete' : '· growing'}
          </p>
        </div>
      </section>
      <p className="flowers__hint">click replay() to grow it again</p>
    </main>
  );
};

export default Flowers;
