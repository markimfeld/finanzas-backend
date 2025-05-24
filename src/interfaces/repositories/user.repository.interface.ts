export interface IUser {
    _id: string
    name: string;
    email: string;
    passwordHash: string;
}

export interface IUserRepository {
    create(user: IUser): Promise<IUser>;
    findByEmail(email: string): Promise<IUser | null>;
    findAll(): Promise<IUser[]>;
}
