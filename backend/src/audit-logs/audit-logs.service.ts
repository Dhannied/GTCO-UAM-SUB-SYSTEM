import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuditLogsService {
  findOne(id: string) {
    throw new Error('Method not implemented.');
  }
  getAnalytics() {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(AuditLog)
    private auditLogsRepository: Repository<AuditLog>,
    private usersService: UsersService
  ) {}

  async findAll(startDate: string, endDate: string): Promise<AuditLog[]> {
    return this.auditLogsRepository.find({
      order: { date: 'DESC' }
    });
  }

  async findByEmployee(employeeId: string): Promise<AuditLog[]> {
    return this.auditLogsRepository.find({
      where: { employeeId },
      order: { date: 'DESC' }
    });
  }

  async create(createAuditLogDto: CreateAuditLogDto): Promise<AuditLog> {
    const auditLog = this.auditLogsRepository.create(createAuditLogDto);
    return this.auditLogsRepository.save(auditLog);
  }

  async generateMockAuditLogs(count: number = 30): Promise<AuditLog[]> {
    // Get all users to generate logs for
    const users = await this.usersService.findAll();
    
    if (users.length === 0) {
      throw new BadRequestException('No users found. Please generate mock users first.');
    }
    
    // Sample applications
    const applications = [
      'Core Banking', 'Finnacle', 'Gap', 'E-Document Manager', 
      'Active Directory', 'Email', 'VPN', 'CRM', 'ERP'
    ];
    
    // Sample action types with weighted distribution
    const actionTypes = [
      'Temporary', 'Temporary', 'Temporary', 'Permanent', 'Permanent', 'Reactivation'
    ];
    
    // Sample reasons
    const temporaryReasons = [
      'Employee on leave', 'Role change', 'Department transfer', 
      'System maintenance', 'Security policy update', 'Temporary project reassignment'
    ];
    
    const permanentReasons = [
      'Employee termination', 'Role elimination', 'System decommissioning', 
      'Security violation', 'Compliance requirement', 'Application replacement'
    ];
    
    const reactivationReasons = [
      'Employee returned from leave', 'Role restored', 'Access requirement', 
      'Issue resolved', 'Security clearance granted'
    ];
    
    // Sample officers
    const officers = ['Admin User', 'Security Officer', 'IT Manager', 'HR Manager'];
    
    // Generate random audit logs
    const mockLogs: AuditLog[] = [];
    
    for (let i = 0; i < count; i++) {
      // Random date within the last 90 days
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 90));
      
      // Random user
      const user = users[Math.floor(Math.random() * users.length)];
      
      // Random action type
      const actionType = actionTypes[Math.floor(Math.random() * actionTypes.length)];
      
      // Random application
      const application = applications[Math.floor(Math.random() * applications.length)];
      
      // Random reason based on action type
      let reason;
      if (actionType === 'Temporary') {
        reason = temporaryReasons[Math.floor(Math.random() * temporaryReasons.length)];
      } else if (actionType === 'Permanent') {
        reason = permanentReasons[Math.floor(Math.random() * permanentReasons.length)];
      } else {
        reason = reactivationReasons[Math.floor(Math.random() * reactivationReasons.length)];
      }
      
      // Random officer
      const officer = officers[Math.floor(Math.random() * officers.length)];
      
      // Create audit log entity
      const log = this.auditLogsRepository.create({
        date: date,
        employee: user.name,
        employeeId: user.employeeId, // Use the business employeeId
        department: user.department,
        application: application,
        actionType: actionType,
        reason: reason,
        officer: officer,
        duration: actionType === 'Temporary' ? `${[7, 14, 30, 60, 90][Math.floor(Math.random() * 5)]} days` : undefined
      });
      
      await this.auditLogsRepository.save(log);
      mockLogs.push(log);
    }
    
    return mockLogs;
  }
}

