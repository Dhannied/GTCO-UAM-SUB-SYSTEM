import { UamUsersService } from './uam-users.service';
import { CreateUamUserDto } from './dto/create-uam-user.dto';
import { UpdateUamUserDto } from './dto/update-uam-user.dto';
export declare class UamUsersController {
    private readonly uamUsersService;
    constructor(uamUsersService: UamUsersService);
    create(createUamUserDto: CreateUamUserDto): Promise<import("./entities/uam-user.entity").UamUser>;
    findAll(): Promise<import("./entities/uam-user.entity").UamUser[]>;
    findOne(id: string): Promise<import("./entities/uam-user.entity").UamUser>;
    update(id: string, updateUamUserDto: UpdateUamUserDto): Promise<import("./entities/uam-user.entity").UamUser>;
    remove(id: string): Promise<void>;
    updateAllUsersLastActive(): Promise<{
        message: string;
    }>;
}
