import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';
import { AuditLogTableComponent, AuditLog } from '../shared/audit-log-table/audit-log-table.component';

interface Application {
  id: string;
  name: string;
  platform: string;
  accessLevel: 'Full Access' | 'Read Only' | 'Write Only';
  lastUsed: string;
  icon: string;
  iconBg: string;
  status?: 'Active' | 'Inactive';
  deactivationType?: 'Temporary' | 'Permanent';
}

interface Employee {
  id: string;
  name: string;
  photo: string;
  department: string;
  position: string;
  status: 'Active' | 'Inactive' | 'Pending';
  lastActive: string;
  employeeId?: string;
  lastAccessReview?: string;
  applications?: Application[];
}

@Component({
  selector: 'app-employee-details',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, SidebarComponent, AuditLogTableComponent],
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.css']
})
export class EmployeeDetailsComponent implements OnInit {
  employeeId: string = '';
  employee: Employee | null = null;
  dateFilter: string = 'all';
  allAuditLogs: AuditLog[] = []; // Store all logs
  auditLogs: AuditLog[] = []; // Filtered logs to display
  
  // Properties for deactivation modal
  showDeactivationModal: boolean = false;
  selectedApp: Application | null = null;
  deactivationType: 'Temporary' | 'Permanent' = 'Temporary';
  startDate: string = '';
  endDate: string = '';
  deactivationReason: string = '';
  permanentDeactivationReason: string = '';
  
  // Predefined reasons for deactivation
  temporaryReasons: string[] = [
    'Employee on leave',
    'Role change',
    'Department transfer',
    'System maintenance',
    'Security policy update',
    'Temporary project reassignment'
  ];
  
  permanentReasons: string[] = [
    'Employee termination',
    'Role elimination',
    'System decommissioning',
    'Security violation',
    'Compliance requirement',
    'Application replacement'
  ];
  
