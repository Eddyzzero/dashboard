import { Injectable } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
    constructor() { }

    // Prepare monthly bar chart data from transactions grouped by month
    prepareMonthlyBarData(transactions: any[]): ChartData<'bar'> {
        const months = Array.from({ length: 12 }, (_, i) => i);
        const income = new Array(12).fill(0);
        const expense = new Array(12).fill(0);

        transactions.forEach((t) => {
            const d = new Date(t.date);
            const m = d.getMonth();
            if (t.type === 'income') income[m] += t.amount;
            else expense[m] += t.amount;
        });

        return {
            labels: months.map((m) => new Date(0, m).toLocaleString(undefined, { month: 'short' })),
            datasets: [
                { label: 'Revenus', data: income, backgroundColor: '#34d399' },
                { label: 'Dépenses', data: expense, backgroundColor: '#f87171' }
            ]
        };
    }

    // Prepare pie/categorical data
    prepareCategoryPieData(transactions: any[], categories: any[]) {
        const map: Record<string, number> = {};
        transactions.forEach((t) => {
            map[t.categoryId] = (map[t.categoryId] || 0) + t.amount;
        });
        const labels = categories.map((c) => c.name);
        const data = categories.map((c) => map[c.id] || 0);
        return { labels, data };
    }
}
