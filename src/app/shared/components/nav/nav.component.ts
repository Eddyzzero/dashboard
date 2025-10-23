import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';

interface NavLink {
    path: string;
    label: string;
    icon: string;
}

@Component({
    selector: 'app-nav',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.css']
})
export class NavComponent {
    isDrawerOpen = false;

    constructor(
        public auth: AuthService,
        public theme: ThemeService,
        private router: Router
    ) { }

    navLinks: NavLink[] = [
        // GENERAL
        {
            path: '/dashboard',
            label: 'Tableau de bord',
            icon: 'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z'
        },
        {
            path: '/transactions',
            label: 'Transactions',
            icon: 'M3 10h18v2H3v-2zm0-6h18v2H3V4zm0 12h18v2H3v-2z'
        },
        {
            path: '/categories',
            label: 'Catégories',
            icon: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z'
        },
        {
            path: '/budgets',
            label: 'Budgets',
            icon: 'M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z'
        },
        // OUTILS
        {
            path: '/rapports',
            label: 'Rapports',
            icon: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14H6v-2h6v2zm4-4H6v-2h10v2zm0-4H6V7h10v2z'
        },
        {
            path: '/objectifs',
            label: 'Objectifs',
            icon: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14h-2V9h-2V7h4v10z'
        },
        // PARAMÈTRES
        {
            path: '/settings',
            label: 'Paramètres',
            icon: 'M19.43 12.98c.04-.32.07-.64.07-.98 0-.34-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98 0 .33.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z'
        }
    ];

    toggleDrawer() {
        this.isDrawerOpen = !this.isDrawerOpen;
    }

    closeDrawer() {
        this.isDrawerOpen = false;
    }

    toggleTheme() {
        this.theme.toggleTheme();
    }

    async logout() {
        if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
            try {
                await this.auth.logout();
                this.closeDrawer();
                await this.router.navigate(['/auth/login']);
            } catch (error) {
                console.error('Erreur lors de la déconnexion:', error);
            }
        }
    }
}