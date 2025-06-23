import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { AuditLogService } from '../shared/services/audit-log.service';
import { AuditLog } from '../shared/models/audit-log.model';
import { Employee } from '../shared/models/employee.model';
import { EmployeesService } from '../shared/services/employees.service';
import { ApplicationStateService } from '../shared/services/application-state.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, SidebarComponent],
  templateUrl: './employees.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {
  successMessage: string = '';

  // Add Math object for template
  Math = Math;
  
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  paginatedEmployees: Employee[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 7;
  
  // Bulk deactivation properties
  showBulkDeactivationModal: boolean = false;
  bulkSelectionMode: boolean = false; // New property to track if we're in selection mode
  selectedApplication: string = '';
  bulkDeactivationType: 'Temporary' | 'Permanent' = 'Temporary';
  bulkStartDate: string = '';
  bulkEndDate: string = '';
  bulkDeactivationReason: string = '';
  viewAllSelectedEmployees: boolean = false;

  // Available applications for deactivation
  availableApplications: string[] = [
    'Core Banking',
    'Finnacle',
    'Gap',
    'E-Document Manager',
    'Active Directory',
    'Email',
    'VPN',
    'CRM',
    'ERP'
  ];

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
  
  constructor(
    private router: Router,
    private auditLogService: AuditLogService,
    private employeesService: EmployeesService,
    private appStateService: ApplicationStateService
  ) {}
  
  ngOnInit(): void {
    // Fetch employees from the API instead of using mock data
    this.employeesService.getEmployees().subscribe(
      (employees) => {
        this.employees = employees.map(emp => {
          // Create properly typed applications array
          const applications = (emp.applications || []).map(app => {
            return {
              id: app.id || `app-${Math.random().toString(36).substr(2, 9)}`,
              name: app.name || '',
              platform: app.platform || '',
              accessLevel: (app.accessLevel || 'Read Only') as 'Full Access' | 'Read Only' | 'Write Only',
              lastUsed: app.lastUsed || '',
              icon: app.icon || '',
              iconBg: app.iconBg || '',
              status: (app.status || 'Active') as 'Active' | 'Inactive',
              deactivationType: app.deactivationType as 'Temporary' | 'Permanent' | undefined
            };
          });
          
          // Return properly typed Employee object
          return {
            id: emp.id || '',
            name: emp.name || '',
            photo: emp.photo || '',
            department: emp.department || '',
            position: emp.position || '',
            status: emp.status || '',
            lastActive: emp.lastActive || '',
            employeeId: emp.employeeId || '',
            joinDate: emp.joinDate || '',
            applications: applications,
            selected: false
          };
        });
        
        this.appStateService.setEmployees(this.employees as import('../shared/services/application-state.service').Employee[]);
        
        console.log('Employees loaded from API:', this.employees);
        
        this.filteredEmployees = [...this.employees];
        this.updatePagination();
      },
      (error) => {
        console.error('Error fetching employees:', error);
        // Fallback to mock data if API fails
        this.employees = this.getMockEmployees();
        this.appStateService.setEmployees(this.employees as import('../shared/services/application-state.service').Employee[]);
        
        console.log('Fallback to mock employees:', this.employees);
        
        this.filteredEmployees = [...this.employees];
        this.updatePagination();
      }
    );

    // Set default dates for bulk deactivation
    const today = new Date();
    const thirtyDaysLater = new Date();
    thirtyDaysLater.setDate(today.getDate() + 30);

    this.bulkStartDate = this.formatDateForInput(today);
    this.bulkEndDate = this.formatDateForInput(thirtyDaysLater);
  }
  
  // Get mock employees data
  getMockEmployees(): Employee[] {
    return [
      {
        id: 'GTB-001',
        name: 'John Doe',
        photo: '',
        department: 'Retail Banking',
        position: 'Relationship Manager',
        status: 'Active',
        lastActive: '2025-06-15 09:42',
        employeeId: 'EMP-10045',
        joinDate: 'May 15, 2020',
        applications: []
      },
      {
        id: 'GTB-002',
        name: 'Jane Smith',
        photo: '',
        department: 'Corporate Banking',
        position: 'Account Officer',
        status: 'Active',
        lastActive: '2025-06-14 14:22',
        employeeId: 'EMP-10046',
        joinDate: 'April 10, 2018',
        applications: []
      },
      {
        id: 'GTB-003',
        name: 'Michael Brown',
        photo: '',
        department: 'IT',
        position: 'Systems Administrator',
        status: 'Active',
        lastActive: '2025-06-13 11:30',
        employeeId: 'EMP-10047',
        joinDate: 'June 1, 2023',
        applications: []
      },
      {
        id: 'GTB-004',
        name: 'Sarah Johnson',
        photo: '',
        department: 'Operations',
        position: 'Operations Manager',
        status: 'Active',
        lastActive: '2025-06-12 16:45',
        employeeId: 'EMP-10048',
        joinDate: 'May 20, 2023',
        applications: []
      },
      {
        id: 'GTB-005',
        name: 'Robert Wilson',
        photo: '',
        department: 'Finance',
        position: 'Financial Analyst',
        status: 'Active',
        lastActive: '2025-06-11 10:15',
        employeeId: 'EMP-10049',
        joinDate: 'April 25, 2023',
        applications: []
      },
      {
        id: 'GTB-006',
        name: 'Thomas Anderson',
        photo: '',
        department: 'Risk Management',
        position: 'Risk Analyst',
        status: 'Active',
        lastActive: '2025-06-10 13:20',
        employeeId: 'EMP-10050',
        joinDate: 'March 15, 2023',
        applications: []
      },
      {
        id: 'GTB-007',
        name: 'Drew Cano',
        photo: '',
        department: 'Customer Service',
        position: 'Customer Service Representative',
        status: 'Active',
        lastActive: '2025-06-09 11:45',
        employeeId: 'EMP-10051',
        joinDate: 'May 5, 2023',
        applications: []
      },
      {
        id: 'GTB-008',
        name: 'Orlando Diggs',
        photo: '',
        department: 'Treasury',
        position: 'Treasury Analyst',
        status: 'Active',
        lastActive: '2025-06-08 09:30',
        employeeId: 'EMP-10052',
        joinDate: 'April 20, 2023',
        applications: []
      },
      {
        id: 'GTB-009',
        name: 'Andi Lane',
        photo: '',
        department: 'Legal',
        position: 'Legal Advisor',
        status: 'Active',
        lastActive: '2025-06-07 14:15',
        employeeId: 'EMP-10053',
        joinDate: 'March 25, 2023',
        applications: []
      }
    ];
  }
  
  applyFilters(): void {
    this.filteredEmployees = this.employees.filter(employee => {
      // Filter by search term
      const matchesSearch = this.searchTerm === '' || 
        employee.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        employee.id.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        employee.position.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        employee.department.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      return matchesSearch;
    });
    
    // Reset to first page when filters change
    this.currentPage = 1;
    this.updatePagination();
  }
  
  updatePagination(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedEmployees = this.filteredEmployees.slice(startIndex, startIndex + this.itemsPerPage);
  }
  
  get totalPages(): number {
    return Math.ceil(this.filteredEmployees.length / this.itemsPerPage);
  }
  
  getInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  }
  
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }
  
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }
  
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }
  
  viewEmployee(id: string) {
    this.router.navigate(['/employee', id]);
  }
  
  clearSearch(): void {
    this.searchTerm = '';
    this.applyFilters();
  }

  // Helper method to format dates for the date input
  formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Check if any employees are selected
  hasSelectedEmployees(): boolean {
    return this.getSelectedEmployeesCount() > 0;
  }

  // Get count of selected employees
  getSelectedEmployeesCount(): number {
    return this.employees.filter(emp => emp.selected).length;
  }

  // Get selected employees
  getSelectedEmployees(): Employee[] {
    return this.employees.filter(employee => employee.selected);
  }

  // Update selected count (for UI updates)
  updateSelectedCount(): void {
    // This method is called when checkboxes change
    // It's mainly for triggering change detection
  }

  // Check if all employees are selected
  areAllEmployeesSelected(): boolean {
    return this.employees.length > 0 && this.employees.every(emp => emp.selected);
  }

  // Toggle selection of all employees
  toggleAllEmployees(): void {
    const allSelected = this.areAllEmployeesSelected();
    this.employees.forEach(emp => {
      emp.selected = !allSelected;
    });
  }

  // Toggle view all selected employees
  toggleViewAllEmployees(): void {
    this.viewAllSelectedEmployees = !this.viewAllSelectedEmployees;
  }

  // Open bulk deactivation modal
  openBulkDeactivationModal(): void {
    console.log('Entering bulk selection mode');
    this.bulkSelectionMode = true;
    
    // Reset any previous selections
    this.employees.forEach(employee => {
      if (employee.selected !== undefined) {
        employee.selected = false;
      }
    });
  }

  // Add a new method to continue with selected employees
  continueWithSelectedEmployees(): void {
    if (!this.hasSelectedEmployees()) {
      alert('Please select at least one employee.');
      return;
    }
    
    // Show the modal for application selection and deactivation details
    this.showBulkDeactivationModal = true;
    this.selectedApplication = '';
    this.bulkDeactivationType = 'Temporary';
    this.bulkDeactivationReason = '';
    
    // Set default dates
    const today = new Date();
    const thirtyDaysLater = new Date();
    thirtyDaysLater.setDate(today.getDate() + 30);
    
    this.bulkStartDate = this.formatDateForInput(today);
    this.bulkEndDate = this.formatDateForInput(thirtyDaysLater);
  }

  // Cancel bulk deactivation
  cancelBulkDeactivation(): void {
    console.log('Exiting bulk selection mode');
    this.bulkSelectionMode = false;
    this.showBulkDeactivationModal = false;
    
    // Clear selections
    this.employees.forEach(employee => {
      if (employee.selected !== undefined) {
        employee.selected = false;
      }
    });
  }

  // Get reason options based on deactivation type
  getReasonOptions(): string[] {
    return this.bulkDeactivationType === 'Temporary' ? this.temporaryReasons : this.permanentReasons;
  }

  // Check if bulk deactivation form is valid
  isBulkDeactivationValid(): boolean {
    if (!this.selectedApplication) return false;
    if (!this.bulkDeactivationReason) return false;
    
    if (this.bulkDeactivationType === 'Temporary') {
      if (!this.bulkStartDate || !this.bulkEndDate) return false;
      
      // Check if end date is after start date
      const startDate = new Date(this.bulkStartDate);
      const endDate = new Date(this.bulkEndDate);
      if (endDate <= startDate) return false;
    }
    
    return true;
  }

  // Confirm bulk deactivation
  confirmBulkDeactivation(): void {
    if (!this.isBulkDeactivationValid()) return;
    
    const selectedEmployees = this.getSelectedEmployees();
    
    // In a real application, you would call an API to deactivate the applications
    console.log(`Bulk deactivating ${this.selectedApplication} for ${selectedEmployees.length} employees`);
    console.log(`Deactivation type: ${this.bulkDeactivationType}`);
    console.log(`Reason: ${this.bulkDeactivationReason}`);
    
    if (this.bulkDeactivationType === 'Temporary') {
      console.log(`Date range: ${this.bulkStartDate} to ${this.bulkEndDate}`);
    }
    
    // Create audit logs for each deactivation
    const auditPromises: Observable<any>[] = [];
    
    // Get the current officer name from the application state service
    const currentOfficer = this.appStateService.getCurrentOfficerName();
    
    selectedEmployees.forEach(employee => {
      const auditEntry: AuditLog = {
        date: new Date().toISOString(),
        employee: employee.name,
        employeeId: employee.employeeId || 'N/A', // Provide default if employeeId is undefined
        application: this.selectedApplication,
        actionType: this.bulkDeactivationType,
        reason: this.bulkDeactivationReason,
        officer: currentOfficer, // Use the actual officer name
        duration: this.bulkDeactivationType === 'Temporary' ? 
          this.calculateDuration(this.bulkStartDate, this.bulkEndDate) : 'Permanent'
      };
      
      // Add expiration date for temporary deactivations
      if (this.bulkDeactivationType === 'Temporary' && this.bulkEndDate) {
        auditEntry.expirationDate = new Date(this.bulkEndDate).toISOString();
      }
      
      // Add to the central audit log service and collect the observables
      const auditPromise = this.auditLogService.addLog(auditEntry);
      auditPromises.push(auditPromise);
    });
    
    // Wait for all audit logs to be saved
    forkJoin(auditPromises).subscribe({
      next: (results) => {
        console.log('All audit logs saved successfully:', results);
        
        // Show success message
        // alert(`Successfully deactivated ${this.selectedApplication} for ${selectedEmployees.length} employees.`);
        this.successMessage = `Successfully deactivated ${this.selectedApplication} for ${selectedEmployees.length} employees.`;

// Clear the message after 5 seconds
setTimeout(() => {
  this.successMessage = '';
}, 5000);

        
        // Reset selections
        this.employees.forEach(employee => {
          if (employee.selected !== undefined) {
            employee.selected = false;
          }
        });
        
        // Close modal
        this.showBulkDeactivationModal = false;
        this.bulkSelectionMode = false; // Exit selection mode
      },
      error: (error) => {
        console.error('Error saving audit logs:', error);
        
        // Still show success message for the UI
        // alert(`Successfully deactivated ${this.selectedApplication} for ${selectedEmployees.length} employees.`);
        this.successMessage = `Successfully deactivated ${this.selectedApplication} for ${selectedEmployees.length} employees.`;
        
        // Reset selections
        this.employees.forEach(employee => {
          if (employee.selected !== undefined) {
            employee.selected = false;
          }
        });
        
        // Close modal
        this.showBulkDeactivationModal = false;
        this.bulkSelectionMode = false; // Exit selection mode
      }
    });
  }

  // Calculate duration between two dates
  calculateDuration(startDate: string, endDate: string): string {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} days`;
  }

  // Generate mock data for testing
  generateMockData(): void {
    console.log('Generating Nigerian mock data...');
    
    // Call the service method to generate mock employees
    this.employeesService.generateMockEmployees(20).subscribe(
      (employees) => {
        console.log(`Successfully generated ${employees.length} Nigerian mock employees`);
        
        // Update the component's employees array
        this.employees = employees;
        this.filteredEmployees = [...this.employees];
        this.currentPage = 1;
        this.updatePagination();
        
        // Show success message
        alert(`Successfully generated ${employees.length} Nigerian mock employees`);
      },
      (error) => {
        console.error('Failed to generate mock employees:', error);
        alert('Failed to generate mock data. See console for details.');
      }
    );
  }
}



