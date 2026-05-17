import { useState } from 'react';
import { Clock, CircleAlert as AlertCircle, Settings, CircleCheck as CheckCircle2, User, Calendar, MapPin, TrendingUp, Zap, X, Plus } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { collectionAgents, debtors, moraRecords } from '@/data/extendedMockData';
import { formatCurrency } from '@/lib/finance';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

interface Assignment {
  debtorId: string;
  agentId: string;
  assignedDate: string;
  daysBeforeMora: number;
  status: 'pending' | 'active' | 'completed';
  expectedMoraDate: string;
}

export default function AgentAssignments() {
  const { debtors: allDebtors } = useApp();
  const [daysThreshold, setDaysThreshold] = useState(7);
  const [showConfig, setShowConfig] = useState(false);
  const [autoAssignEnabled, setAutoAssignEnabled] = useState(true);

  // Simulated assignments
  const assignments: Assignment[] = [
    { debtorId: '1', agentId: 'ag1', assignedDate: '2025-05-10', daysBeforeMora: 7, status: 'active', expectedMoraDate: '2025-05-17' },
    { debtorId: '2', agentId: 'ag2', assignedDate: '2025-05-08', daysBeforeMora: 7, status: 'active', expectedMoraDate: '2025-05-15' },
    { debtorId: '4', agentId: 'ag2', assignedDate: '2025-05-05', daysBeforeMora: 7, status: 'active', expectedMoraDate: '2025-05-12' },
    { debtorId: '6', agentId: 'ag1', assignedDate: '2025-05-09', daysBeforeMora: 7, status: 'active', expectedMoraDate: '2025-05-16' },
    { debtorId: '7', agentId: 'ag3', assignedDate: '2025-05-03', daysBeforeMora: 7, status: 'completed', expectedMoraDate: '2025-05-10' },
  ];

  const getAgentName = (id: string) => collectionAgents.find(a => a.id === id)?.name || 'N/A';
  const getDebtorName = (id: string) => allDebtors.find(d => d.id === id)?.name || 'N/A';
  const getDebtorDebt = (id: string) => allDebtors.find(d => d.id === id)?.debt || 0;

  const timelineData = [
    { day: 'Día -7', assignments: 2, monitored: 2 },
    { day: 'Día -5', assignments: 4, monitored: 4 },
    { day: 'Día -3', assignments: 5, monitored: 5 },
    { day: 'Día -1', assignments: 5, monitored: 4 },
    { day: 'Día 0 (Mora)', assignments: 5, monitored: 3 },
    { day: 'Día +3', assignments: 5, monitored: 2 },
  ];
  const [records, setRecords] = useState(moraRecords);

  const stats = [
    {
      label: 'Asignaciones activas',
      value: records.filter(
        record => record.assignedAgent && record.phase !== 'resolved'
      ).length,
      icon: Clock,
      color: 'text-msc-dark',
    },
    {
      label: 'Casos monitorados',
      value: records.length,
      icon: Eye,
      color: 'text-msc-gold',
    },
    {
      label: 'Conversión cobranza',
      value: '60%',
      icon: TrendingUp,
      color: 'text-emerald-600',
    },
    {
      label: 'Mora prevenida',
      value: `Bs. ${formatCurrency(450000)}`,
      icon: Zap,
      color: 'text-msc-orange',
    },
  ];

  const handleAssign = (debtorId: string, agentId: string) => {
    setRecords(prev =>
      prev.map(r =>
        r.debtorId === debtorId
          ? {
              ...r,
              assignedAgent: agentId,
            }
          : r
      )
    );
  };

  const handleUnassign = (debtorId: string) => {
    setRecords(prev =>
      prev.map(r =>
        r.debtorId === debtorId
          ? {
              ...r,
              assignedAgent: undefined,
            }
          : r
      )
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl gradient-msc flex items-center justify-center">
              <Clock size={20} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-msc-black dark:text-white">Asignación de Agentes</h1>
          </div>
          <p className="text-msc-mid text-sm">Monitoreo anticipado de deudores antes de entrar en mora</p>
        </div>
        <button
          onClick={() => setShowConfig(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-msc-dark text-white font-medium text-sm hover:opacity-90 transition-all shadow-msc-sm"
        >
          <Settings size={16} />
          Configurar
        </button>
      </div>

      {/* Stats */}
      <div className="grid lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white dark:bg-white/5 rounded-2xl p-4 shadow-card border border-msc-gray dark:border-white/10">
            <Icon size={18} className={`${color} mb-2`} />
            <p className="text-2xl font-bold text-msc-black dark:text-white">{value}</p>
            <p className="text-xs text-msc-mid">{label}</p>
          </div>
        ))}
      </div>

      {/* Timeline Chart */}
      <div className="bg-white dark:bg-white/5 rounded-2xl p-6 shadow-card border border-msc-gray dark:border-white/10">
        <h3 className="font-semibold text-msc-black dark:text-white text-sm mb-4">Timeline de monitoreo (Flujo típico)</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={timelineData} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#A8A8A8' }} />
            <YAxis tick={{ fontSize: 11, fill: '#A8A8A8' }} />
            <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E5E5E5', fontSize: '12px' }} />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Line type="monotone" dataKey="assignments" name="Asignadas" stroke="#155B3A" strokeWidth={2.5} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="monitored" name="Activamente monitoreadas" stroke="#C7A15A" strokeWidth={2.5} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Assignments Table */}
      <div className="bg-white dark:bg-white/5 rounded-2xl shadow-card border border-msc-gray dark:border-white/10 overflow-hidden">
        <div className="px-6 py-4 border-b border-msc-gray dark:border-white/10">
          <h3 className="font-semibold text-msc-black dark:text-white text-sm">Asignaciones activas</h3>
          <p className="text-xs text-msc-mid mt-1">Monitoreo automático {daysThreshold} días antes de mora estimada</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-msc-gray dark:border-white/10 bg-msc-gray/50 dark:bg-white/5">
                {['Deudor', 'CI', 'Deuda', 'Agente', 'Asignado', 'Mora estimada', 'Estado', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-msc-mid uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-msc-gray dark:divide-white/5">
              {records.map(record => {
                const debtor = allDebtors.find(d => d.id === record.debtorId);
                const agent = collectionAgents.find(a => a.id === record.assignedAgent);

                return (
                  <tr
                    key={record.debtorId}
                    className="hover:bg-msc-white dark:hover:bg-white/5 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <img
                          src={debtor?.avatar}
                          alt=""
                          className="w-7 h-7 rounded-full object-cover"
                        />

                        <div>
                          <p className="text-sm font-medium text-msc-black dark:text-white">
                            {debtor?.name || `Cliente ${record.debtorId}`}
                          </p>

                          <p className="text-[11px] text-msc-mid">
                            {record.moraDays} días mora
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-xs font-mono text-msc-mid">
                      {debtor?.ci || 'N/A'}
                    </td>

                    <td className="px-4 py-3 text-sm font-semibold text-msc-black dark:text-white">
                      Bs. {formatCurrency(debtor?.debt || 0)}
                    </td>

                    <td className="px-4 py-3">
                      {agent ? (
                        <div>
                          <p className="text-sm text-msc-black dark:text-white">
                            {agent.name}
                          </p>

                          <p className="text-[11px] text-msc-mid">
                            {agent.department}
                          </p>
                        </div>
                      ) : (
                        <span className="text-xs text-red-500">
                          Sin asignar
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3 text-xs text-msc-mid">
                      {record.date}
                    </td>

                    <td className="px-4 py-3 text-xs text-msc-mid">
                      {record.nextActionDate || 'Pendiente'}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                          record.phase === 'resolved'
                            ? 'bg-emerald-100 text-emerald-700'
                            : record.phase === 'legal'
                            ? 'bg-red-100 text-red-700'
                            : record.phase === 'negotiation'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {record.phase}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 justify-end flex-wrap">
                        {record.assignedAgent ? (
                          <button
                            onClick={() => handleUnassign(record.debtorId)}
                            className="px-2 py-1 rounded-lg text-xs bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                          >
                            Desasignar
                          </button>
                        ) : (
                          collectionAgents.map(agent => (
                            <button
                              key={agent.id}
                              onClick={() =>
                                handleAssign(record.debtorId, agent.id)
                              }
                              className="px-2 py-1 rounded-lg text-xs bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors"
                            >
                              {agent.name.split(' ')[0]}
                            </button>
                          ))
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Config Modal */}
      {showConfig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1a2920] rounded-3xl p-6 w-full max-w-md shadow-msc-lg animate-fade-in border border-msc-gray dark:border-white/10">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-msc-black dark:text-white">Configurar asignaciones</h3>
              <button onClick={() => setShowConfig(false)} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-msc-gray dark:hover:bg-white/10">
                <X size={16} className="text-msc-mid" />
              </button>
            </div>

            <div className="space-y-5 mb-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-msc-black dark:text-white">Autoasignación automática</label>
                  <button
                    onClick={() => setAutoAssignEnabled(!autoAssignEnabled)}
                    className={`w-10 h-6 rounded-full transition-all ${autoAssignEnabled ? 'bg-msc-dark' : 'bg-msc-gray dark:bg-white/10'}`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transition-transform ${autoAssignEnabled ? 'translate-x-4.5' : 'translate-x-0.5'}`} />
                  </button>
                </div>
                <p className="text-xs text-msc-mid">Asignar automáticamente agentes a deudores antes de mora</p>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-msc-black dark:text-white">Días antes de mora</label>
                  <span className="text-sm font-bold text-msc-dark">{daysThreshold} días</span>
                </div>
                <input
                  type="range"
                  min={3}
                  max={30}
                  step={1}
                  value={daysThreshold}
                  onChange={e => setDaysThreshold(Number(e.target.value))}
                  className="w-full accent-[#155B3A]"
                />
                <p className="text-xs text-msc-mid mt-1">Asignar agentes {daysThreshold} días antes de la cuota vencida estimada</p>
              </div>

              <div>
                <label className="text-sm font-medium text-msc-black dark:text-white block mb-2">Distribuir por departamento</label>
                <div className="space-y-2">
                  {['SC', 'LP', 'CB'].map(dept => (
                    <button key={dept} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-msc-gray dark:border-white/15 text-msc-black dark:text-white text-sm hover:bg-msc-gray dark:hover:bg-white/5 transition-all">
                      <input type="checkbox" defaultChecked className="w-4 h-4" />
                      <span>{dept}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-msc-black dark:text-white block mb-2">Prioridad de casos</label>
                <select className="w-full px-3 py-2 rounded-lg border border-msc-gray dark:border-white/15 bg-white dark:bg-white/5 text-msc-black dark:text-white text-sm focus:outline-none focus:border-msc-dark">
                  <option>Por score descendente (más riesgo primero)</option>
                  <option>Por monto descendente</option>
                  <option>Por antigüedad de deuda</option>
                  <option>Por historial de pagos</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => setShowConfig(false)}
              className="w-full py-3 rounded-xl gradient-msc text-white font-semibold text-sm"
            >
              Guardar configuración
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Eye({ size }: { size: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
}
