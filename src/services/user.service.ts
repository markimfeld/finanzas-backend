import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
// errors
import { BadRequestError, ConflictError } from '../errors';
// errors messages
import { MESSAGES } from '../constants/messages';
// repositories
import { IUser, IUserRepository } from '../interfaces/repositories/user.repository.interface';
// dtos
import { CreateUserDto } from '../dtos/createUser.dto';

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

    async loginUser(email: string, password: string): Promise<{ user: IUser, token: string }> {
        const user = await this.userRepository.findByEmail(email);
        if (!user || !user.passwordHash) {
            throw new BadRequestError(MESSAGES.ERROR.USER.NOT_FOUND);
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            throw new BadRequestError(MESSAGES.ERROR.AUTH.INVALID_CREDENTIALS);
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET as string,
            { expiresIn: '7d' }
        );

        return { user, token };
    }

    async getAllUsers(): Promise<IUser[]> {
        return await this.userRepository.findAll();
    }
}
