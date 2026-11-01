import React from 'react';

/* The mark set. One 1.5px stroke on a 20px box, no icon font — a link and its
   command in the palette are drawn from the same path. */
export const ICONS = {
  mail: <><rect x="2.5" y="4.5" width="15" height="11" rx="2" /><path d="m3 6 7 5 7-5" /></>,
  github: <path d="M7.5 16.5c-3.5 1-3.5-1.8-5-2.2m10 4.2v-2.8c0-.8-.2-1.4-.7-1.8 2.3-.3 4.7-1.1 4.7-5a3.9 3.9 0 0 0-1-2.7 3.6 3.6 0 0 0-.1-2.7s-.9-.3-2.9 1a10 10 0 0 0-5 0C5.5 3.2 4.6 3.5 4.6 3.5a3.6 3.6 0 0 0-.1 2.7 3.9 3.9 0 0 0-1 2.7c0 3.9 2.4 4.7 4.7 5-.3.3-.6.8-.7 1.5v3.1" />,
  linkedin: <><rect x="3" y="3" width="14" height="14" rx="2.5" /><path d="M6.5 8.5v5M6.5 6v.01M10 13.5v-3a1.8 1.8 0 0 1 3.5 0v3" /></>,
  doc: <><path d="M11.5 2.5H6a1.5 1.5 0 0 0-1.5 1.5v12A1.5 1.5 0 0 0 6 17.5h8a1.5 1.5 0 0 0 1.5-1.5V6.5z" /><path d="M11.5 2.5v4h4" /></>,
  arrow: <path d="M4.5 10h11M11 5.5 15.5 10 11 14.5" />,
  search: <><circle cx="9" cy="9" r="5.5" /><path d="m13.5 13.5 3.5 3.5" /></>,
  section: <path d="M7.5 3 6 17M14 3l-1.5 14M3.5 7.5h13M3 12.5h13" />,
  briefcase: <><rect x="2.5" y="6" width="15" height="10.5" rx="2" /><path d="M7 6V4.5A1.5 1.5 0 0 1 8.5 3h3A1.5 1.5 0 0 1 13 4.5V6" /></>,
  cube: <><path d="M10 2.5 17 6v8l-7 3.5L3 14V6z" /><path d="M3 6l7 3.5L17 6M10 9.5v8" /></>,
  sun: <><circle cx="10" cy="10" r="3.5" /><path d="M10 1.5v2M10 16.5v2M2.5 10h-1M18.5 10h-1M4.7 4.7 3.3 3.3M16.7 16.7l-1.4-1.4M4.7 15.3l-1.4 1.4M16.7 3.3l-1.4 1.4" /></>,
  moon: <path d="M16.5 11.4A7 7 0 0 1 8.6 3.5a7 7 0 1 0 7.9 7.9z" />,
  copy: <><rect x="7" y="7" width="10" height="10" rx="2" /><path d="M13 5.5A2.5 2.5 0 0 0 10.5 3h-5A2.5 2.5 0 0 0 3 5.5v5A2.5 2.5 0 0 0 5.5 13" /></>,
  check: <path d="m4 10.5 4 4 8-9" />,
  command: <path d="M7.5 4.5a2 2 0 1 0-2 2h9a2 2 0 1 0-2-2v11a2 2 0 1 0 2-2h-9a2 2 0 1 0 2 2z" />,
  enter: <path d="M16.5 4.5v4a3 3 0 0 1-3 3H4m0 0 3.5-3.5M4 11.5 7.5 15" />
};
