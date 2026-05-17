export type MoraPhase = 'alert' | 'collection' | 'negotiation' | 'legal' | 'resolved';
export type Department = 'LP' | 'CB' | 'SC' | 'OR' | 'PT' | 'BE' | 'TJ' | 'CH' | 'PD';

export interface CollectionAgent {
  id: string;
  name: string;
  email: string;
  department: Department;
  assignedDebtors: string[];
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

export interface CustomKPI {
  id: string;
  name: string;
  value: number;
  target: number;
  unit: string;
  color: string;
}

export interface MoraRecord {
  debtorId: string;
  date: string;
  phase: MoraPhase;
  moraDays: number;
  department: Department;
  assignedAgent?: string;
  actionsTaken: string[];
  nextActionDate?: string;
  benefitApplied?: 'early_payment' | 'installment' | 'penalty_waived';
}

export interface AIRecommendation {
  debtorId: string;
  action: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  expectedImpact: number;
  confidence: number;
}

export const departments: { code: Department; name: string; region: string }[] = [
  { code: 'LP', name: 'La Paz', region: 'Altiplano' },
  { code: 'CB', name: 'Cochabamba', region: 'Valles' },
  { code: 'SC', name: 'Santa Cruz', region: 'Oriente' },
  { code: 'OR', name: 'Oruro', region: 'Altiplano' },
  { code: 'PT', name: 'Potosí', region: 'Altiplano' },
  { code: 'BE', name: 'Beni', region: 'Oriente' },
  { code: 'TJ', name: 'Tarija', region: 'Valles' },
  { code: 'CH', name: 'Chuquisaca', region: 'Valles' },
  { code: 'PD', name: 'Pando', region: 'Oriente' },
];

export const collectionAgents: CollectionAgent[] = [
  {
    id: 'ag1',
    name: 'Carlos Hernández',
    email: 'carlos.h@bancamsc.bo',
    department: 'SC',
    assignedDebtors: ['1', '3', '5'],
    metrics: {
      totalAssigned: 12,
      contacted: 10,
      negotiations: 6,
      resolved: 4,
      resolutionRate: 33.3,
      avgDaysToResolve: 15,
      recoveredAmount: 28400,
    },
    customKPIs: [
      { id: 'kpi1', name: 'Llamadas/Día', value: 12, target: 15, unit: 'llamadas', color: '#155B3A' },
      { id: 'kpi2', name: 'Tasa Contacto', value: 83, target: 90, unit: '%', color: '#C7A15A' },
      { id: 'kpi3', name: 'Promedio Recuperación', value: 2367, target: 3000, unit: 'Bs.', color: '#E8872A' },
    ],
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
  {
    id: 'ag2',
    name: 'Patricia Morales',
    email: 'patricia.m@bancamsc.bo',
    department: 'LP',
    assignedDebtors: ['2', '4', '6'],
    metrics: {
      totalAssigned: 15,
      contacted: 14,
      negotiations: 9,
      resolved: 7,
      resolutionRate: 46.7,
      avgDaysToResolve: 12,
      recoveredAmount: 45680,
    },
    customKPIs: [
      { id: 'kpi1', name: 'Llamadas/Día', value: 14, target: 15, unit: 'llamadas', color: '#155B3A' },
      { id: 'kpi2', name: 'Tasa Contacto', value: 93, target: 90, unit: '%', color: '#C7A15A' },
      { id: 'kpi3', name: 'Promedio Recuperación', value: 3046, target: 3000, unit: 'Bs.', color: '#E8872A' },
    ],
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
  {
    id: 'ag3',
    name: 'Roberto López',
    email: 'roberto.l@bancamsc.bo',
    department: 'CB',
    assignedDebtors: ['7', '8', '9', '10'],
    metrics: {
      totalAssigned: 18,
      contacted: 16,
      negotiations: 10,
      resolved: 6,
      resolutionRate: 33.3,
      avgDaysToResolve: 18,
      recoveredAmount: 35200,
    },
    customKPIs: [
      { id: 'kpi1', name: 'Llamadas/Día', value: 10, target: 15, unit: 'llamadas', color: '#c0392b' },
      { id: 'kpi2', name: 'Tasa Contacto', value: 89, target: 90, unit: '%', color: '#C7A15A' },
      { id: 'kpi3', name: 'Promedio Recuperación', value: 1955, target: 3000, unit: 'Bs.', color: '#E8872A' },
    ],
    avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=150',
  },
];

export const moraJourneyPhases: MoraPhase[] = ['alert', 'collection', 'negotiation', 'legal', 'resolved'];

export const phaseLabels: Record<MoraPhase, string> = {
  alert: 'Alerta Temprana',
  collection: 'Cobranza',
  negotiation: 'Negociación',
  legal: 'Judicial',
  resolved: 'Resuelto',
};

export const phaseColors: Record<MoraPhase, string> = {
  alert: '#E8C922',
  collection: '#E8872A',
  negotiation: '#C7A15A',
  legal: '#c0392b',
  resolved: '#155B3A',
};

export const moraProjections = [
  { month: 'Ene', departmentMora: { LP: 450000, CB: 280000, SC: 320000, OR: 180000, PT: 95000, BE: 75000, TJ: 120000, CH: 100000, PD: 50000 } },
  { month: 'Feb', departmentMora: { LP: 420000, CB: 260000, SC: 310000, OR: 170000, PT: 88000, BE: 70000, TJ: 115000, CH: 95000, PD: 48000 } },
  { month: 'Mar', departmentMora: { LP: 390000, CB: 240000, SC: 295000, OR: 160000, PT: 82000, BE: 65000, TJ: 108000, CH: 90000, PD: 45000 } },
  { month: 'Abr', departmentMora: { LP: 360000, CB: 220000, SC: 275000, OR: 150000, PT: 76000, BE: 60000, TJ: 100000, CH: 85000, PD: 42000 } },
  { month: 'May', departmentMora: { LP: 340000, CB: 210000, SC: 258000, OR: 145000, PT: 71000, BE: 58000, TJ: 95000, CH: 82000, PD: 40000 } },
  { month: 'Jun', departmentMora: { LP: 320000, CB: 195000, SC: 240000, OR: 135000, PT: 65000, BE: 52000, TJ: 88000, CH: 78000, PD: 38000 } },
];

export const aiRecommendations: AIRecommendation[] = [
  { debtorId: '2', action: 'Contactar inmediatamente - Alto riesgo judicial', priority: 'critical', expectedImpact: 0.85, confidence: 0.92 },
  { debtorId: '4', action: 'Ofrecer refinanciamiento con reducción de intereses', priority: 'high', expectedImpact: 0.78, confidence: 0.88 },
  { debtorId: '7', action: 'Programar visita de cobranza a domicilio', priority: 'high', expectedImpact: 0.72, confidence: 0.85 },
  { debtorId: '9', action: 'Enviar alerta de acción legal inminente', priority: 'critical', expectedImpact: 0.80, confidence: 0.90 },
  { debtorId: '6', action: 'Establecer plan de pagos acelerado', priority: 'medium', expectedImpact: 0.65, confidence: 0.79 },
];
