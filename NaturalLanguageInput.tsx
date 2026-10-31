/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Edit2,
  Check,
  RefreshCw,
  CornerDownLeft,
  X,
  TrendingDown,
} from 'lucide-react';
import {
  CategoryBudget,
  ParseTransactionResponse,
  Transaction,
  TransactionCategory,
  TransactionType,
} from '../types/finance';
import { parseTransactionWithAI } from '../services/api';
import { ScrollReveal } from './ScrollReveal';

interface NaturalLanguageInputProps {
  currency: string;
  categoryBudgets: CategoryBudget[];
  onCommitTransaction: (tx: Transaction) => void;
  onViewOverview?: () => void;
}

const SAMPLE_PROMPTS = [
  'I spent ₹450 on dinner today at Olive Bistro',
  'Paid ₹3,200 for electricity and water bill',
  'Received ₹85,000 consulting retainer from Studio Artifacts',
  'Bought books and stationery for ₹1,250 on Amazon',
  'Weekly organic groceries for ₹1,850 at Nature Basket',
  'Spent ₹650 on Uber ride to airport',
];

export const NaturalLanguageInput: React.FC<NaturalLanguageInputProps> = ({
  currency,
  categoryBudgets,
  onCommitTransaction,
  onViewOverview,
}) => {
  const [inputText, setInputText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStep, setProcessingStep] = useState<number>(1);
  const [parseResponse, setParseResponse] = useState<ParseTransactionResponse | null>(null);
  const [parseSource, setParseSource] = useState<'live-gemini-server' | 'deterministic-adapter' | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successCommit, setSuccessCommit] = useState<Transaction | null>(null);

  // Editable fields in review card
  const [editAmount, setEditAmount] = useState<number>(0);
  const [editCategory, setEditCategory] = useState<TransactionCategory>('Dining & Food');
  const [editMerchant, setEditMerchant] = useState<string>('');
  const [editDate, setEditDate] = useState<string>('');
  const [editType, setEditType] = useState<TransactionType>('expense');
  const [isEditingInline, setIsEditingInline] = useState<boolean>(false);

  // Animated processing step simulator for multi-stage feedback
  useEffect(() => {
    let t1: NodeJS.Timeout;
    let t2: NodeJS.Timeout;
    if (isProcessing) {
      setProcessingStep(1);
      t1 = setTimeout(() => setProcessingStep(2), 350);
      t2 = setTimeout(() => setProcessingStep(3), 700);
    }
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [isProcessing]);

  const handleParse = async (textToParse?: string) => {
    const text = (textToParse || inputText).trim();
    if (!text) {
      setErrorMessage('Please enter a financial entry (e.g., "I spent ₹450 on dinner today").');
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);
    setSuccessCommit(null);
    setParseResponse(null);

    try {
      const res = await parseTransactionWithAI(text, categoryBudgets);
      if (res.data && res.data.success) {
        setParseResponse(res.data);
        setParseSource(res.source);
        // Initialize editable states
        setEditAmount(res.data.parsedTransaction.amount);
        setEditCategory(res.data.parsedTransaction.category);
        setEditMerchant(res.data.parsedTransaction.merchant);
        setEditDate(res.data.parsedTransaction.date);
        setEditType(res.data.parsedTransaction.type);
        setIsEditingInline(false);
      } else {
        setErrorMessage(
          res.data?.explanation ||
            'Could not extract a valid amount and category. Please verify your phrasing (e.g. "Spent ₹450 on dinner today").',
        );
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Processing error';
      setErrorMessage(`Backend connection issue: ${msg}. A fallback adapter is available.`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleParse();
    }
  };

  const handleCommit = () => {
    if (!parseResponse) return;

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      date: editDate || parseResponse.parsedTransaction.date,
      amount: editAmount || parseResponse.parsedTransaction.amount,
      currency: parseResponse.parsedTransaction.currency || currency,
      category: editCategory || parseResponse.parsedTransaction.category,
      merchant: editMerchant || parseResponse.parsedTransaction.merchant,
      description: parseResponse.rawInput,
      type: editType || parseResponse.parsedTransaction.type,
      status: 'confirmed',
      confidence: parseResponse.parsedTransaction.confidence,
      cashflowImpact: (editType || parseResponse.parsedTransaction.type) === 'income' ? 'positive' : 'negative',
      aiNotes: parseResponse.explanation,
    };

    onCommitTransaction(newTx);
    setSuccessCommit(newTx);
    setParseResponse(null);
    setInputText('');
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Editorial Header */}
      <ScrollReveal delay={0}>
        <div>
          <h2 className="font-editorial text-3xl sm:text-4xl text-[#18181B] tracking-tight">
            Record Spending in Everyday Language
          </h2>
          <p className="mt-1 text-sm text-[#52525B] max-w-2xl">
            State your expenses or earnings as you naturally speak. Living Money interprets the counterparty, allocates the category, and validates the impact against your live monthly budget.
          </p>
        </div>
      </ScrollReveal>

      {/* Prominent Input Box */}
      <ScrollReveal delay={70}>
        <div className="bg-white border border-[#E7E5E4] p-6 sm:p-8 shadow-xs space-y-4">
          <label className="block text-xs font-mono uppercase tracking-wider text-[#71717A]">
            Natural Language Entry
          </label>

        <div className="relative">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. I spent ₹450 on dinner today at Olive Bistro..."
            disabled={isProcessing}
            className="w-full px-4 py-4 pr-32 bg-[#FBFBFA] border border-[#E7E5E4] text-base text-[#18181B] placeholder-[#A1A1AA] focus:border-[#18181B] focus:bg-white transition-all font-sans"
          />

          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <button
              onClick={() => handleParse()}
              disabled={isProcessing || !inputText.trim()}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-[#18181B] text-[#FBFBFA] text-xs font-medium hover:bg-[#27272A] disabled:opacity-40 transition-colors whitespace-nowrap cursor-pointer disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Parsing...</span>
                </>
              ) : (
                <>
                  <span>Parse</span>
                  <CornerDownLeft className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Processing Multi-Stage Status */}
        {isProcessing && (
          <div className="p-4 bg-[#F2F7F4] border border-[#194D39]/30 space-y-2 animate-in fade-in duration-300">
            <div className="flex items-center gap-2 text-xs font-mono text-[#194D39]">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#194D39]" />
              <span className="font-semibold uppercase tracking-wider text-[11px]">Live Advisory Pipeline · Gemini 3.8 Flash</span>
            </div>
            <div className="space-y-1 text-xs text-[#777771] pl-5 font-mono">
              <div className={processingStep >= 1 ? 'text-[#191A18] font-medium' : 'text-[#9E9E97]'}>
                {processingStep >= 1 ? '✓' : '○'} Stage 1: Tokenizing input syntax & currency symbol...
              </div>
              <div className={processingStep >= 2 ? 'text-[#191A18] font-medium' : 'text-[#9E9E97]'}>
                {processingStep >= 2 ? '✓' : '○'} Stage 2: Intent & category extraction via Gemini 3.8 Flash...
              </div>
              <div className={processingStep >= 3 ? 'text-[#191A18] font-medium' : 'text-[#9E9E97]'}>
                {processingStep >= 3 ? '✓' : '○'} Stage 3: Evaluating budget headroom & category delta...
              </div>
            </div>
          </div>
        )}

        {/* Quick Sample Prompts */}
        <div className="pt-3 border-t border-[#E6E4DE]">
          <div className="text-[11px] font-mono text-[#777771] mb-2">
            Verified demonstration statements:
          </div>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_PROMPTS.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setInputText(sample);
                  handleParse(sample);
                }}
                className="text-xs text-[#777771] hover:text-[#191A18] hover:border-[#191A18] hover:shadow-2xs bg-[#FAF9F6] border border-[#E6E4DE] px-3 py-1.5 transition-all text-left font-sans cursor-pointer"
              >
                {sample}
              </button>
            ))}
          </div>
        </div>

        {/* Error State Banner */}
        {errorMessage && (
          <div className="p-4 bg-[#FEF2F2] border border-[#FCA5A5] text-xs text-[#991B1B] flex items-start gap-3">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold">Unable to process financial entry</p>
              <p className="mt-0.5 leading-relaxed">{errorMessage}</p>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-[#991B1B] hover:opacity-75"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
      </ScrollReveal>

      {/* Success Notification */}
      {successCommit && (
        <div className="bg-[#F0FDF4] border border-[#BBF7D0] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#16A34A] shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-mono text-[#15803D] uppercase tracking-wide">
                Transaction Committed to Ledger
              </div>
              <div className="text-sm font-semibold text-[#14532D] mt-0.5">
                {successCommit.type === 'income' ? '+' : '-'}
                {successCommit.currency}
                {successCommit.amount.toLocaleString()} · {successCommit.merchant} ({successCommit.category})
              </div>
              <div className="text-xs text-[#166534] mt-1">
                Your monthly overview calculations and savings rate have been refreshed.
              </div>
            </div>
          </div>
          {onViewOverview && (
            <button
              onClick={onViewOverview}
              className="px-4 py-2 text-xs font-medium text-[#14532D] bg-[#DCFCE7] hover:bg-[#BBF7D0] transition-colors whitespace-nowrap self-start sm:self-auto cursor-pointer"
            >
              View Updated Overview →
            </button>
          )}
        </div>
      )}

      {/* Structured Review & Confirmation Card */}
      {parseResponse && (
        <div className="bg-white border border-[#18181B] p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E7E5E4]">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#71717A]">
                <span>Interpreted Request</span>
                <span>·</span>
                <span className="text-[#1B4332] font-medium">
                  {Math.round((parseResponse.parsedTransaction.confidence || 0.96) * 100)}% Confidence
                </span>
                <span>·</span>
                <span className="text-[#52525B]">
                  {parseSource === 'live-gemini-server' ? 'Gemini 3.8 Flash' : 'Deterministic Adapter'}
                </span>
              </div>
              <h3 className="font-editorial text-2xl text-[#18181B] mt-0.5">
                Review & Confirm Consequential Action
              </h3>
            </div>

            <button
              type="button"
              onClick={() => setIsEditingInline(!isEditingInline)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#52525B] border border-[#E7E5E4] hover:text-[#18181B] hover:border-[#18181B] transition-colors self-start cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>{isEditingInline ? 'Lock Fields' : 'Edit Inline'}</span>
            </button>
          </div>

          {/* Parsed Attributes Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3.5 bg-[#FBFBFA] border border-[#E7E5E4]">
              <span className="text-[11px] font-mono uppercase text-[#71717A]">Amount</span>
              {isEditingInline ? (
                <input
                  type="number"
                  value={editAmount}
                  onChange={(e) => setEditAmount(parseFloat(e.target.value) || 0)}
                  className="w-full mt-1 px-2 py-1 bg-white border border-[#E7E5E4] text-sm font-mono font-semibold"
                />
              ) : (
                <div className="text-xl font-mono font-semibold text-[#18181B] mt-1 tabular-nums">
                  {currency}
                  {editAmount.toLocaleString()}
                </div>
              )}
            </div>

            <div className="p-3.5 bg-[#FBFBFA] border border-[#E7E5E4]">
              <span className="text-[11px] font-mono uppercase text-[#71717A]">Category</span>
              {isEditingInline ? (
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value as TransactionCategory)}
                  className="w-full mt-1 px-2 py-1 bg-white border border-[#E7E5E4] text-xs font-sans"
                >
                  {categoryBudgets.map((b) => (
                    <option key={b.category} value={b.category}>
                      {b.category}
                    </option>
                  ))}
                  <option value="Income & Consulting">Income & Consulting</option>
                  <option value="Investments & Savings">Investments & Savings</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                <div className="text-sm font-medium text-[#18181B] mt-1.5 truncate">
                  {editCategory}
                </div>
              )}
            </div>

            <div className="p-3.5 bg-[#FBFBFA] border border-[#E7E5E4]">
              <span className="text-[11px] font-mono uppercase text-[#71717A]">Merchant / Counterparty</span>
              {isEditingInline ? (
                <input
                  type="text"
                  value={editMerchant}
                  onChange={(e) => setEditMerchant(e.target.value)}
                  className="w-full mt-1 px-2 py-1 bg-white border border-[#E7E5E4] text-xs font-sans"
                />
              ) : (
                <div className="text-sm font-medium text-[#18181B] mt-1.5 truncate">
                  {editMerchant}
                </div>
              )}
            </div>

            <div className="p-3.5 bg-[#FBFBFA] border border-[#E7E5E4]">
              <span className="text-[11px] font-mono uppercase text-[#71717A]">Effective Date</span>
              {isEditingInline ? (
                <input
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  className="w-full mt-1 px-2 py-1 bg-white border border-[#E7E5E4] text-xs font-mono"
                />
              ) : (
                <div className="text-sm font-mono text-[#18181B] mt-1.5">
                  {editDate}
                </div>
              )}
            </div>
          </div>

          {/* Budget & Cashflow Assessment Box */}
          <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#1B4332]" />
              <span className="text-xs font-mono font-medium uppercase tracking-wider text-[#334155]">
                Budget Headroom & Cashflow Analysis
              </span>
            </div>

            <p className="text-xs text-[#475569] leading-relaxed">
              {parseResponse.parsedTransaction.suggestedAction}
            </p>

            {parseResponse.budgetContext && (
              <div className="space-y-1.5 pt-2 border-t border-[#E2E8F0]">
                <div className="flex items-center justify-between text-xs font-mono text-[#64748B]">
                  <span>
                    Current {editCategory}: {currency}
                    {parseResponse.budgetContext.currentSpent.toLocaleString()}
                  </span>
                  <span className={parseResponse.budgetContext.willExceedBudget ? 'text-[#DC2626] font-semibold' : 'text-[#16A34A]'}>
                    Projected: {currency}
                    {parseResponse.budgetContext.projectedSpent.toLocaleString()} (Limit: {currency}
                    {parseResponse.budgetContext.budgetLimit.toLocaleString()})
                  </span>
                </div>

                {/* Progress bar comparison */}
                <div className="w-full h-1.5 bg-[#E2E8F0] overflow-hidden">
                  <div
                    className={`h-full ${
                      parseResponse.budgetContext.willExceedBudget ? 'bg-[#DC2626]' : 'bg-[#18181B]'
                    }`}
                    style={{
                      width: `${Math.min(
                        100,
                        Math.round(
                          (parseResponse.budgetContext.projectedSpent /
                            parseResponse.budgetContext.budgetLimit) *
                            100,
                        ),
                      )}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Action Confirmation Bar */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E7E5E4]">
            <button
              type="button"
              onClick={() => setParseResponse(null)}
              className="px-4 py-2 text-xs font-medium text-[#71717A] hover:text-[#18181B] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCommit}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#1B4332] hover:bg-[#143225] text-[#FBFBFA] text-xs font-medium shadow-xs transition-colors cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Confirm & Commit to Ledger</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
