import React, { useRef } from 'react';
import { gsap, useGSAP } from '../lib/gsap';
import { toggleTheme, useTheme } from '../lib/theme';
import Icon from './Icon';
import { ICONS } from '../lib/icons';

/**
 * Appearance switch. The page-wide wipe lives in `lib/theme`; what happens
 * here is only the glyph handing over — the outgoing mark leaves the way the
 * incoming one arrives, so the button reads as one object turning rather than
 * two icons crossfading.
 */
const ThemeToggle = () => {
  const theme = useTheme();
  const button = useRef(null);
  const first = useRef(true);

  useGSAP(
    () => {
      if (first.current) {
        first.current = false;
        return;
      }
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      gsap.fromTo(
        '.rf-theme-glyph',
        { rotate: -75, scale: 0.5, opacity: 0 },
        { rotate: 0, scale: 1, opacity: 1, duration: 0.45, ease: 'back.out(2)' }
      );
    },
    { dependencies: [theme], scope: button }
  );

  return (
    <button
      type="button"
      className="rf-theme"
      ref={button}
      onClick={() => toggleTheme(button.current)}
      aria-label={theme === 'dark' ? 'Switch to light appearance' : 'Switch to dark appearance'}
      title="Switch appearance"
    >
      <Icon
        key={theme}
        path={theme === 'dark' ? ICONS.sun : ICONS.moon}
        className="rf-icon rf-theme-glyph"
      />
    </button>
  );
};

export default ThemeToggle;
