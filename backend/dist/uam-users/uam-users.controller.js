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
exports.UamUsersController = void 0;
const common_1 = require("@nestjs/common");
const uam_users_service_1 = require("./uam-users.service");
const create_uam_user_dto_1 = require("./dto/create-uam-user.dto");
const update_uam_user_dto_1 = require("./dto/update-uam-user.dto");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let UamUsersController = class UamUsersController {
    constructor(uamUsersService) {
        this.uamUsersService = uamUsersService;
    }
    create(createUamUserDto) {
        return this.uamUsersService.create(createUamUserDto);
    }
    findAll() {
        return this.uamUsersService.findAll();
    }
    findOne(id) {
        return this.uamUsersService.findOne(id);
    }
    update(id, updateUamUserDto) {
        return this.uamUsersService.update(id, updateUamUserDto);
    }
    remove(id) {
        return this.uamUsersService.remove(id);
    }
    async updateAllUsersLastActive() {
        await this.uamUsersService.updateAllUsersLastActive();
        return { message: 'All users updated successfully' };
    }
};
exports.UamUsersController = UamUsersController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new UAM user' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'The UAM user has been successfully created.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_uam_user_dto_1.CreateUamUserDto]),
    __metadata("design:returntype", void 0)
], UamUsersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get all UAM users' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UamUsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get a UAM user by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UamUsersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Update a UAM user' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_uam_user_dto_1.UpdateUamUserDto]),
    __metadata("design:returntype", void 0)
], UamUsersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a UAM user' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UamUsersController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('update-last-active'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UamUsersController.prototype, "updateAllUsersLastActive", null);
exports.UamUsersController = UamUsersController = __decorate([
    (0, swagger_1.ApiTags)('uam-users'),
    (0, common_1.Controller)('uam-users'),
    __metadata("design:paramtypes", [uam_users_service_1.UamUsersService])
], UamUsersController);
//# sourceMappingURL=uam-users.controller.js.map