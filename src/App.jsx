import React, { useCallback, useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import CommandPalette from './components/CommandPalette';
import MatrixRain from './components/MatrixRain';
import WorldSwitcher from './components/WorldSwitcher';
import ClassicWorld from './worlds/ClassicWorld';
import DraftWorld from './worlds/draft/DraftWorld';
import GraphWorld from './worlds/graph/GraphWorld';
import BoardWorld from './worlds/board/BoardWorld';
import ManualWorld from './worlds/manual/ManualWorld';
import RisoWorld from './worlds/riso/RisoWorld';
import PaperWorld from './worlds/paper/PaperWorld';
import { useKonamiCode } from './hooks/useKonamiCode';
import { applyAccent, applyTheme, readStoredAccent, readStoredTheme } from './lib/theme';
import './App.css';

function App() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [matrixOn, setMatrixOn] = useState(false);

  const startMatrix = useCallback(() => setMatrixOn(true), []);

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
        setPaletteOpen((open) => !open);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    const locked = paletteOpen || matrixOn;
    document.body.style.overflow = locked ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [paletteOpen, matrixOn]);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate to="/draft" replace />} />
        <Route path="/draft" element={<DraftWorld />} />
        <Route path="/graph" element={<GraphWorld />} />
        <Route path="/board" element={<BoardWorld />} />
        <Route path="/manual" element={<ManualWorld />} />
        <Route path="/riso" element={<RisoWorld />} />
        <Route path="/paper" element={<PaperWorld />} />
        <Route path="/classic" element={<ClassicWorld />} />
        <Route path="*" element={<Navigate to="/draft" replace />} />
      </Routes>

      <WorldSwitcher />

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onMatrix={startMatrix}
      />

      {matrixOn && <MatrixRain onExit={() => setMatrixOn(false)} />}
    </div>
  );
}

export default App;
