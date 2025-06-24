import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApplicationStateService, Employee, Application } from '../shared/services/application-state.service';
import { AuditLogService } from '../shared/services/audit-log.service';
import { AuditLogTableComponent } from '../shared/audit-log-table/audit-log-table.component';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';
import { AuditLog } from '../shared/models/audit-log.model';
import { EmployeesService } from '../shared/services/employees.service';

@Component({
  selector: 'app-employee-details',
  templateUrl: './employee-details.component.html',
  styleUrls: ['./employee-details.component.css'],
  encapsulation: ViewEncapsulation.None,
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
    private employeesService: EmployeesService,
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
      
      // Ensure employee has applications
      if (!this.employee.applications || this.employee.applications.length === 0) {
        console.log('Loading applications for employee');
        this.loadEmployeeApplications();
      } else {
        // Load audit logs
        this.loadAuditLogs();
      }
    } else {
      // If not in state service, fetch from API
      console.log('Employee not found in state service, loading from API');
      this.employeesService.getEmployeeById(this.employeeId).subscribe(
        (employee) => {
          this.employee = this.mapToApplicationStateEmployee(employee);
          console.log('Loaded employee from API:', this.employee);
          
          // Update the state service with the fetched employee
          if (this.employee) {
            this.appStateService.updateEmployee(this.employee);
          }
          
          // Ensure employee has applications
          if (this.employee && (!this.employee.applications || this.employee.applications.length === 0)) {
            console.log('Loading applications for employee');
            this.loadEmployeeApplications();
          } else {
            // Load audit logs
            this.loadAuditLogs();
          }
        },
        (error) => {
          console.error('Error fetching employee from API:', error);
          // Fallback to mock data if API fails
          const mockEmployees = this.getMockEmployees();
          this.employee = mockEmployees.find(emp => emp.id === this.employeeId) || null;
          
          if (this.employee) {
            console.log('Fallback to mock employee:', this.employee);
            this.appStateService.updateEmployee(this.employee);
            this.loadAuditLogs();
          }
        }
      );
    }
  }

  loadEmployeeApplications(): void {
  if (this.employee) {
    this.employeesService.getApplicationsByUserId(this.employee.id).subscribe({
      next: (apps) => {
        this.employee!.applications = apps;
        this.appStateService.updateEmployee(this.employee!);
        this.loadAuditLogs();
      },
      error: (err) => {
        console.error('Failed to load applications from API:', err);
      }
    });
  }
}


  // Get mock employees data with complete application data
  getMockEmployees(): Employee[] {
    return [
     
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
    if (!this.employee) return;
    
    // Find the application
    const app = this.employee?.applications?.find(a => a.id === appId);
    
    if (app) {
      // Update application status
      this.appStateService.updateApplicationStatus(this.employeeId, appId, 'Active');
      
      // Create audit log entry
      const newLog: AuditLog = {
        date: new Date().toISOString(), // Use ISO format for consistent parsing
        employee: this.employee.name,
        employeeId: this.employee.employeeId || this.employeeId, // Use the business employeeId
        application: app.name,
        actionType: 'Reactivation',
        reason: 'Access restored by UAM officer',
        officer: this.appStateService.getCurrentOfficerName()
      };
      
      // Add to audit logs
      this.auditLogService.addLog(newLog).subscribe({
        next: (log) => {
          console.log('Reactivation audit log added successfully:', log);
          this.loadAuditLogs();
        },
        error: (error) => {
          console.error('Error adding reactivation audit log:', error);
          // Still update local UI
          this.auditLogs.unshift(newLog);
          this.allAuditLogs.unshift(newLog);
        }
      });
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
    if (!this.employee || !this.selectedApp) return;
    
    // Update application status
    this.appStateService.deactivateApplication(
      this.employeeId, 
      this.selectedApp.id, 
      this.deactivationType,
      this.startDate,
      this.endDate
    );
    
    // Determine reason based on deactivation type
    const reason = this.deactivationType === 'Temporary' 
      ? this.deactivationReason 
      : this.permanentDeactivationReason;
    
    // Calculate duration for temporary deactivations
    let duration = '';
    if (this.deactivationType === 'Temporary' && this.startDate && this.endDate) {
      const start = new Date(this.startDate);
      const end = new Date(this.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      duration = `${diffDays} days`;
    }
    
    // Create audit log entry
    const auditEntry: AuditLog = {
      date: new Date().toISOString(), // Use ISO format for consistent parsing
      employee: this.employee?.name || '',
      employeeId: this.employee?.employeeId || this.employeeId, // Use the business employeeId
      application: this.selectedApp.name,
      actionType: this.deactivationType,
      reason: reason,
      officer: this.appStateService.getCurrentOfficerName()
    };
    
    // Add duration for temporary deactivations
    if (this.deactivationType === 'Temporary') {
      auditEntry.duration = duration || '30 days';
    }
    
    // Add to the central audit log service
    this.auditLogService.addLog(auditEntry).subscribe({
      next: (log) => {
        console.log('Audit log added successfully:', log);
        // Refresh local audit logs
        this.loadAuditLogs();
      },
      error: (error) => {
        console.error('Error adding audit log:', error);
        // Still update local UI
        this.auditLogs.unshift(auditEntry);
        this.allAuditLogs.unshift(auditEntry);
      }
    });
    
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
        employeeId: this.employee.employeeId || this.employeeId, // Use the business employeeId
        application: 'Core Banking',
        actionType: 'Temporary',
        duration: '14 days',
        reason: 'Employee on leave',
        officer: this.appStateService.getCurrentOfficerName()
      },
      {
        date: '10 May 2025, 09:15',
        employee: this.employee.name,
        employeeId: this.employee.employeeId || this.employeeId, // Use the business employeeId
        application: 'Business Intelligence',
        actionType: 'Permanent',
        reason: 'Role change',
        officer: this.appStateService.getCurrentOfficerName()
      },
      {
        date: '05 May 2025, 11:20',
        employee: this.employee.name,
        employeeId: this.employee.employeeId || this.employeeId, // Use the business employeeId
        application: 'Loan Management',
        actionType: 'Temporary',
        duration: '30 days',
        reason: 'System maintenance',
        officer: this.appStateService.getCurrentOfficerName()
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
      
    ];
  }

  goBack(): void {
    this.router.navigate(['/employees']);
  }

  // Map Employee from model to ApplicationStateService format
  private mapToApplicationStateEmployee(employee: any): Employee {
    return {
      ...employee,
      applications: employee.applications?.map((app: any) => ({
        ...app,
        id: app.id || `app-${Math.random().toString(36).substr(2, 9)}` // Ensure id is never undefined
      })) || []
    };
  }
}















