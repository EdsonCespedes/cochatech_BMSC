import { useState } from 'react';
import { Eye, EyeOff, BarChart3, Users, Shield, ArrowRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function AdminLogin() {
  const { setAdminLoggedIn } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 800));
    if (email === 'admin@bancamsc.bo' && password === 'admin123') {
      setAdminLoggedIn(true);
    } else {
      setError('Credenciales incorrectas.');
      setLoading(false);
    }
  };

  const handleQuickLogin = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    setAdminLoggedIn(true);
  };

  return (
    <div className="min-h-screen bg-msc-black flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12"
        style={{ background: 'linear-gradient(160deg, #0d3d27 0%, #155B3A 50%, #1F6B47 100%)' }}>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-12 h-12 rounded-full bg-white/15 flex items-center justify-center border border-white/20">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <div>
              <p className="text-white font-bold text-lg">Banco Mercantil</p>
              <p className="text-msc-beige text-xs tracking-widest">SANTA CRUZ · PANEL EJECUTIVO</p>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Centro de Control<br />
            <span className="text-gradient-gold">Cartera Mora</span>
          </h1>
          <p className="text-white/60 text-base leading-relaxed max-w-sm">
            Monitoreo en tiempo real, análisis predictivo y gestión inteligente de la cartera en mora.
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-3 gap-3">
          {[
            { icon: BarChart3, label: 'KPIs en tiempo real' },
            { icon: Users, label: 'Gestión deudores' },
            { icon: Shield, label: 'Score predictivo' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="glass rounded-xl p-4 text-center">
              <Icon size={20} className="text-msc-beige mx-auto mb-2" />
              <p className="text-white/70 text-xs">{label}</p>
            </div>
          ))}
        </div>

        <div className="absolute bottom-0 left-0 right-0 opacity-5">
          <svg viewBox="0 0 800 250" fill="white">
            <polygon points="0,250 120,80 280,150 450,50 620,120 800,60 800,250" />
          </svg>
        </div>

        {/* Grid decoration */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#0f1a15]">
        <div className="w-full max-w-sm animate-fade-in">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full gradient-msc flex items-center justify-center">
              <span className="text-white font-bold">M</span>
            </div>
            <p className="font-bold text-white text-sm">Banco MSC · Panel Ejecutivo</p>
          </div>

          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-msc-gold/10 border border-msc-gold/20 mb-4">
              <Shield size={12} className="text-msc-gold" />
              <span className="text-msc-gold text-xs font-medium">Acceso Restringido</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">Panel Ejecutivo</h2>
            <p className="text-msc-mid text-sm">Gestión de mora · Banco Mercantil Santa Cruz</p>
          </div>

          <button
            onClick={handleQuickLogin}
            disabled={loading}
            className="w-full mb-6 flex items-center justify-between px-5 py-4 rounded-2xl border border-msc-gold/30 bg-msc-gold/5 hover:bg-msc-gold/10 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full gradient-gold flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <div className="text-left">
                <p className="font-semibold text-white text-sm">Acceso ejecutivo demo</p>
                <p className="text-xs text-msc-mid">admin@bancamsc.bo</p>
              </div>
            </div>
            <ArrowRight size={16} className="text-msc-gold" />
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-msc-mid">o con credenciales</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-white/70 mb-2">
                Correo institucional
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@bancamsc.bo"
                className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/30 text-sm focus:outline-none focus:border-msc-soft focus:ring-2 focus:ring-msc-soft/10 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-white/70 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-white/10 bg-white/5 text-white placeholder-white/30 text-sm focus:outline-none focus:border-msc-soft focus:ring-2 focus:ring-msc-soft/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="px-4 py-3 rounded-xl bg-amber-900/30 border border-amber-700/40">
                <p className="text-amber-300 text-xs">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl gradient-msc hover:opacity-90 text-white font-semibold text-sm transition-all duration-200 shadow-msc-sm disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Ingresar al panel <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-white/30 mt-6">
            admin@bancamsc.bo / admin123
          </p>
        </div>
      </div>
    </div>
  );
}
