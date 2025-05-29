import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';
import { AuditLogTableComponent, AuditLog } from '../shared/audit-log-table/audit-log-table.component';
// import { saveAs } from 'file-saver';

@Component({
  selector: 'app-audit-trail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, SidebarComponent, AuditLogTableComponent],
  templateUrl: './audit-trail.component.html',
  styleUrls: ['./audit-trail.component.css']
})
export class AuditTrailComponent implements OnInit {
  searchTerm: string = '';
  dateFilter: string = 'all';
  actionTypeFilter: string = 'All Actions';
  applicationFilter: string = 'All Applications';
  officerFilter: string = 'All Officers';
  
  // Current user info - in a real app, this would come from an auth service
  currentUser: string = 'Current User';
  
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  
  // All audit logs
  auditLogs: AuditLog[] = [];
  
  // Get unique applications for filter dropdown
  get uniqueApplications(): string[] {
    const apps = this.auditLogs.map(log => log.application);
    return [...new Set(apps)].sort();
  }
  
  constructor(private cdr: ChangeDetectorRef) { }
  
  ngOnInit(): void {
    // Initialize filter values
    this.dateFilter = 'all';
    this.actionTypeFilter = 'All Actions';
    this.applicationFilter = 'All Applications';
    this.officerFilter = 'All Officers';
    
    // Load data
    this.loadAuditLogs();
    
    // Apply initial filters
    this.applyFilters();
    
    // Log initial filter state
    console.log('Initial filter state:', {
      dateFilter: this.dateFilter,
      actionTypeFilter: this.actionTypeFilter,
      applicationFilter: this.applicationFilter,
      officerFilter: this.officerFilter,
      hasActiveFilters: this.hasActiveFilters()
    });
  }
  
  loadAuditLogs(): void {
    // Mock data for audit logs - in a real app, this would come from a service
    this.auditLogs = [
      {
        id: 'log1',
        date: '15 Jun 2025, 14:32',
        employee: 'John Doe',
        employeeId: 'EMP-10045',
        application: 'Core Banking',
        actionType: 'Temporary',
        duration: '14 days',
        reason: 'Employee on leave',
        officer: 'Sarah James'
      },
      {
        id: 'log2',
        date: '10 May 2025, 09:15',
        employee: 'John Doe',
        employeeId: 'EMP-10045',
        application: 'Business Intelligence',
        actionType: 'Permanent',
        reason: 'Role change',
        officer: 'Robert Wilson'
      },
      {
        id: 'log3',
        date: '05 May 2025, 11:20',
        employee: 'John Doe',
        employeeId: 'EMP-10045',
        application: 'Business Intelligence',
        actionType: 'Reactivation',
        reason: 'Access review approval',
        officer: 'Thomas Anderson'
      },
      {
        id: 'log4',
        date: '12 Jun 2025, 10:45',
        employee: 'Phoenix Baker',
        employeeId: 'EMP-10046',
        application: 'HR Management',
        actionType: 'Temporary',
        duration: '30 days',
        reason: 'System maintenance',
        officer: 'Sarah James'
      },
      {
        id: 'log5',
        date: '20 May 2025, 16:30',
        employee: 'Phoenix Baker',
        employeeId: 'EMP-10046',
        application: 'Core Banking',
        actionType: 'Permanent',
        reason: 'Department transfer',
        officer: 'Robert Wilson'
      },
      {
        id: 'log6',
        date: '18 Jun 2025, 09:30',
        employee: 'Lana Steiner',
        employeeId: 'EMP-10047',
        application: 'Core Banking',
        actionType: 'Temporary',
        duration: '7 days',
        reason: 'Employee on leave',
        officer: 'Thomas Anderson'
      },
      {
        id: 'log7',
        date: '15 Jun 2025, 11:45',
        employee: 'Demi Wilkinson',
        employeeId: 'EMP-10048',
        application: 'IT Service Management',
        actionType: 'Reactivation',
        reason: 'Access review approval',
        officer: 'Sarah James'
      },
      {
        id: 'log8',
        date: '10 Jun 2025, 14:20',
        employee: 'Candice Wu',
        employeeId: 'EMP-10049',
        application: 'Financial Reporting',
        actionType: 'Permanent',
        reason: 'Security violation',
        officer: 'Robert Wilson'
      },
      {
        id: 'log9',
        date: '05 Jun 2025, 16:15',
        employee: 'Natali Craig',
        employeeId: 'EMP-10050',
        application: 'HR Management',
        actionType: 'Temporary',
        duration: '14 days',
        reason: 'System maintenance',
        officer: 'Thomas Anderson'
      },
      {
        id: 'log10',
        date: '01 Jun 2025, 10:30',
        employee: 'Drew Cano',
        employeeId: 'EMP-10051',
        application: 'Core Banking',
        actionType: 'Reactivation',
        reason: 'Access review approval',
        officer: 'Sarah James'
      },
      {
        id: 'log11',
        date: '28 May 2025, 09:45',
        employee: 'Orlando Diggs',
        employeeId: 'EMP-10052',
        application: 'Cash Management',
        actionType: 'Permanent',
        reason: 'Role elimination',
        officer: 'Robert Wilson'
      },
      {
        id: 'log12',
        date: '25 May 2025, 14:10',
        employee: 'Andi Lane',
        employeeId: 'EMP-10053',
        application: 'Customer Relationship',
        actionType: 'Temporary',
        duration: '30 days',
        reason: 'Department transfer',
        officer: 'Thomas Anderson'
      }
    ];
    
    console.log('Loaded audit logs:', this.auditLogs.length);
  }
  
