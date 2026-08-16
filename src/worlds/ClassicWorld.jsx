import React, { useCallback, useState } from 'react';
import Header from '../components/Header';
import HomePage from '../pages/HomePage';
import ParticleField from '../components/ParticleField';
import Cursor from '../components/Cursor';
import ScrollProgress from '../components/ScrollProgress';
import '../assets/styles/global.css';

/** The previous site, kept routable so the new worlds can be judged against it. */
const ClassicWorld = () => {
  const [, setPaletteOpen] = useState(false);
  const openPalette = useCallback(() => setPaletteOpen(true), []);

  return (
    <div className="classic-world">
      <ParticleField />
      <Cursor />
      <ScrollProgress />
      <Header onOpenPalette={openPalette} />
      <main>
        <HomePage />
      </main>
    </div>
  );
};

export default ClassicWorld;
