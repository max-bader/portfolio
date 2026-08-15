export const STORAGE_KEY = 'portfolio-accent';
export const THEME_KEY = 'portfolio-theme';

/** Fired on window whenever the accent changes, so the canvas can re-tint. */
export const ACCENT_EVENT = 'accentchange';

/**
 * Accents carry one colour pair by default. `mono` instead defines a pair per
 * theme, because "black" only reads as black on a light page — on a dark one
 * the same idea has to invert to near-white.
 */
export const accents = [
  { id: 'matrix', label: 'Matrix', base: '45, 134, 89', bright: '61, 166, 107' },
  { id: 'cyan', label: 'Cyan', base: '34, 158, 189', bright: '56, 199, 224' },
  { id: 'amber', label: 'Amber', base: '190, 138, 45', bright: '224, 168, 60' },
  { id: 'violet', label: 'Violet', base: '124, 92, 214', bright: '155, 124, 240' },
  { id: 'crimson', label: 'Crimson', base: '190, 62, 82', bright: '224, 84, 104' },
  {
    id: 'mono',
    label: 'Mono',
    base: '228, 231, 234',
    bright: '255, 255, 255',
    light: { base: '20, 24, 28', bright: '54, 62, 70' },
    dark: { base: '228, 231, 234', bright: '255, 255, 255' }
  }
];

export const defaultAccent = accents[0];

export const findAccent = (id) => accents.find((a) => a.id === id) || defaultAccent;

/** The colour pair a given accent should use on a given theme. */
export const resolveAccent = (accent, theme) => {
  const override = accent[theme];
  return {
    base: override?.base ?? accent.base,
    bright: override?.bright ?? accent.bright
  };
};

/** WCAG relative luminance, used to pick readable text on accent fills. */
const luminance = (rgb) => {
  const channels = rgb.split(',').map((n) => Number(n.trim()) / 255);
  const linear = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  const [r, g, b] = channels.map(linear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

export const readStoredAccent = () => {
  try {
    return findAccent(localStorage.getItem(STORAGE_KEY));
  } catch {
    return defaultAccent;
  }
};

export const readStoredTheme = () => {
  try {
    return localStorage.getItem(THEME_KEY) === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
};

export const currentTheme = () =>
  document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';

export const currentAccent = () => findAccent(document.documentElement.dataset.accent);

export const applyAccent = (id, { persist = true } = {}) => {
  const accent = findAccent(id);
  const root = document.documentElement;
  const theme = currentTheme();

  const onPage = resolveAccent(accent, theme);
  root.style.setProperty('--accent-rgb', onPage.base);
  root.style.setProperty('--accent-rgb-bright', onPage.bright);

  // Text sitting on an accent fill has to stay readable, which flips for
  // light accents like mono-on-dark.
  root.style.setProperty(
    '--on-accent',
    luminance(onPage.base) > 0.45 ? '#14181c' : '#ffffff'
  );

  // Surfaces that stay dark regardless of theme (the matrix overlay) need the
  // dark-page variant of whatever accent is active.
  const onDark = resolveAccent(accent, 'dark');
  root.style.setProperty('--accent-on-dark', onDark.base);
  root.style.setProperty('--accent-on-dark-bright', onDark.bright);

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

/** Flips the page between the dark and light surface tokens. */
export const applyTheme = (mode, { persist = true } = {}) => {
  const theme = mode === 'light' ? 'light' : 'dark';
  const root = document.documentElement;

  if (theme === 'light') {
    root.dataset.theme = 'light';
  } else {
    delete root.dataset.theme;
  }

  if (persist) {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      // Private browsing — the choice just won't survive a reload.
    }
  }

  // Re-resolve the accent: theme-aware accents point somewhere else now.
  applyAccent(currentAccent().id, { persist: false });

  return theme;
};
