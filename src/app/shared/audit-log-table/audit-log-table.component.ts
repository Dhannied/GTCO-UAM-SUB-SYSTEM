import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditLog } from '../models/audit-log.model';

@Component({
  selector: 'app-audit-log-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './audit-log-table.component.html',
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
  
  // Add this method to calculate and format the expiration date
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










