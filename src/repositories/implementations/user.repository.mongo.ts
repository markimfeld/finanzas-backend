import { UserModel, UserDocument } from '../../models/user.model';
import { IUser, IUserRepository } from '../../interfaces/repositories/user.repository.interface';

export class UserRepositoryMongo implements IUserRepository {

    async create(user: IUser): Promise<IUser> {
        const created: UserDocument = await UserModel.create(user);
        // convertimos el Document a un objeto plano (sin métodos de Mongoose)
        const { _id, name, email, passwordHash, refreshToken } = created.toObject();
        return { _id, name, email, passwordHash, refreshToken };
    }

    async findByEmail(email: string): Promise<IUser | null> {
        const found = await UserModel.findOne({ email }).lean<IUser>().exec();
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
}
