import { CreateUserDto } from "../../dtos/createUser.dto";
import { IUserRole } from "../common/roles.interface";

export interface IUser {
    _id: string;
    name: string;
    email: string;
    passwordHash: string;
    refreshToken: string;
    role: IUserRole;
    emailVerified: boolean;
    emailVerificationToken?: string
    emailVerificationTokenExpires?: Date
}

export interface IUserRepository {
    create(user: CreateUserDto): Promise<IUser>;
    findByEmail(email: string): Promise<IUser | null>;
    findById(userId: string): Promise<IUser | null>;
    findAll(): Promise<IUser[]>;
    updateRefreshToken(userId: string, refreshToken: string): Promise<void>;
    updateUser(id: string, data: Partial<IUser>): Promise<IUser | null>;
    findByVerificationToken(token: string): Promise<IUser | null>;
}
