import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SecurityService {
    // Service de sécurité pour l'application

    constructor() {
        // En production uniquement, on désactive la console
        if (environment.production) {
            this.disableConsoleInProduction();
        }
    }

    private disableConsoleInProduction(): void {
        // Désactive la console en production
        // Désactive la console en production sauf pour les erreurs critiques
        if (window.console) {
            const preserveError = console.error;
            Object.keys(console).forEach(key => {
                (console as any)[key] = key === 'error' ? preserveError : () => { };
            });
        }
    }

    validateInput(value: string): boolean {
        // Validation basique des entrées utilisateur
        const dangerousPatterns = [
            /<script\b[^>]*>([\s\S]*?)<\/script>/gi,
            /javascript:/gi,
            /onerror=/gi,
            /onload=/gi,
            /onclick=/gi,
            /onmouseover=/gi
        ];

        return !dangerousPatterns.some(pattern => pattern.test(value));
    }

    sanitizeValue(value: string): string {
        // Nettoyage basique des entrées utilisateur
        return value.replace(/[<>]/g, '');
    }
}