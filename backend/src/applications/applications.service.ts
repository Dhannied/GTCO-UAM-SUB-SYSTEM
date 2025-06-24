import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application, ApplicationStatus } from './entities/application.entity';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { DeactivateApplicationDto } from './dto/deactivate-application.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private applicationsRepository: Repository<Application>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<Application[]> {
    return this.applicationsRepository.find({ relations: ['user'] });
  }

  async findOne(id: string): Promise<Application> {
    const application = await this.applicationsRepository.findOne({
      where: { id },
      relations: ['user'],
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
    const { userId, status, ...rest } = createApplicationDto;

    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const application = this.applicationsRepository.create({
      ...rest,
      user,
      status: status as ApplicationStatus, // ✅ Fix type error here
    });

    return this.applicationsRepository.save(application);
  }

  async deactivateByUserAndName(
    userId: string,
    name: string,
    dto: DeactivateApplicationDto,
  ): Promise<Application> {
    const application = await this.applicationsRepository.findOne({
      where: {
        user: { id: userId },
        name,
      },
      relations: ['user'],
    });

    if (!application) {
      throw new NotFoundException(
        `Application ${name} for user ${userId} not found`,
      );
    }

    application.status = dto.status as ApplicationStatus;
    application.deactivationType = dto.deactivationType;
    application.startDate = dto.startDate ? new Date(dto.startDate) : null;
    application.endDate = dto.endDate ? new Date(dto.endDate) : null;

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
