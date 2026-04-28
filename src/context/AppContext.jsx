import { createContext, useContext, useEffect, useState } from 'react';
import { getJournals } from '../lib/journals';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [journals, setJournals] = useState([]);

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

export const useApp = () => useContext(AppContext);