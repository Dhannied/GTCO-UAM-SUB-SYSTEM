import { Component, Input } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Input() activeRoute: string = '';
  
  constructor(private router: Router) {}
  
  navigateToUserManagement(): void {
    this.router.navigate(['/user-management']);
  }
}


