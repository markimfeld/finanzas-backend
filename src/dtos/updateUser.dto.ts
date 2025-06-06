import { IUserRole } from '../interfaces/common/roles.interface';

export interface UpdateUserDto {
    name?: string;
    email?: string;
    role?: IUserRole;
}