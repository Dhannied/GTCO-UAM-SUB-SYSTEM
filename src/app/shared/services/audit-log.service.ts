import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuditLog } from '../models/audit-log.model';

@Injectable({
  providedIn: 'root'
})
export class AuditLogService {
  // Central store of all audit logs
  private auditLogsSubject = new BehaviorSubject<AuditLog[]>([]);
  public auditLogs$ = this.auditLogsSubject.asObservable();
  
  // Mock data for initial logs
  private initialLogs: AuditLog[] = [
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
      employee: 'Jane Smith',
      employeeId: 'EMP-10046',
      application: 'Business Intelligence',
      actionType: 'Permanent',
      reason: 'Role change',
      officer: 'Robert Wilson'
    },
    {
      id: 'log3',
      date: '05 May 2025, 11:20',
      employee: 'Michael Brown',
      employeeId: 'EMP-10047',
      application: 'Loan Management',
      actionType: 'Reactivation',
      reason: 'Access review approval',
      officer: 'Thomas Anderson'
    },
    {
      id: 'log4',
      date: '28 Apr 2025, 16:45',
      employee: 'Sarah Johnson',
      employeeId: 'EMP-10048',
      application: 'HR Management',
      actionType: 'Permanent',
      reason: 'Department transfer',
      officer: 'Robert Wilson'
    },
    {
      id: 'log5',
      date: '15 Apr 2025, 13:20',
      employee: 'Robert Wilson',
      employeeId: 'EMP-10049',
      application: 'Core Banking',
      actionType: 'Temporary',
      duration: '7 days',
      reason: 'Security policy update',
      officer: 'Sarah James'
    },
    {
      id: 'log6',
      date: '10 Apr 2025, 11:30',
      employee: 'Thomas Anderson',
      employeeId: 'EMP-10050',
      application: 'Business Intelligence',
      actionType: 'Permanent',
      reason: 'Role change',
      officer: 'Robert Wilson'
    },
    {
      id: 'log7',
      date: '05 Apr 2025, 09:15',
      employee: 'Drew Cano',
      employeeId: 'EMP-10051',
      application: 'Core Banking',
      actionType: 'Temporary',
      duration: '14 days',
      reason: 'Employee on leave',
      officer: 'Sarah James'
    },
    {
      id: 'log8',
      date: '01 Apr 2025, 14:45',
      employee: 'Orlando Diggs',
      employeeId: 'EMP-10052',
      application: 'Cash Management',
      actionType: 'Reactivation',
      reason: 'Access review approval',
      officer: 'Thomas Anderson'
    },
    {
      id: 'log9',
      date: '28 Mar 2025, 10:30',
      employee: 'Andi Lane',
      employeeId: 'EMP-10053',
      application: 'Customer Relationship',
      actionType: 'Permanent',
      reason: 'Role elimination',
      officer: 'Robert Wilson'
    },
    {
      id: 'log10',
      date: '25 Mar 2025, 15:20',
      employee: 'John Doe',
      employeeId: 'EMP-10045',
      application: 'HR Management',
      actionType: 'Temporary',
      duration: '30 days',
      reason: 'Department transfer',
      officer: 'Sarah James'
    }
  ];

  constructor() {
    // Initialize with mock data
    this.auditLogsSubject.next(this.initialLogs);
  }

  // Get all audit logs
  getAllLogs(): Observable<AuditLog[]> {
    return this.auditLogs$;
  }

  // Get logs for a specific employee
  getLogsByEmployee(employeeId: string): Observable<AuditLog[]> {
    return new Observable<AuditLog[]>(observer => {
      this.auditLogs$.subscribe(logs => {
        const filteredLogs = logs.filter(log => log.employeeId === employeeId);
        observer.next(filteredLogs);
      });
    });
  }

  // Get logs for a specific application
  getLogsByApplication(application: string): Observable<AuditLog[]> {
    return new Observable<AuditLog[]>(observer => {
      this.auditLogs$.subscribe(logs => {
        const filteredLogs = logs.filter(log => log.application === application);
        observer.next(filteredLogs);
      });
    });
  }

  // Get logs for a specific action type
  getLogsByActionType(actionType: 'Temporary' | 'Permanent' | 'Reactivation'): Observable<AuditLog[]> {
    return new Observable<AuditLog[]>(observer => {
      this.auditLogs$.subscribe(logs => {
        const filteredLogs = logs.filter(log => log.actionType === actionType);
        observer.next(filteredLogs);
      });
    });
  }

  // Get logs for a specific date range
  getLogsByDateRange(startDate: Date, endDate: Date): Observable<AuditLog[]> {
    return new Observable<AuditLog[]>(observer => {
      this.auditLogs$.subscribe(logs => {
        const filteredLogs = logs.filter(log => {
          const logDate = new Date(log.date);
          return logDate >= startDate && logDate <= endDate;
        });
        observer.next(filteredLogs);
      });
    });
  }

  // Add a new audit log
  addLog(log: AuditLog): void {
    // Generate a unique ID if not provided
    if (!log.id) {
      log.id = 'log' + (this.auditLogsSubject.value.length + 1);
    }
    
    // Format the date if it's a Date object
    if (typeof log.date === 'object' && log.date !== null) {
      log.date = this.formatDate(log.date as Date);
    }
    
    // Add the new log to the beginning of the array
    const currentLogs = this.auditLogsSubject.value;
    this.auditLogsSubject.next([log, ...currentLogs]);
  }

  // Format date to match the application's format
  private formatDate(date: Date): string {
    return date.toLocaleString('en-US', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  }

  // Get analytics data
  getAnalyticsData(): Observable<any> {
    return new Observable<any>(observer => {
      this.auditLogs$.subscribe(logs => {
        // Calculate total deactivations
        const totalDeactivations = logs.filter(log => 
          log.actionType === 'Temporary' || log.actionType === 'Permanent'
        ).length;
        
        // Calculate temporary deactivations
        const temporaryDeactivations = logs.filter(log => 
          log.actionType === 'Temporary'
        ).length;
        
        // Calculate permanent deactivations
        const permanentDeactivations = logs.filter(log => 
          log.actionType === 'Permanent'
        ).length;
        
        // Calculate deactivations by application
        const applicationCounts: {[key: string]: number} = {};
        logs.forEach(log => {
          if (log.actionType === 'Temporary' || log.actionType === 'Permanent') {
            if (!applicationCounts[log.application]) {
              applicationCounts[log.application] = 0;
            }
            applicationCounts[log.application]++;
          }
        });
        
        // Calculate deactivations by reason
        const reasonCounts: {[key: string]: number} = {};
        logs.forEach(log => {
          if (log.actionType === 'Temporary' || log.actionType === 'Permanent') {
            if (!reasonCounts[log.reason]) {
              reasonCounts[log.reason] = 0;
            }
            reasonCounts[log.reason]++;
          }
        });
        
        // Calculate deactivations by department
        // We'll need to extract department from employee data
        // For now, we'll use mock data
        const departmentData = [
          { department: 'IT', count: 0 },
          { department: 'Finance', count: 0 },
          { department: 'HR', count: 0 },
          { department: 'Operations', count: 0 },
          { department: 'Marketing', count: 0 }
        ];
        
        // Return the analytics data
        observer.next({
          totalDeactivations,
          temporaryDeactivations,
          permanentDeactivations,
          applicationCounts,
          reasonCounts,
          departmentData
        });
      });
    });
  }
}



