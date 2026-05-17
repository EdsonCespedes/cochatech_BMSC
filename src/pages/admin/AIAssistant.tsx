import { useState, useMemo } from 'react';
import { Brain, Filter, Download, Plus, X, TrendingDown, ChartBar as BarChart3, ChevronDown, Zap, TriangleAlert as AlertTriangle, Calendar, MapPin, Settings } from 'lucide-react';
import { formatCurrency } from '@/lib/finance';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Legend, ComposedChart, Area
} from 'recharts';
import { moraProjections, departments, Department, aiRecommendations } from '@/data/extendedMockData';

interface FilterState {
  departments: Department[];
  timeRange: 'month' | 'quarter' | 'year';
  moraThreshold: number;
  columns: string[];
}

export default function AIAssistant() {
  const [filters, setFilters] = useState<FilterState>({
    departments: ['SC', 'LP', 'CB'],
    timeRange: 'month',
    moraThreshold: 30,
    columns: ['mora', 'mitigada', 'trend'],
  });
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [customChart, setCustomChart] = useState('departmentMora');
  const [chartType, setChartType] = useState<'line' | 'bar' | 'composed'>('line');

  // Filter projection data
  const filteredData = useMemo(() => {
    return moraProjections.map(item => {
      const filtered: any = { month: item.month };
      filters.departments.forEach(dept => {
        if (item.departmentMora[dept]) {
          filtered[dept] = item.departmentMora[dept];
        }
      });
      return filtered;
    });
  }, [filters.departments]);

  const departmentNames = useMemo(
    () => departments.reduce((a, d) => ({ ...a, [d.code]: d.name }), {} as Record<string, string>),
    []
  );

  const deptColors = ['#155B3A', '#1F6B47', '#2d8a5e', '#5E836E', '#C7A15A', '#DCC28A', '#E8872A', '#E8C922', '#c0392b'];

  const selectedDeptNames = filters.departments.slice(0, deptColors.length).map((d, i) => ({
    code: d,
    name: departmentNames[d],
    color: deptColors[i],
  }));

  const handleDeptToggle = (dept: Department) => {
    setFilters(prev => ({
      ...prev,
      departments: prev.departments.includes(dept)
        ? prev.departments.filter(d => d !== dept)
        : [...prev.departments, dept],
    }));
  };

  const handleColumnToggle = (col: string) => {
    setFilters(prev => ({
      ...prev,
      columns: prev.columns.includes(col)
        ? prev.columns.filter(c => c !== col)
        : [...prev.columns, col],
    }));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl gradient-msc flex items-center justify-center">
              <Brain size={20} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-msc-black dark:text-white">Asistente IA</h1>
          </div>
          <p className="text-msc-mid text-sm">Análisis predictivo y recomendaciones de cobranza</p>
        </div>
        <button
          onClick={() => setShowFilterModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-msc-dark text-white font-medium text-sm hover:opacity-90 transition-all shadow-msc-sm"
        >
          <Filter size={16} />
          Personalizar
        </button>
      </div>

      {/* Filter Badge */}
      <div className="flex flex-wrap gap-2">
        {selectedDeptNames.map(d => (
          <div key={d.code} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-msc-gray dark:border-white/10 bg-white dark:bg-white/5 text-xs">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
            {d.name}
          </div>
        ))}
        <span className="text-xs text-msc-mid px-2 py-1.5">
          Mora threshold: {filters.moraThreshold}d · Período: {filters.timeRange}
        </span>
      </div>

      {/* Main Chart */}
      <div className="bg-white dark:bg-white/5 rounded-2xl p-6 shadow-card border border-msc-gray dark:border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-msc-black dark:text-white text-sm">Proyección de Mora por Departamento</h2>
          <div className="flex gap-2">
            {['line', 'bar', 'composed'].map(type => (
              <button
                key={type}
                onClick={() => setChartType(type as any)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  chartType === type
                    ? 'bg-msc-dark text-white'
                    : 'bg-msc-gray dark:bg-white/10 text-msc-soft dark:text-msc-mid hover:bg-msc-dark/20'
                }`}
              >
                {type === 'line' && 'Línea'}
                {type === 'bar' && 'Barras'}
                {type === 'composed' && 'Combinado'}
              </button>
            ))}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={320}>
          {chartType === 'line' ? (
            <LineChart data={filteredData} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#A8A8A8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#A8A8A8' }} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={v => `Bs. ${formatCurrency(Number(v))}`} contentStyle={{ borderRadius: '12px', border: '1px solid #E5E5E5', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              {selectedDeptNames.map((d, i) => (
                <Line key={d.code} type="monotone" dataKey={d.code} name={d.name} stroke={d.color} strokeWidth={2.5} dot={{ r: 4 }} />
              ))}
            </LineChart>
          ) : chartType === 'bar' ? (
            <BarChart data={filteredData} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#A8A8A8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#A8A8A8' }} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={v => `Bs. ${formatCurrency(Number(v))}`} contentStyle={{ borderRadius: '12px', border: '1px solid #E5E5E5', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              {selectedDeptNames.map(d => (
                <Bar key={d.code} dataKey={d.code} name={d.name} fill={d.color} radius={[4, 4, 0, 0]} />
              ))}
            </BarChart>
          ) : (
            <ComposedChart data={filteredData} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#A8A8A8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#A8A8A8' }} tickFormatter={v => `${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={v => `Bs. ${formatCurrency(Number(v))}`} contentStyle={{ borderRadius: '12px', border: '1px solid #E5E5E5', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              {selectedDeptNames.slice(0, 2).map((d, i) => (
                i === 0 ? <Line key={d.code} type="monotone" dataKey={d.code} name={d.name} stroke={d.color} strokeWidth={2.5} /> :
                <Bar key={d.code} dataKey={d.code} name={d.name} fill={d.color} />
              ))}
            </ComposedChart>
          )}
        </ResponsiveContainer>

        <p className="text-xs text-msc-mid mt-3">Datos históricos y proyectados para los próximos 6 meses basados en tendencias de cobranza.</p>
      </div>

      {/* Stats */}
      <div className="grid lg:grid-cols-3 gap-4">
        {[
          {
            label: 'Mora total proyectada (Jun)',
            value: 'Bs. 1.25M',
            change: '-23.4%',
            icon: TrendingDown,
            trend: 'positive',
          },
          {
            label: 'Departamento crítico',
            value: 'La Paz',
            sub: 'Bs. 320k',
            icon: AlertTriangle,
            trend: 'warning',
          },
          {
            label: 'Oportunidad de recuperación',
            value: 'Bs. 874k',
            change: 'Q2 Proyectado',
            icon: Zap,
            trend: 'positive',
          },
        ].map(({ label, value, change, sub, icon: Icon, trend }) => (
          <div key={label} className="bg-white dark:bg-white/5 rounded-2xl p-4 shadow-card border border-msc-gray dark:border-white/10">
            <div className="flex items-start justify-between mb-2">
              <Icon size={16} className={trend === 'positive' ? 'text-emerald-600' : trend === 'warning' ? 'text-msc-orange' : 'text-msc-dark'} />
              {change && <span className={`text-xs font-bold ${trend === 'positive' ? 'text-emerald-600' : 'text-msc-orange'}`}>{change}</span>}
            </div>
            <p className="text-2xl font-bold text-msc-black dark:text-white mb-0.5">{value}</p>
            <p className="text-xs text-msc-mid">{label}</p>
            {sub && <p className="text-xs text-msc-soft mt-1">{sub}</p>}
          </div>
        ))}
      </div>

      {/* AI Recommendations */}
      <div className="bg-white dark:bg-white/5 rounded-2xl p-6 shadow-card border border-msc-gray dark:border-white/10">
        <div className="flex items-center gap-2 mb-4">
          <Zap size={18} className="text-msc-gold" />
          <h3 className="font-semibold text-msc-black dark:text-white">Recomendaciones IA</h3>
          <span className="text-xs text-msc-mid ml-auto">{aiRecommendations.length} acciones sugeridas</span>
        </div>
        <div className="space-y-2">
          {aiRecommendations.map(rec => (
            <div
              key={rec.debtorId}
              className={`flex items-start gap-3 p-3 rounded-xl border ${
                rec.priority === 'critical'
                  ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700/40'
                  : rec.priority === 'high'
                  ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700/40'
                  : 'bg-msc-white dark:bg-white/5 border-msc-gray dark:border-white/10'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs ${
                rec.priority === 'critical' ? 'bg-red-200 text-red-700 dark:bg-red-900 dark:text-red-300'
                : rec.priority === 'high' ? 'bg-orange-200 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
                : 'bg-msc-dark/10 text-msc-dark dark:bg-msc-dark/40 dark:text-msc-beige'
              }`}>
                {rec.priority[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${rec.priority === 'critical' ? 'text-red-700 dark:text-red-300' : rec.priority === 'high' ? 'text-orange-700 dark:text-orange-300' : 'text-msc-black dark:text-white'}`}>
                  {rec.action}
                </p>
                <div className="flex gap-2 mt-1">
                  <span className="text-xs text-msc-mid">Impacto: {(rec.expectedImpact * 100).toFixed(0)}%</span>
                  <span className="text-xs text-msc-mid">Confianza: {(rec.confidence * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Export */}
      <button className="w-full py-3 rounded-xl border border-msc-gray dark:border-white/15 text-msc-black dark:text-white font-medium text-sm hover:bg-msc-gray dark:hover:bg-white/10 transition-all flex items-center justify-center gap-2">
        <Download size={16} />
        Descargar análisis en PDF
      </button>

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1a2920] rounded-3xl p-6 w-full max-w-md shadow-msc-lg animate-fade-in border border-msc-gray dark:border-white/10">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-msc-black dark:text-white">Personalizar filtros</h3>
              <button onClick={() => setShowFilterModal(false)} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-msc-gray dark:hover:bg-white/10 transition-colors">
                <X size={16} className="text-msc-mid" />
              </button>
            </div>

            <div className="space-y-5 max-h-[60vh] overflow-y-auto">
              {/* Departments */}
              <div>
                <label className="block text-sm font-medium text-msc-black dark:text-white mb-2">Departamentos</label>
                <div className="grid grid-cols-3 gap-2">
                  {departments.map(d => (
                    <button
                      key={d.code}
                      onClick={() => handleDeptToggle(d.code)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium transition-all border ${
                        filters.departments.includes(d.code)
                          ? 'border-msc-dark bg-msc-dark/10 dark:bg-msc-dark/30 text-msc-dark dark:text-msc-beige'
                          : 'border-msc-gray dark:border-white/15 text-msc-soft dark:text-msc-mid hover:border-msc-soft'
                      }`}
                    >
                      {d.code}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Range */}
              <div>
                <label className="block text-sm font-medium text-msc-black dark:text-white mb-2">Período</label>
                <div className="grid grid-cols-3 gap-2">
                  {['month', 'quarter', 'year'].map(t => (
                    <button
                      key={t}
                      onClick={() => setFilters(p => ({ ...p, timeRange: t as any }))}
                      className={`px-3 py-2 rounded-lg text-xs font-medium transition-all border ${
                        filters.timeRange === t
                          ? 'border-msc-dark bg-msc-dark/10 dark:bg-msc-dark/30 text-msc-dark dark:text-msc-beige'
                          : 'border-msc-gray dark:border-white/15 text-msc-soft dark:text-msc-mid hover:border-msc-soft'
                      }`}
                    >
                      {t === 'month' && 'Mes'}
                      {t === 'quarter' && 'Trimestre'}
                      {t === 'year' && 'Año'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mora Threshold */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-msc-black dark:text-white">Umbral mora (días)</label>
                  <span className="text-sm font-bold text-msc-dark">{filters.moraThreshold}d</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={90}
                  step={5}
                  value={filters.moraThreshold}
                  onChange={e => setFilters(p => ({ ...p, moraThreshold: Number(e.target.value) }))}
                  className="w-full accent-[#155B3A]"
                />
              </div>

              {/* Columns */}
              <div>
                <label className="block text-sm font-medium text-msc-black dark:text-white mb-2">Columnas visibles</label>
                <div className="space-y-1">
                  {['mora', 'mitigada', 'trend', 'agents', 'actions'].map(col => (
                    <button
                      key={col}
                      onClick={() => handleColumnToggle(col)}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all border text-left ${
                        filters.columns.includes(col)
                          ? 'border-msc-dark bg-msc-dark/10 dark:bg-msc-dark/30 text-msc-dark dark:text-msc-beige'
                          : 'border-msc-gray dark:border-white/15 text-msc-soft dark:text-msc-mid hover:border-msc-soft'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded border ${filters.columns.includes(col) ? 'bg-msc-dark' : 'bg-transparent'}`} />
                      {col === 'mora' && 'Mora'}
                      {col === 'mitigada' && 'Mitigada'}
                      {col === 'trend' && 'Tendencia'}
                      {col === 'agents' && 'Agentes'}
                      {col === 'actions' && 'Acciones IA'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowFilterModal(false)}
              className="w-full mt-5 py-3 rounded-xl gradient-msc text-white font-semibold text-sm"
            >
              Aplicar filtros
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
