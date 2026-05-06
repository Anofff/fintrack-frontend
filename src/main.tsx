import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const stored = localStorage.getItem('fintrack-ui');
if (stored) {
  try {
    const parsed = JSON.parse(stored) as { state?: { darkMode?: boolean } };
    if (parsed?.state?.darkMode) {
      document.documentElement.classList.add('dark');
    }
  } catch {
    /* ignore */
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
