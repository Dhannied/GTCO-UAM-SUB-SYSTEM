export interface AuditLog {
  id?: string;
  date: string;
  employee: string;
  employeeId: string;
  application: string;
  actionType: string;
  reason: string;
  officer: string;
  duration?: string;
  expirationDate?: string;
  department?: string;
}


