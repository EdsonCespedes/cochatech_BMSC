import { useState, useCallback } from 'react';
import {
  TrendingUp, RefreshCw, Plus, Trash2, BarChart3,
  Loader2, AlertCircle, ChevronDown, ChevronUp,
  DollarSign, Users, Percent, Zap, SlidersHorizontal,
  CheckCircle2, XCircle, Map
} from 'lucide-react';
import { formatCurrency } from '@/lib/finance';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Legend, RadarChart,
  PolarGrid, PolarAngleAxis, Radar
} from 'recharts';

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const API_BASE = 'https://bmsc-ai-admin.onrender.com';

const CITIES = [
  'Cochabamba', 'La Paz', 'Santa Cruz', 'Oruro',
  'Potosí', 'Sucre', 'Tarija', 'Trinidad', 'Cobija',
];

const SCENARIO_COLORS = [
  '#155B3A', '#C7A15A', '#2d8a5e', '#E8872A',
  '#1a7a50', '#DCC28A', '#0f4a2e', '#e07020',
];

// ─── TYPES ───────────────────────────────────────────────────────────────────
interface ScenarioParams {
  id: string;
  label: string;
  ciudad: string;
  daysAhead: number;
  minScore: number;
  color: string;
}

interface ProjectionResult {
  total_clients: number;
  total_debt: number;
  avg_pred_prob: number;
  projected_recovery: number;
  recovery_rate: number;
}

