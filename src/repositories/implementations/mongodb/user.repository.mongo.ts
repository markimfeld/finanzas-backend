import { UserModel, UserDocument } from '../../../models/user.model';
import { IUser, IUserRepository } from '../../../interfaces/repositories/user.repository.interface';

export class UserRepositoryMongo implements IUserRepository {

    async create(user: IUser): Promise<IUser> {
        const created: UserDocument = await UserModel.create(user);
        // convertimos el Document a un objeto plano (sin métodos de Mongoose)
        const {
            _id,
            name,
            email,
            passwordHash,
            refreshToken,
            role,
            emailVerified,
            emailVerificationToken,
            emailVerificationTokenExpires,
            resetPasswordToken,
            resetPasswordTokenExpires,
            isActive
        } = created.toObject();
        return {
            _id,
            name,
            email,
            passwordHash,
            refreshToken,
            role,
            emailVerified,
            emailVerificationToken,
            emailVerificationTokenExpires,
            resetPasswordToken,
            resetPasswordTokenExpires,
            isActive
        };
    }

    async findByEmail(email: string): Promise<IUser | null> {
        const found = await UserModel.findOne({ email }).lean<IUser>().exec();
        return found ?? null;
    }

    async findByResetToken(resetPasswordToken: string): Promise<IUser | null> {
        const found = await UserModel.findOne({ resetPasswordToken }).lean<IUser>().exec();
        return found ?? null;
    }

    async findById(userId: string): Promise<IUser | null> {
        return await UserModel.findById(userId).lean<IUser>(); // Usás .lean() para devolver POJO
    }

    async findAll(): Promise<IUser[]> {
        return await UserModel.find().lean<IUser[]>();
    }

    async updateRefreshToken(userId: string, refreshToken: string): Promise<void> {
        await UserModel.findByIdAndUpdate(userId, { refreshToken });
    }

    async updateUser(id: string, data: Partial<IUser>): Promise<IUser | null> {
        return await UserModel.findByIdAndUpdate(id, data, { new: true });
    }

    async findByVerificationToken(token: string): Promise<IUser | null> {
        return await UserModel.findOne({ emailVerificationToken: token });
    }
}
