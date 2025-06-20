import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UamUser } from './entities/uam-user.entity';
import { CreateUamUserDto } from './dto/create-uam-user.dto';
import { UpdateUamUserDto } from './dto/update-uam-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UamUsersService {
  constructor(
    @InjectRepository(UamUser)
    private uamUsersRepository: Repository<UamUser>,
  ) {}

  async findAll(): Promise<UamUser[]> {
    console.log('Finding all UAM users');
    
    const users = await this.uamUsersRepository.find({ 
      relations: ['applications'],
      select: ['id', 'name', 'email', 'role', 'status', 'department', 'lastActive', 'employeeId', 'photo']
    });
    
    console.log(`Found ${users.length} users`);
    
    // Debug: Check lastActive values
    users.forEach(user => {
      console.log(`User ${user.name} lastActive:`, user.lastActive);
      
      // If no lastActive, set it to current time
      if (!user.lastActive) {
        console.log(`Setting lastActive for ${user.name}`);
        user.lastActive = new Date();
        
        // Update the database
        this.uamUsersRepository.update(user.id, { lastActive: user.lastActive })
          .then(() => console.log(`Updated lastActive for ${user.name}`))
          .catch(error => console.error(`Error updating lastActive for ${user.name}:`, error));
      }
    });
    
    return users;
  }

  async findOne(id: string): Promise<UamUser> {
    const user = await this.uamUsersRepository.findOne({ 
      where: { id },
      relations: ['applications'] 
    });
    
    if (!user) {
      throw new NotFoundException(`UAM User with ID ${id} not found`);
    }
    
    return user;
  }

  async findByEmail(email: string): Promise<UamUser> {
    const user = await this.uamUsersRepository.findOne({ 
      where: { email },
      select: ['id', 'name', 'email', 'role', 'status', 'department', 'password'],
      relations: ['applications'] 
    });
    
    if (!user) {
      throw new NotFoundException(`UAM User with email ${email} not found`);
    }
    
    return user;
  }

  async create(createUamUserDto: CreateUamUserDto): Promise<UamUser> {
    const { password, ...userData } = createUamUserDto;
    
    // Hash the password
    const user = this.uamUsersRepository.create({
      ...userData,
      password: await bcrypt.hash(password, 10)
    });
    
    return this.uamUsersRepository.save(user);
  }

  async update(id: string, updateUamUserDto: UpdateUamUserDto): Promise<UamUser> {
    const user = await this.findOne(id);
    
    // If password is being updated, hash it
    if (updateUamUserDto.password) {
      updateUamUserDto.password = await bcrypt.hash(updateUamUserDto.password, 10);
    }
    
    await this.uamUsersRepository.update(id, updateUamUserDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.uamUsersRepository.remove(user);
  }

  async validateUser(username: string, password: string): Promise<UamUser | null> {
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
          // Only update lastActive if we have a valid user ID
          if (user.id) {
            const now = new Date();
            console.log(`Updating lastActive for user ${user.id} to ${now.toISOString()}`);
            
            await this.uamUsersRepository.update(user.id, { lastActive: now });
            
            // Verify the update
            const updatedUser = await this.uamUsersRepository.findOne({
              where: { id: user.id },
              select: ['id', 'lastActive']
            });
            
            console.log(`Updated user lastActive: ${updatedUser?.lastActive}`);
            
            // Update the user object with the new lastActive time
            user.lastActive = now;
          } else {
            console.warn('Cannot update lastActive: user.id is undefined');
          }
        } catch (updateError) {
          // Log the error but continue with authentication
          console.error(`Error updating lastActive: ${updateError.message}`);
          // This shouldn't prevent login if password is valid
        }
        
        // Don't return the password
        const { password, ...result } = user;
        console.log(`Returning user data:`, result);
        return result as UamUser;
      }
      
      return null;
    } catch (error) {
      console.error(`Error in validateUser: ${error.message}`);
      return null;
    }
  }

  // This method can be called from a controller endpoint to update all users' lastActive
  async updateAllUsersLastActive(): Promise<void> {
    try {
      const users = await this.uamUsersRepository.find();
      console.log(`Updating lastActive for ${users.length} users`);
      
      for (const user of users) {
        // Set a random lastActive time within the last 30 days
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
    } catch (error) {
      console.error('Error updating users:', error.message);
      throw error;
    }
  }
}








