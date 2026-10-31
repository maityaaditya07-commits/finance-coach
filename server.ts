/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json());

// Initialize Gemini API client if key is configured
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    aiClient = new GoogleGenAI({});
  } catch (err) {
    console.warn('Gemini API initialization warning:', err);
  }
}

// In-memory state for initial demo ledger
let currentTransactions = [
  {
    id: 'tx-001',
    date: '2026-10-30',
    amount: 450,
    currency: '₹',
    category: 'Dining & Food',
    merchant: 'The Olive Bistro',
    description: 'Dinner with design colleagues',
    type: 'expense',
    status: 'confirmed',
    confidence: 0.98,
    cashflowImpact: 'negative',
  },
  {
    id: 'tx-002',
    date: '2026-10-29',
    amount: 1850,
    currency: '₹',
    category: 'Groceries',
    merchant: 'Nature Basket Organic',
    description: 'Weekly organic produce & pantry staples',
    type: 'expense',
    status: 'confirmed',
    confidence: 0.99,
    cashflowImpact: 'negative',
  },
  {
    id: 'tx-003',
    date: '2026-10-28',
    amount: 3200,
    currency: '₹',
    category: 'Utilities & Bills',
    merchant: 'State Electricity Board',
    description: 'Monthly electricity & climate control',
    type: 'expense',
    status: 'confirmed',
    confidence: 1.0,
    cashflowImpact: 'negative',
  },
  {
    id: 'tx-004',
    date: '2026-10-27',
    amount: 850,
    currency: '₹',
    category: 'Transportation',
    merchant: 'Uber Mobility',
    description: 'Commute to client studio meeting',
    type: 'expense',
    status: 'confirmed',
    confidence: 0.95,
    cashflowImpact: 'negative',
  },
  {
    id: 'tx-005',
    date: '2026-10-25',
    amount: 120000,
    currency: '₹',
    category: 'Income & Consulting',
    merchant: 'Studio Artifacts Ltd',
    description: 'Monthly retainer for product engineering lead',
    type: 'income',
    status: 'confirmed',
    confidence: 1.0,
    cashflowImpact: 'positive',
  },
];

// POST /api/parse-transaction: Parse natural language using Gemini or deterministic NLP
app.post('/api/parse-transaction', async (req: Request, res: Response) => {
  const { input, currentBudgets } = req.body;
  const text = (input || '').trim();

  if (!text) {
    return res.status(400).json({ success: false, error: 'Empty transaction input' });
  }

  // If Gemini API is available, query Gemini model
  if (aiClient) {
    try {
      const prompt = `You are the backend financial parser for "Living Money".
Parse the following natural language spending or income entry: "${text}"

Respond with ONLY valid JSON with this exact structure:
{
  "amount": number,
  "currency": "₹" or "$" or "€" or "£",
  "category": "Housing & Rent" | "Dining & Food" | "Groceries" | "Transportation" | "Utilities & Bills" | "Shopping & Goods" | "Health & Wellness" | "Entertainment" | "Education" | "Income & Consulting" | "Investments & Savings" | "Other",
  "merchant": string,
  "description": string,
  "type": "expense" | "income",
  "date": "YYYY-MM-DD",
  "confidence": number between 0.8 and 1.0,
  "explanation": string
}`;

      const aiResponse = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const textOutput = aiResponse.text?.trim() || '';
      // Extract json from markdown block if present
      const jsonMatch = textOutput.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsedData = JSON.parse(jsonMatch[0]);
        const cat = parsedData.category || 'Dining & Food';
        const targetBudget = (currentBudgets || []).find((b: any) => b.category === cat) || {
          category: cat,
          spent: 18450,
          budget: 16000,
        };
        const willExceed = targetBudget.spent + parsedData.amount > targetBudget.budget;

        return res.json({
          success: true,
          rawInput: text,
          parsedTransaction: {
            ...parsedData,
            suggestedAction: willExceed
              ? `Note: Adding this ${parsedData.currency}${parsedData.amount} pushes ${cat} beyond monthly limit.`
              : `Verified: ${parsedData.currency}${parsedData.amount} fits within ${cat} budget.`,
          },
          budgetContext: {
            category: cat,
            currentSpent: targetBudget.spent,
            budgetLimit: targetBudget.budget,
            projectedSpent: targetBudget.spent + parsedData.amount,
            willExceedBudget: willExceed,
          },
          explanation: parsedData.explanation || `Interpreted ${parsedData.type} for ${parsedData.merchant}.`,
        });
      }
    } catch (aiErr) {
      console.warn('Gemini parser fallback to deterministic engine:', aiErr);
    }
  }

  // Deterministic Server Fallback
  let currency = '₹';
  if (text.includes('$')) currency = '$';
  else if (text.includes('€')) currency = '€';
  else if (text.includes('£')) currency = '£';

  const amountMatch = text.match(/(?:[₹$€£]\s*|rs\.?\s*|inr\s*)?([0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]+)?|[0-9]+(?:\.[0-9]+)?)/i);
  const amount = amountMatch && amountMatch[1] ? parseFloat(amountMatch[1].replace(/,/g, '')) : 450;
  const isIncome = /received|salary|income|client paid|bonus|dividend/i.test(text);

  let category = isIncome ? 'Income & Consulting' : 'Dining & Food';
  if (/grocery|supermarket|vegetable|produce/i.test(text)) category = 'Groceries';
  else if (/uber|lyft|cab|taxi|metro|fuel|petrol/i.test(text)) category = 'Transportation';
  else if (/electricity|power|water|wifi|bill|phone/i.test(text)) category = 'Utilities & Bills';
  else if (/rent|apartment|lease/i.test(text)) category = 'Housing & Rent';
  else if (/shopping|clothes|book|amazon|shoes/i.test(text)) category = 'Shopping & Goods';

  let merchant = 'Merchant Direct';
  if (category === 'Dining & Food') merchant = 'The Bistro';
  else if (category === 'Groceries') merchant = 'Nature Basket';
  else if (category === 'Transportation') merchant = 'Uber Mobility';

  return res.json({
    success: true,
    rawInput: text,
    parsedTransaction: {
      amount,
      currency,
      category,
      merchant,
      description: text,
      type: isIncome ? 'income' : 'expense',
      date: new Date().toISOString().split('T')[0],
      confidence: 0.96,
      suggestedAction: `Transaction verified: ${currency}${amount} allocated to ${category}.`,
    },
    budgetContext: {
      category,
      currentSpent: 18450,
      budgetLimit: 16000,
      projectedSpent: 18450 + amount,
      willExceedBudget: true,
    },
    explanation: `Identified ${isIncome ? 'income' : 'expense'} of ${currency}${amount} under ${category}.`,
  });
});

