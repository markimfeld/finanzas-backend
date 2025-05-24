import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ConflictError } from '../errors';
import { IUser, IUserRepository } from '../interfaces/repositories/user.repository.interface';

export class UserService {
    constructor(private userRepository: IUserRepository) { }

    async registerUser(userData: IUser): Promise<IUser> {
        const existing = await this.userRepository.findByEmail(userData.email);
        if (existing) {
            throw new ConflictError('Email already in use');
        }

        // Hash password antes de guardar
        userData.passwordHash = await bcrypt.hash(userData.passwordHash, 10);
        return await this.userRepository.create(userData);
    }

    async loginUser(email: string, password: string): Promise<{ access_token: string }> {
        const user = await this.userRepository.findByEmail(email);
        if (!user || !user.passwordHash) {
            throw new Error('Invalid credentials');
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET as string,
            { expiresIn: '7d' }
        );

        return { access_token: token };
    }
}
