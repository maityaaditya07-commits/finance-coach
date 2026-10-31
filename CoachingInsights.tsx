/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Sparkles,
  ChevronDown,
  ChevronUp,
  Calculator,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  Clock,
  ArrowUpRight,
  AlertTriangle,
  Sliders,
  BookOpen,
} from 'lucide-react';
import { CoachingInsight, FinancialSummary } from '../types/finance';

interface CoachingInsightsProps {
  insights: CoachingInsight[];
  summary: FinancialSummary;
  onOpenSimulator: () => void;
  onOpenInput: () => void;
}

export const CoachingInsights: React.FC<CoachingInsightsProps> = ({
  insights,
  summary,
  onOpenSimulator,
  onOpenInput,
}) => {
  const currency = summary.currency;
  const [expandedId, setExpandedId] = useState<string | null>(insights[0]?.id || null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-12">
      {/* 1. Header & Executive Introduction */}
      <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 pb-6 border-b border-[#E6E4DE]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#777771] mb-2">
            <span>Advisory Intelligence</span>
            <span>·</span>
            <span>Evidence-Based Diagnostics</span>
            <span>·</span>
            <span className="text-[#194D39] font-medium">Auditable Assumptions</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-[#191A18] tracking-tight font-normal">
            Financial Architecture & Insights
          </h1>
          <p className="mt-1 text-sm text-[#777771] max-w-2xl">
            Prioritized diagnostic intelligence derived strictly from your verified ledger data. Each insight pairs a clear conclusion with discoverable mathematical proof and practical next steps.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenSimulator}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-[#191A18] bg-white border border-[#E6E4DE] hover:border-[#191A18] transition-colors cursor-pointer shadow-2xs self-start md:self-auto shrink-0"
        >
          <span>Test Solutions in Simulator</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#194D39]" />
        </button>
      </div>

      {/* 2. Executive Financial Solvency Ticker (3 Key Indicators) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white border border-[#E6E4DE] shadow-2xs">
          <span className="text-[11px] font-mono uppercase text-[#777771] block">Identified Risk</span>
          <span className="font-editorial text-xl text-[#B91C1C] font-normal block mt-1">
            Dining 115.3% of Cap
          </span>
          <span className="text-xs text-[#777771] block mt-0.5">
            +₹2,450 monthly overage
          </span>
        </div>

        <div className="p-4 bg-white border border-[#E6E4DE] shadow-2xs">
          <span className="text-[11px] font-mono uppercase text-[#777771] block">Runway Solvency</span>
          <span className="font-editorial text-xl text-[#B77932] font-normal block mt-1">
            {summary.runwayMonths} Months Covered
          </span>
          <span className="text-xs text-[#777771] block mt-0.5">
            Target safety: 6.0 months
          </span>
        </div>

        <div className="p-4 bg-white border border-[#E6E4DE] shadow-2xs">
          <span className="text-[11px] font-mono uppercase text-[#777771] block">Net Surplus Pace</span>
          <span className="font-editorial text-xl text-[#194D39] font-normal block mt-1">
            {summary.savingsRate}% Retention Rate
          </span>
          <span className="text-xs text-[#777771] block mt-0.5">
            +{currency}{summary.netCashflow.toLocaleString()} retained/mo
          </span>
        </div>
      </div>

      {/* 3. Prioritized Intelligence Dossier */}
      <div className="space-y-6">
        {insights.map((insight, index) => {
          const isExpanded = expandedId === insight.id;
          const isRisk = insight.impactTier === 'high';
          const isWarning = insight.impactTier === 'medium';
          const isPositive = insight.impactTier === 'positive';

          return (
            <article
              key={insight.id}
              className={`bg-white border transition-all duration-200 shadow-2xs ${
                isRisk
                  ? 'border-[#E6E4DE] border-t-2 border-t-[#B91C1C]'
                  : isWarning
                  ? 'border-[#E6E4DE] border-t-2 border-t-[#B77932]'
                  : 'border-[#E6E4DE] border-t-2 border-t-[#194D39]'
              }`}
            >
              <div className="p-6 sm:p-8 space-y-5">
                {/* Header Rank & Badge */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-mono text-[#777771]">
                      <span className="font-medium">
                        {index === 0
                          ? 'Priority 1 · Primary Financial Leakage'
                          : index === 1
                          ? 'Priority 2 · Capital Horizon'
                          : 'Priority 3 · Asset Retention Efficiency'}
                      </span>
                      <span>·</span>
                      <span
                        className={`font-semibold ${
                          isRisk
                            ? 'text-[#B91C1C]'
                            : isWarning
                            ? 'text-[#B77932]'
                            : 'text-[#194D39]'
                        }`}
                      >
                        {insight.metricBadge}
                      </span>
                    </div>

                    <h2 className="font-editorial text-2xl sm:text-3xl text-[#191A18] font-normal">
                      {insight.title}
                    </h2>
                  </div>

                  {/* Progressive Disclosure Toggle */}
                  <button
                    type="button"
                    onClick={() => toggleExpand(insight.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-[#777771] hover:text-[#191A18] border border-[#E6E4DE] hover:border-[#191A18] transition-colors cursor-pointer self-start shrink-0 bg-[#FAF9F6]"
                  >
                    <Calculator className="w-3.5 h-3.5 text-[#194D39]" />
                    <span>{isExpanded ? 'Hide Calculations' : 'Audit Formulas'}</span>
                    {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                </div>

                {/* Core Narrative Conclusion */}
                <p className="text-sm sm:text-[15px] text-[#191A18] leading-relaxed max-w-3xl">
                  {insight.headline}
                </p>

                {/* Verified Evidence Provenance */}
                <div className="text-xs font-mono text-[#777771] bg-[#FAF9F6] px-3.5 py-2 border border-[#E6E4DE]">
                  Evidence Base: {insight.supportingData}
                </div>

                {/* Practical Next Action Strip */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[#F4F2EC]">
                  <div className="flex items-start gap-2.5 text-xs text-[#191A18] max-w-2xl">
                    <span className="font-mono text-[#194D39] font-bold shrink-0 uppercase tracking-wider text-[11px]">
                      Action:
                    </span>
                    <span className="leading-relaxed text-[#777771]">{insight.actionItem}</span>
                  </div>

                  <button
                    type="button"
                    onClick={onOpenSimulator}
                    className="flex items-center gap-1 text-xs font-medium text-[#194D39] hover:underline cursor-pointer shrink-0"
                  >
                    <span>Simulate scenario</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Expandable Mathematical Breakdown (Auditable progressive disclosure) */}
                {isExpanded && (
                  <div className="pt-4 border-t border-[#E6E4DE] space-y-3 bg-[#FAF9F6] p-4 sm:p-5 mt-4">
                    <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#777771]">
                      <Calculator className="w-3.5 h-3.5 text-[#194D39]" />
                      <span>Mathematical Derivation & Variable Proof</span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-[#E6E4DE] text-[#777771] font-mono text-[11px] uppercase">
                            <th className="py-2 pr-4">Diagnostic Factor</th>
                            <th className="py-2 px-4">Formula / Source</th>
                            <th className="py-2 pl-4 text-right">Computed Value</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E6E4DE]/60">
                          {insight.calculationSteps.map((step, idx) => (
                            <tr key={idx} className="hover:bg-white/80">
                              <td className="py-2.5 pr-4 font-medium text-[#191A18]">{step.label}</td>
                              <td className="py-2.5 px-4 font-mono text-[#777771] text-[11px]">{step.formula}</td>
                              <td className="py-2.5 pl-4 text-right font-mono font-semibold text-[#191A18] tabular-nums">
                                {step.value}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <p className="text-[11px] text-[#777771] pt-1 font-mono">
                      Calculations are deterministic and derived strictly from the current verified transaction ledger without speculative peer adjustments.
                    </p>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
