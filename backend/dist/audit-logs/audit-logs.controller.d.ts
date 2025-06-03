import { AuditLogsService } from './audit-logs.service';
import { AuditLog } from './entities/audit-log.entity';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
export declare class AuditLogsController {
    private readonly auditLogsService;
    constructor(auditLogsService: AuditLogsService);
    findAll(): Promise<AuditLog[]>;
    findByEmployee(employeeId: string): Promise<AuditLog[]>;
    create(createAuditLogDto: CreateAuditLogDto): Promise<AuditLog>;
}
