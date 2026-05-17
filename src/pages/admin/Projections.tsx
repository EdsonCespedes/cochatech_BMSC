import { useState, useCallback } from 'react';
import {
  TrendingUp,
  RefreshCw,
  Plus,
  Trash2,
  BarChart3,
  Loader2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Users,
  Percent,
  Zap,
  SlidersHorizontal,
  CheckCircle2,
  XCircle,
  Map,
} from 'lucide-react';

import { formatCurrency } from '@/lib/finance';

import {
  BarChart,
  Bar,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from 'recharts';

// ─────────────────────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────────────────────

const CITIES = [
  'Cochabamba',
  'La Paz',
  'Santa Cruz',
  'Oruro',
  'Potosí',
  'Sucre',
  'Tarija',
  'Trinidad',
  'Cobija',
];

const SCENARIO_COLORS = [
  '#155B3A',
  '#C7A15A',
  '#2d8a5e',
  '#E8872A',
];

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────
// MOCK IA
// ─────────────────────────────────────────────────────────────

async function fetchProjection(
  params: ScenarioParams
): Promise<ProjectionResult> {
  await new Promise(resolve => setTimeout(resolve, 1200));

  const cityFactor =
    params.ciudad === 'Santa Cruz'
      ? 1.25
      : params.ciudad === 'La Paz'
      ? 1.15
      : params.ciudad === 'Cochabamba'
      ? 1.1
      : params.ciudad
      ? 0.95
      : 1;

  const scoreFactor = 1 - params.minScore / 140;

  const totalClients = Math.round(
    (350 + Math.random() * 900) * cityFactor * scoreFactor
  );

  const totalDebt = Math.round(
    totalClients * (4000 + Math.random() * 9000)
  );

  const avg_pred_prob = Math.min(
    0.92,
    Math.max(
      0.18,
      0.35 +
        params.daysAhead / 100 +
        (100 - params.minScore) / 180 +
        Math.random() * 0.15
    )
  );

  const recovery_rate = Math.min(
    95,
    Math.max(
      20,
      avg_pred_prob * 100 * (0.7 + Math.random() * 0.5)
    )
  );

  const projected_recovery = Math.round(
    totalDebt * (recovery_rate / 100)
  );

  if (Math.random() < 0.05) {
    throw new Error('La IA no respondió correctamente');
  }

  return {
    total_clients: totalClients,
    total_debt: totalDebt,
    avg_pred_prob,
    projected_recovery,
    recovery_rate,
  };
}

// ─────────────────────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────────────────────

function MetricPill({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: any;
}) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-white/5 rounded-xl border border-msc-gray dark:border-white/10">
      <Icon size={13} className="text-msc-dark" />

      <div>
        <p className="text-[10px] text-msc-mid">{label}</p>

        <p className="text-xs font-bold text-msc-black dark:text-white">
          {value}
        </p>
      </div>
    </div>
  );
}

function RecoveryBar({
  rate,
  color,
}: {
  rate: number;
  color: string;
}) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-msc-mid">Tasa recuperación</span>

        <span className="font-bold" style={{ color }}>
          {rate.toFixed(1)}%
        </span>
      </div>

      <div className="h-2 rounded-full bg-msc-gray overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${Math.min(rate, 100)}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}

