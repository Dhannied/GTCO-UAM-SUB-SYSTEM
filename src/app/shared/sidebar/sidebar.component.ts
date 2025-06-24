import { Component, Input, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service'; 

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  @Input() activeRoute: string = '';
  userRole: string = '';

  private authService = inject(AuthService);

  ngOnInit(): void {
    const currentUser = this.authService.currentUser;
    this.userRole = currentUser?.role || 'User';
  }
}
