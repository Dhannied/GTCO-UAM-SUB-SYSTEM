import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'dashboard', 
    pathMatch: 'full' 
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'user-management',
    loadComponent: () => import('./user-management/user-management.component').then(m => m.UserManagementComponent),
    canActivate: [authGuard]
  },
  {
    path: 'applications',
    loadComponent: () => import('./employee-details/employee-details.component').then(m => m.EmployeeDetailsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'audit-logs',
    loadComponent: () => import('./audit-trail/audit-trail.component').then(m => m.AuditTrailComponent),
    canActivate: [authGuard]
  },
  { 
    path: '**', 
    component: PageNotFoundComponent 
  }
];
