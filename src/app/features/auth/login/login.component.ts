import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { SecurityService } from '../../../core/services/security.service';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
    email = '';
    password = '';
    loading = false;
    error = '';

    isDark(): boolean {
        return document.documentElement.getAttribute('data-theme') === 'dark';
    }

    toggleTheme(): void {
        const html = document.documentElement;
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    }

    constructor(
        private auth: AuthService,
        private router: Router,
        private security: SecurityService,
        public theme: ThemeService
    ) { }
    showErrorModal = false;
    modalError = '';

    ngOnInit() {
        // Vérifier si l'utilisateur est déjà connecté
        this.auth.currentUser$.subscribe(user => {
            if (user) {
                this.router.navigate(['/dashboard']);
            }
        });
    }

    async signInWithGoogle() {
        try {
            this.loading = true;
            this.error = '';
            const user = await this.auth.loginWithGoogle();
            if (user) {
                await this.router.navigate(['/dashboard']);
            } else {
                this.error = 'Échec de la connexion avec Google';
                this.showError(this.error);
            }
        } catch (err: any) {
            console.error('Erreur de connexion Google:', err);
            this.error = this.getErrorMessage(err?.code || err?.message);
            this.showError(this.error);
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
        if (!this.email || !this.password) {
            const message = 'Veuillez remplir tous les champs';
            this.error = message;
            this.showError(message);
            return;
        }

        try {
            this.loading = true;
            this.error = '';

            const user = await this.auth.login(this.email, this.password);
            if (user) {
                console.log('Utilisateur connecté:', user);
                await this.router.navigate(['/dashboard']);
            } else {
                const message = 'Échec de la connexion';
                this.error = message;
                this.showError(message);
            }
        } catch (err: any) {
            console.error('Erreur de connexion:', err);
            const message = this.getErrorMessage(err?.code || err?.message);
            this.error = message;
            this.showError(message);
        } finally {
            this.loading = false;
        }
    }

    private getErrorMessage(code: string): string {
        switch (code) {
            case 'auth/invalid-email':
                return 'Adresse email invalide';
            case 'auth/user-disabled':
                return 'Ce compte a été désactivé';
            case 'auth/user-not-found':
                return 'Aucun compte ne correspond à cette adresse email';
            case 'auth/wrong-password':
                return 'Mot de passe incorrect';
            case 'auth/popup-closed-by-user':
                return 'La fenêtre de connexion a été fermée';
            case 'auth/cancelled-popup-request':
                return 'La connexion a été annulée';
            case 'auth/popup-blocked':
                return 'La fenêtre pop-up a été bloquée par le navigateur';
            default:
                return 'Une erreur est survenue lors de la connexion';
        }
    }
}