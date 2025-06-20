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

  async generateMockEmployees(count: number = 20): Promise<User[]> {
    try {
      console.log(`Starting to generate ${count} mock employees`);
      const mockUsers: User[] = [];
      
      // Sample departments
      const departments = [
        'IT', 'Finance', 'HR', 'Marketing', 'Operations', 
        'Sales', 'Customer Service', 'Legal', 'Research', 'Development'
      ];
      
      // Sample positions
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
      
      // Sample first names
      const firstNames = [
        'John', 'Jane', 'Michael', 'Emily', 'David', 'Sarah', 'Robert', 'Jennifer', 
        'William', 'Elizabeth', 'James', 'Linda', 'Richard', 'Patricia', 'Thomas', 
        'Barbara', 'Charles', 'Mary', 'Daniel', 'Susan'
      ];
      
      // Sample last names
      const lastNames = [
        'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia', 
        'Rodriguez', 'Wilson', 'Martinez', 'Anderson', 'Taylor', 'Thomas', 'Hernandez', 
        'Moore', 'Martin', 'Jackson', 'Thompson', 'White'
      ];
      
      // Sample applications
      const applications = [
        'Core Banking', 'Finnacle', 'Gap', 'E-Document Manager', 
        'Active Directory', 'Email', 'VPN', 'CRM', 'ERP'
      ];
      
      console.log('Generating users...');
      
      // Generate random users
      for (let i = 0; i < count; i++) {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const name = `${firstName} ${lastName}`;
        
        // Add timestamp to ensure email uniqueness
        const timestamp = Date.now() + i;
        const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${timestamp}@example.com`;
        
        const department = departments[Math.floor(Math.random() * departments.length)];
        const position = positions[department][Math.floor(Math.random() * positions[department].length)];
        
        console.log(`Creating user ${i+1}/${count}: ${name}`);
        
        // Create user entity with unique employeeId
        const user = this.usersRepository.create({
          name,
          email,
          employeeId: `GTB-${timestamp.toString().substring(8)}`, // Use part of timestamp for unique ID
          department,
          position,
          status: 'Active',
          role: Math.random() > 0.8 ? 'Admin' : 'User',
          password: await bcrypt.hash('password123', 10), // Default password
        });
        
        // Save the user first
        const savedUser = await this.usersRepository.save(user);
        console.log(`Saved user: ${savedUser.name} (${savedUser.id})`);
        
        // Now create applications for the user
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
        
        // Update the user with applications
        savedUser.applications = userApps;
        await this.usersRepository.save(savedUser);
        
        mockUsers.push(savedUser);
      }
      
      console.log(`Successfully generated ${mockUsers.length} mock employees`);
      return mockUsers;
    } catch (error) {
      console.error('Error generating mock employees:', error);
      throw error;
    }
  }
}





