import React from 'react';
import RefinedWorld from './worlds/refined/RefinedWorld';
import Flowers from './flowers/Flowers';
import './App.css';

function App() {
  // Keep this small, intentional easter egg out of the portfolio navigation.
  // Vite's static-host fallback serves the app for /flowers, then this route
  // selector renders the standalone experience without changing the homepage.
  if (window.location.pathname.replace(/\/+$/, '') === '/flowers') {
    return <Flowers />;
  }

  return <RefinedWorld />;
}

export default App;
