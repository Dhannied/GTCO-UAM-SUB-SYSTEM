import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EmployeesComponent } from './employees/employees.component';
import { EmployeeDetailsComponent } from './employee-details/employee-details.component';
import { AuditTrailComponent } from './audit-trail/audit-trail.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { UserDetailsComponent } from './user-management/user-details/user-details.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'employees', component: EmployeesComponent },
  { path: 'employee/:id', component: EmployeeDetailsComponent },
  { path: 'audit-trails', component: AuditTrailComponent },
  { path: 'analytics', component: AnalyticsComponent },
  { path: 'user-management', component: UserManagementComponent },
  { path: 'user-management/user/:id', component: UserDetailsComponent },
  { path: '**', redirectTo: '/login' }
];
