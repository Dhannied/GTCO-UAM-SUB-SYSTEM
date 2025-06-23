import { Routes } from '@angular/router';
import { authGuard, supervisorGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
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
    path: 'employees',
    loadComponent: () => import('./employees/employees.component').then(m => m.EmployeesComponent),
    canActivate: [authGuard]
  },
  {
    path: 'employee/:id',
    loadComponent: () => import('./employee-details/employee-details.component').then(m => m.EmployeeDetailsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'audit-trail',
    loadComponent: () => import('./audit-trail/audit-trail.component').then(m => m.AuditTrailComponent),
    canActivate: [authGuard]
  },
  {
    path: 'analytics',
    loadComponent: () => import('./analytics/analytics.component').then(m => m.AnalyticsComponent),
    canActivate: [supervisorGuard]
  },
  {
    path: 'user-management',
    loadComponent: () => import('./user-management/user-management.component').then(m => m.UserManagementComponent),
    canActivate: [supervisorGuard]
  },
  {
    path: 'user-management/user/:id',
    loadComponent: () => import('./user-management/user-details/user-details.component').then(m => m.UserDetailsComponent),
    canActivate: [supervisorGuard]
  },
  {
    path: '',
    redirectTo: 'dashboard'
  }
];