interface ScenarioState extends ScenarioParams {
  status: 'idle' | 'loading' | 'ok' | 'error';
  result: ProjectionResult | null;
  error: string;
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function uid() {
  return Math.random().toString(36).slice(2, 8);
}

function makeScenario(index: number): ScenarioState {
  return {
    id: uid(),
    label: `Escenario ${index + 1}`,
    ciudad: '',
    daysAhead: 30,
    minScore: 0,
    color: SCENARIO_COLORS[index % SCENARIO_COLORS.length],
    status: 'idle',
    result: null,
    error: '',
  };
}

async function fetchProjection(params: ScenarioParams): Promise<ProjectionResult> {
  const body: any = { days_ahead: params.daysAhead, min_score: params.minScore };
  if (params.ciudad) body.filters = { ciudad: params.ciudad };
  const res = await fetch(`${API_BASE}/projections`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return res.json();
}

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────

function MetricPill({
  label, value, icon: Icon, color = 'text-msc-dark',
}: { label: string; value: string; icon: any; color?: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-white/5 rounded-xl border border-msc-gray dark:border-white/10">
      <Icon size={13} className={color} />
      <div>
        <p className="text-[10px] text-msc-mid leading-none mb-0.5">{label}</p>
        <p className="text-xs font-bold text-msc-black dark:text-white">{value}</p>
      </div>
    </div>
  );
}

function RecoveryBar({ rate, color }: { rate: number; color: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-msc-mid">Tasa de recuperación</span>
        <span className="font-bold" style={{ color }}>{rate.toFixed(1)}%</span>
      </div>
      <div className="h-2 bg-msc-gray dark:bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${Math.min(rate, 100)}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

function ScenarioCard({
  scenario, index, onUpdate, onRun, onDelete, isOnly,
}: {
  scenario: ScenarioState;
  index: number;
  onUpdate: (id: string, patch: Partial<ScenarioParams>) => void;
  onRun: (id: string) => void;
  onDelete: (id: string) => void;
  isOnly: boolean;
}) {
  const [open, setOpen] = useState(true);
  const s = scenario;

  return (
    <div className="bg-white dark:bg-white/5 rounded-2xl border border-msc-gray dark:border-white/10 shadow-card overflow-hidden">

      {/* Card Header */}
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer select-none"
        onClick={() => setOpen(p => !p)}
      >
        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
        <input
          className="flex-1 text-sm font-semibold bg-transparent text-msc-black dark:text-white focus:outline-none"
          value={s.label}
          onClick={e => e.stopPropagation()}
          onChange={e => onUpdate(s.id, { label: e.target.value })}
        />
        {s.status === 'loading' && <Loader2 size={13} className="animate-spin text-msc-mid" />}
        {s.status === 'ok' && <CheckCircle2 size={13} className="text-emerald-600" />}
        {s.status === 'error' && <XCircle size={13} className="text-red-500" />}
        {!isOnly && (
          <button
            onClick={e => { e.stopPropagation(); onDelete(s.id); }}
            className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-msc-mid hover:text-red-500 transition-colors"
          >
            <Trash2 size={11} />
          </button>
        )}
        {open ? <ChevronUp size={13} className="text-msc-mid" /> : <ChevronDown size={13} className="text-msc-mid" />}
      </div>

      {open && (
        <div className="px-4 pb-4 space-y-4 border-t border-msc-gray dark:border-white/10 pt-4">

          {/* Ciudad */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-msc-black dark:text-white mb-1.5">
                <Map size={11} className="inline mr-1" />Ciudad
              </label>
              <select
                value={s.ciudad}
                onChange={e => onUpdate(s.id, { ciudad: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-msc-gray dark:border-white/15
                  bg-msc-white dark:bg-black/20 text-msc-black dark:text-white text-xs
                  focus:outline-none focus:ring-2 focus:ring-msc-dark/20"
              >
                <option value="">Todas</option>
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Score mínimo */}
            <div>
              <label className="block text-xs font-medium text-msc-black dark:text-white mb-1.5">
                Score mínimo
                <span className="ml-1 font-bold text-msc-dark dark:text-msc-beige">{s.minScore}</span>
              </label>
              <input
                type="range" min={0} max={95} step={5}
                value={s.minScore}
                onChange={e => onUpdate(s.id, { minScore: Number(e.target.value) })}
                className="w-full accent-[#155B3A] mt-1"
              />
              <div className="flex justify-between text-[10px] text-msc-mid mt-0.5">
                <span>0</span><span>50</span><span>95</span>
              </div>
            </div>
          </div>

          {/* Horizonte */}
          <div>
            <div className="flex justify-between mb-1.5">
              <label className="text-xs font-medium text-msc-black dark:text-white">
                Horizonte de proyección
              </label>
              <span className="text-xs font-bold text-msc-dark dark:text-msc-beige">{s.daysAhead} días</span>
            </div>
            <input
              type="range" min={7} max={60} step={7}
              value={s.daysAhead}
              onChange={e => onUpdate(s.id, { daysAhead: Number(e.target.value) })}
              className="w-full accent-[#155B3A]"
            />
            <div className="flex justify-between text-[10px] text-msc-mid mt-0.5">
              {[7, 14, 21, 30, 37, 45, 52, 60].map(d => (
                <span key={d}>{d}d</span>
              ))}
            </div>
          </div>

          {/* Error */}
          {s.status === 'error' && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/40">
              <AlertCircle size={12} className="text-red-600 flex-shrink-0" />
              <p className="text-xs text-red-700 dark:text-red-300">{s.error}</p>
            </div>
          )}

          {/* Result metrics */}
          {s.status === 'ok' && s.result && (
            <div className="space-y-3 pt-1">
              <div className="grid grid-cols-2 gap-2">
                <MetricPill label="Clientes" value={s.result.total_clients.toLocaleString()} icon={Users} />
                <MetricPill label="Prob. media pago" value={`${(s.result.avg_pred_prob * 100).toFixed(1)}%`} icon={Percent} color="text-emerald-600" />
                <MetricPill label="Deuda total" value={`Bs. ${formatCurrency(s.result.total_debt)}`} icon={DollarSign} color="text-orange-600" />
                <MetricPill label="Recuperación proy." value={`Bs. ${formatCurrency(s.result.projected_recovery)}`} icon={Zap} color="text-emerald-600" />
              </div>
              <RecoveryBar rate={s.result.recovery_rate} color={s.color} />
            </div>
          )}

          {/* Run button */}
          <button
            onClick={() => onRun(s.id)}
            disabled={s.status === 'loading'}
            className="w-full py-2.5 rounded-xl gradient-msc text-white text-xs font-semibold
              flex items-center justify-center gap-2 hover:opacity-90 transition-all
              disabled:opacity-50 disabled:cursor-not-allowed shadow-msc-sm"
          >
            {s.status === 'loading'
              ? <><Loader2 size={13} className="animate-spin" />Analizando…</>
              : <><RefreshCw size={13} />{s.status === 'ok' ? 'Recalcular' : 'Ejecutar proyección'}</>
            }
          </button>
        </div>
      )}
    </div>
  );
}

// ─── CHARTS ──────────────────────────────────────────────────────────────────

const tooltipStyle = {
  contentStyle: {
    borderRadius: '12px',
    border: '1px solid #E5E5E5',
    fontSize: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  },
};

function ComparisonCharts({ scenarios }: { scenarios: ScenarioState[] }) {
  const ready = scenarios.filter(s => s.status === 'ok' && s.result);
  if (ready.length === 0) return null;

  const barData = ready.map(s => ({
    name: s.label,
    'Recuperación (%)': parseFloat(s.result!.recovery_rate.toFixed(1)),
    'Prob. pago (%)': parseFloat((s.result!.avg_pred_prob * 100).toFixed(1)),
    fill: s.color,
  }));

  const radarData = [
    { metric: 'Recuperación', ...Object.fromEntries(ready.map(s => [s.label, s.result!.recovery_rate])) },
    { metric: 'Prob. pago', ...Object.fromEntries(ready.map(s => [s.label, s.result!.avg_pred_prob * 100])) },
    { metric: 'Score base', ...Object.fromEntries(ready.map(s => [s.label, s.minScore === 0 ? 50 : s.minScore])) },
    { metric: 'Horizonte', ...Object.fromEntries(ready.map(s => [s.label, (s.daysAhead / 60) * 100])) },
  ];

  const lineData = ready.map(s => ({
    name: s.label,
    deuda: Math.round(s.result!.total_debt),
    recuperacion: Math.round(s.result!.projected_recovery),
  }));

  return (
    <div className="space-y-4">

      {/* Recovery Rate Comparison */}
      <div className="bg-white dark:bg-white/5 rounded-2xl p-5 border border-msc-gray dark:border-white/10 shadow-card">
        <h3 className="text-sm font-semibold text-msc-black dark:text-white mb-4 flex items-center gap-2">
          <BarChart3 size={14} className="text-msc-dark dark:text-msc-beige" />
          Comparación de tasas
        </h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={barData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" strokeOpacity={0.5} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#A8A8A8' }} />
            <YAxis tick={{ fontSize: 11, fill: '#A8A8A8' }} domain={[0, 100]} tickFormatter={v => `${v}%`} />
            <Tooltip {...tooltipStyle} formatter={(v: any) => `${v}%`} />
            <Legend wrapperStyle={{ fontSize: '11px' }} />
            <Bar dataKey="Recuperación (%)" fill="#155B3A" radius={[6, 6, 0, 0]} />
            <Bar dataKey="Prob. pago (%)" fill="#C7A15A" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Deuda vs Recuperación */}
      {ready.length > 1 && (
        <div className="bg-white dark:bg-white/5 rounded-2xl p-5 border border-msc-gray dark:border-white/10 shadow-card">
          <h3 className="text-sm font-semibold text-msc-black dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp size={14} className="text-msc-dark dark:text-msc-beige" />
            Deuda vs Recuperación proyectada (Bs.)
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={lineData} margin={{ top: 0, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" strokeOpacity={0.5} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#A8A8A8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#A8A8A8' }} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip {...tooltipStyle} formatter={(v: any) => `Bs. ${formatCurrency(v)}`} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Bar dataKey="deuda" name="Deuda total" fill="#E8872A" radius={[6, 6, 0, 0]} opacity={0.8} />
              <Bar dataKey="recuperacion" name="Recuperación proy." fill="#155B3A" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Radar — solo si hay 2+ escenarios */}
      {ready.length >= 2 && (
        <div className="bg-white dark:bg-white/5 rounded-2xl p-5 border border-msc-gray dark:border-white/10 shadow-card">
          <h3 className="text-sm font-semibold text-msc-black dark:text-white mb-4 flex items-center gap-2">
            <SlidersHorizontal size={14} className="text-msc-dark dark:text-msc-beige" />
            Perfil comparativo de escenarios
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#E5E5E5" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: '#A8A8A8' }} />
              {ready.map(s => (
                <Radar
                  key={s.id}
                  name={s.label}
                  dataKey={s.label}
                  stroke={s.color}
                  fill={s.color}
                  fillOpacity={0.15}
                  strokeWidth={2}
                />
              ))}
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Tooltip {...tooltipStyle} formatter={(v: any) => `${parseFloat(v).toFixed(1)}`} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

// ─── SUMMARY BAR ─────────────────────────────────────────────────────────────
function SummaryBar({ scenarios }: { scenarios: ScenarioState[] }) {
  const ready = scenarios.filter(s => s.status === 'ok' && s.result);
  if (ready.length === 0) return null;

  const totalDebt = ready.reduce((a, s) => a + s.result!.total_debt, 0) / ready.length;
  const avgRecovery = ready.reduce((a, s) => a + s.result!.recovery_rate, 0) / ready.length;
  const totalClients = Math.max(...ready.map(s => s.result!.total_clients));
  const bestScenario = ready.reduce((best, s) => s.result!.recovery_rate > best.result!.recovery_rate ? s : best);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {[
        { label: 'Escenarios analizados', value: ready.length.toString(), icon: BarChart3, color: 'text-msc-dark' },
        { label: 'Máx. clientes evaluados', value: totalClients.toLocaleString(), icon: Users, color: 'text-msc-dark' },
        { label: 'Recuperación promedio', value: `${avgRecovery.toFixed(1)}%`, icon: TrendingUp, color: 'text-emerald-600' },
        { label: 'Mejor escenario', value: bestScenario.label, icon: Zap, color: 'text-msc-gold' },
      ].map(({ label, value, icon: Icon, color }) => (
        <div key={label} className="bg-white dark:bg-white/5 rounded-2xl p-4 border border-msc-gray dark:border-white/10 shadow-card">
          <Icon size={14} className={`${color} mb-2`} />
          <p className="text-base font-bold text-msc-black dark:text-white leading-tight">{value}</p>
          <p className="text-xs text-msc-mid mt-0.5">{label}</p>
        </div>
      ))}
    </div>
  );
}

// ─── MAIN PAGE ───────────────────────────────────────────────────────────────
export default function Projections() {
  const [scenarios, setScenarios] = useState<ScenarioState[]>([makeScenario(0)]);

  const updateScenario = useCallback((id: string, patch: Partial<ScenarioParams>) => {
    setScenarios(prev => prev.map(s => s.id === id ? { ...s, ...patch } : s));
  }, []);

  const addScenario = useCallback(() => {
    setScenarios(prev => {
      if (prev.length >= 4) return prev;
      return [...prev, makeScenario(prev.length)];
    });
  }, []);

  const deleteScenario = useCallback((id: string) => {
    setScenarios(prev => prev.filter(s => s.id !== id));
  }, []);

  const runScenario = useCallback(async (id: string) => {
    setScenarios(prev => prev.map(s => s.id === id ? { ...s, status: 'loading', error: '' } : s));
    const target = scenarios.find(s => s.id === id);
    if (!target) return;
    try {
      const result = await fetchProjection(target);
      setScenarios(prev => prev.map(s => s.id === id ? { ...s, status: 'ok', result } : s));
    } catch (e: any) {
      setScenarios(prev => prev.map(s => s.id === id
        ? { ...s, status: 'error', error: e.message || 'Error al conectar con la IA' }
        : s
      ));
    }
  }, [scenarios]);

  const runAll = useCallback(async () => {
    for (const s of scenarios) {
      await runScenario(s.id);
    }
  }, [scenarios, runScenario]);

  const anyLoading = scenarios.some(s => s.status === 'loading');
  const anyReady = scenarios.some(s => s.status === 'ok');

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-10 h-10 rounded-xl gradient-msc flex items-center justify-center shadow-msc-sm">
              <TrendingUp size={20} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-msc-black dark:text-white">Proyecciones</h1>
          </div>
          <p className="text-msc-mid text-sm pl-12">
            Compara escenarios de recuperación · hasta 60 días · filtros por ciudad y score
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={runAll}
            disabled={anyLoading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-msc text-white
              text-sm font-medium hover:opacity-90 transition-all shadow-msc-sm
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {anyLoading
              ? <><Loader2 size={14} className="animate-spin" />Analizando…</>
              : <><RefreshCw size={14} />Ejecutar todos</>
            }
          </button>

          {scenarios.length < 4 && (
            <button
              onClick={addScenario}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-msc-gray dark:border-white/15
                bg-white dark:bg-white/5 text-msc-black dark:text-white text-sm font-medium
                hover:border-msc-dark dark:hover:border-msc-beige/40 transition-all"
            >
              <Plus size={14} />
              Escenario
            </button>
          )}
        </div>
      </div>

      {/* Summary */}
      <SummaryBar scenarios={scenarios} />

      {/* Layout: escenarios + gráficos */}
      <div className="grid lg:grid-cols-[380px_1fr] gap-5 items-start">

        {/* Left: Scenario Cards */}
        <div className="space-y-4">
          <p className="text-xs font-medium text-msc-mid uppercase tracking-wide flex items-center gap-1.5">
            <SlidersHorizontal size={11} />
            Parámetros por escenario
            <span className="ml-auto normal-case font-normal">{scenarios.length}/4</span>
          </p>

          {scenarios.map((s, i) => (
            <ScenarioCard
              key={s.id}
              scenario={s}
              index={i}
              onUpdate={updateScenario}
              onRun={runScenario}
              onDelete={deleteScenario}
              isOnly={scenarios.length === 1}
            />
          ))}

          {scenarios.length < 4 && (
            <button
              onClick={addScenario}
              className="w-full py-3 rounded-2xl border-2 border-dashed border-msc-gray dark:border-white/15
                text-msc-mid hover:border-msc-dark dark:hover:border-msc-beige/40
                hover:text-msc-black dark:hover:text-white transition-all text-xs font-medium
                flex items-center justify-center gap-2"
            >
              <Plus size={13} />
              Agregar escenario de comparación
            </button>
          )}
        </div>

        {/* Right: Charts */}
        <div className="space-y-4">
          {anyReady ? (
            <ComparisonCharts scenarios={scenarios} />
          ) : (
            <div className="bg-white dark:bg-white/5 rounded-2xl border border-dashed border-msc-gray dark:border-white/15 p-12 text-center">
              <TrendingUp size={32} className="mx-auto text-msc-gray dark:text-white/20 mb-3" />
              <p className="text-sm font-medium text-msc-mid">Sin resultados aún</p>
              <p className="text-xs text-msc-mid/70 mt-1">
                Configura los parámetros y ejecuta al menos un escenario
              </p>
            </div>
          )}
        </div>
      </div>

      <p className="text-xs text-msc-mid text-center pt-2">
        Motor XGBoost · Dataset sintético fintech Bolivia · API: bmsc-ai-admin.onrender.com
      </p>
    </div>
  );
}