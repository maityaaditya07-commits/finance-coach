/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

/**
 * Luxury Architectural Atelier & Vault Engraving
 * Precision vector linework reminiscent of classical bank notes & Swiss watch dial guilloché
 */
export const AtelierVaultArtwork: React.FC<{ className?: string }> = ({ className = 'w-full h-48' }) => {
  return (
    <div className={`relative overflow-hidden bg-[#141513] text-[#FAF9F6] border border-[#2A2B28] select-none ${className}`}>
      {/* Background radial atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#194D39]/30 via-[#141513] to-[#0D0E0C]" />

      {/* Guilloché / Architectural Vector Linework */}
      <svg
        viewBox="0 0 800 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full object-cover opacity-85"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="goldBeam" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#E5C378" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#194D39" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="emeraldStream" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#27B889" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#113F2F" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Concentric Guilloché Radii */}
        <g stroke="url(#goldBeam)" strokeWidth="0.75" opacity="0.6">
          <circle cx="680" cy="160" r="80" />
          <circle cx="680" cy="160" r="120" strokeDasharray="3 4" />
          <circle cx="680" cy="160" r="160" />
          <circle cx="680" cy="160" r="210" strokeDasharray="2 6" />
          <circle cx="680" cy="160" r="260" />
          <circle cx="680" cy="160" r="320" strokeDasharray="4 8" />
        </g>

        {/* Perspective Vault Horizon Lines */}
        <g stroke="rgba(230, 228, 222, 0.15)" strokeWidth="0.8">
          <line x1="0" y1="280" x2="800" y2="280" />
          <line x1="0" y1="240" x2="800" y2="240" />
          <line x1="0" y1="200" x2="800" y2="200" strokeDasharray="4 4" />
          <line x1="0" y1="160" x2="800" y2="160" />
          {/* Ray lines radiating from vanishing point */}
          <line x1="150" y1="0" x2="0" y2="320" />
          <line x1="280" y1="0" x2="120" y2="320" />
          <line x1="420" y1="0" x2="340" y2="320" />
          <line x1="560" y1="0" x2="520" y2="320" />
        </g>

        {/* Geometric Balance Polyhedron (Subtle Luxury Centerpiece) */}
        <g stroke="url(#goldBeam)" strokeWidth="1.2">
          <polygon points="680,100 735,160 680,220 625,160" fill="rgba(212, 175, 55, 0.04)" />
          <line x1="680" y1="100" x2="680" y2="220" />
          <line x1="625" y1="160" x2="735" y2="160" />
          <circle cx="680" cy="160" r="6" fill="#D4AF37" />
        </g>

        {/* Fine Architectural Graduation Ticks */}
        {Array.from({ length: 32 }).map((_, i) => (
          <line
            key={i}
            x1={50 + i * 22}
            y1={276}
            x2={50 + i * 22}
            y2={i % 4 === 0 ? 288 : 283}
            stroke={i % 4 === 0 ? '#D4AF37' : 'rgba(230, 228, 222, 0.3)'}
            strokeWidth={i % 4 === 0 ? 1 : 0.6}
          />
        ))}
      </svg>

      {/* Text Overlay Content */}
      <div className="relative z-10 p-6 sm:p-8 h-full flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#D4AF37] rotate-45" />
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#D4AF37]">
              Living Money Atelier · Sovereign Index
            </span>
          </div>
          <span className="text-[11px] font-mono text-[#9E9E97]">
            Est. MMXXVI
          </span>
        </div>

        <div className="max-w-lg space-y-1">
          <div className="font-editorial text-2xl sm:text-3xl text-white font-normal italic tracking-tight">
            "Capital is not merely accumulated; it is deliberately directed."
          </div>
          <p className="text-xs text-[#A1A1AA] font-sans">
            Private asset architecture optimizing for liquidity, runway solvency, and generational compounding.
          </p>
        </div>
      </div>
    </div>
  );
};

/**
 * Animated Capital Flow Diagram Component
 * Shows Money Flow from Gross Earnings -> Outflows -> Compounded Vault
 */
