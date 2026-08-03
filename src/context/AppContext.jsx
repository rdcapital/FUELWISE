/**
 * AppContext.jsx
 * Global application state using React Context + useReducer.
 *
 * Provides:
 *  - vehicle profile (name, make, model, year, etc.)
 *  - dark mode toggle
 *  - vehicle update action
 */
import { createContext, useContext, useReducer, useEffect } from 'react';
import { getItem, setItem } from '../utils/storage';
import { STORAGE_KEYS, DEFAULT_VEHICLE } from '../utils/constants';

// ---------- initial state ----------
const initialState = {
  vehicle: getItem(STORAGE_KEYS.VEHICLE, DEFAULT_VEHICLE),
  darkMode: getItem(STORAGE_KEYS.DARK_MODE, false),
};

// ---------- reducer ----------
function appReducer(state, action) {
  switch (action.type) {
    case 'SET_VEHICLE':
      return { ...state, vehicle: { ...state.vehicle, ...action.payload } };
    case 'TOGGLE_DARK_MODE':
      return { ...state, darkMode: !state.darkMode };
    default:
      return state;
  }
}

// ---------- context ----------
const AppContext = createContext(null);

/** Wrap the entire application with this provider */
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Persist dark mode preference to localStorage whenever it changes
  useEffect(() => {
    setItem(STORAGE_KEYS.DARK_MODE, state.darkMode);
    // Apply / remove the `dark` class on <html> for Tailwind's dark variant
    if (state.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.darkMode]);

  // Persist vehicle info whenever it changes
  useEffect(() => {
    setItem(STORAGE_KEYS.VEHICLE, state.vehicle);
  }, [state.vehicle]);

  // Action creators passed down to consumers
  const updateVehicle = (data) => dispatch({ type: 'SET_VEHICLE', payload: data });
  const toggleDarkMode = () => dispatch({ type: 'TOGGLE_DARK_MODE' });

  return (
    <AppContext.Provider value={{ ...state, updateVehicle, toggleDarkMode }}>
      {children}
    </AppContext.Provider>
  );
}

/** Convenience hook — throws if used outside <AppProvider> */
export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within <AppProvider>');
  return ctx;
}
