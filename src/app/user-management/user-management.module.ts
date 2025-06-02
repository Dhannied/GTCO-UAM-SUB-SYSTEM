import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { UserManagementComponent } from './user-management.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule,
    UserManagementComponent,
    UserDetailsComponent
  ],
  exports: [
    UserManagementComponent,
    UserDetailsComponent
  ]
})
export class UserManagementModule { }


