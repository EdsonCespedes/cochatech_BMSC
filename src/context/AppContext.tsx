import { createContext, useContext, useState, ReactNode } from 'react';
import { debtors, Debtor } from '@/data/mockData';

type Mode = 'client' | 'admin' | 'agents';
type Theme = 'light' | 'dark';
type AdminView = 'overview' | 'debtors' | 'profile' | 'ai-assistant' | 'agents-kpi' | 'analytics' | 'assignments' | 'projections';

interface AppContextType {
  mode: Mode;
  setMode: (mode: Mode) => void;
  theme: Theme;
  toggleTheme: () => void;
  clientLoggedIn: boolean;
  setClientLoggedIn: (v: boolean) => void;
  adminLoggedIn: boolean;
  setAdminLoggedIn: (v: boolean) => void;
  agentsLoggedIn: boolean;
  setAgentsLoggedIn: (v: boolean) => void;
  currentDebtor: Debtor;
  debtors: Debtor[];
  selectedDebtor: Debtor | null;
  setSelectedDebtor: (d: Debtor | null) => void;
  activePlans: Record<string, string>;
  setActivePlan: (debtorId: string, planId: string) => void;
  adminView: AdminView;
  setAdminView: (view: AdminView) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>('client');
  const [theme, setTheme] = useState<Theme>('light');
  const [clientLoggedIn, setClientLoggedIn] = useState(false);
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [agentsLoggedIn, setAgentsLoggedIn] = useState(false);
  const [selectedDebtor, setSelectedDebtor] = useState<Debtor | null>(null);
  const [activePlans, setActivePlans] = useState<Record<string, string>>({});
  const [adminView, setAdminView] = useState<AdminView>('overview');

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    document.documentElement.classList.toggle('dark', next === 'dark');
  };

  const setActivePlan = (debtorId: string, planId: string) => {
    setActivePlans(prev => ({ ...prev, [debtorId]: planId }));
  };

  return (
    <AppContext.Provider value={{
      mode, setMode,
      theme, toggleTheme,
      clientLoggedIn, setClientLoggedIn,
      adminLoggedIn, setAdminLoggedIn,
      agentsLoggedIn, setAgentsLoggedIn,
      currentDebtor: debtors[0],
      debtors,
      selectedDebtor, setSelectedDebtor,
      activePlans, setActivePlan,
      adminView, setAdminView,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
