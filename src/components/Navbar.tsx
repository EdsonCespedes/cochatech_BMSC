import { Sun, Moon, Building2, User, ChevronDown } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function Navbar() {
  const { mode, setMode, theme, toggleTheme, clientLoggedIn, adminLoggedIn, setClientLoggedIn, setAdminLoggedIn } = useApp();

  const handleModeSwitch = (newMode: 'client' | 'admin') => {
    setMode(newMode);
  };

  const handleLogout = () => {
    if (mode === 'client') setClientLoggedIn(false);
    else setAdminLoggedIn(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-white/95 dark:bg-msc-black/95 backdrop-blur-md border-b border-msc-gray dark:border-white/10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="w-10 h-10 rounded-full gradient-msc flex items-center justify-center shadow-msc-sm relative overflow-hidden">
            <div className="absolute inset-0 opacity-20" style={{
              background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4) 0%, transparent 60%)'
            }} />
            <span className="text-white font-bold text-sm relative z-10">M</span>
          </div>
          <div className="hidden sm:block">
            <p className="font-bold text-msc-dark dark:text-white text-sm leading-tight">Banco Mercantil</p>
            <p className="text-[10px] text-msc-soft dark:text-msc-mid font-medium tracking-wide">SANTA CRUZ</p>
          </div>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center bg-msc-gray dark:bg-white/10 rounded-full p-1 gap-1">
          <button
            onClick={() => handleModeSwitch('client')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
              mode === 'client'
                ? 'bg-msc-dark text-white shadow-sm'
                : 'text-msc-soft dark:text-msc-mid hover:text-msc-dark dark:hover:text-white'
            }`}
          >
            <User size={12} />
            <span className="hidden sm:inline">Cliente</span>
          </button>
          <button
            onClick={() => handleModeSwitch('admin')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
              mode === 'admin'
                ? 'bg-msc-dark text-white shadow-sm'
                : 'text-msc-soft dark:text-msc-mid hover:text-msc-dark dark:hover:text-white'
            }`}
          >
            <Building2 size={12} />
            <span className="hidden sm:inline">Admin</span>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-full flex items-center justify-center text-msc-soft dark:text-msc-mid hover:bg-msc-gray dark:hover:bg-white/10 transition-colors"
            aria-label="Cambiar tema"
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          {(mode === 'client' ? clientLoggedIn : adminLoggedIn) && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs font-medium text-msc-soft dark:text-msc-mid hover:text-msc-dark dark:hover:text-white transition-colors px-3 py-1.5 rounded-full hover:bg-msc-gray dark:hover:bg-white/10"
            >
              <span>Salir</span>
              <ChevronDown size={12} className="rotate-90" />
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
