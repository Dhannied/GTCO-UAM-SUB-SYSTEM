import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { UserManagementService, UAMUser } from '../shared/services/user-management.service';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule, SidebarComponent]
})
export class UserManagementComponent implements OnInit {
  // Add Math object for use in template
  Math = Math;
  
  users: UAMUser[] = [];
  searchTerm: string = '';
  roleFilter: string = 'All Roles';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  loading: boolean = false;
  error: string | null = null;
  
  // Add User Form
  addUserForm: FormGroup;
  showAddUserModal: boolean = false;
  selectedApps: string[] = [];
  employeeSearchResults: any[] = [];
  
  // Available apps for selection
  availableApps = [
    { id: 1, name: 'Core Banking' },
    { id: 2, name: 'Finnacle' },
    { id: 3, name: 'Gap' },
    { id: 4, name: 'E-Document Manager' },
    { id: 5, name: 'Active Directory' },
    { id: 6, name: 'Email' },
    { id: 7, name: 'VPN' },
    { id: 8, name: 'CRM' },
    { id: 9, name: 'ERP' }
  ];
  
  // Departments list
  departments = [
    'IT',
    'Security',
    'Operations',
    'Finance',
    'HR',
    'Project Management',
    'Customer Service',
    'Legal',
    'Marketing'
  ];
  
