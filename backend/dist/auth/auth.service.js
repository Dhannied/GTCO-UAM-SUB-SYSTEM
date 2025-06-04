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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const bcrypt = require("bcrypt");
let AuthService = class AuthService {
    constructor(usersService, jwtService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
    }
    async validateUser(employeeId, password) {
        try {
            console.log('Attempting to validate user with employeeId:', employeeId);
            const user = await this.usersService.findByEmployeeId(employeeId);
            console.log('User found:', user.id, user.employeeId);
            console.log('Password exists:', !!user.password);
            if (!user.password) {
                console.log('No password found for user');
                throw new common_1.UnauthorizedException('Invalid credentials');
            }
            console.log('Comparing passwords...');
            const isPasswordValid = await bcrypt.compare(password, user.password);
            console.log('Password valid:', isPasswordValid);
            if (!isPasswordValid) {
                console.log('Password invalid');
                throw new common_1.UnauthorizedException('Invalid credentials');
            }
            const { password: _, ...result } = user;
            console.log('User validated successfully');
            return result;
        }
        catch (error) {
            console.error('Error in validateUser:', error.message, error.stack);
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
    }
    async login(loginDto) {
        try {
            console.log('Login attempt with:', loginDto.employeeId);
            const user = await this.validateUser(loginDto.employeeId, loginDto.password);
            const payload = {
                sub: user.id,
                employeeId: user.employeeId,
                role: user.role
            };
            console.log('Creating JWT token for user:', user.id);
            const token = this.jwtService.sign(payload);
            console.log('Token created successfully');
            return {
                user,
                accessToken: token,
                message: 'Login successful',
            };
        }
        catch (error) {
            console.error('Error in login:', error.message, error.stack);
            throw error;
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map