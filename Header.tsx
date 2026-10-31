/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Plus, Sun, Moon, Share2 } from 'lucide-react';

export type ActiveTab = 'overview' | 'input' | 'simulator' | 'coaching' | 'ledger';

interface HeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  currency: string;
  onCurrencyChange: (c: string) => void;
  onOpenQuickLog: () => void;
  isContentOpen?: boolean;
  onReturnToDeck?: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenShareModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currency,
  onCurrencyChange,
  onOpenQuickLog,
  onReturnToDeck,
  theme,
  onToggleTheme,
  onOpenShareModal,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F6]/95 dark:bg-[#141613]/95 border-b border-[#E6E4DE] dark:border-[#2A2B28] backdrop-blur-xs transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Wordmark & Return to Deck Action */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              if (onReturnToDeck) onReturnToDeck();
            }}
            className="group flex items-baseline gap-2 cursor-pointer text-left select-none"
            title="Return to 3D Flashcard Deck"
          >
            <span className="font-editorial text-2xl sm:text-[26px] tracking-tight text-[#191A18] dark:text-[#FAF9F6] group-hover:text-[#194D39] dark:group-hover:text-[#27B889] transition-colors">
              Living Money
            </span>
            <span className="hidden sm:inline-block text-[10px] font-mono uppercase tracking-widest text-[#777771] dark:text-[#A6A8A1]">
              Advisory
            </span>
          </button>
        </div>

        {/* Theme, Share, Currency Switcher & Primary Action */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Share & Export Modal Trigger */}
          {onOpenShareModal && (
            <button
              type="button"
              onClick={onOpenShareModal}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono border border-[#E6E4DE] dark:border-[#2A2B28] bg-white dark:bg-[#1C1E1A] text-[#575953] dark:text-[#A6A8A1] hover:text-[#191A18] dark:hover:text-white transition-colors cursor-pointer rounded-xs"
              title="Share with teammates or download .html dossier"
            >
              <Share2 className="w-3.5 h-3.5 text-[#194D39] dark:text-[#27B889]" />
              <span className="hidden sm:inline">Share</span>
            </button>
          )}

          {/* Light / Dark Mode Toggle */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="p-1.5 sm:p-2 border border-[#E6E4DE] dark:border-[#2A2B28] bg-white dark:bg-[#1C1E1A] text-[#191A18] dark:text-[#FAF9F6] hover:bg-[#F4F2EC] dark:hover:bg-[#252822] transition-colors cursor-pointer rounded-xs"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle color theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-3.5 h-3.5 text-[#D4AF37]" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-[#6A6963]" />
            )}
          </button>

          {/* Subtle Currency Segmented Switcher */}
          <div className="flex items-center bg-[#F4F2EC] dark:bg-[#1F211D] border border-[#E6E4DE] dark:border-[#2A2B28] p-0.5 text-xs font-mono">
            {(['₹', '$', '€', '£'] as const).map((curr) => (
              <button
                key={curr}
                type="button"
                onClick={() => onCurrencyChange(curr)}
                className={`px-2 py-1 transition-colors cursor-pointer ${
                  currency === curr
                    ? 'bg-[#191A18] dark:bg-white text-[#FAF9F6] dark:text-[#191A18] font-semibold'
                    : 'text-[#777771] dark:text-[#A6A8A1] hover:text-[#191A18] dark:hover:text-white'
                }`}
                title={`Switch currency to ${curr}`}
              >
                {curr}
              </button>
            ))}
          </div>

          {/* Primary Action Button */}
          <button
            type="button"
            onClick={onOpenQuickLog}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs font-medium text-[#FAF9F6] bg-[#194D39] hover:bg-[#143D2D] dark:bg-[#27B889] dark:text-[#141613] dark:hover:bg-[#209f75] active:scale-[0.99] transition-all whitespace-nowrap shrink-0 cursor-pointer shadow-2xs rounded-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Record Spending</span>
            <span className="sm:hidden">Log</span>
          </button>
        </div>
      </div>
    </header>
  );
};
