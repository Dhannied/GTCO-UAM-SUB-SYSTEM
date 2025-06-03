import { ApplicationsService } from './applications.service';
import { Application } from './entities/application.entity';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
export declare class ApplicationsController {
    private readonly applicationsService;
    constructor(applicationsService: ApplicationsService);
    findAll(): Promise<Application[]>;
    findOne(id: string): Promise<Application>;
    findByUser(userId: string): Promise<Application[]>;
    create(createApplicationDto: CreateApplicationDto): Promise<Application>;
    update(id: string, updateApplicationDto: UpdateApplicationDto): Promise<Application>;
    remove(id: string): Promise<void>;
}
