import { AuditLogsService } from './audit-logs.service';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { AuditLog } from './entities/audit-log.entity';
export declare class AuditLogsController {
    private readonly auditLogsService;
    constructor(auditLogsService: AuditLogsService);
    create(createAuditLogDto: CreateAuditLogDto): Promise<AuditLog>;
    findAll(startDate?: string, endDate?: string): Promise<AuditLog[]>;
    getAnalytics(): void;
    findOne(id: string): void;
    findByEmployee(employeeId: string): Promise<AuditLog[]>;
    generateMockAuditLogs(options?: {
        count?: number;
    }): Promise<AuditLog[]>;
}
