/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TransactionType = 'expense' | 'income';

export type TransactionCategory =
  | 'Housing & Rent'
  | 'Dining & Food'
  | 'Groceries'
  | 'Transportation'
  | 'Utilities & Bills'
  | 'Shopping & Goods'
  | 'Health & Wellness'
  | 'Entertainment'
  | 'Education'
  | 'Income & Consulting'
  | 'Investments & Savings'
  | 'Other';

export interface Transaction {
  id: string;
  date: string; // ISO date string YYYY-MM-DD
  amount: number;
  currency: string;
  category: TransactionCategory;
  merchant: string;
  description: string;
  type: TransactionType;
  status: 'confirmed' | 'pending_review';
  confidence?: number;
  cashflowImpact?: 'positive' | 'negative' | 'neutral';
  aiNotes?: string;
}

export interface CategoryBudget {
  category: TransactionCategory;
  spent: number;
  budget: number;
  color: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  monthlyContribution: number;
  category: 'emergency' | 'milestone' | 'investment';
}

export interface FinancialSummary {
  currency: string;
  monthlyIncome: number;
  monthlyExpenses: number;
  netCashflow: number;
  savingsRate: number; // 0 to 100 percentage
  totalLiquidSavings: number;
  emergencyFundMonths: number;
  runwayMonths: number;
  burnRatePerDay: number;
  recentTransactionsCount: number;
}

export interface WhatIfScenarioInput {
  diningReductionPct: number; // e.g. 25 = 25% reduction
  shoppingReductionPct: number;
  entertainmentReductionPct: number;
  generalDiscretionaryPct: number;
  monthlySavingsBoost: number; // flat amount added
}

export interface WhatIfScenarioResult {
  baselineExpenses: number;
  scenarioExpenses: number;
  monthlySavingsDelta: number;
  annualizedSavings: number;
  fiveYearCompoundedSavings: number; // with 8% compound annual return
  emergencyFundAccelerationMonths: number;
  baselineSavingsRate: number;
  scenarioSavingsRate: number;
  summaryText: string;
}

export interface CoachingInsight {
  id: string;
  title: string;
  headline: string;
  category: 'spending' | 'savings' | 'runway' | 'optimization';
  impactTier: 'high' | 'medium' | 'positive';
  supportingData: string;
  calculationSteps: {
    label: string;
    formula: string;
    value: string;
  }[];
  actionItem: string;
  metricBadge: string;
}

export interface ParseTransactionResponse {
  success: boolean;
  rawInput: string;
  parsedTransaction: {
    amount: number;
    currency: string;
    category: TransactionCategory;
    merchant: string;
    description: string;
    type: TransactionType;
    date: string;
    confidence: number;
    suggestedAction: string;
  };
  budgetContext: {
    category: TransactionCategory;
    currentSpent: number;
    budgetLimit: number;
    projectedSpent: number;
    willExceedBudget: boolean;
  };
  explanation: string;
}
