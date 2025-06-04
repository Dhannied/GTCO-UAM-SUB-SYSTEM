import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(employeeId: string, password: string): Promise<any>;
    login(loginDto: LoginDto): Promise<{
        user: any;
        accessToken: string;
        message: string;
    }>;
}
