import { useState } from 'react';
import { Users, Target, TrendingUp, Settings, Plus, CreditCard as Edit2, X, CircleCheck as CheckCircle2, Phone, Clock, Award, ChevronRight, CircleAlert as AlertCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/finance';
import { collectionAgents, CustomKPI } from '@/data/extendedMockData';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from 'recharts';

interface Agent {
  name: string;
  metrics: {
    totalAssigned: number;
    contacted: number;
    negotiations: number;
    resolved: number;
    resolutionRate: number;
    avgDaysToResolve: number;
    recoveredAmount: number;
  };
  customKPIs: CustomKPI[];
  avatar: string;
}

export default function AgentsKPI() {
  const [selectedAgent, setSelectedAgent] = useState(collectionAgents[0]);
  const [showKPIModal, setShowKPIModal] = useState(false);
  const [newKPI, setNewKPI] = useState({ name: '', target: '', unit: '' });

  const agentChartData = [
    { name: 'Asignados', [selectedAgent.name]: selectedAgent.metrics.totalAssigned },
    { name: 'Contactados', [selectedAgent.name]: selectedAgent.metrics.contacted },
    { name: 'Negociaciones', [selectedAgent.name]: selectedAgent.metrics.negotiations },
    { name: 'Resueltos', [selectedAgent.name]: selectedAgent.metrics.resolved },
  ];

  const allAgentsComparison = collectionAgents.map(agent => ({
    name: agent.name.split(' ')[0],
    resolutionRate: agent.metrics.resolutionRate,
    recovered: agent.metrics.recoveredAmount / 1000,
    contact: (agent.metrics.contacted / agent.metrics.totalAssigned * 100).toFixed(0),
  }));

  const handleAddKPI = () => {
    if (newKPI.name && newKPI.target) {
      alert(`KPI "${newKPI.name}" agregado exitosamente`);
      setNewKPI({ name: '', target: '', unit: '' });
      setShowKPIModal(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl gradient-msc flex items-center justify-center">
              <Users size={20} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-msc-black dark:text-white">KPI Agentes de Cobranza</h1>
          </div>
          <p className="text-msc-mid text-sm">Seguimiento de desempeño y métricas personalizadas</p>
        </div>
        <button
          onClick={() => setShowKPIModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-msc-dark text-white font-medium text-sm hover:opacity-90 transition-all shadow-msc-sm"
        >
          <Plus size={16} />
          Nueva métrica
        </button>
      </div>

      {/* Agent Selector */}
      <div className="bg-white dark:bg-white/5 rounded-2xl shadow-card border border-msc-gray dark:border-white/10 overflow-hidden">
        <div className="scrollbar-thin overflow-x-auto">
          <div className="flex gap-2 p-4">
            {collectionAgents.map(agent => (
              <button
                key={agent.id}
                onClick={() => setSelectedAgent(agent)}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all whitespace-nowrap ${
                  selectedAgent.id === agent.id
                    ? 'border-msc-dark bg-msc-dark/5 dark:bg-msc-dark/30'
                    : 'border-msc-gray dark:border-white/10 hover:border-msc-soft'
                }`}
              >
                <img src={agent.avatar} alt={agent.name} className="w-7 h-7 rounded-full object-cover" />
                <div className="text-left">
                  <p className="font-medium text-msc-black dark:text-white text-xs">{agent.name}</p>
                  <p className="text-[10px] text-msc-mid">{agent.metrics.resolutionRate.toFixed(0)}% resolución</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid lg:grid-cols-4 gap-4">
        {[
          { label: 'Casos resueltos', value: selectedAgent.metrics.resolved, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
          { label: 'Tasa resolución', value: `${selectedAgent.metrics.resolutionRate.toFixed(1)}%`, icon: TrendingUp, color: 'text-msc-dark', bg: 'bg-msc-dark/8' },
          { label: 'Recuperado', value: formatCurrency(selectedAgent.metrics.recoveredAmount), icon: Award, color: 'text-msc-gold', bg: 'bg-msc-gold/10' },
          { label: 'Promedio días', value: selectedAgent.metrics.avgDaysToResolve, sub: 'para resolver', icon: Clock, color: 'text-msc-soft', bg: 'bg-msc-soft/10' },
        ].map(({ label, value, icon: Icon, color, bg, sub }) => (
          <div key={label} className="bg-white dark:bg-white/5 rounded-2xl p-4 shadow-card border border-msc-gray dark:border-white/10">
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-2`}>
              <Icon size={18} className={color} />
            </div>
            <p className="text-2xl font-bold text-msc-black dark:text-white">{value}</p>
            <p className="text-xs text-msc-mid">{label}</p>
            {sub && <p className="text-[10px] text-msc-soft mt-0.5">{sub}</p>}
          </div>
        ))}
      </div>

      {/* Pipeline Chart */}
      <div className="bg-white dark:bg-white/5 rounded-2xl p-6 shadow-card border border-msc-gray dark:border-white/10">
        <h3 className="font-semibold text-msc-black dark:text-white text-sm mb-4">Pipeline de cobranza</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={agentChartData} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#A8A8A8' }} />
            <YAxis tick={{ fontSize: 11, fill: '#A8A8A8' }} />
            <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E5E5E5', fontSize: '12px' }} />
            <Bar dataKey={selectedAgent.name} fill="#155B3A" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Custom KPIs */}
      <div className="bg-white dark:bg-white/5 rounded-2xl p-6 shadow-card border border-msc-gray dark:border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-msc-black dark:text-white text-sm">Métricas personalizadas</h3>
          <button
            onClick={() => setShowKPIModal(true)}
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium text-msc-dark dark:text-msc-beige hover:bg-msc-dark/10 dark:hover:bg-msc-dark/30 transition-colors"
          >
            <Plus size={12} />
            Agregar
          </button>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {selectedAgent.customKPIs.map(kpi => {
            const percentage = (kpi.value / kpi.target) * 100;
            const isMet = percentage >= 100;
            return (
              <div
                key={kpi.id}
                className={`p-4 rounded-xl border ${
                  isMet
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700/30'
                    : percentage >= 80
                    ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700/30'
                    : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700/30'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <p className={`text-sm font-bold ${isMet ? 'text-emerald-700 dark:text-emerald-300' : percentage >= 80 ? 'text-yellow-700 dark:text-yellow-300' : 'text-red-700 dark:text-red-300'}`}>
                    {kpi.name}
                  </p>
                  <span className="text-xs font-bold" style={{ color: kpi.color }}>
                    {percentage.toFixed(0)}%
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-black/10 mb-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${Math.min(percentage, 100)}%`,
                      backgroundColor: kpi.color,
                    }}
                  />
                </div>
                <p className="text-xs text-msc-mid">
                  {kpi.value} / {kpi.target} {kpi.unit}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Agents Comparison */}
      <div className="bg-white dark:bg-white/5 rounded-2xl p-6 shadow-card border border-msc-gray dark:border-white/10">
        <h3 className="font-semibold text-msc-black dark:text-white text-sm mb-4">Comparativa de agentes</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={allAgentsComparison} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#A8A8A8' }} />
            <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#A8A8A8' }} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#A8A8A8' }} />
            <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E5E5E5', fontSize: '12px' }} />
            <Line yAxisId="left" type="monotone" dataKey="resolutionRate" name="% Resolución" stroke="#155B3A" strokeWidth={2.5} dot={{ r: 4 }} />
            <Line yAxisId="right" type="monotone" dataKey="recovered" name="Recuperado (k)" stroke="#C7A15A" strokeWidth={2.5} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Metas section */}
      <div className="bg-white dark:bg-white/5 rounded-2xl p-6 shadow-card border border-msc-gray dark:border-white/10">
        <h3 className="font-semibold text-msc-black dark:text-white text-sm mb-4">Metas de retorno (Meta mensual)</h3>
        <div className="space-y-3">
          {[
            { label: 'Meta resoluciones', current: 6, target: 8, unit: 'casos' },
            { label: 'Meta recuperación', current: 28400, target: 35000, unit: 'Bs.' },
            { label: 'Meta contactos', current: 10, target: 15, unit: 'intentos' },
          ].map(goal => {
            const percentage = (goal.current / goal.target) * 100;
            return (
              <div key={goal.label} className="flex items-end gap-3">
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-medium text-msc-black dark:text-white">{goal.label}</span>
                    <span className="text-xs font-bold text-msc-dark dark:text-msc-beige">
                      {goal.current} / {goal.target} {goal.unit}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-msc-gray dark:bg-white/10 overflow-hidden">
                    <div
                      className="h-full gradient-msc rounded-full transition-all"
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>
                <span className={`text-xs font-bold whitespace-nowrap ${percentage >= 100 ? 'text-emerald-600' : percentage >= 80 ? 'text-yellow-600' : 'text-msc-orange'}`}>
                  {percentage.toFixed(0)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* KPI Modal */}
      {showKPIModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1a2920] rounded-3xl p-6 w-full max-w-md shadow-msc-lg animate-fade-in border border-msc-gray dark:border-white/10">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-msc-black dark:text-white">Nueva métrica personalizada</h3>
              <button onClick={() => setShowKPIModal(false)} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-msc-gray dark:hover:bg-white/10 transition-colors">
                <X size={16} className="text-msc-mid" />
              </button>
            </div>

            <div className="space-y-4 mb-5">
              <div>
                <label className="block text-sm font-medium text-msc-black dark:text-white mb-2">Nombre de la métrica</label>
                <input
                  type="text"
                  value={newKPI.name}
                  onChange={e => setNewKPI(p => ({ ...p, name: e.target.value }))}
                  placeholder="Ej: Nuevas negociaciones"
                  className="w-full px-4 py-2.5 rounded-xl border border-msc-gray dark:border-white/15 bg-white dark:bg-white/5 text-msc-black dark:text-white placeholder-msc-mid text-sm focus:outline-none focus:border-msc-dark transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-msc-black dark:text-white mb-2">Meta (target)</label>
                <input
                  type="number"
                  value={newKPI.target}
                  onChange={e => setNewKPI(p => ({ ...p, target: e.target.value }))}
                  placeholder="Ej: 20"
                  className="w-full px-4 py-2.5 rounded-xl border border-msc-gray dark:border-white/15 bg-white dark:bg-white/5 text-msc-black dark:text-white placeholder-msc-mid text-sm focus:outline-none focus:border-msc-dark transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-msc-black dark:text-white mb-2">Unidad</label>
                <input
                  type="text"
                  value={newKPI.unit}
                  onChange={e => setNewKPI(p => ({ ...p, unit: e.target.value }))}
                  placeholder="Ej: casos, %"
                  className="w-full px-4 py-2.5 rounded-xl border border-msc-gray dark:border-white/15 bg-white dark:bg-white/5 text-msc-black dark:text-white placeholder-msc-mid text-sm focus:outline-none focus:border-msc-dark transition-all"
                />
              </div>
            </div>

            <button
              onClick={handleAddKPI}
              className="w-full py-3 rounded-xl gradient-msc text-white font-semibold text-sm"
            >
              Agregar métrica
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
