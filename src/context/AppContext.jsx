import { createContext, useContext, useEffect, useState } from 'react';
import { getJournals } from '../lib/journals';

// AppContext provides global state for the application
const AppContext = createContext();

// AppProvider wraps the application and provides state and functions to its children
export function AppProvider({ children }) {
  // State to hold the list of journals
  const [journals, setJournals] = useState([]);

  // Load journals when the component mounts
  async function loadJournals() {
    const data = await getJournals();
    setJournals(data);
  }

  // Use useEffect to load journals on component mount
  return (
    <AppContext.Provider value={{ journals, loadJournals }}>
      {children}
    </AppContext.Provider>
  );
}

// Custom hook to use the AppContext
export const useApp = () => useContext(AppContext);