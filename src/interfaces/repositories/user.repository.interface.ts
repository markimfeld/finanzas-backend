import { CreateUserDto } from "../../dtos/createUser.dto";

export interface IUser {
    _id: string
    name: string;
    email: string;
    passwordHash: string;
}

export interface IUserRepository {
    create(user: CreateUserDto): Promise<IUser>;
    findByEmail(email: string): Promise<IUser | null>;
    findAll(): Promise<IUser[]>;
}