function ScenarioCard({
  scenario,
  onUpdate,
  onRun,
  onDelete,
  isOnly,
}: any) {
  const [open, setOpen] = useState(true);

  return (
    <div className="bg-white dark:bg-white/5 rounded-2xl border border-msc-gray dark:border-white/10 shadow-card overflow-hidden">
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer"
        onClick={() => setOpen(prev => !prev)}
      >
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: scenario.color }}
        />

        <input
          value={scenario.label}
          onClick={e => e.stopPropagation()}
          onChange={e =>
            onUpdate(scenario.id, { label: e.target.value })
          }
          className="flex-1 bg-transparent text-sm font-semibold focus:outline-none"
        />

        {scenario.status === 'loading' && (
          <Loader2 size={14} className="animate-spin" />
        )}

        {scenario.status === 'ok' && (
          <CheckCircle2 size={14} className="text-emerald-600" />
        )}

        {scenario.status === 'error' && (
          <XCircle size={14} className="text-red-500" />
        )}

        {!isOnly && (
          <button
            onClick={e => {
              e.stopPropagation();
              onDelete(scenario.id);
            }}
          >
            <Trash2 size={13} />
          </button>
        )}

        {open ? (
          <ChevronUp size={14} />
        ) : (
          <ChevronDown size={14} />
        )}
      </div>

      {open && (
        <div className="px-4 pb-4 pt-4 border-t border-msc-gray space-y-4">

          {/* Ciudad */}
          <div>
            <label className="text-xs font-medium mb-1 block">
              Ciudad
            </label>

            <select
              value={scenario.ciudad}
              onChange={e =>
                onUpdate(scenario.id, {
                  ciudad: e.target.value,
                })
              }
              className="w-full px-3 py-2 rounded-xl border border-msc-gray bg-white dark:bg-black/20 text-xs"
            >
              <option value="">Todas</option>

              {CITIES.map(city => (
                <option key={city}>{city}</option>
              ))}
            </select>
          </div>

          {/* Score */}
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-xs font-medium">
                Score mínimo
              </label>

              <span className="text-xs font-bold">
                {scenario.minScore}
              </span>
            </div>

            <input
              type="range"
              min={0}
              max={95}
              step={5}
              value={scenario.minScore}
              onChange={e =>
                onUpdate(scenario.id, {
                  minScore: Number(e.target.value),
                })
              }
              className="w-full accent-[#155B3A]"
            />
          </div>

          {/* Days */}
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-xs font-medium">
                Horizonte
              </label>

              <span className="text-xs font-bold">
                {scenario.daysAhead} días
              </span>
            </div>

            <input
              type="range"
              min={7}
              max={60}
              step={7}
              value={scenario.daysAhead}
              onChange={e =>
                onUpdate(scenario.id, {
                  daysAhead: Number(e.target.value),
                })
              }
              className="w-full accent-[#155B3A]"
            />
          </div>

          {/* Error */}
          {scenario.status === 'error' && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-50 border border-red-200">
              <AlertCircle size={12} className="text-red-600" />

              <p className="text-xs text-red-700">
                {scenario.error}
              </p>
            </div>
          )}

          {/* Metrics */}
          {scenario.status === 'ok' && scenario.result && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <MetricPill
                  label="Clientes"
                  value={scenario.result.total_clients.toLocaleString()}
                  icon={Users}
                />

                <MetricPill
                  label="Prob. pago"
                  value={`${(
                    scenario.result.avg_pred_prob * 100
                  ).toFixed(1)}%`}
                  icon={Percent}
                />

                <MetricPill
                  label="Deuda"
                  value={`Bs. ${formatCurrency(
                    scenario.result.total_debt
                  )}`}
                  icon={DollarSign}
                />

                <MetricPill
                  label="Recuperación"
                  value={`Bs. ${formatCurrency(
                    scenario.result.projected_recovery
                  )}`}
                  icon={Zap}
                />
              </div>

              <RecoveryBar
                rate={scenario.result.recovery_rate}
                color={scenario.color}
              />
            </div>
          )}

          {/* Run */}
          <button
            onClick={() => onRun(scenario.id)}
            disabled={scenario.status === 'loading'}
            className="w-full py-2.5 rounded-xl gradient-msc text-white text-xs font-semibold flex items-center justify-center gap-2"
          >
            {scenario.status === 'loading' ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                Analizando...
              </>
            ) : (
              <>
                <RefreshCw size={13} />
                Ejecutar proyección
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// CHARTS
// ─────────────────────────────────────────────────────────────

function ComparisonCharts({
  scenarios,
}: {
  scenarios: ScenarioState[];
}) {
  const ready = scenarios.filter(
    s => s.status === 'ok' && s.result
  );

  if (!ready.length) return null;

  const data = ready.map(s => ({
    name: s.label,
    recovery: s.result!.recovery_rate,
    prob: s.result!.avg_pred_prob * 100,
  }));

  return (
    <div className="space-y-4">

      {/* Bar */}
      <div className="bg-white dark:bg-white/5 rounded-2xl p-5 border border-msc-gray dark:border-white/10">
        <h3 className="text-sm font-semibold mb-4">
          Comparación
        </h3>

        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="name" />

            <YAxis />

            <Tooltip />

            <Legend />

            <Bar
              dataKey="recovery"
              fill="#155B3A"
              name="Recuperación %"
              radius={[6, 6, 0, 0]}
            />

            <Bar
              dataKey="prob"
              fill="#C7A15A"
              name="Prob. Pago %"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Radar */}
      {ready.length >= 2 && (
        <div className="bg-white dark:bg-white/5 rounded-2xl p-5 border border-msc-gray dark:border-white/10">
          <h3 className="text-sm font-semibold mb-4">
            Radar comparativo
          </h3>

          <ResponsiveContainer width="100%" height={260}>
            <RadarChart
              data={[
                {
                  metric: 'Recuperación',
                  ...Object.fromEntries(
                    ready.map(s => [
                      s.label,
                      s.result!.recovery_rate,
                    ])
                  ),
                },
                {
                  metric: 'Probabilidad',
                  ...Object.fromEntries(
                    ready.map(s => [
                      s.label,
                      s.result!.avg_pred_prob * 100,
                    ])
                  ),
                },
              ]}
            >
              <PolarGrid />

              <PolarAngleAxis dataKey="metric" />

              {ready.map(s => (
                <Radar
                  key={s.id}
                  dataKey={s.label}
                  stroke={s.color}
                  fill={s.color}
                  fillOpacity={0.2}
                />
              ))}

              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────

export default function Projections() {

  const [scenarios, setScenarios] = useState<ScenarioState[]>([
    makeScenario(0),
  ]);

  const updateScenario = useCallback(
    (id: string, patch: Partial<ScenarioParams>) => {
      setScenarios(prev =>
        prev.map(s =>
          s.id === id
            ? {
                ...s,
                ...patch,
              }
            : s
        )
      );
    },
    []
  );

  const addScenario = () => {
    if (scenarios.length >= 4) return;

    setScenarios(prev => [
      ...prev,
      makeScenario(prev.length),
    ]);
  };

  const deleteScenario = (id: string) => {
    setScenarios(prev => prev.filter(s => s.id !== id));
  };

  const runScenario = async (id: string) => {

    setScenarios(prev =>
      prev.map(s =>
        s.id === id
          ? {
              ...s,
              status: 'loading',
              error: '',
            }
          : s
      )
    );

    const target = scenarios.find(s => s.id === id);

    if (!target) return;

    try {

      const result = await fetchProjection(target);

      setScenarios(prev =>
        prev.map(s =>
          s.id === id
            ? {
                ...s,
                status: 'ok',
                result,
              }
            : s
        )
      );

    } catch (e: any) {

      setScenarios(prev =>
        prev.map(s =>
          s.id === id
            ? {
                ...s,
                status: 'error',
                error: e.message,
              }
            : s
        )
      );
    }
  };

  const runAll = async () => {
    for (const scenario of scenarios) {
      await runScenario(scenario.id);
    }
  };

  const anyLoading = scenarios.some(
    s => s.status === 'loading'
  );

  const anyReady = scenarios.some(
    s => s.status === 'ok'
  );

  return (
    <div className="space-y-6 animate-fade-in">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">

        <div>
          <div className="flex items-center gap-2 mb-1">

            <div className="w-10 h-10 rounded-xl gradient-msc flex items-center justify-center">
              <TrendingUp size={20} className="text-white" />
            </div>

            <h1 className="text-2xl font-bold">
              Proyecciones
            </h1>
          </div>

          <p className="text-sm text-msc-mid pl-12">
            Simulación inteligente de recuperación
          </p>
        </div>

        <div className="flex gap-2">

          <button
            onClick={runAll}
            disabled={anyLoading}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-msc text-white text-sm font-medium"
          >
            {anyLoading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Analizando...
              </>
            ) : (
              <>
                <RefreshCw size={14} />
                Ejecutar todos
              </>
            )}
          </button>

          {scenarios.length < 4 && (
            <button
              onClick={addScenario}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-msc-gray bg-white dark:bg-white/5 text-sm"
            >
              <Plus size={14} />
              Escenario
            </button>
          )}
        </div>
      </div>

      {/* Layout */}
      <div className="grid lg:grid-cols-[380px_1fr] gap-5">

        {/* Left */}
        <div className="space-y-4">

          {scenarios.map(s => (
            <ScenarioCard
              key={s.id}
              scenario={s}
              onUpdate={updateScenario}
              onRun={runScenario}
              onDelete={deleteScenario}
              isOnly={scenarios.length === 1}
            />
          ))}
        </div>

        {/* Right */}
        <div>

          {anyReady ? (
            <ComparisonCharts scenarios={scenarios} />
          ) : (
            <div className="bg-white dark:bg-white/5 rounded-2xl border border-dashed border-msc-gray p-12 text-center">
              <TrendingUp
                size={36}
                className="mx-auto text-msc-gray mb-3"
              />

              <p className="text-sm font-medium text-msc-mid">
                Sin resultados todavía
              </p>

              <p className="text-xs text-msc-mid mt-1">
                Ejecuta un escenario para visualizar métricas
              </p>
            </div>
          )}
        </div>
      </div>

      <p className="text-center text-xs text-msc-mid">
        IA Mock · Dataset sintético Bolivia · Demo funcional
      </p>
    </div>
  );
}