export interface CreateUserDto {
    name: string;
    email: string;
    passwordHash: string;
    role: string
}