import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AuditLogsService } from './audit-logs.service';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuditLog } from './entities/audit-log.entity';

@ApiTags('audit-logs')
@Controller('audit-logs')
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new audit log entry' })
  create(@Body() createAuditLogDto: CreateAuditLogDto) {
    return this.auditLogsService.create(createAuditLogDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all audit logs' })
  findAll(@Query('startDate') startDate?: string, @Query('endDate') endDate?: string) {
    return this.auditLogsService.findAll(startDate, endDate);
  }

  @Get('analytics')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get analytics data' })
  getAnalytics() {
    return this.auditLogsService.getAnalytics();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get audit log by ID' })
  findOne(@Param('id') id: string) {
    return this.auditLogsService.findOne(id);
  }

  @Get('employee/:employeeId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get audit logs for a specific employee' })
  @ApiResponse({ status: 200, description: 'Returns audit logs for the specified employee' })
  findByEmployee(@Param('employeeId') employeeId: string) {
    return this.auditLogsService.findByEmployee(employeeId);
  }

  @Post('generate-mock')
  @ApiOperation({ summary: 'Generate mock audit logs' })
  @ApiResponse({ status: 201, description: 'Mock audit logs created successfully', type: [AuditLog] })
  generateMockAuditLogs(@Body() options: { count?: number } = {}): Promise<AuditLog[]> {
    const count = options.count || 30; // Default to 30 if not specified
    return this.auditLogsService.generateMockAuditLogs(count);
  }
}


