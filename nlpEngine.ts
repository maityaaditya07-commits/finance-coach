/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ParseTransactionResponse,
  TransactionCategory,
  TransactionType,
} from '../types/finance';

const CATEGORY_KEYWORDS: Record<TransactionCategory, string[]> = {
  'Dining & Food': [
    'dinner', 'lunch', 'breakfast', 'brunch', 'food', 'restaurant', 'cafe',
    'bistro', 'coffee', 'starbucks', 'mcdonalds', 'pizza', 'burger', 'swiggy',
    'zomato', 'eat', 'meal', 'drinks', 'bar', 'pub', 'sushi', 'bakery', 'tea',
  ],
  Groceries: [
    'grocery', 'groceries', 'supermarket', 'mart', 'nature basket', 'whole foods',
    'trader joe', 'vegetables', 'fruits', 'milk', 'bread', 'provisions', 'pantry',
    'blinkit', 'zepto', 'instacart', 'costco',
  ],
  'Housing & Rent': [
    'rent', 'mortgage', 'maintenance', 'apartment', 'landlord', 'housing',
    'property tax', 'hoa', 'lease',
  ],
  Transportation: [
    'uber', 'lyft', 'ola', 'taxi', 'cab', 'metro', 'subway', 'bus', 'train',
    'fuel', 'petrol', 'gas', 'diesel', 'parking', 'toll', 'flight', 'airline',
  ],
  'Utilities & Bills': [
    'electricity', 'power', 'water', 'gas bill', 'wifi', 'internet', 'broadband',
    'phone', 'mobile bill', 'airtel', 'jio', 'verizon', 'utility', 'utilities',
  ],
  'Shopping & Goods': [
    'shopping', 'clothes', 'shoes', 'amazon', 'flipkart', 'apple', 'store',
    'electronics', 'books', 'stationery', 'furniture', 'apparel', 'gear',
  ],
  'Health & Wellness': [
    'doctor', 'hospital', 'clinic', 'medicine', 'pharmacy', 'dentist', 'gym',
    'fitness', 'therapy', 'health', 'supplements', 'yoga',
  ],
  Entertainment: [
    'movie', 'cinema', 'theatre', 'concert', 'netflix', 'spotify', 'prime',
    'criterion', 'steam', 'game', 'gaming', 'show', 'museum', 'exhibition',
  ],
  Education: [
    'course', 'tuition', 'books', 'seminar', 'workshop', 'masterclass', 'school',
    'university', 'certification',
  ],
  'Income & Consulting': [
    'salary', 'income', 'consulting', 'freelance', 'client payment', 'bonus',
    'dividend', 'stipend', 'invoice', 'retainer',
  ],
  'Investments & Savings': [
    'sip', 'mutual fund', 'stocks', 'equity', 'gold', 'crypto', 'savings',
    'deposit', 'index fund', 'etf',
  ],
  Other: ['miscellaneous', 'cash', 'transfer', 'other', 'general'],
};

/**
 * Intelligent deterministic natural language finance parser
 */
export function parseFinancialInputLocal(
  input: string,
  currentCategoryBudgets?: { category: TransactionCategory; spent: number; budget: number }[],
): ParseTransactionResponse {
  const cleanInput = input.trim();
  const lower = cleanInput.toLowerCase();

  // 1. Detect Currency
  let currency = '₹';
  if (cleanInput.includes('$')) currency = '$';
  else if (cleanInput.includes('€')) currency = '€';
  else if (cleanInput.includes('£')) currency = '£';
  else if (cleanInput.includes('₹') || lower.includes('rs') || lower.includes('inr')) currency = '₹';

  // 2. Extract Amount
  // Matches ₹450, $45.50, 450, 1,200.00, etc.
  const amountMatch = cleanInput.match(/(?:[₹$€£]\s*|rs\.?\s*|inr\s*)?([0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]+)?|[0-9]+(?:\.[0-9]+)?)/i);
  let amount = 0;
  if (amountMatch && amountMatch[1]) {
    amount = parseFloat(amountMatch[1].replace(/,/g, ''));
  }

  // 3. Detect Transaction Type
  const isIncome =
    lower.includes('received') ||
    lower.includes('salary') ||
    lower.includes('income') ||
    lower.includes('earned') ||
    lower.includes('got paid') ||
    lower.includes('deposited') ||
    lower.includes('client paid');

  const type: TransactionType = isIncome ? 'income' : 'expense';

  // 4. Determine Category
  let detectedCategory: TransactionCategory = type === 'income' ? 'Income & Consulting' : 'Other';
  let highestScore = 0;

  if (type === 'income') {
    detectedCategory = 'Income & Consulting';
  } else {
    for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
      if (category === 'Income & Consulting') continue;
      let score = 0;
      for (const kw of keywords) {
        if (lower.includes(kw)) {
          score += kw.length; // weight longer matches higher
        }
      }
      if (score > highestScore) {
        highestScore = score;
        detectedCategory = category as TransactionCategory;
      }
    }
  }

  // 5. Extract Merchant or Subject
  let merchant = 'Direct Transaction';
  const atMatch = cleanInput.match(/(?:at|from|to|via|on|in)\s+([A-Za-z0-9'& -]{2,30}?)(?:\s+(?:today|yesterday|this|for|\d|\.|$))/i);
  if (atMatch && atMatch[1]) {
    merchant = atMatch[1].trim();
  } else if (detectedCategory === 'Dining & Food') {
    merchant = 'Bistro / Dining';
  } else if (detectedCategory === 'Groceries') {
    merchant = 'Grocery Store';
  } else if (detectedCategory === 'Transportation') {
    merchant = 'Transit / Mobility';
  } else if (type === 'income') {
    merchant = 'Client / Employer';
  }

  // 6. Extract Date
  let date = new Date().toISOString().split('T')[0];
  if (lower.includes('yesterday')) {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    date = d.toISOString().split('T')[0];
  }

  // Budget context
  const catBudget = currentCategoryBudgets?.find((b) => b.category === detectedCategory) || {
    category: detectedCategory,
    spent: 0,
    budget: 10000,
  };
  const projectedSpent = catBudget.spent + (type === 'expense' ? amount : 0);
  const willExceed = projectedSpent > catBudget.budget;

  const confidence = amount > 0 && detectedCategory !== 'Other' ? 0.94 : 0.78;

  return {
    success: amount > 0,
    rawInput: cleanInput,
    parsedTransaction: {
      amount,
      currency,
      category: detectedCategory,
      merchant,
      description: cleanInput,
      type,
      date,
      confidence,
      suggestedAction: willExceed
        ? `Warning: This ${currency}${amount.toLocaleString()} will push ${detectedCategory} ${Math.round(((projectedSpent - catBudget.budget) / catBudget.budget) * 100)}% over monthly target.`
        : `Verified: ${currency}${amount.toLocaleString()} fits within ${detectedCategory} remaining monthly capacity.`,
    },
    budgetContext: {
      category: detectedCategory,
      currentSpent: catBudget.spent,
      budgetLimit: catBudget.budget,
      projectedSpent,
      willExceedBudget: willExceed,
    },
    explanation: `Identified ${type} of ${currency}${amount.toLocaleString()} under ${detectedCategory} for "${merchant}".`,
  };
}
