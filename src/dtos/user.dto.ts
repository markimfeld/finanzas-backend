import { IUser } from '../interfaces/repositories/user.repository.interface';

export class UserDTO {
    id: string;
    name: string;
    email: string;

    constructor(user: IUser & { _id: any }) {
        this.id = user._id.toString(); // Aseguramos que sea string
        this.name = user.name;
        this.email = user.email;
    }

    static fromMany(users: (IUser & { _id: any })[]): UserDTO[] {
        return users.map(user => new UserDTO(user));
    }
}
