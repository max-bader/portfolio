export const STORAGE_KEY = 'portfolio-accent';

/** Fired on window whenever the accent changes, so the canvas can re-tint. */
export const ACCENT_EVENT = 'accentchange';

export const accents = [
  { id: 'matrix', label: 'Matrix', base: '45, 134, 89', bright: '61, 166, 107' },
  { id: 'cyan', label: 'Cyan', base: '34, 158, 189', bright: '56, 199, 224' },
  { id: 'amber', label: 'Amber', base: '190, 138, 45', bright: '224, 168, 60' },
  { id: 'violet', label: 'Violet', base: '124, 92, 214', bright: '155, 124, 240' },
  { id: 'crimson', label: 'Crimson', base: '190, 62, 82', bright: '224, 84, 104' }
];

export const defaultAccent = accents[0];

export const findAccent = (id) => accents.find((a) => a.id === id) || defaultAccent;

export const readStoredAccent = () => {
  try {
    return findAccent(localStorage.getItem(STORAGE_KEY));
  } catch {
    return defaultAccent;
  }
};

export const applyAccent = (id, { persist = true } = {}) => {
  const accent = findAccent(id);
  const root = document.documentElement;

  root.style.setProperty('--accent-rgb', accent.base);
  root.style.setProperty('--accent-rgb-bright', accent.bright);
  root.dataset.accent = accent.id;

  if (persist) {
    try {
      localStorage.setItem(STORAGE_KEY, accent.id);
    } catch {
      // Private browsing — the accent just won't survive a reload.
    }
  }

  window.dispatchEvent(new CustomEvent(ACCENT_EVENT, { detail: accent }));
  return accent;
};
