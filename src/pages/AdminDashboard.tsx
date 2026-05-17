import { useState, useMemo } from 'react';
import {
  TrendingDown, Users, DollarSign, BarChart3, Search,
  Download, MessageSquare, Mail, Phone, Bell,
  Calendar, UserCheck, RefreshCw, AlertOctagon,
  ChevronRight, X, ArrowUpRight, Layers, Target, Activity
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { adminKPIs, Debtor } from '@/data/mockData';
import { formatCurrency, getScoreColor, getScoreLabel, generatePlans } from '@/lib/finance';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, LineChart, Line, Legend
} from 'recharts';

type AdminView = 'overview' | 'debtors' | 'profile';

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 85 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
    : score >= 60 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
    : score >= 40 ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
    : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${color}`}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: getScoreColor(score) }} />
      {score}
    </span>
  );
}

function StatusBadge({ days }: { days: number }) {
  const cls = days >= 90 ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
    : days >= 60 ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400'
    : days >= 30 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
    : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400';
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}>
      {days}d mora
    </span>
  );
}

export default function AdminDashboard() {
  const { debtors, selectedDebtor, setSelectedDebtor, activePlans } = useApp();
  const [view, setView] = useState<AdminView>('overview');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [notifModal, setNotifModal] = useState(false);
  const [notifType, setNotifType] = useState('whatsapp');
  const [notifSent, setNotifSent] = useState(false);
  const [sendingNotif, setSendingNotif] = useState(false);
  const [assignModal, setAssignModal] = useState(false);
  const [assignedPlan, setAssignedPlan] = useState('');
  const [planSaved, setPlanSaved] = useState(false);

  const filtered = useMemo(() => {
    return debtors.filter(d => {
      const matchSearch = d.name.toLowerCase().includes(search.toLowerCase())
        || d.ci.includes(search)
        || d.email.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === 'all' || d.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [debtors, search, filterStatus]);

  const kpi = adminKPIs;

  const handleSendNotif = async () => {
    setSendingNotif(true);
    await new Promise(r => setTimeout(r, 1200));
    setSendingNotif(false);
    setNotifSent(true);
    setTimeout(() => { setNotifSent(false); setNotifModal(false); }, 2000);
  };

  const handleAssignPlan = async () => {
    setSendingNotif(true);
    await new Promise(r => setTimeout(r, 800));
    setSendingNotif(false);
    setPlanSaved(true);
    setTimeout(() => { setPlanSaved(false); setAssignModal(false); }, 2000);
  };

  const openProfile = (d: Debtor) => {
    setSelectedDebtor(d);
    setView('profile');
  };

  return (
    <div className="min-h-screen bg-msc-white dark:bg-msc-black pt-16">
      {/* Sub-nav */}
      <div className="sticky top-16 z-40 bg-white/95 dark:bg-msc-black/95 backdrop-blur-md border-b border-msc-gray dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 flex gap-1 py-2">
          {[
            { id: 'overview', label: 'Resumen', icon: BarChart3 },
            { id: 'debtors', label: 'Deudores', icon: Users },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setView(id as AdminView)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                view === id
                  ? 'bg-msc-dark text-white shadow-sm'
                  : 'text-msc-soft dark:text-msc-mid hover:bg-msc-gray dark:hover:bg-white/10 hover:text-msc-black dark:hover:text-white'
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* OVERVIEW */}
      {view === 'overview' && (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-6 animate-fade-in">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: 'Cartera mitigada',
                value: `Bs. ${formatCurrency(kpi.mitigatedPortfolio)}`,
                sub: `de Bs. ${formatCurrency(kpi.totalPortfolio)} total`,
                icon: Target,
                color: 'text-msc-dark',
                bg: 'bg-msc-dark/8',
                trend: '+12%',
              },
              {
                label: 'Planes aceptados',
                value: kpi.acceptedPlans.toString(),
                sub: `${kpi.plansInProgress} en proceso`,
                icon: Layers,
                color: 'text-msc-gold',
                bg: 'bg-msc-gold/10',
                trend: '+6',
              },
              {
                label: 'Ahorro operativo',
                value: `Bs. ${formatCurrency(kpi.operativeSavings)}`,
                sub: 'vs. gestión tradicional',
                icon: DollarSign,
                color: 'text-emerald-600',
                bg: 'bg-emerald-50 dark:bg-emerald-900/20',
                trend: '+23%',
              },
              {
                label: 'Mora reducida',
                value: `${kpi.moraReduction}%`,
                sub: 'en los últimos 6 meses',
                icon: TrendingDown,
                color: 'text-blue-600',
                bg: 'bg-blue-50 dark:bg-blue-900/20',
                trend: '-5.2%',
              },
            ].map(({ label, value, sub, icon: Icon, color, bg, trend }) => (
              <div key={label} className="bg-white dark:bg-white/5 rounded-2xl p-5 shadow-card border border-msc-gray dark:border-white/10">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                    <Icon size={18} className={color} />
                  </div>
                  <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                    <ArrowUpRight size={12} />
                    {trend}
                  </span>
                </div>
                <p className="text-2xl font-bold text-msc-black dark:text-white mb-0.5">{value}</p>
                <p className="text-xs text-msc-mid">{label}</p>
                <p className="text-[11px] text-msc-soft dark:text-msc-mid/60 mt-0.5">{sub}</p>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-white/5 rounded-2xl p-5 shadow-card border border-msc-gray dark:border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-msc-black dark:text-white text-sm">Evolución cartera mora</h3>
                <Activity size={16} className="text-msc-mid" />
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={kpi.monthlyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorMora" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#E8872A" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#E8872A" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorMit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#155B3A" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#155B3A" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#A8A8A8' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#A8A8A8' }} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
                  <Tooltip
                    formatter={(v, n) => [`Bs. ${formatCurrency(Number(v))}`, n === 'mora' ? 'Cartera mora' : 'Cartera mitigada']}
                    contentStyle={{ borderRadius: '12px', border: '1px solid #E5E5E5', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Area type="monotone" dataKey="mora" name="mora" stroke="#E8872A" strokeWidth={2} fill="url(#colorMora)" />
                  <Area type="monotone" dataKey="mitigada" name="mitigada" stroke="#155B3A" strokeWidth={2} fill="url(#colorMit)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white dark:bg-white/5 rounded-2xl p-5 shadow-card border border-msc-gray dark:border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-msc-black dark:text-white text-sm">Planes aceptados por mes</h3>
                <BarChart3 size={16} className="text-msc-mid" />
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={kpi.monthlyData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#A8A8A8' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#A8A8A8' }} />
                  <Tooltip
                    formatter={(v) => [v, 'Planes']}
                    contentStyle={{ borderRadius: '12px', border: '1px solid #E5E5E5', fontSize: '12px' }}
                  />
                  <Bar dataKey="planes" fill="#C7A15A" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick table */}
          <div className="bg-white dark:bg-white/5 rounded-2xl shadow-card border border-msc-gray dark:border-white/10 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-msc-gray dark:border-white/10">
              <h3 className="font-semibold text-msc-black dark:text-white text-sm">Casos críticos</h3>
              <button
                onClick={() => setView('debtors')}
                className="text-xs text-msc-dark dark:text-msc-beige font-medium flex items-center gap-1 hover:opacity-70 transition-opacity"
              >
                Ver todos <ChevronRight size={12} />
              </button>
            </div>
            <div className="divide-y divide-msc-gray dark:divide-white/5">
              {debtors.filter(d => d.status === 'critical').map(d => (
                <div
                  key={d.id}
                  onClick={() => openProfile(d)}
                  className="flex items-center gap-3 px-5 py-3.5 hover:bg-msc-white dark:hover:bg-white/5 cursor-pointer transition-colors"
                >
                  <img src={d.avatar} alt={d.name} className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-msc-black dark:text-white text-sm truncate">{d.name}</p>
                    <p className="text-xs text-msc-mid">Bs. {formatCurrency(d.debt)} · {d.moraDays}d mora</p>
                  </div>
                  <ScoreBadge score={d.score} />
                  <ChevronRight size={14} className="text-msc-mid flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* DEBTORS TABLE */}
      {view === 'debtors' && (
        <div className="max-w-7xl mx-auto px-4 py-6 animate-fade-in">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-msc-mid" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar por nombre, CI o email..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-msc-gray dark:border-white/15 bg-white dark:bg-white/5 text-msc-black dark:text-white placeholder-msc-mid text-sm focus:outline-none focus:border-msc-dark focus:ring-2 focus:ring-msc-dark/10 transition-all"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="px-3 py-2.5 rounded-xl border border-msc-gray dark:border-white/15 bg-white dark:bg-white/5 text-msc-black dark:text-white text-sm focus:outline-none focus:border-msc-dark transition-all"
              >
                <option value="all">Todos</option>
                <option value="critical">Crítico</option>
                <option value="high">Alto riesgo</option>
                <option value="medium">Medio</option>
                <option value="low">Bajo</option>
              </select>
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-msc-gray dark:border-white/15 bg-white dark:bg-white/5 text-msc-black dark:text-white text-sm hover:bg-msc-gray dark:hover:bg-white/10 transition-colors">
                <Download size={14} />
                <span className="hidden sm:inline">Exportar</span>
              </button>
            </div>
          </div>

          <p className="text-xs text-msc-mid mb-3">{filtered.length} deudores encontrados</p>

          {/* Cards grid on mobile, table on desktop */}
          <div className="hidden lg:block bg-white dark:bg-white/5 rounded-2xl shadow-card border border-msc-gray dark:border-white/10 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-msc-gray dark:border-white/10">
                  {['Cliente', 'CI', 'Edad', 'Deuda', 'Mora', 'Score', 'Último pago', 'Plan', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-msc-mid uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-msc-gray dark:divide-white/5">
                {filtered.map(d => (
                  <tr
                    key={d.id}
                    onClick={() => openProfile(d)}
                    className="hover:bg-msc-white dark:hover:bg-white/5 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={d.avatar} alt={d.name} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                        <div>
                          <p className="font-medium text-msc-black dark:text-white text-sm whitespace-nowrap">{d.name}</p>
                          <p className="text-xs text-msc-mid">{d.loanType}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-msc-black dark:text-white font-mono">{d.ci} {d.ciDept}</td>
                    <td className="px-4 py-3 text-sm text-msc-black dark:text-white">{d.age}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-msc-black dark:text-white whitespace-nowrap">
                      Bs. {formatCurrency(d.debt)}
                    </td>
                    <td className="px-4 py-3"><StatusBadge days={d.moraDays} /></td>
                    <td className="px-4 py-3"><ScoreBadge score={d.score} /></td>
                    <td className="px-4 py-3 text-sm text-msc-mid whitespace-nowrap">{d.lastPayment}</td>
                    <td className="px-4 py-3">
                      {activePlans[d.id] ? (
                        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Activo</span>
                      ) : (
                        <span className="text-xs text-msc-mid">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <ChevronRight size={14} className="text-msc-mid" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="lg:hidden space-y-3">
            {filtered.map(d => (
              <div
                key={d.id}
                onClick={() => openProfile(d)}
                className="bg-white dark:bg-white/5 rounded-2xl p-4 shadow-card border border-msc-gray dark:border-white/10 cursor-pointer hover:shadow-msc-sm transition-all"
              >
                <div className="flex items-start gap-3">
                  <img src={d.avatar} alt={d.name} className="w-12 h-12 rounded-2xl object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold text-msc-black dark:text-white text-sm">{d.name}</p>
                      <ScoreBadge score={d.score} />
                    </div>
                    <p className="text-xs text-msc-mid mt-0.5">{d.loanType} · CI {d.ci}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <StatusBadge days={d.moraDays} />
                      <span className="text-sm font-bold text-msc-dark dark:text-white">Bs. {formatCurrency(d.debt)}</span>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-msc-mid mt-1 flex-shrink-0" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PROFILE */}
      {view === 'profile' && selectedDebtor && (
        <DebtorProfile
          debtor={selectedDebtor}
          onBack={() => setView('debtors')}
          onNotify={() => setNotifModal(true)}
          onAssign={() => setAssignModal(true)}
          activePlan={activePlans[selectedDebtor.id]}
        />
      )}

      {/* Notification Modal */}
      {notifModal && selectedDebtor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1a2920] rounded-3xl p-6 w-full max-w-md shadow-msc-lg animate-fade-in border border-msc-gray dark:border-white/10">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-msc-black dark:text-white">Enviar notificación</h3>
              <button onClick={() => setNotifModal(false)} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-msc-gray dark:hover:bg-white/10 transition-colors">
                <X size={16} className="text-msc-mid" />
              </button>
            </div>

            <p className="text-sm text-msc-mid mb-4">Para: <strong className="text-msc-black dark:text-white">{selectedDebtor.name}</strong></p>

            <div className="grid grid-cols-2 gap-2 mb-5">
              {[
                { id: 'whatsapp', icon: MessageSquare, label: 'WhatsApp' },
                { id: 'sms', icon: Phone, label: 'SMS' },
                { id: 'email', icon: Mail, label: 'Emailes' },
                { id: 'push', icon: Bell, label: 'Push' },
              ].map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => setNotifType(id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                    notifType === id
                      ? 'border-msc-dark bg-msc-dark/5 dark:bg-msc-dark/30 text-msc-dark dark:text-white'
                      : 'border-msc-gray dark:border-white/10 text-msc-soft dark:text-msc-mid hover:border-msc-soft'
                  }`}
                >
                  <Icon size={14} />
                  {label}
                </button>
              ))}
            </div>

            <textarea
              rows={3}
              defaultValue={`Estimado/a ${selectedDebtor.firstName}, su cuota de Bs. ${formatCurrency(selectedDebtor.quota)} está vencida hace ${selectedDebtor.moraDays} días. Contáctenos para regularizar su situación.`}
              className="w-full px-4 py-3 rounded-xl border border-msc-gray dark:border-white/15 bg-white dark:bg-white/5 text-msc-black dark:text-white text-sm resize-none focus:outline-none focus:border-msc-dark transition-all mb-4"
            />

            <button
              onClick={handleSendNotif}
              disabled={sendingNotif || notifSent}
              className="w-full py-3 rounded-xl gradient-msc text-white font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-70 transition-all"
            >
              {notifSent ? (
                <><UserCheck size={16} /> Enviado exitosamente</>
              ) : sendingNotif ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Enviar por {notifType}</>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Assign Plan Modal */}
      {assignModal && selectedDebtor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1a2920] rounded-3xl p-6 w-full max-w-md shadow-msc-lg animate-fade-in border border-msc-gray dark:border-white/10">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-msc-black dark:text-white">Asignar plan de pago</h3>
              <button onClick={() => setAssignModal(false)} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-msc-gray dark:hover:bg-white/10 transition-colors">
                <X size={16} className="text-msc-mid" />
              </button>
            </div>

            <p className="text-sm text-msc-mid mb-4">Para: <strong className="text-msc-black dark:text-white">{selectedDebtor.name}</strong></p>

            <div className="space-y-2 mb-5">
              {generatePlans(selectedDebtor.debt, 5000).map(plan => (
                <button
                  key={plan.id}
                  onClick={() => setAssignedPlan(plan.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-sm transition-all ${
                    assignedPlan === plan.id
                      ? 'border-msc-dark bg-msc-dark/5 dark:bg-msc-dark/30'
                      : 'border-msc-gray dark:border-white/10 hover:border-msc-soft'
                  }`}
                >
                  <div className="text-left">
                    <p className="font-medium text-msc-black dark:text-white">{plan.name}</p>
                    <p className="text-xs text-msc-mid">{plan.months} meses · Bs. {formatCurrency(plan.monthlyPayment)}/mes</p>
                  </div>
                  {plan.isRecommended && (
                    <span className="text-xs text-msc-gold font-medium">IA rec.</span>
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={handleAssignPlan}
              disabled={!assignedPlan || sendingNotif || planSaved}
              className="w-full py-3 rounded-xl gradient-msc text-white font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
            >
              {planSaved ? (
                <><UserCheck size={16} /> Plan asignado</>
              ) : sendingNotif ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : 'Confirmar asignación'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function DebtorProfile({ debtor, onBack, onNotify, onAssign, activePlan }: {
  debtor: Debtor;
  onBack: () => void;
  onNotify: () => void;
  onAssign: () => void;
  activePlan?: string;
}) {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6 animate-fade-in">
      <button onClick={onBack} className="flex items-center gap-2 text-msc-soft dark:text-msc-mid text-sm mb-5 hover:text-msc-dark dark:hover:text-white transition-colors">
        ← Volver a deudores
      </button>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Left: profile card */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white dark:bg-white/5 rounded-2xl p-5 shadow-card border border-msc-gray dark:border-white/10">
            <div className="text-center mb-4">
              <img
                src={debtor.avatar}
                alt={debtor.name}
                className="w-20 h-20 rounded-2xl object-cover mx-auto mb-3 shadow-msc-sm"
              />
              <h2 className="font-bold text-msc-black dark:text-white text-lg">{debtor.name}</h2>
              <p className="text-msc-mid text-xs">{debtor.age} años · CI {debtor.ci} {debtor.ciDept}</p>
              <div className="mt-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                  debtor.score >= 85 ? 'bg-emerald-100 text-emerald-700'
                  : debtor.score >= 60 ? 'bg-yellow-100 text-yellow-700'
                  : debtor.score >= 40 ? 'bg-orange-100 text-orange-700'
                  : 'bg-red-100 text-red-700'
                }`}>
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: getScoreColor(debtor.score) }} />
                  Score {debtor.score} · {getScoreLabel(debtor.score)}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              {[
                { label: 'Emails', value: debtor.email },
                { label: 'Teléfono', value: debtor.phone },
                { label: 'Tipo crédito', value: debtor.loanType },
                { label: 'Deuda total', value: `Bs. ${formatCurrency(debtor.debt)}` },
                { label: 'Mora', value: `${debtor.moraDays} días` },
                { label: 'Último pago', value: debtor.lastPayment },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-start gap-2">
                  <span className="text-msc-mid text-xs flex-shrink-0">{label}</span>
                  <span className="text-msc-black dark:text-white text-xs font-medium text-right truncate max-w-[150px]">{value}</span>
                </div>
              ))}
            </div>

            {activePlan && (
              <div className="mt-3 px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700/30">
                <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">Plan activo: {activePlan}</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="bg-white dark:bg-white/5 rounded-2xl p-4 shadow-card border border-msc-gray dark:border-white/10">
            <p className="text-xs font-semibold text-msc-mid uppercase tracking-wide mb-3">Acciones</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                
                { icon: Bell, label: 'Canales de notificacion', action: onNotify },
                { icon: Calendar, label: 'Visita', action: () => alert('Visita programada') },
                { icon: AlertOctagon, label: 'Alerta IA', action: () => alert('Alerta predictiva enviada') },
                { icon: Layers, label: 'Asignar plan', action: onAssign },
                { icon: RefreshCw, label: 'Refinanciar', action: () => alert('Iniciando proceso de refinanciamiento') },
              ].map(({ icon: Icon, label, action }) => (
                <button
                  key={label}
                  onClick={action}
                  className="flex flex-col items-center gap-1.5 px-2 py-3 rounded-xl border border-msc-gray dark:border-white/10 text-msc-soft dark:text-msc-mid hover:border-msc-dark hover:text-msc-dark dark:hover:text-white hover:bg-msc-dark/5 dark:hover:bg-white/5 transition-all text-[11px] font-medium"
                >
                  <Icon size={15} />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: charts and history */}
        <div className="lg:col-span-2 space-y-4">
          {/* Score evolution */}
          <div className="bg-white dark:bg-white/5 rounded-2xl p-5 shadow-card border border-msc-gray dark:border-white/10">
            <h3 className="font-semibold text-msc-black dark:text-white text-sm mb-4">Evolución del score</h3>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={debtor.scoreHistory} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#A8A8A8' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#A8A8A8' }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E5E5E5', fontSize: '12px' }} />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#C7A15A"
                  strokeWidth={2.5}
                  dot={{ fill: '#C7A15A', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Payment history chart */}
          <div className="bg-white dark:bg-white/5 rounded-2xl p-5 shadow-card border border-msc-gray dark:border-white/10">
            <h3 className="font-semibold text-msc-black dark:text-white text-sm mb-4">Historial de pagos</h3>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={debtor.paymentHistory} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#A8A8A8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#A8A8A8' }} />
                <Tooltip
                  formatter={(v) => [`Bs. ${formatCurrency(Number(v))}`, 'Pagado']}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #E5E5E5', fontSize: '12px' }}
                />
                <Bar dataKey="amount" radius={[4, 4, 0, 0]}
                  fill="#155B3A"
                  label={false}
                />
              </BarChart>
            </ResponsiveContainer>

            <div className="flex gap-2 mt-3 flex-wrap">
              {debtor.paymentHistory.map(p => (
                <span key={p.month} className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  p.status === 'paid' ? 'bg-emerald-100 text-emerald-700'
                  : p.status === 'partial' ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-red-100 text-red-700'
                }`}>
                  {p.month} · {p.status === 'paid' ? 'Pagado' : p.status === 'partial' ? 'Parcial' : 'Sin pago'}
                </span>
              ))}
            </div>
          </div>

          {/* Loans */}
          <div className="bg-white dark:bg-white/5 rounded-2xl p-5 shadow-card border border-msc-gray dark:border-white/10">
            <h3 className="font-semibold text-msc-black dark:text-white text-sm mb-4">Préstamos activos e histórico</h3>
            <div className="space-y-3">
              {debtor.loans.map((loan, i) => (
                <div key={i} className="flex items-center justify-between px-4 py-3 rounded-xl bg-msc-white dark:bg-white/5 border border-msc-gray dark:border-white/10">
                  <div>
                    <p className="text-sm font-medium text-msc-black dark:text-white">{loan.type}</p>
                    <p className="text-xs text-msc-mid">{loan.date} · Bs. {formatCurrency(loan.amount)} original</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${loan.balance > 0 ? 'text-msc-orange' : 'text-emerald-600'}`}>
                      {loan.balance > 0 ? `Bs. ${formatCurrency(loan.balance)}` : 'Cancelado'}
                    </p>
                    <p className="text-xs text-msc-mid">{loan.balance > 0 ? 'saldo' : '✓'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Segmentation */}
          <div className="bg-white dark:bg-white/5 rounded-2xl p-5 shadow-card border border-msc-gray dark:border-white/10">
            <h3 className="font-semibold text-msc-black dark:text-white text-sm mb-3">Segmentación de riesgo</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Perfil de riesgo', value: debtor.status === 'critical' ? 'Alto' : debtor.status === 'high' ? 'Medio-Alto' : debtor.status === 'medium' ? 'Medio' : 'Bajo' },
                { label: 'Probabilidad pago', value: `${Math.max(20, 100 - debtor.moraDays)}%` },
                { label: 'Impacto recuperación', value: `Bs. ${formatCurrency(debtor.debt * 0.7)}` },
                { label: 'Estrategia IA', value: debtor.moraDays > 60 ? 'Restructuración urgente' : 'Plan estándar' },
              ].map(({ label, value }) => (
                <div key={label} className="px-3 py-2.5 rounded-xl bg-msc-white dark:bg-white/5 border border-msc-gray dark:border-white/10">
                  <p className="text-xs text-msc-mid mb-1">{label}</p>
                  <p className="text-sm font-semibold text-msc-black dark:text-white">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
