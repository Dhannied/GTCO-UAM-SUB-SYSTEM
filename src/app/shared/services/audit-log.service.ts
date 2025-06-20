import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { AuditLog } from '../models/audit-log.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuditLogService {
  private apiUrl = `${environment.apiUrl}/audit-logs`;
  private logsSubject = new BehaviorSubject<AuditLog[]>([]);
  public logs$ = this.logsSubject.asObservable();
  
  // Local cache of logs
  private logs: AuditLog[] = [];
  
  constructor(private http: HttpClient) {
    // Load logs when service is initialized
    this.refreshLogs();
  }
  
  // Method to refresh logs from the server
  refreshLogs(): void {
    this.getAllLogs().subscribe();
  }
  
  getAllLogs(): Observable<AuditLog[]> {
    return this.http.get<AuditLog[]>(this.apiUrl).pipe(
      tap(logs => {
        console.log(`Fetched ${logs.length} audit logs from API`);
        this.logs = logs;
        this.logsSubject.next(logs);
      }),
      catchError(error => {
        console.error('Error fetching audit logs', error);
        return of(this.logs); // Return cached logs on error
      })
    );
  }
  
  getLogsByEmployee(employeeId: string): Observable<AuditLog[]> {
    console.log(`Fetching audit logs for employee: ${employeeId}`);
    return this.http.get<AuditLog[]>(`${this.apiUrl}/employee/${employeeId}`).pipe(
      tap(logs => console.log(`Fetched ${logs.length} audit logs for employee ${employeeId}`)),
      catchError(error => {
        console.error(`Error fetching audit logs for employee ${employeeId}`, error);
        // If API fails, filter from local cache
        const filteredLogs = this.logs.filter(log => log.employeeId === employeeId);
        return of(filteredLogs);
      })
    );
  }
  
  // Add a log entry
  addLog(log: AuditLog): Observable<AuditLog> {
    console.log('Adding audit log:', log);
    
    // Add to the API
    return this.http.post<AuditLog>(`${this.apiUrl}`, log).pipe(
      tap(savedLog => {
        console.log('Audit log saved to API:', savedLog);
        
        // Also update the local cache
        const updatedLogs = [savedLog, ...this.logs];
        this.logsSubject.next(updatedLogs);
        this.logs = updatedLogs;
      }),
      catchError(error => {
        console.error('Error saving audit log to API:', error);
        
        // Still update local cache even if API fails
        const tempLog = { ...log, id: 'temp-' + new Date().getTime() };
        const updatedLogs = [tempLog, ...this.logs];
        this.logsSubject.next(updatedLogs);
        this.logs = updatedLogs;
        
        // Return the log with a temporary ID
        return of(tempLog);
      })
    );
  }

  getAnalyticsData() {
    // Return an observable with analytics data
    return this.logs$.pipe(
      map(logs => {
        // Process logs to create analytics data
        // This is a placeholder implementation
        return {
          totalDeactivations: logs.length,
          byApplication: this.getDeactivationsByApplication(logs),
          byActionType: this.getDeactivationsByActionType(logs),
          byReason: this.getDeactivationsByReason(logs)
        };
      })
    );
  }

  getLogsByDateRange(startDate: Date, endDate: Date) {
    // Return logs filtered by date range
    return this.logs$.pipe(
      map(logs => logs.filter(log => {
        const logDate = new Date(log.date);
        return logDate >= startDate && logDate <= endDate;
      }))
    );
  }

  private getDeactivationsByApplication(logs: AuditLog[]) {
    const result: {[key: string]: number} = {};
    logs.forEach(log => {
      if (log.application) {
        if (!result[log.application]) {
          result[log.application] = 0;
        }
        result[log.application]++;
      }
    });
    return result;
  }

  private getDeactivationsByActionType(logs: AuditLog[]) {
    const result: {[key: string]: number} = {
      'Temporary': 0,
      'Permanent': 0,
      'Reactivation': 0
    };
    logs.forEach(log => {
      if (log.actionType && result.hasOwnProperty(log.actionType)) {
        result[log.actionType]++;
      }
    });
    return result;
  }

  private getDeactivationsByReason(logs: AuditLog[]) {
    const result: {[key: string]: number} = {};
    logs.forEach(log => {
      if (log.reason) {
        if (!result[log.reason]) {
          result[log.reason] = 0;
        }
        result[log.reason]++;
      }
    });
    return result;
  }
}



