import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirestoreService } from '../../core/services/firestore.service';
import { AuthService } from '../../core/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Timestamp as FireTimestamp } from 'firebase/firestore';
import { Transaction } from '../../core/models/transaction.model';

@Component({
    selector: 'app-transaction-form',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './transaction-form.component.html',
})
export class TransactionFormComponent implements OnInit {
    model: any = {
        date: new Date().toISOString().slice(0, 10),
        amount: 0,
        category: '',
        type: 'expense',
        note: ''
    };
    loading = false;
    error = '';
    editingId: string | null = null;

    constructor(private fs: FirestoreService, private auth: AuthService, private router: Router, private route: ActivatedRoute) { }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.editingId = id;
            this.loadTransaction(id);
        }
    }

    private async loadTransaction(id: string) {
        const user = this.auth.currentUser;
        if (!user) {
            this.error = 'Utilisateur non connecté';
            return;
        }
        try {
            const doc = await this.fs.getDocument(`users/${user.uid}/transactions`, id) as Transaction | null;
            if (!doc) {
                this.error = 'Transaction introuvable';
                return;
            }
            // normalize date to yyyy-MM-dd for input[type=date]
            let dateObj: Date;
            if (doc.date instanceof FireTimestamp) {
                dateObj = doc.date.toDate();
            } else {
                dateObj = new Date();
            }
            this.model = {
                date: dateObj.toISOString().slice(0, 10),
                amount: doc.amount || 0,
                category: doc.category || '',
                type: doc.type || 'expense',
                note: doc.note || ''
            };
        } catch (err: any) {
            console.error(err);
            this.error = 'Impossible de charger la transaction';
        }
    }

    cancel() {
        this.router.navigate(['/transactions']);
    }

    validate() {
        if (!this.model.date || !this.model.amount || !this.model.category || !this.model.type) {
            this.error = 'Veuillez remplir tous les champs requis';
            return false;
        }
        if ((this.model.amount || 0) <= 0) {
            this.error = 'Le montant doit être supérieur à 0';
            return false;
        }
        return true;
    }

    async submit() {
        if (!this.validate()) return;
        const user = this.auth.currentUser;
        if (!user) { this.error = 'Utilisateur non connecté'; return; }
        this.loading = true;
        try {
            const payload: any = {
                date: FireTimestamp.fromDate(new Date(this.model.date)),
                amount: Number(this.model.amount),
                category: this.model.category,
                type: this.model.type,
                note: this.model.note || ''
            };
            if (this.editingId) {
                await this.fs.updateTransaction(user.uid, this.editingId, payload);
            } else {
                await this.fs.addTransaction(user.uid, payload);
            }
            await this.router.navigate(['/transactions']);
        } catch (err: any) {
            console.error(err);
            this.error = 'Erreur lors de la sauvegarde';
        } finally {
            this.loading = false;
        }
    }
}
