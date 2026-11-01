import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
// Imported for its side effect: appearance is written to <html> at module
// evaluation, before React mounts, so the page never flashes the wrong side.
import './lib/theme'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
