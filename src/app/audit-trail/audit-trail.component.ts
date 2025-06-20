import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { AuditLogService } from '../shared/services/audit-log.service';
import { AuditLog } from '../shared/models/audit-log.model';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';
import { AuditLogTableComponent } from '../shared/audit-log-table/audit-log-table.component';

@Component({
  selector: 'app-audit-trail',
  templateUrl: './audit-trail.component.html',
  styleUrls: ['./audit-trail.component.css'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SidebarComponent,
    AuditLogTableComponent
  ]
})
export class AuditTrailComponent implements OnInit, OnDestroy {
  // Math object for template
  Math = Math;
  
  // Subscriptions
  private logSubscription: Subscription | null = null;
  
  // Other properties remain the same
  searchTerm: string = '';
  startDate: string = '';
  endDate: string = '';
  datePreset: string = 'all';
  dateFilter: string = 'all';
  actionTypeFilter: string = 'All Actions';
  applicationFilter: string = 'All Applications';
  officerFilter: string = 'All Officers';
  
  // Current user info
  currentUser: string = 'Current User';
  
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 8;
  
  // All audit logs
  auditLogs: AuditLog[] = [];
  filteredLogs: AuditLog[] = [];
  
  // For date range dialog
  showDateRangeDialog: boolean = false;
  tempStartDate: string = '';
  tempEndDate: string = '';
  
  // Unique applications for filter dropdown
  uniqueApplications: string[] = [];
  
  constructor(private auditLogService: AuditLogService) { }
  
  ngOnInit(): void {
    // Force refresh logs from server
    this.auditLogService.refreshLogs();
    
    // Subscribe to logs$ observable to get real-time updates
    this.logSubscription = this.auditLogService.logs$.subscribe(logs => {
      console.log('Audit Trail Component - Received updated logs:', logs.length);
      this.auditLogs = logs;
      this.applyFilters();
      
      // Extract unique applications for filter
      this.uniqueApplications = [...new Set(logs.map(log => log.application).filter(app => app))];
    });
  }
  
  ngOnDestroy(): void {
    // Clean up subscription
    if (this.logSubscription) {
      this.logSubscription.unsubscribe();
    }
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
  
  clearSearch(): void {
    this.searchTerm = '';
    this.clearFilters(); // Also clear filters when clearing search
  }

  // Add pagination methods
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

  // Add method for date preset change
  onDatePresetChange(): void {
    if (this.datePreset === 'custom') {
      this.showDateRangeDialog = true;
      this.tempStartDate = this.startDate;
      this.tempEndDate = this.endDate;
    } else {
      this.applyFilters();
    }
  }

  // Add method to apply date range
  applyDateRange(): void {
    this.startDate = this.tempStartDate;
    this.endDate = this.tempEndDate;
    this.showDateRangeDialog = false;
    this.applyFilters();
  }

  // Add method to cancel date range dialog
  cancelDateRange(): void {
    this.showDateRangeDialog = false;
    if (!this.startDate || !this.endDate) {
      this.datePreset = 'all';
    }
  }

  // Add method to clear filters
  clearFilters(): void {
    this.datePreset = 'all';
    this.startDate = '';
    this.endDate = '';
    this.actionTypeFilter = 'All Actions';
    this.applicationFilter = 'All Applications';
    this.officerFilter = 'All Officers';
    this.applyFilters();
  }

  exportAuditTrails(): void {
    // Create CSV content
    let csvContent = 'Date,Employee,Employee ID,Application,Action Type,Expiration Date,Reason,Officer\n';
    
    // Add data rows
    this.filteredLogs.forEach(log => {
      const row = [
        new Date(log.date).toLocaleDateString(),
        log.employee || '',
        log.employeeId || '',
        log.application || '',
        log.actionType || '',
        log.expirationDate ? new Date(log.expirationDate).toLocaleDateString() : '',
        log.reason || '',
        log.officer || ''
      ];
      
      // Escape any commas in the data
      const escapedRow = row.map(cell => {
        if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
          return `"${cell.replace(/"/g, '""')}"`;
        }
        return cell;
      });
      
      csvContent += escapedRow.join(',') + '\n';
    });
    
    // Create a blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `audit-trails-${this.formatDate(new Date())}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
    console.log('Applying filters with search term:', this.searchTerm);
    
    // Start with all logs
    let filtered = [...this.auditLogs];
    console.log('Starting with all logs:', filtered.length);
    
    // Apply search filter if there is a search term
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      const term = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(log => 
        (log.employee && log.employee.toLowerCase().includes(term)) ||
        (log.employeeId && log.employeeId.toLowerCase().includes(term)) ||
        (log.application && log.application.toLowerCase().includes(term)) ||
        (log.actionType && log.actionType.toLowerCase().includes(term)) ||
        (log.reason && log.reason.toLowerCase().includes(term)) ||
        (log.officer && log.officer.toLowerCase().includes(term))
      );
      console.log('After search filter:', filtered.length);
    }
    
    // Apply custom date range filter
    if (this.datePreset === 'custom' && this.startDate && this.endDate) {
      try {
        const startDate = new Date(this.startDate);
        const endDate = new Date(this.endDate);
        // Set end date to end of day
        endDate.setHours(23, 59, 59, 999);
        
        filtered = filtered.filter(log => {
          const logDate = new Date(log.date);
          return logDate >= startDate && logDate <= endDate;
        });
        console.log('After custom date range filter:', filtered.length);
      } catch (error) {
        console.error('Error filtering by date range:', error);
      }
    }
    
    // Apply action type filter
    if (this.actionTypeFilter !== 'All Actions') {
      filtered = filtered.filter(log => 
        log.actionType === this.actionTypeFilter
      );
      console.log('After action type filter:', filtered.length);
    }
    
    // Apply application filter
    if (this.applicationFilter !== 'All Applications') {
      filtered = filtered.filter(log => 
        log.application === this.applicationFilter
      );
      console.log('After application filter:', filtered.length);
    }
    
    // Apply officer filter
    if (this.officerFilter !== 'All Officers') {
      if (this.officerFilter === 'Current User') {
        filtered = filtered.filter(log => 
          log.officer === this.currentUser
        );
      } else {
        filtered = filtered.filter(log => 
          log.officer === this.officerFilter
        );
      }
      console.log('After officer filter:', filtered.length);
    }
    
    // Update filtered logs
    this.filteredLogs = filtered;
    console.log('Final filtered logs:', this.filteredLogs.length);
    
    // Reset to page 1 when filters change
    this.currentPage = 1;
    
    // Update pagination
    this.updatePagination();
  }

  updatePagination(): void {
    // Calculate total pages
    const totalPages = Math.ceil(this.filteredLogs.length / this.itemsPerPage);
    
    // Ensure current page is valid
    if (this.currentPage > totalPages) {
      this.currentPage = Math.max(1, totalPages);
    }
  }

  // Add this method to match the HTML template
  cancelDateRangeDialog(): void {
    this.cancelDateRange(); // Reuse the existing method
  }
}


