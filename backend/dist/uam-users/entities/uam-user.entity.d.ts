import { Application } from '../../applications/entities/application.entity';
export declare class UamUser {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    department: string;
    position: string;
    lastActive: Date;
    employeeId: string;
    phone: string;
    photo: string;
    password: string;
    applications: Application[];
    createdAt: Date;
    updatedAt: Date;
}
