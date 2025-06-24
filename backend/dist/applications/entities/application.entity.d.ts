export declare enum ApplicationStatus {
    ACTIVE = "Active",
    INACTIVE = "Inactive",
    PENDING = "Pending"
}
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
    status: ApplicationStatus;
    deactivationType: 'Temporary' | 'Permanent';
    startDate: Date;
    endDate: Date;
    user: User;
    userId: string;
    uamUser: UamUser;
    createdAt: Date;
    updatedAt: Date;
}
