import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { UserManagementModule } from './user-management/user-management.module';
import { UserManagementService } from './shared/services/user-management.service';

@NgModule({
  declarations: [
    AppComponent
    // Only include components that are not in feature modules
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    UserManagementModule
  ],
  providers: [
    UserManagementService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }



