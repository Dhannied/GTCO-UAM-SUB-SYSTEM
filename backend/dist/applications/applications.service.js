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
exports.ApplicationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const application_entity_1 = require("./entities/application.entity");
const user_entity_1 = require("../users/entities/user.entity");
let ApplicationsService = class ApplicationsService {
    constructor(applicationsRepository, usersRepository) {
        this.applicationsRepository = applicationsRepository;
        this.usersRepository = usersRepository;
    }
    async findAll() {
        return this.applicationsRepository.find({ relations: ['user'] });
    }
    async findOne(id) {
        const application = await this.applicationsRepository.findOne({
            where: { id },
            relations: ['user'],
        });
        if (!application) {
            throw new common_1.NotFoundException(`Application with ID ${id} not found`);
        }
        return application;
    }
    async findByUser(userId) {
        return this.applicationsRepository.find({
            where: { user: { id: userId } },
        });
    }
    async create(createApplicationDto) {
        const { userId, status, ...rest } = createApplicationDto;
        const user = await this.usersRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${userId} not found`);
        }
        const application = this.applicationsRepository.create({
            ...rest,
            user,
            status: status,
        });
        return this.applicationsRepository.save(application);
    }
    async deactivateByUserAndName(userId, name, dto) {
        const application = await this.applicationsRepository.findOne({
            where: {
                user: { id: userId },
                name,
            },
            relations: ['user'],
        });
        if (!application) {
            throw new common_1.NotFoundException(`Application ${name} for user ${userId} not found`);
        }
        application.status = dto.status;
        application.deactivationType = dto.deactivationType;
        application.startDate = dto.startDate ? new Date(dto.startDate) : null;
        application.endDate = dto.endDate ? new Date(dto.endDate) : null;
        return this.applicationsRepository.save(application);
    }
    async update(id, updateApplicationDto) {
        const application = await this.findOne(id);
        Object.assign(application, updateApplicationDto);
        return this.applicationsRepository.save(application);
    }
    async remove(id) {
        const result = await this.applicationsRepository.delete(id);
        if (result.affected === 0) {
            throw new common_1.NotFoundException(`Application with ID ${id} not found`);
        }
    }
};
exports.ApplicationsService = ApplicationsService;
exports.ApplicationsService = ApplicationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(application_entity_1.Application)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ApplicationsService);
//# sourceMappingURL=applications.service.js.map