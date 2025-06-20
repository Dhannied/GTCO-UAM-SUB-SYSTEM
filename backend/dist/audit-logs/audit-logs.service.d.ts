import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { UsersService } from '../users/users.service';
export declare class AuditLogsService {
    private auditLogsRepository;
    private usersService;
    findOne(id: string): void;
    getAnalytics(): void;
    constructor(auditLogsRepository: Repository<AuditLog>, usersService: UsersService);
    findAll(startDate: string, endDate: string): Promise<AuditLog[]>;
    findByEmployee(employeeId: string): Promise<AuditLog[]>;
    create(createAuditLogDto: CreateAuditLogDto): Promise<AuditLog>;
    generateMockAuditLogs(count?: number): Promise<AuditLog[]>;
}
