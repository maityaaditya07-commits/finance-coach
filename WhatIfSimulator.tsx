/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import {
  Sliders,
  TrendingUp,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Percent,
  CheckCircle2,
  Calendar,
  Layers,
  Zap,
} from 'lucide-react';
import {
  CategoryBudget,
  FinancialSummary,
  SavingsGoal,
  WhatIfScenarioInput,
  WhatIfScenarioResult,
} from '../types/finance';
import { simulateScenario } from '../services/api';
import { useAnimatedNumber } from '../hooks/useAnimatedNumber';
import { ScrollReveal } from './ScrollReveal';

interface WhatIfSimulatorProps {
  summary: FinancialSummary;
  categoryBudgets: CategoryBudget[];
  savingsGoals: SavingsGoal[];
}

export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({
  summary,
  categoryBudgets,
  savingsGoals,
}) => {
  const currency = summary.currency;

  const [inputState, setInputState] = useState<WhatIfScenarioInput>({
    diningReductionPct: 20,
    shoppingReductionPct: 15,
    entertainmentReductionPct: 20,
    generalDiscretionaryPct: 0,
    monthlySavingsBoost: 2500,
  });

  const [simulationResult, setSimulationResult] = useState<WhatIfScenarioResult | null>(null);
  const [isLiveServer, setIsLiveServer] = useState<boolean>(false);

  // Animated interpolations
  const animatedDelta = useAnimatedNumber(simulationResult?.monthlySavingsDelta || 0, 400);
  const animatedAnnualized = useAnimatedNumber(simulationResult?.annualizedSavings || 0, 400);
  const animatedCompounded = useAnimatedNumber(simulationResult?.fiveYearCompoundedSavings || 0, 400);
  const animatedScenarioExpenses = useAnimatedNumber(simulationResult?.scenarioExpenses || 0, 400);

  // Recalculate simulation whenever slider inputs or baseline change
  useEffect(() => {
    let isMounted = true;
    async function runSim() {
      const res = await simulateScenario(
        inputState,
        summary.monthlyExpenses,
        summary.monthlyIncome,
        categoryBudgets,
      );
      if (isMounted) {
        setSimulationResult(res.data);
        setIsLiveServer(res.isLiveBackend);
      }
    }
    runSim();
    return () => {
      isMounted = false;
    };
  }, [inputState, summary.monthlyExpenses, summary.monthlyIncome, categoryBudgets]);

  const applyPreset = (preset: 'moderate' | 'aggressive' | 'extreme' | 'reset') => {
    if (preset === 'moderate') {
      setInputState({
        diningReductionPct: 15,
        shoppingReductionPct: 15,
        entertainmentReductionPct: 15,
        generalDiscretionaryPct: 0,
        monthlySavingsBoost: 2000,
      });
    } else if (preset === 'aggressive') {
      setInputState({
        diningReductionPct: 30,
        shoppingReductionPct: 25,
        entertainmentReductionPct: 30,
        generalDiscretionaryPct: 5,
        monthlySavingsBoost: 4000,
      });
    } else if (preset === 'extreme') {
      setInputState({
        diningReductionPct: 45,
        shoppingReductionPct: 40,
        entertainmentReductionPct: 40,
        generalDiscretionaryPct: 10,
        monthlySavingsBoost: 8000,
      });
    } else {
      setInputState({
        diningReductionPct: 0,
        shoppingReductionPct: 0,
        entertainmentReductionPct: 0,
        generalDiscretionaryPct: 0,
        monthlySavingsBoost: 0,
      });
    }
  };

  const diningBudget = categoryBudgets.find((b) => b.category === 'Dining & Food')?.spent || 18450;
  const shoppingBudget = categoryBudgets.find((b) => b.category === 'Shopping & Goods')?.spent || 9600;
  const entertainmentBudget = categoryBudgets.find((b) => b.category === 'Entertainment')?.spent || 5800;

  const diningSaved = Math.round(diningBudget * (inputState.diningReductionPct / 100));
  const shoppingSaved = Math.round(shoppingBudget * (inputState.shoppingReductionPct / 100));
  const entSaved = Math.round(entertainmentBudget * (inputState.entertainmentReductionPct / 100));

  return (
    <div className="space-y-12">
      {/* 1. Header & Scenario Preset Toolbar */}
      <ScrollReveal delay={0}>
        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 pb-6 border-b border-[#E6E4DE]">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#777771] mb-2">
              <span>Scenario Lab</span>
              <span>·</span>
              <span>Dynamic Compounding Engine</span>
              <span>·</span>
              <span className="text-[#194D39] font-medium">Non-Destructive Simulation</span>
            </div>
            <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-[#191A18] tracking-tight font-normal">
              What-If Financial Simulator
            </h1>
            <p className="mt-1 text-sm text-[#777771] max-w-2xl">
              Model the exact compounding trajectory of discretionary spending reductions. Your verified financial records remain untouched while you explore alternative futures.
            </p>
          </div>

          {/* Tactile Scenario Presets */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => applyPreset('moderate')}
              className="px-3.5 py-1.5 text-xs font-mono bg-white border border-[#E6E4DE] hover:border-[#191A18] text-[#191A18] transition-colors cursor-pointer shadow-2xs"
            >
              Prudent (-15%)
            </button>
            <button
              type="button"
              onClick={() => applyPreset('aggressive')}
              className="px-3.5 py-1.5 text-xs font-mono bg-white border border-[#E6E4DE] hover:border-[#191A18] text-[#191A18] transition-colors cursor-pointer shadow-2xs"
            >
              Sprint (-30%)
            </button>
            <button
              type="button"
              onClick={() => applyPreset('extreme')}
              className="px-3.5 py-1.5 text-xs font-mono bg-white border border-[#E6E4DE] hover:border-[#191A18] text-[#191A18] transition-colors cursor-pointer shadow-2xs"
            >
              Max Siphon (-45%)
            </button>
            <button
              type="button"
              onClick={() => applyPreset('reset')}
              className="p-1.5 text-xs font-mono text-[#777771] hover:text-[#191A18] border border-[#E6E4DE] hover:border-[#191A18] transition-colors cursor-pointer bg-white"
              title="Reset variables to baseline"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </ScrollReveal>

      {/* 2. THE VISUAL FOCAL POINT: Net Monthly Savings Impact */}
      {simulationResult && (
        <ScrollReveal delay={80}>
          <section className="bg-white border border-[#E6E4DE] p-6 sm:p-8 lg:p-10 shadow-2xs hover:border-[#D4AF37]/50 transition-colors duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Focal Figure: Net Monthly Retained Capital */}
            <div className="lg:col-span-5 space-y-2 border-b lg:border-b-0 lg:border-r border-[#E6E4DE] pb-6 lg:pb-0 lg:pr-8">
              <span className="text-xs font-mono uppercase tracking-widest text-[#777771] block">
                Simulated Monthly Capital Retention
              </span>
              <div className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-[#194D39] font-medium tracking-tight tabular-nums">
                +{currency}{animatedDelta.toLocaleString()}
                <span className="text-base text-[#777771] font-sans font-normal ml-2">/ month</span>
              </div>
              <p className="text-xs text-[#777771] leading-relaxed max-w-sm pt-1">
                Your monthly outgoings drop from <strong className="font-mono text-[#191A18]">{currency}{simulationResult.baselineExpenses.toLocaleString()}</strong> to <strong className="font-mono text-[#194D39]">{currency}{animatedScenarioExpenses.toLocaleString()}</strong>, expanding your savings rate to <strong className="font-mono text-[#194D39]">{simulationResult.scenarioSavingsRate}%</strong>.
              </p>
            </div>

            {/* Supporting Strategic Outcomes Grid */}
            <div className="lg:col-span-7 space-y-6">
              <div className="grid grid-cols-3 gap-4 text-left">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#777771] block">
                    Annualized Surplus
                  </span>
                  <span className="font-mono text-xl sm:text-2xl font-semibold text-[#191A18] tabular-nums mt-0.5 block">
                    {currency}{animatedAnnualized.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-[#777771] font-mono mt-0.5 block">
                    Pure cash retained
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#777771] block">
                    5-Yr Compounding (8% CAGR)
                  </span>
                  <span className="font-mono text-xl sm:text-2xl font-semibold text-[#194D39] tabular-nums mt-0.5 block">
                    {currency}{animatedCompounded.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-[#27B889] font-sans mt-0.5 block">
                    Indexed portfolio
                  </span>
                </div>

                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#777771] block">
                    Runway Acceleration
                  </span>
                  <span className="font-mono text-xl sm:text-2xl font-semibold text-[#191A18] tabular-nums mt-0.5 block">
                    +{simulationResult.emergencyFundAccelerationMonths} mo
                  </span>
                  <span className="text-[11px] text-[#B77932] font-sans mt-0.5 block">
                    Earlier reserve target
                  </span>
                </div>
              </div>

              {/* Baseline vs Scenario Visual Proportion Bar */}
              <div className="space-y-2 pt-2 border-t border-[#E6E4DE]">
                <div className="flex justify-between text-xs font-mono text-[#777771]">
                  <span>Baseline Spend ({currency}{simulationResult.baselineExpenses.toLocaleString()})</span>
                  <span className="text-[#194D39] font-semibold">
                    Scenario Spend ({currency}{simulationResult.scenarioExpenses.toLocaleString()} / mo)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-[#F4F2EC] flex overflow-hidden rounded-xs">
                  <div
                    className="h-full bg-[#194D39] transition-all duration-300"
                    style={{
                      width: `${Math.round(
                        (simulationResult.scenarioExpenses / simulationResult.baselineExpenses) * 100,
                      )}%`,
                    }}
                  />
                  <div
                    className="h-full bg-[#27B889] opacity-40 transition-all duration-300"
                    style={{
                      width: `${Math.round(
                        (simulationResult.monthlySavingsDelta / simulationResult.baselineExpenses) * 100,
                      )}%`,
                    }}
                    title="Trimmed Capital"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        </ScrollReveal>
      )}

      {/* 3. Main Two-Column Architectural Workstation */}
      <ScrollReveal delay={120}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (6 cols): Tactile Parameter Sliders */}
        <div className="lg:col-span-6 bg-white border border-[#E6E4DE] p-6 sm:p-8 shadow-2xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#E6E4DE]">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#194D39]" />
              <h2 className="font-editorial text-2xl text-[#191A18] font-normal">
                Discretionary Levers
              </h2>
            </div>
            <span className="text-[11px] font-mono text-[#777771]">
              Live Sensitivity Matrix
            </span>
          </div>

          {/* Lever 1: Dining & Takeout */}
          <div className="space-y-2.5">
            <div className="flex items-baseline justify-between text-xs">
              <div>
                <span className="font-medium text-[#191A18] block">Trim Dining Out & Prepared Foods</span>
                <span className="text-[11px] text-[#777771] font-mono">
                  Current: {currency}{diningBudget.toLocaleString()} / month
                </span>
              </div>
              <div className="text-right font-mono">
                <span className="text-sm font-semibold text-[#194D39] tabular-nums">
                  -{inputState.diningReductionPct}%
                </span>
                <span className="block text-[11px] text-[#194D39]">
                  +{currency}{diningSaved.toLocaleString()} / mo
                </span>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="60"
              step="5"
              value={inputState.diningReductionPct}
              onChange={(e) =>
                setInputState({ ...inputState, diningReductionPct: parseInt(e.target.value) })
              }
              className="w-full cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-[#777771]">
              <span>0%</span>
              <span>-30%</span>
              <span>-60% Max</span>
            </div>
          </div>

          {/* Lever 2: Shopping & Goods */}
          <div className="space-y-2.5 pt-3 border-t border-[#F4F2EC]">
            <div className="flex items-baseline justify-between text-xs">
              <div>
                <span className="font-medium text-[#191A18] block">Curtail Non-Essential Shopping & Apparel</span>
                <span className="text-[11px] text-[#777771] font-mono">
                  Current: {currency}{shoppingBudget.toLocaleString()} / month
                </span>
              </div>
              <div className="text-right font-mono">
                <span className="text-sm font-semibold text-[#194D39] tabular-nums">
                  -{inputState.shoppingReductionPct}%
                </span>
                <span className="block text-[11px] text-[#194D39]">
                  +{currency}{shoppingSaved.toLocaleString()} / mo
                </span>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="5"
              value={inputState.shoppingReductionPct}
              onChange={(e) =>
                setInputState({ ...inputState, shoppingReductionPct: parseInt(e.target.value) })
              }
              className="w-full cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-[#777771]">
              <span>0%</span>
              <span>-25%</span>
              <span>-50% Max</span>
            </div>
          </div>

          {/* Lever 3: Entertainment & Media */}
          <div className="space-y-2.5 pt-3 border-t border-[#F4F2EC]">
            <div className="flex items-baseline justify-between text-xs">
              <div>
                <span className="font-medium text-[#191A18] block">Rationalize Media & Entertainment</span>
                <span className="text-[11px] text-[#777771] font-mono">
                  Current: {currency}{entertainmentBudget.toLocaleString()} / month
                </span>
              </div>
              <div className="text-right font-mono">
                <span className="text-sm font-semibold text-[#194D39] tabular-nums">
                  -{inputState.entertainmentReductionPct}%
                </span>
                <span className="block text-[11px] text-[#194D39]">
                  +{currency}{entSaved.toLocaleString()} / mo
                </span>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="60"
              step="5"
              value={inputState.entertainmentReductionPct}
              onChange={(e) =>
                setInputState({ ...inputState, entertainmentReductionPct: parseInt(e.target.value) })
              }
              className="w-full cursor-pointer"
            />
          </div>

          {/* Lever 4: Dedicated Recurring Savings Direct Siphon */}
          <div className="space-y-2.5 pt-3 border-t border-[#F4F2EC]">
            <div className="flex items-baseline justify-between text-xs">
              <div>
                <span className="font-medium text-[#191A18] block">Automated Direct Siphon to Index Pool</span>
                <span className="text-[11px] text-[#777771] font-mono">
                  Monthly scheduled contribution increase
                </span>
              </div>
              <div className="text-right font-mono">
                <span className="text-sm font-semibold text-[#194D39] tabular-nums">
                  +{currency}{inputState.monthlySavingsBoost.toLocaleString()}
                </span>
                <span className="block text-[11px] text-[#777771]">/ month</span>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="15000"
              step="500"
              value={inputState.monthlySavingsBoost}
              onChange={(e) =>
                setInputState({ ...inputState, monthlySavingsBoost: parseInt(e.target.value) })
              }
              className="w-full cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-[#777771]">
              <span>+{currency}0</span>
              <span>+{currency}7,500</span>
              <span>+{currency}15,000 Max</span>
            </div>
          </div>
        </div>

        {/* Right Column (6 cols): Compound Wealth Horizon & Timeline */}
        <div className="lg:col-span-6 space-y-6">
          {simulationResult && (
            <>
              {/* Compounding Horizon Card */}
              <div className="bg-[#FAF9F6] border border-[#E6E4DE] p-6 sm:p-8 shadow-2xs space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-[#E6E4DE]">
                  <span className="text-[11px] font-mono uppercase tracking-widest text-[#777771]">
                    Long-Term Wealth Compounding
                  </span>
                  <span className="text-xs font-mono text-[#194D39]">
                    r = 8.0% CAGR
                  </span>
                </div>

                {/* Stepped Timeline: 1 Year -> 3 Years -> 5 Years */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3.5 bg-white border border-[#E6E4DE]">
                    <div>
                      <span className="text-xs font-medium text-[#191A18] block">12-Month Liquidity Accumulation</span>
                      <span className="text-[11px] text-[#777771]">Uncompounded pure cash reserve</span>
                    </div>
                    <div className="font-mono text-lg font-semibold text-[#191A18] tabular-nums">
                      {currency}{simulationResult.annualizedSavings.toLocaleString()}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3.5 bg-white border border-[#E6E4DE]">
                    <div>
                      <span className="text-xs font-medium text-[#191A18] block">3-Year Indexed Compounding</span>
                      <span className="text-[11px] text-[#777771]">At 8.0% expected annualized index return</span>
                    </div>
                    <div className="font-mono text-lg font-semibold text-[#191A18] tabular-nums">
                      {currency}{Math.round(simulationResult.monthlySavingsDelta * ((Math.pow(1 + 0.08 / 12, 36) - 1) / (0.08 / 12))).toLocaleString()}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3.5 bg-white border border-[#194D39]">
                    <div>
                      <span className="text-xs font-semibold text-[#194D39] block">5-Year Strategic Capital Vault</span>
                      <span className="text-[11px] text-[#777771]">Full monthly annuity compounding</span>
                    </div>
                    <div className="font-mono text-xl font-semibold text-[#194D39] tabular-nums">
                      {currency}{simulationResult.fiveYearCompoundedSavings.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Strategic Runway Acceleration Box */}
                <div className="p-4 bg-white border border-[#E6E4DE] flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#194D39] shrink-0 mt-0.5" />
                  <div className="text-xs text-[#777771] leading-relaxed">
                    <strong className="text-[#191A18]">Reserve Runway Impact: </strong>
                    By siphoning {currency}{simulationResult.monthlySavingsDelta.toLocaleString()} into your emergency buffer, the 6.0-month security target will be reached <strong className="text-[#194D39] font-mono">+{simulationResult.emergencyFundAccelerationMonths} months earlier</strong>.
                  </div>
                </div>
              </div>

              {/* Methodology & Integrity Statement */}
              <div className="bg-white border border-[#E6E4DE] p-5 shadow-2xs text-xs space-y-2">
                <div className="font-mono text-[11px] uppercase tracking-wider text-[#777771] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#194D39]" />
                  <span>Calculation Integrity & Methodology</span>
                </div>
                <p className="text-[#777771] leading-relaxed">
                  Compounding is computed via the standard annuity formula <code>FV = P × ((1 + r)ⁿ - 1) / r</code> assuming monthly reinvestment at a conservative 8.0% annual index CAGR. Baseline values reflect actual verified transactions.
                </p>
                <div className="pt-1 text-[11px] font-mono text-[#777771]">
                  Active Engine: {isLiveServer ? 'Verified Express Backend (/api/simulate)' : 'Auditable Synthetic Calculation Adapter'}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      </ScrollReveal>
    </div>
  );
};
