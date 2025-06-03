import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
export declare class AuditLogsService {
    private auditLogsRepository;
    constructor(auditLogsRepository: Repository<AuditLog>);
    findAll(): Promise<AuditLog[]>;
    findByEmployee(employeeId: string): Promise<AuditLog[]>;
    create(createAuditLogDto: CreateAuditLogDto): Promise<AuditLog>;
}
