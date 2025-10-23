import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { SecurityService } from '../../../core/services/security.service';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
    selector: 'app-signup',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
})
export class SignupComponent {
    email = '';
    password = '';
    confirmPassword = '';
    loading = false;
    error = '';
    showErrorModal = false;
    modalError = '';

    constructor(
        private auth: AuthService,
        private router: Router,
        private security: SecurityService,
        public theme: ThemeService
    ) { }

    async signInWithGoogle() {
        try {
            this.loading = true;
            this.error = '';
            await this.auth.loginWithGoogle();
            await this.router.navigate(['/dashboard']);
        } catch (err: any) {
            console.error('Erreur de connexion Google:', err);
            const message = this.getErrorMessage(err?.code || err?.message);
            this.error = message;
            this.showError(message);
        } finally {
            this.loading = false;
        }
    }

    private showError(message: string) {
        this.modalError = message;
        this.showErrorModal = true;
    }

    closeErrorModal() {
        this.showErrorModal = false;
        this.modalError = '';
    }

    async submit() {
        if (!this.email || !this.password || !this.confirmPassword) {
            const message = 'Veuillez remplir tous les champs';
            this.error = message;
            this.showError(message);
            return;
        }

        if (this.password !== this.confirmPassword) {
            const message = 'Les mots de passe ne correspondent pas';
            this.error = message;
            this.showError(message);
            return;
        }

        if (this.password.length < 6) {
            const message = 'Le mot de passe doit contenir au moins 6 caractères';
            this.error = message;
            this.showError(message);
            return;
        }

        try {
            this.loading = true;
            this.error = '';

            await this.auth.signup(this.email, this.password);
            await this.router.navigate(['/dashboard']);
        } catch (err: any) {
            console.error('Erreur de création de compte:', err);
            const message = this.getErrorMessage(err?.code || err?.message);
            this.error = message;
            this.showError(message);
        } finally {
            this.loading = false;
        }
    }

    private getErrorMessage(code: string): string {
        switch (code) {
            case 'auth/email-already-in-use':
                return 'Cette adresse email est déjà utilisée';
            case 'auth/invalid-email':
                return 'Adresse email invalide';
            case 'auth/operation-not-allowed':
                return 'La création de compte est désactivée';
            case 'auth/weak-password':
                return 'Le mot de passe est trop faible';
            case 'auth/popup-closed-by-user':
                return 'La fenêtre de connexion a été fermée';
            case 'auth/cancelled-popup-request':
                return 'La connexion a été annulée';
            case 'auth/popup-blocked':
                return 'La fenêtre pop-up a été bloquée par le navigateur';
            default:
                return 'Une erreur est survenue lors de la création du compte';
        }
    }
}