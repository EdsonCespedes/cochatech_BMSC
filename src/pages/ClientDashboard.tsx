import { useState } from 'react';
import {
  AlertTriangle, TrendingUp, CreditCard, Calendar,
  ChevronRight, Sparkles, CheckCircle2, Download,
  Zap, Wind, Star
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import {
  formatCurrency, generatePlans, calcMonthlyPayment,
  generateSMSCode, PaymentPlan
} from '@/lib/finance';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid
} from 'recharts';

type Step = 'dashboard' | 'analyzer' | 'plans' | '2fa' | 'success';

export default function ClientDashboard() {
  const { currentDebtor, setActivePlan } = useApp();
  const [step, setStep] = useState<Step>('dashboard');
  const [income, setIncome] = useState('');
  const [expenses, setExpenses] = useState('');
  const [plans, setPlans] = useState<PaymentPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<PaymentPlan | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [sliderMonths, setSliderMonths] = useState(24);
  const [smsCode, setSmsCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [verifying, setVerifying] = useState(false);

  const customMonthly = calcMonthlyPayment(currentDebtor.debt, 16, sliderMonths);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setAnalyzing(true);
    await new Promise(r => setTimeout(r, 2000));
    const p = generatePlans(currentDebtor.debt, parseFloat(income) || 5000);
    setPlans(p);
    setStep('plans');
    setAnalyzing(false);
  };

  const handleAcceptPlan = (plan: PaymentPlan) => {
    setSelectedPlan(plan);
    const code = generateSMSCode();
    setSmsCode(code);
    setStep('2fa');
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifying(true);
    await new Promise(r => setTimeout(r, 1000));
    if (inputCode === smsCode) {
      setActivePlan(currentDebtor.id, selectedPlan!.id);
      setStep('success');
    } else {
      setCodeError('Código incorrecto. Verifica el SMS.');
    }
    setVerifying(false);
  };

  const d = currentDebtor;

  return (
    <div className="min-h-screen bg-msc-white dark:bg-msc-black pt-16">
      {step === 'dashboard' && (
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 animate-fade-in">
          {/* Hero Banner */}
          <div className="gradient-hero rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-msc-lg">
            <div className="relative z-10">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-white/70 text-sm mb-1">Bienvenido de vuelta</p>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                    Hola, {d.firstName} 👋
                  </h1>
                  <p className="text-white/80 text-sm sm:text-base max-w-md leading-relaxed">
                    Estamos aquí para ayudarte a recuperar tu tranquilidad financiera y proteger tu historial crediticio.
                  </p>
                </div>
                <img
                  src={d.avatar}
                  alt={d.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-white/30 flex-shrink-0"
                />
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <div className="glass rounded-xl px-4 py-2.5">
                  <p className="text-white/60 text-xs">Deuda total</p>
                  <p className="text-white font-bold text-lg">Bs. {formatCurrency(d.debt)}</p>
                </div>
                <div className="glass rounded-xl px-4 py-2.5">
                  <p className="text-white/60 text-xs">En mora</p>
                  <p className="text-msc-yellow font-bold text-lg">{d.moraDays} días</p>
                </div>
                <div className="glass rounded-xl px-4 py-2.5">
                  <p className="text-white/60 text-xs">Score</p>
                  <p className="text-white font-bold text-lg">{d.score}/100</p>
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 right-0 opacity-5">
              <svg viewBox="0 0 300 200" width="300" fill="white">
                <polygon points="0,200 80,60 160,120 240,40 300,80 300,200" />
              </svg>
            </div>
          </div>

          {/* Alert */}
          <div className="flex items-start gap-3 px-5 py-4 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/30">
            <AlertTriangle size={18} className="text-msc-orange mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-msc-black dark:text-white text-sm">Cuota vencida hace {d.moraDays} días</p>
              <p className="text-msc-soft dark:text-msc-mid text-xs mt-0.5">Tu próximo pago es crítico. Explorá los planes de regularización disponibles.</p>
            </div>
          </div>

          {/* Cards Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Cuota mensual', value: `Bs. ${formatCurrency(d.quota)}`, icon: CreditCard, color: 'text-msc-dark' },
              { label: 'Interés acumulado', value: `Bs. ${formatCurrency(d.interest)}`, icon: TrendingUp, color: 'text-msc-orange' },
              { label: 'Tipo de crédito', value: d.loanType.split(' ')[0], icon: Calendar, color: 'text-msc-gold' },
              { label: 'Score crediticio', value: `${d.score} pts`, icon: Star, color: 'text-msc-soft' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-white dark:bg-white/5 rounded-2xl p-4 shadow-card border border-msc-gray dark:border-white/10">
                <Icon size={16} className={`${color} mb-2`} />
                <p className="text-msc-mid text-xs mb-1">{label}</p>
                <p className="font-bold text-msc-black dark:text-white text-sm">{value}</p>
              </div>
            ))}
          </div>

          {/* Payment History Chart */}
          <div className="bg-white dark:bg-white/5 rounded-2xl p-5 shadow-card border border-msc-gray dark:border-white/10">
            <h3 className="font-semibold text-msc-black dark:text-white text-sm mb-4">Historial de pagos</h3>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={d.paymentHistory} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPay" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#155B3A" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#155B3A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#A8A8A8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#A8A8A8' }} />
                <Tooltip
                  formatter={(v) => [`Bs. ${formatCurrency(Number(v))}`, 'Pagado']}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #E5E5E5', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="amount" stroke="#155B3A" strokeWidth={2} fill="url(#colorPay)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* CTA */}
          <button
            onClick={() => setStep('analyzer')}
            className="w-full py-4 rounded-2xl gradient-msc text-white font-semibold flex items-center justify-center gap-2 shadow-msc-md hover:opacity-90 transition-all group"
          >
            <Sparkles size={18} className="group-hover:rotate-12 transition-transform" />
            Analizar mi situación con IA
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {step === 'analyzer' && (
        <div className="max-w-xl mx-auto px-4 py-8 animate-fade-in">
          <button onClick={() => setStep('dashboard')} className="flex items-center gap-2 text-msc-soft dark:text-msc-mid text-sm mb-6 hover:text-msc-dark dark:hover:text-white transition-colors">
            ← Volver
          </button>

          <div className="bg-white dark:bg-white/5 rounded-3xl p-6 sm:p-8 shadow-card border border-msc-gray dark:border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl gradient-msc flex items-center justify-center">
                <Sparkles size={20} className="text-white" />
              </div>
              <div>
                <h2 className="font-bold text-msc-black dark:text-white text-lg">Analizador IA</h2>
                <p className="text-msc-mid text-xs">Ingresá tus datos financieros</p>
              </div>
            </div>

            <form onSubmit={handleAnalyze} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-msc-black dark:text-white mb-2">
                  Ingresos mensuales (Bs.)
                </label>
                <input
                  type="number"
                  value={income}
                  onChange={e => setIncome(e.target.value)}
                  placeholder="Ej: 5000"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-msc-gray dark:border-white/15 bg-white dark:bg-white/5 text-msc-black dark:text-white placeholder-msc-mid text-sm focus:outline-none focus:border-msc-dark focus:ring-2 focus:ring-msc-dark/10 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-msc-black dark:text-white mb-2">
                  Gastos mensuales (Bs.)
                </label>
                <input
                  type="number"
                  value={expenses}
                  onChange={e => setExpenses(e.target.value)}
                  placeholder="Ej: 2500"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-msc-gray dark:border-white/15 bg-white dark:bg-white/5 text-msc-black dark:text-white placeholder-msc-mid text-sm focus:outline-none focus:border-msc-dark focus:ring-2 focus:ring-msc-dark/10 transition-all"
                />
              </div>

              {/* Slider */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium text-msc-black dark:text-white">
                    Plazo estimado
                  </label>
                  <span className="text-sm font-bold text-msc-dark">{sliderMonths} meses</span>
                </div>
                <input
                  type="range"
                  min={6} max={60} step={6}
                  value={sliderMonths}
                  onChange={e => setSliderMonths(Number(e.target.value))}
                  className="w-full accent-[#155B3A]"
                />
                <div className="flex justify-between text-xs text-msc-mid mt-1">
                  <span>6 m</span><span>60 m</span>
                </div>
                <div className="mt-3 px-4 py-3 rounded-xl bg-msc-white dark:bg-white/5 border border-msc-gray dark:border-white/10">
                  <p className="text-xs text-msc-mid">Cuota estimada:</p>
                  <p className="font-bold text-msc-dark dark:text-white text-xl">
                    Bs. {formatCurrency(customMonthly, 0)}
                    <span className="text-sm font-normal text-msc-mid">/mes</span>
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={analyzing}
                className="w-full py-4 rounded-xl gradient-msc text-white font-semibold flex items-center justify-center gap-2 shadow-msc-sm hover:opacity-90 transition-all disabled:opacity-70"
              >
                {analyzing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Analizando con IA...
                  </>
                ) : (
                  <><Sparkles size={16} /> Analizar mi situación</>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {step === 'plans' && (
        <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
          <button onClick={() => setStep('analyzer')} className="flex items-center gap-2 text-msc-soft dark:text-msc-mid text-sm mb-6 hover:text-msc-dark dark:hover:text-white transition-colors">
            ← Volver
          </button>

          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-msc-dark/10 dark:bg-msc-dark/30 mb-3">
              <Sparkles size={12} className="text-msc-dark dark:text-msc-beige" />
              <span className="text-xs font-medium text-msc-dark dark:text-msc-beige">IA ha analizado tu caso</span>
            </div>
            <h2 className="text-2xl font-bold text-msc-black dark:text-white mb-2">Planes personalizados</h2>
            <p className="text-msc-mid text-sm">Seleccioná el plan que mejor se adapte a tu situación</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {plans.map(plan => {
              const icons = { acelerado: Zap, equilibrado: Star, oxigeno: Wind };
              const Icon = icons[plan.id];
              return (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan)}
                  className={`relative rounded-3xl p-6 cursor-pointer transition-all border-2 ${
                    selectedPlan?.id === plan.id
                      ? 'border-msc-dark shadow-msc-lg scale-[1.02]'
                      : 'border-msc-gray dark:border-white/10 hover:border-msc-soft hover:shadow-msc-md'
                  } ${plan.isRecommended ? 'gradient-msc text-white' : 'bg-white dark:bg-white/5'}`}
                >
                  {plan.isRecommended && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full gradient-gold text-msc-black text-xs font-bold shadow-gold-sm whitespace-nowrap">
                      ★ Recomendado IA
                    </div>
                  )}

                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center mb-4 ${
                    plan.isRecommended ? 'bg-white/20' : 'gradient-msc'
                  }`}>
                    <Icon size={18} className={plan.isRecommended ? 'text-white' : 'text-white'} />
                  </div>

                  <h3 className={`font-bold text-base mb-1 ${plan.isRecommended ? 'text-white' : 'text-msc-black dark:text-white'}`}>
                    {plan.name}
                  </h3>
                  <p className={`text-xs mb-4 leading-relaxed ${plan.isRecommended ? 'text-white/70' : 'text-msc-mid'}`}>
                    {plan.description}
                  </p>

                  <div className={`text-3xl font-bold mb-1 ${plan.isRecommended ? 'text-white' : 'text-msc-dark dark:text-white'}`}>
                    Bs. {formatCurrency(plan.monthlyPayment)}
                  </div>
                  <p className={`text-xs mb-4 ${plan.isRecommended ? 'text-white/60' : 'text-msc-mid'}`}>por mes</p>

                  <div className="space-y-1.5">
                    {[
                      { label: 'Plazo', value: `${plan.months} meses` },
                      { label: 'Total a pagar', value: `Bs. ${formatCurrency(plan.totalPayment)}` },
                      { label: 'Ahorro en intereses', value: `Bs. ${formatCurrency(plan.interestSaved)}` },
                      { label: 'Impacto score', value: `+${plan.scoreImpact} pts` },
                    ].map(({ label, value }) => (
                      <div key={label} className={`flex justify-between text-xs ${plan.isRecommended ? 'text-white/80' : 'text-msc-soft dark:text-msc-mid'}`}>
                        <span>{label}</span>
                        <span className="font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Custom slider */}
          <div className="bg-white dark:bg-white/5 rounded-2xl p-5 border border-msc-gray dark:border-white/10 mb-6">
            <h3 className="font-semibold text-msc-black dark:text-white text-sm mb-4">Simulador personalizado</h3>
            <div className="flex justify-between mb-2">
              <span className="text-xs text-msc-mid">Plazo en meses</span>
              <span className="text-sm font-bold text-msc-dark">{sliderMonths} meses</span>
            </div>
            <input
              type="range" min={6} max={60} step={1}
              value={sliderMonths}
              onChange={e => setSliderMonths(Number(e.target.value))}
              className="w-full accent-[#155B3A] mb-3"
            />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-msc-mid">Cuota mensual</p>
                <p className="text-2xl font-bold text-msc-dark dark:text-white">
                  Bs. {formatCurrency(calcMonthlyPayment(d.debt, 16, sliderMonths), 0)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-msc-mid">Total a pagar</p>
                <p className="text-sm font-semibold text-msc-black dark:text-white">
                  Bs. {formatCurrency(calcMonthlyPayment(d.debt, 16, sliderMonths) * sliderMonths, 0)}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => selectedPlan && handleAcceptPlan(selectedPlan)}
            disabled={!selectedPlan}
            className="w-full py-4 rounded-2xl gradient-msc text-white font-semibold flex items-center justify-center gap-2 shadow-msc-md hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Aceptar plan seleccionado
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {step === '2fa' && (
        <div className="max-w-sm mx-auto px-4 py-8 animate-fade-in">
          <div className="bg-white dark:bg-white/5 rounded-3xl p-8 shadow-card border border-msc-gray dark:border-white/10 text-center">
            <div className="w-16 h-16 rounded-2xl gradient-msc flex items-center justify-center mx-auto mb-4">
              <Shield size={28} className="text-white" />
            </div>
            <h2 className="text-xl font-bold text-msc-black dark:text-white mb-2">Verificación SMS</h2>
            <p className="text-msc-mid text-sm mb-2">
              Hemos enviado un código a <strong>+591 70...456</strong>
            </p>
            <div className="inline-block px-4 py-2 rounded-xl bg-msc-dark/10 dark:bg-msc-dark/30 mb-6">
              <p className="text-xs text-msc-mid">Código demo (solo para prueba):</p>
              <p className="font-bold text-msc-dark dark:text-msc-beige text-xl tracking-widest">{smsCode}</p>
            </div>

            <form onSubmit={handleVerify} className="space-y-4">
              <input
                type="text"
                value={inputCode}
                onChange={e => setInputCode(e.target.value)}
                placeholder="Ingresá el código de 6 dígitos"
                maxLength={6}
                className="w-full px-4 py-3 rounded-xl border border-msc-gray dark:border-white/15 bg-white dark:bg-white/5 text-msc-black dark:text-white placeholder-msc-mid text-center text-xl tracking-widest font-bold focus:outline-none focus:border-msc-dark focus:ring-2 focus:ring-msc-dark/10 transition-all"
              />
              {codeError && (
                <p className="text-msc-orange text-xs">{codeError}</p>
              )}
              <button
                type="submit"
                disabled={verifying || inputCode.length < 6}
                className="w-full py-3.5 rounded-xl gradient-msc text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
              >
                {verifying ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : 'Confirmar plan'}
              </button>
            </form>
          </div>
        </div>
      )}

      {step === 'success' && (
        <div className="max-w-sm mx-auto px-4 py-8 animate-fade-in">
          <div className="bg-white dark:bg-white/5 rounded-3xl p-8 shadow-card border border-msc-gray dark:border-white/10 text-center">
            <div className="w-20 h-20 rounded-full gradient-msc flex items-center justify-center mx-auto mb-6 shadow-msc-lg">
              <CheckCircle2 size={36} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-msc-black dark:text-white mb-2">¡Plan aceptado!</h2>
            <p className="text-msc-mid text-sm mb-2">Tu <strong>{selectedPlan?.name}</strong> ha sido activado exitosamente.</p>
            <p className="text-msc-mid text-xs mb-6">Un ejecutivo de cuentas se pondrá en contacto contigo en las próximas 24 horas.</p>

            <div className="bg-msc-white dark:bg-white/5 rounded-2xl p-4 mb-6 border border-msc-gray dark:border-white/10">
              <div className="grid grid-cols-2 gap-3 text-left">
                <div>
                  <p className="text-xs text-msc-mid">Cuota mensual</p>
                  <p className="font-bold text-msc-dark dark:text-white">Bs. {formatCurrency(selectedPlan?.monthlyPayment || 0)}</p>
                </div>
                <div>
                  <p className="text-xs text-msc-mid">Plazo</p>
                  <p className="font-bold text-msc-dark dark:text-white">{selectedPlan?.months} meses</p>
                </div>
                <div>
                  <p className="text-xs text-msc-mid">Total</p>
                  <p className="font-bold text-msc-dark dark:text-white">Bs. {formatCurrency(selectedPlan?.totalPayment || 0)}</p>
                </div>
                <div>
                  <p className="text-xs text-msc-mid">Score esperado</p>
                  <p className="font-bold text-msc-dark dark:text-white">+{selectedPlan?.scoreImpact} pts</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  const link = document.createElement('a');
                  link.download = 'plan_regularizacion_msc.pdf';
                  link.href = '#';
                  alert('Descargando contrato de acuerdo de pago...');
                }}
                className="w-full py-3 rounded-xl gradient-gold text-msc-black font-semibold text-sm flex items-center justify-center gap-2"
              >
                <Download size={16} />
                Descargar contrato PDF
              </button>
              <button
                onClick={() => setStep('dashboard')}
                className="w-full py-3 rounded-xl border border-msc-gray dark:border-white/15 text-msc-soft dark:text-white text-sm font-medium hover:bg-msc-gray dark:hover:bg-white/10 transition-colors"
              >
                Volver al inicio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Shield({ size, className }: { size: number; className: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
