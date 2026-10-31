/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  CategoryBudget,
  CoachingInsight,
  FinancialSummary,
  SavingsGoal,
  Transaction,
} from '../types/finance';

export const INITIAL_CURRENCY = '₹';

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-001',
    date: '2026-10-30',
    amount: 450,
    currency: '₹',
    category: 'Dining & Food',
    merchant: 'The Olive Bistro',
    description: 'Dinner with design colleagues',
    type: 'expense',
    status: 'confirmed',
    confidence: 0.98,
    cashflowImpact: 'negative',
    aiNotes: 'Classified under discretionary dining. Category is currently at 115% of monthly target.',
  },
  {
    id: 'tx-002',
    date: '2026-10-29',
    amount: 1850,
    currency: '₹',
    category: 'Groceries',
    merchant: 'Nature Basket Organic',
    description: 'Weekly organic produce & pantry staples',
    type: 'expense',
    status: 'confirmed',
    confidence: 0.99,
    cashflowImpact: 'negative',
  },
  {
    id: 'tx-003',
    date: '2026-10-28',
    amount: 3200,
    currency: '₹',
    category: 'Utilities & Bills',
    merchant: 'State Electricity Board',
    description: 'Monthly electricity & climate control',
    type: 'expense',
    status: 'confirmed',
    confidence: 1.0,
    cashflowImpact: 'negative',
  },
  {
    id: 'tx-004',
    date: '2026-10-27',
    amount: 850,
    currency: '₹',
    category: 'Transportation',
    merchant: 'Uber Mobility',
    description: 'Commute to client studio meeting',
    type: 'expense',
    status: 'confirmed',
    confidence: 0.95,
    cashflowImpact: 'negative',
  },
  {
    id: 'tx-005',
    date: '2026-10-25',
    amount: 120000,
    currency: '₹',
    category: 'Income & Consulting',
    merchant: 'Studio Artifacts Ltd',
    description: 'Monthly retainer for product engineering lead',
    type: 'income',
    status: 'confirmed',
    confidence: 1.0,
    cashflowImpact: 'positive',
  },
  {
    id: 'tx-006',
    date: '2026-10-24',
    amount: 35000,
    currency: '₹',
    category: 'Housing & Rent',
    merchant: 'Estate Management Corp',
    description: 'Monthly apartment lease payment',
    type: 'expense',
    status: 'confirmed',
    confidence: 1.0,
    cashflowImpact: 'negative',
  },
  {
    id: 'tx-007',
    date: '2026-10-22',
    amount: 4200,
    currency: '₹',
    category: 'Shopping & Goods',
    merchant: 'Paper & Typo Atelier',
    description: 'Lamy fountain pens & archival notebooks',
    type: 'expense',
    status: 'confirmed',
    confidence: 0.92,
    cashflowImpact: 'negative',
  },
  {
    id: 'tx-008',
    date: '2026-10-20',
    amount: 1499,
    currency: '₹',
    category: 'Entertainment',
    merchant: 'Criterion Channel & Spotify',
    description: 'Digital streaming & culture memberships',
    type: 'expense',
    status: 'confirmed',
    confidence: 0.97,
    cashflowImpact: 'negative',
  },
];

export const INITIAL_BUDGETS: CategoryBudget[] = [
  { category: 'Housing & Rent', spent: 35000, budget: 35000, color: '#334155' },
  { category: 'Dining & Food', spent: 18450, budget: 16000, color: '#DC2626' }, // Over target
  { category: 'Groceries', spent: 12800, budget: 14000, color: '#16A34A' },
  { category: 'Transportation', spent: 6500, budget: 8000, color: '#475569' },
  { category: 'Utilities & Bills', spent: 7200, budget: 7500, color: '#64748B' },
  { category: 'Shopping & Goods', spent: 9600, budget: 10000, color: '#D97706' },
  { category: 'Health & Wellness', spent: 4000, budget: 5000, color: '#16A34A' },
  { category: 'Entertainment', spent: 5800, budget: 6000, color: '#64748B' },
];

export const INITIAL_SAVINGS_GOALS: SavingsGoal[] = [
  {
    id: 'goal-1',
    name: 'Six-Month Emergency Reserve',
    targetAmount: 600000,
    currentAmount: 245000,
    targetDate: '2027-12-31',
    monthlyContribution: 15000,
    category: 'emergency',
  },
  {
    id: 'goal-2',
    name: 'Sovereign Index Investment Pool',
    targetAmount: 300000,
    currentAmount: 85000,
    targetDate: '2027-06-30',
    monthlyContribution: 8000,
    category: 'investment',
  },
  {
    id: 'goal-3',
    name: 'Studio Workstation & Hardware',
    targetAmount: 150000,
    currentAmount: 92000,
    targetDate: '2026-12-31',
    monthlyContribution: 10000,
    category: 'milestone',
  },
];