// POST /api/simulate: Compute What-If Scenario
app.post('/api/simulate', (req: Request, res: Response) => {
  const { input, baselineExpenses, baselineIncome, categoryBudgets } = req.body;
  const diningBudget = categoryBudgets?.find((b: any) => b.category === 'Dining & Food')?.spent || 18450;
  const shoppingBudget = categoryBudgets?.find((b: any) => b.category === 'Shopping & Goods')?.spent || 9600;
  const entertainmentBudget = categoryBudgets?.find((b: any) => b.category === 'Entertainment')?.spent || 5800;

  const diningSaved = diningBudget * ((input?.diningReductionPct || 0) / 100);
  const shoppingSaved = shoppingBudget * ((input?.shoppingReductionPct || 0) / 100);
  const entSaved = entertainmentBudget * ((input?.entertainmentReductionPct || 0) / 100);

  const monthlySavingsDelta = Math.round(diningSaved + shoppingSaved + entSaved + (input?.monthlySavingsBoost || 0));
  const scenarioExpenses = Math.max(0, (baselineExpenses || 99350) - monthlySavingsDelta);
  const annualizedSavings = monthlySavingsDelta * 12;

  const monthlyRate = 0.08 / 12;
  const months = 60;
  const fiveYearCompoundedSavings = Math.round(
    monthlySavingsDelta * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate),
  );

  const baselineSurplus = Math.max(1, (baselineIncome || 120000) - (baselineExpenses || 99350));
  const scenarioSurplus = (baselineIncome || 120000) - scenarioExpenses;
  const targetGap = 351100;
  const baselineMonths = targetGap / baselineSurplus;
  const scenarioMonths = targetGap / scenarioSurplus;
  const emergencyFundAccelerationMonths = Math.max(0, Math.round((baselineMonths - scenarioMonths) * 10) / 10);

  const baselineSavingsRate = Math.round((((baselineIncome || 120000) - (baselineExpenses || 99350)) / (baselineIncome || 120000)) * 1000) / 10;
  const scenarioSavingsRate = Math.round((((baselineIncome || 120000) - scenarioExpenses) / (baselineIncome || 120000)) * 1000) / 10;

  return res.json({
    baselineExpenses: baselineExpenses || 99350,
    scenarioExpenses,
    monthlySavingsDelta,
    annualizedSavings,
    fiveYearCompoundedSavings,
    emergencyFundAccelerationMonths,
    baselineSavingsRate,
    scenarioSavingsRate,
    summaryText: `By tuning discretionary reductions, you generate an annual surplus of ₹${annualizedSavings.toLocaleString()}, accelerating runway completion by ${emergencyFundAccelerationMonths} months.`,
  });
});

// GET /api/transactions
app.get('/api/transactions', (_req: Request, res: Response) => {
  res.json({ transactions: currentTransactions });
});

// Boot Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Living Money server active on http://0.0.0.0:${PORT}`);
  });
}

startServer();
