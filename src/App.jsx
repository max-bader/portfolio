import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import './assets/styles/global.css';
import './App.css';

function App() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="App">
      <div 
        className="cursor-aura"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
        }}
      />
      <Header />
      <main>
        <HomePage />
      </main>
    </div>
  );
}

export default App;
