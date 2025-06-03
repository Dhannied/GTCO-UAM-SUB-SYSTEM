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
exports.AuditLogsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const audit_logs_service_1 = require("./audit-logs.service");
const audit_log_entity_1 = require("./entities/audit-log.entity");
const create_audit_log_dto_1 = require("./dto/create-audit-log.dto");
let AuditLogsController = class AuditLogsController {
    constructor(auditLogsService) {
        this.auditLogsService = auditLogsService;
    }
    findAll() {
        return this.auditLogsService.findAll();
    }
    findByEmployee(employeeId) {
        return this.auditLogsService.findByEmployee(employeeId);
    }
    create(createAuditLogDto) {
        return this.auditLogsService.create(createAuditLogDto);
    }
};
exports.AuditLogsController = AuditLogsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all audit logs' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return all audit logs', type: [audit_log_entity_1.AuditLog] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AuditLogsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('employee/:employeeId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get audit logs by employee id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return audit logs for an employee', type: [audit_log_entity_1.AuditLog] }),
    __param(0, (0, common_1.Param)('employeeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuditLogsController.prototype, "findByEmployee", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new audit log' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Audit log created successfully', type: audit_log_entity_1.AuditLog }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_audit_log_dto_1.CreateAuditLogDto]),
    __metadata("design:returntype", Promise)
], AuditLogsController.prototype, "create", null);
exports.AuditLogsController = AuditLogsController = __decorate([
    (0, swagger_1.ApiTags)('audit-logs'),
    (0, common_1.Controller)('audit-logs'),
    __metadata("design:paramtypes", [audit_logs_service_1.AuditLogsService])
], AuditLogsController);
//# sourceMappingURL=audit-logs.controller.js.map