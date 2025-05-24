import { UserModel, UserDocument } from '../../models/user.model';
import { IUser, IUserRepository } from '../../interfaces/repositories/user.repository.interface';

export class UserRepositoryMongo implements IUserRepository {

    async create(user: IUser): Promise<IUser> {
        const created: UserDocument = await UserModel.create(user);
        // convertimos el Document a un objeto plano (sin métodos de Mongoose)
        const { name, email, passwordHash } = created.toObject();
        return { name, email, passwordHash };
    }

    async findByEmail(email: string): Promise<IUser | null> {
        const found = await UserModel.findOne({ email }).lean<IUser>().exec();
        return found ?? null;
    }
}
