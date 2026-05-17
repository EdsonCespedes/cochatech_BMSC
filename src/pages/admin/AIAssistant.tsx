import { useState, useRef, useEffect } from 'react';
import {
  Brain,
  Send,
  Loader2,
  TrendingUp,
  Users,
  AlertTriangle,
  Zap,
  ChevronDown,
  CheckCircle2,
  XCircle,
  Search,
  BarChart3,
  User,
} from 'lucide-react';
import { formatCurrency } from '@/lib/finance';

type QueryMode = 'portfolio' | 'client';

interface PortfolioResult {
  total_clients: number;
  total_debt: number;
  avg_pred_prob: number;
  projected_recovery: number;
  recovery_rate: number;
}

interface ClientResult {
  client_id: string;
  score: number;
  dias_mora: number;
  pred_prob: number;
  risk: 'low' | 'medium' | 'high' | 'critical';
  recommendations: string[];
}

type AIResult = PortfolioResult | ClientResult | null;

interface HealthStatus {
  status: 'ok' | 'offline' | 'checking';
  clients?: number;
}

const riskConfig = {
  low: {
    label: 'Riesgo Bajo',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700/40',
  },
  medium: {
    label: 'Riesgo Medio',
    color: 'text-yellow-600',
    bg: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700/40',
  },
  high: {
    label: 'Riesgo Alto',
    color: 'text-orange-600',
    bg: 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700/40',
  },
  critical: {
    label: 'Riesgo Crítico',
    color: 'text-red-600',
    bg: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700/40',
  },
};

const mockPortfolioResult: PortfolioResult = {
  total_clients: 8421,
  total_debt: 12845000,
  avg_pred_prob: 0.73,
  projected_recovery: 9320000,
  recovery_rate: 72.6,
};

const mockClients: Record<string, ClientResult> = {
  CLI000001: {
    client_id: 'CLI000001',
    score: 82,
    dias_mora: 12,
    pred_prob: 0.91,
    risk: 'low',
    recommendations: [
      'Cliente con alta probabilidad de recuperación.',
      'Priorizar contacto digital automatizado.',
      'Elegible para refinanciamiento premium.',
    ],
  },

  CLI000777: {
    client_id: 'CLI000777',
    score: 48,
    dias_mora: 64,
    pred_prob: 0.42,
    risk: 'high',
    recommendations: [
      'Requiere seguimiento manual.',
      'Enviar alerta preventiva al equipo legal.',
      'Reducir exposición crediticia.',
    ],
  },

  CLI009999: {
    client_id: 'CLI009999',
    score: 18,
    dias_mora: 143,
    pred_prob: 0.11,
    risk: 'critical',
    recommendations: [
      'Alta probabilidad de incumplimiento.',
      'Escalar a recuperación judicial.',
      'Bloquear nuevas líneas de crédito.',
    ],
  },
};

const quickPrompts = [
  {
    label: 'Proyección cartera completa',
    icon: BarChart3,
    mode: 'portfolio' as QueryMode,
    params: { days_ahead: 30, min_score: 0 },
  },
  {
    label: 'Clientes score alto (≥70)',
    icon: TrendingUp,
    mode: 'portfolio' as QueryMode,
    params: { days_ahead: 30, min_score: 70 },
  },
  {
    label: 'Riesgo crítico últimos 30d',
    icon: AlertTriangle,
    mode: 'portfolio' as QueryMode,
    params: { days_ahead: 30, min_score: 0 },
  },
  {
    label: 'Buscar cliente individual',
    icon: User,
    mode: 'client' as QueryMode,
    params: {},
  },
];

