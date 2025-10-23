import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirestoreService } from '../../core/services/firestore.service';
import { AuthService } from '../../core/services/auth.service';
import { Transaction } from '../../core/models/transaction.model';
import { RouterModule } from '@angular/router';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

@Component({
    selector: 'app-transactions-list',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './transactions-list.component.html',
    styleUrls: ['./transactions-list.component.css']
})
export class TransactionsListComponent implements OnInit {
    transactions: Transaction[] = [];
    loading = false;
    error = '';
    month = new Date().getMonth();
    year = new Date().getFullYear();

    constructor(private fs: FirestoreService, private auth: AuthService) { }

    ngOnInit(): void {
        this.load();
    }

    async load() {
        this.loading = true;
        this.error = '';
        const user = this.auth.currentUser;
        if (!user) {
            this.error = 'Utilisateur non connecté';
            this.loading = false;
            return;
        }
        try {
            this.transactions = await this.fs.getTransactionsByMonth(user.uid, this.month, this.year);
        } catch (err: any) {
            console.error(err);
            this.error = 'Impossible de charger les transactions';
        } finally {
            this.loading = false;
        }
    }

    prevMonth() { this.changeMonth(-1); }
    nextMonth() { this.changeMonth(1); }
    changeMonth(delta: number) {
        const d = new Date(this.year, this.month + delta, 1);
        this.month = d.getMonth();
        this.year = d.getFullYear();
        this.load();
    }

    formatDate(ts: any) {
        try {
            const d = ts.toDate ? ts.toDate() : new Date(ts);
            return format(d, 'dd MMM yyyy', { locale: fr });
        } catch { return '' }
    }

    async deleteTx(tx: Transaction) {
        if (!confirm('Supprimer cette transaction ?')) return;
        const user = this.auth.currentUser;
        if (!user || !tx.id) return;
        try {
            await this.fs.deleteTransaction(user.uid, tx.id);
            this.transactions = this.transactions.filter(t => t.id !== tx.id);
        } catch (err) {
            console.error(err);
            alert('Erreur lors de la suppression');
        }
    }
}
