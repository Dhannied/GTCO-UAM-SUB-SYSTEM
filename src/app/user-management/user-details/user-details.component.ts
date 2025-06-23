import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserManagementService, UAMUser } from '../../shared/services/user-management.service';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SidebarComponent]
})
export class UserDetailsComponent implements OnInit {
  userId: string = '';
  user: UAMUser | null = null;
  loading: boolean = true;
  error: string | null = null;
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserManagementService
  ) {}
  
  ngOnInit(): void {
    // Get the ID directly from the current route params
    const id = this.route.snapshot.paramMap.get('id');
    console.log('ID from route params:', id);
    
    if (id) {
      this.userId = id;
      this.loading = true;
      this.loadUser(id);
    } else {
      this.error = "No user ID provided";
      this.loading = false;
    }
  }
  
  loadUser(id: string): void {
    console.log('Loading user with ID:', id);
    this.userService.getUser(id).subscribe({
      next: (user) => {
        this.user = user;
        this.loading = false;
        console.log('User loaded successfully:', user);
      },
      error: (error) => {
        console.error('Error loading user:', error);
        this.error = "Failed to load user data";
        this.loading = false;
        
        // Always use mock data for now to ensure something displays
        this.user = this.getMockUser(id);
      }
    });
  }
  
  getMockUser(id: string): UAMUser {
    return {
      id: id,
      name: 'Test User',
      email: 'test@example.com',
      role: 'Officer',
      password: 'password123',
      department: 'IT Security',
      status: 'Active',
      lastActive: new Date().toISOString()
    };
  }
  
  goBack(): void {
    this.router.navigate(['/user-management']);
  }
  
  getInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  }
}















