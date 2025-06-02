import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AuditLogService } from '../shared/services/audit-log.service';
import { AuditLog } from '../shared/models/audit-log.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';
import { AuditLogTableComponent } from '../shared/audit-log-table/audit-log-table.component';
// import { saveAs } from 'file-saver';

@Component({
  selector: 'app-audit-trail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, SidebarComponent, AuditLogTableComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // Use CUSTOM_ELEMENTS_SCHEMA instead
  templateUrl: './audit-trail.component.html',
  styleUrls: ['./audit-trail.component.css']
})
export class AuditTrailComponent implements OnInit {
  // Math object for template
  Math = Math;
  
  searchTerm: string = '';
  startDate: string = '';
  endDate: string = '';
  datePreset: string = 'all';
  dateFilter: string = 'all';
  actionTypeFilter: string = 'All Actions';
  applicationFilter: string = 'All Applications';
  officerFilter: string = 'All Officers';
  
  // Current user info - in a real app, this would come from an auth service
  currentUser: string = 'Current User';
  
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 8;  // Changed from 10 to 8
  
  // Pagination methods
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
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
  
  // All audit logs
  auditLogs: AuditLog[] = [];
  
  // Get unique applications for filter dropdown
  get uniqueApplications(): string[] {
    const apps = this.auditLogs.map(log => log.application);
    return [...new Set(apps)].sort();
  }
  
  constructor(private auditLogService: AuditLogService) { }
  
  ngOnInit(): void {
    this.loadAuditLogs();
  }
  
  loadAuditLogs(): void {
    this.auditLogService.getAllLogs().subscribe(logs => {
      console.log('Audit Trail Component - All logs loaded:', logs.length);
      
      // Count by action type for debugging
      const tempCount = logs.filter(log => log.actionType === 'Temporary').length;
      const permCount = logs.filter(log => log.actionType === 'Permanent').length;
      const reactCount = logs.filter(log => log.actionType === 'Reactivation').length;
      
      console.log('Audit Trail Component - Action type counts:', {
        temporary: tempCount,
        permanent: permCount,
        reactivation: reactCount,
        total: logs.length
      });
      
      this.auditLogs = logs;
      this.applyFilters();
    });
  }
  
  filteredLogs: AuditLog[] = [];

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

  exportAuditTrails(): void {
    // Create CSV content
    let csvContent = 'Date,Employee,Employee ID,Application,Action Type,Expiration Date,Reason,Officer\n';
    
    // Add data rows
    this.filteredLogs.forEach(log => {
      // Format each field and handle commas by wrapping in quotes if needed
      const formatField = (field: string | Date): string => {
        if (field === undefined || field === null) return '';
        
        // Convert Date objects to string
        const fieldStr = field instanceof Date ? field.toLocaleString() : String(field);
        
        // If field contains commas, quotes, or newlines, wrap in quotes and escape any quotes
        return fieldStr.includes(',') || fieldStr.includes('"') || fieldStr.includes('\n') 
          ? `"${fieldStr.replace(/"/g, '""')}"` 
          : fieldStr;
      };
      
      // Calculate expiration date
      let expirationDate = '';
      if (log.actionType === 'Temporary') {
        expirationDate = this.getExpirationDate(log);
      } else {
        expirationDate = 'Not Applicable';
      }
      
      const row = [
        formatField(log.date),
        formatField(log.employee || ''),
        formatField(log.employeeId || ''),
        formatField(log.application),
        formatField(log.actionType),
        formatField(expirationDate),
        formatField(log.reason),
        formatField(log.officer)
      ];
      
      csvContent += row.join(',') + '\n';
    });
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-trails-${this.formatDate(new Date())}.csv`;
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
    
    // Apply date filter
    if (this.datePreset !== 'all') {
      const now = new Date();
      let cutoffDate = new Date();
      
      switch (this.datePreset) {
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
      
      filtered = filtered.filter(log => {
        const logDate = new Date(log.date);
        return logDate >= cutoffDate;
      });
      console.log('After date filter:', filtered.length);
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
          log.officer === 'Current User'
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
    this.datePreset = 'all';
    this.startDate = '';
    this.endDate = '';
    
    this.actionTypeFilter = 'All Actions';
    this.applicationFilter = 'All Applications';
    this.officerFilter = 'All Officers';
    
    // Apply the updated filters
    this.applyFilters();
  }

  // Method to check if any filters are active
  hasActiveFilters(): boolean {
    return this.datePreset !== 'all' || 
           this.actionTypeFilter !== 'All Actions' || 
           this.applicationFilter !== 'All Applications' || 
           this.officerFilter !== 'All Officers';
  }

  // Add properties for date range dialog
  showDateRangeDialog: boolean = false;
  tempStartDate: string = '';
  tempEndDate: string = '';
  selectedDateRangeText: string = 'All Time';

  // Method to handle date preset change
  onDatePresetChange(): void {
    if (this.datePreset === 'custom') {
      // Show the date range dialog
      this.showDateRangeDialog = true;
      
      // Initialize with current values or defaults
      if (!this.startDate || !this.endDate) {
        const today = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);
        
        this.tempStartDate = this.formatDateForInput(thirtyDaysAgo);
        this.tempEndDate = this.formatDateForInput(today);
      } else {
        this.tempStartDate = this.startDate;
        this.tempEndDate = this.endDate;
      }
    } else {
      // Apply the selected preset directly
      this.applyDatePreset();
    }
  }

  // Method to cancel the date range dialog
  cancelDateRangeDialog(): void {
    this.showDateRangeDialog = false;
    
    // If we were previously using a different preset, revert to it
    if (this.datePreset === 'custom' && !this.startDate) {
      this.datePreset = 'all'; // Default to "All Time" if no custom range was previously set
    }
  }

  // Method to apply the selected date range
  applyDateRange(): void {
    this.startDate = this.tempStartDate;
    this.endDate = this.tempEndDate;
    this.showDateRangeDialog = false;
    
    // Format the selected date range for display
    try {
      const startDate = new Date(this.startDate);
      const endDate = new Date(this.endDate);
      this.selectedDateRangeText = `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
    } catch (error) {
      console.error('Error formatting date range text:', error);
      this.selectedDateRangeText = 'Custom Range';
    }
    
