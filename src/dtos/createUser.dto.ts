import { IUserRole } from "../interfaces/common/roles.interface";

export interface CreateUserDto {
    name: string;
    email: string;
    passwordHash: string;
    role?: IUserRole
}