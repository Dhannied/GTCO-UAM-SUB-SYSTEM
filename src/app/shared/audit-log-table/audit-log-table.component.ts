import { Component, Input, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditLog } from '../models/audit-log.model';

@Component({
  selector: 'app-audit-log-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './audit-log-table.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./audit-log-table.component.css']
})
export class AuditLogTableComponent implements OnChanges {
  @Input() logs: AuditLog[] = [];
  @Input() showEmployee: boolean = true;
  @Input() showReason: boolean = true;
  @Input() showDuration: boolean = true;
  @Input() showOfficer: boolean = true;
  @Input() showPagination: boolean = true;
  @Input() maxHeight: string = 'none'; // Default to 'none' instead of a fixed height
  
  // Pagination
  @Input() itemsPerPage: number = 10;
  currentPage: number = 1;
  totalPages: number = 1;
  paginatedLogs: AuditLog[] = [];
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['logs']) {
      this.updatePagination();
    }
  }
  
  updatePagination(): void {
    this.totalPages = Math.ceil(this.logs.length / this.itemsPerPage);
    if (this.totalPages === 0) this.totalPages = 1;
    
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
    
    this.updatePaginatedLogs();
  }
  
  updatePaginatedLogs(): void {
    if (this.showPagination) {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      this.paginatedLogs = this.logs.slice(startIndex, endIndex);
    } else {
      this.paginatedLogs = this.logs;
    }
  }
  
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedLogs();
    }
  }
  
  getColspan(): number {
    let count = 3; // Date, Application, Action Type are always shown
    if (this.showEmployee) count++;
    if (this.showDuration) count++;
    if (this.showReason) count++;
    if (this.showOfficer) count++;
    return count;
  }
  
  // Format date to be more user-friendly, with option to exclude time
  formatDate(dateString: string, includeTime: boolean = true): string {
    try {
      const date = new Date(dateString);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return dateString; // Return original if parsing fails
      }
      
      // Get current date for comparison
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      // If we don't want to include time, just return the date part
      if (!includeTime) {
        return date.toLocaleDateString('en-US', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        });
      }
      
      // Check if date is today or yesterday
      if (date.getFullYear() === today.getFullYear() && 
          date.getMonth() === today.getMonth() && 
          date.getDate() === today.getDate()) {
        // Today - show "Today at HH:MM"
        return `Today at ${date.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        })}`;
      } else if (date.getFullYear() === yesterday.getFullYear() && 
                date.getMonth() === yesterday.getMonth() && 
                date.getDate() === yesterday.getDate()) {
        // Yesterday - show "Yesterday at HH:MM"
        return `Yesterday at ${date.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        })}`;
      } else if (date.getFullYear() === now.getFullYear()) {
        // This year - show "DD MMM at HH:MM"
        return `${date.toLocaleDateString('en-US', { 
          day: '2-digit', 
          month: 'short'
        })} at ${date.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        })}`;
      } else {
        // Different year - show "DD MMM YYYY at HH:MM"
        return `${date.toLocaleDateString('en-US', { 
          day: '2-digit', 
          month: 'short',
          year: 'numeric'
        })} at ${date.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        })}`;
      }
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString; // Return original if any error occurs
    }
  }
  
  // Add this method to calculate and format the expiration date
  getExpirationDate(log: AuditLog): string {
    if (log.expirationDate) {
      return this.formatDate(log.expirationDate, false); // Don't include time
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
    
    // Format the date without time
    return this.formatDate(expirationDate.toISOString(), false);
  }
}













