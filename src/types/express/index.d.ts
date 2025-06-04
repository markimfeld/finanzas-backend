import { IUserRole } from '../../interfaces/common/roles.interface'; // opcional si tenés una interfaz de rol

declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                role: IUserRole;
            };
        }
    }
}
