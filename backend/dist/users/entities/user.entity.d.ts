import { Application } from '../../applications/entities/application.entity';
export declare class User {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    department: string;
    lastActive: Date;
    employeeId: string;
    phone: string;
    joinDate: Date;
    photo: string;
    password: string;
    applications: Application[];
    createdAt: Date;
    updatedAt: Date;
}
