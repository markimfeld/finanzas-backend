// errors
import { BadRequestError, ConflictError, NotFoundError, UnauthorizedError } from '../errors';
// errors messages
import { MESSAGES } from '../constants/messages';
// repositories
import { IUser, IUserRepository } from '../interfaces/repositories/user.repository.interface';
// dtos
import { CreateUserDto } from '../dtos/createUser.dto';
import { UpdateUserDto } from '../dtos/updateUser.dto';
//utils
import { generateAccessToken } from '../utils/token.util';
import { sendEmailVerification, sendResetPasswordEmail } from '../utils/email.util';
import Hasher from '../utils/hash.util';
// roles interface
import { IUserRole } from '../interfaces/common/roles.interface';

import crypto from 'crypto';

const hasher = Hasher.getInstance();

export class UserService {
    constructor(private userRepository: IUserRepository) { }

    async registerUser(userData: CreateUserDto): Promise<IUser> {
        const existing = await this.userRepository.findByEmail(userData.email);
        if (existing) {
            throw new ConflictError(MESSAGES.ERROR.USER.ALREADY_EXISTS);
        }

        const token = crypto.randomBytes(32).toString('hex');
        const tokenExpires = new Date(Date.now() + 1000 * 60 * 60); // 1 hora

        // Hash password antes de guardar
        userData.passwordHash = await hasher.hash(userData.passwordHash);
        const user = await this.userRepository.create({
            ...userData,
            emailVerified: false,
            emailVerificationToken: token,
            emailVerificationTokenExpires: tokenExpires
        });

        await sendEmailVerification(user.email, token);

        return user;
    }

    async loginUser(email: string, password: string): Promise<{ user: IUser, access_token: string }> {
        const user = await this.userRepository.findByEmail(email);

        if (!user || !user.passwordHash) {
            throw new BadRequestError(MESSAGES.ERROR.USER.NOT_FOUND);
        }

        if (!user?.isActive) {
            throw new UnauthorizedError(MESSAGES.ERROR.USER.NOT_FOUND);
        }

        const isMatch = await hasher.compare(password, user.passwordHash);
        if (!isMatch) {
            throw new BadRequestError(MESSAGES.ERROR.AUTH.INVALID_CREDENTIALS);
        }

        if (!user.emailVerified) {
            throw new UnauthorizedError(MESSAGES.ERROR.AUTH.EMAIL_NOT_VERIFIED);
        }

        const access_token = generateAccessToken({ userId: user._id, role: user.role as IUserRole });

        return { user, access_token };
    }

