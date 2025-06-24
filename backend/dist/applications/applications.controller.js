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
exports.ApplicationsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const applications_service_1 = require("./applications.service");
const application_entity_1 = require("./entities/application.entity");
const create_application_dto_1 = require("./dto/create-application.dto");
const update_application_dto_1 = require("./dto/update-application.dto");
const deactivate_application_dto_1 = require("./dto/deactivate-application.dto");
let ApplicationsController = class ApplicationsController {
    constructor(applicationsService) {
        this.applicationsService = applicationsService;
    }
    findAll() {
        return this.applicationsService.findAll();
    }
    findOne(id) {
        return this.applicationsService.findOne(id);
    }
    findByUser(userId) {
        return this.applicationsService.findByUser(userId);
    }
    create(createApplicationDto) {
        return this.applicationsService.create(createApplicationDto);
    }
    update(id, updateApplicationDto) {
        return this.applicationsService.update(id, updateApplicationDto);
    }
    deactivateByUserAndName(userId, name, dto) {
        return this.applicationsService.deactivateByUserAndName(userId, name, dto);
    }
    remove(id) {
        return this.applicationsService.remove(id);
    }
};
exports.ApplicationsController = ApplicationsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all applications' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Return all applications',
        type: [application_entity_1.Application],
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ApplicationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get an application by ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Return the application',
        type: application_entity_1.Application,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Application not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ApplicationsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get applications by user ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Return applications for a user',
        type: [application_entity_1.Application],
    }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ApplicationsController.prototype, "findByUser", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new application' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Application created successfully',
        type: application_entity_1.Application,
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_application_dto_1.CreateApplicationDto]),
    __metadata("design:returntype", Promise)
], ApplicationsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update an application' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Application updated successfully',
        type: application_entity_1.Application,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Application not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_application_dto_1.UpdateApplicationDto]),
    __metadata("design:returntype", Promise)
], ApplicationsController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)('user/:userId/name/:name/deactivate'),
    (0, swagger_1.ApiOperation)({ summary: 'Deactivate a specific user application by name' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Application deactivated successfully',
        type: application_entity_1.Application,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Application not found' }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Param)('name')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, deactivate_application_dto_1.DeactivateApplicationDto]),
    __metadata("design:returntype", Promise)
], ApplicationsController.prototype, "deactivateByUserAndName", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete an application' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Application deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Application not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ApplicationsController.prototype, "remove", null);
exports.ApplicationsController = ApplicationsController = __decorate([
    (0, swagger_1.ApiTags)('applications'),
    (0, common_1.Controller)('applications'),
    __metadata("design:paramtypes", [applications_service_1.ApplicationsService])
], ApplicationsController);
//# sourceMappingURL=applications.controller.js.map