  // Mock data for the employee
  employees: Employee[] = [
    {
      id: 'GTB-001',
      name: 'John Doe',
      photo: '',
      department: 'Retail Banking',
      position: 'Relationship Manager',
      status: 'Active',
      lastActive: '2025-06-15 09:42',
      employeeId: 'EMP-10045',
      lastAccessReview: 'May 15, 2023',
      applications: [
        {
          id: 'app1',
          name: 'Core Banking',
          platform: 'Finacle 11.0',
          accessLevel: 'Full Access',
          lastUsed: 'Today, 9:45 AM',
          icon: 'bank',
          iconBg: '#d1e3ff'
        },
        {
          id: 'app2',
          name: 'Business Intelligence',
          platform: 'Power BI',
          accessLevel: 'Read Only',
          lastUsed: 'Yesterday, 3:15 PM',
          icon: 'chart-line',
          iconBg: '#e9d5ff'
        },
        {
          id: 'app3',
          name: 'Loan Management',
          platform: 'Fusion LMS',
          accessLevel: 'Full Access',
          lastUsed: 'June 12, 2023',
          icon: 'file-invoice-dollar',
          iconBg: '#d1ffdb'
        }
      ]
    },
    {
      id: 'GTB-002',
      name: 'Phoenix Baker',
      photo: '',
      department: 'HR',
      position: 'Account Manager',
      status: 'Active',
      lastActive: '2025-06-15 09:42',
      employeeId: 'EMP-10046',
      lastAccessReview: 'May 20, 2023',
      applications: [
        {
          id: 'app1',
          name: 'Core Banking',
          platform: 'Finacle 11.0',
          accessLevel: 'Read Only',
          lastUsed: 'Today, 10:30 AM',
          icon: 'bank',
          iconBg: '#d1e3ff'
        },
        {
          id: 'app4',
          name: 'HR Management',
          platform: 'Workday',
          accessLevel: 'Full Access',
          lastUsed: 'Today, 8:15 AM',
          icon: 'users',
          iconBg: '#ffe8d1'
        }
      ]
    }
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.employeeId = params['id'];
      this.loadEmployeeDetails();
    });
  }

  loadEmployeeDetails(): void {
    // Find the employee by ID
    this.employee = this.employees.find(emp => emp.id === this.employeeId) || null;
    
    // If employee is found, ensure all applications have a status
    if (this.employee && this.employee.applications) {
      this.employee.applications.forEach(app => {
        if (!app.status) {
          app.status = 'Active';
        }
      });
    }
    
    // If employee is not found, add mock data for all employees in the list
    if (!this.employee) {
      // Add mock data for employees from the employees component
      const mockEmployees: Employee[] = [
        {
          id: 'GTB-003',
          name: 'Lana Steiner',
          photo: '',
          department: 'IT',
          position: 'HR manager',
          status: 'Inactive', // Explicitly using the union type values
          lastActive: '2025-06-15 09:42',
          employeeId: 'EMP-10047',
          lastAccessReview: 'May 25, 2023',
          applications: [
            {
              id: 'app1',
              name: 'Core Banking',
              platform: 'Finacle 11.0',
              accessLevel: 'Read Only',
              lastUsed: 'June 10, 2023',
              icon: 'bank',
              iconBg: '#d1e3ff'
            },
            {
              id: 'app5',
              name: 'IT Service Management',
              platform: 'ServiceNow',
              accessLevel: 'Full Access',
              lastUsed: 'Today, 11:20 AM',
              icon: 'laptop-code',
              iconBg: '#d1ffdb'
            }
          ]
        },
        {
          id: 'GTB-004',
          name: 'Demi Wilkinson',
          photo: '',
          department: 'Operations',
          position: 'Operations Manager',
          status: 'Pending',
          lastActive: '2025-06-15 09:42',
          employeeId: 'EMP-10048',
          lastAccessReview: 'June 1, 2023',
          applications: [
            {
              id: 'app6',
              name: 'Operations Dashboard',
              platform: 'Custom App',
              accessLevel: 'Full Access',
              lastUsed: 'Today, 8:30 AM',
              icon: 'chart-bar',
              iconBg: '#ffe8d1'
            }
          ]
        },
        {
          id: 'GTB-005',
          name: 'Candice Wu',
          photo: '',
          department: 'Finance',
          position: 'Financial Analyst',
          status: 'Active',
          lastActive: '2025-06-15 09:42',
          employeeId: 'EMP-10049',
          lastAccessReview: 'May 30, 2023',
          applications: [
            {
              id: 'app7',
              name: 'Financial Reporting',
              platform: 'SAP',
              accessLevel: 'Full Access',
              lastUsed: 'Yesterday, 4:15 PM',
              icon: 'file-invoice-dollar',
              iconBg: '#d1ffdb'
            },
            {
              id: 'app8',
              name: 'Budget Planning',
              platform: 'Custom App',
              accessLevel: 'Full Access',
              lastUsed: 'Today, 10:45 AM',
              icon: 'calculator',
              iconBg: '#e9d5ff'
            }
          ]
        },
        {
          id: 'GTB-006',
          name: 'Natali Craig',
          photo: '',
          department: 'HR',
          position: 'HR manager',
          status: 'Pending',
          lastActive: '2025-06-15 09:42',
          employeeId: 'EMP-10050',
          lastAccessReview: 'June 5, 2023',
          applications: [
            {
              id: 'app4',
              name: 'HR Management',
              platform: 'Workday',
              accessLevel: 'Full Access',
              lastUsed: 'Today, 9:30 AM',
              icon: 'users',
              iconBg: '#ffe8d1'
            },
            {
              id: 'app9',
              name: 'Recruitment Portal',
              platform: 'Taleo',
              accessLevel: 'Full Access',
              lastUsed: 'Yesterday, 2:20 PM',
              icon: 'user-plus',
              iconBg: '#d1e3ff'
            }
          ]
        },
        {
          id: 'GTB-007',
          name: 'Drew Cano',
          photo: '',
          department: 'Finance',
          position: 'Teller manager',
          status: 'Inactive',
          lastActive: '2025-06-15 09:42',
          employeeId: 'EMP-10051',
          lastAccessReview: 'May 28, 2023',
          applications: [
            {
              id: 'app1',
              name: 'Core Banking',
              platform: 'Finacle 11.0',
              accessLevel: 'Full Access',
              lastUsed: 'June 8, 2023',
              icon: 'bank',
              iconBg: '#d1e3ff'
            },
            {
              id: 'app10',
              name: 'Cash Management',
              platform: 'Custom App',
              accessLevel: 'Full Access',
              lastUsed: 'June 10, 2023',
              icon: 'money-bill-wave',
              iconBg: '#d1ffdb'
            }
          ]
        }
      ];
      
      // Add these mock employees to the employees array
      this.employees = [...this.employees, ...mockEmployees];
      
      // Try to find the employee again
      this.employee = this.employees.find(emp => emp.id === this.employeeId) || null;
    }
    // Load mock audit logs for the employee
    this.loadAuditLogs();
  }

  getInitials(name: string): string {
    if (!name) return '';
    const names = name.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  }

  activateAccess(appId: string): void {
    console.log(`Activating access to application ${appId} for employee ${this.employeeId}`);
    
    // Find the application and update its status
    if (this.employee && this.employee.applications) {
      const app = this.employee.applications.find(a => a.id === appId);
      if (app) {
        app.status = 'Active';
        app.deactivationType = undefined;
      }
    }
    // In a real app, this would call a service to activate access
    // Add to audit log
    if (this.employee && this.employee.applications) {
      const app = this.employee.applications.find(a => a.id === appId);
      if (app) {
        const newLog: AuditLog = {
          date: new Date().toLocaleString('en-US', { 
            day: '2-digit', 
            month: 'short', 
            year: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
          }),
          application: app.name,
          actionType: 'Reactivation', // Explicitly using the union type value
          reason: 'Access restored by UAM officer',
          officer: 'Current User' // In a real app, this would be the logged-in user
        };
        
        this.auditLogs.unshift(newLog);
        this.allAuditLogs.unshift(newLog);
      }
    }
  }

  deactivateAccess(appId: string): void {
    if (this.employee && this.employee.applications) {
      const app = this.employee.applications.find(a => a.id === appId);
      if (app) {
        this.selectedApp = app;
        this.showDeactivationModal = true;
        this.deactivationType = 'Temporary';
        
        // Set default dates (today and 30 days from now)
        const today = new Date();
        const thirtyDaysLater = new Date();
        thirtyDaysLater.setDate(today.getDate() + 30);
        
        this.startDate = this.formatDateForInput(today);
        this.endDate = this.formatDateForInput(thirtyDaysLater);
        this.deactivationReason = ''; // Reset temporary reason
        this.permanentDeactivationReason = ''; // Reset permanent reason
      }
    }
  }
  
  // Helper method to format dates for the date input
  formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  // Cancel deactivation
  cancelDeactivation(): void {
    this.showDeactivationModal = false;
    this.selectedApp = null;
  }
  
  // Confirm deactivation
  confirmDeactivation(): void {
    if (!this.selectedApp) return;
    
    // Validate that a reason is selected
    if (this.deactivationType === 'Temporary' && !this.deactivationReason) {
      alert('Please select a reason for temporary deactivation');
      return;
    }
    
    if (this.deactivationType === 'Permanent' && !this.permanentDeactivationReason) {
      alert('Please select a reason for permanent deactivation');
      return;
    }
    
    // Update the application status
    this.selectedApp.status = 'Inactive';
    this.selectedApp.deactivationType = this.deactivationType;
    
    // Calculate duration for temporary deactivations
    let duration = '';
    if (this.deactivationType === 'Temporary' && this.startDate && this.endDate) {
      const start = new Date(this.startDate);
      const end = new Date(this.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      duration = `${diffDays} days`;
    }
    
    // Get the appropriate reason based on deactivation type
    const reason = this.deactivationType === 'Temporary' 
      ? this.deactivationReason 
      : this.permanentDeactivationReason;
    
    // Add to audit log
    const auditEntry: AuditLog = {
      date: new Date().toLocaleString('en-US', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }),
      application: this.selectedApp.name,
      actionType: this.deactivationType,
      reason: reason,
      officer: 'Current User'
    };
    
    // Add duration for temporary deactivations
    if (this.deactivationType === 'Temporary') {
      auditEntry.duration = duration || '30 days';
    }
    
    this.auditLogs.unshift(auditEntry);
    this.allAuditLogs.unshift(auditEntry);
    
    // Close the modal
    this.showDeactivationModal = false;
    this.selectedApp = null;
  }

  loadAuditLogs(): void {
    // Mock data for audit logs
    if (this.employeeId === 'GTB-001') {
      this.auditLogs = [
        {
          date: '15 Jun 2025, 14:32',
          application: 'Core Banking',
          actionType: 'Temporary',
          duration: '14 days',
          reason: 'Employee on leave',
          officer: 'Sarah James'
        },
        {
          date: '10 May 2025, 09:15',
          application: 'Business Intelligence',
          actionType: 'Permanent',
          reason: 'Role change',
          officer: 'Robert Wilson'
        },
        {
          date: '05 May 2025, 11:20',
          application: 'Business Intelligence',
          actionType: 'Reactivation',
          reason: 'Access review approval',
          officer: 'Thomas Anderson'
        }
      ];
    } else if (this.employeeId === 'GTB-002') {
      this.auditLogs = [
        {
          date: '12 Jun 2025, 10:45',
          application: 'HR Management',
          actionType: 'Temporary',
          reason: 'System maintenance',
          officer: 'Sarah James'
        },
        {
          date: '20 May 2025, 16:30',
          application: 'Core Banking',
          actionType: 'Permanent',
          reason: 'Department transfer',
          officer: 'Robert Wilson'
        }
      ];
    } else {
      // For other employees, generate some random audit logs
      const applications = ['Core Banking', 'HR Management', 'Loan Management', 'Business Intelligence', 'IT Service Management'];
      const actionTypes: ('Temporary' | 'Permanent' | 'Reactivation')[] = ['Temporary', 'Permanent', 'Reactivation'];
      const reasons = ['Employee on leave', 'Role change', 'Department transfer', 'System maintenance', 'Access review approval', 'Security policy update'];
      const officers = ['Sarah James', 'Robert Wilson', 'Thomas Anderson'];
      const durations = ['7 days', '14 days', '30 days', '60 days', '90 days'];
      
      // Generate 0-5 random logs
      const numLogs = Math.floor(Math.random() * 6);
      for (let i = 0; i < numLogs; i++) {
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 30)); // Random date in the last 30 days
        
        const log: AuditLog = {
          date: date.toLocaleString('en-US', { 
            day: '2-digit', 
            month: 'short', 
            year: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
          }),
          application: applications[Math.floor(Math.random() * applications.length)],
          actionType: actionTypes[Math.floor(Math.random() * actionTypes.length)],
          reason: reasons[Math.floor(Math.random() * reasons.length)],
          officer: officers[Math.floor(Math.random() * officers.length)]
        };
        
        // Add duration for temporary deactivations
        if (log.actionType === 'Temporary') {
          log.duration = durations[Math.floor(Math.random() * durations.length)];
        }
        
        this.auditLogs.push(log);
      }
      
      // Sort by date (newest first)
      this.auditLogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }
    // After loading logs, store them in allAuditLogs
    this.allAuditLogs = [...this.auditLogs];
  }
  
  filterAuditLogs(): void {
    if (this.dateFilter === 'all') {
      this.auditLogs = [...this.allAuditLogs];
      return;
    }
    
    const now = new Date();
    let cutoffDate = new Date();
    
    switch (this.dateFilter) {
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
    
    this.auditLogs = this.allAuditLogs.filter(log => {
      const logDate = new Date(log.date);
      return logDate >= cutoffDate;
    });
  }
}