function PortfolioCard({ data }: { data: PortfolioResult }) {
  const metrics = [
    {
      label: 'Clientes analizados',
      value: data.total_clients.toLocaleString(),
      icon: Users,
      color: 'text-msc-dark',
    },
    {
      label: 'Deuda total',
      value: `Bs. ${formatCurrency(data.total_debt)}`,
      icon: BarChart3,
      color: 'text-orange-600',
    },
    {
      label: 'Prob. media de pago',
      value: `${(data.avg_pred_prob * 100).toFixed(1)}%`,
      icon: TrendingUp,
      color: 'text-emerald-600',
    },
    {
      label: 'Recuperación proyectada',
      value: `Bs. ${formatCurrency(data.projected_recovery)}`,
      icon: Zap,
      color: 'text-emerald-600',
    },
  ];

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="grid grid-cols-2 gap-3">
        {metrics.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="bg-white dark:bg-white/5 rounded-2xl p-4 border border-msc-gray dark:border-white/10 shadow-card"
          >
            <Icon size={16} className={`${color} mb-2`} />

            <p className="text-lg font-bold text-msc-black dark:text-white leading-tight">
              {value}
            </p>

            <p className="text-xs text-msc-mid mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-white/5 rounded-2xl p-4 border border-msc-gray dark:border-white/10 shadow-card">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-msc-black dark:text-white">
            Tasa de recuperación
          </span>

          <span className="text-sm font-bold text-emerald-600">
            {data.recovery_rate.toFixed(1)}%
          </span>
        </div>

        <div className="h-2.5 bg-msc-gray dark:bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full gradient-msc transition-all duration-700"
            style={{ width: `${Math.min(data.recovery_rate, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function ClientCard({ data }: { data: ClientResult }) {
  const risk = riskConfig[data.risk] || riskConfig.medium;

  return (
    <div className="space-y-4 animate-fade-in">
      <div className={`rounded-2xl p-4 border ${risk.bg}`}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-msc-mid mb-0.5">ID Cliente</p>

            <p className="text-lg font-bold text-msc-black dark:text-white font-mono">
              {data.client_id}
            </p>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-bold border ${risk.bg} ${risk.color}`}
          >
            {risk.label}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-3">
          {[
            {
              label: 'Score',
              value: data.score,
              suffix: '',
            },
            {
              label: 'Días mora',
              value: data.dias_mora,
              suffix: 'd',
            },
            {
              label: 'Prob. pago',
              value: (data.pred_prob * 100).toFixed(0),
              suffix: '%',
            },
          ].map(({ label, value, suffix }) => (
            <div key={label} className="text-center">
              <p className="text-xl font-bold text-msc-black dark:text-white">
                {value}
                {suffix}
              </p>

              <p className="text-xs text-msc-mid">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-white/5 rounded-2xl p-4 border border-msc-gray dark:border-white/10">
        <div className="flex justify-between mb-2">
          <span className="text-xs text-msc-mid">Score crediticio</span>

          <span className="text-xs font-bold text-msc-black dark:text-white">
            {data.score}/100
          </span>
        </div>

        <div className="h-2 bg-msc-gray dark:bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full gradient-msc"
            style={{ width: `${data.score}%` }}
          />
        </div>
      </div>

      <div className="bg-white dark:bg-white/5 rounded-2xl p-4 border border-msc-gray dark:border-white/10">
        <div className="flex items-center gap-2 mb-3">
          <Zap size={14} className="text-msc-gold" />

          <p className="text-sm font-semibold text-msc-black dark:text-white">
            Recomendaciones IA
          </p>
        </div>

        <ul className="space-y-2">
          {data.recommendations.map((rec, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-xs text-msc-soft dark:text-msc-mid"
            >
              <CheckCircle2
                size={12}
                className="text-emerald-600 mt-0.5 flex-shrink-0"
              />

              {rec}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function AIAssistant() {
  const [mode, setMode] = useState<QueryMode>('portfolio');
  const [minScore, setMinScore] = useState(0);
  const [daysAhead, setDaysAhead] = useState(30);
  const [clientId, setClientId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIResult>(null);
  const [error, setError] = useState('');
  const [health, setHealth] = useState<HealthStatus>({
    status: 'checking',
  });
  const [showAdvanced, setShowAdvanced] = useState(false);

  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHealth({
        status: 'ok',
        clients: 8421,
      });
    }, 700);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [result]);

  const runPortfolio = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1400));

      let modifiedResult = { ...mockPortfolioResult };

      if (minScore >= 70) {
        modifiedResult = {
          ...modifiedResult,
          total_clients: 2144,
          projected_recovery: 4110000,
          recovery_rate: 81.2,
        };
      }

      setResult(modifiedResult);
    } catch {
      setError('No se pudo ejecutar la simulación IA.');
    } finally {
      setLoading(false);
    }
  };

  const runClient = async () => {
    if (!clientId.trim()) {
      setError('Ingresa un ID de cliente (ej: CLI000001)');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1200));

      const client = mockClients[clientId.trim().toUpperCase()];

      if (!client) {
        throw new Error('Cliente no encontrado.');
      }

      setResult(client);
    } catch (e: any) {
      setError(e.message || 'No se pudo ejecutar la simulación.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPrompt = (qp: typeof quickPrompts[0]) => {
    setMode(qp.mode);
    setResult(null);
    setError('');

    if (qp.mode === 'portfolio') {
      const p = qp.params as any;
      setMinScore(p.min_score ?? 0);
      setDaysAhead(p.days_ahead ?? 30);
    }
  };

  const handleSubmit = () =>
    mode === 'portfolio' ? runPortfolio() : runClient();

  const isPortfolioResult = (r: AIResult): r is PortfolioResult =>
    r !== null && 'total_clients' in r;

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-10 h-10 rounded-xl gradient-msc flex items-center justify-center shadow-msc-sm">
              <Brain size={20} className="text-white" />
            </div>

            <h1 className="text-2xl font-bold text-msc-black dark:text-white">
              IA Predictiva
            </h1>
          </div>

          <p className="text-msc-mid text-sm pl-12">
            Motor de riesgo y recuperación financiera
          </p>
        </div>

        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border
          ${
            health.status === 'ok'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-700/40 dark:text-emerald-400'
              : health.status === 'offline'
              ? 'bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-700/40 dark:text-red-400'
              : 'bg-msc-gray border-msc-gray text-msc-mid dark:bg-white/5 dark:border-white/10'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              health.status === 'ok'
                ? 'bg-emerald-500 animate-pulse'
                : health.status === 'offline'
                ? 'bg-red-500'
                : 'bg-msc-mid'
            }`}
          />

          {health.status === 'ok'
            ? `Online · ${health.clients?.toLocaleString() ?? '—'} clientes`
            : health.status === 'offline'
            ? 'Offline'
            : 'Verificando…'}
        </div>
      </div>

      <div>
        <p className="text-xs font-medium text-msc-mid mb-2 uppercase tracking-wide">
          Consultas rápidas
        </p>

        <div className="grid grid-cols-2 gap-2">
          {quickPrompts.map(qp => (
            <button
              key={qp.label}
              onClick={() => handleQuickPrompt(qp)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-msc-gray dark:border-white/10
                bg-white dark:bg-white/5 text-msc-black dark:text-white text-xs font-medium
                hover:border-msc-dark dark:hover:border-msc-beige/40 hover:shadow-msc-sm transition-all text-left"
            >
              <qp.icon
                size={14}
                className="text-msc-dark dark:text-msc-beige flex-shrink-0"
              />

              {qp.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-white/5 rounded-2xl border border-msc-gray dark:border-white/10 shadow-card overflow-hidden">
        <div className="flex border-b border-msc-gray dark:border-white/10">
          {[
            { id: 'portfolio', label: 'Cartera', icon: BarChart3 },
            { id: 'client', label: 'Cliente', icon: Search },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => {
                setMode(id as QueryMode);
                setResult(null);
                setError('');
              }}
              className={`flex items-center gap-2 flex-1 px-4 py-3 text-sm font-medium transition-all
                ${
                  mode === id
                    ? 'border-b-2 border-msc-dark text-msc-dark dark:border-msc-beige dark:text-msc-beige bg-msc-gray/40 dark:bg-white/5'
                    : 'text-msc-mid hover:text-msc-black dark:hover:text-white'
                }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        <div className="p-5 space-y-4">
          {mode === 'portfolio' ? (
            <>
              <div>
                <div className="flex justify-between mb-1.5">
                  <label className="text-xs font-medium text-msc-black dark:text-white">
                    Horizonte de proyección
                  </label>

                  <span className="text-xs font-bold text-msc-dark dark:text-msc-beige">
                    {daysAhead} días
                  </span>
                </div>

                <input
                  type="range"
                  min={7}
                  max={90}
                  step={7}
                  value={daysAhead}
                  onChange={e => setDaysAhead(Number(e.target.value))}
                  className="w-full accent-[#155B3A]"
                />
              </div>

              <button
                onClick={() => setShowAdvanced(p => !p)}
                className="flex items-center gap-1.5 text-xs text-msc-mid hover:text-msc-black dark:hover:text-white transition-colors"
              >
                <ChevronDown
                  size={12}
                  className={`transition-transform ${
                    showAdvanced ? 'rotate-180' : ''
                  }`}
                />

                Opciones avanzadas
              </button>

              {showAdvanced && (
                <div>
                  <div className="flex justify-between mb-1.5">
                    <label className="text-xs font-medium text-msc-black dark:text-white">
                      Score mínimo
                    </label>

                    <span className="text-xs font-bold text-msc-dark dark:text-msc-beige">
                      {minScore}
                    </span>
                  </div>

                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={minScore}
                    onChange={e => setMinScore(Number(e.target.value))}
                    className="w-full accent-[#155B3A]"
                  />
                </div>
              )}
            </>
          ) : (
            <div>
              <label className="block text-xs font-medium text-msc-black dark:text-white mb-1.5">
                ID del cliente
              </label>

              <input
                type="text"
                placeholder="ej: CLI000001"
                value={clientId}
                onChange={e => setClientId(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                className="w-full px-3 py-2.5 rounded-xl border border-msc-gray dark:border-white/15
                  bg-msc-white dark:bg-white/5 text-msc-black dark:text-white text-sm font-mono
                  placeholder:text-msc-mid focus:outline-none focus:ring-2 focus:ring-msc-dark/30"
              />
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/40">
              <XCircle size={14} className="text-red-600 flex-shrink-0" />

              <p className="text-xs text-red-700 dark:text-red-300">
                {error}
              </p>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading || health.status === 'offline'}
            className="w-full py-3 rounded-xl gradient-msc text-white font-semibold text-sm
              flex items-center justify-center gap-2 shadow-msc-sm
              hover:opacity-90 active:scale-[0.99] transition-all
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Analizando cartera…
              </>
            ) : (
              <>
                <Send size={15} />
                {mode === 'portfolio'
                  ? 'Analizar cartera'
                  : 'Evaluar cliente'}
              </>
            )}
          </button>
        </div>
      </div>

      {result && (
        <div ref={resultRef} className="space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600" />

            <p className="text-sm font-semibold text-msc-black dark:text-white">
              {isPortfolioResult(result)
                ? 'Proyección de cartera'
                : `Análisis — ${(result as ClientResult).client_id}`}
            </p>
          </div>

          {isPortfolioResult(result) ? (
            <PortfolioCard data={result} />
          ) : (
            <ClientCard data={result as ClientResult} />
          )}
        </div>
      )}
    </div>
  );
}