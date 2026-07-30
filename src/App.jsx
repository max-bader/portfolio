import React, { useCallback, useEffect, useState } from 'react';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import ParticleField from './components/ParticleField';
import Cursor from './components/Cursor';
import ScrollProgress from './components/ScrollProgress';
import CommandPalette from './components/CommandPalette';
import Terminal from './components/Terminal';
import MatrixRain from './components/MatrixRain';
import { useKonamiCode } from './hooks/useKonamiCode';
import { applyAccent, applyTheme, readStoredAccent, readStoredTheme } from './lib/theme';
import './assets/styles/global.css';
import './App.css';

const isTypingInto = (target) =>
  target instanceof HTMLElement &&
  (target.tagName === 'INPUT' ||
    target.tagName === 'TEXTAREA' ||
    target.isContentEditable);

function App() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [matrixOn, setMatrixOn] = useState(false);

  const openTerminal = useCallback(() => setTerminalOpen(true), []);
  const startMatrix = useCallback(() => setMatrixOn(true), []);

  // Restore the visitor's saved accent and theme before anything paints.
  useEffect(() => {
    applyAccent(readStoredAccent().id, { persist: false });
    applyTheme(readStoredTheme(), { persist: false });
  }, []);

  useKonamiCode(startMatrix);

  useEffect(() => {
    const onKey = (event) => {
      const mod = event.metaKey || event.ctrlKey;

      if (mod && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setTerminalOpen(false);
        setPaletteOpen((open) => !open);
        return;
      }

      // Backtick drops straight into the shell, the way a terminal should.
      if (event.key === '`' && !mod && !isTypingInto(event.target)) {
        event.preventDefault();
        setPaletteOpen(false);
        setTerminalOpen((open) => !open);
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Keep the page behind the overlays from scrolling.
  useEffect(() => {
    const locked = paletteOpen || terminalOpen || matrixOn;
    document.body.style.overflow = locked ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [paletteOpen, terminalOpen, matrixOn]);

  return (
    <div className="App">
      <ParticleField />
      <Cursor />
      <ScrollProgress />

      <Header
        onOpenPalette={() => setPaletteOpen(true)}
        onOpenTerminal={openTerminal}
      />

      <main>
        <HomePage onOpenTerminal={openTerminal} />
      </main>

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onOpenTerminal={openTerminal}
        onMatrix={startMatrix}
      />

      <Terminal
        open={terminalOpen}
        onClose={() => setTerminalOpen(false)}
        onMatrix={startMatrix}
      />

      {matrixOn && <MatrixRain onExit={() => setMatrixOn(false)} />}
    </div>
  );
}

export default App;
