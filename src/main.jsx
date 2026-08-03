/**
 * main.jsx
 * Application entry point.
 *
 * Provider hierarchy (outermost → innermost):
 *  BrowserRouter  — client-side routing
 *  AppProvider    — global state (vehicle, dark mode)
 *  ToastProvider  — toast notification system
 *  App            — routes + pages
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ToastProvider } from './context/ToastContext';
import App from './App';
import './index.css';

// On initial load, apply dark mode class from localStorage
// (AppContext effect handles subsequent toggles)
const savedDark = localStorage.getItem('fuelwise_dark_mode');
if (savedDark === 'true') {
  document.documentElement.classList.add('dark');
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AppProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </AppProvider>
    </BrowserRouter>
  </StrictMode>
);
