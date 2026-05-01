import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { MaterialesComponent } from './features/materiales/materiales.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
  },
  {
    path: 'materiales',
    canActivate: [authGuard],
    loadComponent: () => Promise.resolve(MaterialesComponent),
  },
  { path: '**', redirectTo: 'login' },
];
