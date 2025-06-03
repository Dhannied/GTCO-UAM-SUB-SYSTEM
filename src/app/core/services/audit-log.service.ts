import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface AuditLog {
  id: string;
  employee: string;
  employeeId: string;
  application: string;
  actionType: string;
  reason: string;
  officer: string;
  date: Date;
}

export interface CreateAuditLogDto {
  employee: string;
  employeeId: string;
  application: string;
  actionType: string;
  reason: string;
  officer: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuditLogService {
  constructor(private apiService: ApiService) {}

  getAuditLogs(): Observable<AuditLog[]> {
    return this.apiService.get<AuditLog[]>('audit-logs');
  }

  getEmployeeAuditLogs(employeeId: string): Observable<AuditLog[]> {
    return this.apiService.get<AuditLog[]>(`audit-logs/employee/${employeeId}`);
  }

  createAuditLog(auditLog: CreateAuditLogDto): Observable<AuditLog> {
    return this.apiService.post<AuditLog>('audit-logs', auditLog);
  }
}