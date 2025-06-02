import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApplicationStateService, Employee, Application } from '../shared/services/application-state.service';
import { AuditLogService } from '../shared/services/audit-log.service';
import { AuditLogTableComponent } from '../shared/audit-log-table/audit-log-table.component';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';
import { AuditLog } from '../shared/models/audit-log.model';

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AuditLogTableComponent,
    SidebarComponent
  ]
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
    'Department closure',
    'System decommissioning',
    'Security violation',
    'Permanent reassignment'
  ];
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appStateService: ApplicationStateService,
    private auditLogService: AuditLogService
  ) {}
  
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.employeeId = params['id'];
      this.loadEmployeeData();
    });
  }
  
  // Helper method to safely get applications
  getApplications(): Application[] {
    return this.employee?.applications || [];
  }
  
  // Helper method to check if employee has applications
  hasApplications(): boolean {
    return !!this.employee?.applications && this.employee.applications.length > 0;
  }

  loadEmployeeData(): void {
    // Try to get employee from state service first
    const stateEmployee = this.appStateService.getEmployeeById(this.employeeId);
    
    if (stateEmployee) {
      this.employee = stateEmployee;
      console.log('Loaded employee from state service:', this.employee);
    } else {
      // If not in state service, use the mock data
      console.log('Employee not found in state service, loading from mock data');
      const mockEmployees = this.getMockEmployees();
      this.employee = mockEmployees.find(emp => emp.id === this.employeeId) || null;
    }
    
    // Ensure employee has applications
    if (this.employee && (!this.employee.applications || this.employee.applications.length === 0)) {
      console.log('Adding mock applications to employee');
      this.employee.applications = this.getMockApplications();
      
      // Update the state service with the updated employee
      this.appStateService.updateEmployee(this.employee);
    }
    
    // Load audit logs
    this.loadAuditLogs();
    
    console.log('Employee data loaded:', this.employee);
  }

  // Get mock employees data with complete application data
  getMockEmployees(): Employee[] {
    return [
      {
        id: 'GTB-001',
        name: 'John Doe',
        photo: '',
        department: 'Retail Banking',
        position: 'Relationship Manager',
        status: 'Active', // This is now a valid value for the union type
        lastActive: '2025-06-15 09:42',
        employeeId: 'EMP-10045',
        joinDate: 'May 15, 2020',
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
          }
        ]
      },
      // Add more employees as needed
      {
        id: 'GTB-002',
        name: 'Jane Smith',
        photo: '',
        department: 'Corporate Banking',
        position: 'Account Officer',
        status: 'Active', // This is now a valid value for the union type
        lastActive: '2025-06-14 14:22',
        employeeId: 'EMP-10046',
        joinDate: 'April 10, 2018',
        applications: [
          {
            id: 'app1',
            name: 'Core Banking',
            platform: 'Finacle 11.0',
            accessLevel: 'Full Access',
            lastUsed: 'Today, 10:15 AM',
            icon: 'bank',
            iconBg: '#d1e3ff',
            status: 'Active'
          },
          {
            id: 'app2',
            name: 'Finnacle',
            platform: 'Finnacle 10.2',
            accessLevel: 'Read Only',
            lastUsed: '2 days ago',
            icon: 'chart-line',
            iconBg: '#e9d5ff',
            status: 'Active'
          }
        ]
      }
    ];
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
        // Check if the app was permanently deactivated
        if (app.deactivationType === 'Permanent') {
          // Show an error message or alert
          alert('This application was permanently deactivated and cannot be reactivated.');
          return;
        }
        
        app.status = 'Active';
        app.deactivationType = undefined;
        
        // Update the state service
        this.appStateService.updateApplicationStatus(
          this.employeeId,
          appId,
          'Active'
        );
        
        // Create audit log entry
        const newLog: AuditLog = {
          date: new Date().toLocaleString('en-US', { 
            day: '2-digit', 
            month: 'short', 
            year: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false
          }),
          employee: this.employee.name,
          employeeId: this.employeeId,
          application: app.name,
          actionType: 'Reactivation',
          reason: 'Access restored by UAM officer',
          officer: 'Current User'
        };
        
        // Add to audit logs
        this.auditLogService.addLog(newLog);
        this.loadAuditLogs();
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
    
    // Update the state service
    this.appStateService.updateApplicationStatus(
      this.employeeId,
      this.selectedApp.id,
      'Inactive',
      this.deactivationType
    );
    
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
    
    // Create audit log entry
    const auditEntry: AuditLog = {
      date: new Date().toLocaleString('en-US', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false
      }),
      employee: this.employee?.name || '',
      employeeId: this.employeeId,
      application: this.selectedApp.name,
      actionType: this.deactivationType,
      reason: reason,
      officer: 'Current User'
    };
    
    // Add duration for temporary deactivations
    if (this.deactivationType === 'Temporary') {
      auditEntry.duration = duration || '30 days';
    }
    
    // Add to local arrays
    this.auditLogs.unshift(auditEntry);
    this.allAuditLogs.unshift(auditEntry);
    
    // Add to the central audit log service
    this.auditLogService.addLog(auditEntry);
    
    // Close the modal
    this.showDeactivationModal = false;
    this.selectedApp = null;
  }

  loadAuditLogs(): void {
    // Create some mock audit logs if none exist
    if (!this.employee) return;
    
    // Try to get logs from the service first
    this.auditLogService.getLogsByEmployee(this.employeeId).subscribe((logs: AuditLog[]) => {
      if (logs && logs.length > 0) {
        this.auditLogs = logs;
        this.allAuditLogs = [...logs];
      } else {
        // Create mock audit logs if none exist
        this.createMockAuditLogs();
      }
      
      // Apply filters
      this.filterAuditLogs();
      
      console.log('Audit logs loaded:', this.auditLogs);
    });
  }

  // Add a method to create mock audit logs
  createMockAuditLogs(): void {
    if (!this.employee) return;
    
    const mockLogs: AuditLog[] = [
      {
        date: '15 Jun 2025, 14:32',
        employee: this.employee.name,
        employeeId: this.employeeId,
        application: 'Core Banking',
        actionType: 'Temporary',
        duration: '14 days',
        reason: 'Employee on leave',
        officer: 'Current User'
      },
      {
        date: '10 May 2025, 09:15',
        employee: this.employee.name,
        employeeId: this.employeeId,
        application: 'Business Intelligence',
        actionType: 'Permanent',
        reason: 'Role change',
        officer: 'Current User'
      },
      {
        date: '05 May 2025, 11:20',
        employee: this.employee.name,
        employeeId: this.employeeId,
        application: 'Loan Management',
        actionType: 'Temporary',
        duration: '30 days',
        reason: 'System maintenance',
        officer: 'Current User'
      }
    ];
    
    // Add the mock logs to the service
    mockLogs.forEach(log => this.auditLogService.addLog(log));
    
    // Update local arrays
    this.auditLogs = [...mockLogs];
    this.allAuditLogs = [...mockLogs];
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

  // Add a method to get mock applications
  getMockApplications(): Application[] {
    return [
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
      }
    ];
  }

  goBack(): void {
    this.router.navigate(['/employees']);
  }
}































