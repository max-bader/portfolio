import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import '../assets/styles/WorldSwitcher.css';

const WORLDS = [
  { path: '/refined', label: 'Refined', title: 'Apple-style restraint' },
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
  { path: '/seed', label: 'Seed', title: 'Botanical field guide' },
  { path: '/cassette', label: 'Cassette', title: 'Mixtape J-card' },
  { path: '/receipt', label: 'Receipt', title: 'Thermal till receipt' },
  { path: '/radar', label: 'Radar', title: 'PPI radar display' },
  { path: '/classic', label: 'Classic', title: 'The previous site' }
];

/**
 * Comparison control. Collapsed to a single chip by default — at twenty-odd
 * routes an always-open row covered the middle of every page it was meant to
 * let you judge. Goes away once one world wins.
 */
const WorldSwitcher = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const { pathname } = useLocation();

  const current = WORLDS.find((w) => w.path === pathname);

  // Picking a world closes the panel so it never blocks what you just chose.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerdown', onClick);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointerdown', onClick);
    };
  }, [open]);

  return (
    <div className={`ws ${open ? 'is-open' : ''}`} ref={ref}>
      {open && (
        <div className="ws-panel" role="dialog" aria-label="Design directions">
          <p className="ws-panel-title">{WORLDS.length} directions</p>
          <div className="ws-grid">
            {WORLDS.map((world) => (
              <NavLink
                key={world.path}
                to={world.path}
                title={world.title}
                className={({ isActive }) => `ws-link ${isActive ? 'is-active' : ''}`}
              >
                {world.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}

      <button
        type="button"
        className="ws-toggle"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="ws-dot" aria-hidden="true" />
        {current ? current.label : 'Worlds'}
        <span className="ws-caret" aria-hidden="true">{open ? '×' : '↑'}</span>
      </button>
    </div>
  );
};

export default WorldSwitcher;
