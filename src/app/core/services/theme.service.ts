import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private readonly THEME_KEY = 'dashboard-theme';
    private readonly DEFAULT_THEME = 'light';

    private themeSubject = new BehaviorSubject<string>(this.getStoredTheme());
    public theme$: Observable<string> = this.themeSubject.asObservable();

    constructor() {
        // Appliquer le thème au démarrage
        const storedTheme = this.getStoredTheme();
        this.applyTheme(storedTheme);
        this.themeSubject.next(storedTheme);
    }

    private getStoredTheme(): string {
        if (typeof window !== 'undefined') {
            return localStorage.getItem(this.THEME_KEY) || this.DEFAULT_THEME;
        }
        return this.DEFAULT_THEME;
    }

    private applyTheme(theme: string): void {
        if (typeof document !== 'undefined') {
            document.documentElement.setAttribute('data-theme', theme);
            // Forcer la mise à jour du thème
            document.documentElement.className = document.documentElement.className.replace(/theme-\w+/g, '');
            document.documentElement.classList.add(`theme-${theme}`);
        }
    }

    private storeTheme(theme: string): void {
        if (typeof window !== 'undefined') {
            localStorage.setItem(this.THEME_KEY, theme);
        }
    }

    getCurrentTheme(): string {
        return this.themeSubject.value;
    }

    toggleTheme(): void {
        const currentTheme = this.getCurrentTheme();
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    setTheme(theme: string): void {
        this.applyTheme(theme);
        this.storeTheme(theme);
        this.themeSubject.next(theme);
    }

    isDarkMode(): boolean {
        return this.getCurrentTheme() === 'dark';
    }

    // Méthode de debug
    debugTheme(): void {
        console.log('Current theme:', this.getCurrentTheme());
        console.log('Is dark mode:', this.isDarkMode());
        console.log('Document theme attribute:', document.documentElement.getAttribute('data-theme'));
        console.log('Document classes:', document.documentElement.className);
    }
}
