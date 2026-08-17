import React from 'react';
import { NavLink } from 'react-router-dom';
import '../assets/styles/WorldSwitcher.css';

const WORLDS = [
  { path: '/draft', label: 'Draft', title: 'Cyanotype engineering drawing' },
  { path: '/graph', label: 'Graph', title: 'Git commit graph' },
  { path: '/board', label: 'Board', title: 'Split-flap departure board' },
  { path: '/manual', label: 'Manual', title: 'Boxed-software reference manual' },
  { path: '/riso', label: 'Riso', title: 'Risograph print' },
  { path: '/paper', label: 'Paper', title: 'arXiv preprint' },
  { path: '/metro', label: 'Metro', title: 'Transit network map' },
  { path: '/pcb', label: 'PCB', title: 'Printed circuit board' },
  { path: '/score', label: 'Score', title: 'Engraved musical score' },
  { path: '/reel', label: 'Reel', title: 'Video editor timeline' },
  { path: '/scope', label: 'Scope', title: 'Storage oscilloscope' },
  { path: '/atlas', label: 'Atlas', title: 'Celestial chart' },
  { path: '/arcade', label: 'Arcade', title: 'Arcade attract mode' },
  { path: '/vitrine', label: 'Vitrine', title: 'Museum exhibition' },
  { path: '/ticket', label: 'Ticket', title: 'Airline itinerary' },
  { path: '/press', label: 'Press', title: 'Letterpress poster' },
  { path: '/teletext', label: 'Teletext', title: 'Broadcast teletext' },
  { path: '/classic', label: 'Classic', title: 'The previous site' }
];

/**
 * Temporary comparison control. Three committed worlds live at their own
 * routes so they can be judged side by side; this goes away once one wins.
 */
const WorldSwitcher = () => (
  <nav className="world-switcher" aria-label="Design direction">
    <span className="world-switcher-label">world</span>
    {WORLDS.map((world) => (
      <NavLink
        key={world.path}
        to={world.path}
        title={world.title}
        className={({ isActive }) =>
          `world-switcher-link ${isActive ? 'is-active' : ''}`
        }
      >
        {world.label}
      </NavLink>
    ))}
  </nav>
);

export default WorldSwitcher;
