import bcrypt from 'bcrypt';
// errors
import { BadRequestError, ConflictError, NotFoundError } from '../errors';
// errors messages
import { MESSAGES } from '../constants/messages';
// repositories
import { IUser, IUserRepository } from '../interfaces/repositories/user.repository.interface';
// dtos
import { CreateUserDto } from '../dtos/createUser.dto';
import { UpdateUserDto } from '../dtos/updateUser.dto';
//utils
import { generateAccessToken } from '../utils/token.util';
// roles interface
import { IUserRole } from '../interfaces/common/roles.interface';

export class UserService {
    constructor(private userRepository: IUserRepository) { }

    async registerUser(userData: CreateUserDto): Promise<IUser> {
        const existing = await this.userRepository.findByEmail(userData.email);
        if (existing) {
            throw new ConflictError(MESSAGES.ERROR.USER.ALREADY_EXISTS);
        }

        // Hash password antes de guardar
        userData.passwordHash = await bcrypt.hash(userData.passwordHash, 10);
        return await this.userRepository.create(userData);
    }

    async loginUser(email: string, password: string): Promise<{ user: IUser, access_token: string }> {
        const user = await this.userRepository.findByEmail(email);
        if (!user || !user.passwordHash) {
            throw new BadRequestError(MESSAGES.ERROR.USER.NOT_FOUND);
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            throw new BadRequestError(MESSAGES.ERROR.AUTH.INVALID_CREDENTIALS);
        }

        const access_token = generateAccessToken({ userId: user._id, role: user.role as IUserRole });

        return { user, access_token };
    }

    async getAllUsers(): Promise<IUser[]> {
        return await this.userRepository.findAll();
    }

    async getUserById(userId: string): Promise<IUser> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new NotFoundError(MESSAGES.ERROR.USER.NOT_FOUND);
        }
        return user;
    }

    async updateRefreshToken(userId: string, refreshToken: string): Promise<void> {
        await this.userRepository.updateRefreshToken(userId, refreshToken);
    }

    async removeRefreshToken(userId: string): Promise<void> {
        await this.userRepository.updateRefreshToken(userId, '');
    }

    async updateUser(id: string, userData: UpdateUserDto): Promise<IUser> {

        // validate that cannot edit email if the email provided is already in use.
        if (userData.email) {
            const existingUser = await this.userRepository.findByEmail(userData.email);
            if (existingUser && existingUser._id !== id) {
                throw new ConflictError(MESSAGES.ERROR.USER.ALREADY_EXISTS);
            }
        }

        const user = await this.userRepository.updateUser(id, userData);

        if (!user) {
            throw new NotFoundError(MESSAGES.ERROR.USER.NOT_FOUND);
        }

        return user;
    }
}
