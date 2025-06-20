import { CreateUamUserDto } from './create-uam-user.dto';
declare const UpdateUamUserDto_base: import("@nestjs/common").Type<Partial<CreateUamUserDto>>;
export declare class UpdateUamUserDto extends UpdateUamUserDto_base {
    status?: string;
    lastActive?: Date;
}
export {};
