import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(employeeId: string, password: string): Promise<any> {
    try {
      console.log('Attempting to validate user with employeeId:', employeeId);
      const user = await this.usersService.findByEmployeeId(employeeId);
      
      console.log('User found:', user.id, user.employeeId);
      console.log('Password exists:', !!user.password);
      
      // Check if user has password property before comparing
      if (!user.password) {
        console.log('No password found for user');
        throw new UnauthorizedException('Invalid credentials');
      }
      
      console.log('Comparing passwords...');
      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log('Password valid:', isPasswordValid);
      
      if (!isPasswordValid) {
        console.log('Password invalid');
        throw new UnauthorizedException('Invalid credentials');
      }
      
      const { password: _, ...result } = user;
      console.log('User validated successfully');
      return result;
    } catch (error) {
      console.error('Error in validateUser:', error.message, error.stack);
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async login(loginDto: LoginDto) {
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
    } catch (error) {
      console.error('Error in login:', error.message, error.stack);
      throw error;
    }
  }
}







