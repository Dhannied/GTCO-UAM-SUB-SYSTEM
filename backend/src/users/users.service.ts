import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({ relations: ['applications'] });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ 
      where: { id },
      relations: ['applications'] 
    });
    
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    return user;
  }

  async findByEmployeeId(employeeId: string): Promise<User> {
    const user = await this.usersRepository.findOne({ 
      where: { employeeId },
      select: ['id', 'name', 'email', 'role', 'status', 'department', 'employeeId', 'password'],
      relations: ['applications'] 
    });
    
    if (!user) {
      throw new NotFoundException(`User with employee ID ${employeeId} not found`);
    }
    
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password, ...userData } = createUserDto;
    
    // Hash the password if provided
    const user = this.usersRepository.create({
      ...userData,
      password: password ? await bcrypt.hash(password, 10) : undefined
    });
    
    return this.usersRepository.save(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    await this.findOne(id); // Ensure user exists
    await this.usersRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
  }
}


