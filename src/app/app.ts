import { Component, signal, OnInit, inject } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { NavComponent } from './shared/components/nav/nav.component';
import { NotificationsComponent } from './shared/components/notifications/notifications.component';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { AuthService } from './core/services/auth.service';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavComponent, NotificationsComponent, CommonModule],
  standalone: true,
  templateUrl: './app.html',
})
export class App implements OnInit {
  protected readonly title = signal('Dashboard_finances');
  currentUrl = '';
  auth = inject(AuthService);

  constructor(
    private router: Router,
    public theme: ThemeService
  ) { }

  ngOnInit() {
    // Initialiser le thème au démarrage
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Écouter les changements de route
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentUrl = event.url;
      });
  }

  isAuthPage(): boolean {
    return this.currentUrl.includes('/auth/');
  }

  getCurrentPageTitle(): string {
    if (this.currentUrl.includes('dashboard')) return 'Récapitulatif des finances';
    if (this.currentUrl.includes('transactions')) return 'Transactions';
    if (this.currentUrl.includes('categories')) return 'Catégories';
    if (this.currentUrl.includes('settings')) return 'Paramètres';
    return 'Dashboard Finances';
  }

  toggleNav() {
    // La logique existante sera gérée par le composant nav
  }

  toggleQuickAdd() {
    // Navigation vers le formulaire d'ajout rapide de transaction
    this.router.navigate(['/transactions/new'], {
      queryParams: { mode: 'quick' }
    });
    const navComponent = document.querySelector('app-nav');
    if (navComponent) {
      navComponent.dispatchEvent(new CustomEvent('toggleDrawer'));
    }
  }

  async logout() {
    await this.auth.logout();
    await this.router.navigate(['/auth/login']);
  }
}
