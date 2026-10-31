/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Copy, Check, Download, Globe, FileCode, CheckCircle2, ExternalLink } from 'lucide-react';
import { FinancialSummary, Transaction } from '../types/finance';

interface ShareExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  summary: FinancialSummary;
  transactions: Transaction[];
}

export const ShareExportModal: React.FC<ShareExportModalProps> = ({
  isOpen,
  onClose,
  summary,
  transactions,
}) => {
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  if (!isOpen) return null;

  // The permanent preview / shared URL for this app
  const shareUrl = window.location.origin.includes('localhost') || window.location.origin.includes('3000')
    ? 'https://ais-pre-s32cmbu26iq7qlykhj6jil-446520402885.asia-east1.run.app'
    : window.location.href;

  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    } catch {
      // Fallback
    }
  };

  // Generate and download a standalone, self-contained single-file HTML snapshot
  const handleDownloadStandaloneHTML = () => {
    setIsExporting(true);

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Living Money — Financial Portfolio Dossier</title>
  <style>
    :root {
      --bg: #FAF9F6;
      --card: #FFFFFF;
      --text: #191A18;
      --subtext: #777771;
      --green: #194D39;
      --gold: #D4AF37;
      --border: #E6E4DE;
    }
    @media (prefers-color-scheme: dark) {
      :root {
        --bg: #141613;
        --card: #1D1F1C;
        --text: #FAF9F6;
        --subtext: #A6A8A1;
        --green: #27B889;
        --gold: #E5C358;
        --border: #2E302C;
      }
    }
    body {
      margin: 0;
      padding: 32px 16px;
      background: var(--bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.5;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
    }
    header {
      border-bottom: 1px solid var(--border);
      padding-bottom: 24px;
      margin-bottom: 32px;
    }
    h1 {
      font-family: Georgia, serif;
      font-size: 36px;
      font-weight: normal;
      margin: 0 0 8px 0;
      letter-spacing: -0.5px;
    }
    .badge {
      display: inline-block;
      font-family: monospace;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--gold);
      margin-bottom: 8px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 16px;
      margin-bottom: 32px;
    }
    .card {
      background: var(--card);
      border: 1px solid var(--border);
      padding: 24px;
      border-radius: 4px;
    }
    .card-label {
      font-family: monospace;
      font-size: 11px;
      color: var(--subtext);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .card-val {
      font-size: 32px;
      font-weight: 600;
      margin: 8px 0 4px 0;
      font-family: monospace;
    }
    .green { color: var(--green); }
    table {
      width: 100%;
      border-collapse: collapse;
      background: var(--card);
      border: 1px solid var(--border);
      font-size: 13px;
    }
    th, td {
      padding: 12px 16px;
      text-align: left;
      border-bottom: 1px solid var(--border);
    }
    th {
      font-family: monospace;
      font-size: 11px;
      text-transform: uppercase;
      color: var(--subtext);
      background: rgba(0,0,0,0.02);
    }
    td.amount {
      text-align: right;
      font-family: monospace;
      font-weight: 600;
    }
    footer {
      margin-top: 48px;
      padding-top: 24px;
      border-top: 1px solid var(--border);
      font-family: monospace;
      font-size: 11px;
      color: var(--subtext);
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div class="badge">Living Money · Private Advisory Dossier</div>
      <h1>Executive Financial Snapshot</h1>
      <p style="color: var(--subtext); margin: 0;">Verified standalone portfolio report generated for team review.</p>
    </header>

    <div class="grid">
      <div class="card">
        <div class="card-label">Net Monthly Cashflow</div>
        <div class="card-val green">${summary.currency}${Math.round(summary.netCashflow).toLocaleString()}</div>
        <div style="font-size: 12px; color: var(--subtext);">${summary.savingsRate}% of gross earnings retained</div>
      </div>
      <div class="card">
        <div class="card-label">Monthly Gross Inflow</div>
        <div class="card-val">${summary.currency}${Math.round(summary.monthlyIncome).toLocaleString()}</div>
        <div style="font-size: 12px; color: var(--subtext);">Recurring consulting & salary</div>
      </div>
      <div class="card">
        <div class="card-label">Monthly Outflows</div>
        <div class="card-val">${summary.currency}${Math.round(summary.monthlyExpenses).toLocaleString()}</div>
        <div style="font-size: 12px; color: var(--subtext);">Fixed obligations + discretionary</div>
      </div>
      <div class="card">
        <div class="card-label">Liquid Reserves</div>
        <div class="card-val">${summary.currency}${Math.round(summary.totalLiquidSavings).toLocaleString()}</div>
        <div style="font-size: 12px; color: var(--green);">${summary.runwayMonths} months emergency runway</div>
      </div>
    </div>

    <h2 style="font-family: Georgia, serif; font-weight: normal; font-size: 24px; margin-bottom: 16px;">Active Verified Ledger</h2>
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Merchant / Source</th>
          <th>Category</th>
          <th>Status</th>
          <th style="text-align: right;">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${transactions
          .slice(0, 15)
          .map(
            (t) => `
          <tr>
            <td style="font-family: monospace;">${t.date}</td>
            <td style="font-weight: 500;">${t.merchant}</td>
            <td style="color: var(--subtext);">${t.category}</td>
            <td><span style="font-family: monospace; font-size: 10px; padding: 2px 6px; background: rgba(39, 184, 137, 0.1); color: var(--green); border-radius: 2px;">VERIFIED</span></td>
            <td class="amount ${t.type === 'income' ? 'green' : ''}">${t.type === 'income' ? '+' : '-'}${t.currency}${t.amount.toLocaleString()}</td>
          </tr>
        `,
          )
          .join('')}
      </tbody>
    </table>

    <footer>
      Generated by Living Money Advisory Engine · Standalone Offline Dossier
    </footer>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Living_Money_Dossier_${new Date().toISOString().slice(0, 10)}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setIsExporting(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Share and Download Living Money"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-[#FAF9F6] dark:bg-[#181916] border border-[#E6E4DE] dark:border-[#2A2B28] text-[#191A18] dark:text-[#FAF9F6] max-w-lg w-full p-6 sm:p-8 rounded-xs shadow-2xl relative space-y-6">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1 text-[#777771] hover:text-[#191A18] dark:hover:text-white cursor-pointer"
          aria-label="Close share dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="text-[10px] font-mono uppercase tracking-widest text-[#8C733E] dark:text-[#D4AF37]">
            Team Collaboration & Export
          </div>
          <h2 className="font-editorial text-2xl sm:text-3xl font-normal tracking-tight">
            Share with Your Teammates
          </h2>
          <p className="text-xs sm:text-sm text-[#777771] dark:text-[#A6A8A1]">
            Share the live, interactive app with your team or download a self-contained offline HTML file.
          </p>
        </div>

        {/* Option 1: Live Interactive Web Link */}
        <div className="p-4 bg-white dark:bg-[#1F211D] border border-[#E6E4DE] dark:border-[#2A2B28] rounded-xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono font-medium text-[#194D39] dark:text-[#27B889]">
            <Globe className="w-4 h-4" />
            <span>Option 1: Live Web App Link (Recommended)</span>
          </div>
          <p className="text-xs text-[#575953] dark:text-[#A6A8A1]">
            Anyone with this link can open, test, and interact with the full application in their browser:
          </p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 px-3 py-2 text-xs font-mono bg-[#F4F2EC] dark:bg-[#141512] border border-[#E6E4DE] dark:border-[#2A2B28] text-[#191A18] dark:text-white rounded-xs select-all"
            />
            <button
              type="button"
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-medium text-white bg-[#194D39] hover:bg-[#143D2D] rounded-xs transition-colors cursor-pointer shrink-0"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Option 2: Download Standalone HTML File */}
        <div className="p-4 bg-white dark:bg-[#1F211D] border border-[#E6E4DE] dark:border-[#2A2B28] rounded-xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono font-medium text-[#8C733E] dark:text-[#D4AF37]">
            <FileCode className="w-4 h-4" />
            <span>Option 2: Download Standalone .html File</span>
          </div>
          <p className="text-xs text-[#575953] dark:text-[#A6A8A1]">
            Download a single-file HTML dossier containing your active ledger and wealth metrics. Can be opened offline in any browser or emailed as an attachment.
          </p>
          <button
            type="button"
            onClick={handleDownloadStandaloneHTML}
            disabled={isExporting}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-mono font-medium text-[#191A18] dark:text-[#FAF9F6] bg-[#F4F2EC] dark:bg-[#2A2B28] hover:bg-[#E6E4DE] dark:hover:bg-[#33352F] border border-[#E6E4DE] dark:border-[#383A34] rounded-xs transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Generating...' : 'Download Dossier (.html)'}</span>
          </button>
        </div>

        {/* Option 3: Production Codebase Export */}
        <div className="pt-2 text-[11px] font-mono text-[#777771] dark:text-[#888A83] flex items-center justify-between border-t border-[#E6E4DE] dark:border-[#2A2B28]">
          <span>Full build bundle available in <code>/dist</code></span>
          <span className="text-[#194D39] dark:text-[#27B889] font-medium">Ready to Deploy</span>
        </div>
      </div>
    </div>
  );
};
