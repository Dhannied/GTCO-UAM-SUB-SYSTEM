export interface AuditLog {
  id?: string;
  date: string;
  employee: string;
  employeeId: string;
  application: string;
  actionType: string;
  duration?: string;
  reason: string;
  officer: string;
  expirationDate?: string;
}