export const CapitalFlowDiagram: React.FC<{
  income: number;
  expenses: number;
  surplus: number;
  savingsRate: number;
  currency?: string;
}> = ({ income, expenses, surplus, savingsRate, currency = '₹' }) => {
  return (
    <div className="bg-white border border-[#E6E4DE] p-6 shadow-2xs space-y-4">
      <div className="flex items-center justify-between border-b border-[#E6E4DE] pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#194D39]" />
          <span className="text-xs font-mono uppercase tracking-wider text-[#777771]">
            Capital Siphon & Flow Architecture
          </span>
        </div>
        <span className="text-xs font-mono text-[#194D39] font-semibold">
          {savingsRate}% Retention Efficiency
        </span>
      </div>

      {/* High-End Flow Diagram Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
        {/* Step 1: Gross Inflow */}
        <div className="p-4 bg-[#FAF9F6] border border-[#E6E4DE] relative group hover:border-[#191A18] transition-colors">
          <div className="flex items-center justify-between text-[11px] font-mono uppercase text-[#777771]">
            <span>01 · Gross Inflow</span>
            <span className="text-[#27B889]">100%</span>
          </div>
          <div className="mt-2 text-xl font-mono font-semibold text-[#191A18] tabular-nums">
            {currency}{income.toLocaleString()}
          </div>
          <p className="text-[11px] text-[#777771] mt-1">
            Consulting retainer & monthly baseline earnings
          </p>
          <div className="hidden sm:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-4 h-4 bg-white border border-[#E6E4DE] rotate-45" />
        </div>

        {/* Step 2: Operational Burn */}
        <div className="p-4 bg-[#FAF9F6] border border-[#E6E4DE] relative group hover:border-[#B91C1C] transition-colors">
          <div className="flex items-center justify-between text-[11px] font-mono uppercase text-[#777771]">
            <span>02 · Total Outflow</span>
            <span className="text-[#B91C1C]">{Math.round((expenses / income) * 100)}%</span>
          </div>
          <div className="mt-2 text-xl font-mono font-semibold text-[#191A18] tabular-nums">
            -{currency}{expenses.toLocaleString()}
          </div>
          <p className="text-[11px] text-[#777771] mt-1">
            Fixed obligations + discretionary lifestyle costs
          </p>
          <div className="hidden sm:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-4 h-4 bg-white border border-[#E6E4DE] rotate-45" />
        </div>

        {/* Step 3: Retained Surplus Siphon */}
        <div className="p-4 bg-[#F2F7F4] border border-[#194D39]/40 relative group hover:border-[#194D39] transition-colors">
          <div className="flex items-center justify-between text-[11px] font-mono uppercase text-[#194D39]">
            <span>03 · Retained Surplus</span>
            <span className="font-semibold">+{savingsRate}%</span>
          </div>
          <div className="mt-2 text-xl font-mono font-bold text-[#194D39] tabular-nums">
            +{currency}{surplus.toLocaleString()}
          </div>
          <p className="text-[11px] text-[#194D39]/80 mt-1">
            Net capital channeled into emergency & index vaults
          </p>
        </div>
      </div>
    </div>
  );
};

/**
 * Embossed Advisory Gold Seal Motif
 */
export const AdvisorySeal: React.FC<{ size?: number; className?: string }> = ({ size = 64, className = '' }) => {
  return (
    <div
      style={{ width: size, height: size }}
      className={`relative rounded-full flex items-center justify-center p-1 select-none ${className}`}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full text-[#D4AF37] fill-none stroke-current">
        <circle cx="50" cy="50" r="46" strokeWidth="1.5" />
        <circle cx="50" cy="50" r="42" strokeWidth="0.8" strokeDasharray="3 2" />
        <circle cx="50" cy="50" r="32" strokeWidth="1" />
        <path d="M50 22 L53 38 L68 38 L56 48 L60 64 L50 54 L40 64 L44 48 L32 38 L47 38 Z" fill="#D4AF37" fillOpacity="0.15" strokeWidth="1" />
      </svg>
    </div>
  );
};
