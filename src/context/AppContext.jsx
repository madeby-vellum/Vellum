// React context used for global journal state management
import { createContext, useContext, useEffect, useState } from 'react';
import { getJournals } from '../lib/journals';

const AppContext = createContext();

export function AppProvider({ children }) {

  // Stores list of all journals globally
  const [journals, setJournals] = useState([]);

  // Fetch journals from backend / storage layer
  async function loadJournals() {
    const data = await getJournals();
    setJournals(data);
  }

  return (
    <AppContext.Provider value={{ journals, loadJournals }}>
      {children}
    </AppContext.Provider>
  );
}

// Hook for consuming app-wide journal state
export const useApp = () => useContext(AppContext);