import { User } from '../../users/entities/user.entity';
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
    createdAt: Date;
    updatedAt: Date;
}
