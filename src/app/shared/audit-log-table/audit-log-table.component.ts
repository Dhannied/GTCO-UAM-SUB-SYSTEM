import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface AuditLog {
  id?: string;
  date: string;
  employee?: string;
  employeeId?: string;
  application: string;
  actionType: 'Temporary' | 'Permanent' | 'Reactivation';
  duration?: string;
  reason: string;
  officer: string;
}

@Component({
  selector: 'app-audit-log-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './audit-log-table.component.html',
  styleUrls: ['./audit-log-table.component.css']
})
export class AuditLogTableComponent implements OnInit, OnChanges {
  @Input() logs: AuditLog[] = [];
  @Input() showEmployee: boolean = true;
  @Input() showReason: boolean = true;
  @Input() showDuration: boolean = true;
  @Input() showPagination: boolean = false;
  @Input() itemsPerPage: number = 10;
  @Input() currentPage: number = 1;
  @Input() totalItems: number = 0;
  @Input() maxHeight: string = '400px'; // Default max height
  @Input() userId: string = ''; // Add userId input
  @Input() showOfficer: boolean = true;
  
  paginatedLogs: AuditLog[] = [];
  
  Math = Math; // For template calculations
  
  constructor() { }
  
  ngOnInit(): void {
    this.updatePaginatedLogs();
  }
  
  // Add ngOnChanges to detect when inputs change
  ngOnChanges(changes: SimpleChanges): void {
    console.log('Audit log table inputs changed:', changes);
    if (changes['logs'] || changes['currentPage'] || changes['itemsPerPage']) {
      this.updatePaginatedLogs();
    }
  }
  
  // Add pagination methods
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedLogs();
    }
  }
  
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedLogs();
    }
  }
  
  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }
  
  private getMockLogsForUser(userId: string): AuditLog[] {
    // Mock implementation - return some sample logs for the user
    return [
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
        application: 'Customer Relationship',
        actionType: 'Reactivation',
        reason: 'Access review approval',
        officer: 'Thomas Anderson'
      }
    ];
  }
  
  private updatePaginatedLogs(): void {
    console.log('Updating paginated logs with:', this.logs.length, 'logs');
    if (this.showPagination) {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      this.paginatedLogs = this.logs.slice(startIndex, startIndex + this.itemsPerPage);
    } else {
      this.paginatedLogs = this.logs;
    }
    console.log('Paginated logs updated:', this.paginatedLogs.length, 'logs');
  }
}






