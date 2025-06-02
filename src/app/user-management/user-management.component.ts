import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserManagementService, UAMUser } from '../shared/services/user-management.service';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule, 
    RouterModule,
    SidebarComponent
  ]
})
export class UserManagementComponent implements OnInit {
  // Add Math object for use in template
  Math = Math;
  
  users: UAMUser[] = [];
  searchTerm: string = '';
  roleFilter: string = 'All Roles';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  
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
    this.userService.getUsers().subscribe(users => {
      this.users = users;
      console.log('Users loaded in UserManagementComponent:', this.users);
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
  
  viewUser(userId: string): void {
    console.log('Navigating to user details for ID:', userId);
    const user = this.userService.getUserById(userId);
    console.log('User from service:', user);
    this.router.navigate(['/user-management/user', userId]);
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

  // Add new user
  addNewUser(): void {
    if (this.addUserForm.invalid || this.isOfficerWithNoApps()) {
      return;
    }
    
    const formValues = this.addUserForm.value;
    
    // Create new user object
    const newUser: UAMUser = {
      id: `UAM-${Math.floor(1000 + Math.random() * 9000)}`,
      name: formValues.name,
      email: formValues.email,
      role: formValues.role,
      status: 'Active',
      department: formValues.department,
      lastActive: new Date().toLocaleString('en-US'),
      authorizedApps: this.selectedApps,
      employeeId: formValues.id,
      phone: '+234 9013274980',
      joinDate: new Date().toISOString().split('T')[0],
      photo: undefined, // Initialize as undefined
      // Applications array...
      applications: this.selectedApps.map(appName => {
        // Find the app in availableApps to get its id
        const app = this.availableApps.find(a => a.name === appName);
        return {
          id: app ? `app${app.id}` : `app${Math.floor(Math.random() * 1000)}`,
          name: appName,
          platform: this.getDefaultPlatform(appName),
          accessLevel: 'Full Access',
          lastUsed: 'Not used yet',
          icon: this.getAppIcon(appName),
          iconBg: this.getAppIconBg(appName),
          status: 'Active'
        };
      })
    };
    
    // Add the user
    this.userService.addUser(newUser).subscribe(() => {
      // Refresh the users list
      this.userService.getUsers().subscribe(users => {
        this.users = users;
      });
      
      // Reset the form and close the modal
      this.addUserForm.reset({
        role: 'Officer'
      });
      this.selectedApps = [];
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
}



