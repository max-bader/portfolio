import React from 'react';

/* One 1.5px stroke, one 20px box. `label` promotes the mark from decoration
   to an image with a name; without one it is hidden from the reader. */
const Icon = ({ path, label, className = 'rf-icon' }) => (
  <svg
    className={className}
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={label ? undefined : 'true'}
    role={label ? 'img' : undefined}
  >
    {label && <title>{label}</title>}
    {path}
  </svg>
);

export default Icon;
