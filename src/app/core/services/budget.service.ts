import { Injectable } from '@angular/core';
import { Transaction } from '../models/transaction.model';

@Injectable({ providedIn: 'root' })
export class BudgetService {
    calcMonthlySummary(transactions: Transaction[]) {
        const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + (t.amount || 0), 0);
        const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + (t.amount || 0), 0);
        const balance = totalIncome - totalExpenses;
        return { totalIncome, totalExpenses, balance };
    }

    // Helper: group by category and sum amounts (useful for charts)
    groupByCategory(transactions: Transaction[]) {
        const map: Record<string, number> = {};
        transactions.forEach(t => {
            if (t.type === 'expense') {
                map[t.category] = (map[t.category] || 0) + t.amount;
            }
        });
        return map;
    }
}
