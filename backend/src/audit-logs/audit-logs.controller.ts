import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuditLogsService } from './audit-logs.service';
import { AuditLog } from './entities/audit-log.entity';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';

@ApiTags('audit-logs')
@Controller('audit-logs')
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all audit logs' })
  @ApiResponse({ status: 200, description: 'Return all audit logs', type: [AuditLog] })
  findAll(): Promise<AuditLog[]> {
    return this.auditLogsService.findAll();
  }

  @Get('employee/:employeeId')
  @ApiOperation({ summary: 'Get audit logs by employee id' })
  @ApiResponse({ status: 200, description: 'Return audit logs for an employee', type: [AuditLog] })
  findByEmployee(@Param('employeeId') employeeId: string): Promise<AuditLog[]> {
    return this.auditLogsService.findByEmployee(employeeId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new audit log' })
  @ApiResponse({ status: 201, description: 'Audit log created successfully', type: AuditLog })
  create(@Body() createAuditLogDto: CreateAuditLogDto): Promise<AuditLog> {
    return this.auditLogsService.create(createAuditLogDto);
  }
}