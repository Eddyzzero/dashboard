import { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { SignupComponent } from './features/auth/signup/signup.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { TransactionsListComponent } from './features/transactions/transactions-list.component';
import { TransactionFormComponent } from './features/transactions/transaction-form.component';
import { CategoriesComponent } from './features/categories/categories.component';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'auth/login', component: LoginComponent },
    { path: 'auth/signup', component: SignupComponent },
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
    { path: 'transactions', component: TransactionsListComponent, canActivate: [AuthGuard] },
    { path: 'transactions/new', component: TransactionFormComponent, canActivate: [AuthGuard] },
    { path: 'categories', component: CategoriesComponent, canActivate: [AuthGuard] },
    { path: '**', redirectTo: 'dashboard' }
];
