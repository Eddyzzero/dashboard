import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-signup',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
    form!: FormGroup;
    loading = false;
    error = '';

    constructor(
        private auth: AuthService,
        private router: Router,
        private fb: FormBuilder
    ) { }

    ngOnInit() {
        this.form = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    get emailError(): string {
        const control = this.form.get('email');
        if (control?.errors?.['required'] && control.touched) {
            return 'Email est requis';
        }
        if (control?.errors?.['email'] && control.touched) {
            return 'Email invalide';
        }
        return '';
    }

    get passwordError(): string {
        const control = this.form.get('password');
        if (control?.errors?.['required'] && control.touched) {
            return 'Mot de passe est requis';
        }
        if (control?.errors?.['minlength'] && control.touched) {
            return 'Le mot de passe doit contenir au moins 6 caractères';
        }
        return '';
    }

    async submit() {
        if (this.form.invalid) return;

        try {
            this.loading = true;
            const { email, password } = this.form.value;
            await this.auth.signup(email, password);
            this.router.navigate(['/dashboard']);
        } catch (err: any) {
            this.error = this.getErrorMessage(err?.code || err?.message);
        } finally {
            this.loading = false;
        }
    }

    async signInWithGoogle() {
        try {
            this.loading = true;
            await this.auth.loginWithGoogle();
            this.router.navigate(['/dashboard']);
        } catch (err: any) {
            this.error = this.getErrorMessage(err?.code || err?.message);
        } finally {
            this.loading = false;
        }
    }

    private getErrorMessage(code: string): string {
        switch (code) {
            case 'auth/email-already-in-use':
                return 'Cette adresse email est déjà utilisée';
            case 'auth/invalid-email':
                return 'L\'adresse email n\'est pas valide';
            case 'auth/operation-not-allowed':
                return 'L\'inscription par email/mot de passe n\'est pas activée';
            case 'auth/weak-password':
                return 'Le mot de passe doit contenir au moins 6 caractères';
            case 'auth/popup-closed-by-user':
                return 'La fenêtre de connexion a été fermée';
            case 'auth/cancelled-popup-request':
                return 'La connexion a été annulée';
            case 'auth/popup-blocked':
                return 'La fenêtre pop-up a été bloquée par le navigateur';
            default:
                return 'Une erreur est survenue lors de l\'inscription';
        }
    }
}
