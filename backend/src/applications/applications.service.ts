import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from './entities/application.entity';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private applicationsRepository: Repository<Application>,
  ) {}

  async findAll(): Promise<Application[]> {
    return this.applicationsRepository.find({ relations: ['user'] });
  }

  async findOne(id: string): Promise<Application> {
    const application = await this.applicationsRepository.findOne({
      where: { id },
      relations: ['user']
    });
    
    if (!application) {
      throw new NotFoundException(`Application with ID ${id} not found`);
    }
    
    return application;
  }

  async findByUser(userId: string): Promise<Application[]> {
    return this.applicationsRepository.find({
      where: { user: { id: userId } },
    });
  }

  async create(createApplicationDto: CreateApplicationDto): Promise<Application> {
    const application = this.applicationsRepository.create(createApplicationDto);
    return this.applicationsRepository.save(application);
  }

  async update(id: string, updateApplicationDto: UpdateApplicationDto): Promise<Application> {
    const application = await this.findOne(id);
    
    Object.assign(application, updateApplicationDto);
    
    return this.applicationsRepository.save(application);
  }

  async remove(id: string): Promise<void> {
    const result = await this.applicationsRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`Application with ID ${id} not found`);
    }
  }
}