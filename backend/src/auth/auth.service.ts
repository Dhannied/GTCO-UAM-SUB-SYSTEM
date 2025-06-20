import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UamUsersService } from '../uam-users/uam-users.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private uamUsersService: UamUsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    try {
      const uamUser = await this.uamUsersService.validateUser(username, password);
      if (uamUser) {
        return { ...uamUser, userType: 'uam' };
      }
      return null; // Return null explicitly when user not found
    } catch (error) {
      console.error('Error validating user:', error.message);
      return null; // Return null on error
    }
  }

  async login(loginDto: LoginDto) {
    try {
      console.log('Login attempt with:', loginDto.email);
      const user = await this.validateUser(loginDto.email, loginDto.password);
      
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }
      
      const payload = { 
        sub: user.id, 
        email: user.email,
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
    } catch (error) {
      console.error('Error in login:', error.message, error.stack);
      throw error;
    }
  }
}












