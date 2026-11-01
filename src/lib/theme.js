import { useSyncExternalStore } from 'react';

/**
 * Appearance, kept outside React so the first paint is already correct.
 *
 * The stored value is only written when someone actually picks a side; until
 * then the OS setting wins and keeps winning if it changes mid-visit.
 */

const KEY = 'mb:appearance';
const TINT = { light: '#ffffff', dark: '#0b0b0d' };

const darkQuery =
  typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)') : null;

const stored = () => {
  try {
    const saved = localStorage.getItem(KEY);
    return saved === 'light' || saved === 'dark' ? saved : null;
  } catch {
    return null; // Safari private mode throws on access, not just on write.
  }
};

let chosen = stored();
let current = chosen ?? (darkQuery?.matches ? 'dark' : 'light');

const listeners = new Set();

const paint = (theme) => {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', TINT[theme]);
};

const commit = (theme) => {
  current = theme;
  paint(theme);
  listeners.forEach((fn) => fn());
};

// Follow the OS as long as nobody has overridden it on this site.
darkQuery?.addEventListener('change', (event) => {
  if (!chosen) commit(event.matches ? 'dark' : 'light');
});

/** Radius that still covers the far corner, so the wipe never clips short. */
const reachFrom = (x, y) =>
  Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

/**
 * Swap appearance. When the browser supports view transitions and motion is
 * welcome, the new theme is revealed as a circle growing out of whatever was
 * clicked — the switch reads as one surface replacing another rather than
 * every colour changing at once.
 */
export const toggleTheme = (origin) => {
  const next = current === 'dark' ? 'light' : 'dark';
  chosen = next;
  try {
    localStorage.setItem(KEY, next);
  } catch {
    /* nothing to do — the session still gets the right theme */
  }

  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (still || !document.startViewTransition) {
    commit(next);
    return;
  }

  const box = origin?.getBoundingClientRect?.();
  const x = box ? box.left + box.width / 2 : innerWidth / 2;
  const y = box ? box.top + box.height / 2 : 0;

  document.documentElement.dataset.wipe = 'on';

  const transition = document.startViewTransition(() => commit(next));

  transition.ready
    .then(() =>
      document.documentElement.animate(
        {
          clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${reachFrom(x, y)}px at ${x}px ${y}px)`]
        },
        {
          duration: 620,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
          pseudoElement: '::view-transition-new(root)'
        }
      ).finished
    )
    .catch(() => {})
    .finally(() => {
      delete document.documentElement.dataset.wipe;
    });
};

export const getTheme = () => current;

const subscribe = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

export const useTheme = () => useSyncExternalStore(subscribe, getTheme, () => 'light');

// Applied at import time: the module is pulled in by main.jsx before React
// mounts, so the page never flashes the wrong side.
if (typeof document !== 'undefined') paint(current);
