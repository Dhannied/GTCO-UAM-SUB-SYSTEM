import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';

interface UAMUser {
  id: string;
  name: string;
  email: string;
  role: 'Supervisor' | 'Officer';
  status: 'Active' | 'Inactive';
  department: string;
  lastActive: string;
  photo?: string;
  authorizedApps: string[];
}

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, SidebarComponent],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  // Math object for template
  Math = Math;
  
  // User list
  users: UAMUser[] = [];
  
  // Filters
  searchTerm: string = '';
  roleFilter: string = 'All Roles';
  statusFilter: string = 'All Statuses';
  
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;  // Changed from 5 to 10
  
  // Departments
  departments: string[] = ['IT', 'Finance', 'HR', 'Operations', 'Marketing', 'Security'];
  
  constructor(private router: Router) {}
  
  ngOnInit(): void {
    // Load mock data
    this.loadMockUsers();
  }
  
  loadMockUsers(): void {
    this.users = [
      {
        id: 'UAM-001',
        name: 'John Smith',
        email: 'john.smith@example.com',
        role: 'Supervisor',
        status: 'Active',
        department: 'Security',
        lastActive: '2025-06-15 09:42',
        authorizedApps: ['Core Banking', 'Finnacle', 'Gap', 'E-Document Manager', 'Active Directory']
      },
      {
        id: 'UAM-002',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@example.com',
        role: 'Officer',
        status: 'Active',
        department: 'IT',
        lastActive: '2025-06-14 15:30',
        authorizedApps: ['Core Banking', 'Finnacle', 'Gap']
      },
      {
        id: 'UAM-003',
        name: 'Michael Brown',
        email: 'michael.brown@example.com',
        role: 'Officer',
        status: 'Active',
        department: 'Operations',
        lastActive: '2025-06-13 11:20',
        authorizedApps: ['E-Document Manager', 'Active Directory', 'Email']
      },
      {
        id: 'UAM-004',
        name: 'Emily Davis',
        email: 'emily.davis@example.com',
        role: 'Officer',
        status: 'Inactive',
        department: 'Finance',
        lastActive: '2025-05-20 14:15',
        authorizedApps: ['Core Banking', 'Finnacle']
      },
      {
        id: 'UAM-005',
        name: 'Robert Wilson',
        email: 'robert.wilson@example.com',
        role: 'Supervisor',
        status: 'Active',
        department: 'Security',
        lastActive: '2025-06-15 08:30',
        authorizedApps: ['Core Banking', 'Finnacle', 'Gap', 'E-Document Manager', 'Active Directory', 'Email', 'VPN']
      },
      {
        id: 'UAM-006',
        name: 'Jennifer Lee',
        email: 'jennifer.lee@example.com',
        role: 'Officer',
        status: 'Active',
        department: 'HR',
        lastActive: '2025-06-12 16:45',
        authorizedApps: ['CRM', 'ERP']
      },
      {
        id: 'UAM-007',
        name: 'David Miller',
        email: 'david.miller@example.com',
        role: 'Officer',
        status: 'Inactive',
        department: 'IT',
        lastActive: '2025-05-10 10:20',
        authorizedApps: ['Core Banking', 'Active Directory', 'Email', 'VPN']
      },
      // Adding more UAM officers
      {
        id: 'UAM-008',
        name: 'Jessica Parker',
        email: 'jessica.parker@example.com',
        role: 'Officer',
        status: 'Active',
        department: 'Security',
        lastActive: '2025-06-14 13:25',
        authorizedApps: ['Core Banking', 'Finnacle', 'Active Directory', 'VPN']
      },
      {
        id: 'UAM-009',
        name: 'Thomas Anderson',
        email: 'thomas.anderson@example.com',
        role: 'Supervisor',
        status: 'Active',
        department: 'IT',
        lastActive: '2025-06-15 10:15',
        authorizedApps: ['Core Banking', 'Finnacle', 'Gap', 'E-Document Manager', 'Active Directory', 'Email', 'VPN', 'CRM']
      },
      {
        id: 'UAM-010',
        name: 'Amanda Wilson',
        email: 'amanda.wilson@example.com',
        role: 'Officer',
        status: 'Active',
        department: 'Operations',
        lastActive: '2025-06-13 09:30',
        authorizedApps: ['Core Banking', 'Finnacle', 'E-Document Manager']
      },
      {
        id: 'UAM-011',
        name: 'Christopher Lee',
        email: 'christopher.lee@example.com',
        role: 'Officer',
        status: 'Active',
        department: 'Finance',
        lastActive: '2025-06-12 14:20',
        authorizedApps: ['Core Banking', 'Financial Reporting', 'Business Intelligence']
      },
      {
        id: 'UAM-012',
        name: 'Olivia Martinez',
        email: 'olivia.martinez@example.com',
        role: 'Officer',
        status: 'Inactive',
        department: 'HR',
        lastActive: '2025-05-15 11:45',
        authorizedApps: ['HR Management', 'CRM', 'ERP']
      },
      {
        id: 'UAM-013',
        name: 'Daniel Thompson',
        email: 'daniel.thompson@example.com',
        role: 'Supervisor',
        status: 'Active',
        department: 'Security',
        lastActive: '2025-06-14 16:10',
        authorizedApps: ['Core Banking', 'Finnacle', 'Gap', 'E-Document Manager', 'Active Directory', 'Security Management']
      },
      {
        id: 'UAM-014',
        name: 'Sophia Rodriguez',
        email: 'sophia.rodriguez@example.com',
        role: 'Officer',
        status: 'Active',
        department: 'IT',
        lastActive: '2025-06-13 13:50',
        authorizedApps: ['Core Banking', 'Active Directory', 'Email', 'IT Service Management']
      },
      {
        id: 'UAM-015',
        name: 'William Jackson',
        email: 'william.jackson@example.com',
        role: 'Officer',
        status: 'Active',
        department: 'Operations',
        lastActive: '2025-06-11 09:15',
        authorizedApps: ['Core Banking', 'Operations Management', 'E-Document Manager']
      }
    ];
  }
  
  get filteredUsers(): UAMUser[] {
    return this.users.filter(user => {
      // Filter by search term
      const matchesSearch = this.searchTerm === '' || 
        user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.id.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      // Filter by role
      const matchesRole = this.roleFilter === 'All Roles' || user.role === this.roleFilter;
      
      // Filter by status
      const matchesStatus = this.statusFilter === 'All Statuses' || user.status === this.statusFilter;
      
      return matchesSearch && matchesRole && matchesStatus;
    });
  }
  
  get paginatedUsers(): UAMUser[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredUsers.slice(startIndex, startIndex + this.itemsPerPage);
  }
  
  get totalPages(): number {
    return Math.ceil(this.filteredUsers.length / this.itemsPerPage);
  }
  
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
  
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }
  
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
  
  clearSearch(): void {
    this.searchTerm = '';
  }
  
  viewUser(userId: string): void {
    console.log('Navigating to user details for ID:', userId);
    
    // Use the correct navigation format
    this.router.navigate(['/user-management/user', userId]);
  }
  
  getInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  }
}














