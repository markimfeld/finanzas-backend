/*
* DTO de entrada para crear usuario
*/
import { IUserRole } from "../interfaces/common/roles.interface";

export interface CreateUserDto {
    name: string;
    email: string;
    passwordHash: string;
    role?: IUserRole;
    emailVerified: boolean;
    emailVerificationToken?: string
    emailVerificationTokenExpires?: Date
    resetPasswordToken: string;
    resetPasswordTokenExpires: Date;
    isActive: boolean;
}