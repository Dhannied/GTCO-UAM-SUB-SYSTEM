// Add to your sidebar component
import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  userRole: string = '';

  constructor(private authService: AuthService) {
    const currentUser = this.authService.getCurrentUser();
    this.userRole = currentUser?.role || '';
  }
}