    // Apply filters with the new date range
    this.applyFilters();
  }

  // Method to apply date presets
  applyDatePreset(): void {
    const today = new Date();
    let startDate = new Date();
    
    switch (this.datePreset) {
      case 'today':
        // Set to start of today
        startDate.setHours(0, 0, 0, 0);
        this.selectedDateRangeText = 'Today';
        break;
      case 'week':
        // Set to 7 days ago
        startDate.setDate(today.getDate() - 7);
        this.selectedDateRangeText = 'Last 7 Days';
        break;
      case 'month':
        // Set to 30 days ago
        startDate.setDate(today.getDate() - 30);
        this.selectedDateRangeText = 'Last 30 Days';
        break;
      case 'quarter':
        // Set to 90 days ago
        startDate.setDate(today.getDate() - 90);
        this.selectedDateRangeText = 'Last 90 Days';
        break;
      case 'all':
        // For "All Time", we don't need specific dates
        this.startDate = '';
        this.endDate = '';
        this.selectedDateRangeText = 'All Time';
        this.applyFilters();
        return;
      case 'custom':
        // This should be handled by the dialog, not here
        return;
    }
    
    // Format dates for input fields (YYYY-MM-DD)
    this.startDate = this.formatDateForInput(startDate);
    this.endDate = this.formatDateForInput(today);
    
    // Apply the filters with the new date range
    this.applyFilters();
  }

  // Helper method to format dates for input fields
  formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Helper method to format date for file names
  // This method is already defined elsewhere in the component, so we're removing the duplicate

  updatePagination(): void {
    // Calculate total pages
    const totalPages = Math.ceil(this.filteredLogs.length / this.itemsPerPage);
    
    // Ensure current page is valid
    if (this.currentPage > totalPages) {
      this.currentPage = Math.max(1, totalPages);
    }
  }

  // Add the getExpirationDate method if it doesn't exist in the component
  getExpirationDate(log: AuditLog): string {
    if (log.expirationDate) {
      return log.expirationDate;
    }
    
    if (!log.duration) {
      return 'Unknown';
    }
    
    // Parse the log date
    const logDate = new Date(log.date);
    
    // Extract the number of days from the duration string
    const durationMatch = log.duration.match(/(\d+)/);
    if (!durationMatch) {
      return log.duration; // Return original duration if parsing fails
    }
    
    const days = parseInt(durationMatch[1], 10);
    
    // Calculate expiration date
    const expirationDate = new Date(logDate);
    expirationDate.setDate(logDate.getDate() + days);
    
    // Format the date as DD MMM YYYY
    return expirationDate.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }
}

// Remove the updatePagination method that's outside the class