    async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new NotFoundError(MESSAGES.ERROR.USER.NOT_FOUND);
        }

        const isMatch = await hasher.compare(currentPassword, user.passwordHash);
        if (!isMatch) {
            throw new UnauthorizedError(MESSAGES.ERROR.AUTH.INCORRECT_CURRENT_PASSWORD);
        }

        const hashedNewPassword = await hasher.hash(newPassword);
        await this.userRepository.updateUser(userId, { passwordHash: hashedNewPassword });
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

        // Validar email solo si viene en el payload
        if (userData.email) {
            const currentUser = await this.userRepository.findById(id);
            if (!currentUser) {
                throw new NotFoundError(MESSAGES.ERROR.USER.NOT_FOUND);
            }

            // Si el email cambió, validar que no esté en uso por otro usuario
            if (userData.email !== currentUser.email) {
                const existingUser = await this.userRepository.findByEmail(userData.email);
                if (existingUser && existingUser._id.toString() !== id) {
                    throw new ConflictError(MESSAGES.ERROR.USER.ALREADY_EXISTS);
                }
            }
        }

        // Actualizar usuario
        const user = await this.userRepository.updateUser(id, userData);

        if (!user) {
            throw new NotFoundError(MESSAGES.ERROR.USER.NOT_FOUND);
        }

        return user;
    }

    async verifyEmailToken(token: string): Promise<IUser | null> {
        const user = await this.userRepository.findByVerificationToken(token);

        if (
            !user ||
            !user.emailVerificationTokenExpires ||
            new Date(user.emailVerificationTokenExpires) < new Date()
        ) {
            return null;
        }

        user.emailVerified = true;
        user.emailVerificationToken = '';
        user.emailVerificationTokenExpires = new Date(Date.now() - 1000 * 60 * 60);
        return await this.userRepository.updateUser(user._id, user);
    }

    async resendVerificationEmail(email: string): Promise<IUser | null> {
        const user = await this.userRepository.findByEmail(email);

        if (!user) {
            throw new NotFoundError(MESSAGES.ERROR.USER.NOT_FOUND);
        }

        if (user.emailVerified) {
            throw new ConflictError(MESSAGES.ERROR.AUTH.ALREADY_VERIFIED);
        }

        const token = crypto.randomBytes(32).toString('hex');
        const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hora

        user.emailVerificationToken = token;
        user.emailVerificationTokenExpires = expires;
        await this.userRepository.updateUser(user._id, user);

        await sendEmailVerification(user.email, token);

        return user;
    }

    async forgotPassword(email: string): Promise<IUser | void> {
        const user = await this.userRepository.findByEmail(email);
        if (!user) return; // Por seguridad, no lanzar error

        const token = crypto.randomBytes(32).toString('hex');
        const expires = new Date(Date.now() + 1000 * 60 * 30); // 30 minutos

        await this.userRepository.updateUser(user._id, {
            resetPasswordToken: token,
            resetPasswordTokenExpires: expires,
        });

        await sendResetPasswordEmail(user.email, token);

        return user;
    }

    async resetPassword(resetPasswordToken: string, newPassword: string): Promise<IUser | null> {
        const user = await this.userRepository.findByResetToken(resetPasswordToken);
        if (
            !user ||
            !user.resetPasswordTokenExpires ||
            user.resetPasswordTokenExpires < new Date()
        ) {
            throw new BadRequestError(MESSAGES.ERROR.AUTH.INVALID_OR_EXPIRED_TOKEN);
        }

        const hashedPassword = await hasher.hash(newPassword);

        const userUpdated = await this.userRepository.updateUser(user._id, {
            passwordHash: hashedPassword,
            resetPasswordToken: '',
            resetPasswordTokenExpires: new Date(Date.now() - 1000),
        });

        return userUpdated;
    }

    async deactivateUser(userId: string): Promise<IUser> {
        const user = await this.userRepository.findById(userId);
        if (!user) throw new NotFoundError(MESSAGES.ERROR.USER.NOT_FOUND);

        user.isActive = false;

        const updatedUser = await this.userRepository.updateUser(userId, user);

        if (!updatedUser) throw new NotFoundError(MESSAGES.ERROR.USER.NOT_FOUND);

        return updatedUser;
    }

    async activateUser(userId: string): Promise<IUser> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new NotFoundError(MESSAGES.ERROR.USER.NOT_FOUND);
        }

        user.isActive = true;
        const updatedUser = await this.userRepository.updateUser(userId, user);

        if (!updatedUser) throw new NotFoundError(MESSAGES.ERROR.USER.NOT_FOUND);

        return updatedUser;
    }

    async updateUserProfile(userId: string, data: Partial<IUser>): Promise<IUser> {
        // const allowedFields = ['name', 'avatar', 'bio'];
        // const updateData: Partial<IUser> = {};

        // for (const field of allowedFields) {
        //     if (field in data) {
        //         updateData[field] = data[field];
        //     }
        // }
        const updatedUser = await this.userRepository.updateUser(userId, data);

        if (!updatedUser) {
            throw new NotFoundError(MESSAGES.ERROR.USER.NOT_FOUND);
        }

        // return this.userRepository.updateById(userId, updateData);
        return updatedUser;
    }
}
