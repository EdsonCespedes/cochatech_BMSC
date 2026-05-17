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
  {
  id: 'ag4',
  name: 'María Fernanda Quiroga',
  email: 'maria.q@bancamsc.bo',
  department: 'SC',
  assignedDebtors: ['11', '12', '13'],
  metrics: {
    totalAssigned: 21,
    contacted: 20,
    negotiations: 12,
    resolved: 9,
    resolutionRate: 42.8,
    avgDaysToResolve: 11,
    recoveredAmount: 68400,
  },
  customKPIs: [
    { id: 'kpi1', name: 'Llamadas/Día', value: 18, target: 15, unit: 'llamadas', color: '#155B3A' },
    { id: 'kpi2', name: 'Tasa Contacto', value: 95, target: 90, unit: '%', color: '#C7A15A' },
    { id: 'kpi3', name: 'Recuperación', value: 3250, target: 3000, unit: 'Bs.', color: '#E8872A' },
  ],
  avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
},

{
  id: 'ag5',
  name: 'José Luis Mamani',
  email: 'jose.m@bancamsc.bo',
  department: 'LP',
  assignedDebtors: ['14', '15'],
  metrics: {
    totalAssigned: 17,
    contacted: 13,
    negotiations: 7,
    resolved: 5,
    resolutionRate: 29.4,
    avgDaysToResolve: 21,
    recoveredAmount: 24800,
  },
  customKPIs: [
    { id: 'kpi1', name: 'Llamadas/Día', value: 9, target: 15, unit: 'llamadas', color: '#c0392b' },
    { id: 'kpi2', name: 'Tasa Contacto', value: 76, target: 90, unit: '%', color: '#C7A15A' },
    { id: 'kpi3', name: 'Recuperación', value: 1450, target: 3000, unit: 'Bs.', color: '#E8872A' },
  ],
  avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
},

{
  id: 'ag6',
  name: 'Daniela Rojas',
  email: 'daniela.r@bancamsc.bo',
  department: 'CB',
  assignedDebtors: ['16', '17', '18'],
  metrics: {
    totalAssigned: 25,
    contacted: 23,
    negotiations: 17,
    resolved: 13,
    resolutionRate: 52,
    avgDaysToResolve: 9,
    recoveredAmount: 82500,
  },
  customKPIs: [
    { id: 'kpi1', name: 'Llamadas/Día', value: 20, target: 15, unit: 'llamadas', color: '#155B3A' },
    { id: 'kpi2', name: 'Tasa Contacto', value: 97, target: 90, unit: '%', color: '#C7A15A' },
    { id: 'kpi3', name: 'Recuperación', value: 4100, target: 3000, unit: 'Bs.', color: '#E8872A' },
  ],
  avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg',
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
    {
    debtorId: '11',
    action: 'Cliente en proceso de refinanciamiento voluntario',
    priority: 'medium',
    expectedImpact: 0.69,
    confidence: 0.84,
  },
  {
    debtorId: '12',
    action: 'No localizado hace 45 días. Escalar búsqueda domiciliaria',
    priority: 'critical',
    expectedImpact: 0.91,
    confidence: 0.95,
  },
  {
    debtorId: '13',
    action: 'Cliente con intención de pago inmediata',
    priority: 'low',
    expectedImpact: 0.62,
    confidence: 0.88,
  },
  {
    debtorId: '14',
    action: 'Preparar documentación para proceso judicial',
    priority: 'critical',
    expectedImpact: 0.86,
    confidence: 0.93,
  },
  {
    debtorId: '15',
    action: 'Aceptar prórroga corta y mantener seguimiento diario',
    priority: 'medium',
    expectedImpact: 0.71,
    confidence: 0.82,
  },
  {
    debtorId: '16',
    action: 'Mantener plan de pagos refinanciado activo',
    priority: 'low',
    expectedImpact: 0.74,
    confidence: 0.86,
  },
  {
    debtorId: '17',
    action: 'Riesgo alto de insolvencia comercial',
    priority: 'critical',
    expectedImpact: 0.93,
    confidence: 0.96,
  },
  {
    debtorId: '18',
    action: 'Caso recuperado exitosamente',
    priority: 'low',
    expectedImpact: 0.55,
    confidence: 0.90,
  },
  
];

export const moraRecords: MoraRecord[] = [
    {
    debtorId: '11',
    date: '2026-05-01',
    phase: 'negotiation',
    moraDays: 38,
    department: 'SC',
    assignedAgent: 'ag4',
    actionsTaken: [
      'Llamada de seguimiento',
      'Oferta de refinanciamiento',
      'Confirmación parcial de pago',
    ],
    nextActionDate: '2026-05-20',
    benefitApplied: 'installment',
  },

  {
    debtorId: '12',
    date: '2026-04-11',
    phase: 'legal',
    moraDays: 127,
    department: 'LP',
    assignedAgent: 'ag5',
    actionsTaken: [
      'Visita domiciliaria fallida',
      'Número telefónico inactivo',
      'Escalamiento jurídico',
    ],
    nextActionDate: '2026-05-22',
  },

  {
    debtorId: '13',
    date: '2026-05-12',
    phase: 'resolved',
    moraDays: 9,
    department: 'OR',
    assignedAgent: 'ag4',
    actionsTaken: [
      'Pago total realizado',
      'Cierre de cobranza',
    ],
    benefitApplied: 'early_payment',
  },

  {
    debtorId: '14',
    date: '2026-03-18',
    phase: 'legal',
    moraDays: 173,
    department: 'CB',
    assignedAgent: 'ag5',
    actionsTaken: [
      'Cliente evade contacto',
      'Notificación judicial enviada',
      'Validación de garantías',
    ],
    nextActionDate: '2026-05-25',
  },

  {
    debtorId: '15',
    date: '2026-05-08',
    phase: 'collection',
    moraDays: 42,
    department: 'SC',
    assignedAgent: 'ag5',
    actionsTaken: [
      'Promesa de pago registrada',
      'Seguimiento WhatsApp',
    ],
    nextActionDate: '2026-05-19',
  },

  {
    debtorId: '16',
    date: '2026-04-28',
    phase: 'negotiation',
    moraDays: 57,
    department: 'TJ',
    assignedAgent: 'ag6',
    actionsTaken: [
      'Refinanciamiento aprobado',
      'Cronograma firmado',
    ],
    benefitApplied: 'installment',
    nextActionDate: '2026-05-28',
  },

  {
    debtorId: '17',
    date: '2026-02-15',
    phase: 'legal',
    moraDays: 210,
    department: 'LP',
    assignedAgent: 'ag6',
    actionsTaken: [
      'Actividad comercial suspendida',
      'Análisis patrimonial',
      'Preparación de embargo',
    ],
    nextActionDate: '2026-05-30',
  },

  {
    debtorId: '18',
    date: '2026-05-10',
    phase: 'resolved',
    moraDays: 14,
    department: 'SC',
    assignedAgent: 'ag6',
    actionsTaken: [
      'Pago completado',
      'Actualización de historial crediticio',
    ],
    benefitApplied: 'early_payment',
  },
];

