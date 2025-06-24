import { Repository } from 'typeorm';
import { Application } from './entities/application.entity';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { DeactivateApplicationDto } from './dto/deactivate-application.dto';
import { User } from 'src/users/entities/user.entity';
export declare class ApplicationsService {
    private applicationsRepository;
    private usersRepository;
    constructor(applicationsRepository: Repository<Application>, usersRepository: Repository<User>);
    findAll(): Promise<Application[]>;
    findOne(id: string): Promise<Application>;
    findByUser(userId: string): Promise<Application[]>;
    create(createApplicationDto: CreateApplicationDto): Promise<Application>;
    deactivateByUserAndName(userId: string, name: string, dto: DeactivateApplicationDto): Promise<Application>;
    update(id: string, updateApplicationDto: UpdateApplicationDto): Promise<Application>;
    remove(id: string): Promise<void>;
}
