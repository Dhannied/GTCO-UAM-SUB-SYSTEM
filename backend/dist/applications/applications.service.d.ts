import { Repository } from 'typeorm';
import { Application } from './entities/application.entity';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
export declare class ApplicationsService {
    private applicationsRepository;
    constructor(applicationsRepository: Repository<Application>);
    findAll(): Promise<Application[]>;
    findOne(id: string): Promise<Application>;
    findByUser(userId: string): Promise<Application[]>;
    create(createApplicationDto: CreateApplicationDto): Promise<Application>;
    update(id: string, updateApplicationDto: UpdateApplicationDto): Promise<Application>;
    remove(id: string): Promise<void>;
}