  get filteredLogs() {
    console.log('Filtering logs with criteria:', {
      dateFilter: this.dateFilter,
      actionTypeFilter: this.actionTypeFilter,
      applicationFilter: this.applicationFilter,
      officerFilter: this.officerFilter
    });
    
    return this.auditLogs.filter(log => {
      // Filter by search term
      const matchesSearch = this.searchTerm === '' || 
        (log.employee && log.employee.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (log.employeeId && log.employeeId.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (log.application && log.application.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (log.reason && log.reason.toLowerCase().includes(this.searchTerm.toLowerCase()));
      
      // Filter by date
      let matchesDate = true;
      if (this.dateFilter !== 'all') {
        try {
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
          
          // Parse the date string properly
          const dateParts = log.date.split(',')[0].split(' ');
          const month = this.getMonthNumber(dateParts[1]);
          const day = parseInt(dateParts[0]);
          const year = parseInt(dateParts[2]);
          const logDate = new Date(year, month, day);
          
          matchesDate = logDate >= cutoffDate;
        } catch (error) {
          console.error('Error parsing date:', log.date, error);
          matchesDate = true; // Default to showing the log if date parsing fails
        }
      }
      
      // Filter by action type
      const matchesActionType = this.actionTypeFilter === 'All Actions' || 
        log.actionType === this.actionTypeFilter;
      
      // Filter by application
      const matchesApplication = this.applicationFilter === 'All Applications' || 
        log.application === this.applicationFilter;
      
      // Filter by officer (who performed the action)
      const matchesOfficer = this.officerFilter === 'All Officers' || 
        (this.officerFilter === 'Current User' && log.officer === this.currentUser) ||
        log.officer === this.officerFilter;

      return matchesSearch && matchesDate && matchesActionType && matchesApplication && matchesOfficer;
    });
  }
  
  get paginatedLogs(): AuditLog[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const paginatedData = this.filteredLogs.slice(startIndex, startIndex + this.itemsPerPage);
    console.log('Paginated logs:', paginatedData.length, 'of', this.filteredLogs.length, 'filtered logs');
    return paginatedData;
  }
  
  get totalPages(): number {
    return Math.ceil(this.filteredLogs.length / this.itemsPerPage);
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
  
  clearSearch(): void {
    this.searchTerm = '';
    this.clearFilters(); // Also clear filters when clearing search
  }

  exportAuditTrails(): void {
    // Create export data
    const exportData = {
      title: 'Audit Trails Report',
      filters: {
        dateFilter: this.dateFilter,
        actionTypeFilter: this.actionTypeFilter,
        applicationFilter: this.applicationFilter,
        officerFilter: this.officerFilter,
        searchTerm: this.searchTerm
      },
      generatedAt: new Date().toISOString(),
      generatedBy: this.currentUser,
      totalRecords: this.filteredLogs.length,
      records: this.filteredLogs
    };
    
    // Convert to JSON string
    const jsonData = JSON.stringify(exportData, null, 2);
    
    // Create blob and download using native browser APIs
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-trails-${this.formatDate(new Date())}.json`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    // Show success message
    alert('Audit trails exported successfully!');
  }

  // Helper method to format date for filename
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Add a method to manually trigger filtering
  applyFilters(): void {
    console.log('Applying filters:', {
      dateFilter: this.dateFilter,
      actionTypeFilter: this.actionTypeFilter,
      applicationFilter: this.applicationFilter,
      officerFilter: this.officerFilter,
      searchTerm: this.searchTerm
    });
    
    // Force change detection by reassigning currentPage
    this.currentPage = 1;
    
    // Explicitly trigger change detection
    this.cdr.detectChanges();
    
    // Log the filtered results to verify
    console.log('Filtered logs count:', this.filteredLogs.length);
  }

  // Helper method to convert month name to number with proper typing
  private getMonthNumber(monthName: string): number {
    const months: { [key: string]: number } = {
      'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
      'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
    };
    
    // Use type guard to check if the key exists in the months object
    if (monthName in months) {
      return months[monthName];
    }
    
    // Return default value if month name is not found
    console.warn(`Unknown month name: ${monthName}, defaulting to January (0)`);
    return 0;
  }

  // Add methods to handle the clear filters functionality
  clearFilters(): void {
    // Reset all filters to their default values
    this.dateFilter = 'all';
    this.actionTypeFilter = 'All Actions';
    this.applicationFilter = 'All Applications';
    this.officerFilter = 'All Officers';
    
    // Keep the search term as is
    
    // Apply the updated filters
    this.applyFilters();
  }

  // Method to check if any filters are active
  hasActiveFilters(): boolean {
    const result = this.dateFilter !== 'all' || 
           this.actionTypeFilter !== 'All Actions' || 
           this.applicationFilter !== 'All Applications' || 
           this.officerFilter !== 'All Officers';
    
    console.log('hasActiveFilters check:', {
      dateFilter: this.dateFilter,
      actionTypeFilter: this.actionTypeFilter,
      applicationFilter: this.applicationFilter,
      officerFilter: this.officerFilter,
      result: result
    });
    
    return result;
  }
}














