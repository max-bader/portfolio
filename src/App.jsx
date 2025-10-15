import React from 'react';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import './assets/styles/global.css';
import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <HomePage />
      </main>
    </div>
  );
}

export default App;
