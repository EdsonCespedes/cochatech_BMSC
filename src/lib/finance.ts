export function calcMonthlyPayment(principal: number, annualRate: number, months: number): number {
  if (months <= 0) return principal;
  if (annualRate === 0) return principal / months;
  const r = annualRate / 12 / 100;
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

export function calcTotalPayment(monthly: number, months: number): number {
  return monthly * months;
}

export function calcTotalInterest(monthly: number, months: number, principal: number): number {
  return monthly * months - principal;
}

export function formatCurrency(amount: number, decimals = 0): string {
  return new Intl.NumberFormat('es-BO', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
}

export function getScoreColor(score: number): string {
  if (score >= 85) return '#155B3A';
  if (score >= 60) return '#E8C922';
  if (score >= 40) return '#E8872A';
  return '#c0392b';
}

export function getScoreBgColor(score: number): string {
  if (score >= 85) return 'bg-green-100 text-green-800';
  if (score >= 60) return 'bg-yellow-100 text-yellow-800';
  if (score >= 40) return 'bg-orange-100 text-orange-800';
  return 'bg-red-100 text-red-800';
}

export function getScoreLabel(score: number): string {
  if (score >= 85) return 'Excelente';
  if (score >= 60) return 'Regular';
  if (score >= 40) return 'En riesgo';
  return 'Crítico';
}

export function generateSMSCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export interface PaymentPlan {
  id: 'acelerado' | 'equilibrado' | 'oxigeno';
  name: string;
  description: string;
  months: number;
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  interestSaved: number;
  scoreImpact: number;
  annualRate: number;
  isRecommended: boolean;
}

export function generatePlans(debt: number, _income: number): PaymentPlan[] {
  const baseRate = 18;

  const plans: PaymentPlan[] = [
    {
      id: 'acelerado',
      name: 'Plan Acelerado',
      description: 'Liquida tu deuda más rápido con cuotas más altas. Máximo ahorro en intereses.',
      months: 12,
      annualRate: baseRate - 4,
      monthlyPayment: 0,
      totalPayment: 0,
      totalInterest: 0,
      interestSaved: 0,
      scoreImpact: 18,
      isRecommended: false,
    },
    {
      id: 'equilibrado',
      name: 'Plan Equilibrado',
      description: 'Balance ideal entre cuota mensual y plazo. Recomendado por nuestra IA.',
      months: 24,
      annualRate: baseRate - 2,
      monthlyPayment: 0,
      totalPayment: 0,
      totalInterest: 0,
      interestSaved: 0,
      scoreImpact: 12,
      isRecommended: true,
    },
    {
      id: 'oxigeno',
      name: 'Plan Oxígeno',
      description: 'Cuotas mínimas para aliviar tu flujo de caja mensual.',
      months: 48,
      annualRate: baseRate,
      monthlyPayment: 0,
      totalPayment: 0,
      totalInterest: 0,
      interestSaved: 0,
      scoreImpact: 6,
      isRecommended: false,
    },
  ];

  const standardTotal = debt * (1 + baseRate / 100 * (36 / 12));

  return plans.map(plan => {
    const monthly = calcMonthlyPayment(debt, plan.annualRate, plan.months);
    const total = monthly * plan.months;
    const interest = total - debt;
    const saved = standardTotal - total;

    return {
      ...plan,
      monthlyPayment: Math.round(monthly),
      totalPayment: Math.round(total),
      totalInterest: Math.round(interest),
      interestSaved: Math.round(saved > 0 ? saved : 0),
    };
  });
}
