import { Repository } from 'typeorm';
import { UamUser } from './entities/uam-user.entity';
import { CreateUamUserDto } from './dto/create-uam-user.dto';
import { UpdateUamUserDto } from './dto/update-uam-user.dto';
export declare class UamUsersService {
    private uamUsersRepository;
    constructor(uamUsersRepository: Repository<UamUser>);
    findAll(): Promise<UamUser[]>;
    findOne(id: string): Promise<UamUser>;
    findByEmail(email: string): Promise<UamUser>;
    create(createUamUserDto: CreateUamUserDto): Promise<UamUser>;
    update(id: string, updateUamUserDto: UpdateUamUserDto): Promise<UamUser>;
    remove(id: string): Promise<void>;
    validateUser(username: string, password: string): Promise<UamUser | null>;
    updateAllUsersLastActive(): Promise<void>;
}
