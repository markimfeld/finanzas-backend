import { IUser } from '../interfaces/repositories/user.repository.interface';
import { UserDTO } from './user.dto';

export class AuthResponseDTO {
    user: UserDTO;
    access_token: string;

    constructor(user: IUser & { _id: any }, token: string) {
        this.user = new UserDTO(user);
        this.access_token = token;
    }

    static from(user: IUser & { _id: any }, token: string): AuthResponseDTO {
        return new AuthResponseDTO(user, token);
    }
}
