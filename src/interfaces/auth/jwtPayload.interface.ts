import { IUserRole } from "../common/roles.interface";

export interface JwtPayload {
    userId: string;
    role: IUserRole;
}