  // Mock employee database for search
  employeeDatabase = [
    { id: 'EMP-10045', name: 'John Smith', email: 'john.smith@example.com', department: 'Security' },
    { id: 'EMP-10046', name: 'Sarah Johnson', email: 'sarah.johnson@example.com', department: 'IT' },
    { id: 'EMP-10047', name: 'Michael Brown', email: 'michael.brown@example.com', department: 'Operations' },
    { id: 'EMP-10048', name: 'Emily Davis', email: 'emily.davis@example.com', department: 'Finance' },
    { id: 'EMP-10049', name: 'Robert Wilson', email: 'robert.wilson@example.com', department: 'Security' },
    { id: 'EMP-10050', name: 'Jennifer Lee', email: 'jennifer.lee@example.com', department: 'HR' },
    { id: 'EMP-10051', name: 'David Miller', email: 'david.miller@example.com', department: 'IT' },
    { id: 'EMP-10052', name: 'Jessica Parker', email: 'jessica.parker@example.com', department: 'Security' },
    { id: 'EMP-10053', name: 'Thomas Anderson', email: 'thomas.anderson@example.com', department: 'IT' },
    { id: 'EMP-10054', name: 'Amanda Wilson', email: 'amanda.wilson@example.com', department: 'Operations' },
    { id: 'EMP-10700', name: 'Iribama Papi', email: 'iribama.papi@example.com', department: 'Project Management' }
  ];
  
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private userService: UserManagementService
  ) {
    // Initialize the form
    this.addUserForm = this.fb.group({
      name: ['', Validators.required],
      id: [''],
      email: ['', [Validators.required, Validators.email]],
      department: ['', Validators.required],
      role: ['Officer', Validators.required]
    });
  }
  
  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getUsers().subscribe({
      next: (users) => {
        console.log('Users loaded:', users);
        
        // Debug: Check lastActive values
        users.forEach(user => {
          console.log(`User ${user.name} lastActive:`, user.lastActive, 
                      'Type:', typeof user.lastActive, 
                      'Formatted:', this.formatLastActive(user.lastActive));
        });
        
        this.users = users;
        // Instead of directly assigning to filteredUsers
        // this.filteredUsers = [...this.users];
        
        // Just update the users array, and the getter will handle filtering
        this.users = users;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.error = 'Failed to load users';
        this.loading = false;
      }
    });
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
      
      // Removed matchesStatus check
      
      return matchesSearch && matchesRole;
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
  
  viewUser(id: string): void {
    console.log('Navigating to user details with ID:', id);
    this.router.navigate(['/user-management/user', id]);
  }
  
  getInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  }

  // Modal methods
  openAddUserModal(): void {
    this.showAddUserModal = true;
    this.resetForm();
    this.addUserForm.patchValue({
      role: 'Officer' // Default role is Officer
    });
  }

  closeAddUserModal(): void {
    this.showAddUserModal = false;
    this.resetForm();
  }

  resetForm(): void {
    this.addUserForm.reset();
    this.addUserForm.patchValue({
      role: 'Officer' // Default role
    });
    this.selectedApps = [];
    this.employeeSearchResults = [];
  }

  // Employee search and selection
  searchEmployees(): void {
    const searchTerm = this.addUserForm.get('name')?.value?.toLowerCase();
    if (!searchTerm || searchTerm.length < 2) {
      this.employeeSearchResults = [];
      return;
    }
    
    this.employeeSearchResults = this.employeeDatabase.filter(emp => 
      emp.name.toLowerCase().includes(searchTerm)
    ).slice(0, 5); // Limit to 5 results
  }

  selectEmployee(employee: any): void {
    this.addUserForm.patchValue({
      name: employee.name,
      id: employee.id,
      email: employee.email,
      department: employee.department
    });
    this.employeeSearchResults = [];
  }

  // Role change handler
  onRoleChange(): void {
    const role = this.addUserForm.get('role')?.value;
    if (role === 'Supervisor') {
      // Supervisors get access to all apps by default
      this.selectedApps = this.availableApps.map(app => app.name);
    } else {
      // Reset app selection for officers
      this.selectedApps = [];
    }
  }

  // App selection toggle
  toggleAppSelection(appName: string): void {
    const index = this.selectedApps.indexOf(appName);
    if (index === -1) {
      this.selectedApps.push(appName);
    } else {
      this.selectedApps.splice(index, 1);
    }
  }

  // Helper method to check if an officer has no apps selected
  isOfficerWithNoApps(): boolean {
    return this.addUserForm.get('role')?.value === 'Officer' && this.selectedApps.length === 0;
  }

  // Update the form submission method
  submitAddUserForm(): void {
    if (this.addUserForm.invalid) {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.addUserForm.controls).forEach(key => {
        this.addUserForm.get(key)?.markAsTouched();
      });
      return;
    }
    
    // Check if officer has at least one app selected
    if (this.isOfficerWithNoApps()) {
      return;
    }
    
    const formValues = this.addUserForm.value;
    
    // Create new UAM user object
    const newUser: UAMUser = {
      id: formValues.id,
      name: formValues.name,
      email: formValues.email,
      role: formValues.role,
      department: formValues.department,
      status: 'Active',
      lastActive: new Date().toISOString(),
      // Use id instead of employeeId or map it correctly
      // employeeId: formValues.id, // This line is causing the error
    };
    
    // Add the UAM user
    this.userService.addUser(newUser).subscribe(() => {
      // Refresh the users list
      this.userService.getUsers().subscribe(users => {
        this.users = users;
        this.filteredUsers;
      });
      
      // Reset the form and close the modal
      this.resetForm();
      this.showAddUserModal = false;
    });
  }

  getDefaultPlatform(appName: string): string {
    const platforms: {[key: string]: string} = {
      'Core Banking': 'Finacle 11.0',
      'Finnacle': 'Finnacle 10.2',
      'Gap': 'Gap 3.5',
      'E-Document Manager': 'EDM 2.0',
      'Active Directory': 'Windows Server 2019',
      'Email': 'Microsoft Exchange',
      'VPN': 'Cisco AnyConnect',
      'CRM': 'Dynamics 365',
      'ERP': 'SAP S/4HANA'
    };
    return platforms[appName] || 'Web Application';
  }

  getAppIcon(appName: string): string {
    const icons: {[key: string]: string} = {
      'Core Banking': 'university',
      'Finnacle': 'chart-line',
      'Gap': 'file-alt',
      'E-Document Manager': 'folder',
      'Active Directory': 'users',
      'Email': 'envelope',
      'VPN': 'shield-alt',
      'CRM': 'address-book',
      'ERP': 'cogs'
    };
    return icons[appName] || 'desktop';
  }

  getAppIconBg(appName: string): string {
    const colors: {[key: string]: string} = {
      'Core Banking': '#d1e3ff',
      'Finnacle': '#e9d5ff',
      'Gap': '#ffe8d1',
      'E-Document Manager': '#d1ffdb',
      'Active Directory': '#ffd1d1',
      'Email': '#d1f6ff',
      'VPN': '#f5d1ff',
      'CRM': '#fff5d1',
      'ERP': '#d1ffe3'
    };
    return colors[appName] || '#e0e0e0';
  }

  // Format the last active date
  formatLastActive(dateValue: any): string {
    console.log('formatLastActive input:', dateValue, 'Type:', typeof dateValue);
    
    // If no value is provided, use current time instead of showing "Never logged in"
    if (!dateValue) {
      console.log('No lastActive value, using current time');
      dateValue = new Date();
    }
    
    try {
      let date: Date;
      
      // Handle different types of input
      if (dateValue instanceof Date) {
        date = dateValue;
      } else if (typeof dateValue === 'string') {
        date = new Date(dateValue);
      } else if (typeof dateValue === 'object') {
        date = new Date(dateValue);
      } else {
        // If we can't parse the date, use current time
        console.warn('Unparseable date value:', dateValue);
        date = new Date();
      }
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.warn('Invalid date:', date);
        date = new Date(); // Use current time for invalid dates
      }
      
      console.log('Parsed date:', date);
      
      // Format the date
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (date.getFullYear() === today.getFullYear() && 
          date.getMonth() === today.getMonth() && 
          date.getDate() === today.getDate()) {
        return `Today at ${date.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        })}`;
      } else if (date.getFullYear() === yesterday.getFullYear() && 
                date.getMonth() === yesterday.getMonth() && 
                date.getDate() === yesterday.getDate()) {
        return `Yesterday at ${date.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        })}`;
      } else {
        return `${date.toLocaleDateString('en-US', { 
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })} at ${date.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        })}`;
      }
    } catch (error) {
      console.error('Error in formatLastActive:', error);
      // Return a default formatted date instead of an error message
      return new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    }
  }

  // Helper method to format a date consistently
  private formatDate(date: Date): string {
    // Get current date for comparison
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Format based on when the date is
    if (date.getFullYear() === today.getFullYear() && 
        date.getMonth() === today.getMonth() && 
        date.getDate() === today.getDate()) {
      // Today
      return `Today at ${date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      })}`;
    } else if (date.getFullYear() === yesterday.getFullYear() && 
              date.getMonth() === yesterday.getMonth() && 
              date.getDate() === yesterday.getDate()) {
      // Yesterday
      return `Yesterday at ${date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      })}`;
    } else if (date.getFullYear() === now.getFullYear()) {
      // This year
      return `${date.toLocaleDateString('en-US', { 
        month: 'short',
        day: 'numeric'
      })} at ${date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      })}`;
    } else {
      // Different year
      return `${date.toLocaleDateString('en-US', { 
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })} at ${date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      })}`;
    }
  }
}






