export const INITIAL_COACHING_INSIGHTS: CoachingInsight[] = [
  {
    id: 'coach-1',
    title: 'Discretionary Dining Over-Allocation',
    headline: 'Dining expenses currently represent 18.5% of total outflow, exceeding your calibrated cap by ₹2,450.',
    category: 'spending',
    impactTier: 'high',
    supportingData: 'Current dining spent: ₹18,450 / Monthly budget: ₹16,000 (115.3% utilized on Day 30).',
    calculationSteps: [
      { label: 'Budget Allocation', formula: 'Target ceiling for Dining & Food', value: '₹16,000 / month' },
      { label: 'Actual Outflow', formula: 'Cumulative transactions across 8 records', value: '₹18,450' },
      { label: 'Variance', formula: 'Actual - Target', value: '+₹2,450 (+15.3%)' },
      { label: 'Opportunity Cost', formula: '₹2,450 invested at 8% CAGR over 3 yrs', value: '₹95,200 future value' },
    ],
    actionItem: 'A modest 15% reduction in casual dining restores ₹2,760 monthly cashflow directly into your Emergency Reserve.',
    metricBadge: 'Dining: 115% of Cap',
  },
  {
    id: 'coach-2',
    title: 'Emergency Reserve Runway Trajectory',
    headline: 'Liquid savings cover 2.46 months of baseline survival burn. Target is 6.0 months.',
    category: 'runway',
    impactTier: 'medium',
    supportingData: 'Liquid reserves: ₹2,45,000 / Fixed monthly burn: ₹99,350.',
    calculationSteps: [
      { label: 'Liquid Capital', formula: 'High-yield savings & instant-access funds', value: '₹2,45,000' },
      { label: 'Monthly Burn Rate', formula: 'Average verified monthly expenditure', value: '₹99,350 / mo' },
      { label: 'Runway Duration', formula: 'Reserves ÷ Monthly Burn', value: '2.46 months' },
      { label: 'Remaining Shortfall', formula: '(6.0 × ₹99,350) - ₹2,45,000', value: '₹3,51,100' },
    ],
    actionItem: 'At the current net contribution pace (₹20,650/mo), full 6-month safety will be achieved in 17 months.',
    metricBadge: '2.46 Months Runway',
  },
  {
    id: 'coach-3',
    title: 'Positive Net Savings Rate Efficiency',
    headline: 'Your current net surplus rate is 17.2%, outperforming peer median (12.4%).',
    category: 'savings',
    impactTier: 'positive',
    supportingData: 'Net inflow: ₹1,20,000 / Net outflow: ₹99,350 / Retained: ₹20,650.',
    calculationSteps: [
      { label: 'Gross Inflow', formula: 'Verified salary and consulting earnings', value: '₹1,20,000' },
      { label: 'Total Outflow', formula: 'Fixed obligations + discretionary spend', value: '₹99,350' },
      { label: 'Retained Surplus', formula: 'Inflow - Outflow', value: '₹20,650' },
      { label: 'Savings Rate', formula: '(₹20,650 ÷ ₹1,20,000) × 100', value: '17.21%' },
    ],
    actionItem: 'Maintaining a 20%+ savings rate accelerates your sovereign investment timeline by 4.2 months.',
    metricBadge: '17.2% Net Savings',
  },
];

export function computeSummary(
  income: number,
  transactions: Transaction[],
  currency: string = '₹',
  initialSavings: number = 245000,
): FinancialSummary {
  const expenseTotal = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netCashflow = income - expenseTotal;
  const savingsRate = income > 0 ? Math.max(0, Math.min(100, (netCashflow / income) * 100)) : 0;
  const emergencyFundMonths = expenseTotal > 0 ? initialSavings / expenseTotal : 0;
  const runwayMonths = expenseTotal > 0 ? initialSavings / expenseTotal : 0;
  const burnRatePerDay = expenseTotal / 30;

  return {
    currency,
    monthlyIncome: income,
    monthlyExpenses: expenseTotal,
    netCashflow,
    savingsRate: Math.round(savingsRate * 10) / 10,
    totalLiquidSavings: initialSavings,
    emergencyFundMonths: Math.round(emergencyFundMonths * 100) / 100,
    runwayMonths: Math.round(runwayMonths * 100) / 100,
    burnRatePerDay: Math.round(burnRatePerDay),
    recentTransactionsCount: transactions.length,
  };
}
