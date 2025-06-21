"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLogsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const audit_log_entity_1 = require("./entities/audit-log.entity");
const common_2 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
let AuditLogsService = class AuditLogsService {
    findOne(id) {
        throw new Error('Method not implemented.');
    }
    getAnalytics() {
        throw new Error('Method not implemented.');
    }
    constructor(auditLogsRepository, usersService) {
        this.auditLogsRepository = auditLogsRepository;
        this.usersService = usersService;
    }
    async findAll(startDate, endDate) {
        return this.auditLogsRepository.find({
            order: { date: 'DESC' }
        });
    }
    async findByEmployee(employeeId) {
        return this.auditLogsRepository.find({
            where: { employeeId },
            order: { date: 'DESC' }
        });
    }
    async create(createAuditLogDto) {
        const auditLog = this.auditLogsRepository.create(createAuditLogDto);
        return this.auditLogsRepository.save(auditLog);
    }
    async generateMockAuditLogs(count = 30) {
        const users = await this.usersService.findAll();
        if (users.length === 0) {
            throw new common_2.BadRequestException('No users found. Please generate mock users first.');
        }
        const applications = [
            'Core Banking', 'Finnacle', 'Gap', 'E-Document Manager',
            'Active Directory', 'Email', 'VPN', 'CRM', 'ERP'
        ];
        const actionTypes = [
            'Temporary', 'Temporary', 'Temporary', 'Permanent', 'Permanent', 'Reactivation'
        ];
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
        const officers = ['Adebayo Okonkwo', 'Chioma Eze', 'Oluwaseun Adeyemi', 'Emeka Nwachukwu', 'Folake Balogun'];
        const mockLogs = [];
        for (let i = 0; i < count; i++) {
            const date = new Date();
            date.setDate(date.getDate() - Math.floor(Math.random() * 90));
            const user = users[Math.floor(Math.random() * users.length)];
            const actionType = actionTypes[Math.floor(Math.random() * actionTypes.length)];
            const application = applications[Math.floor(Math.random() * applications.length)];
            let reason;
            if (actionType === 'Temporary') {
                reason = temporaryReasons[Math.floor(Math.random() * temporaryReasons.length)];
            }
            else if (actionType === 'Permanent') {
                reason = permanentReasons[Math.floor(Math.random() * permanentReasons.length)];
            }
            else {
                reason = reactivationReasons[Math.floor(Math.random() * reactivationReasons.length)];
            }
            const officer = officers[Math.floor(Math.random() * officers.length)];
            const log = this.auditLogsRepository.create({
                date: date,
                employee: user.name,
                employeeId: user.employeeId,
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
};
exports.AuditLogsService = AuditLogsService;
exports.AuditLogsService = AuditLogsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(audit_log_entity_1.AuditLog)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        users_service_1.UsersService])
], AuditLogsService);
//# sourceMappingURL=audit-logs.service.js.map