import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { AuditLogTableComponent, AuditLog } from '../../shared/audit-log-table/audit-log-table.component';

interface Application {
  id: string;
  name: string;
  platform: string;
  accessLevel: string;
  lastUsed: string;
  icon: string;
  iconBg: string;
  status?: 'Active' | 'Inactive';
  deactivationType?: 'Temporary' | 'Permanent';
}

interface UAMUser {
  id: string;
  name: string;
  email: string;
  role: 'Supervisor' | 'Officer';
  status: 'Active' | 'Inactive';
  department: string;
  lastActive: string;
  phone?: string;
  joinDate?: string;
  photo?: string;
  employeeId?: string;
  lastAccessReview?: string;
  authorizedApps: string[];
  applications?: Application[];
}

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    FormsModule, 
    SidebarComponent, 
    AuditLogTableComponent
  ],
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
  selectedAppId: string = '';
  showAccessModal: boolean = false;
  accessLevel: string = 'Read Only';
  accessReason: string = '';
  appSearchTerm: string = '';
  filteredApplications: any[] = [];
  userAuditLogs: AuditLog[] = [];
  auditDateFilter: string = 'all';
  filteredAuditLogs: AuditLog[] = [];

  openAccessModal(appId: string) {
    this.selectedAppId = appId;
    this.showAccessModal = true;
    this.accessLevel = 'Read Only';
    this.accessReason = '';
  }

  closeAccessModal() {
    this.showAccessModal = false;
  }

  grantAccess(appId: string) {
    if (this.user && this.user.applications) {
      const app = this.user.applications.find(a => a.id === appId);
      if (app) {
        app.status = 'Active';
        app.accessLevel = 'Full Access'; // Default to Full Access
        app.lastUsed = 'Just now';
        console.log(`Granted Full Access to ${app.name}`);
      }
    }
  }

  revokeAccess(appId: string) {
    if (this.user && this.user.applications) {
      const app = this.user.applications.find(a => a.id === appId);
      if (app) {
        app.status = 'Inactive';
        console.log(`Revoked access to ${app.name}`);
        
        // Add to audit logs
        const newLog: AuditLog = {
          date: new Date().toLocaleString('en-US', { 
            day: '2-digit', 
            month: 'short', 
            year: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
          }),
          employee: 'Current Employee', // In a real app, this would be the selected employee
          employeeId: 'EMP-XXXXX',
          application: app.name,
          actionType: 'Permanent', // Default to permanent
          reason: 'Access revoked by UAM officer',
          officer: this.user?.name || 'Current User'
        };
        
        this.userAuditLogs.unshift(newLog); // Add to beginning of array
      }
    }
  }

  goBack() {
    window.history.back();
  }
  userId: string = '';
  user: UAMUser | null = null;
  
  // For deactivation modal
  showDeactivationModal: boolean = false;
  deactivationType: 'Temporary' | 'Permanent' = 'Temporary';
  deactivationReason: string = '';
  deactivationDuration: number = 1;
  durationUnit: 'days' | 'weeks' | 'months' = 'days';
  
  // Mock data for users
  users: UAMUser[] = [
    {
      id: 'UAM-001',
      name: 'John Smith',
      email: 'john.smith@example.com',
      phone: '+234 9013274980',
      joinDate: '2020-03-15',
      role: 'Supervisor',
      status: 'Active',
      department: 'Security',
      lastActive: '2025-06-15 09:42',
      employeeId: 'EMP-10045',
      lastAccessReview: 'May 15, 2023',
      authorizedApps: ['Core Banking', 'Finnacle', 'Gap', 'E-Document Manager', 'Active Directory'],
      applications: [
        {
          id: 'app1',
          name: 'Core Banking',
          platform: 'Finacle 11.0',
          accessLevel: 'Full Access',
          lastUsed: 'Today, 9:45 AM',
          icon: 'bank',
          iconBg: '#d1e3ff',
          status: 'Active'
        },
        {
          id: 'app2',
          name: 'Finnacle',
          platform: 'Finnacle 10.2',
          accessLevel: 'Full Access',
          lastUsed: 'Yesterday, 3:15 PM',
          icon: 'chart-line',
          iconBg: '#e9d5ff',
          status: 'Active'
        },
        {
          id: 'app3',
          name: 'Gap',
          platform: 'Gap 3.5',
          accessLevel: 'Read Only',
          lastUsed: '3 days ago',
          icon: 'file-alt',
          iconBg: '#ffe8d1',
          status: 'Active'
        },
        {
          id: 'app4',
          name: 'E-Document Manager',
          platform: 'EDM 2.0',
          accessLevel: 'Full Access',
          lastUsed: 'Last week',
          icon: 'folder',
          iconBg: '#d1ffdb',
          status: 'Active'
        },
        {
          id: 'app5',
          name: 'Active Directory',
          platform: 'Windows Server 2019',
          accessLevel: 'Read Only',
          lastUsed: '2 weeks ago',
          icon: 'users',
          iconBg: '#ffd1d1',
          status: 'Active'
        },
        {
          id: 'app6',
          name: 'Email System',
          platform: 'Exchange Online',
          accessLevel: 'Full Access',
          lastUsed: 'Today, 8:30 AM',
          icon: 'envelope',
          iconBg: '#d1e3ff',
          status: 'Inactive'
        },
        {
          id: 'app7',
          name: 'VPN Access',
          platform: 'Cisco AnyConnect',
          accessLevel: 'Full Access',
          lastUsed: 'Yesterday',
          icon: 'shield-alt',
          iconBg: '#e9d5ff',
          status: 'Inactive'
        }
      ]
    },
    // Add more mock users here matching the ones in your UserManagementComponent
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    console.log('UserDetailsComponent initialized');
    this.route.params.subscribe(params => {
      this.userId = params['id'];
      console.log('User ID from route:', this.userId);
      this.loadUserDetails();
    });
    this.loadUserAuditLogs();
    this.filterAuditLogs();
  }

  loadUserDetails(): void {
    console.log('Loading user details for ID:', this.userId);
    console.log('Available users:', this.users);
    
    // Find the user by ID
    this.user = this.users.find(user => user.id === this.userId) || null;
    console.log('Found user:', this.user);
    
    // If user is found, ensure all applications have a status
    if (this.user && this.user.applications) {
      this.user.applications.forEach(app => {
        if (!app.status) {
          app.status = 'Active';
        }
      });
      
      // Initialize filtered applications
      this.filteredApplications = [...this.user.applications];
    } else {
      console.error('User not found or has no applications');
    }
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  }

  openDeactivationModal(appId: string): void {
    this.showDeactivationModal = true;
    this.deactivationType = 'Temporary';
    this.deactivationReason = '';
    this.deactivationDuration = 1;
    this.durationUnit = 'days';
  }

  closeDeactivationModal(): void {
    this.showDeactivationModal = false;
  }

  deactivateApplication(): void {
    if (this.user && this.user.applications) {
      // In a real application, you would call an API to deactivate the application
      console.log(`Deactivating application with reason: ${this.deactivationReason}`);
      console.log(`Deactivation type: ${this.deactivationType}`);
      
      if (this.deactivationType === 'Temporary') {
        console.log(`Duration: ${this.deactivationDuration} ${this.durationUnit}`);
      }
      
      this.closeDeactivationModal();
    }
  }

  // Filter applications based on search term
  filterApplications() {
    if (!this.user || !this.user.applications) {
      this.filteredApplications = [];
      return;
    }
    
    if (!this.appSearchTerm) {
      this.filteredApplications = [...this.user.applications];
      return;
    }
    
    const searchTerm = this.appSearchTerm.toLowerCase();
    this.filteredApplications = this.user.applications.filter(app => 
      app.name.toLowerCase().includes(searchTerm) || 
      app.platform.toLowerCase().includes(searchTerm)
    );
  }

  // Clear search term
  clearAppSearch() {
    this.appSearchTerm = '';
    this.filterApplications();
  }

  loadUserAuditLogs() {
    // In a real app, this would fetch from a service
    // For now, we'll create mock data
    if (this.user) {
      // Generate some sample audit logs for this UAM user
      this.userAuditLogs = [
        {
          date: '15 Jun 2025, 14:32',
          employee: 'John Doe',
          employeeId: 'EMP-10045',
          application: 'Core Banking',
          actionType: 'Temporary',
          duration: '14 days',
          reason: 'Employee on leave',
          officer: this.user.name
        },
        {
          date: '10 May 2025, 09:15',
          employee: 'Jane Smith',
          employeeId: 'EMP-10046',
          application: 'Business Intelligence',
          actionType: 'Permanent',
          reason: 'Role change',
          officer: this.user.name
        },
        {
          date: '05 May 2025, 11:20',
          employee: 'Michael Brown',
          employeeId: 'EMP-10047',
          application: 'Loan Management',
          actionType: 'Temporary',
          duration: '30 days',
          reason: 'System maintenance',
          officer: this.user.name
        },
        {
          date: '28 Apr 2025, 16:45',
          employee: 'Sarah Johnson',
          employeeId: 'EMP-10048',
          application: 'HR Management',
          actionType: 'Permanent',
          reason: 'Department transfer',
          officer: this.user.name
        },
        {
          date: '15 Apr 2025, 13:20',
          employee: 'Robert Wilson',
          employeeId: 'EMP-10049',
          application: 'Core Banking',
          actionType: 'Temporary',
          duration: '7 days',
          reason: 'Security policy update',
          officer: this.user.name
        }
      ];
    }
    // Initialize filtered logs
    this.filteredAuditLogs = [...this.userAuditLogs];
  }

  filterAuditLogs(): void {
    if (this.auditDateFilter === 'all') {
      this.filteredAuditLogs = [...this.userAuditLogs];
      return;
    }
    
    const now = new Date();
    let cutoffDate = new Date();
    
    switch (this.auditDateFilter) {
      case 'today':
        cutoffDate.setHours(0, 0, 0, 0); // Start of today
        break;
      case 'week':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        cutoffDate.setDate(now.getDate() - 30);
        break;
      case 'quarter':
        cutoffDate.setDate(now.getDate() - 90);
        break;
    }
    
    this.filteredAuditLogs = this.userAuditLogs.filter(log => {
      const logDate = new Date(log.date);
      return logDate >= cutoffDate;
    });
  }
}







