import { useState } from 'react';
import { Eye, EyeOff, Shield, TrendingUp, Lock, ArrowRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function ClientLogin() {
  const { setClientLoggedIn } = useApp();
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 900));
    if (email === 'juan.perez@email.com' && pin === '1234') {
      setClientLoggedIn(true);
    } else {
      setError('Credenciales incorrectas. Intenta con los datos demo.');
      setLoading(false);
    }
  };

  const handleQuickLogin = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    setClientLoggedIn(true);
  };

  return (
    <div className="min-h-screen bg-msc-white dark:bg-msc-black flex">
      {/* Left panel - Hero */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero relative overflow-hidden flex-col justify-between p-12">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/30">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <div>
              <p className="text-white font-bold text-lg leading-tight">Banco Mercantil</p>
              <p className="text-white/60 text-xs tracking-widest font-medium">SANTA CRUZ</p>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Tu futuro financiero<br />
            <span className="text-gradient-gold">comienza aquí</span>
          </h1>
          <p className="text-white/70 text-lg leading-relaxed max-w-sm">
            Gestioná tu deuda de manera inteligente con nuestra plataforma impulsada por IA.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="relative z-10 space-y-3">
          {[
            { icon: Shield, text: 'Tu información protegida 256-bit SSL' },
            { icon: TrendingUp, text: 'Planes personalizados con IA en segundos' },
            { icon: Lock, text: 'Historial crediticio siempre seguro' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="glass rounded-xl px-4 py-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-msc-gold/20 flex items-center justify-center flex-shrink-0">
                <Icon size={16} className="text-msc-beige" />
              </div>
              <p className="text-white/80 text-sm">{text}</p>
            </div>
          ))}
        </div>

        {/* Mountain decoration */}
        <div className="absolute bottom-0 left-0 right-0 opacity-10">
          <svg viewBox="0 0 800 200" fill="white">
            <polygon points="0,200 200,60 350,120 500,40 650,100 800,30 800,200" />
          </svg>
        </div>
        <div className="absolute bottom-0 left-0 right-0 opacity-5">
          <svg viewBox="0 0 800 200" fill="white">
            <polygon points="0,200 150,90 300,140 500,60 700,120 800,80 800,200" />
          </svg>
        </div>
      </div>

      {/* Right panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-sm animate-fade-in">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full gradient-msc flex items-center justify-center">
              <span className="text-white font-bold">M</span>
            </div>
            <div>
              <p className="font-bold text-msc-dark dark:text-white text-sm">Banco Mercantil Santa Cruz</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-msc-black dark:text-white mb-1">Bienvenido</h2>
          <p className="text-msc-mid dark:text-msc-soft text-sm mb-8">Ingresá a tu portal de deuda</p>

          {/* Quick login */}
          <button
            onClick={handleQuickLogin}
            disabled={loading}
            className="w-full mb-6 flex items-center justify-between px-5 py-4 rounded-2xl border-2 border-dashed border-msc-soft/40 dark:border-msc-soft/20 hover:border-msc-dark hover:bg-msc-dark/5 dark:hover:border-msc-soft/40 transition-all group"
          >
            <div className="flex items-center gap-3">
              <img
                src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=60"
                alt="Juan"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="text-left">
                <p className="font-semibold text-msc-black dark:text-white text-sm">Entrar como Juan Pérez</p>
                <p className="text-xs text-msc-mid">Acceso demo instantáneo</p>
              </div>
            </div>
            <ArrowRight size={16} className="text-msc-soft group-hover:text-msc-dark dark:group-hover:text-white transition-colors" />
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-msc-gray dark:bg-white/10" />
            <span className="text-xs text-msc-mid">o con tus credenciales</span>
            <div className="flex-1 h-px bg-msc-gray dark:bg-white/10" />
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-msc-black dark:text-white mb-2">
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="juan.perez@email.com"
                className="w-full px-4 py-3 rounded-xl border border-msc-gray dark:border-white/15 bg-white dark:bg-white/5 text-msc-black dark:text-white placeholder-msc-mid text-sm focus:outline-none focus:border-msc-dark focus:ring-2 focus:ring-msc-dark/10 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-msc-black dark:text-white mb-2">
                PIN de acceso
              </label>
              <div className="relative">
                <input
                  type={showPin ? 'text' : 'password'}
                  value={pin}
                  onChange={e => setPin(e.target.value)}
                  placeholder="••••"
                  maxLength={6}
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-msc-gray dark:border-white/15 bg-white dark:bg-white/5 text-msc-black dark:text-white placeholder-msc-mid text-sm focus:outline-none focus:border-msc-dark focus:ring-2 focus:ring-msc-dark/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-msc-mid hover:text-msc-dark dark:hover:text-white transition-colors"
                >
                  {showPin ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 px-4 py-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/40">
                <span className="text-amber-600 dark:text-amber-400 text-xs mt-0.5">!</span>
                <p className="text-amber-700 dark:text-amber-300 text-xs">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-msc-dark hover:bg-msc-green text-white font-semibold text-sm transition-all duration-200 shadow-msc-sm hover:shadow-msc-md disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Ingresar <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-msc-mid mt-6">
            Demo: juan.perez@email.com / PIN: 1234
          </p>
        </div>
      </div>
    </div>
  );
}
