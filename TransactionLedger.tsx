/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Upload,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  FileText,
  Plus,
  Trash2,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  X,
} from 'lucide-react';
import { Transaction, TransactionCategory, TransactionType } from '../types/finance';
import { ScrollReveal } from './ScrollReveal';

interface TransactionLedgerProps {
  transactions: Transaction[];
  currency: string;
  onAddTransaction: (tx: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
  onOpenNaturalInput: () => void;
}

interface ImportRow {
  date: string;
  merchant: string;
  amount: number;
  category: TransactionCategory;
  type: TransactionType;
  isValid: boolean;
  error?: string;
}

const SAMPLE_CSV_ROWS: ImportRow[] = [
  {
    date: '2026-10-31',
    merchant: 'Organic Harvest Market',
    amount: 1420,
    category: 'Groceries',
    type: 'expense',
    isValid: true,
  },
  {
    date: '2026-10-30',
    merchant: 'Fuel & Mobility Corp',
    amount: 2200,
    category: 'Transportation',
    type: 'expense',
    isValid: true,
  },
  {
    date: '2026-10-29',
    merchant: 'City Water & Power Board',
    amount: 850,
    category: 'Utilities & Bills',
    type: 'expense',
    isValid: true,
  },
  {
    date: '2026-10-28',
    merchant: 'Substack & Tech Publications',
    amount: 450,
    category: 'Entertainment',
    type: 'expense',
    isValid: true,
  },
  {
    date: '2026-10-27',
    merchant: 'Freelance Design Advisory Sprint',
    amount: 25000,
    category: 'Income & Consulting',
    type: 'income',
    isValid: true,
  },
];

export const TransactionLedger: React.FC<TransactionLedgerProps> = ({
  transactions,
  currency,
  onAddTransaction,
  onDeleteTransaction,
  onOpenNaturalInput,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'expense' | 'income'>('all');

  // Import drawer state
  const [isImportOpen, setIsImportOpen] = useState<boolean>(false);
  const [importRows, setImportRows] = useState<ImportRow[]>([]);
  const [importFileName, setImportFileName] = useState<string>('');

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'all' || tx.category === categoryFilter;
    const matchesType = typeFilter === 'all' || tx.type === typeFilter;
    return matchesSearch && matchesCat && matchesType;
  });

