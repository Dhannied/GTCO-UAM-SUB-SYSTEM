import { User } from '../../users/entities/user.entity';
import { UamUser } from '../../uam-users/entities/uam-user.entity';
export declare class Application {
    id: string;
    name: string;
    platform: string;
    accessLevel: string;
    lastUsed: Date;
    icon: string;
    iconBg: string;
    status: string;
    deactivationType: string;
    user: User;
    uamUser: UamUser;
    createdAt: Date;
    updatedAt: Date;
}
