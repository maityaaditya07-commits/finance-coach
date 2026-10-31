/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  CategoryBudget,
  CoachingInsight,
  ParseTransactionResponse,
  WhatIfScenarioInput,
  WhatIfScenarioResult,
} from '../types/finance';
import { parseFinancialInputLocal } from './nlpEngine';

export interface ApiResponse<T> {
  data: T;
  isLiveBackend: boolean;
  source: 'live-gemini-server' | 'deterministic-adapter';
  error?: string;
}

/**
 * Parses natural language financial command via backend or local NLP adapter
 */
export async function parseTransactionWithAI(
  input: string,
  currentBudgets?: CategoryBudget[],
): Promise<ApiResponse<ParseTransactionResponse>> {
  try {
    const res = await fetch('/api/parse-transaction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input, currentBudgets }),
    });

    if (res.ok) {
      const data: ParseTransactionResponse = await res.json();
      return {
        data,
        isLiveBackend: true,
        source: 'live-gemini-server',
      };
    }
  } catch {
    // Backend endpoint not active, gracefully use isolated typed adapter
  }

  // Graceful deterministic adapter
  const fallback = parseFinancialInputLocal(input, currentBudgets);
  return {
    data: fallback,
    isLiveBackend: false,
    source: 'deterministic-adapter',
  };
}

/**
 * Calculates What-If scenario results
 */
export async function simulateScenario(
  input: WhatIfScenarioInput,
  baselineExpenses: number,
  baselineIncome: number,
  categoryBudgets: CategoryBudget[],
): Promise<ApiResponse<WhatIfScenarioResult>> {
  try {
    const res = await fetch('/api/simulate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input, baselineExpenses, baselineIncome, categoryBudgets }),
    });

    if (res.ok) {
      const data: WhatIfScenarioResult = await res.json();
      return {
        data,
        isLiveBackend: true,
        source: 'live-gemini-server',
      };
    }
  } catch {
    // Fallback to local calculation engine
  }

  // Local calculation engine
  const diningBudget = categoryBudgets.find((b) => b.category === 'Dining & Food')?.spent || 18450;
  const shoppingBudget = categoryBudgets.find((b) => b.category === 'Shopping & Goods')?.spent || 9600;
  const entertainmentBudget = categoryBudgets.find((b) => b.category === 'Entertainment')?.spent || 5800;

  const diningSaved = diningBudget * (input.diningReductionPct / 100);
  const shoppingSaved = shoppingBudget * (input.shoppingReductionPct / 100);
  const entSaved = entertainmentBudget * (input.entertainmentReductionPct / 100);

  const totalMonthlySavingsDelta = Math.round(
    diningSaved + shoppingSaved + entSaved + input.monthlySavingsBoost,
  );

  const scenarioExpenses = Math.max(0, baselineExpenses - totalMonthlySavingsDelta);
  const annualizedSavings = totalMonthlySavingsDelta * 12;

  // 5-year compounding formula with monthly contributions at 8% annual return (r = 0.08 / 12)
  const monthlyRate = 0.08 / 12;
  const months = 60;
  // FV = P * ((1 + r)^n - 1) / r
  const fiveYearCompounded = Math.round(
    totalMonthlySavingsDelta * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate),
  );

  // Time saved towards emergency reserve (assume ₹3,51,100 gap)
  const baselineSurplus = Math.max(1, baselineIncome - baselineExpenses);
  const scenarioSurplus = baselineIncome - scenarioExpenses;
  const targetGap = 351100;
  const baselineMonths = targetGap / baselineSurplus;
  const scenarioMonths = targetGap / scenarioSurplus;
  const emergencyFundAccelerationMonths = Math.max(
    0,
    Math.round((baselineMonths - scenarioMonths) * 10) / 10,
  );

  const baselineSavingsRate = Math.round(((baselineIncome - baselineExpenses) / baselineIncome) * 1000) / 10;
  const scenarioSavingsRate = Math.round(((baselineIncome - scenarioExpenses) / baselineIncome) * 1000) / 10;

  const result: WhatIfScenarioResult = {
    baselineExpenses,
    scenarioExpenses,
    monthlySavingsDelta: totalMonthlySavingsDelta,
    annualizedSavings,
    fiveYearCompoundedSavings: fiveYearCompounded,
    emergencyFundAccelerationMonths,
    baselineSavingsRate,
    scenarioSavingsRate,
    summaryText: `By reducing dining by ${input.diningReductionPct}% and shopping by ${input.shoppingReductionPct}%, you unlock an annualized surplus of ₹${annualizedSavings.toLocaleString()}, accelerating safety runway by ${emergencyFundAccelerationMonths} months.`,
  };

  return {
    data: result,
    isLiveBackend: false,
    source: 'deterministic-adapter',
  };
}

/**
 * Fetches coaching insights with explicit calculation steps
 */
export async function fetchCoachingInsights(): Promise<ApiResponse<CoachingInsight[]>> {
  try {
    const res = await fetch('/api/coach');
    if (res.ok) {
      const data: CoachingInsight[] = await res.json();
      return {
        data,
        isLiveBackend: true,
        source: 'live-gemini-server',
      };
    }
  } catch {
    // fallback
  }

  // Imported from initial data on the caller side
  return {
    data: [],
    isLiveBackend: false,
    source: 'deterministic-adapter',
  };
}
