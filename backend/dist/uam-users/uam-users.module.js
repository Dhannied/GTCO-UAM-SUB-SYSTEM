"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UamUsersModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const uam_users_controller_1 = require("./uam-users.controller");
const uam_users_service_1 = require("./uam-users.service");
const uam_user_entity_1 = require("./entities/uam-user.entity");
let UamUsersModule = class UamUsersModule {
};
exports.UamUsersModule = UamUsersModule;
exports.UamUsersModule = UamUsersModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([uam_user_entity_1.UamUser])],
        controllers: [uam_users_controller_1.UamUsersController],
        providers: [uam_users_service_1.UamUsersService],
        exports: [uam_users_service_1.UamUsersService],
    })
], UamUsersModule);
//# sourceMappingURL=uam-users.module.js.map