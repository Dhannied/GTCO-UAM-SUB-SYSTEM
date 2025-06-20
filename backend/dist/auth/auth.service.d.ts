import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UamUsersService } from '../uam-users/uam-users.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private usersService;
    private uamUsersService;
    private jwtService;
    constructor(usersService: UsersService, uamUsersService: UamUsersService, jwtService: JwtService);
    validateUser(username: string, password: string): Promise<any>;
    login(loginDto: LoginDto): Promise<{
        user: any;
        accessToken: string;
        message: string;
    }>;
}