  const handlePreloadSampleCsv = () => {
    setImportRows(SAMPLE_CSV_ROWS);
    setImportFileName('bank_statement_oct2026.csv');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      const lines = text.split('\n').filter((l) => l.trim().length > 0);
      const parsed: ImportRow[] = [];

      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',').map((p) => p.trim());
        if (parts.length >= 3) {
          const date = parts[0] || new Date().toISOString().split('T')[0];
          const merchant = parts[1] || 'Imported Transaction';
          const amount = parseFloat(parts[2]) || 0;
          const category = (parts[3] as TransactionCategory) || 'Other';
          const type = (parts[4]?.toLowerCase() === 'income' ? 'income' : 'expense') as TransactionType;
          const isValid = amount > 0 && !isNaN(amount);

          parsed.push({
            date,
            merchant,
            amount,
            category,
            type,
            isValid,
            error: isValid ? undefined : 'Invalid numeric amount',
          });
        }
      }

      setImportRows(parsed.length > 0 ? parsed : SAMPLE_CSV_ROWS);
    };
    reader.readAsText(file);
  };

  const handleCommitImport = () => {
    const validRows = importRows.filter((r) => r.isValid);
    validRows.forEach((row, idx) => {
      onAddTransaction({
        id: `tx-imp-${Date.now()}-${idx}`,
        date: row.date,
        amount: row.amount,
        currency,
        category: row.category,
        merchant: row.merchant,
        description: `Imported via ${importFileName || 'CSV Statement'}`,
        type: row.type,
        status: 'confirmed',
        confidence: 0.99,
        cashflowImpact: row.type === 'income' ? 'positive' : 'negative',
      });
    });

    setIsImportOpen(false);
    setImportRows([]);
    setImportFileName('');
  };

  return (
    <div className="space-y-10">
      {/* 1. Header & Actions Toolbar */}
      <ScrollReveal delay={0}>
        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 pb-6 border-b border-[#E6E4DE]">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#777771] mb-2">
              <span>Audit Journal</span>
              <span>·</span>
              <span>{transactions.length} Verified Entries</span>
              <span>·</span>
              <span className="text-[#194D39] font-medium">Reconciled Cashflow</span>
            </div>
            <h1 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-[#191A18] tracking-tight font-normal">
              Transaction Ledger & Statements
            </h1>
            <p className="mt-1 text-sm text-[#777771] max-w-2xl">
              A comprehensive record of all financial movements. Filter, search, and audit transaction items or import historical statements directly.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsImportOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-[#191A18] bg-white border border-[#E6E4DE] hover:border-[#191A18] transition-colors cursor-pointer shadow-2xs"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Import Statement</span>
            </button>
            <button
              type="button"
              onClick={onOpenNaturalInput}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-[#FAF9F6] bg-[#194D39] hover:bg-[#143D2D] transition-colors cursor-pointer shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record Entry</span>
            </button>
          </div>
        </div>
      </ScrollReveal>

      {/* 2. Filter & Search Controls */}
      <ScrollReveal delay={70}>
        <div className="bg-white border border-[#E6E4DE] p-4 sm:p-5 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-3.5 h-3.5 text-[#777771] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search merchant, description, category..."
            className="w-full pl-9 pr-3.5 py-2 text-xs bg-[#FAF9F6] border border-[#E6E4DE] focus:border-[#194D39] text-[#191A18] font-sans"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto text-xs">
          {/* Segmented Type Filter */}
          <div className="flex items-center bg-[#F4F2EC] p-0.5 border border-[#E6E4DE]">
            {(
              [
                ['all', 'All Entries'],
                ['expense', 'Outflows'],
                ['income', 'Inflow'],
              ] as const
            ).map(([t, label]) => (
              <button
                key={t}
                type="button"
                onClick={() => setTypeFilter(t)}
                className={`px-3 py-1 font-mono transition-colors cursor-pointer ${
                  typeFilter === t
                    ? 'bg-white text-[#191A18] shadow-2xs font-semibold'
                    : 'text-[#777771] hover:text-[#191A18]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-[#FAF9F6] border border-[#E6E4DE] text-xs text-[#191A18] cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="Dining & Food">Dining & Food</option>
            <option value="Groceries">Groceries</option>
            <option value="Housing & Rent">Housing & Rent</option>
            <option value="Transportation">Transportation</option>
            <option value="Utilities & Bills">Utilities & Bills</option>
            <option value="Shopping & Goods">Shopping & Goods</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Income & Consulting">Income & Consulting</option>
          </select>
        </div>
      </div>
      </ScrollReveal>

      {/* 3. Transaction Presentation: Desktop Table & Mobile Card Rows */}
      <ScrollReveal delay={130}>
        <div className="bg-white border border-[#E6E4DE] shadow-2xs overflow-hidden">
        {/* Desktop Table View (Hidden on mobile) */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E6E4DE] bg-[#FAF9F6] text-[#777771] font-mono uppercase text-[11px]">
                <th className="py-3 px-5">Date</th>
                <th className="py-3 px-5">Merchant / Counterparty</th>
                <th className="py-3 px-5">Category</th>
                <th className="py-3 px-5">Description</th>
                <th className="py-3 px-5 text-right">Amount</th>
                <th className="py-3 px-5 text-center">Confidence</th>
                <th className="py-3 pr-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4F2EC]">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#777771]">
                    No transactions found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-[#FAF9F6] transition-colors">
                    <td className="py-3.5 px-5 font-mono text-[#777771] whitespace-nowrap">
                      {tx.date}
                    </td>
                    <td className="py-3.5 px-5 font-semibold text-[#191A18] whitespace-nowrap">
                      {tx.merchant}
                    </td>
                    <td className="py-3.5 px-5 text-[#777771] whitespace-nowrap">
                      {tx.category}
                    </td>
                    <td className="py-3.5 px-5 text-[#777771] max-w-xs truncate">
                      {tx.description}
                    </td>
                    <td
                      className={`py-3.5 px-5 text-right font-mono font-semibold tabular-nums whitespace-nowrap ${
                        tx.type === 'income' ? 'text-[#27B889]' : 'text-[#191A18]'
                      }`}
                    >
                      {tx.type === 'income' ? '+' : '-'}
                      {currency}
                      {tx.amount.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-5 text-center font-mono text-[11px] text-[#777771]">
                      {Math.round((tx.confidence || 0.98) * 100)}%
                    </td>
                    <td className="py-3.5 pr-5 text-right">
                      <button
                        type="button"
                        onClick={() => onDeleteTransaction(tx.id)}
                        className="text-[#9E9E97] hover:text-[#B91C1C] transition-colors p-1 cursor-pointer"
                        title="Remove transaction"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile-Friendly Transaction List (Zero horizontal scrolling on phones) */}
        <div className="sm:hidden divide-y divide-[#E6E4DE]">
          {filteredTransactions.length === 0 ? (
            <div className="py-10 text-center text-xs text-[#777771]">
              No transactions match your search.
            </div>
          ) : (
            filteredTransactions.map((tx) => (
              <div key={tx.id} className="p-4 space-y-2 hover:bg-[#FAF9F6] transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="font-semibold text-sm text-[#191A18] block leading-tight">
                      {tx.merchant}
                    </span>
                    <span className="text-[11px] text-[#777771] block mt-0.5">
                      {tx.category} · {tx.date}
                    </span>
                  </div>

                  <div className="text-right">
                    <span
                      className={`font-mono font-semibold text-sm block tabular-nums ${
                        tx.type === 'income' ? 'text-[#27B889]' : 'text-[#191A18]'
                      }`}
                    >
                      {tx.type === 'income' ? '+' : '-'}
                      {currency}
                      {tx.amount.toLocaleString()}
                    </span>
                    <button
                      type="button"
                      onClick={() => onDeleteTransaction(tx.id)}
                      className="text-[11px] text-[#B91C1C] hover:underline mt-1 inline-block"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {tx.description && tx.description !== tx.merchant && (
                  <p className="text-xs text-[#777771] pt-1 truncate">
                    {tx.description}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
      </ScrollReveal>

      {/* 4. Statement Batch Importer Modal */}
      {isImportOpen && (
        <div className="fixed inset-0 z-50 bg-[#191A18]/40 flex items-center justify-center p-4">
          <div className="bg-white border border-[#E6E4DE] max-w-2xl w-full p-6 sm:p-8 shadow-xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#E6E4DE]">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#777771]">
                  Financial Ingestion
                </span>
                <h3 className="font-editorial text-2xl text-[#191A18] font-normal mt-0.5">
                  Import Statement & Batch Ledger
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsImportOpen(false)}
                className="text-xs font-mono text-[#777771] hover:text-[#191A18] cursor-pointer p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Ingestion Dropzone */}
            <div className="space-y-3">
              <div className="border border-dashed border-[#D8D6CE] p-6 text-center space-y-2 bg-[#FAF9F6]">
                <FileText className="w-6 h-6 text-[#777771] mx-auto" />
                <div className="text-xs text-[#191A18] font-medium">
                  Select a CSV bank statement or preload sample ledger
                </div>
                <p className="text-[11px] text-[#777771]">
                  Supported headers: Date, Merchant, Amount, Category, Type
                </p>
                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  <label className="px-3.5 py-1.5 text-xs font-medium text-[#191A18] bg-white border border-[#E6E4DE] hover:border-[#191A18] cursor-pointer transition-colors shadow-2xs">
                    <span>Select CSV File</span>
                    <input
                      type="file"
                      accept=".csv,.txt"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={handlePreloadSampleCsv}
                    className="px-3.5 py-1.5 text-xs font-mono text-[#194D39] bg-[#F4F2EC] border border-[#E6E4DE] hover:border-[#194D39] transition-colors cursor-pointer"
                  >
                    Load Sample Statement (5 records)
                  </button>
                </div>
              </div>
            </div>

            {/* Parsed Preview Table */}
            {importRows.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-[#777771]">
                  <span>
                    Previewing {importRows.length} entries from {importFileName || 'Statement'}
                  </span>
                  <span className="text-[#194D39] font-medium">
                    {importRows.filter((r) => r.isValid).length} Valid Entries
                  </span>
                </div>

                <div className="border border-[#E6E4DE] max-h-48 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-[#FAF9F6] border-b border-[#E6E4DE] font-mono text-[10px] text-[#777771]">
                        <th className="py-2 px-3">Date</th>
                        <th className="py-2 px-3">Merchant</th>
                        <th className="py-2 px-3">Category</th>
                        <th className="py-2 px-3 text-right">Amount</th>
                        <th className="py-2 px-3 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F4F2EC]">
                      {importRows.map((row, idx) => (
                        <tr key={idx}>
                          <td className="py-2 px-3 font-mono text-[#777771]">{row.date}</td>
                          <td className="py-2 px-3 font-medium text-[#191A18]">{row.merchant}</td>
                          <td className="py-2 px-3 text-[#777771]">{row.category}</td>
                          <td className="py-2 px-3 text-right font-mono font-medium">
                            {currency}{row.amount.toLocaleString()}
                          </td>
                          <td className="py-2 px-3 text-center">
                            {row.isValid ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#194D39] inline" />
                            ) : (
                              <AlertCircle className="w-3.5 h-3.5 text-[#B91C1C] inline" />
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E6E4DE]">
              <button
                type="button"
                onClick={() => setIsImportOpen(false)}
                className="px-4 py-2 text-xs font-medium text-[#777771] hover:text-[#191A18] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCommitImport}
                disabled={importRows.filter((r) => r.isValid).length === 0}
                className="px-5 py-2 text-xs font-medium text-[#FAF9F6] bg-[#194D39] hover:bg-[#143D2D] disabled:opacity-40 transition-colors cursor-pointer shadow-2xs"
              >
                Commit {importRows.filter((r) => r.isValid).length} Transactions to Ledger
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
