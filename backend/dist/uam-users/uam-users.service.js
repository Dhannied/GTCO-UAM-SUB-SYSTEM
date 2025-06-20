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
exports.UamUsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const uam_user_entity_1 = require("./entities/uam-user.entity");
const bcrypt = require("bcrypt");
let UamUsersService = class UamUsersService {
    constructor(uamUsersRepository) {
        this.uamUsersRepository = uamUsersRepository;
    }
    async findAll() {
        console.log('Finding all UAM users');
        const users = await this.uamUsersRepository.find({
            relations: ['applications'],
            select: ['id', 'name', 'email', 'role', 'status', 'department', 'lastActive', 'employeeId', 'photo']
        });
        console.log(`Found ${users.length} users`);
        users.forEach(user => {
            console.log(`User ${user.name} lastActive:`, user.lastActive);
            if (!user.lastActive) {
                console.log(`Setting lastActive for ${user.name}`);
                user.lastActive = new Date();
                this.uamUsersRepository.update(user.id, { lastActive: user.lastActive })
                    .then(() => console.log(`Updated lastActive for ${user.name}`))
                    .catch(error => console.error(`Error updating lastActive for ${user.name}:`, error));
            }
        });
        return users;
    }
    async findOne(id) {
        const user = await this.uamUsersRepository.findOne({
            where: { id },
            relations: ['applications']
        });
        if (!user) {
            throw new common_1.NotFoundException(`UAM User with ID ${id} not found`);
        }
        return user;
    }
    async findByEmail(email) {
        const user = await this.uamUsersRepository.findOne({
            where: { email },
            select: ['id', 'name', 'email', 'role', 'status', 'department', 'password'],
            relations: ['applications']
        });
        if (!user) {
            throw new common_1.NotFoundException(`UAM User with email ${email} not found`);
        }
        return user;
    }
    async create(createUamUserDto) {
        const { password, ...userData } = createUamUserDto;
        const user = this.uamUsersRepository.create({
            ...userData,
            password: await bcrypt.hash(password, 10)
        });
        return this.uamUsersRepository.save(user);
    }
    async update(id, updateUamUserDto) {
        const user = await this.findOne(id);
        if (updateUamUserDto.password) {
            updateUamUserDto.password = await bcrypt.hash(updateUamUserDto.password, 10);
        }
        await this.uamUsersRepository.update(id, updateUamUserDto);
        return this.findOne(id);
    }
    async remove(id) {
        const user = await this.findOne(id);
        await this.uamUsersRepository.remove(user);
    }
    async validateUser(username, password) {
        try {
            console.log(`Validating user: ${username}`);
            const user = await this.uamUsersRepository.findOne({
                where: { email: username },
                select: ['id', 'name', 'email', 'role', 'status', 'department', 'password', 'lastActive']
            });
            if (!user) {
                console.log(`User not found: ${username}`);
                return null;
            }
            console.log(`Found user: ${username}, validating password...`);
            const isPasswordValid = await bcrypt.compare(password, user.password);
            console.log(`Password validation result: ${isPasswordValid}`);
            if (isPasswordValid) {
                try {
                    if (user.id) {
                        const now = new Date();
                        console.log(`Updating lastActive for user ${user.id} to ${now.toISOString()}`);
                        await this.uamUsersRepository.update(user.id, { lastActive: now });
                        const updatedUser = await this.uamUsersRepository.findOne({
                            where: { id: user.id },
                            select: ['id', 'lastActive']
                        });
                        console.log(`Updated user lastActive: ${updatedUser?.lastActive}`);
                        user.lastActive = now;
                    }
                    else {
                        console.warn('Cannot update lastActive: user.id is undefined');
                    }
                }
                catch (updateError) {
                    console.error(`Error updating lastActive: ${updateError.message}`);
                }
                const { password, ...result } = user;
                console.log(`Returning user data:`, result);
                return result;
            }
            return null;
        }
        catch (error) {
            console.error(`Error in validateUser: ${error.message}`);
            return null;
        }
    }
    async updateAllUsersLastActive() {
        try {
            const users = await this.uamUsersRepository.find();
            console.log(`Updating lastActive for ${users.length} users`);
            for (const user of users) {
                const daysAgo = Math.floor(Math.random() * 30);
                const hoursAgo = Math.floor(Math.random() * 24);
                const minutesAgo = Math.floor(Math.random() * 60);
                const lastActive = new Date();
                lastActive.setDate(lastActive.getDate() - daysAgo);
                lastActive.setHours(lastActive.getHours() - hoursAgo);
                lastActive.setMinutes(lastActive.getMinutes() - minutesAgo);
                await this.uamUsersRepository.update(user.id, { lastActive });
                console.log(`Updated lastActive for user ${user.id} to ${lastActive.toISOString()}`);
            }
            console.log('All users updated successfully');
        }
        catch (error) {
            console.error('Error updating users:', error.message);
            throw error;
        }
    }
};
exports.UamUsersService = UamUsersService;
exports.UamUsersService = UamUsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(uam_user_entity_1.UamUser)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UamUsersService);
//# sourceMappingURL=uam-users.service.js.map