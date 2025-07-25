/*
* DTO de salida para evitar
* exponer datos sensibles de USER
*/
import { IUserRole } from '../interfaces/common/roles.interface';
import { IUser } from '../interfaces/repositories/user.repository.interface';

export class UserDTO {
    id: string;
    name: string;
    email: string;
    refreshToken: string;
    role: IUserRole;
    emailVerified: boolean;
    emailVerificationToken?: string;
    emailVerificationTokenExpires?: Date;
    resetPasswordToken: string;
    resetPasswordTokenExpires: Date;
    isActive: boolean;


    constructor(user: IUser & { _id: any }) {
        this.id = user._id.toString(); // Aseguramos que sea string
        this.name = user.name;
        this.email = user.email;
        this.refreshToken = user.refreshToken;
        this.role = user.role;
        this.emailVerified = user.emailVerified;
        this.emailVerificationToken = user.emailVerificationToken;
        this.emailVerificationTokenExpires = user.emailVerificationTokenExpires;
        this.resetPasswordToken = user.resetPasswordToken;
        this.resetPasswordTokenExpires = user.resetPasswordTokenExpires;
        this.isActive = user.isActive;
    }

    static fromMany(users: (IUser & { _id: any })[]): UserDTO[] {
        return users.map(user => new UserDTO(user));
    }

    static from(user: IUser & { _id: any }): UserDTO {
        return new UserDTO(user);
    }
}
