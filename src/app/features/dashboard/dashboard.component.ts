import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    Chart,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    BarController,
    Title,
    Tooltip,
    Legend,
    LineController,
    Filler
} from 'chart.js';
import { gsap } from 'gsap';

// Register ChartJS components
Chart.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    LineController,
    BarController,
    Title,
    Tooltip,
    Legend,
    Filler  // Ajout du plugin Filler pour supporter l'option fill
);

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div #cards>
            <!-- Summary Cards -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div class="card bg-base-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                    <div class="card-body">
                        <h2 class="card-title text-lg opacity-80">Revenus du mois</h2>
                        <p class="text-4xl font-bold mt-2 text-primary">{{ totalIncome | currency:'EUR' }}</p>
                    </div>
                </div>
                
                <div class="card bg-secondary text-secondary-content shadow-lg hover:shadow-xl transition-shadow duration-200">
                    <div class="card-body">
                        <h2 class="card-title text-lg">Dépenses du mois</h2>
                        <p class="text-4xl font-bold mt-2">{{ totalExpense | currency:'EUR' }}</p>
                    </div>
                </div>
                
                <div class="card bg-accent text-accent-content shadow-lg hover:shadow-xl transition-shadow duration-200">
                    <div class="card-body">
                        <h2 class="card-title text-lg">Balance</h2>
                        <p class="text-4xl font-bold mt-2">{{ balance | currency:'EUR' }}</p>
                    </div>
                </div>
            </div>

            <!-- Charts Grid -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Line Chart -->
                <div class="card bg-base-100 shadow-lg">
                    <div class="card-body">
                        <h2 class="card-title mb-4">Évolution sur 6 mois</h2>
                        <div class="relative h-[300px] md:h-[400px]">
                            <canvas #lineChart></canvas>
                        </div>
                    </div>
                </div>

                <!-- Bar Chart -->
                <div class="card bg-base-100 shadow-lg">
                    <div class="card-body">
                        <h2 class="card-title mb-4">Comparaison mensuelle</h2>
                        <div class="relative h-[300px] md:h-[400px]">
                            <canvas #barChart></canvas>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class DashboardComponent implements OnInit, AfterViewInit {
    @ViewChild('cards') cardsEl!: ElementRef;
    @ViewChild('lineChart') lineChart!: ElementRef;
    @ViewChild('barChart') barChart!: ElementRef;

    // Data placeholders
    totalIncome = 2500;
    totalExpense = 1800;
    balance = 700;

    // Chart instances
    private lineChartInstance: Chart | undefined;
    private barChartInstance: Chart | undefined;

    // Chart colors
    private readonly chartColors = {
        income: {
            border: 'rgb(0, 0, 0)',
            background: 'rgba(0, 0, 0, 0.1)'
        },
        expense: {
            border: 'rgb(245, 158, 11)',
            background: 'rgba(245, 158, 11, 0.1)'
        }
    };

    constructor() { }

    ngOnInit() {
        // Fetch real data here
    }

    ngAfterViewInit() {
        this.initializeChart();
        this.animateCards();
    }

    private initializeChart() {
        // Sample data - replace with real data
        const labels = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'];
        const incomeData = [1500, 2000, 1800, 2500, 2200, 2500];
        const expenseData = [1200, 1400, 1300, 1800, 1600, 1800];

        this.initializeLineChart(labels, incomeData, expenseData);
        this.initializeBarChart(labels, incomeData, expenseData);
    }

    private initializeLineChart(labels: string[], incomeData: number[], expenseData: number[]) {
        const ctx = this.lineChart.nativeElement.getContext('2d');

        this.lineChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Revenus',
                        data: incomeData,
                        borderColor: this.chartColors.income.border,
                        backgroundColor: this.chartColors.income.background,
                        tension: 0.3,
                        fill: true
                    },
                    {
                        label: 'Dépenses',
                        data: expenseData,
                        borderColor: this.chartColors.expense.border,
                        backgroundColor: this.chartColors.expense.background,
                        tension: 0.3,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    }

    private initializeBarChart(labels: string[], incomeData: number[], expenseData: number[]) {
        const ctx = this.barChart.nativeElement.getContext('2d');

        this.barChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Revenus',
                        data: incomeData,
                        backgroundColor: this.chartColors.income.background,
                        borderColor: this.chartColors.income.border,
                        borderWidth: 1
                    },
                    {
                        label: 'Dépenses',
                        data: expenseData,
                        backgroundColor: this.chartColors.expense.background,
                        borderColor: this.chartColors.expense.border,
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    private animateCards() {
        if (this.cardsEl) {
            gsap.from(this.cardsEl.nativeElement.children, {
                duration: 0.6,
                y: 20,
                opacity: 0,
                stagger: 0.12,
                ease: 'power2.out'
            });
        }
    }
}
