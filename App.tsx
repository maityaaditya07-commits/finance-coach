/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import { Header, ActiveTab } from './components/Header';
import { FinancialOverview } from './components/FinancialOverview';
import { NaturalLanguageInput } from './components/NaturalLanguageInput';
import { WhatIfSimulator } from './components/WhatIfSimulator';
import { CoachingInsights } from './components/CoachingInsights';
import { TransactionLedger } from './components/TransactionLedger';
import { PerspectiveCardDeck } from './components/PerspectiveCardDeck';
import { SkeletonLoader } from './components/SkeletonLoader';
import { ShareExportModal } from './components/ShareExportModal';
import {
  INITIAL_BUDGETS,
  INITIAL_COACHING_INSIGHTS,
  INITIAL_CURRENCY,
  INITIAL_SAVINGS_GOALS,
  INITIAL_TRANSACTIONS,
  computeSummary,
} from './data/initialData';
import {
  CategoryBudget,
  CoachingInsight,
  FinancialSummary,
  SavingsGoal,
  Transaction,
} from './types/finance';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [currency, setCurrency] = useState<string>(INITIAL_CURRENCY);
  const [monthlyIncome, setMonthlyIncome] = useState<number>(120000);
  const [liquidReserves, setLiquidReserves] = useState<number>(245000);

  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [categoryBudgets, setCategoryBudgets] = useState<CategoryBudget[]>(INITIAL_BUDGETS);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(INITIAL_SAVINGS_GOALS);
  const [coachingInsights, setCoachingInsights] = useState<CoachingInsight[]>(INITIAL_COACHING_INSIGHTS);

  // Theme Management: Light & Dark Mode
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('living_money_theme');
      if (saved === 'dark' || saved === 'light') return saved;
    } catch {
      // Safe fallback
    }
    return typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });

  useEffect(() => {
    try {
      localStorage.setItem('living_money_theme', theme);
    } catch {
      // Safe fallback
    }
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const [isContentOpen, setIsContentOpen] = useState<boolean>(false);
  const [isLoadingWorkspace, setIsLoadingWorkspace] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);

  // Esc key closes workspace back to 3D deck or closes modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isShareModalOpen) {
          setIsShareModalOpen(false);
        } else if (isContentOpen) {
          setIsContentOpen(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isContentOpen, isShareModalOpen]);

  // Subtle cursor-responsive parallax offset on desktop only (restrained, <= 6px)
  const [mouseOffset, setMouseOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!hasFinePointer || prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = ((e.clientX / innerWidth) - 0.5) * 8;
      const y = ((e.clientY / innerHeight) - 0.5) * 8;
      setMouseOffset({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Compute live financial summary
  const summary: FinancialSummary = computeSummary(monthlyIncome, transactions, currency, liquidReserves);

  // Smooth, instantaneous card opening with paper-grain transition
  const handleOpenCard = (tab: ActiveTab) => {
    setActiveTab(tab);
    setIsLoadingWorkspace(true);
    setIsContentOpen(true);
    setTimeout(() => {
      setIsLoadingWorkspace(false);
    }, 280);
  };

  // Handle new transaction commit
  const handleCommitTransaction = (newTx: Transaction) => {
    const updatedTxList = [newTx, ...transactions];
    setTransactions(updatedTxList);

    if (newTx.type === 'expense') {
      setCategoryBudgets((prevBudgets) =>
        prevBudgets.map((b) =>
          b.category === newTx.category ? { ...b, spent: b.spent + newTx.amount } : b,
        ),
      );
    } else if (newTx.type === 'income') {
      setMonthlyIncome((prev) => prev + newTx.amount);
    }

    if (newTx.category === 'Dining & Food') {
      setCoachingInsights((prev) => [
        {
          id: `coach-dyn-${Date.now()}`,
          title: 'Immediate Dining Allocation Adjustment',
          headline: `Recent ${currency}${newTx.amount.toLocaleString()} log for ${newTx.merchant} recorded. Total dining spend updated to ${currency}${(
            (categoryBudgets.find((b) => b.category === 'Dining & Food')?.spent || 18450) + newTx.amount
          ).toLocaleString()}.`,
          category: 'spending',
          impactTier: 'high',
          supportingData: `Transaction ID: ${newTx.id} committed on ${newTx.date}.`,
          calculationSteps: [
            { label: 'Logged Outflow', formula: 'Verified single transaction', value: `${currency}${newTx.amount}` },
            {
              label: 'Updated Category Spend',
              formula: 'Previous spend + new log',
              value: `${currency}${(
                (categoryBudgets.find((b) => b.category === 'Dining & Food')?.spent || 18450) + newTx.amount
              ).toLocaleString()}`,
            },
          ],
          actionItem: 'Consider trimming upcoming weekend dining by 20% to re-balance monthly cap.',
          metricBadge: 'Live Budget Refreshed',
        },
        ...prev.filter((p) => !p.id.startsWith('coach-dyn')),
      ]);
    }
  };

  const handleDeleteTransaction = (id: string) => {
    const target = transactions.find((t) => t.id === id);
    if (target && target.type === 'expense') {
      setCategoryBudgets((prev) =>
        prev.map((b) =>
          b.category === target.category ? { ...b, spent: Math.max(0, b.spent - target.amount) } : b,
        ),
      );
    }
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] dark:bg-[#121310] text-[#191A18] dark:text-[#FAF9F6] flex flex-col font-sans selection:bg-[#194D39] selection:text-[#FAF9F6] relative transition-colors duration-300">
      {/* Subtle atmospheric ambient emblem */}
      <div
        className="pointer-events-none fixed top-24 right-12 opacity-[0.03] dark:opacity-[0.05] select-none hidden lg:block transition-transform duration-300 ease-out"
        style={{
          transform: `translate3d(${mouseOffset.x}px, ${mouseOffset.y}px, 0)`,
        }}
        aria-hidden="true"
      >
        <svg width="280" height="280" viewBox="0 0 200 200" fill="none" stroke="currentColor">
          <circle cx="100" cy="100" r="95" strokeWidth="0.8" />
          <circle cx="100" cy="100" r="72" strokeWidth="0.5" strokeDasharray="3 3" />
          <circle cx="100" cy="100" r="48" strokeWidth="0.8" />
          <line x1="100" y1="5" x2="100" y2="195" strokeWidth="0.5" />
          <line x1="5" y1="100" x2="195" y2="100" strokeWidth="0.5" />
        </svg>
      </div>

      {/* Top Header with Theme Switcher & Share/Export Action */}
      <Header
        activeTab={activeTab}
        onTabChange={(tab) => handleOpenCard(tab)}
        currency={currency}
        onCurrencyChange={setCurrency}
        onOpenQuickLog={() => handleOpenCard('input')}
        isContentOpen={isContentOpen}
        onReturnToDeck={() => setIsContentOpen(false)}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenShareModal={() => setIsShareModalOpen(true)}
      />

      {/* When content is closed: ONLY the 5 3D Flashcards are visible directly */}
      {!isContentOpen ? (
        <div className="flex-1 flex flex-col justify-center items-center animate-in fade-in zoom-in-95 duration-300 py-3 sm:py-6 select-none">
          <PerspectiveCardDeck
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            onOpenCard={handleOpenCard}
            currency={currency}
          />
        </div>
      ) : (
        /* Main Content Viewport: Opens with soft editorial animation */
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-400 ease-out">
          {/* Top Return to Deck Navigation Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-[#E6E4DE] dark:border-[#2A2B28]">
            <button
              type="button"
              onClick={() => setIsContentOpen(false)}
              className="group inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-mono font-medium text-[#191A18] dark:text-[#FAF9F6] hover:text-[#FAF9F6] bg-white dark:bg-[#1A1C18] hover:bg-[#191A18] dark:hover:bg-[#27B889] dark:hover:text-[#121310] border border-[#E6E4DE] dark:border-[#2A2B28] hover:border-[#191A18] shadow-2xs transition-all cursor-pointer rounded-xs"
            >
              <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>Return to Deck</span>
              <kbd className="hidden sm:inline-block ml-1 px-1.5 py-0.2 bg-[#F4F2EC] dark:bg-[#242621] group-hover:bg-[#2A2B28] group-hover:text-white rounded text-[10px] text-[#777771] dark:text-[#888A83] border border-[#E6E4DE]/60 dark:border-transparent">
                Esc
              </kbd>
            </button>

            <div className="flex items-center gap-2 text-xs font-mono text-[#777771] dark:text-[#A6A8A1]">
              <span>Advisory Mode:</span>
              <span className="font-semibold text-[#194D39] dark:text-[#27B889] px-2.5 py-0.5 bg-[#194D39]/5 dark:bg-[#27B889]/10 border border-[#194D39]/20 dark:border-[#27B889]/30 rounded-xs">
                {activeTab === 'overview'
                  ? 'Financial Overview'
                  : activeTab === 'input'
                  ? 'Natural Entry'
                  : activeTab === 'simulator'
                  ? 'What-If Simulator'
                  : activeTab === 'coaching'
                  ? 'AI Advisory'
                  : 'Transaction Ledger'}
              </span>
            </div>
          </div>

          {/* Unified Paper-Grain Skeleton Experience during initial soft resolution */}
          {isLoadingWorkspace ? (
            <SkeletonLoader mode={activeTab} />
          ) : (
            <>
              {activeTab === 'overview' && (
                <div className="animate-in fade-in duration-300">
                  <FinancialOverview
                    summary={summary}
                    categoryBudgets={categoryBudgets}
                    savingsGoals={savingsGoals}
                    recentTransactions={transactions}
                    onOpenInput={() => handleOpenCard('input')}
                    onOpenSimulator={() => handleOpenCard('simulator')}
                    onOpenCoaching={() => handleOpenCard('coaching')}
                    onQuickLogTransaction={handleCommitTransaction}
                  />
                </div>
              )}

              {activeTab === 'input' && (
                <div className="animate-in fade-in duration-200">
                  <NaturalLanguageInput
                    currency={currency}
                    categoryBudgets={categoryBudgets}
                    onCommitTransaction={handleCommitTransaction}
                    onViewOverview={() => handleOpenCard('overview')}
                  />
                </div>
              )}

              {activeTab === 'simulator' && (
                <div className="animate-in fade-in duration-200">
                  <WhatIfSimulator
                    summary={summary}
                    categoryBudgets={categoryBudgets}
                    savingsGoals={savingsGoals}
                  />
                </div>
              )}

              {activeTab === 'coaching' && (
                <div className="animate-in fade-in duration-200">
                  <CoachingInsights
                    insights={coachingInsights}
                    summary={summary}
                    onOpenSimulator={() => handleOpenCard('simulator')}
                    onOpenInput={() => handleOpenCard('input')}
                  />
                </div>
              )}

              {activeTab === 'ledger' && (
                <div className="animate-in fade-in duration-200">
                  <TransactionLedger
                    transactions={transactions}
                    currency={currency}
                    onAddTransaction={handleCommitTransaction}
                    onDeleteTransaction={handleDeleteTransaction}
                    onOpenNaturalInput={() => handleOpenCard('input')}
                  />
                </div>
              )}
            </>
          )}
        </main>
      )}

      {/* Share & Offline HTML Dossier Export Modal */}
      <ShareExportModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        summary={summary}
        transactions={transactions}
      />
    </div>
  );
}
