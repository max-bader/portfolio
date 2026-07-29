import React, { useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import './assets/styles/global.css';

function App() {
  useEffect(() => {
    const elements = document.querySelectorAll('[data-reveal]');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      elements.forEach((el) => el.classList.add('revealed'));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        // Elements crossing together stagger in document order (~70ms
        // apart) rather than snapping in at once. Capped so a long list
        // never leaves the last item waiting.
        const entering = entries.filter((e) => e.isIntersecting);
        entering.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        entering.forEach((entry, i) => {
          entry.target.style.setProperty('--reveal-index', String(Math.min(i, 4)));
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.05 }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="App">
      <Header />
      <main>
        <HomePage />
      </main>
      <Footer />
    </div>
  );
}

export default App;
