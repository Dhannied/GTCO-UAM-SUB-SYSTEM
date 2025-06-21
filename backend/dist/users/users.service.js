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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
const bcrypt = require("bcrypt");
let UsersService = class UsersService {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async findAll() {
        return this.usersRepository.find({ relations: ['applications'] });
    }
    async findOne(id) {
        const user = await this.usersRepository.findOne({
            where: { id },
            relations: ['applications']
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }
    async findByEmployeeId(employeeId) {
        const user = await this.usersRepository.findOne({
            where: { employeeId },
            select: ['id', 'name', 'email', 'role', 'status', 'department', 'employeeId', 'password'],
            relations: ['applications']
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with employee ID ${employeeId} not found`);
        }
        return user;
    }
    async create(createUserDto) {
        const { password, ...userData } = createUserDto;
        const user = this.usersRepository.create({
            ...userData,
            password: password ? await bcrypt.hash(password, 10) : undefined
        });
        return this.usersRepository.save(user);
    }
    async update(id, updateUserDto) {
        await this.findOne(id);
        await this.usersRepository.update(id, updateUserDto);
        return this.findOne(id);
    }
    async remove(id) {
        const user = await this.findOne(id);
        await this.usersRepository.remove(user);
    }
    async generateMockEmployees(count = 20) {
        try {
            console.log(`Starting to generate ${count} mock employees with Nigerian names`);
            const mockUsers = [];
            const departments = [
                'IT', 'Finance', 'HR', 'Marketing', 'Operations',
                'Sales', 'Customer Service', 'Legal', 'Research', 'Development'
            ];
            const positions = {
                'IT': ['Systems Administrator', 'Network Engineer', 'Software Developer', 'IT Manager', 'Database Administrator'],
                'Finance': ['Financial Analyst', 'Accountant', 'Finance Manager', 'Auditor', 'Treasurer'],
                'HR': ['HR Specialist', 'Recruiter', 'HR Manager', 'Training Coordinator', 'Compensation Analyst'],
                'Marketing': ['Marketing Specialist', 'Brand Manager', 'Digital Marketer', 'Marketing Director', 'Content Creator'],
                'Operations': ['Operations Manager', 'Process Analyst', 'Quality Control', 'Logistics Coordinator', 'Supply Chain Manager'],
                'Sales': ['Sales Representative', 'Account Manager', 'Sales Director', 'Business Developer', 'Sales Analyst'],
                'Customer Service': ['Customer Service Representative', 'Support Specialist', 'Customer Success Manager', 'Client Relations'],
                'Legal': ['Legal Advisor', 'Compliance Officer', 'Legal Counsel', 'Contract Manager', 'Paralegal'],
                'Research': ['Research Analyst', 'Data Scientist', 'Research Director', 'Lab Technician', 'Research Coordinator'],
                'Development': ['Software Engineer', 'Product Manager', 'UX Designer', 'QA Engineer', 'DevOps Engineer']
            };
            const firstNames = [
                'Adebayo', 'Chioma', 'Oluwaseun', 'Ngozi', 'Emeka', 'Folake', 'Chinedu', 'Yewande',
                'Olumide', 'Amara', 'Tunde', 'Nneka', 'Obinna', 'Aisha', 'Segun', 'Zainab', 'Chidi',
                'Funmilayo', 'Ikenna', 'Blessing'
            ];
            const lastNames = [
                'Okafor', 'Adeyemi', 'Nwachukwu', 'Ojo', 'Okonkwo', 'Afolayan', 'Eze', 'Adebisi',
                'Nnamdi', 'Olawale', 'Igwe', 'Balogun', 'Uche', 'Adesina', 'Okoli', 'Ogunleye',
                'Chukwu', 'Adeleke', 'Njoku', 'Ibrahim'
            ];
            const applications = [
                'Core Banking', 'Finnacle', 'Gap', 'E-Document Manager',
                'Active Directory', 'Email', 'VPN', 'CRM', 'ERP'
            ];
            console.log('Generating users with Nigerian names...');
            for (let i = 0; i < count; i++) {
                const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
                const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
                const name = `${firstName} ${lastName}`;
                const timestamp = Date.now() + i;
                const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${timestamp}@gtbank.com`;
                const department = departments[Math.floor(Math.random() * departments.length)];
                const position = positions[department][Math.floor(Math.random() * positions[department].length)];
                console.log(`Creating user ${i + 1}/${count}: ${name}`);
                const user = this.usersRepository.create({
                    name,
                    email,
                    employeeId: `GTB-${timestamp.toString().substring(8)}`,
                    department,
                    position,
                    status: 'Active',
                    role: Math.random() > 0.8 ? 'Admin' : 'User',
                    password: await bcrypt.hash('password123', 10),
                });
                const savedUser = await this.usersRepository.save(user);
                console.log(`Saved user: ${savedUser.name} (${savedUser.id})`);
                const userApps = [];
                const numApps = 3 + Math.floor(Math.random() * 4);
                const shuffledApps = [...applications].sort(() => 0.5 - Math.random());
                for (let j = 0; j < numApps; j++) {
                    userApps.push({
                        name: shuffledApps[j],
                        status: 'Active',
                        accessLevel: Math.random() > 0.3 ? 'Full Access' : 'Read Only',
                        lastUsed: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000))
                    });
                }
                savedUser.applications = userApps;
                await this.usersRepository.save(savedUser);
                mockUsers.push(savedUser);
            }
            console.log(`Successfully generated ${mockUsers.length} mock employees with Nigerian names`);
            return mockUsers;
        }
        catch (error) {
            console.error('Error generating mock employees:', error);
            throw error;
        }
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map