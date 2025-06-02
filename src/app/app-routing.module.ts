import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserManagementComponent } from './user-management/user-management.component';
import { UserDetailsComponent } from './user-management/user-details/user-details.component';

const routes: Routes = [
  { path: '', redirectTo: '/user-management', pathMatch: 'full' },
  { path: 'user-management', component: UserManagementComponent },
  { path: 'user-management/user/:id', component: UserDetailsComponent },
  // Add other routes as needed
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }



