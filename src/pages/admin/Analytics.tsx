import { useState, useMemo } from 'react';
import { ChartBar as BarChart3, Download, Upload, Filter, Calendar, FileText, TrendingDown, Users, DollarSign, CircleCheck as CheckCircle2, Eye, Settings, X, Copy, Share2 } from 'lucide-react';
import { formatCurrency } from '@/lib/finance';
import { adminKPIs, debtors, Debtor } from '@/data/mockData';
import { PieChart, Pie, Cell, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

interface ReportConfig {
  name: string;
  columns: string[];
  filters: Record<string, any>;
  format: 'csv' | 'excel' | 'pdf';
}

export default function Analytics() {
  const [activeTab, setActiveTab] = useState<'reports' | 'import' | 'export'>('reports');
  const [selectedReport, setSelectedReport] = useState<'status' | 'mora' | 'agents' | 'custom'>('status');
  const [showReportBuilder, setShowReportBuilder] = useState(false);
  const [customColumns, setCustomColumns] = useState(['name', 'debt', 'moraDays', 'score', 'status']);

  const allColumns = [
    { id: 'name', label: 'Nombre' },
    { id: 'ci', label: 'CI' },
    { id: 'age', label: 'Edad' },
    { id: 'debt', label: 'Deuda' },
    { id: 'quota', label: 'Cuota' },
    { id: 'moraDays', label: 'Días mora' },
    { id: 'score', label: 'Score' },
    { id: 'status', label: 'Estado' },
    { id: 'loanType', label: 'Tipo crédito' },
    { id: 'lastPayment', label: 'Último pago' },
  ];

  // Report data generators
  const statusReport = useMemo(() => {
    const grouped = debtors.reduce((acc, d) => {
      acc[d.status] = (acc[d.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(grouped).map(([name, value]) => ({
      name: name === 'critical' ? 'Crítico' : name === 'high' ? 'Alto riesgo' : name === 'medium' ? 'Medio' : 'Bajo',
      value,
      color: name === 'critical' ? '#c0392b' : name === 'high' ? '#E8872A' : name === 'medium' ? '#E8C922' : '#155B3A',
    }));
  }, []);

  const moraReport = useMemo(() => [
    { range: '0-7 días', count: debtors.filter(d => d.moraDays <= 7).length, amount: debtors.filter(d => d.moraDays <= 7).reduce((a, d) => a + d.debt, 0) },
    { range: '8-30 días', count: debtors.filter(d => d.moraDays > 7 && d.moraDays <= 30).length, amount: debtors.filter(d => d.moraDays > 7 && d.moraDays <= 30).reduce((a, d) => a + d.debt, 0) },
    { range: '31-60 días', count: debtors.filter(d => d.moraDays > 30 && d.moraDays <= 60).length, amount: debtors.filter(d => d.moraDays > 30 && d.moraDays <= 60).reduce((a, d) => a + d.debt, 0) },
    { range: '60+ días', count: debtors.filter(d => d.moraDays > 60).length, amount: debtors.filter(d => d.moraDays > 60).reduce((a, d) => a + d.debt, 0) },
  ], []);

  const agentPerformance = [
    { name: 'Carlos H.', resolved: 4, recovered: 28400, rate: 33.3 },
    { name: 'Patricia M.', resolved: 7, recovered: 45680, rate: 46.7 },
    { name: 'Roberto L.', resolved: 6, recovered: 35200, rate: 33.3 },
  ];

  const downloadReport = (format: 'csv' | 'excel' | 'pdf') => {
    let content = '';
    const columns = customColumns.length > 0 ? customColumns : ['name', 'debt', 'moraDays'];

    if (format === 'csv') {
      const headers = columns.map(c => allColumns.find(ac => ac.id === c)?.label).join(',');
      content = headers + '\n';
      debtors.forEach(d => {
        const row = columns.map(c => {
          const val = (d as any)[c];
          return typeof val === 'string' && val.includes(',') ? `"${val}"` : val;
        }).join(',');
        content += row + '\n';
      });
      downloadFile(content, `reporte_${selectedReport}_${Date.now()}.csv`, 'text/csv');
    } else if (format === 'excel') {
      alert(`Descargando reporte en Excel: reporte_${selectedReport}.xlsx`);
    } else if (format === 'pdf') {
      alert(`Descargando reporte en PDF: reporte_${selectedReport}.pdf`);
    }
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleColumnToggle = (col: string) => {
    setCustomColumns(prev =>
      prev.includes(col) ? prev.filter(c => c !== col) : [...prev, col]
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-xl gradient-msc flex items-center justify-center">
              <BarChart3 size={20} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-msc-black dark:text-white">Analytics & Reportes</h1>
          </div>
          <p className="text-msc-mid text-sm">Análisis, exportación e importación de datos</p>
        </div>
        <button
          onClick={() => setShowReportBuilder(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-msc-dark text-white font-medium text-sm hover:opacity-90 transition-all shadow-msc-sm"
        >
          <Plus size={16} />
          Reporte personalizado
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-msc-gray dark:bg-white/10 p-1 rounded-xl w-fit">
        {['reports', 'import', 'export'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
              activeTab === tab
                ? 'bg-white dark:bg-msc-dark text-msc-black dark:text-white shadow-sm'
                : 'text-msc-soft dark:text-msc-mid hover:text-msc-dark dark:hover:text-white'
            }`}
          >
            {tab === 'reports' && 'Reportes'}
            {tab === 'import' && 'Importar'}
            {tab === 'export' && 'Exportar'}
          </button>
        ))}
      </div>

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          {/* Report Selector */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { id: 'status', label: 'Por Estado', icon: CheckCircle2 },
              { id: 'mora', label: 'Análisis Mora', icon: TrendingDown },
              { id: 'agents', label: 'Desempeño Agentes', icon: Users },
              { id: 'custom', label: 'Personalizado', icon: Settings },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setSelectedReport(id as any)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-left ${
                  selectedReport === id
                    ? 'border-msc-dark bg-msc-dark/5 dark:bg-msc-dark/30'
                    : 'border-msc-gray dark:border-white/10 hover:border-msc-soft'
                }`}
              >
                <Icon size={18} className={selectedReport === id ? 'text-msc-dark dark:text-msc-beige' : 'text-msc-mid'} />
                <span className={`text-sm font-medium ${selectedReport === id ? 'text-msc-dark dark:text-msc-beige' : 'text-msc-black dark:text-white'}`}>
                  {label}
                </span>
              </button>
            ))}
          </div>

          {/* Report Content */}
          <div className="bg-white dark:bg-white/5 rounded-2xl p-6 shadow-card border border-msc-gray dark:border-white/10">
            {selectedReport === 'status' && (
              <div className="space-y-6">
                <h3 className="font-semibold text-msc-black dark:text-white">Distribución por estado</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={statusReport} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={80} fill="#8884d8" dataKey="value">
                      {statusReport.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-3">
                  {statusReport.map(item => (
                    <div key={item.name} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-msc-white dark:bg-white/5 border border-msc-gray dark:border-white/10">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm text-msc-black dark:text-white font-medium">{item.name}: {item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedReport === 'mora' && (
              <div className="space-y-6">
                <h3 className="font-semibold text-msc-black dark:text-white">Análisis por rango de mora</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={moraReport} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                    <XAxis dataKey="range" tick={{ fontSize: 11, fill: '#A8A8A8' }} />
                    <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#A8A8A8' }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#A8A8A8' }} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E5E5E5', fontSize: '12px' }} />
                    <Legend />
                    <Bar yAxisId="left" dataKey="count" name="Cantidad" fill="#155B3A" />
                    <Bar yAxisId="right" dataKey="amount" name="Monto (Bs.)" fill="#C7A15A" />
                  </BarChart>
                </ResponsiveContainer>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-msc-gray dark:border-white/10">
                      <th className="text-left px-3 py-2 text-xs text-msc-mid font-semibold">Rango</th>
                      <th className="text-right px-3 py-2 text-xs text-msc-mid font-semibold">Casos</th>
                      <th className="text-right px-3 py-2 text-xs text-msc-mid font-semibold">Monto total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {moraReport.map(row => (
                      <tr key={row.range} className="border-b border-msc-gray dark:border-white/10 hover:bg-msc-gray dark:hover:bg-white/5">
                        <td className="px-3 py-2 text-msc-black dark:text-white">{row.range}</td>
                        <td className="text-right px-3 py-2 text-msc-black dark:text-white font-medium">{row.count}</td>
                        <td className="text-right px-3 py-2 text-msc-black dark:text-white font-medium">Bs. {formatCurrency(row.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {selectedReport === 'agents' && (
              <div className="space-y-6">
                <h3 className="font-semibold text-msc-black dark:text-white">Desempeño de agentes de cobranza</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={agentPerformance} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#A8A8A8' }} />
                    <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#A8A8A8' }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#A8A8A8' }} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #E5E5E5', fontSize: '12px' }} />
                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                    <Line yAxisId="left" type="monotone" dataKey="recovered" name="Recuperado (Bs.)" stroke="#155B3A" strokeWidth={2.5} dot={{ r: 4 }} />
                    <Line yAxisId="right" type="monotone" dataKey="rate" name="Tasa %" stroke="#C7A15A" strokeWidth={2.5} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-msc-gray dark:border-white/10">
                      <th className="text-left px-3 py-2 text-xs text-msc-mid font-semibold">Agente</th>
                      <th className="text-right px-3 py-2 text-xs text-msc-mid font-semibold">Resueltos</th>
                      <th className="text-right px-3 py-2 text-xs text-msc-mid font-semibold">Recuperado</th>
                      <th className="text-right px-3 py-2 text-xs text-msc-mid font-semibold">Tasa</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agentPerformance.map(row => (
                      <tr key={row.name} className="border-b border-msc-gray dark:border-white/10 hover:bg-msc-gray dark:hover:bg-white/5">
                        <td className="px-3 py-2 text-msc-black dark:text-white font-medium">{row.name}</td>
                        <td className="text-right px-3 py-2 text-msc-black dark:text-white">{row.resolved}</td>
                        <td className="text-right px-3 py-2 text-msc-black dark:text-white font-medium">Bs. {formatCurrency(row.recovered)}</td>
                        <td className="text-right px-3 py-2 text-msc-black dark:text-white font-medium">{row.rate.toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {selectedReport === 'custom' && (
              <div className="space-y-4">
                <h3 className="font-semibold text-msc-black dark:text-white mb-3">Datos personalizados</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {allColumns.map(col => (
                    <button
                      key={col.id}
                      onClick={() => handleColumnToggle(col.id)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium transition-all border ${
                        customColumns.includes(col.id)
                          ? 'border-msc-dark bg-msc-dark/10 dark:bg-msc-dark/30 text-msc-dark dark:text-msc-beige'
                          : 'border-msc-gray dark:border-white/15 text-msc-soft dark:text-msc-mid hover:border-msc-soft'
                      }`}
                    >
                      {col.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Download Options */}
          <div className="flex flex-wrap gap-3">
            {['csv', 'excel', 'pdf'].map(format => (
              <button
                key={format}
                onClick={() => downloadReport(format as any)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-msc-gray dark:border-white/15 text-msc-black dark:text-white font-medium text-sm hover:bg-msc-gray dark:hover:bg-white/10 transition-all"
              >
                <Download size={16} />
                Descargar como {format.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Import/Export Tabs */}
      {(activeTab === 'import' || activeTab === 'export') && (
        <div className="bg-white dark:bg-white/5 rounded-2xl p-8 shadow-card border border-msc-gray dark:border-white/10 text-center">
          <div className={`w-16 h-16 rounded-xl mx-auto mb-4 flex items-center justify-center ${activeTab === 'import' ? 'bg-blue-100 dark:bg-blue-900/20' : 'bg-emerald-100 dark:bg-emerald-900/20'}`}>
            {activeTab === 'import' ? <Upload size={28} className="text-blue-600 dark:text-blue-400" /> : <Download size={28} className="text-emerald-600 dark:text-emerald-400" />}
          </div>
          <h3 className="text-lg font-bold text-msc-black dark:text-white mb-2">
            {activeTab === 'import' ? 'Importar datos' : 'Exportar datos'}
          </h3>
          <p className="text-msc-mid text-sm mb-6 max-w-sm mx-auto">
            {activeTab === 'import'
              ? 'Sube un archivo CSV o Excel con datos de deudores para actualizar la cartera'
              : 'Personaliza y descarga tus datos en múltiples formatos'}
          </p>
          <button className={`px-6 py-3 rounded-xl font-medium text-sm text-white flex items-center gap-2 justify-center mx-auto ${activeTab === 'import' ? 'gradient-hero' : 'gradient-msc'}`}>
            {activeTab === 'import' ? <Upload size={16} /> : <Download size={16} />}
            {activeTab === 'import' ? 'Seleccionar archivo' : 'Generar exportación'}
          </button>
        </div>
      )}

      {/* Report Builder Modal */}
      {showReportBuilder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1a2920] rounded-3xl p-6 w-full max-w-md shadow-msc-lg animate-fade-in border border-msc-gray dark:border-white/10">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-msc-black dark:text-white">Generador de reportes</h3>
              <button onClick={() => setShowReportBuilder(false)} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-msc-gray dark:hover:bg-white/10">
                <X size={16} className="text-msc-mid" />
              </button>
            </div>
            <p className="text-msc-mid text-sm mb-4">Selecciona los datos que deseas incluir en tu reporte personalizado.</p>
            <button
              onClick={() => { downloadReport('csv'); setShowReportBuilder(false); }}
              className="w-full py-3 rounded-xl gradient-msc text-white font-semibold text-sm"
            >
              Generar reporte
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Plus({ size }: { size: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
}
