/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ArrowUpRight,
  ShieldCheck,
  Target,
  Sparkles,
  ArrowRight,
  CornerDownLeft,
  CheckCircle2,
  Clock,
  TrendingUp,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react';
import {
  CategoryBudget,
  FinancialSummary,
  SavingsGoal,
  Transaction,
} from '../types/finance';
import { parseTransactionWithAI } from '../services/api';
import { AtelierVaultArtwork, CapitalFlowDiagram } from './EditorialArtworks';
import { useAnimatedNumber } from '../hooks/useAnimatedNumber';
import { ScrollReveal } from './ScrollReveal';

interface FinancialOverviewProps {
  summary: FinancialSummary;
  categoryBudgets: CategoryBudget[];
  savingsGoals: SavingsGoal[];
  recentTransactions: Transaction[];
  onOpenInput: () => void;
  onOpenSimulator: () => void;
  onOpenCoaching: () => void;
  onQuickLogTransaction?: (tx: Transaction) => void;
}

export const FinancialOverview: React.FC<FinancialOverviewProps> = ({
  summary,
  categoryBudgets,
  savingsGoals,
  recentTransactions,
  onOpenInput,
  onOpenSimulator,
  onOpenCoaching,
  onQuickLogTransaction,
}) => {
  const currency = summary.currency;
  const [quickInput, setQuickInput] = useState<string>('');
  const [isQuickParsing, setIsQuickParsing] = useState<boolean>(false);
  const [quickSuccess, setQuickSuccess] = useState<string | null>(null);

  // Smooth animated financial counters
  const animatedSurplus = useAnimatedNumber(summary.netCashflow);
  const animatedIncome = useAnimatedNumber(summary.monthlyIncome);
  const animatedExpenses = useAnimatedNumber(summary.monthlyExpenses);
  const animatedSavings = useAnimatedNumber(summary.totalLiquidSavings);

  const handleQuickSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim() || isQuickParsing) return;

    setIsQuickParsing(true);
    setQuickSuccess(null);

    try {
      const res = await parseTransactionWithAI(quickInput, categoryBudgets);
      if (res.data && res.data.success) {
        const pt = res.data.parsedTransaction;
        const newTx: Transaction = {
          id: `tx-${Date.now()}`,
          date: pt.date,
          amount: pt.amount,
          currency: pt.currency || currency,
          category: pt.category,
          merchant: pt.merchant,
          description: quickInput,
          type: pt.type,
          status: 'confirmed',
          confidence: pt.confidence,
          cashflowImpact: pt.type === 'income' ? 'positive' : 'negative',
        };

        if (onQuickLogTransaction) {
          onQuickLogTransaction(newTx);
        }
        setQuickSuccess(
          `Committed ${pt.type === 'income' ? '+' : '-'}${currency}${pt.amount.toLocaleString()} for ${pt.merchant} (${pt.category})`,
        );
        setQuickInput('');
        setTimeout(() => setQuickSuccess(null), 4000);
      }
    } catch {
      onOpenInput();
    } finally {
      setIsQuickParsing(false);
    }
  };

  // Fixed obligations vs Discretionary grouping for high-level insight
  const fixedCategories = ['Housing & Rent', 'Utilities & Bills', 'Transportation'];
  const fixedTotal = categoryBudgets
    .filter((b) => fixedCategories.includes(b.category))
    .reduce((acc, curr) => acc + curr.spent, 0);

  const discretionaryTotal = summary.monthlyExpenses - fixedTotal;
  const fixedPct = Math.round((fixedTotal / summary.monthlyExpenses) * 100);
  const discretionaryPct = 100 - fixedPct;

  return (
    <div className="space-y-12">
      {/* 0. Luxury Architectural Atelier & Sovereign Index Hero Banner */}
      <ScrollReveal delay={0}>
        <section className="transition-transform duration-500 hover:scale-[1.002]">
          <AtelierVaultArtwork className="w-full h-56 sm:h-64 shadow-xs" />
        </section>
      </ScrollReveal>

      {/* 1. Page Title & Advisory Dossier Metadata */}
      <ScrollReveal delay={60}>
        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 pb-6 border-b border-[#E6E4DE]">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#777771] mb-2">
              <span>Portfolio Dossier</span>
              <span>·</span>
              <span>Fiscal Period: October 2026</span>
              <span>·</span>
              <span className="text-[#194D39] font-medium">Verified Active Ledger</span>
            </div>
            <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-[#191A18] tracking-tight font-normal">
              Financial Health & Capital Flow
            </h1>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onOpenSimulator}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-[#191A18] bg-white border border-[#E6E4DE] hover:border-[#191A18] hover:shadow-sm transition-all cursor-pointer shadow-2xs"
            >
              <span>Run What-If Scenario</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#194D39]" />
            </button>
            <button
              type="button"
              onClick={onOpenInput}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-[#FAF9F6] bg-[#194D39] hover:bg-[#143D2D] hover:shadow-sm active:scale-[0.99] transition-all cursor-pointer shadow-2xs"
            >
              <span>+ Full Journal Entry</span>
            </button>
          </div>
        </div>
      </ScrollReveal>

      {/* 1.5 Financial Clarity & Net Worth Spotlight (Directly matching editorial brief) */}
      <ScrollReveal delay={90}>
        <section className="bg-gradient-to-br from-[#FAF8F5] via-[#F4F1EA] to-[#EBE7DF] border border-[#E6E4DE] p-6 sm:p-8 lg:p-10 shadow-xs relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Editorial Text */}
            <div className="lg:col-span-5 space-y-3">
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#8C733E] font-medium block">
                FINANCIAL CLARITY
              </span>
              <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-[#191A18] tracking-tight font-normal leading-[1.12]">
                See your net{' '}
                <span className="italic font-serif font-light text-[#194D39]">
                  worth
                </span>
                , clearly.
              </h2>
              <p className="text-xs sm:text-sm text-[#575953] leading-relaxed max-w-sm">
                Assets, debts, cashflow, and the month ahead — unified in one auditable perspective.
              </p>
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={onOpenSimulator}
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-[#194D39] font-medium hover:underline cursor-pointer"
                >
                  <span>Explore Wealth Projection</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right Financial Studio Mockup Cards */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-12 gap-4">
              {/* Free to Spend Card */}
              <div className="sm:col-span-5 bg-white border border-[#E6E4DE] p-5 shadow-2xs flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between text-xs font-mono text-[#777771]">
                  <span className="uppercase tracking-wider">Free to Spend</span>
                  <span className="w-2 h-2 rounded-full bg-[#27B889]" />
                </div>
                <div className="space-y-1">
                  <div className="font-mono text-3xl sm:text-4xl font-bold text-[#191A18] tabular-nums">
                    {currency}{Math.round(summary.netCashflow).toLocaleString()}
                  </div>
                  <div className="text-xs text-[#777771] font-mono">
                    left · 28 days
                  </div>
                  <div className="text-[11px] text-[#8C733E] font-mono pt-1">
                    {currency}{Math.round(summary.netCashflow / 28).toLocaleString()}/day average
                  </div>
                </div>
                {/* Visual Ring Gauge */}
                <div className="pt-2 border-t border-[#F4F2EC] flex items-center justify-between text-xs font-mono text-[#777771]">
                  <span>Cap: {currency}{summary.monthlyIncome.toLocaleString()}</span>
                  <span className="font-bold text-[#194D39]">{summary.savingsRate}% Retained</span>
                </div>
              </div>

              {/* Net Worth Sovereign Card */}
              <div className="sm:col-span-7 bg-[#141613] text-[#FAF9F6] p-5 shadow-xs flex flex-col justify-between space-y-4 relative overflow-hidden group border border-[#2A2B28]">
                <div className="flex items-center justify-between text-[11px] font-mono text-[#A6A8A1]">
                  <span className="uppercase tracking-wider">NET WORTH</span>
                  <span className="text-[#27B889] font-sans text-xs flex items-center gap-1 font-medium">
                    <TrendingUp className="w-3.5 h-3.5" /> +15.51% this mo
                  </span>
                </div>

                <div>
                  <div className="font-editorial text-3xl sm:text-4xl text-white font-medium tracking-tight tabular-nums">
                    {currency}{(summary.totalLiquidSavings + 76983).toLocaleString()}
                  </div>
                  <div className="text-[11px] text-[#27B889] font-mono mt-0.5">
                    ▲ +{currency}73,051 net addition this period
                  </div>
                </div>

                {/* Glowing trajectory curve */}
                <div className="relative h-10 w-full overflow-hidden">
                  <svg className="w-full h-full" viewBox="0 0 200 40" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="networth-glow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#27B889" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#27B889" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 0 35 Q 50 30, 90 22 T 160 14 T 200 6"
                      fill="none"
                      stroke="#27B889"
                      strokeWidth="2"
                    />
                    <path
                      d="M 0 35 Q 50 30, 90 22 T 160 14 T 200 6 L 200 40 L 0 40 Z"
                      fill="url(#networth-glow)"
                    />
                  </svg>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-[10px] font-mono text-[#A6A8A1]">
                  <div>
                    <span className="block text-[#777771]">Cash</span>
                    <span className="text-white font-semibold">{currency}{summary.totalLiquidSavings.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="block text-[#777771]">Investments</span>
                    <span className="text-white font-semibold">{currency}76,983</span>
                  </div>
                  <div>
                    <span className="block text-[#777771]">Liabilities</span>
                    <span className="text-white font-semibold">{currency}0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* 2. THE VISUAL ANCHOR: Executive Capital Solvency Header */}
      <ScrollReveal delay={120}>
        <section className="bg-white border border-[#E6E4DE] p-6 sm:p-8 lg:p-10 shadow-2xs hover:border-[#D4AF37]/50 transition-colors duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Main Anchor Metric: Net Monthly Surplus */}
            <div className="lg:col-span-5 space-y-2 border-b lg:border-b-0 lg:border-r border-[#E6E4DE] pb-6 lg:pb-0 lg:pr-8">
              <span className="text-xs font-mono uppercase tracking-widest text-[#777771] block">
                Retained Monthly Surplus (Net Cashflow)
              </span>
              <div className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-[#194D39] font-medium tracking-tight tabular-nums transition-all">
                +{currency}{animatedSurplus.toLocaleString()}
              </div>
            <p className="text-xs text-[#777771] leading-relaxed max-w-sm pt-1">
              You retain <span className="font-mono text-[#191A18] font-semibold">{summary.savingsRate}%</span> of your gross earnings after settling all fixed obligations and discretionary living costs.
            </p>
          </div>

          {/* Sub-Metrics: Inflow vs Outflow Balanced Bar */}
          <div className="lg:col-span-7 space-y-6">
            <div className="grid grid-cols-3 gap-4 text-left">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#777771] block">
                  Gross Inflow
                </span>
                <span className="font-mono text-xl sm:text-2xl font-semibold text-[#191A18] tabular-nums mt-0.5 block">
                  {currency}{animatedIncome.toLocaleString()}
                </span>
                <span className="text-[11px] text-[#27B889] font-sans flex items-center gap-1 mt-0.5">
                  <ArrowUpRight className="w-3 h-3" /> Consulting Base
                </span>
              </div>

              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#777771] block">
                  Total Outflow
                </span>
                <span className="font-mono text-xl sm:text-2xl font-semibold text-[#191A18] tabular-nums mt-0.5 block">
                  {currency}{animatedExpenses.toLocaleString()}
                </span>
                <span className="text-[11px] text-[#777771] font-mono mt-0.5 block">
                  {currency}{summary.burnRatePerDay.toLocaleString()} / day
                </span>
              </div>

              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#777771] block">
                  Survival Runway
                </span>
                <span className="font-mono text-xl sm:text-2xl font-semibold text-[#191A18] tabular-nums mt-0.5 block">
                  {summary.runwayMonths} mo
                </span>
                <span className="text-[11px] text-[#B77932] font-sans flex items-center gap-1 mt-0.5">
                  <Clock className="w-3 h-3" /> Target: 6.0 mo
                </span>
              </div>
            </div>

            {/* Visual Cash Flow Absorption Bar */}
            <div className="space-y-2 pt-2 border-t border-[#E6E4DE]">
              <div className="flex justify-between text-xs font-mono text-[#777771]">
                <span>Cash Flow Allocation:</span>
                <span>
                  Fixed: {fixedPct}% · Discretionary: {discretionaryPct}% · Retained: {Math.round((summary.netCashflow / summary.monthlyIncome) * 100)}%
                </span>
              </div>
              <div className="w-full h-2.5 bg-[#F4F2EC] flex overflow-hidden rounded-xs">
                {/* Fixed */}
                <div
                  className="h-full bg-[#191A18] transition-all duration-500"
                  style={{ width: `${(fixedTotal / summary.monthlyIncome) * 100}%` }}
                  title={`Fixed Obligations: ${currency}${fixedTotal.toLocaleString()}`}
                />
                {/* Discretionary */}
                <div
                  className="h-full bg-[#777771] transition-all duration-500"
                  style={{ width: `${(discretionaryTotal / summary.monthlyIncome) * 100}%` }}
                  title={`Discretionary Living: ${currency}${discretionaryTotal.toLocaleString()}`}
                />
                {/* Retained Surplus */}
                <div
                  className="h-full bg-[#194D39] transition-all duration-500"
                  style={{ width: `${(summary.netCashflow / summary.monthlyIncome) * 100}%` }}
                  title={`Retained Cashflow: ${currency}${summary.netCashflow.toLocaleString()}`}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      </ScrollReveal>

      {/* 3. Interactive Capital Flow Diagram */}
      <ScrollReveal delay={100}>
        <section>
          <CapitalFlowDiagram
            income={summary.monthlyIncome}
            expenses={summary.monthlyExpenses}
            surplus={summary.netCashflow}
            savingsRate={summary.savingsRate}
            currency={currency}
          />
        </section>
      </ScrollReveal>

      {/* 4. Prominent Quick-Entry Console */}
      <ScrollReveal delay={120}>
        <section className="bg-[#FAF9F6] border border-[#E6E4DE] p-4 sm:p-5 shadow-2xs hover:border-[#191A18] transition-colors">
          <form onSubmit={handleQuickSubmit} className="flex flex-col sm:flex-row items-center gap-3">
            <div className="text-xs font-mono uppercase tracking-wider text-[#777771] whitespace-nowrap shrink-0 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#194D39]" />
              <span>Natural Entry:</span>
            </div>
            <input
              type="text"
              value={quickInput}
              onChange={(e) => setQuickInput(e.target.value)}
              placeholder="State transaction naturally, e.g. 'I spent ₹450 on dinner today at Olive Bistro'..."
              disabled={isQuickParsing}
              className="w-full px-3.5 py-2.5 bg-white border border-[#E6E4DE] text-xs sm:text-sm text-[#191A18] placeholder-[#9E9E97] focus:border-[#194D39] transition-all font-sans"
            />
            <button
              type="submit"
              disabled={isQuickParsing || !quickInput.trim()}
              className="w-full sm:w-auto px-5 py-2.5 bg-[#191A18] text-[#FAF9F6] text-xs font-medium hover:bg-[#194D39] disabled:opacity-40 transition-colors whitespace-nowrap flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-not-allowed shadow-2xs"
            >
              {isQuickParsing ? 'Interpreting...' : 'Log & Recalculate'}
              <CornerDownLeft className="w-3.5 h-3.5" />
            </button>
          </form>

          {quickSuccess && (
            <div className="mt-2.5 pt-2 border-t border-[#E6E4DE] flex items-center gap-2 text-xs font-mono text-[#194D39]">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{quickSuccess} · Financial figures updated.</span>
            </div>
          )}
        </section>
      </ScrollReveal>

      {/* 5. Two-Column Architectural Section: Spending Breakdown & Capital Reserves */}
      <ScrollReveal delay={140}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (7 cols): Spending by Category with Headroom Indicators */}
        <div className="lg:col-span-7 bg-white border border-[#E6E4DE] p-6 sm:p-8 shadow-2xs space-y-6 hover:border-[#D4AF37]/40 transition-colors">
          <div className="flex items-center justify-between pb-4 border-b border-[#E6E4DE]">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#777771]">
                Budget Discipline
              </span>
              <h2 className="font-editorial text-2xl sm:text-3xl text-[#191A18] font-normal mt-0.5">
                Spending by Category
              </h2>
            </div>
            <span className="text-xs font-mono text-[#777771]">
              8 Calibrated Categories
            </span>
          </div>

          <div className="space-y-4">
            {categoryBudgets.map((item) => {
              const pct = Math.round((item.spent / item.budget) * 100);
              const isOver = pct > 100;
              const variance = item.spent - item.budget;

              return (
                <div key={item.category} className="space-y-1.5 group">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-[#191A18] group-hover:text-[#194D39] transition-colors">{item.category}</span>
                    <div className="flex items-center gap-2 font-mono tabular-nums">
                      <span className="text-[#191A18] font-semibold">
                        {currency}{item.spent.toLocaleString()}
                      </span>
                      <span className="text-[#A1A1AA]">/</span>
                      <span className="text-[#777771]">
                        {currency}{item.budget.toLocaleString()}
                      </span>
                      <span
                        className={`text-[11px] font-mono px-1 py-0.2 ${
                          isOver ? 'text-[#B91C1C] font-semibold' : 'text-[#777771]'
                        }`}
                      >
                        {pct}%
                      </span>
                    </div>
                  </div>

                  {/* Restrained Hairline Progress Line */}
                  <div className="w-full h-1.5 bg-[#F4F2EC] overflow-hidden rounded-xs">
                    <div
                      className={`h-full transition-all duration-500 ease-out ${
                        isOver ? 'bg-[#B91C1C]' : 'bg-[#191A18]'
                      }`}
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                  </div>

                  {isOver && (
                    <div className="text-[11px] font-mono text-[#B91C1C] flex items-center gap-1 pt-0.5">
                      <AlertTriangle className="w-3 h-3" />
                      <span>Exceeds monthly allocation by {currency}{variance.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-[#E6E4DE] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#777771]">
            <span>Aggregate Categorized Outflow: <strong className="text-[#191A18] font-mono">{currency}{summary.monthlyExpenses.toLocaleString()}</strong></span>
            <button
              type="button"
              onClick={onOpenSimulator}
              className="text-[#194D39] hover:underline font-medium flex items-center gap-1 cursor-pointer self-start sm:self-auto"
            >
              <span>Model reductions in Simulator</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Right Column (5 cols): Emergency Reserve Runway & Strategic Goals */}
        <div className="lg:col-span-5 space-y-6">
          {/* Emergency Runway Gauge Card */}
          <div className="bg-[#191A18] text-[#FAF9F6] p-6 sm:p-7 shadow-xs space-y-4 relative overflow-hidden group hover:border-[#D4AF37]/50 border border-transparent transition-all">
            <div className="flex items-center justify-between text-xs font-mono text-[#9E9E97]">
              <span>Emergency Reserve Solvency</span>
              <span>2.46 / 6.0 Months</span>
            </div>

            <div>
              <div className="font-editorial text-4xl text-white font-medium tabular-nums">
                {currency}{animatedSavings.toLocaleString()}
              </div>
              <p className="mt-1.5 text-xs text-[#A1A1AA] leading-relaxed">
                Liquid capital deployed across instant-access accounts covers <strong className="text-white font-mono">{summary.runwayMonths} months</strong> of baseline operational burn. Recommended safety margin is 6.0 months.
              </p>
            </div>

            {/* Visual Runway Timeline Indicator */}
            <div className="space-y-1.5 pt-3 border-t border-[#2A2B28]">
              <div className="flex justify-between text-[11px] font-mono text-[#777771]">
                <span>0 mo</span>
                <span className="text-[#27B889] font-semibold">{summary.runwayMonths} mo (Current)</span>
                <span>6.0 mo (Target)</span>
              </div>
              <div className="w-full h-2 bg-[#2A2B28] rounded-xs overflow-hidden">
                <div
                  className="h-full bg-[#27B889] transition-all duration-700 ease-out"
                  style={{ width: `${Math.min(100, Math.round((summary.totalLiquidSavings / 600000) * 100))}%` }}
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-[#9E9E97]">
              <span>Shortfall to 6-mo safety:</span>
              <span className="text-white font-semibold">{currency}{(600000 - summary.totalLiquidSavings).toLocaleString()}</span>
            </div>
          </div>

          {/* Strategic Savings Goals Progress */}
          <div className="bg-white border border-[#E6E4DE] p-6 sm:p-7 shadow-2xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6E4DE]">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-[#194D39]" />
                <h3 className="font-editorial text-2xl text-[#191A18] font-normal">
                  Strategic Savings Goals
                </h3>
              </div>
            </div>

            <div className="space-y-4">
              {savingsGoals.map((goal) => {
                const progressPct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
                return (
                  <div key={goal.id} className="p-3.5 bg-[#FAF9F6] border border-[#E6E4DE] space-y-2 hover:border-[#191A18] transition-colors">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#191A18]">{goal.name}</span>
                      <span className="font-mono tabular-nums text-[#194D39] font-semibold">
                        {progressPct}%
                      </span>
                    </div>

                    <div className="w-full h-1.5 bg-[#E6E4DE] rounded-xs overflow-hidden">
                      <div
                        className="h-full bg-[#194D39] transition-all duration-500 ease-out"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono text-[#777771]">
                      <span>
                        {currency}{goal.currentAmount.toLocaleString()} / {currency}{goal.targetAmount.toLocaleString()}
                      </span>
                      <span>Target: {goal.targetDate.slice(0, 7)}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={onOpenCoaching}
              className="w-full py-2.5 bg-[#F4F2EC] hover:bg-[#E6E4DE] text-[#191A18] text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#194D39]" />
              <span>Review Advisory Intelligence</span>
            </button>
          </div>
        </div>
      </div>
      </ScrollReveal>

      {/* 5.5 AI-Powered Insights Showcase (Directly reflecting User Reference Screenshot 3) */}
      <ScrollReveal delay={150}>
        <section className="bg-white border border-[#E6E4DE] p-6 sm:p-8 lg:p-10 shadow-2xs relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left AI Feature Card preview */}
            <div className="lg:col-span-5 bg-[#FAF9F6] border border-[#E6E4DE] p-6 rounded-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-full bg-[#194D39] text-[#FAF9F6] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <span className="text-[11px] font-mono tracking-widest text-[#194D39] uppercase font-semibold">
                  Auditable Engine
                </span>
              </div>
              <div className="bg-white border border-[#E6E4DE] p-4 shadow-2xs space-y-2">
                <div className="flex items-center gap-2 text-xs font-medium text-[#191A18]">
                  <span className="w-2 h-2 rounded-full bg-[#27B889]" />
                  <span>Immediate Cashflow Anomaly Check</span>
                </div>
                <p className="text-xs text-[#777771] leading-relaxed">
                  Discretionary spending is trending <strong className="text-[#194D39] font-mono">14% below</strong> historical peak. Monthly surplus remains on track for sovereign targets.
                </p>
              </div>
              <button
                type="button"
                onClick={onOpenCoaching}
                className="w-full py-2 px-3 text-xs font-mono font-medium text-[#FAF9F6] bg-[#191A18] hover:bg-[#194D39] transition-colors cursor-pointer text-center block shadow-2xs"
              >
                Launch Coaching Analysis →
              </button>
            </div>

            {/* Right Pillars matching reference screenshot */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-[#FAF9F6] border border-[#E6E4DE] text-[10px] font-mono uppercase tracking-widest text-[#194D39]">
                <span>2</span>
                <span>·</span>
                <span>AI Insight</span>
              </div>

              <h3 className="font-editorial text-2xl sm:text-3xl lg:text-4xl text-[#191A18] font-normal tracking-tight">
                Unlock Smarter Decisions With AI-Powered Insights
              </h3>

              <p className="text-xs sm:text-sm text-[#575953] leading-relaxed">
                Living Money’s deterministic financial models provide real-time, actionable insights to make smarter, more informed decisions across your balance sheet.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#27B889] shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong className="text-[#191A18] block font-medium">Real-Time Data Analysis</strong>
                    <span className="text-[#777771]">Instant categorization and cashflow recalculation upon every natural journal entry.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#27B889] shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong className="text-[#191A18] block font-medium">Predictive Forecasting</strong>
                    <span className="text-[#777771]">Forward-model dining, subscription, and discretionary shifts in real-time.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#27B889] shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong className="text-[#191A18] block font-medium">Personalized Recommendations</strong>
                    <span className="text-[#777771]">Transparent, formula-backed action steps with zero black-box obscurity.</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onOpenCoaching}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-[#194D39] hover:bg-[#143D2D] transition-colors cursor-pointer shadow-2xs"
                >
                  <span>Explore Advisory Insights</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* 6. Recent Verified Transactions Dossier Strip */}
      <ScrollReveal delay={160}>
        <section className="bg-white border border-[#E6E4DE] p-6 sm:p-7 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E6E4DE]">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#777771]">
                Audit Trail
              </span>
              <h3 className="font-editorial text-2xl text-[#191A18] font-normal mt-0.5">
                Recent Transactions
              </h3>
            </div>
            <button
              type="button"
              onClick={onOpenInput}
              className="text-xs font-mono text-[#194D39] hover:underline cursor-pointer flex items-center gap-1"
            >
              <span>View Full Ledger</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E6E4DE] text-[#777771] font-mono uppercase text-[11px]">
                  <th className="py-2.5 pr-4">Date</th>
                  <th className="py-2.5 px-4">Merchant / Counterparty</th>
                  <th className="py-2.5 px-4">Category</th>
                  <th className="py-2.5 px-4 text-right">Amount</th>
                  <th className="py-2.5 pl-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F4F2EC]">
                {recentTransactions.slice(0, 5).map((tx) => (
                  <tr key={tx.id} className="hover:bg-[#FAF9F6] transition-colors">
                    <td className="py-3 pr-4 font-mono text-[#777771] whitespace-nowrap">{tx.date}</td>
                    <td className="py-3 px-4 font-semibold text-[#191A18]">{tx.merchant}</td>
                    <td className="py-3 px-4 text-[#777771]">{tx.category}</td>
                    <td
                      className={`py-3 px-4 text-right font-mono font-semibold tabular-nums whitespace-nowrap ${
                        tx.type === 'income' ? 'text-[#27B889]' : 'text-[#191A18]'
                      }`}
                    >
                      {tx.type === 'income' ? '+' : '-'}
                      {currency}
                      {tx.amount.toLocaleString()}
                    </td>
                    <td className="py-3 pl-4 text-right font-mono text-[11px] text-[#777771] whitespace-nowrap">
                      {tx.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </ScrollReveal>
    </div>
  );
};
